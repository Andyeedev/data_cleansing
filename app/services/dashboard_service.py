from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    def __init__(self):
        self.repository = DashboardRepository()

    def get_portfolio_summary(self):
        total_systems = self.repository.get_system_count()
        total_batches, active_batches = self.repository.get_batch_stats()
        total_controls = self.repository.get_total_controls()

        return {
            "total_systems": total_systems,
            "total_batches": total_batches,
            "total_controls": total_controls,
            "active_batches": active_batches
        }

    def get_kpis(self):
        stats = self.repository.get_batch_stats()
        total_batches = stats[0]
        active_batches = stats[1]

        kpis = [
            {"label": "Total Batches", "value": str(total_batches)},
            {"label": "Active Batches", "value": str(active_batches)},
            {"label": "Systems Managed", "value": str(self.repository.get_system_count())},
        ]

        return {"kpis": kpis}

    def get_activity(self, limit: int = 10):
        rows = self.repository.get_recent_activity(limit)
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
