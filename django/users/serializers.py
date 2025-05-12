from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.models import User, UserImage


class SignupSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'phone_number', 'password', 'image_url']
        extra_kwargs = {
            'password': {'write_only': True}
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