import time
import json
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
        token = None
        if auth and auth.startswith("Bearer ") and request.method != "OPTIONS":
            token = auth.split(" ")[1]
        if not token:
            # Phase E (E13): cookie sessions carry the HttpOnly access_token
            # cookie. Same JWT authority as the header path (mirrors the
            # tenant middleware cookie handling); attribution only.
            token = request.cookies.get("access_token")
        if token and request.method != "OPTIONS":
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub") or payload.get("user")
                request.state.user = payload
            except Exception:
                pass

        # DEV-008: Capture request body for audit, but redact sensitive fields on sensitive routes
        request_body = None
        redacted = False
        if request.method in ("POST", "PUT", "PATCH"):
            try:
                body = await request.body()
                if body:
                    request_body = json.loads(body.decode())
                    # DEV-008: Redact sensitive fields on tenant/user provisioning routes
                    sensitive_paths = ["/api/v1/tenants", "/api/v1/users"]
                    if any(request.url.path.startswith(p) for p in sensitive_paths):
                        redacted_fields = {"password", "password_hash", "admin_password", "current_password", "new_password"}
                        if isinstance(request_body, dict):
                            for field in redacted_fields:
                                if field in request_body:
                                    request_body[field] = "***REDACTED***"
                        redacted = True
            except Exception:
                pass

        response = await call_next(request)
        duration = round((time.time() - start_time) * 1000, 2)

        audit_data = {
            "method": request.method,
            "path": request.url.path,
            "user_id": user_id,
            "status": response.status_code,
            "duration_ms": duration,
        }
        if request_body and redacted:
            audit_data["request_body"] = request_body
        elif request_body:
            audit_data["request_body"] = request_body

        logger.info(f"AUDIT | {json.dumps(audit_data)}")

        return response
