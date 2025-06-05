from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import Post, PartnershipCategory
from .serializers import (
    PostSerializer,
    PostListSerializer,
    PostDetailSerializer,
    PartnershipCategorySerializer,
)
from utils.response import success_response, error_response

from django.conf import settings
import boto3
import uuid
from botocore.exceptions import ClientError


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(is_active=True).order_by("-created_at")
        serializer = PostDetailSerializer(posts, many=True)
        return success_response("게시글 목록 조회 성공", serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            post = serializer.save()
            return success_response(
                "게시글 작성 성공",
                PostDetailSerializer(post).data,
                status.HTTP_201_CREATED,
            )
        return error_response("입력값 오류", serializer.errors)


class PostDetailView(RetrieveAPIView):
    queryset = Post.objects.filter(is_active=True)
    serializer_class = PostDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = self.get_serializer(post)
        return success_response("게시글 상세 조회 성공", serializer.data)


class PartnershipCategoryListView(ListAPIView):
    queryset = PartnershipCategory.objects.all()
    serializer_class = PartnershipCategorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response("제휴 카테고리 목록 조회 성공", serializer.data)


class PostImageUploadPresignedURLView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        filename = request.data.get("filename")
        content_type = request.data.get("content_type")

        if not filename or not content_type:
            return error_response("filename과 content_type은 필수입니다.")

        ext = filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{ext}"
        s3_key = f"posts/{unique_filename}"

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        try:
            presigned_url = s3_client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": s3_key,
                    "ContentType": content_type,
                },
                ExpiresIn=300,
            )
        except ClientError as e:
            return error_response(
                "S3 URL 생성 중 오류 발생",
                str(e),
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        final_image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"

        return success_response(
            "게시글 이미지 업로드 presigned URL 생성 성공",
            {"upload_url": presigned_url, "image_url": final_image_url},
        )


class MyPostListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(author=user).order_by("-created_at")
        serializer = PostListSerializer(posts, many=True)
        return success_response(
            message="게시글 목록을 성공적으로 불러왔습니다.", data=serializer.data
        )
