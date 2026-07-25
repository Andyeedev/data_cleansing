from app.db.connection import get_db_connection


class RuleExecutionRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_rules_by_batch(self, batch_id: str):
        query = """
            SELECT
                id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                execution_status,
                delta_value,
                execution_time_seconds,
                severity_level,
                created_at
            FROM engine.migration_control_execution
            WHERE batch_id = %s
            ORDER BY control_id, rule_id
        """
        return self.db.execute(query, (batch_id,))

    def get_rule_by_id(self, batch_id: str, rule_id: str):
        query = """
            SELECT
                id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                execution_status,
                delta_value,
                execution_time_seconds,
                severity_level,
                mapping_id,
                created_at
            FROM engine.migration_control_execution
            WHERE batch_id = %s AND rule_id = %s
        """
        rows = self.db.execute(query, (batch_id, rule_id))
        return rows[0] if rows else None

    def get_rules_by_control(self, batch_id: str, control_id: str):
        query = """
            SELECT
                id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                execution_status,
                delta_value,
                execution_time_seconds,
                severity_level,
                created_at
            FROM engine.migration_control_execution
            WHERE batch_id = %s AND control_id = %s
            ORDER BY rule_id
        """
        return self.db.execute(query, (batch_id, control_id))

    def get_execution_summary(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                control_id,
                overall_status,
                total_rules,
                passed_rules,
                failed_rules,
                error_rules
            FROM engine.migration_control_summary
            WHERE batch_id = %s
            ORDER BY control_id
        """
        return self.db.execute(query, (batch_id,))

    def get_batch_status(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                overall_status,
                overall_score,
                execution_start,
                execution_end
            FROM engine.migration_validation_batch
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None
