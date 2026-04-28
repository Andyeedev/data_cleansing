from jose import jwt
from datetime import datetime, timedelta
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM

class AuthService:

    def login(self, username: str, password: str):

        # ⚠️ TEMP: hardcoded auth
        if username != "admin" or password != "admin":
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