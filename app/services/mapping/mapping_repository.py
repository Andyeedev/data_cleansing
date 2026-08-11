from typing import List, Optional


class MappingRepository:
    """Repository for mapping operations."""

    def __init__(self, db):
        self.db = db

    def get_summary(self, tenant_id=None):
        """Aggregate mapping stats."""
        if tenant_id:
            query = """
            WITH mapped_tables AS (
                SELECT dm.mapping_id, dm.source_table, dm.target_table
                FROM core.dataset_mappings dm
                JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
                WHERE sr.tenant_id = %s AND dm.is_active = true
            ),
            col_maps AS (
                SELECT cm.column_mapping_id, cm.match_status, cm.mapping_id
                FROM core.column_mappings cm
                JOIN core.dataset_mappings dm ON dm.mapping_id = cm.mapping_id
                JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
                WHERE sr.tenant_id = %s
            )
            SELECT
                (SELECT COUNT(*) FROM mapped_tables) AS tables_mapped,
                (SELECT COUNT(*) FROM col_maps) AS columns_mapped,
                (SELECT COUNT(*) FROM col_maps WHERE match_status = 'AUTO_MATCHED') AS auto_matched,
                (SELECT COUNT(*) FROM col_maps WHERE match_status = 'MANUAL') AS manual_matched,
                (SELECT COUNT(*) FROM col_maps WHERE match_status = 'REVIEW_REQUIRED') AS review_needed
            """
            params = (tenant_id, tenant_id)
        else:
            query = """
            SELECT
                (SELECT COUNT(*) FROM core.dataset_mappings WHERE is_active = true) AS tables_mapped,
                (SELECT COUNT(*) FROM core.column_mappings) AS columns_mapped,
                (SELECT COUNT(*) FROM core.column_mappings WHERE match_status = 'AUTO_MATCHED') AS auto_matched,
                (SELECT COUNT(*) FROM core.column_mappings WHERE match_status = 'MANUAL') AS manual_matched,
                (SELECT COUNT(*) FROM core.column_mappings WHERE match_status = 'REVIEW_REQUIRED') AS review_needed
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            r = cur.fetchone()
            total_cols = r[1] or 0
            matched = r[2] or 0
            match_rate = round((matched / total_cols * 100), 1) if total_cols > 0 else 0
            return {
                "tables_mapped": r[0] or 0,
                "columns_mapped": total_cols,
                "match_rate_percent": match_rate,
                "auto_matched": r[2] or 0,
                "manual_matched": r[3] or 0,
                "review_needed": r[4] or 0
            }

    def get_schema(self, tenant_id=None):
        """Get source schema info from discovery."""
        if tenant_id:
            query = """
            SELECT dd.table_name, dd.schema_name, sr.system_name, dd.system_id
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            WHERE sr.tenant_id = %s
            ORDER BY dd.table_name
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT dd.table_name, dd.schema_name, sr.system_name, dd.system_id
            FROM core.discovered_datasets dd
            JOIN core.system_registry sr ON sr.system_id = dd.system_id
            ORDER BY dd.table_name
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            rows = cur.fetchall()
            return [
                {"table_name": r[0], "schema_name": r[1], "system_name": r[2], "system_id": str(r[3])}
                for r in rows
            ]

    def get_all_columns(self, tenant_id=None):
        """Flat list of all column mappings with source/target names and types."""
        if tenant_id:
            query = """
            SELECT
                cm.column_mapping_id, cm.mapping_id,
                cm.match_status, cm.confidence_score, cm.match_reason,
                src_col.column_name AS source_column_name,
                src_col.data_type AS source_data_type,
                tgt_col.column_name AS target_column_name,
                tgt_col.data_type AS target_data_type,
                dm.source_table, dm.target_table,
                dm.source_schema, dm.target_schema,
                sr.system_name AS source_system_name
            FROM core.column_mappings cm
            JOIN core.dataset_mappings dm ON dm.mapping_id = cm.mapping_id
            JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
            LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
            LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
            WHERE sr.tenant_id = %s
            ORDER BY dm.source_table, src_col.column_position
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT
                cm.column_mapping_id, cm.mapping_id,
                cm.match_status, cm.confidence_score, cm.match_reason,
                src_col.column_name AS source_column_name,
                src_col.data_type AS source_data_type,
                tgt_col.column_name AS target_column_name,
                tgt_col.data_type AS target_data_type,
                dm.source_table, dm.target_table,
                dm.source_schema, dm.target_schema,
                sr.system_name AS source_system_name
            FROM core.column_mappings cm
            JOIN core.dataset_mappings dm ON dm.mapping_id = cm.mapping_id
            JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
            LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
            LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
            ORDER BY dm.source_table, src_col.column_position
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            rows = cur.fetchall()
            return [
                {
                    "column_mapping_id": str(r[0]),
                    "mapping_id": str(r[1]),
                    "match_status": r[2],
                    "confidence_score": float(r[3]) if r[3] else None,
                    "match_reason": r[4],
                    "source_column": r[5],
                    "source_data_type": r[6],
                    "target_column": r[7],
                    "target_data_type": r[8],
                    "source_table": r[9],
                    "target_table": r[10],
                    "source_schema": r[11],
                    "target_schema": r[12],
                    "source_system": r[13]
                }
                for r in rows
            ]

    def get_target_columns(self, system_id):
        """Get available target columns for a system."""
        query = """
        SELECT dc.column_name, dc.data_type, dd.table_name
        FROM core.discovered_columns dc
        JOIN core.discovered_datasets dd ON dd.discovered_dataset_id = dc.discovered_dataset_id
        WHERE dd.system_id = %s
        ORDER BY dd.table_name, dc.ordinal_position
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            rows = cur.fetchall()
            return [
                {"column_name": r[0], "data_type": r[1], "table_name": r[2]}
                for r in rows
            ]

    def save_column_mapping(self, column_mapping: dict) -> str:
        query = """
            INSERT INTO core.column_mappings
            (mapping_id, source_column_id, target_column_id,
             confidence_score, match_status, match_reason, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            RETURNING column_mapping_id
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (
                column_mapping["mapping_id"],
                column_mapping["source_column_id"],
                column_mapping.get("target_column_id"),
                column_mapping.get("confidence_score", 1.0),
                column_mapping.get("match_status", "MANUAL"),
                column_mapping.get("match_reason"),
            ))
            result = cur.fetchone()
        self.db.conn.commit()
        return str(result[0])

    def update_column_mapping(self, column_mapping_id: str, updates: dict) -> bool:
        set_parts = []
        values = []
        for k, v in updates.items():
            set_parts.append(f"{k} = %s")
            values.append(v)
        values.append(column_mapping_id)
        query = f"UPDATE core.column_mappings SET {', '.join(set_parts)} WHERE column_mapping_id = %s"
        with self.db.conn.cursor() as cur:
            cur.execute(query, values)
        self.db.conn.commit()
        return True

    def delete_column_mapping(self, column_mapping_id: str) -> bool:
        query = "DELETE FROM core.column_mappings WHERE column_mapping_id = %s"
        with self.db.conn.cursor() as cur:
            cur.execute(query, (column_mapping_id,))
        self.db.conn.commit()
        return True

    async def save_dataset_mapping(self, mapping: dict) -> str:
        query = """
            INSERT INTO core.dataset_mappings
            (project_id, source_system_id, target_system_id,
             source_schema, source_table, target_schema, target_table,
             is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, true, NOW())
            RETURNING mapping_id
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (
                mapping["project_id"],
                mapping["source_system_id"],
                mapping["target_system_id"],
                mapping.get("source_schema", "public"),
                mapping["source_table"],
                mapping.get("target_schema", "public"),
                mapping["target_table"],
            ))
            result = cur.fetchone()
        self.db.conn.commit()
        return str(result[0])

    async def get_dataset_mapping(self, mapping_id: str):
        query = "SELECT * FROM core.dataset_mappings WHERE mapping_id = %s"
        with self.db.conn.cursor() as cur:
            cur.execute(query, (mapping_id,))
            return cur.fetchone()

    async def get_dataset_mappings(self, project_id: str):
        query = "SELECT * FROM core.dataset_mappings WHERE project_id = %s AND is_active = true"
        with self.db.conn.cursor() as cur:
            cur.execute(query, (project_id,))
            return cur.fetchall()

    async def update_dataset_mapping(self, mapping_id: str, updates: dict):
        set_parts = []
        values = []
        for k, v in updates.items():
            set_parts.append(f"{k} = %s")
            values.append(v)
        values.append(mapping_id)
        query = f"UPDATE core.dataset_mappings SET {', '.join(set_parts)} WHERE mapping_id = %s"
        with self.db.conn.cursor() as cur:
            cur.execute(query, values)
        self.db.conn.commit()

    # =========================
    # REF 1: Soft delete + audit logging
    # =========================
    def soft_delete_column_mappings_by_pair(self, mapping_id: str, user_email: str) -> int:
        """Soft delete all column mappings for a table pair (set is_active = false)."""
        audit_query = """
            INSERT INTO core.column_mapping_audit
            (column_mapping_id, mapping_id, action, source_column, target_column, performed_by, performed_at)
            SELECT column_mapping_id, mapping_id, 'SOFT_DELETE', 
                   (SELECT column_name FROM core.dataset_columns WHERE column_id = cm.source_column_id),
                   (SELECT column_name FROM core.dataset_columns WHERE column_id = cm.target_column_id),
                   %s, NOW()
            FROM core.column_mappings cm
            WHERE cm.mapping_id = %s AND (cm.is_active IS NULL OR cm.is_active = true)
        """
        update_query = """
            UPDATE core.column_mappings 
            SET is_active = false, updated_at = NOW()
            WHERE mapping_id = %s AND (is_active IS NULL OR is_active = true)
        """
        with self.db.conn.cursor() as cur:
            cur.execute(audit_query, (user_email, mapping_id))
            cur.execute(update_query, (mapping_id,))
            count = cur.rowcount
        self.db.conn.commit()
        return count

    def soft_delete_all_column_mappings(self, user_email: str) -> int:
        """Soft delete ALL column mappings (set is_active = false)."""
        audit_query = """
            INSERT INTO core.column_mapping_audit
            (column_mapping_id, mapping_id, action, source_column, target_column, performed_by, performed_at)
            SELECT column_mapping_id, mapping_id, 'SOFT_DELETE_ALL',
                   (SELECT column_name FROM core.dataset_columns WHERE column_id = cm.source_column_id),
                   (SELECT column_name FROM core.dataset_columns WHERE column_id = cm.target_column_id),
                   %s, NOW()
            FROM core.column_mappings cm
            WHERE cm.is_active IS NULL OR cm.is_active = true
        """
        update_query = """
            UPDATE core.column_mappings 
            SET is_active = false, updated_at = NOW()
            WHERE is_active IS NULL OR is_active = true
        """
        with self.db.conn.cursor() as cur:
            cur.execute(audit_query, (user_email,))
            cur.execute(update_query)
            count = cur.rowcount
        self.db.conn.commit()
        return count

    def get_column_mapping_count_by_pair(self, mapping_id: str) -> int:
        """Count active column mappings for a table pair."""
        query = """
            SELECT COUNT(*) FROM core.column_mappings 
            WHERE mapping_id = %s AND (is_active IS NULL OR is_active = true)
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (mapping_id,))
            return cur.fetchone()[0]

    def get_total_active_column_mappings(self) -> int:
        """Count all active column mappings."""
        query = "SELECT COUNT(*) FROM core.column_mappings WHERE is_active IS NULL OR is_active = true"
        with self.db.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    # =========================
    # REF 2: Include empty table pairs
    # =========================
    def get_all_columns_with_pending(self, tenant_id=None):
        """Get all column mappings including empty table pairs from dataset_mappings."""
        if tenant_id:
            query = """
            SELECT
                dm.mapping_id,
                dm.source_table,
                dm.target_table,
                dm.source_schema,
                dm.target_schema,
                sr.system_name AS source_system_name,
                cm.column_mapping_id,
                cm.match_status,
                cm.confidence_score,
                cm.match_reason,
                src_col.column_name AS source_column_name,
                src_col.data_type AS source_data_type,
                tgt_col.column_name AS target_column_name,
                tgt_col.data_type AS target_data_type
            FROM core.dataset_mappings dm
            JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
            LEFT JOIN core.column_mappings cm ON cm.mapping_id = dm.mapping_id 
                AND (cm.is_active IS NULL OR cm.is_active = true)
            LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
            LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
            WHERE sr.tenant_id = %s AND dm.is_active = true
            ORDER BY dm.source_table, src_col.column_position
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT
                dm.mapping_id,
                dm.source_table,
                dm.target_table,
                dm.source_schema,
                dm.target_schema,
                sr.system_name AS source_system_name,
                cm.column_mapping_id,
                cm.match_status,
                cm.confidence_score,
                cm.match_reason,
                src_col.column_name AS source_column_name,
                src_col.data_type AS source_data_type,
                tgt_col.column_name AS target_column_name,
                tgt_col.data_type AS target_data_type
            FROM core.dataset_mappings dm
            JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
            LEFT JOIN core.column_mappings cm ON cm.mapping_id = dm.mapping_id 
                AND (cm.is_active IS NULL OR cm.is_active = true)
            LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
            LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
            WHERE dm.is_active = true
            ORDER BY dm.source_table, src_col.column_position
            """
            params = None

        with self.db.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            rows = cur.fetchall()
            
            result = []
            for r in rows:
                # If no column_mapping_id, this is an empty/pending table pair
                if r[6] is None:
                    result.append({
                        "column_mapping_id": None,
                        "mapping_id": str(r[0]),
                        "match_status": "PENDING",
                        "confidence_score": None,
                        "match_reason": None,
                        "source_column": None,
                        "source_data_type": None,
                        "target_column": None,
                        "target_data_type": None,
                        "source_table": r[1],
                        "target_table": r[2],
                        "source_schema": r[3],
                        "target_schema": r[4],
                        "source_system": r[5]
                    })
                else:
                    result.append({
                        "column_mapping_id": str(r[6]),
                        "mapping_id": str(r[0]),
                        "match_status": r[7],
                        "confidence_score": float(r[8]) if r[8] else None,
                        "match_reason": r[9],
                        "source_column": r[10],
                        "source_data_type": r[11],
                        "target_column": r[12],
                        "target_data_type": r[13],
                        "source_table": r[1],
                        "target_table": r[2],
                        "source_schema": r[3],
                        "target_schema": r[4],
                        "source_system": r[5]
                    })
            return result