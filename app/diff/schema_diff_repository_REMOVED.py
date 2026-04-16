import uuid
from datetime import datetime


class SchemaDiffRepository:
    def __init__(self, conn):
        self.conn = conn

    def upsert_schema_diff(self, project_id, source_id, target_id, table_name, diff_type):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT schema_diff_id FROM core.schema_diffs
                WHERE project_id = %s
                AND source_system_id = %s
                AND target_system_id = %s
                AND table_name = %s
            """, (project_id, source_id, target_id, table_name))

            existing = cur.fetchone()

            if existing:
                return existing[0]

            diff_id = str(uuid.uuid4())

            cur.execute("""
                INSERT INTO core.schema_diffs (
                    schema_diff_id, project_id, source_system_id, target_system_id,
                    table_name, diff_type, created_at
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (
                diff_id, project_id, source_id, target_id,
                table_name, diff_type, datetime.utcnow()
            ))

        self.conn.commit()
        return diff_id

    def insert_diff_details(self, diff_id, diffs):
        with self.conn.cursor() as cur:

            for col in diffs["missing_in_target"]:
                cur.execute("""
                    INSERT INTO core.schema_diff_details
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (
                    str(uuid.uuid4()), diff_id, col,
                    "MISSING_IN_TARGET", None, None
                ))

            for col in diffs["missing_in_source"]:
                cur.execute("""
                    INSERT INTO core.schema_diff_details
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (
                    str(uuid.uuid4()), diff_id, col,
                    "MISSING_IN_SOURCE", None, None
                ))

            for m in diffs["type_mismatches"]:
                cur.execute("""
                    INSERT INTO core.schema_diff_details
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (
                    str(uuid.uuid4()), diff_id,
                    m["column"],
                    "TYPE_MISMATCH",
                    m["source_type"],
                    m["target_type"]
                ))

        self.conn.commit()