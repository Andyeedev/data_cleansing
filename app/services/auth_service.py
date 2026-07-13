import os
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM
from app.db.connection import get_db_connection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    def login(self, username: str, password: str):
        db = get_db_connection()

        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, password_hash, tenant_id, status FROM platform.users WHERE email = %s AND deleted_at IS NULL",
                (username,)
            )
            user = cur.fetchone()

        if not user:
            raise Exception("Invalid credentials")

        user_id, email, password_hash, tenant_id, status = user

        if status != "active":
            raise Exception("Account is not active")

        if not pwd_context.verify(password, password_hash):
            raise Exception("Invalid credentials")

        with db.conn.cursor() as cur:
            cur.execute(
                "UPDATE platform.users SET last_login_at = NOW(), failed_login_attempts = 0 WHERE id = %s",
                (user_id,)
            )
            db.conn.commit()

        payload = {
            "sub": str(user_id),
            "user": email,
            "tenant_id": str(tenant_id) if tenant_id else None,
            "exp": datetime.utcnow() + timedelta(hours=2)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
