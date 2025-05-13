from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import User, UserImage
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from decouple import config


class SignupSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'phone_number', 'password', 'image_url']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': []},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("이미 사용 중인 사용자명입니다.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("이미 등록된 이메일입니다.")
        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("이미 등록된 전화번호입니다.")
        return value

    def create(self, validated_data):
        image_url = validated_data.pop('image_url')
        user = User.objects.create_user(**validated_data)
        UserImage.objects.create(user=user, image_url=image_url)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['is_verified'] = user.is_verified
        return token

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed("아이디 또는 비밀번호가 올바르지 않습니다.")
        data['username'] = self.user.username
        data['role'] = self.user.role
        data['is_verified'] = self.user.is_verified
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

        reset_link = f"{config('FRONTEND_URL')}/reset-password?uid={uidb64}&token={token}"

        subject = "[서비스명] 비밀번호 재설정 링크 안내"
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
            fail_silently=False
        )