import os
import string
import secrets
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from django.db.models import Prefetch
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import CustomUser, InvitationToken
from .serializers import CustomUserSerializer, CustomUserWithTaskSerializer, RegisterSerializer, ChangePasswordSerializer
from django.http import HttpResponse
from rest_framework.response import Response
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


# Create your views here.

class InviteUser(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    # permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result)


class InvitationRespondView(APIView):
    """
    Handles Accept / Decline responses from the invitation email link.
    GET /api/invite/respond/?token=<token>&action=accept|decline
    """

    def get(self, request):
        token_value = request.query_params.get("token")
        action = request.query_params.get("action")

        if not token_value or action not in ["accept", "decline"]:
            return HttpResponse(self._html_response(
                "Invalid Request",
                "The link is missing required parameters.",
                "#dc3545"
            ), content_type="text/html", status=400)

        try:
            invitation = InvitationToken.objects.get(token=token_value)
        except InvitationToken.DoesNotExist:
            return HttpResponse(self._html_response(
                "Invalid Token",
                "This invitation link is invalid.",
                "#dc3545"
            ), content_type="text/html", status=404)

        if invitation.is_used:
            return HttpResponse(self._html_response(
                "Already Responded",
                "You have already responded to this invitation.",
                "#ffc107"
            ), content_type="text/html", status=400)

        if timezone.now() > invitation.expires_at:
            return HttpResponse(self._html_response(
                "Link Expired",
                "This invitation link has expired. Please request a new invitation.",
                "#ffc107"
            ), content_type="text/html", status=400)

        # Mark token as used
        invitation.is_used = True
        invitation.save()

        if action == "accept":
            return self._handle_accept(invitation)
        else:
            return self._handle_decline(invitation)

    def _handle_accept(self, invitation):
        email = invitation.email

        # Check again if user was already created
        if CustomUser.objects.filter(email=email).exists():
            return HttpResponse(self._html_response(
                "Already Registered",
                "This email is already registered.",
                "#ffc107"
            ), content_type="text/html", status=400)

        # Generate password and create user
        password = self._generate_password()
        CustomUser.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Notify user with credentials
        self._send_credentials_email(email, password)

        # Notify admin
        self._notify_admin(email, accepted=True)

        return HttpResponse(self._html_response(
            "Invitation Accepted!",
            "Your account has been created. Please check your email for your login credentials.",
            "#28a745"
        ), content_type="text/html")

    def _handle_decline(self, invitation):
        email = invitation.email

        # Notify admin
        self._notify_admin(email, accepted=False)

        return HttpResponse(self._html_response(
            "Invitation Declined",
            "You have declined the invitation. No account has been created.",
            "#dc3545"
        ), content_type="text/html")

    def _generate_password(self, length=12):
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    def _send_credentials_email(self, email, password):
        subject = "Your Account Credentials – Project Management System"
        from_email = os.getenv("EMAIL_HOST_USER")

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background-color: #1a73e8; padding: 20px; color: white; text-align: center;">
                    <h2 style="margin: 0;">Project Management System</h2>
                </div>
                <div style="padding: 30px;">
                    <p>Dear User,</p>
                    <p>Your account has been successfully created. Here are your login credentials:</p>
                    <div style="background-color: #f0f4f8; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> {email}</p>
                        <p style="margin: 0;"><strong>Password:</strong> {password}</p>
                    </div>
                    <p>Please log in and change your password as soon as possible.</p>
                </div>
                <div style="background-color: #f6f9fc; padding: 15px; text-align: center;
                            font-size: 12px; color: #888;">
                    © Project Management System. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        self._send_email(subject, html_content, [email])

    def _notify_admin(self, email, accepted: bool):
        action_text = "ACCEPTED" if accepted else "DECLINED"
        color = "#28a745" if accepted else "#dc3545"
        message = (
            "The account has been created and credentials have been sent to the user."
            if accepted
            else "No account was created."
        )

        subject = f"Invitation {action_text} – {email}"
        from_email = os.getenv("EMAIL_HOST_USER")
        admin_email = os.getenv("EMAIL_HOST_USER")  # Change to your admin email

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background-color: {color}; padding: 20px; color: white; text-align: center;">
                    <h2 style="margin: 0;">Invitation {action_text}</h2>
                </div>
                <div style="padding: 30px;">
                    <p>The invited user <strong>{email}</strong> has <strong>{action_text}</strong> the invitation.</p>
                    <p>{message}</p>
                </div>
                <div style="background-color: #f6f9fc; padding: 15px; text-align: center;
                            font-size: 12px; color: #888;">
                    © Project Management System. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        self._send_email(subject, html_content, [admin_email])

    def _send_email(self, subject, html_content, to):
        from_email = os.getenv("EMAIL_HOST_USER")
        text_content = strip_tags(html_content)
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    def _html_response(self, title, message, color):
        """Returns a simple styled HTML page shown in the browser after clicking Accept/Decline."""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc;
                     display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="background: white; padding: 40px; border-radius: 10px;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px;">
                <h2 style="color: {color};">{title}</h2>
                <p style="color: #555;">{message}</p>
            </div>
        </body>
        </html>
        """

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get("old_password")
            new_password = serializer.validated_data.get("new_password")

            # 🔐 Verify old password
            if not user.check_password(old_password):
                return Response({"old_password": ["Wrong old password."]}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Set and hash the new password properly
            user.set_password(new_password)
            user.save()
            # print("Password updated for user:", user.username)

            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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