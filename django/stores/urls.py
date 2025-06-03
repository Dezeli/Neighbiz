from django.urls import path
from .views import StoreCreateView, MyStoreView, MyPageView

urlpatterns = [
    path('', StoreCreateView.as_view(), name='store-create'),
    path('me/', MyStoreView.as_view(), name='my-store'),
    path('mypage/', MyPageView.as_view(), name='my-page'),
]
