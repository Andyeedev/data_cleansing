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
