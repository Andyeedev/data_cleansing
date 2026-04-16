import uuid
from datetime import datetime


class SchemaDiffRepository:

    def __init__(self, conn):
        self.conn = conn

    def insert_table_diff(self, project_id, source_id, target_id, table_name, diff_type):

        query = """
        INSERT INTO core.schema_diffs (
            schema_diff_id,
            project_id,
            source_system_id,
            target_system_id,
            table_name,
            diff_type,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        RETURNING schema_diff_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                project_id,
                source_id,
                target_id,
                table_name,
                diff_type,
                datetime.utcnow()
            ))

            result = cur.fetchone()
            self.conn.commit()

        return result[0]

    def insert_column_diff(self, schema_diff_id, column_name, src_type, tgt_type, issue_type):

        query = """
        INSERT INTO core.schema_diff_details (
            detail_id,
            schema_diff_id,
            column_name,
            source_data_type,
            target_data_type,
            issue_type,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                schema_diff_id,
                column_name,
                src_type,
                tgt_type,
                issue_type,
                datetime.utcnow()
            ))

            self.conn.commit()