import random
from rest_framework import serializers

class PhoneVerifySendSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

    def generate_code(self):
        return str(random.randint(100000, 999999))


class PhoneVerifyConfirmSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    verification_code = serializers.CharField(max_length=6)
