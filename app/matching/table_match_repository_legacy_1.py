import uuid
from datetime import datetime


class TableMatchRepository:

    def __init__(self, conn):
        self.conn = conn

    def insert_match(self, project_id, source_id, target_id, match):

        query = """
        INSERT INTO core.table_matches (
            match_id,
            project_id,
            source_system_id,
            target_system_id,
            source_table,
            target_table,
            confidence_score,
            match_status,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING match_id;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                str(uuid.uuid4()),
                project_id,
                source_id,
                target_id,
                match["source_table"],
                match["target_table"],
                match["confidence"],
                match["status"],
                datetime.utcnow()
            ))

            match_id = cur.fetchone()[0]
            self.conn.commit()

        return match_id

    def insert_match_details(self, match_id, metrics):

        query = """
        INSERT INTO core.table_match_details (
            detail_id,
            match_id,
            metric_name,
            metric_score,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s)
        """

        with self.conn.cursor() as cur:
            for k, v in metrics.items():
                cur.execute(query, (
                    str(uuid.uuid4()),
                    match_id,
                    k,
                    v,
                    datetime.utcnow()
                ))

            self.conn.commit()

    def get_matches(self, project_id, source_id, target_id, status="AUTO_MATCHED"):

        query = """
        SELECT source_table, target_table, confidence_score
        FROM core.table_matches
        WHERE project_id = %s
        AND source_system_id = %s
        AND target_system_id = %s
        AND match_status = %s;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (project_id, source_id, target_id, status))
            rows = cur.fetchall()

        return [
            {
                "source_table": r[0],
                "target_table": r[1],
                "confidence": r[2]
            }
            for r in rows
        ]