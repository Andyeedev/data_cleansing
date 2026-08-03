from app.repositories.execution_history_repository import ExecutionHistoryRepository
from app.services.execution_service import ExecutionService
from app.db.connection import get_db_connection


class ExecutionHistoryService:

    def __init__(self):
        self.repository = ExecutionHistoryRepository()

    def get_execution_history(self, page: int = 1, page_size: int = 100, tenant_id: str = None, status: str = None, search: str = None, sort_by: str = 'batch_start_time', sort_dir: str = 'desc'):
        rows, total = self.repository.get_execution_history(page, page_size, tenant_id, status, search, sort_by, sort_dir)
        items = [self._history_to_dict(r) for r in rows]

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size
        }

    def get_execution_detail(self, batch_id: str):
        batch = self.repository.get_execution_detail(batch_id)
        if not batch:
            return None

        control_summaries = self.repository.get_control_summaries(batch_id)
        controls = []
        for cs in control_summaries:
            controls.append({
                "control_id": cs[0],
                "overall_status": cs[1],
                "total_rules": cs[2],
                "passed_rules": cs[3],
                "failed_rules": cs[4],
                "error_rules": cs[5]
            })

        return {
            "batch_id": str(batch[0]),
            "project_id": str(batch[1]) if batch[1] else None,
            "batch_status": batch[2],
            "total_controls": batch[3],
            "completed_controls": batch[4],
            "failed_controls": batch[5],
            "batch_start_time": str(batch[6]) if batch[6] else None,
            "batch_end_time": str(batch[7]) if batch[7] else None,
            "control_summaries": controls
        }

    def re_execute(self, batch_id: str):
        project_id = self.repository.get_project_id_for_batch(batch_id)
        if not project_id:
            return None

        execution_service = ExecutionService()
        result = execution_service.run(str(project_id))

        return {
            "message": "Re-execution triggered successfully",
            "batch_id": result.get("batch_id"),
            "project_id": str(project_id),
            "status": "triggered"
        }

    def get_audit_trail(self, batch_id: str):
        control_executions = self.repository.get_control_executions(batch_id)
        exceptions = self.repository.get_exceptions(batch_id)
        governance = self.repository.get_governance(batch_id)

        executions_list = []
        for ce in control_executions:
            executions_list.append({
                "id": ce[0],
                "batch_id": str(ce[1]),
                "control_id": ce[2],
                "rule_id": ce[3],
                "entity_name": ce[4],
                "execution_status": ce[5],
                "delta_value": float(ce[6]) if ce[6] is not None else None,
                "execution_time_seconds": float(ce[7]) if ce[7] is not None else None,
                "severity_level": ce[8],
                "created_at": str(ce[9]) if ce[9] else None
            })

        exceptions_list = []
        for ex in exceptions:
            exceptions_list.append({
                "exception_id": str(ex[0]),
                "batch_id": str(ex[1]),
                "control_id": ex[2],
                "rule_id": ex[3],
                "entity_name": ex[4],
                "source_value": ex[5],
                "target_value": ex[6],
                "delta_value": float(ex[7]) if ex[7] is not None else None,
                "cause": ex[8],
                "failure_scope": ex[9],
                "created_at": str(ex[10]) if ex[10] else None
            })

        governance_dict = None
        if governance:
            governance_dict = {
                "batch_id": str(governance[0]),
                "project_id": str(governance[1]) if governance[1] else None,
                "migration_status": governance[2],
                "blocking_controls": governance[3],
                "total_failed_rules": governance[4],
                "decision_time": str(governance[5]) if governance[5] else None
            }

        return {
            "batch_id": batch_id,
            "control_executions": executions_list,
            "exceptions": exceptions_list,
            "governance": governance_dict
        }

    def get_batch_status_breakdown(self, tenant_id: str = None):
        breakdown, total, today_breakdown = self.repository.get_batch_status_breakdown(tenant_id)
        unscored = total - sum(breakdown.get(s, 0) for s in ['COMPLETED', 'RUNNING', 'FAILED', 'PENDING', 'PAUSED', 'CANCELLED'] if s in breakdown)
        return {
            "breakdown": breakdown,
            "total": total,
            "unscored": unscored,
            "today_breakdown": today_breakdown
        }

    def _history_to_dict(self, row):
        return {
            "batch_id": str(row[0]),
            "project_id": str(row[1]) if row[1] else None,
            "batch_status": row[2],
            "total_controls": row[3],
            "completed_controls": row[4],
            "failed_controls": row[5],
            "batch_start_time": str(row[6]) if row[6] else None,
            "batch_end_time": str(row[7]) if row[7] else None
        }
