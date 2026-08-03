from typing import List, Optional
from datetime import datetime

from app.adapters.registry import AdapterRegistry
from app.adapters.models import TableInfo, ColumnInfo
from app.db.repositories.discovery_repository import DiscoveryRepository


class DiscoveryService:
    """Discovers schema metadata from source and target systems."""

    def __init__(self, db):
        self.db = db
        self.discovery_repo = DiscoveryRepository(db)

    async def discover(self, project_id: str) -> dict:
        """Discover schema for all systems in a project."""
        systems = await self._get_project_systems(project_id)
        source_systems = [s for s in systems if s.get("system_role") == "SOURCE"]
        target_systems = [s for s in systems if s.get("system_role") == "TARGET"]

        discovered_datasets = []

        for source in source_systems:
            for target in target_systems:
                source_schema = await self._discover_schema(source)
                target_schema = await self._discover_schema(target)
                matched_tables = self._match_tables(source_schema, target_schema)

                discovered_datasets.append({
                    "source_system": source,
                    "target_system": target,
                    "source_tables": source_schema.tables,
                    "target_tables": target_schema.tables,
                    "matched_tables": matched_tables,
                })

        result = {
            "project_id": project_id,
            "datasets": discovered_datasets,
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.discovery_repo.save_discovery_result(result)

        return result

    async def _discover_schema(self, system: dict) -> dict:
        """Discover schema for a single system."""
        db_type = system.get("database_type")
        adapter_class = AdapterRegistry.get(db_type)
        adapter = adapter_class()

        config = await self._get_system_config(system)
        adapter.connect(config)

        try:
            tables = adapter.list_tables(system.get("schema"))
            columns = {}
            for table in tables:
                cols = adapter.list_columns(
                    table.schema_name, table.table_name
                )
                columns[f"{table.schema_name}.{table.table_name}"] = cols

            return {
                "system": system,
                "tables": tables,
                "columns": columns,
            }
        finally:
            adapter.close()

    async def _get_system_config(self, system: dict) -> dict:
        """Get connection config from metadata."""
        return system.get("connection_config", {})

    async def _get_project_systems(self, project_id: str) -> List[dict]:
        """Get all systems for a project."""
        query = """
            SELECT s.* FROM core.system_registry s
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE p.project_id = %s
        """
        return self.db.execute(query, (project_id,))

    def _match_tables(
        self, source: dict, target: dict
    ) -> List[dict]:
        """Match source tables to target tables using naming conventions."""
        matches = []
        source_tables = source.get("tables", [])
        target_tables = target.get("tables", [])

        for source_table in source_tables:
            for target_table in target_tables:
                if self._tables_match(source_table, target_table):
                    matches.append({
                        "source": source_table,
                        "target": target_table,
                        "confidence": 1.0,
                        "match_type": "exact",
                    })

            if not any(
                m["source"] == source_table for m in matches
            ):
                best_match = self._fuzzy_match(
                    source_table, target_tables
                )
                if best_match:
                    matches.append({
                        "source": source_table,
                        "target": best_match,
                        "confidence": 0.8,
                        "match_type": "fuzzy",
                    })

        return matches

    def _tables_match(self, source: TableInfo, target: TableInfo) -> bool:
        """Check if two tables match by name."""
        return source.table_name.lower() == target.table_name.lower()

    def _fuzzy_match(
        self, source_table: TableInfo, target_tables: list
    ) -> Optional[TableInfo]:
        """Fuzzy match source table to target tables."""
        source_name = source_table.table_name.lower()

        for target_table in target_tables:
            target_name = target_table.table_name.lower()

            if source_name == target_name:
                return target_table

            if source_name.startswith(target_name) or target_name.startswith(source_name):
                return target_table

            if source_name.replace("_", "") == target_name.replace("_", ""):
                return target_table

        return None

    async def get_snapshots(self, project_id: str) -> List[dict]:
        """Get discovery snapshots for a project."""
        return await self.discovery_repo.get_snapshots(project_id)

    async def save_snapshot(self, project_id: str, snapshot: dict) -> dict:
        """Save a discovery snapshot."""
        return await self.discovery_repo.save_snapshot(project_id, snapshot)

    async def detect_drift(
        self, project_id: str, source_system_id: str, target_system_id: str
    ) -> dict:
        """Detect schema drift between source and target."""
        current = await self._discover_schema(
            {"system_id": source_system_id, "database_type": "postgres"}
        )

        snapshots = await self.discovery_repo.get_latest_snapshot(
            project_id, source_system_id, target_system_id
        )

        if not snapshots:
            return {"drift_detected": False, "changes": []}

        previous = snapshots[0]
        changes = self._compare_schemas(current, previous)

        return {
            "drift_detected": len(changes) > 0,
            "changes": changes,
        }

    def _compare_schemas(self, current: dict, previous: dict) -> list:
        """Compare two schema snapshots and return changes."""
        changes = []

        current_tables = {
            t.table_name.lower(): t for t in current.get("tables", [])
        }
        previous_tables = {
            t.table_name.lower(): t for t in previous.get("tables", [])
        }

        for table_name in current_tables:
            if table_name not in previous_tables:
                changes.append(
                    {"type": "table_added", "table": table_name}
                )

        for table_name in previous_tables:
            if table_name not in current_tables:
                changes.append(
                    {"type": "table_removed", "table": table_name}
                )

        return changes