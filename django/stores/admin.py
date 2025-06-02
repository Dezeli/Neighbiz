from django.contrib import admin
from .models import Store

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'phone_number', 'address', 'created_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('created_at',)
