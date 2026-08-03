import uuid
from datetime import datetime, timezone
from app.repositories.schedule_repository import ScheduleRepository


class ScheduleService:
    def __init__(self):
        self.repository = ScheduleRepository()

    def _row_to_schedule(self, row):
        if not row:
            return None
        return {
            "schedule_id": str(row[0]),
            "calendar_event_id": str(row[1]) if row[1] else None,
            "project_id": str(row[2]) if row[2] else None,
            "tenant_id": str(row[3]) if row[3] else None,
            "name": row[4],
            "description": row[5],
            "cron_expression": row[6],
            "timezone": row[7],
            "enabled": row[8],
            "status": row[9],
            "next_run": str(row[10]) if row[10] else None,
            "last_run": str(row[11]) if row[11] else None,
            "last_status": row[12],
            "execution_count": row[13],
            "failure_count": row[14],
            "created_at": str(row[15]) if row[15] else None,
            "updated_at": str(row[16]) if row[16] else None,
            "project_name": row[17],
            "tenant_name": row[18],
            "calendar_event_title": row[19],
            "calendar_event_type": row[20],
        }

    def _row_to_log(self, row):
        if not row:
            return None
        return {
            "execution_id": str(row[0]),
            "schedule_id": str(row[1]),
            "batch_id": str(row[2]) if row[2] else None,
            "status": row[3],
            "started_at": str(row[4]) if row[4] else None,
            "completed_at": str(row[5]) if row[5] else None,
            "duration_seconds": row[6],
            "terminal_output": row[7],
            "error_message": row[8],
            "exit_code": row[9],
            "triggered_by": row[10],
            "created_at": str(row[11]) if row[11] else None,
        }

    def _row_to_calendar_event(self, row):
        if not row:
            return None
        return {
            "event_id": str(row[0]),
            "title": row[1],
            "description": row[2],
            "type": row[3],
            "status": row[4],
            "start_time": str(row[5]) if row[5] else None,
            "end_time": str(row[6]) if row[6] else None,
            "recurrence": row[7],
            "project_id": str(row[8]) if row[8] else None,
            "tenant_id": str(row[9]) if row[9] else None,
            "schedule_id": str(row[10]) if row[10] else None,
            "schedule_name": row[11],
            "cron_expression": row[12],
        }

    def get_schedules(self, limit=50, offset=0, tenant_id=None, project_id=None):
        rows = self.repository.get_all_schedules(limit, offset, tenant_id, project_id)
        total = self.repository.get_total_count(tenant_id, project_id)
        schedules = [self._row_to_schedule(r) for r in rows]
        return {"items": schedules, "total": total}

    def get_schedule(self, schedule_id):
        row = self.repository.get_schedule_by_id(schedule_id)
        return self._row_to_schedule(row)

    def get_execution_logs(self, schedule_id, limit=20, offset=0):
        rows = self.repository.get_execution_logs(schedule_id, limit, offset)
        total = self.repository.get_execution_log_count(schedule_id)
        logs = [self._row_to_log(r) for r in rows]
        return {"items": logs, "total": total}

    def get_schedule_stats(self, tenant_id=None):
        row = self.repository.get_schedule_stats(tenant_id)
        pass_rate = self.repository.get_overall_pass_rate(tenant_id)
        return {
            "total_schedules": row[0] if row else 0,
            "running_schedules": row[1] if row else 0,
            "enabled_schedules": row[2] if row else 0,
            "total_runs": row[3] if row else 0,
            "pass_rate": pass_rate,
        }

    def get_calendar_events(self, tenant_id=None):
        rows = self.repository.get_calendar_events_for_schedules(tenant_id)
        return [self._row_to_calendar_event(r) for r in rows]

    def create_schedule(self, request):
        project_row = self.repository.db.execute(
            "SELECT project_id FROM core.projects WHERE project_id = %s",
            (request.project_id,)
        )
        if not project_row:
            raise ValueError(f"Project {request.project_id} does not exist")
        mapping_count = self.repository.db.execute(
            "SELECT COUNT(*) FROM core.dataset_mappings WHERE project_id = %s",
            (request.project_id,)
        )
        discovery_count = self.repository.db.execute(
            "SELECT COUNT(*) FROM core.column_mappings cm "
            "JOIN core.dataset_mappings dm ON cm.mapping_id = dm.mapping_id "
            "WHERE dm.project_id = %s",
            (request.project_id,)
        )
        if (mapping_count[0][0] if mapping_count else 0) == 0 and (discovery_count[0][0] if discovery_count else 0) == 0:
            raise ValueError(
                f"Project {request.project_id} has no dataset mappings or discovery data"
            )
        schedule_id = str(uuid.uuid4())
        query = """
            INSERT INTO engine.migration_schedules
            (schedule_id, project_id, tenant_id, name, description, cron_expression, timezone, enabled, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'pending')
        """
        self.repository.db.execute(query, (
            schedule_id, request.project_id, request.tenant_id,
            request.name, request.description, request.cron_expression,
            request.timezone, request.enabled
        ))
        return self.get_schedule(schedule_id)

    def update_schedule(self, schedule_id, request):
        updates = []
        params = []
        if request.name is not None:
            updates.append("name = %s")
            params.append(request.name)
        if request.description is not None:
            updates.append("description = %s")
            params.append(request.description)
        if request.cron_expression is not None:
            updates.append("cron_expression = %s")
            params.append(request.cron_expression)
        if request.timezone is not None:
            updates.append("timezone = %s")
            params.append(request.timezone)
        if request.enabled is not None:
            updates.append("enabled = %s")
            params.append(request.enabled)

        if not updates:
            return self.get_schedule(schedule_id)

        updates.append("updated_at = NOW()")
        params.append(schedule_id)

        query = f"""
            UPDATE engine.migration_schedules
            SET {', '.join(updates)}
            WHERE schedule_id = %s
        """
        self.repository.db.execute(query, tuple(params))
        return self.get_schedule(schedule_id)

    def toggle_schedule(self, schedule_id):
        query = """
            UPDATE engine.migration_schedules
            SET enabled = NOT enabled, updated_at = NOW()
            WHERE schedule_id = %s
        """
        self.repository.db.execute(query, (schedule_id,))
        return self.get_schedule(schedule_id)

    def delete_schedule(self, schedule_id):
        query = "DELETE FROM engine.migration_schedules WHERE schedule_id = %s"
        self.repository.db.execute(query, (schedule_id,))
