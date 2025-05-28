from rest_framework import serializers
from .models import Post, PostImage, PartnershipCategory


class PartnershipCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipCategory
        fields = ['id', 'name']


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image_url', 'is_thumbnail', 'created_at']
        read_only_fields = ['created_at']


class PostSerializer(serializers.ModelSerializer):
    store_categories = serializers.PrimaryKeyRelatedField(
        queryset=PartnershipCategory.objects.all(),
        many=True
    )
    partnership_categories = serializers.PrimaryKeyRelatedField(
        queryset=PartnershipCategory.objects.all(),
        many=True
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'store_name', 'description', 'address',
            'phone_number', 'available_time',
            'store_categories', 'partnership_categories',
            'extra_message', 'created_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'is_active']

    def create(self, validated_data):
        store_categories = validated_data.pop('store_categories')
        partnership_categories = validated_data.pop('partnership_categories')
        post = Post.objects.create(author=self.context['request'].user, **validated_data)
        post.store_categories.set(store_categories)
        post.partnership_categories.set(partnership_categories)
        return post


class PostDetailSerializer(serializers.ModelSerializer):
    store_categories = PartnershipCategorySerializer(many=True)
    partnership_categories = PartnershipCategorySerializer(many=True)
    images = PostImageSerializer(many=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'store_name', 'description', 'address',
            'phone_number', 'available_time',
            'store_categories', 'partnership_categories',
            'extra_message', 'images',
            'author', 'created_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'is_active', 'author']