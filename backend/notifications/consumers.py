import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification
from .serializers import NotificationSerializer

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        # Reject unauthenticated connections
        if user.is_anonymous:
            await self.close()
            return

        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send unread notifications on connect
        notifications = await self.get_unread_notifications(user)
        await self.send(text_data=json.dumps({
            "type": "initial_notifications",
            "notifications": notifications,
        }))

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Handle mark as read from client
        if data.get("type") == "mark_read":
            notification_id = data.get("id")
            if notification_id:
                await self.mark_notification_read(notification_id)

    # Called by channel layer when a notification is pushed
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_notification",
            "notification": event["notification"],
        }))

    @database_sync_to_async
    def get_unread_notifications(self, user):
        qs = Notification.objects.filter(recipient=user, is_read=False)
        return NotificationSerializer(qs, many=True).data

    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        Notification.objects.filter(id=notification_id).update(is_read=True)