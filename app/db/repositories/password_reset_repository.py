from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import uuid


class PasswordResetRepository:
    def __init__(self, conn):
        self.conn = conn

    def create_reset_token(self, user_id: str) -> str:
        """Create a new reset token for user, invalidating previous unused tokens."""
        new_token = uuid.uuid4().hex
        expires_at = datetime.utcnow() + timedelta(hours=1)

        query = """
            INSERT INTO platform.password_resets (user_id, token, expires_at)
            VALUES (%s, %s, %s)
            RETURNING token
        """
        with self.conn.cursor() as cur:
            # Invalidate previous unused tokens for this user
            cur.execute("""
                UPDATE platform.password_resets
                SET used = TRUE
                WHERE user_id = %s AND used = FALSE AND expires_at > NOW()
            """, (user_id,))

            # Create new token
            cur.execute(query, (user_id, new_token, expires_at))
            row = cur.fetchone()
            return row[0] if row else new_token

    def get_pending_reset_for_update(self, token: str) -> Optional[Dict[str, Any]]:
        """Get and lock reset record for consumption (FOR UPDATE)."""
        query = """
            SELECT reset_id, user_id, token, expires_at, used
            FROM platform.password_resets
            WHERE token = %s AND used = FALSE AND expires_at > NOW()
            FOR UPDATE
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def mark_reset_used(self, reset_id: str) -> bool:
        """Mark reset token as used."""
        query = """
            UPDATE platform.password_resets
            SET used = TRUE
            WHERE reset_id = %s
            RETURNING reset_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (reset_id,))
            return cur.fetchone() is not None

    def get_reset_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Get reset record by token (without locking)."""
        query = """
            SELECT reset_id, user_id, token, expires_at, used, created_at
            FROM platform.password_resets
            WHERE token = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def has_valid_reset_token(self, user_id: str) -> bool:
        """Check if user has any valid unused reset token."""
        query = """
            SELECT 1 FROM platform.password_resets
            WHERE user_id = %s AND used = FALSE AND expires_at > NOW()
            LIMIT 1
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone() is not None