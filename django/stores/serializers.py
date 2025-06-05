from rest_framework import serializers
from .models import Store

class StoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            'name', 'description', 'address',
            'phone_number', 'available_time', 'categories'
        ]

class StoreSerializer(serializers.ModelSerializer):
    categories = serializers.StringRelatedField(many=True)

    class Meta:
        model = Store
        fields = [
            'id', 'name', 'description', 'address',
            'phone_number', 'available_time', 'categories', 'created_at'
        ]
