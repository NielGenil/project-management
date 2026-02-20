from django.db import models
from accounts.models import CustomUser

# Create your models here.

class Project(models.Model):

    class ProjectStatus(models.TextChoices):
        ACTIVE = 'Active'
        PENDING = 'Pending'
        COMPLETED = 'Completed'
        CANCELED = 'Canceled'

        
    project_name = models.CharField(max_length=100)
    project_description = models.TextField(null=True, blank=True)
    project_status = models.CharField(max_length=50, choices=ProjectStatus.choices, default=ProjectStatus.PENDING)
    project_start = models.DateField(null=True, blank=True)
    project_end = models.DateField(null=True, blank=True)
    project_members = models.ManyToManyField(CustomUser, blank=True, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='project_creator')

    def __str__(self):
        return self.project_name
    
class Task(models.Model):
     
    class TaskPriority(models.TextChoices):
        LOW = 'Low'
        MEDIUM = 'Medium'
        HIGH = 'High'

    class TaskStatus(models.TextChoices):
        TODO = 'To Do'
        IN_PROGRESS = "In Progress"
        DONE = 'Done'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    task_name = models.CharField(max_length=50, null=True, blank=True)
    task_description = models.TextField(null=True, blank=True)
    task_assign_user= models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='task_assign')
    task_priority = models.CharField(max_length=50, choices=TaskPriority.choices, default=TaskPriority.MEDIUM)
    task_status = models.CharField(max_length=50, choices=TaskStatus.choices, default=TaskStatus.TODO)
    task_due = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task_name
