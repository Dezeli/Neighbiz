from django.urls import path
from .views import PostListCreateView, PostDetailView, PartnershipCategoryListView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('categories/', PartnershipCategoryListView.as_view(), name='categories'),
]
