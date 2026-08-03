from app.repositories.migration_project_repository import MigrationProjectRepository


class MigrationProjectService:
    def __init__(self):
        self.repository = MigrationProjectRepository()

    def _row_to_dict(self, row):
        if not row:
            return None
        return {
            "project_id": str(row[0]),
            "project_name": row[1],
            "project_type": row[2],
            "status": row[3],
            "tenant_id": str(row[4]) if row[4] else None,
            "created_at": str(row[5]) if row[5] else None,
            "updated_at": str(row[6]) if row[6] else None,
            "total_batches": row[7] or 0,
            "completed_batches": row[8] or 0,
            "failed_batches": row[9] or 0,
            "total_controls": row[10] or 0,
            "completed_controls": row[11] or 0,
            "dataset_count": row[12] or 0,
        }

    def _dataset_to_dict(self, row):
        if not row:
            return None
        return {
            "dataset_id": str(row[0]),
            "table_name": row[1],
            "schema_name": row[2],
            "discovered_at": str(row[3]) if row[3] else None,
            "last_seen": str(row[4]) if row[4] else None,
        }

    def get_projects(self, limit: int = 50, offset: int = 0, status: str = None, tenant_id: str = None):
        rows = self.repository.get_all_projects(limit, offset, status, tenant_id)
        total = self.repository.get_total_count(status, tenant_id)
        projects = [self._row_to_dict(r) for r in rows]
        return {"items": projects, "total": total}

    def get_project(self, project_id: str):
        row = self.repository.get_project_by_id(project_id)
        if not row:
            return None
        project = self._row_to_dict(row)
        datasets = self.repository.get_project_datasets(project_id)
        project["datasets"] = [self._dataset_to_dict(d) for d in datasets]
        return project

    def get_tenants(self):
        rows = self.repository.get_unique_tenants()
        return [{"tenant_id": str(r[0]), "tenant_name": r[1] or str(r[0])[:8]} for r in rows]

    def get_overview(self, tenant_id: str = None):
        stats = self.repository.get_overview_stats(tenant_id)
        active_batches = self.repository.get_active_batches_count(tenant_id)
        recent_activity = self.repository.get_recent_activity(10, tenant_id)
        top_projects = self.repository.get_top_projects_by_progress(5, tenant_id)

        total_controls = int(stats[2]) if stats else 0
        completed_controls = int(stats[3]) if stats else 0
        health_score = 0
        if total_controls > 0:
            health_score = min(100, round((completed_controls / total_controls) * 100))

        return {
            "total_projects": stats[0] if stats else 0,
            "total_batches": stats[1] if stats else 0,
            "total_controls": stats[2] if stats else 0,
            "completed_controls": completed_controls,
            "total_datasets": stats[4] if stats else 0,
            "active_projects": stats[5] if stats else 0,
            "active_batches": active_batches,
            "health_score": health_score,
            "recent_activity": [
                {
                    "id": r[0],
                    "status": r[1],
                    "entity_name": r[2],
                    "created_at": str(r[3]) if r[3] else None,
                }
                for r in recent_activity
            ],
            "top_projects": [
                {
                    "project_name": r[0],
                    "total_batches": r[1],
                    "completed_batches": r[2],
                }
                for r in top_projects
            ],
        }
