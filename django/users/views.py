from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import *

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "회원가입 성공",
                "data": None
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed as e:
            return Response({
                "success": False,
                "message": str(e),
                "data": None
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "success": True,
            "message": "로그인에 성공했습니다.",
            "data": serializer.validated_data
        }, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "비밀번호 재설정 링크를 이메일로 전송했습니다.",
                "data": None
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "비밀번호가 성공적으로 변경되었습니다.",
                "data": None
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetTokenValidateView(APIView):
    def get(self, request):
        data = {
            'uid': request.GET.get("uid"),
            'token': request.GET.get("token")
        }
        serializer = PasswordResetTokenValidateSerializer(data=data)

        if serializer.is_valid():
            return Response({
                "success": True,
                "message": "유효한 링크입니다.",
                "data": None
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "유효하지 않은 링크입니다.",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class FindIDView(APIView):
    def post(self, request):
        serializer = FindIDSerializer(data=request.data)
        if serializer.is_valid():
            masked_username = serializer.get_masked_username()
            return Response({
                "success": True,
                "message": "일치하는 계정이 확인되었습니다.",
                "data": {
                    "username": masked_username
                }
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationSendView(APIView):
    def post(self, request):
        serializer = EmailVerificationSendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "이메일로 인증 코드를 전송했습니다.",
                "data": None
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    

class EmailVerificationConfirmView(APIView):
    def post(self, request):
        serializer = EmailVerificationConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "이메일 인증이 완료되었습니다.",
                "data": None
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "입력값 오류",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
