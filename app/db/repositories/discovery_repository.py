from typing import List, Optional


class DiscoveryRepository:
    """Repository for discovery and snapshot operations."""

    def __init__(self, db):
        self.db = db

    def get_summary(self, tenant_id=None):
        """Aggregate counts for discovery summary.
        matched_tables counts unique tables that appear as EITHER source OR target
        in table_matches with AUTO_MATCHED/CONFIRMED status."""
        if tenant_id:
            query = """
            WITH datasets AS (
                SELECT dd.* FROM core.discovered_datasets dd
                JOIN core.system_registry sr ON sr.system_id = dd.system_id
                WHERE sr.tenant_id = %s
            ),
            matched_source_tables AS (
                SELECT DISTINCT tm.source_table AS table_name, tm.source_system_id AS sys_id
                FROM core.table_matches tm
                JOIN core.system_registry sr ON sr.system_id = tm.source_system_id
                WHERE sr.tenant_id = %s
                  AND tm.match_status IN ('AUTO_MATCHED', 'CONFIRMED')
            ),
            matched_target_tables AS (
                SELECT DISTINCT tm.target_table AS table_name, tm.target_system_id AS sys_id
                FROM core.table_matches tm
                JOIN core.system_registry sr ON sr.system_id = tm.target_system_id
                WHERE sr.tenant_id = %s
                  AND tm.match_status IN ('AUTO_MATCHED', 'CONFIRMED')
            ),
            all_matched AS (
                SELECT * FROM matched_source_tables
                UNION
                SELECT * FROM matched_target_tables
            ),
            schema_counts AS (
                SELECT COUNT(DISTINCT schema_name) AS total_schemas FROM datasets
            ),
            table_counts AS (
                SELECT COUNT(DISTINCT table_name) AS total_tables FROM datasets
            )
            SELECT
                (SELECT COUNT(DISTINCT system_id) FROM datasets) AS total_systems,
                (SELECT total_schemas FROM schema_counts) AS total_schemas,
                (SELECT total_tables FROM table_counts) AS total_tables,
                (SELECT COUNT(*) FROM all_matched) AS matched_tables
            """
            params = (tenant_id, tenant_id, tenant_id)
        else:
            query = """
            WITH all_matched AS (
                SELECT DISTINCT source_table AS table_name, source_system_id AS sys_id
                FROM core.table_matches WHERE match_status IN ('AUTO_MATCHED', 'CONFIRMED')
                UNION
                SELECT DISTINCT target_table AS table_name, target_system_id AS sys_id
                FROM core.table_matches WHERE match_status IN ('AUTO_MATCHED', 'CONFIRMED')
            )
            SELECT
                (SELECT COUNT(DISTINCT system_id) FROM core.discovered_datasets) AS total_systems,
                (SELECT COUNT(DISTINCT schema_name) FROM core.discovered_datasets) AS total_schemas,
                (SELECT COUNT(DISTINCT table_name) FROM core.discovered_datasets) AS total_tables,
                (SELECT COUNT(*) FROM all_matched) AS matched_tables
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            row = cur.fetchone()
            total_tables = row[2] or 0
            matched = row[3] or 0
            match_rate = round((matched / total_tables * 100), 1) if total_tables > 0 else 0
            return {
                "total_systems": row[0] or 0,
                "total_schemas": row[1] or 0,
                "total_tables": total_tables,
                "matched_tables": matched,
                "match_rate_percent": match_rate
            }

    def get_tree(self, tenant_id=None):
        """Build hierarchical tree: system → schema → table → column with match status.
        Checks both source and target sides of table_matches.
        Uses subquery to deduplicate target-side joins."""
        if tenant_id:
            query = """
            SELECT
                dd.system_id, sr.system_name, sr.database_type,
                dd.schema_name, dd.table_name, dd.discovered_dataset_id,
                dc.column_name, dc.data_type, dc.ordinal_position, dc.is_nullable, dc.is_primary_key,
                tm_src.match_status, tm_src.target_table, tm_src.confidence_score,
                tm_tgt.mapped_from_table
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            LEFT JOIN core.discovered_columns dc ON dc.discovered_dataset_id = dd.discovered_dataset_id
            LEFT JOIN core.table_matches tm_src ON tm_src.source_table = dd.table_name
                AND tm_src.source_system_id = dd.system_id
            LEFT JOIN (
                SELECT DISTINCT target_table, target_system_id,
                       MIN(source_table) AS mapped_from_table
                FROM core.table_matches
                GROUP BY target_table, target_system_id
            ) tm_tgt ON tm_tgt.target_table = dd.table_name
                AND tm_tgt.target_system_id = dd.system_id
            WHERE sr.tenant_id = %s
            ORDER BY sr.system_name, dd.schema_name, dd.table_name, dc.ordinal_position
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT
                dd.system_id, sr.system_name, sr.database_type,
                dd.schema_name, dd.table_name, dd.discovered_dataset_id,
                dc.column_name, dc.data_type, dc.ordinal_position, dc.is_nullable, dc.is_primary_key,
                tm_src.match_status, tm_src.target_table, tm_src.confidence_score,
                tm_tgt.mapped_from_table
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            LEFT JOIN core.discovered_columns dc ON dc.discovered_dataset_id = dd.discovered_dataset_id
            LEFT JOIN core.table_matches tm_src ON tm_src.source_table = dd.table_name
                AND tm_src.source_system_id = dd.system_id
            LEFT JOIN (
                SELECT DISTINCT target_table, target_system_id,
                       MIN(source_table) AS mapped_from_table
                FROM core.table_matches
                GROUP BY target_table, target_system_id
            ) tm_tgt ON tm_tgt.target_table = dd.table_name
                AND tm_tgt.target_system_id = dd.system_id
            ORDER BY sr.system_name, dd.schema_name, dd.table_name, dc.ordinal_position
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            rows = cur.fetchall()

        systems = {}
        for r in rows:
            sys_id = str(r[0])
            sys_name = r[1]
            db_type = r[2]
            schema_name = r[3]
            table_name = r[4]
            dataset_id = str(r[5])
            col_name = r[6]
            col_type = r[7]
            col_pos = r[8]
            is_nullable = r[9]
            is_pk = r[10]
            src_match_status = r[11]
            src_target_table = r[12]
            confidence = float(r[13]) if r[13] else None
            mapped_from_table = r[14]

            if sys_id not in systems:
                systems[sys_id] = {
                    "id": sys_id, "name": sys_name, "type": "system",
                    "parent_id": None, "status": "matched",
                    "database_type": db_type, "schemas": {}
                }

            sys_node = systems[sys_id]
            if schema_name not in sys_node["schemas"]:
                sys_node["schemas"][schema_name] = {
                    "id": f"{sys_id}:{schema_name}", "name": schema_name, "type": "schema",
                    "parent_id": sys_id, "status": "matched", "tables": {}
                }

            schema_node = sys_node["schemas"][schema_name]
            if table_name not in schema_node["tables"]:
                # Derive status from both source and target sides
                table_status = "unmatched"
                if src_match_status == "REVIEW_REQUIRED":
                    table_status = "modified"
                elif src_match_status in ("AUTO_MATCHED", "CONFIRMED"):
                    table_status = "matched"
                elif mapped_from_table:
                    table_status = "matched"

                schema_node["tables"][table_name] = {
                    "id": f"{sys_id}:{schema_name}:{table_name}",
                    "name": table_name, "type": "table",
                    "parent_id": f"{sys_id}:{schema_name}",
                    "status": table_status,
                    "target_table": src_target_table,
                    "mapped_from_table": mapped_from_table,
                    "confidence": confidence,
                    "columns": []
                }

            table_node = schema_node["tables"][table_name]
            if col_name:
                table_node["columns"].append({
                    "id": f"{sys_id}:{schema_name}:{table_name}:{col_name}",
                    "name": col_name, "type": "column",
                    "parent_id": f"{sys_id}:{schema_name}:{table_name}",
                    "status": "matched",
                    "data_type": col_type,
                    "is_nullable": is_nullable,
                    "is_primary_key": is_pk
                })

        def build_tree(systems_dict):
            result = []
            for sys in systems_dict.values():
                sys_children = []
                for schema in sys["schemas"].values():
                    table_children = []
                    for table in schema["tables"].values():
                        table_children.append({
                            "id": table["id"], "name": table["name"], "type": "table",
                            "parent_id": table["parent_id"], "status": table["status"],
                            "target_table": table.get("target_table"),
                            "mapped_from_table": table.get("mapped_from_table"),
                            "confidence": table.get("confidence"),
                            "columns": table["columns"]
                        })
                    sys_children.append({
                        "id": schema["id"], "name": schema["name"], "type": "schema",
                        "parent_id": schema["parent_id"], "status": "matched",
                        "columns": table_children
                    })
                result.append({
                    "id": sys["id"], "name": sys["name"], "type": "system",
                    "parent_id": None, "status": "matched",
                    "database_type": sys.get("database_type"),
                    "columns": sys_children
                })
            return result

        return build_tree(systems)

    def get_tables(self, tenant_id=None):
        """Flat table list with source/target mapping and column diffs.
        Checks both source and target sides of table_matches.
        Uses subquery to deduplicate target-side joins."""
        if tenant_id:
            query = """
            SELECT
                dd.system_id, sr.system_name,
                dd.table_name, dd.schema_name,
                tm_src.target_table, tm_src.match_status, tm_src.confidence_score,
                dc.column_name, dc.data_type, dc.is_primary_key,
                tgt_dc.column_name AS tgt_col_name, tgt_dc.data_type AS tgt_col_type,
                tm_tgt.mapped_from_table
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            LEFT JOIN core.table_matches tm_src ON tm_src.source_table = dd.table_name
                AND tm_src.source_system_id = dd.system_id
            LEFT JOIN (
                SELECT DISTINCT target_table, target_system_id,
                       MIN(source_table) AS mapped_from_table
                FROM core.table_matches
                GROUP BY target_table, target_system_id
            ) tm_tgt ON tm_tgt.target_table = dd.table_name
                AND tm_tgt.target_system_id = dd.system_id
            LEFT JOIN core.discovered_columns dc ON dc.discovered_dataset_id = dd.discovered_dataset_id
            LEFT JOIN core.discovered_datasets tgt_dd ON tgt_dd.table_name = tm_src.target_table
                AND tgt_dd.system_id = tm_src.target_system_id
            LEFT JOIN core.discovered_columns tgt_dc ON tgt_dc.discovered_dataset_id = tgt_dd.discovered_dataset_id
                AND tgt_dc.column_name = dc.column_name
            WHERE sr.tenant_id = %s
            ORDER BY dd.table_name, dc.ordinal_position
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT
                dd.system_id, sr.system_name,
                dd.table_name, dd.schema_name,
                tm_src.target_table, tm_src.match_status, tm_src.confidence_score,
                dc.column_name, dc.data_type, dc.is_primary_key,
                tgt_dc.column_name AS tgt_col_name, tgt_dc.data_type AS tgt_col_type,
                tm_tgt.mapped_from_table
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            LEFT JOIN core.table_matches tm_src ON tm_src.source_table = dd.table_name
                AND tm_src.source_system_id = dd.system_id
            LEFT JOIN (
                SELECT DISTINCT target_table, target_system_id,
                       MIN(source_table) AS mapped_from_table
                FROM core.table_matches
                GROUP BY target_table, target_system_id
            ) tm_tgt ON tm_tgt.target_table = dd.table_name
                AND tm_tgt.target_system_id = dd.system_id
            LEFT JOIN core.discovered_columns dc ON dc.discovered_dataset_id = dd.discovered_dataset_id
            LEFT JOIN core.discovered_datasets tgt_dd ON tgt_dd.table_name = tm_src.target_table
                AND tgt_dd.system_id = tm_src.target_system_id
            LEFT JOIN core.discovered_columns tgt_dc ON tgt_dc.discovered_dataset_id = tgt_dd.discovered_dataset_id
                AND tgt_dc.column_name = dc.column_name
            ORDER BY dd.table_name, dc.ordinal_position
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            rows = cur.fetchall()

        tables = {}
        for r in rows:
            match_status = r[5]
            tm_target = r[4]  # tm_src.target_table
            mapped_from_table = r[12]

            # Compute display columns: each row should represent a source→target pair
            if tm_target:
                # This table is a SOURCE in a table_matches entry
                display_source = r[2]  # dd.table_name
                display_target = tm_target
            elif mapped_from_table:
                # This table is a TARGET in table_matches (but not a source)
                display_source = mapped_from_table
                display_target = r[2]  # dd.table_name
            else:
                # Unmatched table
                display_source = r[2]
                display_target = None

            # Deduplicate by (display_source, display_target) pair
            pair_key = f"{display_source}:{display_target or ''}"
            dataset_key = f"{r[0]}:{r[2]}"  # system_id:table_name for column ownership

            if pair_key not in tables:
                # Derive status
                status = "unmatched"
                if match_status == "REVIEW_REQUIRED":
                    status = "modified"
                elif match_status in ("AUTO_MATCHED", "CONFIRMED"):
                    status = "matched"
                elif mapped_from_table:
                    status = "matched"

                tables[pair_key] = {
                    "source_table": display_source,
                    "schema_name": r[3],
                    "system_name": r[1],
                    "target_table": display_target,
                    "mapped_from_table": mapped_from_table,
                    "status": status,
                    "confidence": float(r[6]) if r[6] else None,
                    "column_diff": [],
                    "_creator": dataset_key
                }

            # Only append columns from the discovered_dataset that created this entry
            if r[7] and tables[pair_key].get("_creator") == dataset_key:
                col_status = "match"
                if r[10] is None:
                    col_status = "source_only"
                elif r[7] != r[10]:
                    col_status = "type_change" if r[8] != r[11] else "match"

                tables[pair_key]["column_diff"].append({
                    "column_name": r[7],
                    "source_type": r[8],
                    "target_type": r[11] or "\u2014",
                    "status": col_status,
                    "is_primary_key": r[9]
                })

        # Clean up internal _creator field before returning
        for t in tables.values():
            t.pop("_creator", None)

        return list(tables.values())

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