from rest_framework import serializers
from .models import Project, Task
from accounts.models import CustomUser

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        depth = 1

# serializers.py
class AddProjectMemberSerializer(serializers.ModelSerializer):
    project_members = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Project
        fields = '__all__'

    def update(self, instance, validated_data):
        members = validated_data.pop('project_members', None)
        instance = super().update(instance, validated_data)

        if members is not None:
            instance.project_members.set(members)

        return instance

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
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'task_description', 'task_assign_user', 'task_priority', 'task_status', 'task_due', 'created_at']
        depth = 1

class ProjectWithTasksSerializer(serializers.ModelSerializer):
    tasks = TaskProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

