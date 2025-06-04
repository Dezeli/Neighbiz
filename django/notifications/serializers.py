from rest_framework import serializers
from posts.models import Post
from notifications.models import PartnerRequest, Notification

class PartnerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerRequest
        fields = ['post', 'message']

    def create(self, validated_data):
        request = self.context['request']
        post = validated_data['post']

        if PartnerRequest.objects.filter(sender=request.user, post=post).exists():
            raise serializers.ValidationError("이미 이 게시글에 제휴 요청을 보냈습니다.")

        partner_request = PartnerRequest.objects.create(sender=request.user, **validated_data)

        Notification.objects.create(
            user=post.user,  # 게시글 작성자
            sender=request.user,
            post=post,
            message=f"{request.user.username}님이 제휴 요청을 보냈습니다."
        )

        return partner_request


class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'sender_username', 'message', 'post', 'is_read', 'created_at']