from app.db.connection import get_db_connection


class MonitoringRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_execution_stats(self):
        query = """
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN batch_status = 'RUNNING' THEN 1 END) as running,
                COUNT(CASE WHEN batch_status = 'COMPLETED' THEN 1 END) as completed,
                COUNT(CASE WHEN batch_status = 'FAILED' THEN 1 END) as failed
            FROM engine.migration_batch_registry
        """
        rows = self.db.execute(query)
        return rows[0] if rows else (0, 0, 0, 0)

    def get_queue_items(self, limit: int = 10):
        query = """
            SELECT
                batch_id,
                project_id,
                batch_status,
                batch_start_time
            FROM engine.migration_batch_registry
            WHERE batch_status IN ('RUNNING', 'PENDING')
            ORDER BY batch_start_time DESC
            LIMIT %s
        """
        return self.db.execute(query, (limit,))

    def get_recent_executions(self, limit: int = 5):
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
            LIMIT %s
        """
        return self.db.execute(query, (limit,))
