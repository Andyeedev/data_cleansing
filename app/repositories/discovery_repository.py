from app.db.connection import get_db_connection


class DiscoveryRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_mappings_by_batch(self, batch_id: str):
        query = """
            SELECT
                dm.mapping_id,
                dm.project_id,
                dm.source_system_id,
                dm.target_system_id,
                dm.source_schema,
                dm.source_table,
                dm.source_columns,
                dm.target_schema,
                dm.target_table,
                dm.target_columns,
                dm.is_active,
                dm.created_at
            FROM core.dataset_mappings dm
            INNER JOIN engine.migration_validation_batch mvb
                ON dm.project_id = mvb.project_id
            WHERE mvb.batch_id = %s
            ORDER BY dm.created_at DESC
        """
        return self.db.execute(query, (batch_id,))

    def get_mapping_by_id(self, mapping_id: str):
        query = """
            SELECT
                mapping_id,
                project_id,
                source_system_id,
                target_system_id,
                source_schema,
                source_table,
                source_columns,
                target_schema,
                target_table,
                target_columns,
                is_active,
                created_at
            FROM core.dataset_mappings
            WHERE mapping_id = %s
        """
        rows = self.db.execute(query, (mapping_id,))
        return rows[0] if rows else None

    def get_mappings_by_project(self, project_id: str):
        query = """
            SELECT
                mapping_id,
                project_id,
                source_system_id,
                target_system_id,
                source_schema,
                source_table,
                source_columns,
                target_schema,
                target_table,
                target_columns,
                is_active,
                created_at
            FROM core.dataset_mappings
            WHERE project_id = %s
            ORDER BY created_at DESC
        """
        return self.db.execute(query, (project_id,))

    def get_batch_info(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                execution_start,
                execution_end,
                overall_status,
                overall_score
            FROM engine.migration_validation_batch
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_discovery_status(self, batch_id: str):
        query = """
            SELECT
                mvb.batch_id,
                mvb.project_id,
                mvb.overall_status,
                mvb.execution_start,
                mvb.execution_end,
                COUNT(dm.mapping_id) as mappings_created
            FROM engine.migration_validation_batch mvb
            LEFT JOIN core.dataset_mappings dm ON mvb.project_id = dm.project_id
            WHERE mvb.batch_id = %s
            GROUP BY mvb.batch_id, mvb.project_id, mvb.overall_status,
                     mvb.execution_start, mvb.execution_end
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def count_datasets_by_project(self, project_id: str):
        query = """
            SELECT COUNT(DISTINCT table_name)
            FROM core.datasets
            WHERE system_id IN (
                SELECT system_id FROM core.system_registry
                WHERE project_id = %s
            )
        """
        rows = self.db.execute(query, (project_id,))
        return rows[0][0] if rows else 0
