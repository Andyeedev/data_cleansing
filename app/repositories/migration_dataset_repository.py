from app.db.connection import get_db_connection


class MigrationDatasetRepository:
    def __init__(self):
        self.db = get_db_connection()

    def get_all_datasets(self, limit: int = 50, offset: int = 0, project_id: str = None, tenant_id: str = None):
        conditions = []
        params = []

        if project_id:
            conditions.append("dd.project_id::text = %s")
            params.append(project_id)
        if tenant_id:
            conditions.append("dd.project_id::text IN (SELECT project_id::text FROM core.projects WHERE tenant_id::text = %s)")
            params.append(tenant_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        query = f"""
            SELECT dd.discovered_dataset_id, dd.project_id, p.project_name,
                   dd.system_id, sr.system_name, dd.table_name, dd.schema_name,
                   dd.discovered_at, dd.last_seen
            FROM core.discovered_datasets dd
            LEFT JOIN core.projects p ON dd.project_id::text = p.project_id::text
            LEFT JOIN core.system_registry sr ON dd.system_id::text = sr.system_id::text
            {where}
            ORDER BY dd.discovered_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([limit, offset])
        return self.db.execute(query, tuple(params))

    def get_total_count(self, project_id: str = None, tenant_id: str = None):
        conditions = []
        params = []
        if project_id:
            conditions.append("project_id::text = %s")
            params.append(project_id)
        if tenant_id:
            conditions.append("project_id::text IN (SELECT project_id::text FROM core.projects WHERE tenant_id::text = %s)")
            params.append(tenant_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        query = f"SELECT COUNT(*) FROM core.discovered_datasets {where}"
        rows = self.db.execute(query, tuple(params))
        return rows[0][0] if rows else 0

    def get_dataset_by_id(self, dataset_id: str):
        query = """
            SELECT dd.discovered_dataset_id, dd.project_id, p.project_name,
                   dd.system_id, sr.system_name, dd.table_name, dd.schema_name,
                   dd.discovered_at, dd.last_seen
            FROM core.discovered_datasets dd
            LEFT JOIN core.projects p ON dd.project_id::text = p.project_id::text
            LEFT JOIN core.system_registry sr ON dd.system_id::text = sr.system_id::text
            WHERE dd.discovered_dataset_id = %s
        """
        rows = self.db.execute(query, (dataset_id,))
        return rows[0] if rows else None
