from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User, UserImage, EmailVerification
from users.forms import UserCreationForm, UserChangeForm

class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User

    list_display = ('id', 'username', 'name', 'email', 'role', 'is_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_verified', 'is_active')
    search_fields = ('username', 'email', 'name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('개인정보', {'fields': ('name', 'email', 'phone_number')}),
        ('권한', {'fields': (
            'role', 'is_verified', 'is_active',
            'is_staff', 'is_superuser', 'groups', 'user_permissions'
        )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'name', 'email',
                'phone_number', 'role', 'password1', 'password2'
            ),
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(UserImage)
admin.site.register(EmailVerification)
