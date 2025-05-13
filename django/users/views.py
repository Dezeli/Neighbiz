from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import SignupSerializer, CustomTokenObtainPairSerializer, PasswordResetRequestSerializer

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
