import uuid
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    issued_by = models.ForeignKey("stores.Store", on_delete=models.CASCADE, related_name="issued_coupons")
    used_at_store = models.ForeignKey("stores.Store", null=True, blank=True, on_delete=models.SET_NULL, related_name="used_coupons")
    issued_to_phone = models.CharField(max_length=20)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["issued_to_phone", "issued_by", "issued_at"]),
        ]

    def is_expired(self):
        return timezone.now() > self.expires_at


class ConsumerAuth(models.Model):
    phone_number = models.CharField(max_length=20)
    verification_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    expired_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expired_at

    class Meta:
        indexes = [
            models.Index(fields=["phone_number", "created_at"]),
        ]


class CouponQR(models.Model):
    store = models.OneToOneField("stores.Store", on_delete=models.CASCADE, related_name="coupon_qr")
    token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    image_url = models.URLField(help_text="S3에 저장된 QR 코드 이미지 경로")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.store.name} QR 이미지"
