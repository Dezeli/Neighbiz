from django.urls import path
from .views import (
    PartnerRequestCreateView,
    NotificationListView,
    NotificationReadView,
    NotificationUnreadCountView,
    MyPageView,
)

urlpatterns = [
    path('partner-request/', PartnerRequestCreateView.as_view(), name='partner-request-create'),
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/read/', NotificationReadView.as_view(), name='notification-read'),
    path('unread-count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    path('mypage/', MyPageView.as_view(), name='my-page'), 
]