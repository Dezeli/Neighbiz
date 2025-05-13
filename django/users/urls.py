from django.urls import path
from users.views import SignupView, CustomTokenObtainPairView, PasswordResetRequestView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/reset-password-request/', PasswordResetRequestView.as_view(), name='reset-password-request'),
]
