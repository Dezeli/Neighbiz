from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView

from .models import ConsumerAuth
from .serializers import PhoneVerifySendSerializer, PhoneVerifyConfirmSerializer
from utils.sms import send_sms
from utils.response import success_response, error_response



class PhoneVerifySendView(APIView):
    def post(self, request):
        serializer = PhoneVerifySendSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("입력값 오류", serializer.errors)

        phone = serializer.validated_data['phone_number']
        code = serializer.generate_code()
        expired_at = timezone.now() + timedelta(minutes=5)

        ConsumerAuth.objects.create(
            phone_number=phone,
            verification_code=code,
            expired_at=expired_at,
        )

        if send_sms(phone, code):
            return success_response("인증번호가 전송되었습니다.")
        else:
            return error_response("SMS 전송에 실패했습니다.", status_code=500)




class PhoneVerifyConfirmView(APIView):
    def post(self, request):
        serializer = PhoneVerifyConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("입력값 오류", serializer.errors)

        phone = serializer.validated_data['phone_number']
        code = serializer.validated_data['verification_code']

        auth = (
            ConsumerAuth.objects
            .filter(phone_number=phone, verification_code=code)
            .order_by("-created_at")
            .first()
        )

        if not auth:
            return error_response("잘못된 인증번호입니다.")

        if auth.is_verified:
            return success_response("이미 인증된 번호입니다.")

        if auth.is_expired():
            return error_response("인증번호가 만료되었습니다.")

        auth.is_verified = True
        auth.verified_at = timezone.now()
        auth.save()

        return success_response("인증에 성공했습니다.")
