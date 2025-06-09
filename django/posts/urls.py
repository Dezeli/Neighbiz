from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    PartnershipCategoryListView,
    PostImageUploadPresignedURLView,
    MyPostListView,
)

urlpatterns = [
    path("", PostListCreateView.as_view(), name="post-list-create"),
    path("<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("categories/", PartnershipCategoryListView.as_view(), name="categories"),
    path(
        "image-upload/", PostImageUploadPresignedURLView.as_view(), name="image-upload"
    ),
    path("myposts/", MyPostListView.as_view(), name="my-posts"),
]
