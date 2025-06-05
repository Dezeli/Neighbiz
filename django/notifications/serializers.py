from rest_framework import serializers
from notifications.models import PartnerRequest, Notification


class PartnerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerRequest
        fields = ["post", "message"]

    def validate(self, attrs):
        request = self.context["request"]
        post = attrs["post"]

        if PartnerRequest.objects.filter(sender=request.user, post=post).exists():
            raise serializers.ValidationError(
                {"message": "이미 이 게시글에 제휴 요청을 보냈습니다."}
            )
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        post = validated_data["post"]
        message = validated_data["message"]

        partner_request = PartnerRequest.objects.create(
            sender=request.user, **validated_data
        )

        Notification.objects.create(
            user=post.author, sender=request.user, post=post, message=message
        )

        return partner_request


class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.name", read_only=True)
    request_message = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "sender_username",
            "message",
            "post",
            "request_message",
            "is_read",
            "created_at",
        ]

    def get_request_message(self, obj):
        try:
            partner_request = PartnerRequest.objects.get(
                sender=obj.sender, post=obj.post
            )
            return partner_request.message
        except PartnerRequest.DoesNotExist:
            return None


class SentPartnerRequestSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source="post.title", read_only=True)
    post_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = PartnerRequest
        fields = ["id", "post", "post_title", "post_thumbnail", "message", "created_at"]

    def get_post_thumbnail(self, obj):
        thumbnail = obj.post.images.filter(is_thumbnail=True).first()
        if thumbnail:
            return thumbnail.image_url
        fallback = obj.post.images.first()
        return fallback.image_url if fallback else None
