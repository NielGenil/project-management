from django.contrib import admin
from .models import Project, Task, ProjectMembership
# Register your models here.



admin.site.register(Project)
admin.site.register(ProjectMembership)
admin.site.register(Task)