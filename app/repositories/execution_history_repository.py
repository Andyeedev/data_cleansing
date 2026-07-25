from app.db.connection import get_db_connection


class ExecutionHistoryRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_execution_history(self, page: int = 1, page_size: int = 20):
        offset = (page - 1) * page_size
        query = """
            SELECT
                batch_id,
                project_id,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls,
                batch_start_time,
                batch_end_time
            FROM engine.migration_batch_registry
            ORDER BY batch_start_time DESC
            LIMIT %s OFFSET %s
        """
        rows = self.db.execute(query, (page_size, offset))

        count_query = "SELECT COUNT(*) FROM engine.migration_batch_registry"
        count_result = self.db.execute(count_query)
        total = count_result[0][0] if count_result else 0

        return rows, total

    def get_execution_detail(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls,
                batch_start_time,
                batch_end_time
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_control_summaries(self, batch_id: str):
        query = """
            SELECT
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

    def get_control_executions(self, batch_id: str):
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

    def get_exceptions(self, batch_id: str):
        query = """
            SELECT
                exception_id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                source_value,
                target_value,
                delta_value,
                cause,
                failure_scope,
                created_at
            FROM engine.migration_control_exceptions
            WHERE batch_id = %s
            ORDER BY control_id, rule_id
        """
        return self.db.execute(query, (batch_id,))

    def get_governance(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                migration_status,
                blocking_controls,
                total_failed_rules,
                decision_time
            FROM engine.migration_governance_status
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_project_id_for_batch(self, batch_id: str):
        query = """
            SELECT project_id
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0][0] if rows else None
