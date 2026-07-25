import secrets
import json
import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class ApprovalService:
    def __init__(self, conn, tenant_id: str = None):
        self.conn = conn
        self.tenant_id = tenant_id

    def list_approvals(self, page: int = 1, page_size: int = 50, status: Optional[str] = None,
                       assigned_to: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, title, description, status, priority, type,
                   requested_by, assigned_to, due_date, created_at
            FROM platform.approval_requests
            WHERE deleted_at IS NULL
        """
        params = []

        if self.tenant_id:
            query += " AND tenant_id = %s"
            params.append(self.tenant_id)

        if status:
            query += " AND status = %s"
            params.append(status)
        if assigned_to:
            query += " AND assigned_to = %s"
            params.append(assigned_to)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            approvals = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.approval_requests WHERE deleted_at IS NULL"
            if self.tenant_id:
                count_query += " AND tenant_id = %s"
                cur.execute(count_query, (self.tenant_id,))
            else:
                cur.execute(count_query)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "approvals": approvals,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_approval(self, approval_id: str):
        query = """
            SELECT id, title, description, status, priority, type,
                   requested_by, assigned_to, due_date, decision_at,
                   decision_by, decision_notes, created_at, updated_at
            FROM platform.approval_requests
            WHERE id = %s AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (approval_id,))
            columns = [desc[0] for desc in cur.description]
            approval = dict(zip(columns, cur.fetchone()))

        if not approval:
            return {"success": False, "error": "Approval not found"}

        return {"success": True, "data": approval}

    def create_approval(self, payload, user_id: str = None):
        approval_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.approval_requests 
                (id, title, description, status, priority, type,
                 requested_by, assigned_to, due_date, tenant_id)
            VALUES (%s, %s, %s, 'pending', %s, %s, %s, %s, %s, %s)
            RETURNING id, title, status, priority, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                approval_id, payload.title, payload.description,
                payload.priority, payload.type, user_id,
                payload.assigned_to, payload.due_date, self.tenant_id
            ))
            columns = [desc[0] for desc in cur.description]
            approval = dict(zip(columns, cur.fetchone()))

        logger.info(f"Approval created: {approval_id} by user {user_id}")
        return {"success": True, "data": approval}

    def approve_request(self, approval_id: str, user_id: str, notes: str = None):
        query = """
            UPDATE platform.approval_requests
            SET status = 'approved', decision_at = NOW(), decision_by = %s, decision_notes = %s
            WHERE id = %s AND status = 'pending' AND deleted_at IS NULL
            RETURNING id, title, status, decision_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, notes, approval_id))
            columns = [desc[0] for desc in cur.description]
            approval = dict(zip(columns, cur.fetchone()))

        if not approval:
            return {"success": False, "error": "Approval not found or already decided"}

        logger.info(f"Approval approved: {approval_id} by user {user_id}")
        return {"success": True, "data": approval}

    def reject_request(self, approval_id: str, user_id: str, notes: str = None):
        query = """
            UPDATE platform.approval_requests
            SET status = 'rejected', decision_at = NOW(), decision_by = %s, decision_notes = %s
            WHERE id = %s AND status = 'pending' AND deleted_at IS NULL
            RETURNING id, title, status, decision_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, notes, approval_id))
            columns = [desc[0] for desc in cur.description]
            approval = dict(zip(columns, cur.fetchone()))

        if not approval:
            return {"success": False, "error": "Approval not found or already decided"}

        logger.info(f"Approval rejected: {approval_id} by user {user_id}")
        return {"success": True, "data": approval}

    def get_pending_count(self, user_id: str):
        query = """
            SELECT COUNT(*) FROM platform.approval_requests
            WHERE assigned_to = %s AND status = 'pending' AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            count = cur.fetchone()[0]

        return {"success": True, "data": {"count": count}}
