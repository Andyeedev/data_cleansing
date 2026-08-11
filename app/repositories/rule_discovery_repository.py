from typing import Optional, List
from app.db.connection import get_db_connection


class RuleDiscoveryRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_discovered_rules(self, project_id: str) -> List:
        query = """
            SELECT DISTINCT ON (rr.rule_id, dm.source_schema, dm.source_table)
                rdm.mapping_id,
                rr.rule_id,
                rr.rule_name,
                rr.control_id,
                rr.enabled_flag,
                dm.source_schema,
                dm.source_table
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            JOIN engine.rule_registry rr ON rdm.rule_id = rr.rule_id
            WHERE dm.project_id::text = %s
            AND rdm.is_active = TRUE
            ORDER BY rr.rule_id, dm.source_schema, dm.source_table
        """
        return self.db.execute(query, (project_id,))

    def get_discovery_mappings(self, project_id: str) -> List:
        query = """
            SELECT
                rdm.id AS mapping_id,
                dm.source_schema,
                dm.source_table,
                rr.rule_id,
                rr.rule_name,
                rr.sql_template_file
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            JOIN engine.rule_registry rr ON rdm.rule_id = rr.rule_id
            WHERE dm.project_id::text = %s
            AND rdm.is_active = TRUE
            ORDER BY dm.source_schema, dm.source_table, rr.rule_id
        """
        return self.db.execute(query, (project_id,))

    def get_project_tenant(self, project_id: str) -> Optional[str]:
        query = """
            SELECT p.tenant_id
            FROM core.projects p
            WHERE p.project_id::text = %s
        """
        rows = self.db.execute(query, (project_id,))
        return str(rows[0][0]) if rows and rows[0][0] else None

    def update_mappings_for_project(self, project_id: str) -> int:
        update_query = """
            UPDATE core.rule_dataset_mapping rdm
            SET is_active = TRUE
            FROM core.dataset_mappings dm
            WHERE rdm.mapping_id = dm.mapping_id
            AND dm.project_id::text = %s
        """
        return self.db.execute(update_query, (project_id,))

    def get_last_discovery_time(self, project_id: str) -> Optional[str]:
        query = """
            SELECT MAX(rdm.created_at) AS last_discovery
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            WHERE dm.project_id::text = %s
        """
        rows = self.db.execute(query, (project_id,))
        if rows and rows[0][0]:
            return str(rows[0][0])
        return None

    def count_mappings_for_project(self, project_id: str) -> int:
        query = """
            SELECT COUNT(*)
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            WHERE dm.project_id::text = %s
            AND rdm.is_active = TRUE
        """
        rows = self.db.execute(query, (project_id,))
        return rows[0][0] if rows else 0

    def count_rules_for_project(self, project_id: str) -> int:
        query = """
            SELECT COUNT(DISTINCT rdm.rule_id)
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            WHERE dm.project_id::text = %s
            AND rdm.is_active = TRUE
        """
        rows = self.db.execute(query, (project_id,))
        return rows[0][0] if rows else 0

    def count_total_mappings_for_project(self, project_id: str) -> int:
        query = """
            SELECT COUNT(*)
            FROM core.rule_dataset_mapping rdm
            JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
            WHERE dm.project_id::text = %s
        """
        rows = self.db.execute(query, (project_id,))
        return rows[0][0] if rows else 0
