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

    def get_summary(self, tenant_id: str):
        query = """
            SELECT
                (SELECT COUNT(DISTINCT sr.system_id) FROM core.system_registry sr WHERE sr.tenant_id = %s) as total_systems,
                (SELECT COUNT(DISTINCT dm.source_schema) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_schemas,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_tables,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s
                 AND dm.target_table IS NOT NULL) as matched_tables
        """
        rows = self.db.execute(query, (tenant_id, tenant_id, tenant_id, tenant_id))
        if not rows or not rows[0]:
            return {
                "total_systems": 0,
                "total_schemas": 0,
                "total_tables": 0,
                "matched_tables": 0,
                "match_rate_percent": 0
            }
        row = rows[0]
        total_systems = row[0] or 0
        total_schemas = row[1] or 0
        total_tables = row[2] or 0
        matched_tables = row[3] or 0
        match_rate = round((matched_tables / total_tables) * 100, 1) if total_tables > 0 else 0
        return {
            "total_systems": total_systems,
            "total_schemas": total_schemas,
            "total_tables": total_tables,
            "matched_tables": matched_tables,
            "match_rate_percent": match_rate
        }

    def get_tree(self, tenant_id: str):
        query = """
            SELECT
                dm.mapping_id,
                dm.source_schema,
                dm.source_table,
                dm.target_schema,
                dm.target_table
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY dm.source_schema, dm.source_table
        """
        rows = self.db.execute(query, (tenant_id,))
        systems = {}
        for row in rows:
            mapping_id, src_schema, src_table, tgt_schema, tgt_table = row
            system_key = "source"
            if system_key not in systems:
                systems[system_key] = {
                    "id": "source",
                    "name": "Source",
                    "type": "system",
                    "status": "matched",
                    "children": []
                }
            systems[system_key]["children"].append({
                "id": mapping_id,
                "name": f"{src_schema}.{src_table}",
                "type": "table",
                "status": "matched" if tgt_table else "unmatched_source",
                "target_table": f"{tgt_schema}.{tgt_table}" if tgt_table else None,
                "confidence": 100 if tgt_table else 0,
                "columns": []
            })
        return list(systems.values())

    def get_tables(self, tenant_id: str):
        query = """
            SELECT
                dm.source_table,
                dm.target_table,
                dm.source_schema
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY dm.source_table
        """
        rows = self.db.execute(query, (tenant_id,))
        result = []
        for row in rows:
            src_table, tgt_table, schema = row
            result.append({
                "source_table": src_table,
                "target_table": tgt_table,
                "schema_name": schema,
                "status": "matched" if tgt_table else "unmatched_source",
                "confidence": 100 if tgt_table else 0,
                "column_diff": []
            })
        return result
