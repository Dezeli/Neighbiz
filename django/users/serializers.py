from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import UserImage, EmailVerification
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

import random
import boto3
from botocore.exceptions import ClientError
from datetime import timedelta
from decouple import config
from urllib.parse import urlparse

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "name", "email", "phone_number", "password", "image_url"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"validators": []},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("이미 사용 중인 사용자명입니다.")
        return value

    def validate_email(self, value):
        valid_time = timezone.now() - timedelta(minutes=10)

        if not EmailVerification.objects.filter(
            email=value, is_verified=True, created_at__gte=valid_time
        ).exists():
            raise serializers.ValidationError(
                "이메일 인증이 완료되지 않았거나 만료되었습니다."
            )
        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("이미 등록된 전화번호입니다.")
        return value

    def validate_image_url(self, value):
        s3_key = self._extract_s3_key(value)

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        try:
            response = s3.head_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=s3_key
            )
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                raise serializers.ValidationError(
                    "S3에 해당 이미지가 존재하지 않습니다."
                )
            raise serializers.ValidationError("S3 검증 중 오류가 발생했습니다.")

        size = response.get("ContentLength", 0)
        content_type = response.get("ContentType", "")

        if content_type not in ["image/jpeg", "image/png"]:
            raise serializers.ValidationError(
                "이미지 형식은 JPEG 또는 PNG만 허용됩니다."
            )

        if size > 5 * 1024 * 1024:
            raise serializers.ValidationError("이미지 크기는 5MB를 초과할 수 없습니다.")

        return value

    def _extract_s3_key(self, url):
        parsed = urlparse(url)
        return parsed.path.lstrip("/")

    def create(self, validated_data):
        image_url = validated_data.pop("image_url")
        user = User.objects.create_user(**validated_data)
        UserImage.objects.create(user=user, image_url=image_url)
        EmailVerification.objects.filter(email=user.email).delete()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        token["is_verified"] = user.is_verified
        return token

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed("아이디 또는 비밀번호가 올바르지 않습니다.")
        data["username"] = self.user.username
        data["role"] = self.user.role
        data["is_verified"] = self.user.is_verified
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("해당 이메일로 등록된 사용자가 없습니다.")
        return value

    def save(self):
        user = self.user
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"{config('FRONTEND_URL')}/reset-password-confirm?uid={uidb64}&token={token}"

        subject = "[Neighviz] 비밀번호 재설정 링크 안내"
        message = f"""
                {user.name}님,

                아래 링크를 클릭하여 비밀번호를 재설정하세요:

                {reset_link}

                이 링크는 일정 시간 후 만료됩니다.
                """
        send_mail(
            subject=subject.strip(),
            message=message.strip(),
            from_email=config("DEFAULT_FROM_EMAIL"),
            recipient_list=[user.email],
            fail_silently=False,
        )


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")
        new_password = attrs.get("new_password")

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            self.user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("유효하지 않은 링크입니다.")

        if not default_token_generator.check_token(self.user, token):
            raise serializers.ValidationError("만료되었거나 유효하지 않은 토큰입니다.")

        if len(new_password) < 8:
            raise serializers.ValidationError("비밀번호는 최소 8자 이상이어야 합니다.")

        return attrs

    def save(self):
        self.user.set_password(self.validated_data["new_password"])
        self.user.save()


class PasswordResetTokenValidateSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("유효하지 않은 링크입니다.")

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("만료되었거나 유효하지 않은 토큰입니다.")

        return attrs


class FindIDSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone_number = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        phone_number = attrs.get("phone_number")

        try:
            self.user = User.objects.get(email=email, phone_number=phone_number)
        except User.DoesNotExist:
            raise serializers.ValidationError("일치하는 사용자가 없습니다.")

        return attrs

    def get_masked_username(self):
        username = self.user.username
        if len(username) <= 4:
            return username[0] + "*" * (len(username) - 1)

        prefix = username[:3]
        suffix = username[-1]
        masked = prefix + "*" * (len(username) - 4) + suffix
        return masked


class EmailVerificationSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        from users.models import User

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("이미 가입된 이메일입니다.")
        return value

    def save(self):
        email = self.validated_data["email"]
        code = self._generate_code()

        EmailVerification.objects.filter(email=email).delete()

        EmailVerification.objects.create(
            email=email,
            code=code,
            is_verified=False,
        )

        subject = "Neighviz 이메일 인증 코드"
        message = f"""
            Neighviz 회원가입을 위한 인증 코드입니다.
            인증 코드는 다음과 같습니다:

            {code}

            이 코드는 3분간 유효합니다.
        """.strip()

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=config("DEFAULT_FROM_EMAIL"),
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception:
            raise serializers.ValidationError("이메일 전송 중 오류가 발생했습니다.")

    def _generate_code(self):
        return str(random.randint(100000, 999999))


class EmailVerificationConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        code = attrs.get("code")

        try:
            record = EmailVerification.objects.filter(email=email).latest("created_at")
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError("인증 요청이 존재하지 않습니다.")

        if record.is_verified:
            raise serializers.ValidationError("이미 인증이 완료된 이메일입니다.")

        if timezone.now() - record.created_at > timedelta(minutes=3):
            raise serializers.ValidationError("인증 코드가 만료되었습니다.")

        if record.code != code:
            raise serializers.ValidationError("인증 코드가 일치하지 않습니다.")

        self.record = record
        return attrs

    def save(self):
        self.record.is_verified = True
        self.record.save()


class PresignedURLRequestSerializer(serializers.Serializer):
    filename = serializers.CharField()
    content_type = serializers.CharField()


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "name",
            "email",
            "role",
            "is_verified",
        ]
