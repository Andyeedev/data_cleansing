from typing import Optional, List
from app.db.connection import get_db_connection


class RuleRegistryRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_all_rules(self, tenant_id: str = None) -> List:
        if tenant_id:
            query = """
                SELECT
                    r.rule_id,
                    r.control_id,
                    r.rule_name,
                    r.sql_template_file,
                    r.severity_level,
                    r.enabled_flag,
                    r.created_at,
                    t.tenant_id
                FROM engine.rule_registry r
                INNER JOIN (
                    SELECT DISTINCT
                        rdm.rule_id,
                        p.tenant_id
                    FROM core.rule_dataset_mapping rdm
                    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                    JOIN core.projects p ON dm.project_id::text = p.project_id::text
                    WHERE rdm.is_active = TRUE
                    AND p.tenant_id = %s
                ) t ON r.rule_id = t.rule_id
                ORDER BY r.control_id, r.rule_id
            """
            return self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT
                    r.rule_id,
                    r.control_id,
                    r.rule_name,
                    r.sql_template_file,
                    r.severity_level,
                    r.enabled_flag,
                    r.created_at,
                    t.tenant_id
                FROM engine.rule_registry r
                LEFT JOIN (
                    SELECT rule_id, (array_agg(tenant_id ORDER BY tenant_id))[1] AS tenant_id
                    FROM (
                        SELECT DISTINCT rdm.rule_id, p.tenant_id
                        FROM core.rule_dataset_mapping rdm
                        JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                        JOIN core.projects p ON dm.project_id::text = p.project_id::text
                        WHERE rdm.is_active = TRUE
                    ) sub
                    GROUP BY rule_id
                ) t ON r.rule_id = t.rule_id
                ORDER BY r.control_id, r.rule_id
            """
            return self.db.execute(query)

    def get_rule_by_id(self, rule_id: str):
        query = """
            SELECT
                rule_id,
                control_id,
                rule_name,
                sql_template_file,
                severity_level,
                enabled_flag,
                created_at
            FROM engine.rule_registry
            WHERE rule_id = %s
        """
        rows = self.db.execute(query, (rule_id,))
        return rows[0] if rows else None

    def get_rules_by_control(self, control_id: str) -> List:
        query = """
            SELECT
                rule_id,
                control_id,
                rule_name,
                sql_template_file,
                severity_level,
                enabled_flag,
                created_at
            FROM engine.rule_registry
            WHERE control_id = %s
            ORDER BY rule_id
        """
        return self.db.execute(query, (control_id,))

    def create_rule(self, rule_data: dict) -> dict:
        query = """
            INSERT INTO engine.rule_registry
                (rule_id, control_id, rule_name, sql_template_file, severity_level, enabled_flag)
            VALUES
                (%(rule_id)s, %(control_id)s, %(rule_name)s, %(sql_template_file)s, %(severity_level)s, %(enabled_flag)s)
            RETURNING
                rule_id, control_id, rule_name, sql_template_file, severity_level, enabled_flag, created_at
        """
        rows = self.db.execute(query, rule_data)
        return rows[0] if rows else None

    def update_rule(self, rule_id: str, rule_data: dict) -> dict:
        set_clauses = []
        params = {"rule_id": rule_id}

        for field in ["control_id", "rule_name", "sql_template_file", "severity_level", "enabled_flag"]:
            if field in rule_data and rule_data[field] is not None:
                set_clauses.append(f"{field} = %({field})s")
                params[field] = rule_data[field]

        if not set_clauses:
            return self.get_rule_by_id(rule_id)

        query = f"""
            UPDATE engine.rule_registry
            SET {', '.join(set_clauses)}
            WHERE rule_id = %(rule_id)s
            RETURNING
                rule_id, control_id, rule_name, sql_template_file, severity_level, enabled_flag, created_at
        """
        rows = self.db.execute(query, params)
        return rows[0] if rows else None

    def delete_rule(self, rule_id: str) -> bool:
        query = "DELETE FROM engine.rule_registry WHERE rule_id = %s RETURNING rule_id"
        rows = self.db.execute(query, (rule_id,))
        return len(rows) > 0

    def get_rule_count(self) -> int:
        query = "SELECT COUNT(*) FROM engine.rule_registry"
        rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_rule_usage_stats(self, tenant_id: str = None) -> List:
        if tenant_id:
            query = """
                SELECT
                    r.rule_id,
                    r.control_id,
                    r.rule_name,
                    r.sql_template_file,
                    r.severity_level,
                    r.enabled_flag,
                    r.created_at,
                    COALESCE(m.mapping_count, 0) AS mapping_count,
                    e.last_execution,
                    e.last_status,
                    COALESCE(e.total_executions, 0) AS total_executions,
                    %s::text AS tenant_id
                FROM engine.rule_registry r
                INNER JOIN (
                    SELECT DISTINCT
                        rdm.rule_id,
                        p.tenant_id
                    FROM core.rule_dataset_mapping rdm
                    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                    JOIN core.projects p ON dm.project_id::text = p.project_id::text
                    WHERE rdm.is_active = TRUE
                    AND p.tenant_id = %s
                ) t ON r.rule_id = t.rule_id
                LEFT JOIN (
                    SELECT rule_id, COUNT(*) AS mapping_count
                    FROM core.rule_dataset_mapping rdm2
                    INNER JOIN core.dataset_mappings dm2 ON rdm2.mapping_id = dm2.mapping_id
                    INNER JOIN core.projects p2 ON dm2.project_id::text = p2.project_id::text
                    WHERE rdm2.is_active = TRUE
                    AND p2.tenant_id = %s
                    GROUP BY rule_id
                ) m ON r.rule_id = m.rule_id
                LEFT JOIN (
                    SELECT
                        mce.rule_id,
                        MAX(mce.created_at) AS last_execution,
                        (ARRAY_AGG(mce.execution_status ORDER BY mce.created_at DESC))[1] AS last_status,
                        COUNT(*) AS total_executions
                    FROM engine.migration_control_execution mce
                    INNER JOIN engine.migration_batch_registry b ON mce.batch_id = b.batch_id
                    INNER JOIN core.projects p ON b.project_id::text = p.project_id::text
                    WHERE p.tenant_id = %s
                    GROUP BY mce.rule_id
                ) e ON r.rule_id = e.rule_id
                ORDER BY r.control_id, r.rule_id
            """
            return self.db.execute(query, (tenant_id, tenant_id, tenant_id, tenant_id))
        else:
            query = """
                SELECT
                    r.rule_id,
                    r.control_id,
                    r.rule_name,
                    r.sql_template_file,
                    r.severity_level,
                    r.enabled_flag,
                    r.created_at,
                    COALESCE(m.mapping_count, 0) AS mapping_count,
                    e.last_execution,
                    e.last_status,
                    COALESCE(e.total_executions, 0) AS total_executions,
                    t.tenant_id
                FROM engine.rule_registry r
                LEFT JOIN (
                    SELECT rule_id, COUNT(*) AS mapping_count
                    FROM core.rule_dataset_mapping
                    WHERE is_active = TRUE
                    GROUP BY rule_id
                ) m ON r.rule_id = m.rule_id
                LEFT JOIN (
                    SELECT
                        rule_id,
                        MAX(created_at) AS last_execution,
                        (ARRAY_AGG(execution_status ORDER BY created_at DESC))[1] AS last_status,
                        COUNT(*) AS total_executions
                    FROM engine.migration_control_execution
                    GROUP BY rule_id
                ) e ON r.rule_id = e.rule_id
                LEFT JOIN (
                    SELECT rule_id, (array_agg(tenant_id ORDER BY tenant_id))[1] AS tenant_id
                    FROM (
                        SELECT DISTINCT rdm.rule_id, p.tenant_id
                        FROM core.rule_dataset_mapping rdm
                        JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                        JOIN core.projects p ON dm.project_id::text = p.project_id::text
                        WHERE rdm.is_active = TRUE
                    ) sub
                    GROUP BY rule_id
                ) t ON r.rule_id = t.rule_id
                ORDER BY r.control_id, r.rule_id
            """
            return self.db.execute(query)

    def get_unique_tenants(self):
        query = """
            SELECT tenant_id, tenant_name
            FROM core.tenants
            ORDER BY tenant_name
        """
        return self.db.execute(query)

    def get_projects_for_tenant(self, tenant_id: str) -> List:
        query = """
            SELECT project_id, project_name
            FROM core.projects
            WHERE tenant_id = %s
            ORDER BY project_name
        """
        return self.db.execute(query, (tenant_id,))

    def get_mappings_for_rule(self, rule_id: str, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT
                    rdm.id AS mapping_id,
                    rdm.mapping_id AS dataset_mapping_id,
                    dm.source_schema,
                    dm.source_table,
                    rdm.is_active,
                    rdm.created_at,
                    last_exec.execution_status,
                    last_exec.delta_value,
                    last_exec.execution_time_seconds,
                    last_exec.created_at AS last_execution_at
                FROM core.rule_dataset_mapping rdm
                LEFT JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                LEFT JOIN core.projects p ON dm.project_id::text = p.project_id::text
                LEFT JOIN LATERAL (
                    SELECT
                        mce.execution_status,
                        mce.delta_value,
                        mce.execution_time_seconds,
                        mce.created_at
                    FROM engine.migration_control_execution mce
                    WHERE mce.mapping_id = rdm.mapping_id
                    AND mce.rule_id = rdm.rule_id
                    ORDER BY mce.created_at DESC
                    LIMIT 1
                ) last_exec ON TRUE
                WHERE rdm.rule_id = %s
                AND p.tenant_id = %s
                ORDER BY rdm.created_at DESC
            """
            return self.db.execute(query, (rule_id, tenant_id))
        else:
            query = """
                SELECT
                    rdm.id AS mapping_id,
                    rdm.mapping_id AS dataset_mapping_id,
                    dm.source_schema,
                    dm.source_table,
                    rdm.is_active,
                    rdm.created_at,
                    last_exec.execution_status,
                    last_exec.delta_value,
                    last_exec.execution_time_seconds,
                    last_exec.created_at AS last_execution_at
                FROM core.rule_dataset_mapping rdm
                LEFT JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
                LEFT JOIN LATERAL (
                    SELECT
                        mce.execution_status,
                        mce.delta_value,
                        mce.execution_time_seconds,
                        mce.created_at
                    FROM engine.migration_control_execution mce
                    WHERE mce.mapping_id = rdm.mapping_id
                    AND mce.rule_id = rdm.rule_id
                    ORDER BY mce.created_at DESC
                    LIMIT 1
                ) last_exec ON TRUE
                WHERE rdm.rule_id = %s
                ORDER BY rdm.created_at DESC
            """
            return self.db.execute(query, (rule_id,))
