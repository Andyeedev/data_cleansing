"""
Run Orchestrator Service

Coordinates end-to-end validation runs across all workflow steps.
Reuses System 1 service classes for all step implementations — no duplicate logic.

Tracks run progress and step results in engine.e2e_run_history.
"""

import uuid
import time
import json
from typing import Dict, List, Optional
from app.db.connection import get_db_connection
from app.utils.logger import get_logger

logger = get_logger(__name__)

STEP_ORDER = [
    "health_check",
    "auto_discovery",
    "mapping_verification",
    "rule_execution",
    "full_map_validation",
]


class RunOrchestratorService:

    def start_run(
        self,
        tenant_id: str,
        project_id: Optional[str] = None,
        controls: Optional[List[str]] = None,
        steps: Optional[List[str]] = None,
        user_id: str = "ANONYMOUS",
    ) -> Dict:
        """
        Start a new end-to-end run and register it in the tracking table.
        Creates its own DB connection (thread-safe).
        """
        db = get_db_connection()
        try:
            run_id = str(uuid.uuid4())

            query = """
                INSERT INTO engine.e2e_run_history
                (run_id, tenant_id, project_id, status, started_by)
                VALUES (%s, %s, %s, %s, %s)
            """
            db.execute(query, (run_id, tenant_id, project_id, "RUNNING", user_id))

            logger.info(f"Started E2E run {run_id} for tenant={tenant_id}")
            return {"run_id": run_id, "status": "RUNNING"}
        finally:
            db.close()

    def execute_run(
        self,
        run_id: str,
        tenant_id: str,
        project_id: Optional[str] = None,
        controls: Optional[List[str]] = None,
        steps: Optional[List[str]] = None,
        user_id: str = "ANONYMOUS",
    ) -> Dict:
        """
        Execute all configured steps for a run and persist results.
        Each step creates its own DB connection (thread-safe, no shared state).
        Each step reuses System 1's existing service classes.
        """
        self._ensure_controls_exist(tenant_id)
        steps_to_run = steps if steps else STEP_ORDER

        step_results = []
        errors = []
        batch_id = None

        for step in steps_to_run:
            result = {"step": step, "status": "PASSED", "details": None, "duration_ms": 0, "error": None}
            start = time.time()
            db = None

            try:
                if step == "health_check":
                    db = get_db_connection()
                    result["details"] = self._run_health_check(db, tenant_id, project_id)
                elif step == "auto_discovery":
                    db = get_db_connection()
                    result["details"] = self._run_discovery(db, tenant_id, project_id)
                elif step == "mapping_verification":
                    db = get_db_connection()
                    result["details"] = self._run_mapping_verification(db, tenant_id, project_id)
                elif step == "rule_execution":
                    db = get_db_connection()
                    result["details"] = self._run_rule_execution(db, tenant_id, project_id, controls)
                    batch_id = result["details"].get("batch_id")
                elif step == "full_map_validation":
                    result["details"] = self._run_full_map_validation(tenant_id, project_id, batch_id)
                else:
                    raise ValueError(f"Unknown step: {step}")

            except Exception as e:
                result["status"] = "FAILED"
                result["error"] = str(e)
                errors.append({"step": step, "error": str(e)})
                logger.error(f"E2E run step {step} failed: {e}")

            finally:
                if db is not None:
                    db.close()

            result["duration_ms"] = int((time.time() - start) * 1000)
            step_results.append(result)

            if result["status"] == "FAILED":
                break

        overall_status = "FAILED" if errors else "COMPLETED"

        update_db = get_db_connection()
        try:
            update_query = """
                UPDATE engine.e2e_run_history
                SET status = %s,
                    step_results = %s,
                    completed_at = CURRENT_TIMESTAMP,
                    duration_ms = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) * 1000,
                    error_message = %s
                WHERE run_id = %s
            """
            update_db.execute(
                update_query,
                (
                    overall_status,
                    json.dumps(step_results),
                    json.dumps(errors) if errors else None,
                    run_id,
                ),
            )
        finally:
            update_db.close()

        return {"run_id": run_id, "status": overall_status, "step_results": step_results, "errors": errors}

    STANDARD_CONTROLS = [
        ("C01", "Source-to-Target Record Completeness", "Validates record counts match between source and target", "HIGH"),
        ("C02", "Financial Value Integrity & Reconciliation", "Validates financial totals reconcile across systems", "CRITICAL"),
        ("C03", "Referential Integrity & Relationship Preservation", "Validates foreign key relationships are preserved", "HIGH"),
        ("C04", "Column Count Validation", "Validates column count matches source schema", "HIGH"),
        ("C05", "Null Drift Detection", "Detects unexpected null values in migrated data", "HIGH"),
        ("C06", "Duplicate Key Detection", "Detects duplicate primary keys in target", "CRITICAL"),
        ("C07", "Data Type Validation", "Validates data types match source schema", "HIGH"),
        ("C08", "Numeric Data Drift Detection", "Detects numeric value drift between source and target", "HIGH"),
        ("C09", "Referential Coverage Validation", "Validates all referenced records exist in target", "HIGH"),
        ("C010", "Schema Drift Detection", "Detects schema changes between source and target", "CRITICAL"),
    ]

    def _ensure_controls_exist(self, tenant_id: str) -> None:
        """Auto-seed standard controls if tenant has none. Called before every execution."""
        db = get_db_connection()
        try:
            row = db.execute(
                "SELECT COUNT(*) FROM engine.control_registry WHERE control_id IN (SELECT control_id FROM engine.control_registry LIMIT 1)"
            )
            total = row[0][0] if row else 0
            if total >= len(self.STANDARD_CONTROLS):
                return
            for ctrl in self.STANDARD_CONTROLS:
                db.execute(
                    """INSERT INTO engine.control_registry (control_id, control_name, description, severity_level, enabled_flag)
                       VALUES (%s, %s, %s, %s, TRUE)
                       ON CONFLICT (control_id) DO NOTHING""",
                    ctrl,
                )
            logger.info(f"Auto-seeded {len(self.STANDARD_CONTROLS)} standard controls")
        finally:
            db.close()

    def get_run_status(self, run_id: str) -> Dict:
        """Get detailed status of a specific run."""
        db = get_db_connection()
        try:
            query = """
                SELECT run_id, tenant_id, project_id, status, started_by,
                       started_at, completed_at, duration_ms, step_results,
                       controls, summary, error_message
                FROM engine.e2e_run_history
                WHERE run_id = %s
            """
            rows = db.execute(query, (run_id,))
            if not rows:
                return {"run_id": run_id, "status": "NOT_FOUND"}

            row = rows[0]
            return {
                "run_id": str(row[0]),
                "tenant_id": str(row[1]),
                "project_id": str(row[2]) if row[2] else None,
                "status": row[3],
                "started_by": str(row[4]),
                "started_at": str(row[5]),
                "completed_at": str(row[6]) if row[6] else None,
                "duration_ms": row[7],
                "step_results": row[8] if isinstance(row[8], list) else json.loads(row[8]) if row[8] else [],
                "controls": row[9] if isinstance(row[9], dict) else json.loads(row[9]) if row[9] else {},
                "summary": row[10] if isinstance(row[10], dict) else json.loads(row[10]) if row[10] else {},
                "error_message": row[11],
            }
        finally:
            db.close()

    def get_history(
        self,
        tenant_id: Optional[str] = None,
        limit: int = 50,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "started_at",
        sort_dir: str = "desc",
    ) -> Dict:
        """Get recent run history with pagination, filtering, sorting, and search."""
        db = get_db_connection()
        try:
            offset = (page - 1) * page_size

            allowed_sort_fields = {
                "run_id", "tenant_id", "project_id", "status", "started_at", "completed_at", "duration_ms"
            }
            sort_field = sort_by if sort_by in allowed_sort_fields else "started_at"
            # Custom sort for Execution Type: alphabetical by display label
            if sort_field == "execution_type":
                sort_field = """
                    CASE
                        WHEN step_results IS NULL THEN 5
                        WHEN jsonb_path_exists(step_results, '$[*] ? (@.step == "auto_discovery")') THEN 1
                        WHEN jsonb_path_exists(step_results, '$[*] ? (@.step == "health_check")') THEN 2
                        WHEN jsonb_path_exists(step_results, '$[*] ? (@.step == "full_map_validation")') THEN 3
                        WHEN jsonb_path_exists(step_results, '$[*] ? (@.step == "mapping_verification")') THEN 4
                        WHEN jsonb_path_exists(step_results, '$[*] ? (@.step == "rule_execution")') THEN 5
                        ELSE 6
                    END
                """
            sort_direction = "ASC" if sort_dir.lower() == "asc" else "DESC"

            where_clauses = []
            params = []

            if tenant_id:
                where_clauses.append("tenant_id = %s")
                params.append(tenant_id)

            if status and status != "all":
                where_clauses.append("status = %s")
                params.append(status)

            if search:
                where_clauses.append("(run_id::text ILIKE %s OR project_id::text ILIKE %s OR status ILIKE %s)")
                search_param = f"%{search}%"
                params.extend([search_param, search_param, search_param])

            where_sql = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""

            # Count total
            count_query = f"SELECT COUNT(*) FROM engine.e2e_run_history {where_sql}"
            count_rows = db.execute(count_query, tuple(params))
            total = count_rows[0][0] if count_rows else 0

            # Get paginated results
            query = f"""
                SELECT run_id, tenant_id, project_id, status, started_at, completed_at, duration_ms, step_results
                FROM engine.e2e_run_history
                {where_sql}
                ORDER BY {sort_field} {sort_direction}
                LIMIT %s OFFSET %s
            """
            params.extend([page_size, offset])
            rows = db.execute(query, tuple(params))

            results = []
            for row in rows:
                step_results = row[7]
                if isinstance(step_results, str):
                    import json
                    step_results = json.loads(step_results)
                results.append({
                    "run_id": str(row[0]),
                    "tenant_id": str(row[1]),
                    "project_id": str(row[2]) if row[2] else None,
                    "status": row[3],
                    "started_at": str(row[4]),
                    "completed_at": str(row[5]) if row[5] else None,
                    "duration_ms": row[6],
                    "step_results": step_results,
                })

            return {"items": results, "total": total, "page": page, "page_size": page_size}
        finally:
            db.close()

    def get_status_breakdown(self, tenant_id: Optional[str] = None) -> Dict:
        """Get status breakdown for KPI cards."""
        db = get_db_connection()
        try:
            where_sql = "WHERE tenant_id = %s" if tenant_id else ""
            params = (tenant_id,) if tenant_id else ()

            breakdown_query = f"""
                SELECT status, COUNT(*)
                FROM engine.e2e_run_history
                {where_sql}
                GROUP BY status
            """
            breakdown_rows = db.execute(breakdown_query, params)
            breakdown = {row[0]: row[1] for row in breakdown_rows}

            total_query = f"SELECT COUNT(*) FROM engine.e2e_run_history {where_sql}"
            total_rows = db.execute(total_query, params)
            total = total_rows[0][0] if total_rows else 0

            today_query = f"""
                SELECT status, COUNT(*)
                FROM engine.e2e_run_history
                {where_sql + (" AND " if where_sql else " WHERE ") + "started_at >= CURRENT_DATE"}
                GROUP BY status
            """
            today_rows = db.execute(today_query, params)
            today_breakdown = {row[0]: row[1] for row in today_rows}

            return {
                "breakdown": breakdown,
                "total": total,
                "today_breakdown": {
                    "completed": today_breakdown.get("COMPLETED", 0),
                    "scheduled": today_breakdown.get("RUNNING", 0) + today_breakdown.get("PENDING", 0),
                },
            }
        finally:
            db.close()

    def cancel_run(self, run_id: str) -> bool:
        """Cancel a running or pending run."""
        db = get_db_connection()
        try:
            query = """
                UPDATE engine.e2e_run_history
                SET status = 'CANCELLED', completed_at = CURRENT_TIMESTAMP
                WHERE run_id = %s AND status IN ('PENDING', 'RUNNING')
            """
            db.execute(query, (run_id,))

            check_query = "SELECT status FROM engine.e2e_run_history WHERE run_id = %s"
            rows = db.execute(check_query, (run_id,))
            if rows and rows[0][0] == "CANCELLED":
                return True
            return False
        finally:
            db.close()

    # ============== Step implementations (reuse System 1 services) ==============

    def _run_health_check(self, db, tenant_id: str, project_id: Optional[str]) -> Dict:
        """
        Step 1: Validate all database connections for tenant.
        Reuses SystemService from Migration → Connections → Test.
        """
        from app.services.system_service import SystemService

        system_service = SystemService(db.conn)
        systems = system_service.list_systems(tenant_id=tenant_id)

        if not systems:
            raise ValueError(f"No systems found for tenant {tenant_id}")

        results = {}
        all_passed = True

        for sys in systems:
            sys_id = sys["system_id"]
            try:
                test = system_service.test_connection(sys_id, tenant_id=tenant_id)
                results[sys_id] = test
                if not test.get("success", False):
                    all_passed = False
            except Exception as e:
                results[sys_id] = {"success": False, "message": str(e)}
                all_passed = False

        return {"connections_checked": len(results), "all_passed": all_passed, "results": results}

    def _run_discovery(self, db, tenant_id: str, project_id: Optional[str]) -> Dict:
        """
        Step 2: Auto-discover rules.
        Reuses DatasetDiscoveryService from Migration → Discovery → Auto Discovery.
        """
        if not project_id:
            project_query = "SELECT project_id FROM core.projects WHERE tenant_id = %s LIMIT 1"
            rows = db.execute(project_query, (tenant_id,))
            if rows:
                project_id = str(rows[0][0])

        if not project_id:
            raise ValueError(f"No project found for tenant {tenant_id}")

        from app.services.dataset_discovery_service import DatasetDiscoveryService

        discovery_service = DatasetDiscoveryService(db, project_id)
        discovery_service.discover()

        total_query = "SELECT COUNT(*) FROM engine.rule_registry WHERE tenant_id = %s"
        count_rows = db.execute(total_query, (tenant_id,))
        total_rules = count_rows[0][0] if count_rows else 0

        return {"rules_discovered": total_rules, "project_id": project_id}

    def _run_mapping_verification(self, db, tenant_id: str, project_id: Optional[str]) -> Dict:
        """
        Step 3: Verify dataset mappings exist and are active.
        Reuses MappingService from Migration → Mappings → Auto Map.
        """
        if not project_id:
            project_query = "SELECT project_id FROM core.projects WHERE tenant_id = %s LIMIT 1"
            rows = db.execute(project_query, (tenant_id,))
            if rows:
                project_id = str(rows[0][0])

        if not project_id:
            raise ValueError(f"No project found for tenant {tenant_id}")

        total_query = "SELECT COUNT(*) FROM core.dataset_mappings WHERE project_id = %s AND is_active = TRUE"
        count_rows = db.execute(total_query, (project_id,))
        active_mappings = count_rows[0][0] if count_rows else 0

        return {"active_mappings": active_mappings, "project_id": project_id}

    def _run_rule_execution(self, db, tenant_id: str, project_id: Optional[str], controls: Optional[List[str]]) -> Dict:
        """
        Step 4: Execute validation rules.
        Reuses ExecutionService from Migration → Schedules → Run / Execution → Start Migration.
        """
        if not project_id:
            project_query = "SELECT project_id FROM core.projects WHERE tenant_id = %s LIMIT 1"
            rows = db.execute(project_query, (tenant_id,))
            if rows:
                project_id = str(rows[0][0])

        if not project_id:
            raise ValueError(f"No project found for tenant {tenant_id}")

        from app.services.execution_service import ExecutionService

        execution_service = ExecutionService()
        result = execution_service.run(
            project_id=project_id,
            batch_name=f"e2e-run-{uuid.uuid4().hex[:8]}",
            tenant_id=tenant_id,
        )

        return {"batch_id": result.get("batch_id"), "project_id": project_id, "tenant_id": tenant_id, "controls": controls}

    def _run_full_map_validation(self, tenant_id: str, project_id: Optional[str], batch_id: Optional[str] = None) -> Dict:
        """
        Step 5: Run full MAP CLI validation (same as Schedule → Run).
        Executes python -m app.main run --config config.yaml as subprocess.
        This performs complete governance evaluation: anomaly intelligence, release gate, compliance.
        """
        import os
        import sys
        import subprocess
        import copy

        if not project_id:
            project_query = "SELECT project_id FROM core.projects WHERE tenant_id = %s LIMIT 1"
            db = get_db_connection()
            try:
                rows = db.execute(project_query, (tenant_id,))
                if rows:
                    project_id = str(rows[0][0])
            finally:
                db.close()

        if not project_id:
            raise ValueError(f"No project found for tenant {tenant_id}")

        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

        env = copy.deepcopy(os.environ)
        env["PYTHONPATH"] = project_root + os.pathsep + env.get("PYTHONPATH", "")

        cmd = [sys.executable, "-m", "app.main", "run", "--config", "config.yaml"]
        if project_id:
            cmd.extend(["--project-id", project_id])
        if tenant_id:
            cmd.extend(["--tenant-id", tenant_id])

        logger.info(f"Running MAP CLI: {' '.join(cmd)}")

        proc = subprocess.run(
            cmd,
            capture_output=True,
            timeout=3600,
            cwd=project_root,
            env=env,
            encoding="utf-8",
            errors="replace",
        )

        validation_result = {
            "batch_id": batch_id,
            "exit_code": proc.returncode,
            "stdout": proc.stdout[-5000:] if proc.stdout else "",
            "stderr": proc.stderr[-5000:] if proc.stderr else "",
            "success": proc.returncode == 0,
        }

        # If successful, read the governance tables written by MAP CLI
        if proc.returncode == 0 and batch_id:
            db = get_db_connection()
            try:
                gov_query = """
                    SELECT migration_status, blocking_controls, total_failed_rules
                    FROM engine.migration_governance_status
                    WHERE batch_id = %s
                    ORDER BY decision_time DESC LIMIT 1
                """
                gov_rows = db.execute(gov_query, (batch_id,))
                if gov_rows:
                    validation_result["governance_decision"] = {
                        "status": gov_rows[0][0],
                        "blocking_controls": gov_rows[0][1],
                        "total_failed_rules": gov_rows[0][2],
                    }

                summary_query = """
                    SELECT overall_status, total_controls, passed_controls, failed_controls,
                           error_controls, blocked_controls
                    FROM engine.migration_batch_summary
                    WHERE batch_id = %s
                """
                summary_rows = db.execute(summary_query, (batch_id,))
                if summary_rows:
                    validation_result["risk_score"] = {
                        "overall_status": summary_rows[0][0],
                        "total_controls": summary_rows[0][1],
                        "passed_controls": summary_rows[0][2],
                        "failed_controls": summary_rows[0][3],
                        "error_controls": summary_rows[0][4],
                        "blocked_controls": summary_rows[0][5],
                    }

                gate_query = """
                    SELECT gate_result, overall_status, decision_reason
                    FROM engine.migration_release_decision
                    WHERE batch_id = %s
                    ORDER BY created_at DESC LIMIT 1
                """
                gate_rows = db.execute(gate_query, (batch_id,))
                if gate_rows:
                    validation_result["release_gate"] = {
                        "gate_result": gate_rows[0][0],
                        "status": gate_rows[0][1],
                        "reason": gate_rows[0][2],
                    }

                intel_query = """
                    SELECT anomaly_score, anomaly_flag, auto_blocked, risk_heat_index
                    FROM engine.migration_batch_intelligence
                    WHERE batch_id = %s
                """
                intel_rows = db.execute(intel_query, (batch_id,))
                if intel_rows:
                    validation_result["anomaly_intelligence"] = {
                        "anomaly_score": intel_rows[0][0],
                        "anomaly_flag": intel_rows[0][1],
                        "auto_blocked": intel_rows[0][2],
                        "risk_heat_index": intel_rows[0][3],
                    }
            finally:
                db.close()

        if proc.returncode != 0:
            raise RuntimeError(f"MAP CLI failed with exit code {proc.returncode}: {proc.stderr[:500]}")

        return validation_result


orchestrator_service = RunOrchestratorService()
