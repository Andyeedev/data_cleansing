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

    def _write_to_dict(self, row):
        if not row:
            return None
        return {
            "project_id": str(row[0]),
            "project_name": row[1],
            "project_type": row[2],
            "status": row[3],
            "tenant_id": str(row[4]) if row[4] else None,
            "created_at": str(row[5]) if row[5] else None,
        }

    def get_project_for_tenant(self, project_id: str, tenant_id: str):
        """DEV-001/DEV-005: resolve a project strictly within the JWT tenant.
        Returns None for unknown OR foreign projects (no existence leak)."""
        owner = self.repository.get_project_tenant(project_id)
        if not owner or str(owner) != str(tenant_id):
            return None
        return self.get_project(project_id)

    def create_project(self, tenant_id: str, project_name: str, project_type: str = "MIGRATION"):
        """DEV-005: minimum project creation with plan-limit enforcement (DEV-009)."""
        if not project_name or not project_name.strip():
            raise ValueError("project_name is required")
        if project_type not in ("MIGRATION", "DATA_QUALITY"):
            raise ValueError("project_type must be MIGRATION or DATA_QUALITY")
        from app.services.tenant_service import TenantService
        TenantService(self.repository.db.conn).check_limit(tenant_id, "projects")
        row = self.repository.create_project(tenant_id, project_name.strip(), project_type)
        if not row:
            raise Exception("Project creation failed")
        return self._write_to_dict(row)

    def update_project(self, project_id: str, tenant_id: str, project_name=None,
                       project_type=None, status=None):
        """DEV-005: tenant-scoped update. Unknown/foreign → ValueError (403)."""
        if project_type is not None and project_type not in ("MIGRATION", "DATA_QUALITY"):
            raise ValueError("project_type must be MIGRATION or DATA_QUALITY")
        row = self.repository.update_project(project_id, tenant_id, project_name,
                                             project_type, status)
        if not row:
            raise ValueError("Project not found or access denied")
        return self._write_to_dict(row)

    def delete_project(self, project_id: str, tenant_id: str, mode: str = "archive"):
        """DEV-005: default archive (status); hard delete only when explicitly requested."""
        if mode == "hard":
            deleted = self.repository.delete_project(project_id, tenant_id)
            if not deleted:
                raise ValueError("Project not found or access denied")
            return {"deleted": str(deleted)}
        row = self.repository.archive_project(project_id, tenant_id)
        if not row:
            raise ValueError("Project not found or access denied")
        return self._write_to_dict(row)

    def get_tenants(self):
        rows = self.repository.get_unique_tenants()
        return [{"tenant_id": str(r[0]), "tenant_name": r[1] or str(r[0])[:8]} for r in rows]

    def get_tenants_for_user(self, tenant_id: str):
        if not tenant_id:
            return []
        rows = self.repository.get_tenant_by_id(tenant_id)
        if rows:
            return [{"tenant_id": str(rows[0][0]), "tenant_name": rows[0][1] or str(rows[0][0])[:8]}]
        return []

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
