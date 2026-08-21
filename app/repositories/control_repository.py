from typing import Optional, List
from app.db.connection import get_db_connection


class ControlRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_all_controls(self, search: str = None, severity: str = None, status: str = None, tenant_id: str = None) -> List:
        query = """
            SELECT control_id, control_name, description, severity_level, enabled_flag, created_at, project_id
            FROM engine.control_registry
            WHERE 1=1
        """
        params = []

        if search:
            query += " AND (control_id ILIKE %s OR control_name ILIKE %s OR description ILIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])

        if severity and severity != 'all':
            query += " AND severity_level = %s"
            params.append(severity)

        if status and status != 'all':
            if status == 'enabled':
                query += " AND enabled_flag = TRUE"
            elif status == 'disabled':
                query += " AND enabled_flag = FALSE"

        query += " ORDER BY control_id"
        return self.db.execute(query, tuple(params) if params else None)

    def get_control_by_id(self, control_id: str) -> Optional[tuple]:
        query = """
            SELECT control_id, control_name, description, severity_level, enabled_flag, created_at, project_id
            FROM engine.control_registry
            WHERE control_id = %s
        """
        rows = self.db.execute(query, (control_id,))
        return rows[0] if rows else None

    def update_control(self, control_id: str, updates: dict) -> bool:
        set_clauses = []
        params = []

        if 'control_name' in updates:
            set_clauses.append("control_name = %s")
            params.append(updates['control_name'])
        if 'description' in updates:
            set_clauses.append("description = %s")
            params.append(updates['description'])
        if 'severity_level' in updates:
            set_clauses.append("severity_level = %s")
            params.append(updates['severity_level'])
        if 'enabled_flag' in updates:
            set_clauses.append("enabled_flag = %s")
            params.append(updates['enabled_flag'])

        if not set_clauses:
            return False

        params.append(control_id)
        query = f"UPDATE engine.control_registry SET {', '.join(set_clauses)} WHERE control_id = %s"
        self.db.execute(query, tuple(params))
        return True

    def create_control(self, control_id: str, control_name: str, description: str,
                       severity_level: str, enabled_flag: bool = True) -> bool:
        query = """
            INSERT INTO engine.control_registry (control_id, control_name, description, severity_level, enabled_flag)
            VALUES (%s, %s, %s, %s, %s)
        """
        self.db.execute(query, (control_id, control_name, description, severity_level, enabled_flag))
        return True

    def delete_control(self, control_id: str) -> bool:
        query = "DELETE FROM engine.control_registry WHERE control_id = %s"
        self.db.execute(query, (control_id,))
        return True

    def get_execution_outcomes(self, tenant_id: str = None) -> dict:
        """Aggregate control execution outcomes from migration_control_summary."""
        if tenant_id:
            query = """
                SELECT
                    cs.overall_status,
                    COUNT(*) as cnt
                FROM engine.migration_control_summary cs
                JOIN engine.migration_batch_registry b ON b.batch_id = cs.batch_id
                JOIN core.projects p ON p.project_id::text = b.project_id
                WHERE p.tenant_id::text = %s
                GROUP BY cs.overall_status
            """
            params = (tenant_id,)
        else:
            query = """
                SELECT
                    overall_status,
                    COUNT(*) as cnt
                FROM engine.migration_control_summary
                GROUP BY overall_status
            """
            params = None

        rows = self.db.execute(query, params)
        status_counts = {row[0]: row[1] for row in rows}

        passed = status_counts.get("PASS", 0)
        attention = status_counts.get("FAIL", 0)
        critical = status_counts.get("BLOCKED", 0) + status_counts.get("ERROR", 0)
        skipped = status_counts.get("SKIPPED", 0)
        total = passed + attention + critical + skipped

        disabled_query = """
            SELECT COUNT(*) FROM engine.control_registry WHERE enabled_flag = FALSE
        """
        disabled_rows = self.db.execute(disabled_query)
        disabled = disabled_rows[0][0] if disabled_rows else 0

        return {
            "passed": passed,
            "attention": attention,
            "critical": critical,
            "disabled": disabled,
            "skipped": skipped,
            "total_executed": total,
            "total_controls": total + disabled,
        }

    def get_per_control_outcomes(self, tenant_id: str = None) -> List:
        """Get latest outcome per control for the tenant."""
        if tenant_id:
            query = """
                SELECT DISTINCT ON (cs.control_id)
                    cs.control_id,
                    cs.overall_status,
                    cs.total_rules,
                    cs.passed_rules,
                    cs.failed_rules,
                    cs.error_rules,
                    cs.skipped_rules
                FROM engine.migration_control_summary cs
                JOIN engine.migration_batch_registry b ON b.batch_id = cs.batch_id
                JOIN core.projects p ON p.project_id::text = b.project_id
                WHERE p.tenant_id::text = %s
                ORDER BY cs.control_id, cs.created_at DESC
            """
            params = (tenant_id,)
        else:
            query = """
                SELECT DISTINCT ON (control_id)
                    control_id,
                    overall_status,
                    total_rules,
                    passed_rules,
                    failed_rules,
                    error_rules,
                    skipped_rules
                FROM engine.migration_control_summary
                ORDER BY control_id, created_at DESC
            """
            params = None

        return self.db.execute(query, params)
