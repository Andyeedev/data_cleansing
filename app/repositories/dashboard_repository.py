from app.db.connection import get_db_connection


class DashboardRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_system_count(self):
        query = "SELECT COUNT(*) FROM engine.systems"
        rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_batch_stats(self):
        query = """
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN batch_status = 'RUNNING' THEN 1 END) as active
            FROM engine.migration_batch_registry
        """
        rows = self.db.execute(query)
        if rows:
            return rows[0][0], rows[0][1]
        return 0, 0

    def get_total_controls(self):
        query = "SELECT COUNT(*) FROM engine.controls"
        rows = self.db.execute(query)
        return rows[0][0] if rows else 0

    def get_recent_activity(self, limit: int = 10):
        query = """
            SELECT
                id,
                action,
                entity_type,
                entity_id,
                user_email,
                timestamp
            FROM engine.audit_log
            ORDER BY timestamp DESC
            LIMIT %s
        """
        return self.db.execute(query, (limit,))
