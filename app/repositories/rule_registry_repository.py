from typing import Optional, List
from app.db.connection import get_db_connection


class RuleRegistryRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_all_rules(self) -> List:
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
            ORDER BY control_id, rule_id
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

    def get_rule_usage_stats(self) -> List:
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
                COALESCE(e.total_executions, 0) AS total_executions
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
            ORDER BY r.control_id, r.rule_id
        """
        return self.db.execute(query)
