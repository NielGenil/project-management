import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from .serializers import NotificationSerializer

def push_notification(recipient, notif_type, message, data=None):
    """
    Creates a DB notification and pushes it via WebSocket.
    Call this from views, signals, or serializers.
    """
    notif = Notification.objects.create(
        recipient=recipient,
        type=notif_type,
        message=message,
        data=data or {},
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",
        {
            "type": "send_notification",   # maps to consumer method
            "notification": NotificationSerializer(notif).data,
        }
    )
    return notif