from app.execution_engine import ExecutionEngine
from app.db.connection import get_db_connection


class ExecutionService:

    def run_legacy(self, project_id):

        # ✅ BUILD CONFIG (minimal working config)
        config = {
            "project_id": project_id,

            # Engine DB (your platform DB)
            "engine_db": {
                "type": "POSTGRES",
                "host": "localhost",
                "port": 5432,
                "database": "migration_engine",
                "user": "postgres",
                "password": "dev123456"
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

    def run(self, project_id):

        # ✅ REAL DB CONNECTION (NOT dict)
        engine_db = get_db_connection()

        config = {
            "project_id": project_id,
            "engine_db": engine_db
        }

        engine = ExecutionEngine(config=config)
        engine.run()

        return {
            "status": "completed",
            "project_id": project_id
        }