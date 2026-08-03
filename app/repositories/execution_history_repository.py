from app.db.connection import get_db_connection


class ExecutionHistoryRepository:

    def __init__(self):
        self.db = get_db_connection()

    ALLOWED_SORT_FIELDS = {
        'batch_id', 'batch_status', 'total_controls', 'completed_controls',
        'failed_controls', 'batch_start_time'
    }

    def get_execution_history(self, page: int = 1, page_size: int = 100, tenant_id: str = None, status: str = None, search: str = None, sort_by: str = 'batch_start_time', sort_dir: str = 'desc'):
        offset = (page - 1) * page_size

        if sort_by not in self.ALLOWED_SORT_FIELDS:
            sort_by = 'batch_start_time'
        sort_dir = 'ASC' if sort_dir.lower() == 'asc' else 'DESC'

        search_clause = ""
        search_params = []
        if search:
            search_clause = " AND (batch_id::text ILIKE %s OR batch_status ILIKE %s OR project_id::text ILIKE %s)"
            search_term = f"%{search}%"
            search_params = [search_term, search_term, search_term]

        if tenant_id:
            query = """
                SELECT
                    b.batch_id,
                    b.project_id,
                    b.batch_status,
                    b.total_controls,
                    b.completed_controls,
                    b.failed_controls,
                    b.batch_start_time,
                    b.batch_end_time
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
            """
            params = [tenant_id]

            if status:
                query += " AND b.batch_status = %s"
                params.append(status)

            if search:
                query += f" AND (b.batch_id::text ILIKE %s OR b.batch_status ILIKE %s OR b.project_id::text ILIKE %s)"
                search_term = f"%{search}%"
                params.extend([search_term, search_term, search_term])

            count_query = """
                SELECT COUNT(*)
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
            """
            count_params = [tenant_id]
            if status:
                count_query += " AND b.batch_status = %s"
                count_params.append(status)
            if search:
                count_query += f" AND (b.batch_id::text ILIKE %s OR b.batch_status ILIKE %s OR b.project_id::text ILIKE %s)"
                search_term = f"%{search}%"
                count_params.extend([search_term, search_term, search_term])
        else:
            query = """
                SELECT
                    batch_id,
                    project_id,
                    batch_status,
                    total_controls,
                    completed_controls,
                    failed_controls,
                    batch_start_time,
                    batch_end_time
                FROM engine.migration_batch_registry
                WHERE 1=1
            """
            params = []

            if status:
                query += " AND batch_status = %s"
                params.append(status)

            if search:
                query += f" AND (batch_id::text ILIKE %s OR batch_status ILIKE %s OR project_id::text ILIKE %s)"
                search_term = f"%{search}%"
                params.extend([search_term, search_term, search_term])

            count_query = "SELECT COUNT(*) FROM engine.migration_batch_registry WHERE 1=1"
            count_params = []
            if status:
                count_query += " AND batch_status = %s"
                count_params.append(status)
            if search:
                count_query += f" AND (batch_id::text ILIKE %s OR batch_status ILIKE %s OR project_id::text ILIKE %s)"
                search_term = f"%{search}%"
                count_params.extend([search_term, search_term, search_term])

        query += f" ORDER BY {sort_by} {sort_dir} NULLS LAST LIMIT %s OFFSET %s"
        params.extend([page_size, offset])
        rows = self.db.execute(query, tuple(params))

        count_result = self.db.execute(count_query, tuple(count_params))

        total = count_result[0][0] if count_result else 0

        return rows, total

    def get_execution_detail(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls,
                batch_start_time,
                batch_end_time
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_control_summaries(self, batch_id: str):
        query = """
            SELECT
                control_id,
                overall_status,
                total_rules,
                passed_rules,
                failed_rules,
                error_rules
            FROM engine.migration_control_summary
            WHERE batch_id = %s
            ORDER BY control_id
        """
        return self.db.execute(query, (batch_id,))

    def get_control_executions(self, batch_id: str):
        query = """
            SELECT
                id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                execution_status,
                delta_value,
                execution_time_seconds,
                severity_level,
                created_at
            FROM engine.migration_control_execution
            WHERE batch_id = %s
            ORDER BY control_id, rule_id
        """
        return self.db.execute(query, (batch_id,))

    def get_exceptions(self, batch_id: str):
        query = """
            SELECT
                exception_id,
                batch_id,
                control_id,
                rule_id,
                entity_name,
                source_value,
                target_value,
                delta_value,
                cause,
                failure_scope,
                created_at
            FROM engine.migration_control_exceptions
            WHERE batch_id = %s
            ORDER BY control_id, rule_id
        """
        return self.db.execute(query, (batch_id,))

    def get_governance(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                migration_status,
                blocking_controls,
                total_failed_rules,
                decision_time
            FROM engine.migration_governance_status
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_batch_status_breakdown(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT b.batch_status, COUNT(*) as count
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                GROUP BY b.batch_status
                ORDER BY b.batch_status
            """
            rows = self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT batch_status, COUNT(*) as count
                FROM engine.migration_batch_registry
                GROUP BY batch_status
                ORDER BY batch_status
            """
            rows = self.db.execute(query)
        breakdown = {}
        total = 0
        for row in rows:
            breakdown[row[0]] = row[1]
            total += row[1]

        today_query = """
            SELECT el.status, COUNT(*) as count
            FROM engine.schedule_execution_log el
            JOIN engine.migration_schedules s ON el.schedule_id::text = s.schedule_id::text
            WHERE el.started_at >= CURRENT_DATE
        """
        today_params = []
        if tenant_id:
            today_query += " AND s.tenant_id::text = %s"
            today_params.append(tenant_id)
        today_query += " GROUP BY el.status ORDER BY el.status"
        today_rows = self.db.execute(today_query, tuple(today_params))
        today_breakdown = {}
        for row in today_rows:
            today_breakdown[row[0]] = row[1]

        scheduled_query = """
            SELECT COUNT(*) as count
            FROM engine.schedule_execution_log el
            JOIN engine.migration_schedules s ON el.schedule_id::text = s.schedule_id::text
            WHERE el.started_at >= CURRENT_DATE
              AND el.triggered_by = 'scheduled'
        """
        scheduled_params = []
        if tenant_id:
            scheduled_query += " AND s.tenant_id::text = %s"
            scheduled_params.append(tenant_id)
        scheduled_rows = self.db.execute(scheduled_query, tuple(scheduled_params))
        today_breakdown['scheduled'] = scheduled_rows[0][0] if scheduled_rows else 0

        return breakdown, total, today_breakdown

    def get_project_id_for_batch(self, batch_id: str):
        query = """
            SELECT project_id
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0][0] if rows else None
