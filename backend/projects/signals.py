from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Task, ProjectMembership
from notifications.utils import push_notification

@receiver(post_save, sender=Task)
def task_notification(sender, instance, created, **kwargs):
    assigned_user = instance.task_assign_user

    if created:
        push_notification(
            recipient=assigned_user,
            notif_type='task_assigned',
            message=f'You have been assigned to task "{instance.task_name}" in {instance.project.project_name} by {instance.created_by.username}.',
            data={'task_id': instance.id, 'project_id': instance.project.id},
        )
    else:
        push_notification(
            recipient=assigned_user,
            notif_type='task_updated',
            message=f'Task "{instance.task_name}" has been updated.',
            data={'task_id': instance.id, 'project_id': instance.project.id},
        )

@receiver(post_save, sender=ProjectMembership)
def member_added_notification(sender, instance, created, **kwargs):
    if created:
        push_notification(
            recipient=instance.user,
            notif_type='member_added',
            message=f'You have been added to project "{instance.project.project_name}" as {instance.role} by {instance.created_by.username}.',
            data={'project_id': instance.project.id},
        )