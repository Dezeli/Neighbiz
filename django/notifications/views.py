from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PartnerRequest, Notification
from .serializers import PartnerRequestSerializer, NotificationSerializer
from rest_framework import status, views
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from utils.response import success_response



class PartnerRequestCreateView(generics.CreateAPIView):
    queryset = PartnerRequest.objects.all()
    serializer_class = PartnerRequestSerializer
    permission_classes = [IsAuthenticated]

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

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
        return success_response("안읽은 알림 수를 불러왔습니다.", {"unread_count": count})
