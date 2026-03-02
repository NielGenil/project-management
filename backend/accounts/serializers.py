from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password']

class CustomUserWithTaskSerializer(serializers.ModelSerializer):
    from projects.serializers import TaskUserSerializer
    task_assign = TaskUserSerializer(source="users_taks_dashboard", many=True, read_only=True)

    class Meta:
        model = CustomUser
        exclude = ['password']