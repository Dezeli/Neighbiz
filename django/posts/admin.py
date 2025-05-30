from django.contrib import admin
from .models import Post, PostImage, PartnershipCategory

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'store_name', 'author', 'created_at', 'is_active']
    list_filter = ['is_active', 'store_categories', 'partnership_categories']
    search_fields = ['title', 'store_name', 'address', 'phone_number']
    filter_horizontal = ['store_categories', 'partnership_categories']


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ['post', 'is_thumbnail', 'image_url', 'created_at']


@admin.register(PartnershipCategory)
class PartnershipCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
