from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_str):
    print("TOKEN:", token_str)
    try:
        token = AccessToken(token_str)
        print("TOKEN PAYLOAD:", token.payload)
        return User.objects.get(id=token["user_id"])
    except Exception as e:
        print("JWT ERROR:", e)
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token_str = query_string.get("token", [None])[0]
        scope["user"] = await get_user_from_token(token_str) if token_str else AnonymousUser()
        return await super().__call__(scope, receive, send)