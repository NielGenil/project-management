from rest_framework import serializers
from .models import Project, Task, ProjectMembership
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"

    def get_user_role(self, obj):
        user = self.context["request"].user
        membership = ProjectMembership.objects.filter(user=user, project=obj).first()
        return membership.role if membership else None


class ProjectEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        depth = 1

class ProjectMemberRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembership
        fields = '__all__'

class ProjectMemberRoleEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembership
        fields = '__all__'

        depth = 1

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        depth = 1

class TaskProjectSerializer(serializers.ModelSerializer):
    task_assign_user = CustomUserSerializer()
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'task_description', 'task_assign_user', 'task_priority', 'task_status', 'task_due', 'created_at']
        depth = 1

class ProjectWithTasksSerializer(serializers.ModelSerializer):
    tasks = TaskProjectSerializer(source="user_tasks", many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

class ProjectMemberSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = ProjectMembership
        fields = ['id', 'user', 'role']
        depth = 1

class ProjectWithMembersSerializer(serializers.ModelSerializer):
    members = ProjectMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

