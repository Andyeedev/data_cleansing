from app.repositories.execution_control_repository import ExecutionControlRepository
from app.services.execution_service import ExecutionService


class ExecutionControlService:

    def __init__(self):
        self.repository = ExecutionControlRepository()

    def cancel_execution(self, batch_id: str):
        batch = self.repository.get_batch_status(batch_id)
        if not batch:
            return None

        current_status = batch[1]
        if current_status not in ('RUNNING', 'PENDING'):
            return {"error": f"Cannot cancel execution in status: {current_status}"}

        self.repository.update_batch_status(batch_id, 'CANCELLED')

        return {
            "message": "Execution cancelled successfully",
            "batch_id": batch_id,
            "status": "CANCELLED"
        }

    def pause_execution(self, batch_id: str):
        batch = self.repository.get_batch_status(batch_id)
        if not batch:
            return None

        current_status = batch[1]
        if current_status != 'RUNNING':
            return {"error": f"Cannot pause execution in status: {current_status}"}

        self.repository.update_batch_status(batch_id, 'PAUSED')

        return {
            "message": "Execution paused successfully",
            "batch_id": batch_id,
            "status": "PAUSED"
        }

    def resume_execution(self, batch_id: str):
        batch = self.repository.get_batch_status(batch_id)
        if not batch:
            return None

        current_status = batch[1]
        if current_status != 'PAUSED':
            return {"error": f"Cannot resume execution in status: {current_status}"}

        self.repository.update_batch_status(batch_id, 'RUNNING')

        return {
            "message": "Execution resumed successfully",
            "batch_id": batch_id,
            "status": "RUNNING"
        }

    def retry_execution(self, batch_id: str):
        batch = self.repository.get_batch_status(batch_id)
        if not batch:
            return None

        current_status = batch[1]
        if current_status not in ('FAILED', 'CANCELLED'):
            return {"error": f"Cannot retry execution in status: {current_status}"}

        self.repository.update_batch_status(batch_id, 'RUNNING')

        return {
            "message": "Execution retry triggered",
            "batch_id": batch_id,
            "status": "RUNNING"
        }

    def get_lifecycle(self, batch_id: str):
        checkpoint = self.repository.get_batch_checkpoint(batch_id)
        if not checkpoint:
            return {
                "batch_id": batch_id,
                "last_completed_control": None
            }

        return {
            "batch_id": batch_id,
            "last_completed_control": checkpoint[1]
        }

    def get_progress(self, batch_id: str):
        progress = self.repository.get_progress(batch_id)
        if not progress:
            return None

        total = progress[2] or 0
        completed = progress[3] or 0
        failed = progress[4] or 0
        percentage = round((completed / total) * 100) if total > 0 else 0

        return {
            "batch_id": batch_id,
            "status": progress[1],
            "total_controls": total,
            "completed_controls": completed,
            "failed_controls": failed,
            "progress": f"{completed}/{total}",
            "percentage": percentage
        }
