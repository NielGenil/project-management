from rest_framework.permissions import BasePermission, SAFE_METHODS
from projects.models import ProjectMembership, Project, Task


class ProjectPermission(BasePermission):

    # ================= CREATE (POST) =================
    def has_permission(self, request, view):
        user = request.user

        # Admins can do everything
        if user.is_superuser or user.is_staff:
            return True

        # Only Team Leader can add members
        if request.method == "POST":
            project_id = request.data.get("project")
            if not project_id:
                return False

            return ProjectMembership.objects.filter(
                user=user,
                project_id=project_id,
                role="Team Leader"
            ).exists()

        return True


    # ================= OBJECT PERMISSIONS =================
    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin bypass
        if user.is_superuser or user.is_staff:
            return True

        # Detect project properly
        if isinstance(obj, Project):
            project = obj
        else:
            project = obj.project  # Task or ProjectMembership

        membership = ProjectMembership.objects.filter(
            user=user,
            project=project
        ).first()

        if not membership:
            return False


        # ================= TEAM LEADER =================
        if membership.role == "Team Leader":

            # ❌ Team Leader CANNOT delete Project
            if request.method == "DELETE" and isinstance(obj, Project):
                return False
            
            if request.method == "DELETE" and isinstance(obj, Task):
                return True

            # ✅ Can delete ProjectMembership
            # ✅ Can update Project
            # ✅ Can update/delete Tasks
            return True


        # ================= MEMBER =================
        if membership.role == "Member":

            # Member can only view
            return request.method in SAFE_METHODS


        return False
