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

    def get_control_results(self, tenant_id: str = None, limit: int = 20):
        if tenant_id:
            query = """
                SELECT
                    mcs.control_id,
                    cr.control_name,
                    cr.severity_level,
                    mcs.overall_status,
                    mcs.total_rules,
                    mcs.passed_rules,
                    mcs.failed_rules,
                    mcs.error_rules,
                    mcs.skipped_rules,
                    CASE WHEN mcs.total_rules > 0 
                         THEN ROUND(mcs.passed_rules::numeric / mcs.total_rules * 100, 1)
                         ELSE 0 END as pass_rate
                FROM engine.migration_control_summary mcs
                JOIN engine.control_registry cr ON mcs.control_id = cr.control_id
                JOIN engine.migration_batch_registry b ON mcs.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                ORDER BY mcs.created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (tenant_id, limit))
        else:
            query = """
                SELECT
                    mcs.control_id,
                    cr.control_name,
                    cr.severity_level,
                    mcs.overall_status,
                    mcs.total_rules,
                    mcs.passed_rules,
                    mcs.failed_rules,
                    mcs.error_rules,
                    mcs.skipped_rules,
                    CASE WHEN mcs.total_rules > 0 
                         THEN ROUND(mcs.passed_rules::numeric / mcs.total_rules * 100, 1)
                         ELSE 0 END as pass_rate
                FROM engine.migration_control_summary mcs
                JOIN engine.control_registry cr ON mcs.control_id = cr.control_id
                ORDER BY mcs.created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (limit,))

    def get_recent_executions(self, tenant_id: str = None, limit: int = 10):
        if tenant_id:
            query = """
                SELECT
                    b.batch_id,
                    b.batch_name,
                    b.batch_status,
                    b.total_controls,
                    b.completed_controls,
                    b.failed_controls,
                    b.batch_start_time
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                ORDER BY b.batch_start_time DESC
                LIMIT %s
            """
            return self.db.execute(query, (tenant_id, limit))
        else:
            query = """
                SELECT
                    batch_id,
                    batch_name,
                    batch_status,
                    total_controls,
                    completed_controls,
                    failed_controls,
                    batch_start_time
                FROM engine.migration_batch_registry
                ORDER BY batch_start_time DESC
                LIMIT %s
            """
            return self.db.execute(query, (limit,))
