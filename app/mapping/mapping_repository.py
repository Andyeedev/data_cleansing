from unittest import result
import uuid
from datetime import datetime


class MappingRepository:

    def __init__(self, conn):
        self.conn = conn

    # -----------------------------------------
    # DATASET MAPPING (UPSERT)
    # -----------------------------------------
    def upsert_dataset_mapping(self, project_id, source_id, target_id, match):

        query = """
        INSERT INTO core.dataset_mappings (
            mapping_id,
            project_id,
            source_system_id,
            target_system_id,
            source_schema,
            source_table,
            target_schema,
            target_table,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)

        ON CONFLICT (project_id, source_schema, source_table, target_schema, target_table)
        DO UPDATE SET
            target_table = EXCLUDED.target_table

        RETURNING mapping_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                project_id,
                source_id,
                target_id,
                "public",
                match["source_table"],
                "public",
                match["target_table"],
                datetime.utcnow()
            ))

            mapping_id = cur.fetchone()[0]
            self.conn.commit()

        return mapping_id

    # -----------------------------------------
    # DATASET COLUMNS (UPSERT SAFE)
    # -----------------------------------------
    def upsert_dataset_column_legacy_1(self, mapping_id, col, side):

        query = """
        INSERT INTO core.dataset_columns (
            column_id,
            mapping_id,
            column_name,
            data_type,
            column_side,
            is_nullable
        )
        VALUES (%s,%s,%s,%s,%s,%s)

        ON CONFLICT (mapping_id, column_name, column_side)
        DO UPDATE SET
            data_type = EXCLUDED.data_type

        RETURNING column_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                mapping_id,
                col["column_name"],
                col.get("data_type"),
                side,
                col.get("is_nullable", True)
            ))

            col_id = cur.fetchone()[0]
            self.conn.commit()

        return col_id


    def upsert_dataset_column_legacy_2(self, mapping_id, col, side):

        # -----------------------------------------
        # 🔥 DERIVE METADATA (CRITICAL FIX)
        # -----------------------------------------

        column_name = col["column_name"]
        data_type = col.get("data_type", "").lower()

        is_nullable = col.get("is_nullable", True)
        ordinal_position = col.get("ordinal_position")

        # 🔥 Primary Key Detection (from discovery OR fallback)
        is_primary_key = col.get("is_primary_key", False)

        # 🔥 SMART ROLE INFERENCE (replaces legacy dependency)
        inferred_role = None

        if is_primary_key:
            inferred_role = "PRIMARY_KEY"

        elif "id" in column_name.lower():
            inferred_role = "FOREIGN_KEY"

        elif any(x in data_type for x in ["int", "numeric", "decimal", "float"]):
            inferred_role = "NUMERIC_METRIC"

        elif "date" in data_type or "time" in data_type:
            inferred_role = "DATE_COLUMN"

        else:
            inferred_role = "DIMENSION"

        # -----------------------------------------
        # UPSERT
        # -----------------------------------------

        query = """
        INSERT INTO core.dataset_columns (
            column_id,
            mapping_id,
            column_name,
            column_position,
            data_type,
            column_side,
            is_nullable,
            is_primary_key,
            inferred_role,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)

        ON CONFLICT (mapping_id, column_name, column_side)
        DO UPDATE SET
            data_type = EXCLUDED.data_type,
            column_position = EXCLUDED.column_position,
            is_nullable = EXCLUDED.is_nullable,
            is_primary_key = EXCLUDED.is_primary_key,
            inferred_role = EXCLUDED.inferred_role

        RETURNING column_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                mapping_id,
                column_name,
                ordinal_position,
                data_type,
                side,
                is_nullable,
                is_primary_key,
                inferred_role,
                datetime.utcnow()
            ))

            col_id = cur.fetchone()[0]
            self.conn.commit()

        return col_id



    def upsert_dataset_column(self, mapping_id, col, side):

        import uuid
        from datetime import datetime

        column_name = col["column_name"]
        data_type = col.get("data_type", "").lower()
        is_nullable = col.get("is_nullable", True)
        column_position = col.get("ordinal_position")

        # -----------------------------------------
        # 🔥 TRUTH FROM DISCOVERY (NOT GUESSING)
        # -----------------------------------------

        is_primary_key = col.get("is_primary_key", False)
        is_foreign_key = col.get("is_foreign_key", False)
        references = col.get("references")  # dict or None

        # -----------------------------------------
        # 🔥 ROLE INFERENCE (NOW CORRECT)
        # -----------------------------------------

        if is_primary_key:
            inferred_role = "PRIMARY_KEY"

        elif is_foreign_key:
            inferred_role = "FOREIGN_KEY"

        elif column_name.lower().endswith("_id"):
            inferred_role = "IDENTIFIER"

        elif "date" in data_type:
            inferred_role = "DATE_COLUMN"

        elif any(x in data_type for x in ["int", "numeric", "decimal", "float"]):
            inferred_role = "NUMERIC_METRIC"

        else:
            inferred_role = "DIMENSION"

        # -----------------------------------------
        # 🔥 UPSERT
        # -----------------------------------------

        query = """
        INSERT INTO core.dataset_columns (
            column_id,
            mapping_id,
            column_name,
            column_position,
            data_type,
            column_side,
            is_nullable,
            is_primary_key,
            is_foreign_key,
            referenced_table,
            referenced_column,
            inferred_role,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)

        ON CONFLICT (mapping_id, column_name, column_side)
        DO UPDATE SET
            data_type = EXCLUDED.data_type,
            column_position = EXCLUDED.column_position,
            is_nullable = EXCLUDED.is_nullable,
            is_primary_key = EXCLUDED.is_primary_key,
            is_foreign_key = EXCLUDED.is_foreign_key,
            referenced_table = EXCLUDED.referenced_table,
            referenced_column = EXCLUDED.referenced_column,
            inferred_role = EXCLUDED.inferred_role
        RETURNING column_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                mapping_id,
                column_name,
                column_position,
                data_type,
                side,
                is_nullable,
                is_primary_key,
                is_foreign_key,
                references["table"] if references else None,
                references["column"] if references else None,
                inferred_role,
                datetime.utcnow()
            ))

            #col_id = cur.fetchone()[0]

            result = cur.fetchone()
            col_id = result[0] if result else None
            
            self.conn.commit()

        return col_id


    # -----------------------------------------
    # COLUMN MATCHING (UPSERT SAFE)
    # -----------------------------------------
    def upsert_column_mapping(self, mapping_id, src_id, tgt_id, match):

        query = """
        INSERT INTO core.column_mappings (
            column_mapping_id,
            mapping_id,
            source_column_id,
            target_column_id,
            confidence_score,
            match_status,
            match_reason
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)

        ON CONFLICT (mapping_id, source_column_id)
        DO UPDATE SET
            target_column_id = EXCLUDED.target_column_id,
            confidence_score = EXCLUDED.confidence_score,
            match_status = EXCLUDED.match_status,
            match_reason = EXCLUDED.match_reason
        RETURNING column_mapping_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                mapping_id,
                src_id,
                tgt_id,
                match["confidence"],
                match["status"],
                match["reason"]
            ))

            result = cur.fetchone()

            mapping_id = result[0] if result else None

        