from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework import generics
from rest_framework.response import Response
from .models import Project, Task
from .serializers import ProjectSerializer, ProjectEditSerializer, TaskSerializer, TaskEditSerializer, ProjectWithTasksSerializer, AddProjectMemberSerializer
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

class AddProjectMemberRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = AddProjectMemberSerializer
    
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

# views.py
class TaskBulkDelete(generics.GenericAPIView):
    queryset = Task.objects.all()

    def delete(self, request, *args, **kwargs):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        Task.objects.filter(id__in=ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)