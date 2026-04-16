import uuid
from datetime import datetime


class TableMatchRepository:
    def __init__(self, conn):
        self.conn = conn

    def upsert_match(self, project_id, source_id, target_id, match):
        with self.conn.cursor() as cur:

            cur.execute("""
                SELECT match_id FROM core.table_matches
                WHERE project_id = %s
                AND source_system_id = %s
                AND target_system_id = %s
                AND source_table = %s
            """, (project_id, source_id, target_id, match["source_table"]))

            existing = cur.fetchone()

            if existing:
                match_id = existing[0]

                cur.execute("""
                    UPDATE core.table_matches
                    SET target_table = %s,
                        confidence_score = %s,
                        match_status = %s,
                        created_at = %s
                    WHERE match_id = %s
                """, (
                    match["target_table"],
                    match["confidence_score"],
                    self._get_status(match["confidence_score"]),
                    datetime.utcnow(),
                    match_id
                ))

            else:
                match_id = str(uuid.uuid4())

                cur.execute("""
                    INSERT INTO core.table_matches (
                        match_id, project_id, source_system_id, target_system_id,
                        source_table, target_table, confidence_score, match_status, created_at
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """, (
                    match_id, project_id, source_id, target_id,
                    match["source_table"], match["target_table"],
                    match["confidence_score"],
                    self._get_status(match["confidence_score"]),
                    datetime.utcnow()
                ))

            self._save_details(match_id, match["details"])

        self.conn.commit()

    def _save_details(self, match_id, details):
        with self.conn.cursor() as cur:
            for k, v in details.items():
                cur.execute("""
                    INSERT INTO core.table_match_details (
                        detail_id, match_id, metric_name, metric_score, created_at
                    )
                    VALUES (%s,%s,%s,%s,%s)
                """, (
                    str(uuid.uuid4()),
                    match_id,
                    k,
                    v,
                    datetime.utcnow()
                ))

    def _get_status(self, score):
        if score >= 0.85:
            return "AUTO_MATCHED"
        elif score >= 0.6:
            return "REVIEW"
        return "REJECTED"