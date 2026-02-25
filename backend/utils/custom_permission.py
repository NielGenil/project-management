from rest_framework.permissions import BasePermission, SAFE_METHODS
from projects.models import ProjectMembership

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

        # Admins bypass all rules
        if user.is_superuser or user.is_staff:
            return True

        # Get membership
        project = obj.project if hasattr(obj, "project") else obj
        membership = ProjectMembership.objects.filter(
            user=user,
            project=project
        ).first()

        if not membership:
            return False


        # ===== Team Leader Rules =====
        if membership.role == "Team Leader":
            # ❌ Team Leader CANNOT delete project
            if request.method == "DELETE" and view.__class__.__name__ == "ProjectDetail":
                return False

            # Team Leader can view, update, patch
            return request.method in ["GET", "PUT", "PATCH"]


        # ===== Member Rules =====
        if membership.role == "Member":
            # Member can only view
            return request.method in SAFE_METHODS


        return False
