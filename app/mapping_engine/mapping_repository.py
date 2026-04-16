import uuid
from datetime import datetime


class MappingRepository:

    def __init__(self, db):
        self.db = db

    def insert_suggestions(self, rows):

        query = """
        INSERT INTO core.mapping_suggestions (
            suggestion_id,
            tenant_id,
            project_id,
            source_system_id,
            target_system_id,
            source_table,
            target_table,
            source_column,
            target_column,
            mapping_level,
            confidence_score,
            match_status,
            match_reason,
            mapping_method,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        self.db.execute_many(query, rows)