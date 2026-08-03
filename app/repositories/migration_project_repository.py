from app.db.connection import get_db_connection


class MigrationProjectRepository:
    def __init__(self):
        self.db = get_db_connection()

    def get_all_projects(self, limit: int = 50, offset: int = 0, status: str = None, tenant_id: str = None):
        conditions = []
        params = []

        if status:
            conditions.append("status = %s")
            params.append(status)
        if tenant_id:
            conditions.append("tenant_id::text = %s")
            params.append(tenant_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        query = f"""
            SELECT project_id, project_name, project_type, status, tenant_id, created_at,
                   updated_at, total_batches, completed_batches, failed_batches,
                   total_controls, completed_controls, dataset_count
            FROM engine.v_migration_projects
            {where}
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([limit, offset])
        return self.db.execute(query, tuple(params))

    def get_project_by_id(self, project_id: str):
        query = """
            SELECT project_id, project_name, project_type, status, tenant_id, created_at,
                   updated_at, total_batches, completed_batches, failed_batches,
                   total_controls, completed_controls, dataset_count
            FROM engine.v_migration_projects
            WHERE project_id = %s
        """
        rows = self.db.execute(query, (project_id,))
        return rows[0] if rows else None

    def get_total_count(self, status: str = None, tenant_id: str = None):
        conditions = []
        params = []
        if status:
            conditions.append("status = %s")
            params.append(status)
        if tenant_id:
            conditions.append("tenant_id::text = %s")
            params.append(tenant_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        query = f"SELECT COUNT(*) FROM engine.v_migration_projects {where}"
        rows = self.db.execute(query, tuple(params))
        return rows[0][0] if rows else 0

    def get_project_datasets(self, project_id: str):
        query = """
            SELECT d.discovered_dataset_id, d.table_name, d.schema_name,
                   d.discovered_at, d.last_seen
            FROM core.discovered_datasets d
            WHERE d.project_id::text = %s
            ORDER BY d.discovered_at DESC
        """
        return self.db.execute(query, (project_id,))

    def get_unique_tenants(self):
        query = """
            SELECT DISTINCT p.tenant_id, t.tenant_name
            FROM engine.v_migration_projects p
            LEFT JOIN core.tenants t ON p.tenant_id = t.tenant_id
            WHERE p.tenant_id IS NOT NULL
            ORDER BY t.tenant_name
        """
        return self.db.execute(query)

    def get_overview_stats(self, tenant_id: str = None):
        tenant_filter = ""
        params = []
        if tenant_id:
            tenant_filter = "WHERE tenant_id::text = %s"
            params = [tenant_id]

        # Summary counts
        query = f"""
            SELECT
                COUNT(*) AS total_projects,
                COALESCE(SUM(total_batches), 0) AS total_batches,
                COALESCE(SUM(total_controls), 0) AS total_controls,
                COALESCE(SUM(completed_controls), 0) AS completed_controls,
                COALESCE(SUM(dataset_count), 0) AS total_datasets,
                COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) AS active_projects
            FROM engine.v_migration_projects
            {tenant_filter}
        """
        stats = self.db.execute(query, tuple(params))
        return stats[0] if stats else None

    def get_active_batches_count(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT COUNT(*)
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE b.batch_status = 'RUNNING'
                AND p.project_type = 'MIGRATION'
                AND p.tenant_id::text = %s
            """
            rows = self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT COUNT(*)
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE b.batch_status = 'RUNNING'
                AND p.project_type = 'MIGRATION'
            """
            rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_recent_activity(self, limit: int = 10, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT e.id, e.execution_status, e.entity_name, e.created_at
                FROM engine.migration_control_execution e
                JOIN engine.migration_batch_registry b ON e.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.project_type = 'MIGRATION'
                AND p.tenant_id::text = %s
                ORDER BY e.created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (tenant_id, limit))
        else:
            query = """
                SELECT e.id, e.execution_status, e.entity_name, e.created_at
                FROM engine.migration_control_execution e
                JOIN engine.migration_batch_registry b ON e.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.project_type = 'MIGRATION'
                ORDER BY e.created_at DESC
                LIMIT %s
            """
            return self.db.execute(query, (limit,))

    def get_top_projects_by_progress(self, limit: int = 5, tenant_id: str = None):
        conditions = ["total_batches > 0"]
        params = []
        if tenant_id:
            conditions.append("tenant_id::text = %s")
            params.append(tenant_id)

        where = f"WHERE {' AND '.join(conditions)}"
        query = f"""
            SELECT project_name, total_batches, completed_batches
            FROM engine.v_migration_projects
            {where}
            ORDER BY completed_batches DESC NULLS LAST
            LIMIT %s
        """
        params.append(limit)
        return self.db.execute(query, tuple(params))
