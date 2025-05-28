from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response

from .models import Post, PartnershipCategory
from .serializers import (
    PostSerializer,
    PostDetailSerializer,
    PartnershipCategorySerializer
)
from utils.response import success_response, error_response


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
            return success_response("게시글 작성 성공", PostDetailSerializer(post).data, status.HTTP_201_CREATED)
        return error_response("입력값 오류", serializer.errors)


class PostDetailView(RetrieveAPIView):
    queryset = Post.objects.filter(is_active=True)
    serializer_class = PostDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

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
