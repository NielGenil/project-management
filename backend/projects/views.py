from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .models import Project, Task
from .serializers import ProjectSerializer, ProjectEditSerializer, TaskSerializer, TaskEditSerializer, ProjectWithTasksSerializer
# Create your views here.

class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectCreate(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectEditSerializer
    
class ProjectStatusChoicesView(APIView):
    def get(self, request):
        return Response({
            "statuses": Project.ProjectStatus.choices,
        })
    
class TaskList(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskCreate(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskEditSerializer

class TaskChoicesView(APIView):
    def get(self, request):
        return Response({
            "priority": Task.TaskPriority.choices,
            "statuses": Task.TaskStatus.choices,
        })
    
class ProjectWithTaskList(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related("tasks")
    serializer_class = ProjectWithTasksSerializer