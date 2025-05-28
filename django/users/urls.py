from django.urls import path
from users.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('reset-password-request/', PasswordResetRequestView.as_view()),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view()),
    path('reset-password-validate/', PasswordResetTokenValidateView.as_view()),
    path('find-id/', FindIDView.as_view()),
    path('email-verify/send/', EmailVerificationSendView.as_view()),
    path('email-verify/confirm/', EmailVerificationConfirmView.as_view()),
    path('image-upload/', ImageUploadPresignedURLView.as_view()),
    path('me/', auth_me),
]
