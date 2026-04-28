from fastapi import Request
from app.core.auth.jwt_handler import decode_token


async def tenant_middleware(request: Request, call_next):

    auth = request.headers.get("Authorization")

    if auth:
        token = auth.replace("Bearer ", "")
        payload = decode_token(token)

        request.state.tenant_id = payload.get("tenant_id")

    response = await call_next(request)
    return response