from app.db.connection import get_db_connection


class ScheduleRepository:
    def __init__(self):
        self.db = get_db_connection()

    def get_all_schedules(self, limit=50, offset=0, tenant_id=None, project_id=None):
        conditions = []
        params = []

        if tenant_id:
            conditions.append("s.tenant_id::text = %s")
            params.append(tenant_id)
        if project_id:
            conditions.append("s.project_id::text = %s")
            params.append(project_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        query = f"""
            SELECT
                s.schedule_id, s.calendar_event_id, s.project_id, s.tenant_id,
                s.name, s.description, s.cron_expression, s.timezone,
                s.enabled, s.status, s.next_run, s.last_run,
                s.last_status, s.execution_count, s.failure_count,
                s.created_at, s.updated_at,
                p.project_name,
                t.tenant_name,
                ce.title as calendar_event_title,
                ce.type as calendar_event_type
            FROM engine.migration_schedules s
            LEFT JOIN core.projects p ON s.project_id::text = p.project_id::text
            LEFT JOIN core.tenants t ON s.tenant_id::text = t.tenant_id::text
            LEFT JOIN platform.calendar_events ce ON s.calendar_event_id::text = ce.id::text
            {where}
            ORDER BY s.created_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([limit, offset])
        return self.db.execute(query, tuple(params))

    def get_total_count(self, tenant_id=None, project_id=None):
        conditions = []
        params = []
        if tenant_id:
            conditions.append("tenant_id::text = %s")
            params.append(tenant_id)
        if project_id:
            conditions.append("project_id::text = %s")
            params.append(project_id)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        query = f"SELECT COUNT(*) FROM engine.migration_schedules {where}"
        rows = self.db.execute(query, tuple(params))
        return rows[0][0] if rows else 0

    def get_schedule_by_id(self, schedule_id):
        query = """
            SELECT
                s.schedule_id, s.calendar_event_id, s.project_id, s.tenant_id,
                s.name, s.description, s.cron_expression, s.timezone,
                s.enabled, s.status, s.next_run, s.last_run,
                s.last_status, s.execution_count, s.failure_count,
                s.created_at, s.updated_at,
                p.project_name,
                t.tenant_name,
                ce.title as calendar_event_title,
                ce.type as calendar_event_type,
                ce.start_time as calendar_event_start,
                ce.recurrence as calendar_event_recurrence
            FROM engine.migration_schedules s
            LEFT JOIN core.projects p ON s.project_id::text = p.project_id::text
            LEFT JOIN core.tenants t ON s.tenant_id::text = t.tenant_id::text
            LEFT JOIN platform.calendar_events ce ON s.calendar_event_id::text = ce.id::text
            WHERE s.schedule_id = %s
        """
        rows = self.db.execute(query, (schedule_id,))
        return rows[0] if rows else None

    def get_execution_logs(self, schedule_id, limit=20, offset=0):
        query = """
            SELECT
                el.execution_id, el.schedule_id, el.batch_id, el.status,
                el.started_at, el.completed_at, el.duration_seconds,
                el.terminal_output, el.error_message, el.exit_code,
                el.triggered_by, el.created_at
            FROM engine.schedule_execution_log el
            WHERE el.schedule_id = %s
            ORDER BY el.started_at DESC
            LIMIT %s OFFSET %s
        """
        return self.db.execute(query, (schedule_id, limit, offset))

    def get_execution_log_count(self, schedule_id):
        query = """
            SELECT COUNT(*)
            FROM engine.schedule_execution_log el
            WHERE el.schedule_id = %s
        """
        rows = self.db.execute(query, (schedule_id,))
        return rows[0][0] if rows else 0

    def get_schedule_stats(self, tenant_id=None):
        tenant_filter = ""
        params = []
        if tenant_id:
            tenant_filter = "WHERE s.tenant_id::text = %s"
            params.append(tenant_id)

        query = f"""
            SELECT
                COUNT(*) as total_schedules,
                SUM(CASE WHEN s.status = 'running' THEN 1 ELSE 0 END) as running_schedules,
                SUM(CASE WHEN s.enabled THEN 1 ELSE 0 END) as enabled_schedules,
                COALESCE(SUM(s.execution_count), 0) as total_runs
            FROM engine.migration_schedules s
            {tenant_filter}
        """
        rows = self.db.execute(query, tuple(params))
        return rows[0] if rows else (0, 0, 0, 0)

    def get_overall_pass_rate(self, tenant_id=None):
        tenant_filter = ""
        params = []
        if tenant_id:
            tenant_filter = "AND s.tenant_id::text = %s"
            params.append(tenant_id)

        query = f"""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN el.status = 'completed' THEN 1 ELSE 0 END) as passed
            FROM engine.schedule_execution_log el
            JOIN engine.migration_schedules s ON el.schedule_id::text = s.schedule_id::text
            WHERE el.status IN ('completed', 'failed')
            {tenant_filter}
        """
        rows = self.db.execute(query, tuple(params))
        if rows and rows[0][0] > 0:
            return round((rows[0][1] / rows[0][0]) * 100, 1)
        return 100.0

    def get_calendar_events_for_schedules(self, tenant_id=None):
        tenant_filter = ""
        params = []
        if tenant_id:
            tenant_filter = "AND s.tenant_id::text = %s"
            params.append(tenant_id)

        query = f"""
            SELECT
                ce.id, ce.title, ce.description, ce.type, ce.status,
                ce.start_time, ce.end_time, ce.recurrence,
                ce.project_id, ce.tenant_id,
                s.schedule_id, s.name as schedule_name, s.cron_expression
            FROM platform.calendar_events ce
            JOIN engine.migration_schedules s ON ce.id::text = s.calendar_event_id::text
            WHERE ce.deleted_at IS NULL
            {tenant_filter}
            ORDER BY ce.start_time ASC
        """
        return self.db.execute(query, tuple(params))
