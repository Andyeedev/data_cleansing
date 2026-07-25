from app.repositories.governance_repository import GovernanceRepository


class GovernanceService:

    def __init__(self):
        self.repository = GovernanceRepository()

    def get_audit_log(self, limit: int = 50, entity_type: str = None):
        try:
            rows = self.repository.get_audit_entries(limit, entity_type)
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
        except Exception:
            return {"entries": [], "total": 0}

    def get_approvals(self):
        try:
            rows = self.repository.get_pending_approvals()
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
        except Exception:
            return {"pending": [], "total": 0}

    def get_exceptions(self):
        try:
            rows = self.repository.get_exception_requests()
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
        except Exception:
            return {"exceptions": [], "total": 0}

    def get_compliance_status(self):
        return {
            "score": None,
            "total_controls": 0,
            "passed_controls": 0,
            "failed_controls": 0
        }
