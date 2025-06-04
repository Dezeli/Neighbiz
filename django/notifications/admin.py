from django.contrib import admin
from .models import PartnerRequest, Notification


@admin.register(PartnerRequest)
class PartnerRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'post', 'created_at')
    search_fields = ('sender__username', 'post__title')
    list_filter = ('created_at',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'sender', 'post', 'is_read', 'created_at')
    search_fields = ('user__username', 'sender__username', 'message')
    list_filter = ('is_read', 'created_at')
