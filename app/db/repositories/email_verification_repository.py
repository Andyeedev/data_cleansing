from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import uuid


class EmailVerificationRepository:
    def __init__(self, conn):
        self.conn = conn

    def create_verification_token(self, user_id: str) -> str:
        """Create a new verification token for user, invalidating previous unused tokens."""
        new_token = uuid.uuid4().hex
        expires_at = datetime.utcnow() + timedelta(hours=24)

        with self.conn.cursor() as cur:
            # Invalidate previous unused tokens for this user
            cur.execute("""
                UPDATE platform.email_verifications
                SET verified = TRUE
                WHERE user_id = %s AND verified = FALSE AND expires_at > NOW()
            """, (user_id,))

            # Create new token
            query = """
                INSERT INTO platform.email_verifications (user_id, token, expires_at)
                VALUES (%s, %s, %s)
                RETURNING token
            """
            cur.execute(query, (user_id, new_token, expires_at))
            row = cur.fetchone()
            return row[0] if row else new_token

    def get_pending_verification_for_update(self, token: str) -> Optional[Dict[str, Any]]:
        """Get and lock verification record for consumption (FOR UPDATE)."""
        query = """
            SELECT verification_id, user_id, token, expires_at, verified
            FROM platform.email_verifications
            WHERE token = %s AND verified = FALSE AND expires_at > NOW()
            FOR UPDATE
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def mark_verified(self, verification_id: str) -> bool:
        """Mark verification record as verified."""
        query = """
            UPDATE platform.email_verifications
            SET verified = TRUE
            WHERE verification_id = %s
            RETURNING verification_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (verification_id,))
            return cur.fetchone() is not None

    def get_verification_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Get verification record by token (without locking)."""
        query = """
            SELECT verification_id, user_id, token, expires_at, verified, created_at
            FROM platform.email_verifications
            WHERE token = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def has_valid_verification_token(self, user_id: str) -> bool:
        """Check if user has any valid unused verification token."""
        query = """
            SELECT 1 FROM platform.email_verifications
            WHERE user_id = %s AND verified = FALSE AND expires_at > NOW()
            LIMIT 1
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone() is not None