from django.urls import path
from users.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/reset-password-request/', PasswordResetRequestView.as_view(), name='reset-password-request'),
    path('auth/reset-password-confirm/', PasswordResetConfirmView.as_view(), name='reset-password-confirm'),
    path('auth/reset-password-validate/', PasswordResetTokenValidateView.as_view(), name='reset-password-validate'),
    path('auth/find-id/', FindIDView.as_view(), name='find-id'),
    path('auth/email-verify/send/', EmailVerificationSendView.as_view(), name='email-verify-send'),

]
