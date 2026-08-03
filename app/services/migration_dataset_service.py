from app.repositories.migration_dataset_repository import MigrationDatasetRepository


class MigrationDatasetService:
    def __init__(self):
        self.repository = MigrationDatasetRepository()

    def _row_to_dict(self, row):
        if not row:
            return None
        return {
            "dataset_id": str(row[0]),
            "project_id": str(row[1]) if row[1] else None,
            "project_name": row[2],
            "system_id": str(row[3]) if row[3] else None,
            "system_name": row[4],
            "table_name": row[5],
            "schema_name": row[6],
            "discovered_at": str(row[7]) if row[7] else None,
            "last_seen": str(row[8]) if row[8] else None,
        }

    def get_datasets(self, limit: int = 50, offset: int = 0, project_id: str = None, tenant_id: str = None):
        rows = self.repository.get_all_datasets(limit, offset, project_id, tenant_id)
        total = self.repository.get_total_count(project_id, tenant_id)
        datasets = [self._row_to_dict(r) for r in rows]
        return {"items": datasets, "total": total}
