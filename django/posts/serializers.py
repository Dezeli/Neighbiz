from rest_framework import serializers
from .models import Post, PostImage, PartnershipCategory


class PartnershipCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipCategory
        fields = ["id", "name"]


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "image_url", "is_thumbnail", "created_at"]
        read_only_fields = ["id", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    store_categories = serializers.PrimaryKeyRelatedField(
        queryset=PartnershipCategory.objects.all(), many=True
    )
    partnership_categories = serializers.PrimaryKeyRelatedField(
        queryset=PartnershipCategory.objects.all(), many=True
    )
    images = PostImageSerializer(many=True, write_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "store_name",
            "description",
            "address",
            "phone_number",
            "available_time",
            "store_categories",
            "partnership_categories",
            "extra_message",
            "images",
            "created_at",
            "is_active",
        ]
        read_only_fields = ["id", "created_at", "is_active"]

    def validate_images(self, value):
        if not value:
            raise serializers.ValidationError("이미지 리스트는 비워둘 수 없습니다.")

        thumbnails = [img for img in value if img.get("is_thumbnail")]
        if len(thumbnails) != 1:
            raise serializers.ValidationError("썸네일 이미지는 정확히 하나여야 합니다.")

        return value

    def create(self, validated_data):
        store_categories = validated_data.pop("store_categories")
        partnership_categories = validated_data.pop("partnership_categories")
        images_data = validated_data.pop("images")

        post = Post.objects.create(
            author=self.context["request"].user, **validated_data
        )
        post.store_categories.set(store_categories)
        post.partnership_categories.set(partnership_categories)

        for image_data in images_data:
            PostImage.objects.create(post=post, **image_data)

        return post


class PostDetailSerializer(serializers.ModelSerializer):
    store_categories = PartnershipCategorySerializer(many=True)
    partnership_categories = PartnershipCategorySerializer(many=True)
    images = PostImageSerializer(many=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "store_name",
            "description",
            "address",
            "phone_number",
            "available_time",
            "store_categories",
            "partnership_categories",
            "extra_message",
            "images",
            "author",
            "created_at",
            "is_active",
        ]
        read_only_fields = ["id", "created_at", "is_active", "author"]


class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "created_at"]
