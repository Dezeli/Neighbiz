from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import *
from utils.response import success_response, error_response

from django.conf import settings
import boto3
import uuid
from botocore.exceptions import ClientError


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response("회원가입 성공", status=status.HTTP_201_CREATED)
        return error_response("입력값 오류", serializer.errors)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed as e:
            return error_response(str(e), status=status.HTTP_401_UNAUTHORIZED)

        return success_response("로그인에 성공했습니다.", serializer.validated_data)


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response("비밀번호 재설정 링크를 이메일로 전송했습니다.")
        return error_response("입력값 오류", serializer.errors)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response("비밀번호가 성공적으로 변경되었습니다.")
        return error_response("입력값 오류", serializer.errors)


class PasswordResetTokenValidateView(APIView):
    def get(self, request):
        data = {
            'uid': request.GET.get("uid"),
            'token': request.GET.get("token")
        }
        serializer = PasswordResetTokenValidateSerializer(data=data)
        if serializer.is_valid():
            return success_response("유효한 링크입니다.")
        return error_response("유효하지 않은 링크입니다.", serializer.errors)


class FindIDView(APIView):
    def post(self, request):
        serializer = FindIDSerializer(data=request.data)
        if serializer.is_valid():
            masked_username = serializer.get_masked_username()
            return success_response("일치하는 계정이 확인되었습니다.", {"username": masked_username})
        return error_response("입력값 오류", serializer.errors)


class EmailVerificationSendView(APIView):
    def post(self, request):
        serializer = EmailVerificationSendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response("이메일로 인증 코드를 전송했습니다.")
        return error_response("입력값 오류", serializer.errors)


class EmailVerificationConfirmView(APIView):
    def post(self, request):
        serializer = EmailVerificationConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return success_response("이메일 인증이 완료되었습니다.")
        return error_response("입력값 오류", serializer.errors)


class ImageUploadPresignedURLView(APIView):
    def post(self, request):
        serializer = PresignedURLRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("입력값 오류", serializer.errors)

        filename = serializer.validated_data["filename"]
        content_type = serializer.validated_data["content_type"]

        ext = filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{ext}"
        s3_key = f"{settings.AWS_S3_IMAGE_FOLDER}/{unique_filename}"

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        try:
            presigned_url = s3_client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": s3_key,
                    "ContentType": content_type
                },
                ExpiresIn=300
            )
        except ClientError as e:
            return error_response("S3 URL 생성 중 오류 발생", str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        final_image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"

        return success_response("Presigned URL 생성 성공", {
            "upload_url": presigned_url,
            "image_url": final_image_url
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_me(request):
    serializer = UserMeSerializer(request.user)
    return success_response("현재 로그인한 사용자 정보입니다.", serializer.data)
