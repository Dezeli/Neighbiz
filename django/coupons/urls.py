from django.urls import path
from .views import PhoneVerifySendView, PhoneVerifyConfirmView

urlpatterns = [
    path("phone-verify/send/", PhoneVerifySendView.as_view(), name="phone-verify-send"),
    path("phone-verify/confirm/", PhoneVerifyConfirmView.as_view(), name="phone-verify-confirm"),
]
