import uuid
from datetime import datetime


class DiscoveryRepository:

    def __init__(self, db):
        self.db = db

    def upsert_dataset(self, project_id, system_id, schema, table):
        query = """
        INSERT INTO core.discovered_datasets (
            discovered_dataset_id,
            project_id,
            system_id,
            schema_name,
            table_name,
            discovered_at,
            last_seen
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (project_id, system_id, schema_name, table_name)
        DO UPDATE SET last_seen = EXCLUDED.last_seen
        RETURNING discovered_dataset_id;
        """

        dataset_id = uuid.uuid4()

        result = self.db.fetch_one(query, (
            dataset_id,
            project_id,
            system_id,
            schema,
            table,
            datetime.utcnow(),
            datetime.utcnow()
        ))

        return result["discovered_dataset_id"]

    def insert_columns(self, dataset_id, columns):
        query = """
        INSERT INTO core.discovered_columns (
            column_id,
            discovered_dataset_id,
            column_name,
            data_type,
            ordinal_position,
            is_nullable,
            is_primary_key,
            discovered_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        rows = []
        for col in columns:
            rows.append((
                uuid.uuid4(),
                dataset_id,
                col["column_name"],
                col["data_type"],
                col["ordinal_position"],
                col["is_nullable"],
                col.get("is_primary_key", False),
                datetime.utcnow()
            ))

        self.db.execute_many(query, rows)