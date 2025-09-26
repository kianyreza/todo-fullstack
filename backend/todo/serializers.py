from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'completed', 'created_at', 'priority', 'updated_at', 'due_date', 'priority_display']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'priority_display']
