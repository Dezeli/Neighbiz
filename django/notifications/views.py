from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PartnerRequest, Notification
from stores.models import Store
from posts.models import Post
from .serializers import (
    PartnerRequestSerializer,
    NotificationSerializer,
    SentPartnerRequestSerializer,
)
from rest_framework import views
from django.shortcuts import get_object_or_404
from utils.response import success_response, error_response
from stores.serializers import StoreSerializer
from posts.serializers import PostSerializer


class PartnerRequestCreateView(generics.CreateAPIView):
    queryset = PartnerRequest.objects.all()
    serializer_class = PartnerRequestSerializer
    permission_classes = [IsAuthenticated]


class NotificationListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by(
            "-created_at"
        )
        serializer = NotificationSerializer(notifications, many=True)
        return success_response("알림 목록을 불러왔습니다.", serializer.data)


class NotificationReadView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return success_response("알림을 읽음 처리했습니다.")


class NotificationUnreadCountView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return success_response(
            "안읽은 알림 수를 불러왔습니다.", {"unread_count": count}
        )


class MyPageView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            store = Store.objects.get(owner=request.user)
        except Store.DoesNotExist:
            return error_response("가게 정보가 없습니다.", status=404)

        posts = Post.objects.filter(author=request.user)
        post_data = PostSerializer(posts, many=True).data

        sent_requests = PartnerRequest.objects.filter(sender=request.user)
        sent_data = SentPartnerRequestSerializer(sent_requests, many=True).data

        return success_response(
            "마이페이지 정보를 불러왔습니다.",
            {
                "store": StoreSerializer(store).data,
                "posts": post_data,
                "sent_requests": sent_data,
            },
        )
