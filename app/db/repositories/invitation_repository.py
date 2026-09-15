from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid


class InvitationRepository:
    def __init__(self, conn):
        self.conn = conn

    def create_invitation(self, tenant_id: str, email: str, invited_by: Optional[str], message: Optional[str] = None) -> Dict[str, Any]:
        invitation_id = str(uuid.uuid4())
        token = uuid.uuid4().hex  # 32 char hex, fits in VARCHAR(64)
        expires_at = datetime.utcnow() + timedelta(days=7)

        query = """
            INSERT INTO platform.invitations (invitation_id, tenant_id, email, token, invited_by, status, expires_at)
            VALUES (%s, %s, %s, %s, %s, 'pending', %s)
            RETURNING invitation_id, email, status, expires_at, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (invitation_id, tenant_id, email, token, invited_by, expires_at))
            columns = [desc[0] for desc in cur.description]
            invitation = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": invitation}

    def get_invitation_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        query = """
            SELECT invitation_id, tenant_id, email, token, invited_by, status, expires_at, accepted_at, created_at
            FROM platform.invitations
            WHERE token = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def get_pending_invitation_for_update(self, token: str) -> Optional[Dict[str, Any]]:
        """Get and lock invitation for acceptance (FOR UPDATE)."""
        query = """
            SELECT invitation_id, tenant_id, email, status, expires_at
            FROM platform.invitations
            WHERE token = %s AND status = 'pending' AND expires_at > NOW()
            FOR UPDATE
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (token,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def list_invitations(self, tenant_id: str, status: Optional[str] = None, page: int = 1, page_size: int = 50) -> Dict[str, Any]:
        offset = (page - 1) * page_size
        query = """
            SELECT invitation_id, email, status, invited_by, created_at, expires_at
            FROM platform.invitations
            WHERE tenant_id = %s
        """
        params = [tenant_id]

        if status:
            query += " AND status = %s"
            params.append(status)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            invitations = [dict(zip(columns, row)) for row in cur.fetchall()]

            # Total count
            count_query = "SELECT COUNT(*) FROM platform.invitations WHERE tenant_id = %s"
            count_params = [tenant_id]
            if status:
                count_query += " AND status = %s"
                count_params.append(status)
            cur.execute(count_query, count_params)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "invitations": invitations,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def revoke_invitation(self, invitation_id: str, tenant_id: str) -> bool:
        query = """
            UPDATE platform.invitations
            SET status = 'revoked'
            WHERE invitation_id = %s AND tenant_id = %s AND status = 'pending'
            RETURNING invitation_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (invitation_id, tenant_id))
            return cur.fetchone() is not None

    def resend_invitation(self, invitation_id: str, tenant_id: str, invited_by: Optional[str]) -> Optional[Dict[str, Any]]:
        """Generate new token and extend expiry for existing pending invitation."""
        new_token = uuid.uuid4().hex
        expires_at = datetime.utcnow() + timedelta(days=7)

        query = """
            UPDATE platform.invitations
            SET token = %s, expires_at = %s, invited_by = %s
            WHERE invitation_id = %s AND tenant_id = %s AND status = 'pending'
            RETURNING invitation_id, email, status, expires_at, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (new_token, expires_at, invited_by, invitation_id, tenant_id))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def accept_invitation(self, invitation_id: str) -> bool:
        query = """
            UPDATE platform.invitations
            SET status = 'accepted', accepted_at = NOW()
            WHERE invitation_id = %s AND status = 'pending'
            RETURNING invitation_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (invitation_id,))
            return cur.fetchone() is not None

    def update_user_invitation_id(self, user_id: str, invitation_id: str) -> bool:
        query = """
            UPDATE platform.users
            SET invitation_id = %s, email_verified = FALSE
            WHERE id = %s
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (invitation_id, user_id))
            return cur.fetchone() is not None