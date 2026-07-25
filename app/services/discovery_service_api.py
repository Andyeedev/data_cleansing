from app.db.connection import get_db_connection
from app.repositories.discovery_repository import DiscoveryRepository
from app.services.dataset_discovery_service import DatasetDiscoveryService


class DiscoveryService:

    def __init__(self):
        self.repository = DiscoveryRepository()

    def get_datasets_by_batch(self, batch_id: str):
        mappings = self.repository.get_mappings_by_batch(batch_id)
        return [self._map_to_dict(m) for m in mappings]

    def get_dataset_by_id(self, mapping_id: str):
        mapping = self.repository.get_mapping_by_id(mapping_id)
        if not mapping:
            return None
        return self._map_to_dict(mapping)

    def trigger_discovery(self, project_id: str):
        engine_db = get_db_connection()
        discovery_service = DatasetDiscoveryService(engine_db, project_id)
        discovery_service.discover()

        return {
            "message": "Discovery triggered successfully",
            "project_id": project_id,
            "status": "completed"
        }

    def get_discovery_status(self, batch_id: str):
        status = self.repository.get_discovery_status(batch_id)
        if not status:
            return None

        batch_id, project_id, overall_status, started_at, completed_at, mappings_created = status

        return {
            "batch_id": batch_id,
            "project_id": project_id,
            "discovery_status": overall_status or "UNKNOWN",
            "datasets_found": self.repository.count_datasets_by_project(project_id) if project_id else 0,
            "mappings_created": mappings_created or 0,
            "started_at": str(started_at) if started_at else None,
            "completed_at": str(completed_at) if completed_at else None
        }

    def _map_to_dict(self, row):
        return {
            "mapping_id": str(row[0]),
            "project_id": str(row[1]),
            "source_system_id": str(row[2]),
            "target_system_id": str(row[3]) if row[3] else None,
            "source_schema": row[4],
            "source_table": row[5],
            "source_columns": row[6],
            "target_schema": row[7],
            "target_table": row[8],
            "target_columns": row[9],
            "is_active": row[10],
            "created_at": str(row[11]) if row[11] else None
        }
