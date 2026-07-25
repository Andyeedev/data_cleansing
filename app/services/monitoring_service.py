from app.repositories.monitoring_repository import MonitoringRepository


class MonitoringService:

    def __init__(self):
        self.repository = MonitoringRepository()

    def get_system_health(self):
        try:
            from app.db.connection import get_db_connection
            db = get_db_connection()
            db.execute("SELECT 1")
            db_healthy = True
        except Exception:
            db_healthy = False

        return {
            "database": db_healthy,
            "api": True,
            "timestamp": None
        }

    def get_performance_metrics(self):
        stats = self.repository.get_execution_stats()
        total = stats[0] or 0
        running = stats[1] or 0
        completed = stats[2] or 0
        failed = stats[3] or 0

        return {
            "total_executions": total,
            "active_executions": running,
            "completed_executions": completed,
            "failed_executions": failed,
            "avg_execution_time": None
        }

    def get_queue_status(self):
        items = self.repository.get_queue_items()
        queue_items = []
        for item in items:
            queue_items.append({
                "batch_id": str(item[0]),
                "project_id": str(item[1]) if item[1] else None,
                "status": item[2],
                "queued_at": str(item[3]) if item[3] else None
            })

        running = sum(1 for i in queue_items if i["status"] == "RUNNING")
        pending = sum(1 for i in queue_items if i["status"] == "PENDING")

        return {
            "total_items": len(queue_items),
            "running": running,
            "pending": pending,
            "items": queue_items
        }

    def get_alerts(self):
        return {
            "alerts": [],
            "total": 0
        }

    def get_operational_logs(self, limit: int = 50):
        return {
            "logs": [],
            "total": 0
        }
