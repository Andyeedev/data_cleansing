import os
from jose import jwt
from datetime import datetime, timedelta
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM


class AuthService:

    def login(self, username: str, password: str):

        # ⚠️ SECURE: environment-only auth
        admin_user = os.getenv("APP_ADMIN_USER")
        admin_pass = os.getenv("APP_ADMIN_PASS")

        if not admin_user or not admin_pass:
            raise RuntimeError("CRITICAL SECURITY ERROR: Admin credentials (APP_ADMIN_USER/APP_ADMIN_PASS) are not configured.")

        if username != admin_user or password != admin_pass:
            raise Exception("Invalid credentials")

        payload = {
            "user": username,
            "tenant_id": "tenant_001",
            "exp": datetime.utcnow() + timedelta(hours=2)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": token,
            "token_type": "bearer"
        }
