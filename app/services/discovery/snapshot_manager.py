from typing import List, Optional
from datetime import datetime


class DiscoverySnapshotManager:
    """Manages discovery snapshots for schema drift detection."""

    def __init__(self, db):
        self.db = db

    async def create_snapshot(
        self,
        project_id: str,
        source_system_id: str,
        target_system_id: str,
        source_schema: dict,
        target_schema: dict,
        snapshot_type: str = "FULL",
        triggered_by: str = "manual",
        created_by: str = "system",
    ) -> dict:
        """Create a discovery snapshot."""
        snapshot = {
            "project_id": project_id,
            "source_system_id": source_system_id,
            "target_system_id": target_system_id,
            "snapshot_type": snapshot_type,
            "source_schema": source_schema,
            "target_schema": target_schema,
            "matched_tables": self._match_tables(source_schema, target_schema),
            "drift_summary": None,
            "snapshot_status": "COMPLETE",
            "triggered_by": triggered_by,
            "created_at": datetime.utcnow().isoformat(),
            "created_by": created_by,
        }

        await self._save_snapshot(snapshot)

        return snapshot

    async def get_snapshots(
        self, project_id: str
    ) -> List[dict]:
        """Get all snapshots for a project."""
        query = """
            SELECT * FROM core.discovery_snapshots
            WHERE project_id = %s
            ORDER BY created_at DESC
        """
        rows = self.db.execute(query, (project_id,))
        return rows

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
        rows = self.db.execute(
            query, (project_id, source_system_id, target_system_id)
        )
        return rows

    async def detect_drift(
        self, project_id: str, source_system_id: str, target_system_id: str
    ) -> dict:
        """Detect schema drift between source and target."""
        latest = await self.get_latest_snapshot(
            project_id, source_system_id, target_system_id
        )

        if not latest:
            return {"drift_detected": False, "changes": []}

        current = await self._get_current_schema(source_system_id)
        previous = latest[0]

        changes = self._compare_schemas(current, previous)

        return {
            "drift_detected": len(changes) > 0,
            "changes": changes,
        }

    def _match_tables(self, source: dict, target: dict) -> list:
        """Match tables between source and target schemas."""
        matches = []
        source_tables = source.get("tables", [])
        target_tables = target.get("tables", [])

        for src_table in source_tables:
            for tgt_table in target_tables:
                if src_table.get("table_name", "").lower() == tgt_table.get(
                    "table_name", ""
                ).lower():
                    matches.append(
                        {
                            "source_table": src_table.get("table_name"),
                            "target_table": tgt_table.get("table_name"),
                            "confidence": 1.0,
                            "match_type": "exact",
                        }
                    )

        return matches

    async def _get_current_schema(self, system_id: str) -> dict:
        """Get current schema for a system."""
        return {"tables": [], "columns": {}}

    def _compare_schemas(self, current: dict, previous: dict) -> list:
        """Compare two schema snapshots and return changes."""
        changes = []

        current_tables = {
            t.get("table_name", "").lower(): t
            for t in current.get("tables", [])
        }
        previous_tables = {
            t.get("table_name", "").lower(): t
            for t in previous.get("tables", [])
        }

        for table_name in current_tables:
            if table_name not in previous_tables:
                changes.append({"type": "table_added", "table": table_name})

        for table_name in previous_tables:
            if table_name not in current_tables:
                changes.append({"type": "table_removed", "table": table_name})

        return changes

    async def _save_snapshot(self, snapshot: dict) -> None:
        """Save snapshot to database."""
        query = """
            INSERT INTO core.discovery_snapshots
            (project_id, source_system_id, target_system_id,
             snapshot_type, source_schema, target_schema,
             matched_tables, drift_summary, snapshot_status,
             triggered_by, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        self.db.execute(query, (
            snapshot["project_id"],
            snapshot["source_system_id"],
            snapshot["target_system_id"],
            snapshot["snapshot_type"],
            str(snapshot["source_schema"]),
            str(snapshot["target_schema"]),
            str(snapshot["matched_tables"]),
            str(snapshot.get("drift_summary")),
            snapshot["snapshot_status"],
            snapshot["triggered_by"],
            snapshot["created_by"],
        ))