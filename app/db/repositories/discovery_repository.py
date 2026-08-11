from app.db.connection import get_db_connection


class DiscoveryRepository:
    """Repository for discovery and snapshot operations."""

    def __init__(self, db=None):
        self.db = db if db is not None else get_db_connection()

    def get_summary(self, tenant_id=None, all_tenants=False):
        """Aggregate counts for discovery summary from dataset_mappings."""
        if tenant_id:
            systems_clause = "WHERE sr.tenant_id = %s"
            mappings_clause = "WHERE p.tenant_id = %s"
            params = (tenant_id, tenant_id, tenant_id, tenant_id)
        else:
            systems_clause = ""
            mappings_clause = ""
            params = ()
        query = f"""
            SELECT
                (SELECT COUNT(DISTINCT sr.system_id) FROM core.system_registry sr {systems_clause}) as total_systems,
                (SELECT COUNT(DISTINCT dm.source_schema) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id {mappings_clause}) as total_schemas,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id {mappings_clause}) as total_tables,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id {mappings_clause}
                 AND dm.target_table IS NOT NULL) as matched_tables
        """
        rows = self.db.execute(query, params)
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

    def get_tree(self, tenant_id=None, all_tenants=False):
        """Build hierarchical tree: source system and target system as separate nodes."""
        if tenant_id:
            where_clause = "WHERE p.tenant_id = %s"
            params = (tenant_id,)
        else:
            where_clause = ""
            params = ()
        rows = self.db.execute(f"""
            SELECT dm.mapping_id, dm.source_system_id, dm.target_system_id,
                   dm.source_schema, dm.source_table, dm.target_schema, dm.target_table
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            {where_clause}
            ORDER BY dm.source_schema, dm.source_table
        """, params)

        source_schemas = {}
        target_schemas = {}
        source_system_ids = set()
        target_system_ids = set()

        for row in rows:
            mapping_id, src_sys_id, tgt_sys_id, src_schema, src_table, tgt_schema, tgt_table = row
            src_schema_key = src_schema or "default"
            tgt_schema_key = tgt_schema or "default"
            source_system_ids.add(str(src_sys_id))
            target_system_ids.add(str(tgt_sys_id))

            if src_schema_key not in source_schemas:
                source_schemas[src_schema_key] = []
            source_schemas[src_schema_key].append({
                "id": f"src:{mapping_id}",
                "name": src_table,
                "type": "table",
                "status": "matched" if tgt_table else "unmatched_source",
                "target_table": f"{tgt_schema}.{tgt_table}" if tgt_table else None,
                "confidence": 100 if tgt_table else 0,
                "columns": []
            })

            if tgt_table:
                if tgt_schema_key not in target_schemas:
                    target_schemas[tgt_schema_key] = []
                target_schemas[tgt_schema_key].append({
                    "id": f"tgt:{mapping_id}",
                    "name": tgt_table,
                    "type": "table",
                    "status": "matched",
                    "mapped_from_table": f"{src_schema}.{src_table}",
                    "confidence": 100,
                    "columns": []
                })

        result = []
        source_schema_nodes = []
        for schema_name, tables in source_schemas.items():
            source_schema_nodes.append({
                "id": f"src:schema:{schema_name}",
                "name": schema_name,
                "type": "schema",
                "status": "matched",
                "columns": tables
            })
        if source_schema_nodes:
            result.append({
                "id": "source",
                "name": "Source",
                "type": "system",
                "status": "matched",
                "columns": source_schema_nodes
            })

        target_schema_nodes = []
        for schema_name, tables in target_schemas.items():
            target_schema_nodes.append({
                "id": f"tgt:schema:{schema_name}",
                "name": schema_name,
                "type": "schema",
                "status": "matched",
                "columns": tables
            })
        if target_schema_nodes:
            result.append({
                "id": "target",
                "name": "Target",
                "type": "system",
                "status": "matched",
                "columns": target_schema_nodes
            })

        return result

    def get_tables(self, tenant_id=None, all_tenants=False):
        """Flat table list with column diffs from dataset_mappings + dataset_columns."""
        if tenant_id:
            where_clause = "WHERE p.tenant_id = %s"
            params = (tenant_id,)
        else:
            where_clause = ""
            params = ()
        rows = self.db.execute(f"""
            SELECT dm.mapping_id, dm.source_table, dm.target_table, dm.source_schema, dm.target_schema
            FROM core.dataset_mappings dm
            INNER JOIN core.projects p ON dm.project_id = p.project_id
            {where_clause}
            ORDER BY dm.source_table
        """, params)

        result = []
        for row in rows:
            mapping_id, src_table, tgt_table, src_schema, tgt_schema = row
            column_diff = self._get_column_diff(mapping_id)
            result.append({
                "source_table": src_table,
                "target_table": tgt_table,
                "schema_name": src_schema,
                "status": "matched" if tgt_table else "unmatched_source",
                "confidence": 100 if tgt_table else 0,
                "column_diff": column_diff
            })
        return result

    def _get_column_diff(self, mapping_id):
        """Get column comparison for a mapping."""
        cols = self.db.execute("""
            SELECT column_name, data_type, column_side, is_primary_key, is_nullable
            FROM core.dataset_columns
            WHERE mapping_id = %s
            ORDER BY column_side, column_position
        """, (mapping_id,))
        if not cols:
            return []

        source_cols = {row[0]: row for row in cols if row[2] == 'SOURCE'}
        target_cols = {row[0]: row for row in cols if row[2] == 'TARGET'}

        all_names = list(dict.fromkeys(
            [row[0] for row in cols if row[2] == 'SOURCE'] +
            [row[0] for row in cols if row[2] == 'TARGET']
        ))

        diff = []
        for col_name in all_names:
            src = source_cols.get(col_name)
            tgt = target_cols.get(col_name)
            if src and tgt:
                if src[1] == tgt[1]:
                    col_status = "match"
                else:
                    col_status = "type_change"
                diff.append({
                    "column_name": col_name,
                    "source_type": src[1],
                    "target_type": tgt[1],
                    "status": col_status,
                    "is_primary_key": src[3] or tgt[3]
                })
            elif src:
                diff.append({
                    "column_name": col_name,
                    "source_type": src[1],
                    "target_type": "\u2014",
                    "status": "source_only",
                    "is_primary_key": src[3]
                })
            elif tgt:
                diff.append({
                    "column_name": col_name,
                    "source_type": "\u2014",
                    "target_type": tgt[1],
                    "status": "target_only",
                    "is_primary_key": tgt[3]
                })
        return diff

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
