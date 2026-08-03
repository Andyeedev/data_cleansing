from app.repositories.validation_report_repository import ValidationReportRepository
from app.scoring_engine import ScoringEngine
from app.db.connection import get_db_connection


class ValidationReportService:

    def __init__(self):
        self.repository = ValidationReportRepository()

    def get_validation_report(self, batch_id: str):
        batch_info = self.repository.get_batch_info(batch_id)
        if not batch_info:
            return None

        control_summaries = self.repository.get_control_summaries(batch_id)

        engine_db = get_db_connection()
        scoring_engine = ScoringEngine(engine_db, batch_id)
        overall_score = scoring_engine.calculate_overall()

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

        total_controls = sum(c["total_rules"] for c in controls)
        completed_controls = sum(c["passed_rules"] + c["failed_rules"] for c in controls)
        failed_controls = sum(c["failed_rules"] for c in controls)

        return {
            "batch_id": str(batch_info[0]),
            "project_id": str(batch_info[1]) if batch_info[1] else None,
            "overall_status": batch_info[2],
            "overall_score": float(batch_info[3]) if batch_info[3] else overall_score,
            "total_controls": total_controls,
            "completed_controls": completed_controls,
            "failed_controls": failed_controls,
            "control_summaries": controls,
            "started_at": str(batch_info[4]) if batch_info[4] else None,
            "completed_at": str(batch_info[5]) if batch_info[5] else None
        }

    def get_governance_decision(self, batch_id: str):
        decision = self.repository.get_governance_decision(batch_id)
        if not decision:
            return None

        return {
            "batch_id": str(decision[0]),
            "project_id": str(decision[1]) if decision[1] else None,
            "migration_status": decision[2],
            "blocking_controls": decision[3],
            "total_failed_rules": decision[4],
            "decision_time": str(decision[5]) if decision[5] else None
        }

    def get_risk_score(self, batch_id: str):
        risk = self.repository.get_risk_score(batch_id)
        if not risk:
            engine_db = get_db_connection()
            scoring_engine = ScoringEngine(engine_db, batch_id)
            score = scoring_engine.calculate_overall()

            if score >= 80:
                risk_level = "LOW"
            elif score >= 60:
                risk_level = "MEDIUM"
            elif score >= 40:
                risk_level = "HIGH"
            else:
                risk_level = "CRITICAL"

            return {
                "batch_id": batch_id,
                "risk_score": score,
                "risk_level": risk_level,
                "calculated_at": None
            }

        score = float(risk[3]) if risk[3] else 0
        risk_level = risk[6] if risk[6] else "LOW"

        return {
            "batch_id": str(risk[0]),
            "risk_score": score,
            "risk_level": risk_level,
            "calculated_at": None
        }

    def get_all_risk_scores(self, tenant_id: str = None):
        rows = self.repository.get_all_risk_scores(tenant_id)
        results = []
        for r in rows:
            results.append({
                "batch_id": str(r[0]),
                "risk_index": float(r[1]) if r[1] is not None else 0,
                "risk_level": r[2] if r[2] else "LOW",
                "total_rules": int(r[3]) if r[3] is not None else 0,
                "risk_points": int(r[4]) if r[4] is not None else 0,
                "failure_rate_percent": float(r[5]) if r[5] is not None else 0,
                "pass_rate_percent": float(r[6]) if r[6] is not None else 0,
            })
        return {"risk_scores": results, "total": len(results)}

    def get_migration_score_summary(self, tenant_id: str = None):
        rows = self.repository.get_migration_score_summary(tenant_id)
        results = []
        for r in rows:
            results.append({
                "batch_id": str(r[0]),
                "total_controls": int(r[1]) if r[1] is not None else 0,
                "passed_controls": int(r[2]) if r[2] is not None else 0,
                "pass_rate": float(r[3]) if r[3] is not None else 0,
            })
        return {"migration_scores": results, "total": len(results)}

    def get_unscored_batches(self, tenant_id: str = None):
        rows = self.repository.get_unscored_batches(tenant_id)
        results = []
        for r in rows:
            results.append({
                "batch_id": str(r[0]),
                "batch_status": r[1] if r[1] else "UNKNOWN",
                "project_id": str(r[2]) if r[2] else None,
            })
        return {"unscored_batches": results, "total": len(results)}

    def get_orphaned_batches(self, tenant_id: str = None):
        rows = self.repository.get_orphaned_batches(tenant_id)
        results = []
        for r in rows:
            results.append({
                "batch_id": str(r[0]),
                "batch_status": r[1] if r[1] else "ORPHANED",
                "project_id": str(r[2]) if r[2] else None,
            })
        return {"orphaned_batches": results, "total": len(results)}

    def get_compliance_checks(self, batch_id: str):
        exceptions = self.repository.get_exceptions(batch_id)

        total_exceptions = len(exceptions)
        critical_exceptions = 0
        high_exceptions = 0
        medium_exceptions = 0
        low_exceptions = 0

        exception_list = []
        for ex in exceptions:
            scope = ex[9] or "LOW"
            if scope.upper() == "CRITICAL":
                critical_exceptions += 1
            elif scope.upper() == "HIGH":
                high_exceptions += 1
            elif scope.upper() == "MEDIUM":
                medium_exceptions += 1
            else:
                low_exceptions += 1

            exception_list.append({
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

        return {
            "batch_id": batch_id,
            "total_exceptions": total_exceptions,
            "critical_exceptions": critical_exceptions,
            "high_exceptions": high_exceptions,
            "medium_exceptions": medium_exceptions,
            "low_exceptions": low_exceptions,
            "exceptions": exception_list
        }
