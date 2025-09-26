from django.db import models

# Create your models here.
class Task(models.Model):
    class Priority(models.IntegerChoices):
        LOW = 1, 'Low'
        MEDIUM = 2, 'Medium'
        HIGH = 3, 'High'
        URGENT = 4, 'Urgent'

    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.IntegerField(choices=Priority.choices, default=Priority.MEDIUM)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title