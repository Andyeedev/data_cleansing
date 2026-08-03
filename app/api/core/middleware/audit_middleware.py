import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM

logger = logging.getLogger("audit")


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        user_id = None
        auth = request.headers.get("Authorization")
        if auth and auth.startswith("Bearer ") and request.method != "OPTIONS":
            try:
                token = auth.split(" ")[1]
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub") or payload.get("user")
                request.state.user = payload
            except Exception:
                pass

        response = await call_next(request)
        duration = round((time.time() - start_time) * 1000, 2)

        logger.info(
            f"AUDIT | {request.method} {request.url.path} | "
            f"user={user_id} | status={response.status_code} | "
            f"duration={duration}ms"
        )

        return response
