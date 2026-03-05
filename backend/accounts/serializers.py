import os
from rest_framework import serializers
from .models import CustomUser, InvitationToken
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
import string
import secrets
from django.utils import timezone
from datetime import timedelta


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']

        # Generate a secure token for accept/decline
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=24)  # Token valid for 24 hours

        # Save token to DB (pending invitation)
        InvitationToken.objects.create(
            email=email,
            token=token,
            expires_at=expires_at
        )

        # Send invitation email with Accept/Decline buttons
        self.send_invitation_email(email, token)

        return {"email": email, "message": "Invitation sent successfully."}

    def send_invitation_email(self, email, token):
        subject = "You're Invited – Project Management System"
        from_email = os.getenv("EMAIL_HOST_USER")
        to = [email]

        base_url = os.getenv("BACKEND_BASE_URL")  # Change to your backend URL
        accept_url = f"{base_url}/api/invite/respond/?token={token}&action=accept"
        decline_url = f"{base_url}/api/invite/respond/?token={token}&action=decline"

        html_content = f"""
        <html>
<body style="margin:0; padding:40px; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center">
                
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                       style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#1a73e8; padding:20px; color:white; text-align:center;">
                            <h2 style="margin:0;">Project Management System</h2>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;">
                            <p>Dear User,</p>
                            <p>You have been invited to join the <strong>Project Management System</strong>.</p>
                            <p>Please accept or decline this invitation using the buttons below:</p>

                            <!-- Buttons -->
                            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:30px auto;">
                                <tr>
                                    <td align="center" style="padding:5px;">
                                        <a href="{accept_url}"
                                           style="background-color:#28a745;
                                                  color:#ffffff;
                                                  padding:12px 30px;
                                                  border-radius:6px;
                                                  text-decoration:none;
                                                  font-weight:bold;
                                                  display:inline-block;">
                                            Accept
                                        </a>
                                    </td>
                                    <td align="center" style="padding:5px;">
                                        <a href="{decline_url}"
                                           style="background-color:#dc3545;
                                                  color:#ffffff;
                                                  padding:12px 30px;
                                                  border-radius:6px;
                                                  text-decoration:none;
                                                  font-weight:bold;
                                                  display:inline-block;">
                                            Decline
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color:#888888; font-size:13px;">
                                This invitation link will expire in <strong>24 hours</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f6f9fc; padding:15px; text-align:center; font-size:12px; color:#888888;">
                            © Project Management System. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

        </html>
        """

        text_content = strip_tags(html_content)
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

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