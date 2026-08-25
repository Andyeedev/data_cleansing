from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    def __init__(self):
        self.repository = DashboardRepository()

    def get_portfolio_summary(self, tenant_id: str = None):
        total_systems = self.repository.get_system_count(tenant_id)
        total_batches, active_batches = self.repository.get_batch_stats(tenant_id)
        total_controls = self.repository.get_total_controls(tenant_id)

        return {
            "total_systems": total_systems,
            "total_batches": total_batches,
            "total_controls": total_controls,
            "active_batches": active_batches
        }

    def get_kpis(self, tenant_id: str = None):
        stats = self.repository.get_batch_stats(tenant_id)
        total_batches = stats[0]
        active_batches = stats[1]

        kpis = [
            {"label": "Total Batches", "value": str(total_batches)},
            {"label": "Active Batches", "value": str(active_batches)},
            {"label": "Systems Managed", "value": str(self.repository.get_system_count(tenant_id))},
        ]

        return {"kpis": kpis}

    def get_activity(self, limit: int = 10, tenant_id: str = None):
        rows = self.repository.get_recent_activity(limit, tenant_id)
        entries = []
        for row in rows:
            entries.append({
                "id": str(row[0]),
                "action": row[1],
                "entity_type": row[2],
                "entity_id": str(row[3]),
                "user_email": row[4],
                "timestamp": str(row[5])
            })
        return {"entries": entries, "total": len(entries)}

    def get_control_results(self, tenant_id: str = None, limit: int = 20):
        rows = self.repository.get_control_results(tenant_id, limit)
        controls = []
        for row in rows:
            controls.append({
                "control_id": row[0],
                "control_name": row[1],
                "severity": row[2],
                "status": row[3],
                "total_rules": row[4],
                "passed_rules": row[5],
                "failed_rules": row[6],
                "error_rules": row[7],
                "skipped_rules": row[8],
                "pass_rate": float(row[9]) if row[9] else 0
            })
        return {"controls": controls}

    def get_recent_executions(self, tenant_id: str = None, limit: int = 10):
        rows = self.repository.get_recent_executions(tenant_id, limit)
        executions = []
        for row in rows:
            executions.append({
                "batch_id": row[0],
                "batch_name": row[1],
                "batch_status": row[2],
                "total_controls": row[3],
                "completed_controls": row[4],
                "failed_controls": row[5],
                "batch_start_time": str(row[6]) if row[6] else None
            })
        return {"executions": executions}
