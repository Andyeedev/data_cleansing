from app.db.connection import get_db_connection


class ExecutionControlRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_batch_status(self, batch_id: str):
        query = """
            SELECT batch_id, batch_status
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def update_batch_status(self, batch_id: str, status: str):
        query = """
            UPDATE engine.migration_batch_registry
            SET batch_status = %s
            WHERE batch_id = %s
        """
        self.db.execute(query, (status, batch_id))

    def get_batch_checkpoint(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                last_completed_control,
                updated_at
            FROM engine.batch_execution_checkpoint
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_progress(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None
