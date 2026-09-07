import os
import re
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM
from app.db.connection import get_db_connection

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
MIN_PASSWORD_LENGTH = 8


class AuthService:

    def login(self, username: str, password: str):
        db = get_db_connection()

        with db.conn.cursor() as cur:
            cur.execute(
                """SELECT id, email, password_hash, tenant_id, status,
                          failed_login_attempts, locked_until, token_version
                   FROM platform.users WHERE email = %s AND deleted_at IS NULL""",
                (username,)
            )
            user = cur.fetchone()

        if not user:
            raise Exception("Invalid credentials")

        user_id, email, password_hash, tenant_id, status, failed_attempts, locked_until, token_version = user

        if status != "active":
            raise Exception("Account is not active")

        if locked_until and locked_until > datetime.utcnow():
            remaining = (locked_until - datetime.utcnow()).seconds // 60 + 1
            raise Exception(f"Account locked. Try again in {remaining} minutes")

        if not bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8")):
            new_attempts = (failed_attempts or 0) + 1
            lock_until = None
            if new_attempts >= MAX_FAILED_ATTEMPTS:
                lock_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)

            with db.conn.cursor() as cur:
                cur.execute(
                    """UPDATE platform.users
                       SET failed_login_attempts = %s, locked_until = %s
                       WHERE id = %s""",
                    (new_attempts, lock_until, user_id)
                )
                db.conn.commit()

            if new_attempts >= MAX_FAILED_ATTEMPTS:
                raise Exception(f"Account locked after {MAX_FAILED_ATTEMPTS} failed attempts. Try again in {LOCKOUT_MINUTES} minutes")
            raise Exception("Invalid credentials")

        with db.conn.cursor() as cur:
            cur.execute(
                """UPDATE platform.users
                   SET last_login_at = NOW(), failed_login_attempts = 0, locked_until = NULL
                   WHERE id = %s""",
                (user_id,)
            )
            db.conn.commit()

        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT r.name FROM platform.user_roles ur JOIN platform.roles r ON ur.role_id = r.id WHERE ur.user_id = %s",
                (user_id,)
            )
            roles = [row[0] for row in cur.fetchall()]

        payload = {
            "sub": str(user_id),
            "user": email,
            "tenant_id": str(tenant_id) if tenant_id else None,
            "roles": roles,
            "token_version": token_version or 0,
            "exp": datetime.utcnow() + timedelta(hours=2)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    def change_password(self, user_id: str, current_password: str, new_password: str):
        db = get_db_connection()

        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT password_hash, token_version FROM platform.users WHERE id = %s AND deleted_at IS NULL",
                (user_id,)
            )
            row = cur.fetchone()

        if not row:
            raise Exception("User not found")

        password_hash, token_version = row

        if not bcrypt.checkpw(current_password.encode("utf-8"), password_hash.encode("utf-8")):
            raise Exception("Current password is incorrect")

        self._validate_password_policy(new_password)

        new_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        new_version = (token_version or 0) + 1

        with db.conn.cursor() as cur:
            cur.execute(
                """UPDATE platform.users
                   SET password_hash = %s, token_version = %s, updated_at = NOW()
                   WHERE id = %s""",
                (new_hash, new_version, user_id)
            )
            db.conn.commit()

        return {"message": "Password changed successfully"}

    def _validate_password_policy(self, password: str):
        errors = []
        if len(password) < MIN_PASSWORD_LENGTH:
            errors.append(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
        if not re.search(r"[A-Z]", password):
            errors.append("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            errors.append("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", password):
            errors.append("Password must contain at least one digit")
        if errors:
            raise Exception("; ".join(errors))

    def get_password_hash(self, password: str) -> str:
        self._validate_password_policy(password)
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
