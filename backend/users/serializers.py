from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    honeypot = serializers.CharField(required=False, write_only=True, allow_blank=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'honeypot']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, value):
        if value.get('honeypot'):
            raise serializers.ValidationError("Honeypot field should be empty.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user