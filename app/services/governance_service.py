from app.repositories.governance_repository import GovernanceRepository


class GovernanceService:

    def __init__(self):
        self.repository = GovernanceRepository()

    def get_overview(self, tenant_id: str = None):
        db = self.repository.db
        query = """
            SELECT
                COUNT(*) AS total_findings,
                SUM(CASE WHEN cause ILIKE '%%critical%%' OR cause ILIKE '%%fatal%%' THEN 1 ELSE 0 END) AS critical,
                SUM(CASE WHEN cause ILIKE '%%high%%' OR cause ILIKE '%%error%%' THEN 1 ELSE 0 END) AS high,
                SUM(CASE WHEN cause ILIKE '%%medium%%' OR cause ILIKE '%%warning%%' THEN 1 ELSE 0 END) AS medium,
                SUM(CASE WHEN cause ILIKE '%%low%%' OR cause ILIKE '%%info%%' THEN 1 ELSE 0 END) AS low
            FROM engine.migration_control_exceptions mce
            JOIN engine.migration_batch_registry mbr ON mce.batch_id = mbr.batch_id
            WHERE mbr.tenant_id = %s
        """
        rows = db.execute(query, (tenant_id,))
        if rows:
            total = rows[0][0] or 0
            critical = rows[0][1] or 0
            high = rows[0][2] or 0
            medium = rows[0][3] or 0
            low = rows[0][4] or 0
            open_count = total  # All exceptions are considered open
            return {
                "total_findings": total,
                "open": open_count,
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low
            }
        return {"total_findings": 0, "open": 0, "critical": 0, "high": 0, "medium": 0, "low": 0}

    def get_audit_log(self, limit: int = 50, entity_type: str = None, tenant_id: str = None):
        rows = self.repository.get_audit_entries(limit, entity_type, tenant_id)
        entries = []
        for row in rows:
            entries.append({
                "id": str(row[0]),
                "action": row[1],
                "entity_type": row[2],
                "entity_id": str(row[3]),
                "user_email": row[4],
                "timestamp": str(row[5]),
                "details": row[6] if row[6] else {}
            })
        return {"entries": entries, "total": len(entries)}

    def get_approvals(self, tenant_id: str = None):
        rows = self.repository.get_pending_approvals(tenant_id)
        pending = []
        for row in rows:
            pending.append({
                "id": str(row[0]),
                "entity_type": row[1],
                "entity_id": str(row[2]),
                "status": row[3],
                "requested_by": row[4],
                "created_at": str(row[5])
            })
        return {"pending": pending, "total": len(pending)}

    def get_exceptions(self, tenant_id: str = None):
        rows = self.repository.get_exception_requests(tenant_id)
        exceptions = []
        for row in rows:
            exceptions.append({
                "id": str(row[0]),
                "entity_type": row[1],
                "entity_id": str(row[2]),
                "reason": row[3],
                "status": row[4],
                "requested_by": row[5],
                "created_at": str(row[6])
            })
        return {"exceptions": exceptions, "total": len(exceptions)}

    def get_compliance_status(self, tenant_id: str = None):
        db = self.repository.db
        query = """
            SELECT
                COUNT(*) AS total_controls,
                SUM(CASE WHEN overall_status = 'PASS' THEN 1 ELSE 0 END) AS passed_controls,
                SUM(CASE WHEN overall_status IN ('FAIL', 'ERROR', 'BLOCKED') THEN 1 ELSE 0 END) AS failed_controls
            FROM engine.migration_control_summary mcs
            JOIN engine.migration_batch_registry mbr ON mcs.batch_id = mbr.batch_id
            WHERE mbr.tenant_id = %s
        """
        rows = db.execute(query, (tenant_id,))
        if rows:
            total = rows[0][0] or 0
            passed = rows[0][1] or 0
            failed = rows[0][2] or 0
            score = round((passed / total) * 100, 1) if total > 0 else None
            return {
                "score": score,
                "total_controls": total,
                "passed_controls": passed,
                "failed_controls": failed
            }
        return {"score": None, "total_controls": 0, "passed_controls": 0, "failed_controls": 0}

    def get_reconciliation(self, tenant_id: str = None, batch_id: str = None):
        """Get reconciliation data comparing source vs target for a batch."""
        db = self.repository.db
        
        query = """
            SELECT 
                mce.entity_name,
                mce.control_id,
                mce.rule_id,
                mce.cause,
                mce.failure_scope,
                mce.source_value,
                mce.target_value,
                mce.delta_value,
                mce.created_at
            FROM engine.migration_control_exceptions mce
            JOIN engine.migration_batch_registry mbr ON mce.batch_id = mbr.batch_id
            WHERE mbr.tenant_id = %s
        """
        params = [tenant_id]
        
        if batch_id:
            query += " AND mce.batch_id = %s"
            params = [tenant_id, batch_id]
        else:
            params = [tenant_id]
            
        query += " ORDER BY mce.created_at DESC LIMIT 1000"
        
        rows = self.repository.db.execute(query, tuple(params))
        
        discrepancies = []
        for row in rows:
            discrepancies.append({
                "entity": row[0],
                "control_id": row[1],
                "rule_id": row[1],
                "cause": row[3],
                "failure_scope": row[4],
                "source_value": row[5],
                "target_value": row[6],
                "delta": str(row[7]) if row[7] is not None else None,
                "detected_at": str(row[8]) if row[8] else None,
            })
        
        return {
            "tenant_id": tenant_id,
            "batch_id": batch_id,
            "total_discrepancies": len(discrepancies),
            "discrepancies": discrepancies
        }
