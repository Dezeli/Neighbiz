from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.serializers import SignupSerializer


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"success": True, "message": "회원가입 성공", "data": None}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "입력값 오류", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
