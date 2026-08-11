from app.repositories.schedule_repository import ScheduleRepository
from app.db.connection import get_db_connection


class MigrationTimelineService:

    def __init__(self):
        self.repository = ScheduleRepository()

    def get_timeline_summary(self, tenant_id: str = None):
        conn = get_db_connection()
        try:
            if tenant_id:
                query = """
                    SELECT
                        COUNT(CASE WHEN sel.status = 'running' THEN 1 END) as running,
                        COUNT(CASE WHEN sel.status = 'completed' AND sel.completed_at::date = CURRENT_DATE THEN 1 END) as completed_today,
                        COUNT(CASE WHEN sel.status = 'failed' THEN 1 END) as failed_total,
                        COUNT(CASE WHEN sel.status = 'scheduled' THEN 1 END) as scheduled
                    FROM engine.schedule_execution_log sel
                    JOIN engine.migration_schedules s ON sel.schedule_id::text = s.schedule_id::text
                    WHERE s.tenant_id::text = %s
                """
                rows = conn.execute(query, (tenant_id,))
            else:
                query = """
                    SELECT
                        COUNT(CASE WHEN status = 'running' THEN 1 END) as running,
                        COUNT(CASE WHEN status = 'completed' AND completed_at::date = CURRENT_DATE THEN 1 END) as completed_today,
                        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_total,
                        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled
                    FROM engine.schedule_execution_log
                """
                rows = conn.execute(query)
            row = rows[0] if rows else (0, 0, 0, 0)
            return {
                "running": row[0] or 0,
                "completed_today": row[1] or 0,
                "failed_total": row[2] or 0,
                "scheduled": row[3] or 0,
            }
        finally:
            conn.close()

    def get_timeline(self, tenant_id: str = None, limit: int = 50, offset: int = 0):
        conn = get_db_connection()
        try:
            if tenant_id:
                query = """
                    SELECT
                        sel.execution_id,
                        sel.schedule_id,
                        sel.batch_id,
                        sel.status,
                        sel.started_at,
                        sel.completed_at,
                        sel.duration_seconds,
                        sel.terminal_output,
                        sel.error_message,
                        sel.exit_code,
                        sel.triggered_by,
                        sel.created_at,
                        p.project_name
                    FROM engine.schedule_execution_log sel
                    JOIN engine.migration_schedules s ON sel.schedule_id::text = s.schedule_id::text
                    LEFT JOIN core.projects p ON s.project_id::text = p.project_id::text
                    WHERE s.tenant_id::text = %s
                    ORDER BY sel.started_at DESC
                    LIMIT %s OFFSET %s
                """
                rows = conn.execute(query, (tenant_id, limit, offset))
            else:
                query = """
                    SELECT
                        sel.execution_id,
                        sel.schedule_id,
                        sel.batch_id,
                        sel.status,
                        sel.started_at,
                        sel.completed_at,
                        sel.duration_seconds,
                        sel.terminal_output,
                        sel.error_message,
                        sel.exit_code,
                        sel.triggered_by,
                        sel.created_at,
                        p.project_name
                    FROM engine.schedule_execution_log sel
                    LEFT JOIN engine.migration_schedules s ON sel.schedule_id::text = s.schedule_id::text
                    LEFT JOIN core.projects p ON s.project_id::text = p.project_id::text
                    ORDER BY sel.started_at DESC
                    LIMIT %s OFFSET %s
                """
                rows = conn.execute(query, (limit, offset))

            def truncate_error(error_msg):
                if not error_msg:
                    return None
                lines = error_msg.strip().split('\n')
                for line in lines:
                    line = line.strip()
                    if line and not line.startswith('Traceback') and not line.startswith('File') and not line.startswith('psycopg2'):
                        return line[:200]
                return lines[0][:200] if lines else None

            events = []
            for row in rows:
                events.append({
                    "id": str(row[0]),
                    "schedule_id": str(row[1]) if row[1] else None,
                    "batch_id": str(row[2]) if row[2] else None,
                    "status": row[3],
                    "started_at": str(row[4]) if row[4] else None,
                    "completed_at": str(row[5]) if row[5] else None,
                    "duration_seconds": row[6],
                    "terminal_output": row[7],
                    "error_message": truncate_error(row[8]),
                    "exit_code": row[9],
                    "triggered_by": row[10],
                    "created_at": str(row[11]) if row[11] else None,
                    "project_name": row[12],
                })

            grouped = {}
            for event in events:
                if event["started_at"]:
                    date_key = event["started_at"][:10]
                    label = date_key
                else:
                    date_key = "unknown"
                    label = "Unknown Date"
                if date_key not in grouped:
                    grouped[date_key] = {"date": date_key, "label": label, "events": []}
                grouped[date_key]["events"].append(event)

            return list(grouped.values())
        finally:
            conn.close()
