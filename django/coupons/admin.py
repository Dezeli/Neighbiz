from django.contrib import admin
from .models import Coupon, ConsumerAuth, CouponQR


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("id", "issued_by", "issued_to_phone", "used", "issued_at", "expires_at")
    list_filter = ("used", "issued_by")
    search_fields = ("issued_to_phone",)
    readonly_fields = ("id", "issued_at", "used_at")


@admin.register(ConsumerAuth)
class ConsumerAuthAdmin(admin.ModelAdmin):
    list_display = ("phone_number", "verification_code", "is_verified", "created_at", "expired_at")
    list_filter = ("is_verified",)
    search_fields = ("phone_number",)
    readonly_fields = ("created_at", "verified_at")


@admin.register(CouponQR)
class CouponQRAdmin(admin.ModelAdmin):
    list_display = ("store", "image_url", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("store__name",)
    readonly_fields = ("created_at",)
