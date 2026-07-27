from app.db.connection import get_db_connection


class GovernanceRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_audit_entries(self, limit: int = 50, entity_type: str = None):
        query = """
            SELECT
                id,
                execution_status AS action,
                control_id AS entity_type,
                rule_id AS entity_id,
                'SYSTEM' AS user_email,
                created_at AS timestamp,
                entity_name AS details
            FROM engine.migration_control_execution
            WHERE 1=1
        """
        params = []
        if entity_type and entity_type != 'all':
            query += " AND control_id = %s"
            params.append(entity_type)
        query += " ORDER BY created_at DESC LIMIT %s"
        params.append(limit)
        return self.db.execute(query, tuple(params))

    def get_pending_approvals(self):
        query = """
            SELECT
                id,
                client_name AS entity_type,
                batch_id::text AS entity_id,
                gate_result AS status,
                approved_by AS requested_by,
                created_at
            FROM engine.migration_release_decision
            ORDER BY created_at DESC
        """
        return self.db.execute(query)

    def get_exception_requests(self):
        query = """
            SELECT
                id,
                control_id AS entity_type,
                rule_id AS entity_id,
                cause AS reason,
                COALESCE(failure_scope, 'OPEN') AS status,
                'SYSTEM' AS requested_by,
                created_at
            FROM engine.migration_control_exceptions
            ORDER BY created_at DESC
        """
        return self.db.execute(query)
