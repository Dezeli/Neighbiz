from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from users.serializers import SignupSerializer, CustomTokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenObtainPairView


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
