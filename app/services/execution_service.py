import os
from app.execution_engine import ExecutionEngine
from app.db.connection import get_db_connection


class ExecutionService:

    def run_legacy(self, project_id):

        # Engine DB (your platform DB)
        engine_db_pass = os.getenv("ENGINE_DB_PASS")
        if not engine_db_pass:
            raise RuntimeError("CRITICAL SECURITY ERROR: ENGINE_DB_PASS is not configured.")

        config = {
            "project_id": project_id,

            # Engine DB (your platform DB)
            "engine_db": {
                "type": "POSTGRES",
                "host": os.getenv("ENGINE_DB_HOST", "localhost"),
                "port": int(os.getenv("ENGINE_DB_PORT", 5432)),
                "database": os.getenv("ENGINE_DB_NAME", "migration_engine"),
                "user": os.getenv("ENGINE_DB_USER", "postgres"),
                "password": engine_db_pass
            },

            # Will be overridden by ConnectionResolver
            "source_db": {},
            "target_db": {},

            "rules": {},
            "engine": {}
        }

        engine = ExecutionEngine(config=config)
        engine.run()

        return {
            "status": "completed",
            "project_id": project_id
        }

    def run_delete(self, project_id):

        # ✅ Get ENGINE DB connection (platform DB)
        engine_db = get_db_connection()

        # ✅ Minimal config (ONLY what engine needs)
        config = {
            "project_id": project_id,
            "engine_db": engine_db  # pass connection, not config
        }

        # ✅ Engine will resolve everything dynamically
        engine = ExecutionEngine(config=config)
        engine.run()

        return {
            "status": "completed",
            "project_id": project_id
        }

    def run(self, project_id, batch_id=None):

        # ✅ REAL DB CONNECTION (NOT dict)
        engine_db = get_db_connection()

        config = {
            "project_id": project_id,
            "engine_db": engine_db
        }

        # If batch_id is passed, the engine will use it (important for tracking)
        engine = ExecutionEngine(config=config, batch_id=batch_id)
        engine.run()

        return {
            "status": "triggered",
            "batch_id": engine.batch_id,
            "project_id": project_id
        }

    def get_status(self, batch_id):
        """
        Polls the database for the current status of a batch.
        """
        db = get_db_connection()
        query = """
            SELECT batch_status, total_controls, completed_controls, failed_controls
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = db.execute(query, (batch_id,))

        if not rows:
            return {"status": "NOT_FOUND", "batch_id": batch_id}

        row = rows[0]
        return {
            "batch_id": batch_id,
            "status": row[0],
            "total_controls": row[1],
            "completed_controls": row[2],
            "failed_controls": row[3],
            "progress": f"{row[2]}/{row[1]}" if row[1] > 0 else "0/0"
        }
