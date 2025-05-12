from rest_framework import serializers
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
