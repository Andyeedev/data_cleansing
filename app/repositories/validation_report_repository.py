from app.db.connection import get_db_connection


class ValidationReportRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_batch_info(self, batch_id: str):
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

    def get_governance_decision(self, batch_id: str):
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

    def get_risk_score(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                risk_score,
                risk_level,
                calculated_timestamp
            FROM engine.migration_risk_scores
            WHERE batch_id = %s
            ORDER BY calculated_timestamp DESC
            LIMIT 1
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

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

    def get_batch_score(self, batch_id: str):
        query = """
            SELECT
                execution_status,
                COALESCE(severity_level, 'LOW')
            FROM engine.migration_control_execution
            WHERE batch_id = %s
        """
        return self.db.execute(query, (batch_id,))
