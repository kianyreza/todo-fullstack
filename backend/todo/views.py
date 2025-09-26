from django.utils import timezone
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from .models import Task
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['completed', '-priority', 'created_at']
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        task = self.get_object()
        # اگر تسک تاریخ گذشته و انجام نشده باشد، اجازه آپدیت نده
        # مگر اینکه فقط وضعیت completed در حال تغییر باشد
        if task.due_date and task.due_date < timezone.now().date() and not task.completed:
            # اگر تنها تغییری که می‌آید، انجام دادن تسک است، اجازه بده
            if 'completed' in serializer.validated_data and len(serializer.validated_data) == 1:
                pass  # اجازه آپدیت داده می‌شود
            else:
                raise ValidationError("You cannot update a past-due task.")

        super().perform_update(serializer)
