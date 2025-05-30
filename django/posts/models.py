from django.db import models
from django.conf import settings

class PartnershipCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=100)
    store_name = models.CharField(max_length=100)
    description = models.TextField()
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    available_time = models.CharField(max_length=100)

    store_categories = models.ManyToManyField(PartnershipCategory, related_name='store_posts')
    partnership_categories = models.ManyToManyField(PartnershipCategory, related_name='partner_posts')

    extra_message = models.TextField(blank=True)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    is_thumbnail = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.post.title}"
