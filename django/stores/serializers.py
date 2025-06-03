from rest_framework import serializers
from .models import Store

class StoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            'name', 'description', 'address',
            'phone_number', 'available_time', 'categories'
        ]
