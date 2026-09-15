import os
import re
import uuid
import bcrypt
from typing import Optional
from jose import jwt
from datetime import datetime, timedelta
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM
from app.db.connection import get_db_connection
from app.db.repositories.password_reset_repository import PasswordResetRepository
from app.db.repositories.email_verification_repository import EmailVerificationRepository

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
MIN_PASSWORD_LENGTH = 8


def validate_password_policy(password: str):
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


class AuthService:

    def login(self, username: str, password: str):
        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                cur.execute(
                    "SELECT id, email, password_hash, tenant_id, status, email_verified, "
                    "failed_login_attempts, locked_until, token_version "
                    "FROM platform.users WHERE email = %s AND deleted_at IS NULL",
                    (username,),
                )
                user = cur.fetchone()

            if not user:
                raise Exception("Invalid credentials")

            user_id, email, password_hash, tenant_id, status, email_verified, failed_attempts, locked_until, token_version = user

            if status != "active":
                raise Exception("Account is not active")

            if not email_verified:
                raise Exception("Email not verified. Please verify your email address.")

            if tenant_id:
                try:
                    with db.conn.cursor() as cur:
                        cur.execute(
                            "SELECT status FROM core.tenants WHERE tenant_id = %s",
                            (tenant_id,)
                        )
                        tenant_row = cur.fetchone()
                        if not tenant_row or tenant_row[0] != "ACTIVE":
                            raise Exception("Tenant account is suspended")
                except Exception as e:
                    if str(e) == "Tenant account is suspended":
                        raise

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
                        "UPDATE platform.users SET failed_login_attempts = %s, locked_until = %s WHERE id = %s",
                        (new_attempts, lock_until, user_id)
                    )
                    db.conn.commit()

                if new_attempts >= MAX_FAILED_ATTEMPTS:
                    raise Exception(f"Account locked after {MAX_FAILED_ATTEMPTS} failed attempts. Try again in {LOCKOUT_MINUTES} minutes")
                raise Exception("Invalid credentials")

            with db.conn.cursor() as cur:
                cur.execute(
                    "UPDATE platform.users SET last_login_at = NOW(), failed_login_attempts = 0, locked_until = NULL WHERE id = %s",
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
        validate_password_policy(new_password)

        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                cur.execute(
                    "SELECT password_hash, token_version FROM platform.users WHERE id = %s AND deleted_at IS NULL",
                    (user_id,)
                )
                user = cur.fetchone()

                if not user:
                    raise Exception("User not found")

                password_hash, token_version = user

                if not bcrypt.checkpw(current_password.encode("utf-8"), password_hash.encode("utf-8")):
                    raise Exception("Current password is incorrect")

                self._update_password(db.conn, user_id, new_password)
                db.conn.commit()

        return {"message": "Password changed successfully"}

    def _update_password(self, conn, user_id: str, new_password: str):
        """Internal password update — shared by change_password() and reset_password().
        Caller manages transaction (connection context).
        """
        validate_password_policy(new_password)
        new_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode()
        new_version = (self._get_token_version(conn, user_id) or 0) + 1

        with conn.cursor() as cur:
            cur.execute("""
                UPDATE platform.users
                SET password_hash = %s, token_version = %s, password_changed_at = NOW()
                WHERE id = %s
            """, (new_hash, new_version, user_id))

    def _get_token_version(self, conn, user_id: str) -> int:
        with conn.cursor() as cur:
            cur.execute("SELECT token_version FROM platform.users WHERE id = %s AND deleted_at IS NULL", (user_id,))
            row = cur.fetchone()
            return row[0] if row else 0

    def create_reset_token(self, email: str) -> Optional[str]:
        """Create a password reset token for the given email.
        Returns token string if user is eligible, None otherwise.
        """
        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                # Check if user exists and is eligible for reset
                cur.execute("""
                    SELECT u.id, u.status, u.tenant_id
                    FROM platform.users u
                    WHERE u.email = %s AND u.deleted_at IS NULL
                """, (email,))
                user = cur.fetchone()
                if not user:
                    return None  # Enumeration-safe: no token for non-existent

                user_id, status, tenant_id = user

                # Check user status
                if status != "active":
                    return None  # Enumeration-safe: no token for inactive

                # Check tenant status
                if tenant_id:
                    cur.execute("SELECT status FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
                    tenant_row = cur.fetchone()
                    if not tenant_row or tenant_row[0] != "ACTIVE":
                        return None  # Enumeration-safe: no token for suspended tenant

                # Create reset token (invalidates previous unused tokens)
                repo = PasswordResetRepository(db.conn)
                token = repo.create_reset_token(user_id)
                db.conn.commit()
                return token

    def reset_password(self, token: str, new_password: str):
        """Reset password using a valid reset token.
        Atomic: validates token, updates password, marks token used, increments token_version.
        """
        validate_password_policy(new_password)

        with get_db_connection() as db:
            repo = PasswordResetRepository(db.conn)

            # Get and lock reset record
            reset = repo.get_pending_reset_for_update(token)
            if not reset:
                raise Exception("Invalid or expired reset token")

            reset_id = reset["reset_id"]
            user_id = reset["user_id"]

            # Update password (includes token_version increment + password_changed_at)
            self._update_password(db.conn, user_id, new_password)

            # Mark token as used
            repo.mark_reset_used(reset_id)

            db.conn.commit()

        return {"success": True, "message": "Password reset successfully. Please log in."}

    def create_verification_token(self, email: str) -> Optional[str]:
        """Create an email verification token for the given email.
        Returns token string if user is eligible, None otherwise.
        """
        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                # Check if user exists and is eligible for verification
                cur.execute("""
                    SELECT u.id, u.status, u.tenant_id, u.email_verified
                    FROM platform.users u
                    WHERE u.email = %s AND u.deleted_at IS NULL
                """, (email,))
                user = cur.fetchone()
                if not user:
                    return None  # Enumeration-safe: no token for non-existent

                user_id, status, tenant_id, email_verified = user

                # Check if already verified
                if email_verified:
                    return None  # Already verified, no token needed

                # Check user status
                if status != "active":
                    return None  # Enumeration-safe: no token for inactive

                # Check tenant status
                if tenant_id:
                    cur.execute("SELECT status FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
                    tenant_row = cur.fetchone()
                    if not tenant_row or tenant_row[0] != "ACTIVE":
                        return None  # Enumeration-safe: no token for suspended tenant

                # Create verification token (invalidates previous unused tokens)
                repo = EmailVerificationRepository(db.conn)
                token = repo.create_verification_token(user_id)
                db.conn.commit()
                return token

    def verify_email(self, token: str):
        """Verify email using a valid verification token.
        Atomic: validates token, sets email_verified = TRUE, marks token verified.
        """
        with get_db_connection() as db:
            repo = EmailVerificationRepository(db.conn)

            # Get and lock verification record
            verification = repo.get_pending_verification_for_update(token)
            if not verification:
                raise Exception("Invalid or expired verification token")

            verification_id = verification["verification_id"]
            user_id = verification["user_id"]

            # Update user email_verified = TRUE
            with db.conn.cursor() as cur:
                cur.execute("""
                    UPDATE platform.users
                    SET email_verified = TRUE
                    WHERE id = %s
                """, (user_id,))

            # Mark verification token as verified
            repo.mark_verified(verification_id)

            db.conn.commit()

        return {"success": True, "message": "Email verified successfully. You can now log in."}

    def resend_verification(self, email: str):
        """Resend verification email. Always returns 200 (enumeration-safe)."""
        token = self.create_verification_token(email)

        # Send verification email if token was created (user eligible)
        if token:
            try:
                verify_url = f"https://mapnexus.co.uk/verify-email?token={token}"
                from app.services.email_service import EmailServiceFactory, EmailMessage
                from app.services.email_templates import render_verification
                email_service = EmailServiceFactory.get_instance()
                html_body = render_verification(verify_url=verify_url, first_name=email.split("@")[0])
                email_service.send(EmailMessage(
                    to=email,
                    subject="Verify your MAP Nexus email address",
                    html_body=html_body
                ))
            except Exception as e:
                # Log failure but don't expose to user (enumeration-safe)
                import logging
                logging.getLogger(__name__).error(f"Verification email failed for {email}: {e}")

        # Always return same response (enumeration-safe)
        return {"success": True, "message": "If the email exists and is eligible, a verification link has been sent."}
