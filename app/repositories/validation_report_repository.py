from app.db.connection import get_db_connection


class ValidationReportRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_batch_info(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                project_id,
                batch_status,
                NULL::numeric as overall_score,
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
                error_rules,
                COALESCE(skipped_rules, 0) AS skipped_rules
            FROM engine.migration_control_summary
            WHERE batch_id = %s
            ORDER BY control_id
        """
        return self.db.execute(query, (batch_id,))

    def get_governance_decision(self, batch_id: str):
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

    def get_risk_score(self, batch_id: str):
        query = """
            SELECT
                batch_id,
                risk_index,
                risk_level,
                total_rules,
                risk_points,
                failure_rate_percent,
                pass_rate_percent
            FROM engine.v_batch_risk_index
            WHERE batch_id = %s
        """
        rows = self.db.execute(query, (batch_id,))
        return rows[0] if rows else None

    def get_all_risk_scores(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT
                    vbri.batch_id,
                    vbri.risk_index,
                    vbri.risk_level,
                    vbri.total_rules,
                    vbri.risk_points,
                    vbri.failure_rate_percent,
                    vbri.pass_rate_percent
                FROM engine.v_batch_risk_index vbri
                JOIN engine.migration_batch_registry b ON vbri.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                ORDER BY vbri.risk_index DESC
            """
            return self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT
                    batch_id,
                    risk_index,
                    risk_level,
                    total_rules,
                    risk_points,
                    failure_rate_percent,
                    pass_rate_percent
                FROM engine.v_batch_risk_index
                ORDER BY risk_index DESC
            """
            return self.db.execute(query)

    def get_migration_score_summary(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT
                    v.batch_id,
                    v.total_controls,
                    v.passed_controls,
                    v.pass_rate
                FROM engine.v_migration_score_summary v
                JOIN engine.migration_batch_registry b ON v.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                ORDER BY v.batch_id
            """
            return self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT
                    batch_id,
                    total_controls,
                    passed_controls,
                    pass_rate
                FROM engine.v_migration_score_summary
                ORDER BY batch_id
            """
            return self.db.execute(query)

    def get_exceptions(self, batch_id: str):
        query = """
            SELECT
                id,
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

    def get_unscored_batches(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT b.batch_id, b.batch_status, b.project_id
                FROM engine.migration_batch_registry b
                JOIN core.projects p ON b.project_id = p.project_id::text
                LEFT JOIN engine.v_batch_risk_index vbri ON b.batch_id = vbri.batch_id
                WHERE p.tenant_id::text = %s
                AND vbri.batch_id IS NULL
                ORDER BY b.batch_id
            """
            return self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT b.batch_id, b.batch_status, b.project_id
                FROM engine.migration_batch_registry b
                LEFT JOIN engine.v_batch_risk_index vbri ON b.batch_id = vbri.batch_id
                WHERE vbri.batch_id IS NULL
                ORDER BY b.batch_id
            """
            return self.db.execute(query)

    def get_orphaned_batches(self, tenant_id: str = None):
        if tenant_id:
            query = """
                SELECT vbri.batch_id, 'ORPHANED' as batch_status, NULL::text as project_id
                FROM engine.v_batch_risk_index vbri
                JOIN engine.migration_batch_registry b ON vbri.batch_id = b.batch_id
                JOIN core.projects p ON b.project_id = p.project_id::text
                WHERE p.tenant_id::text = %s
                AND vbri.batch_id NOT IN (
                    SELECT batch_id FROM engine.migration_batch_registry
                )
                ORDER BY vbri.batch_id
            """
            return self.db.execute(query, (tenant_id,))
        else:
            query = """
                SELECT vbri.batch_id, 'ORPHANED' as batch_status, NULL::text as project_id
                FROM engine.v_batch_risk_index vbri
                LEFT JOIN engine.migration_batch_registry b ON vbri.batch_id = b.batch_id
                WHERE b.batch_id IS NULL
                ORDER BY vbri.batch_id
            """
            return self.db.execute(query)

    def get_batch_score(self, batch_id: str):
        query = """
            SELECT
                execution_status,
                COALESCE(severity_level, 'LOW')
            FROM engine.migration_control_execution
            WHERE batch_id = %s
        """
        return self.db.execute(query, (batch_id,))
