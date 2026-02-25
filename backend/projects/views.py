from django.shortcuts import render
from rest_framework.views import APIView, status
from django.db.models import Prefetch, Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Project, Task, ProjectMembership
from .serializers import ProjectSerializer, ProjectEditSerializer, TaskSerializer, TaskEditSerializer, ProjectWithTasksSerializer, ProjectMemberRoleEditSerializer, ProjectMemberRoleSerializer, ProjectWithMembersSerializer
from utils.custom_permission import ProjectPermission
# Create your views here.

class ProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser:
            return Project.objects.all()

        return Project.objects.filter(
            members__user=user
        ).distinct()

class ProjectCreate(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUser]

class ProjectRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectEditSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]
    
class ProjectStatusChoicesView(APIView):
    def get(self, request):
        return Response({
            "statuses": Project.ProjectStatus.choices,
        })
    
class ProjectWithMemberList(generics.RetrieveAPIView):
    queryset = Project.objects.prefetch_related("members")
    serializer_class = ProjectWithMembersSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

class ProjectMemberCreate(generics.CreateAPIView):
    queryset = ProjectMembership.objects.all()
    serializer_class = ProjectMemberRoleSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

class ProjectMemberRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectMembership.objects.all()
    serializer_class = ProjectMemberRoleEditSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

class ProjectMemberRolesChoicesView(APIView):
    def get(self, request):
        return Response({
            "roles": ProjectMembership.ProjectMembershipChoices.choices,
        })

class TaskCreate(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

class TaskRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TaskEditSerializer
        return super().get_serializer_class()

class TaskChoicesView(APIView):
    def get(self, request):
        return Response({
            "priority": Task.TaskPriority.choices,
            "statuses": Task.TaskStatus.choices,
        })
    
class ProjectWithTaskList(generics.RetrieveAPIView):
    serializer_class = ProjectWithTasksSerializer
    permission_classes = [IsAuthenticated, ProjectPermission]

    def get_queryset(self):
        user = self.request.user

        # Projects user belongs to
        projects = Project.objects.filter(members__user=user).distinct()

        # Team Leader projects
        leader_project_ids = ProjectMembership.objects.filter(
            user=user,
            role="Team Leader"
        ).values_list("project_id", flat=True)

        # ADMIN → all tasks
        if user.is_superuser or user.is_staff:
            tasks_qs = Task.objects.all()

        else:
            # Leader → all tasks in their projects
            leader_tasks = Task.objects.filter(project_id__in=leader_project_ids)

            # Member → only assigned tasks
            member_tasks = Task.objects.filter(task_assign_user=user)

            # Combine leader + member tasks
            tasks_qs = leader_tasks | member_tasks

        return projects.prefetch_related(
            Prefetch("tasks", queryset=tasks_qs, to_attr="user_tasks")
        )

class TaskBulkDelete(generics.GenericAPIView):
    queryset = Task.objects.all()

    def delete(self, request, *args, **kwargs):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        Task.objects.filter(id__in=ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)