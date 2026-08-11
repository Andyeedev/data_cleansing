from typing import List, Optional


class DiscoveryRepository:
    """Repository for discovery and snapshot operations."""

    def __init__(self, db):
        self.db = db

    def get_summary(self, tenant_id=None):
        """Aggregate counts for discovery summary from dataset_mappings."""
        rows = self.db.execute("""
            SELECT
                (SELECT COUNT(DISTINCT sr.system_id) FROM core.system_registry sr WHERE sr.tenant_id = %s) as total_systems,
                (SELECT COUNT(DISTINCT dm.source_schema) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_schemas,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_tables,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s
                 AND dm.target_table IS NOT NULL) as matched_tables
        """, (tenant_id, tenant_id, tenant_id, tenant_id))
        if not rows:
            return {"total_systems": 0, "total_schemas": 0, "total_tables": 0, "matched_tables": 0, "match_rate_percent": 0}
        row = rows[0]
        total_tables = row[2] or 0
        matched = row[3] or 0
        return {
            "total_systems": row[0] or 0,
            "total_schemas": row[1] or 0,
            "total_tables": total_tables,
            "matched_tables": matched,
            "match_rate_percent": round((matched / total_tables) * 100, 1) if total_tables > 0 else 0
        }

    def get_tree(self, tenant_id=None):
        """Build hierarchical tree from dataset_mappings."""
        rows = self.db.execute("""
            SELECT dm.mapping_id, dm.source_schema, dm.source_table, dm.target_schema, dm.target_table
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY dm.source_schema, dm.source_table
        """, (tenant_id,))
        children = []
        for row in rows:
            children.append({
                "id": row[0],
                "name": f"{row[1]}.{row[2]}",
                "type": "table",
                "status": "matched" if row[4] else "unmatched_source",
                "target_table": f"{row[3]}.{row[4]}" if row[4] else None,
                "confidence": 100 if row[4] else 0,
                "columns": []
            })
        return [{"id": "source", "name": "Source", "type": "system", "status": "matched", "children": children}] if children else []

    def get_tables(self, tenant_id=None):
        """Flat table list from dataset_mappings."""
        rows = self.db.execute("""
            SELECT dm.source_table, dm.target_table, dm.source_schema
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY dm.source_table
        """, (tenant_id,))
        return [{
            "source_table": row[0],
            "target_table": row[1],
            "schema_name": row[2],
            "status": "matched" if row[1] else "unmatched_source",
            "confidence": 100 if row[1] else 0,
            "column_diff": []
        } for row in rows]

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