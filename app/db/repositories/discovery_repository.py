from typing import List, Optional


class DiscoveryRepository:
    """Repository for discovery and snapshot operations."""

    def __init__(self, db):
        self.db = db

    async def save_discovery_result(self, result: dict) -> None:
        """Save discovery result to metadata."""
        query = """
            INSERT INTO core.discovery_results
            (project_id, source_system_id, target_system_id,
             source_schema, target_schema, matched_tables,
             created_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """
        for dataset in result.get("datasets", []):
            self.db.execute(query, (
                result["project_id"],
                dataset["source_system"].get("system_id"),
                dataset["target_system"].get("system_id"),
                str(dataset["source_tables"]),
                str(dataset["target_tables"]),
                str(dataset["matched_tables"]),
            ))

    async def get_snapshots(
        self, project_id: str
    ) -> List[dict]:
        """Get all discovery snapshots for a project."""
        query = """
            SELECT * FROM core.discovery_snapshots
            WHERE project_id = %s
            ORDER BY created_at DESC
        """
        return self.db.execute(query, (project_id,))

    async def save_snapshot(
        self, project_id: str, snapshot: dict
    ) -> dict:
        """Save a discovery snapshot."""
        query = """
            INSERT INTO core.discovery_snapshots
            (project_id, source_system_id, target_system_id,
             snapshot_type, source_schema, target_schema,
             matched_tables, drift_summary, snapshot_status,
             triggered_by, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING snapshot_id
        """
        result = self.db.execute(query, (
            project_id,
            snapshot.get("source_system_id"),
            snapshot.get("target_system_id"),
            snapshot.get("snapshot_type", "FULL"),
            str(snapshot.get("source_schema", {})),
            str(snapshot.get("target_schema", {})),
            str(snapshot.get("matched_tables", [])),
            str(snapshot.get("drift_summary")),
            snapshot.get("snapshot_status", "COMPLETE"),
            snapshot.get("triggered_by", "manual"),
            snapshot.get("created_by", "system"),
        ))
        return {"snapshot_id": result[0]["snapshot_id"]}

    async def get_latest_snapshot(
        self, project_id: str, source_system_id: str, target_system_id: str
    ) -> List[dict]:
        """Get the latest snapshot for a source-target pair."""
        query = """
            SELECT * FROM core.discovery_snapshots
            WHERE project_id = %s
            AND source_system_id = %s
            AND target_system_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """
        return self.db.execute(
            query, (project_id, source_system_id, target_system_id)
        )