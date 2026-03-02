from django.shortcuts import render
from rest_framework import generics
from django.db.models import Prefetch
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomUserWithTaskSerializer
# Create your views here.

class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user
    
class UserListWithTask(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserWithTaskSerializer

    def get_queryset(self):
        from projects.models import Task

        user = self.request.user

        # Admin sees all projects
        if user.is_superuser or user.is_staff:
            projects = CustomUser.objects.all()
        else:
            projects = CustomUser.objects.filter(task_assign__task_assign_user=user).distinct()

        # ADMIN → all tasks
        if user.is_superuser or user.is_staff:
            tasks_qs = Task.objects.all()
        else:
            users_taks = Task.objects.filter(task_assign_user=user)
            tasks_qs = users_taks

        return projects.prefetch_related(
            Prefetch("task_assign", queryset=tasks_qs, to_attr="users_taks_dashboard")
        )