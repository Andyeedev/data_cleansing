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

    def get_lifecycle_events(self, batch_id: str):
        query = """
            SELECT
                id,
                batch_id,
                event_type,
                event_timestamp,
                details
            FROM engine.migration_batch_lifecycle
            WHERE batch_id = %s
            ORDER BY event_timestamp ASC
        """
        return self.db.execute(query, (batch_id,))

    def insert_lifecycle_event(self, batch_id: str, event_type: str, details: str = None):
        query = """
            INSERT INTO engine.migration_batch_lifecycle
            (batch_id, event_type, details)
            VALUES (%s, %s, %s)
        """
        self.db.execute(query, (batch_id, event_type, details))

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
