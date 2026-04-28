from app.execution_engine import ExecutionEngine


class ExecutionService:

    def run(self, project_id):
        engine = ExecutionEngine(project_id=project_id)
        engine.run()

        return {
            "status": "completed",
            "project_id": project_id
        }