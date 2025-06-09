from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from utils.response import success_response, error_response
from .models import Store
from .serializers import StoreCreateSerializer
from posts.models import Post
from posts.serializers import PartnershipCategorySerializer


class StoreCreateView(generics.CreateAPIView):
    serializer_class = StoreCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return success_response(
            "가게 등록이 완료되었습니다.", response.data, status_code=201
        )


class MyStoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            store = request.user.store
            serializer = StoreCreateSerializer(store)
            return success_response("가게 정보를 불러왔습니다.", serializer.data)
        except Store.DoesNotExist:
            return error_response(
                "가게 정보가 등록되어 있지 않습니다.", status_code=404
            )


class MyPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            store = request.user.store
        except Store.DoesNotExist:
            return error_response(
                "가게 정보가 등록되어 있지 않습니다.", status_code=404
            )

        # 가게 정보 직렬화
        store_data = {
            "name": store.name,
            "description": store.description,
            "address": store.address,
            "phone_number": store.phone_number,
            "available_time": store.available_time,
            "categories": PartnershipCategorySerializer(
                store.categories.all(), many=True
            ).data,
        }

        # 내가 작성한 게시글
        posts = (
            Post.objects.filter(author=request.user)
            .prefetch_related("images")
            .order_by("-created_at")
        )

        my_posts = []
        for post in posts:
            thumbnail = post.images.filter(is_thumbnail=True).first()
            my_posts.append(
                {
                    "id": post.id,
                    "title": post.title,
                    "thumbnail_url": thumbnail.image_url if thumbnail else None,
                    "created_at": post.created_at,
                }
            )

        # 제휴 요청 내역 → 아직 구현 전이므로 빈 배열
        sent_requests = []  # TODO: PartnershipRequest 모델 생성 후 연결

        return success_response(
            "마이페이지 데이터를 불러왔습니다.",
            {"store": store_data, "my_posts": my_posts, "sent_requests": sent_requests},
        )
