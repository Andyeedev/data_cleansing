from app.db.connection import get_db_connection


class DashboardRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_system_count(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT COUNT(DISTINCT s.system_id)
                FROM core.system_registry s
                JOIN core.projects p ON s.project_id = p.project_id
                WHERE p.tenant_id::text = %s
            """
            rows = self.db.execute(query, (tenant_id,))
        else:
            query = "SELECT COUNT(*) FROM core.system_registry"
            rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_batch_stats(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN b.batch_status = 'RUNNING' THEN 1 END) as active
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
            """
            rows = self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN batch_status = 'RUNNING' THEN 1 END) as active
                FROM engine.migration_batch_registry
            """
            rows = self.db.execute(query)
        if rows:
            return rows[0][0], rows[0][1]
        return 0, 0

    def get_total_controls(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT COUNT(*)
                FROM engine.control_registry c
                JOIN core.projects p ON c.project_id = p.project_id
                WHERE p.tenant_id::text = %s
            """
            rows = self.db.execute(query, (tenant_id,))
        else:
            query = "SELECT COUNT(*) FROM engine.control_registry"
            rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_recent_activity(self, limit: int = 10, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT
                    ce.id,
                    ce.execution_status AS action,
                    ce.control_id AS resource_type,
                    ce.rule_id AS resource_id,
                    'SYSTEM' AS user_email,
                    ce.created_at
                FROM engine.migration_control_execution ce
                JOIN engine.migration_batch_registry b ON ce.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                ORDER BY ce.created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (tenant_id, limit))
        else:
            query = """
                SELECT
                    id,
                    execution_status AS action,
                    control_id AS resource_type,
                    rule_id AS resource_id,
                    'SYSTEM' AS user_email,
                    created_at
                FROM engine.migration_control_execution
                ORDER BY created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (limit,))
