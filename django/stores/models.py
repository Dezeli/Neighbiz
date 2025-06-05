from django.db import models
from users.models import User
from posts.models import PartnershipCategory


class Store(models.Model):
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="store"
    )  # 1:1
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    available_time = models.CharField(max_length=100)
    categories = models.ManyToManyField(PartnershipCategory)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
