from app.db.connection import get_db_connection


class GovernanceRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_audit_entries(self, limit: int = 50, entity_type: str = None):
        query = """
            SELECT
                id,
                action,
                entity_type,
                entity_id,
                user_email,
                timestamp,
                details
            FROM engine.audit_log
            WHERE 1=1
        """
        params = []
        if entity_type and entity_type != 'all':
            query += " AND entity_type = %s"
            params.append(entity_type)
        query += " ORDER BY timestamp DESC LIMIT %s"
        params.append(limit)
        return self.db.execute(query, tuple(params))

    def get_pending_approvals(self):
        query = """
            SELECT
                id,
                entity_type,
                entity_id,
                status,
                requested_by,
                created_at
            FROM engine.approvals
            WHERE status = 'PENDING'
            ORDER BY created_at DESC
        """
        return self.db.execute(query)

    def get_exception_requests(self):
        query = """
            SELECT
                id,
                entity_type,
                entity_id,
                reason,
                status,
                requested_by,
                created_at
            FROM engine.exceptions
            WHERE status = 'OPEN'
            ORDER BY created_at DESC
        """
        return self.db.execute(query)
