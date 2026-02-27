from django.db import models
from accounts.models import CustomUser

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        TASK_ASSIGNED   = 'task_assigned', 'Task Assigned'
        TASK_UPDATED    = 'task_updated',  'Task Updated'
        PROJECT_UPDATED = 'project_updated', 'Project Updated'
        MEMBER_ADDED    = 'member_added',  'Member Added'

    recipient   = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    type        = models.CharField(max_length=50, choices=NotificationType.choices)
    message     = models.TextField()
    data        = models.JSONField(default=dict, blank=True)  # extra payload e.g. task_id, project_id
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.email} - {self.type}"