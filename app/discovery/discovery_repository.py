import uuid
from datetime import datetime


class DiscoveryRepository:

    def __init__(self, conn):
        self.conn = conn

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

        dataset_id = str(uuid.uuid4())

        with self.conn.cursor() as cur:
            cur.execute(query, (
                dataset_id,
                project_id,
                system_id,
                schema,
                table,
                datetime.utcnow(),
                datetime.utcnow()
            ))

            result = cur.fetchone()
            self.conn.commit()

        return result[0]

    def insert_columns_legacy_1(self, dataset_id, columns):

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

        with self.conn.cursor() as cur:

            for col in columns:
                cur.execute(query, (
                    str(uuid.uuid4()),
                    dataset_id,
                    col["column_name"],
                    col["data_type"],
                    col["ordinal_position"],
                    col["is_nullable"],
                    col.get("is_primary_key", False),
                    datetime.utcnow()
                ))

            self.conn.commit()

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
        ON CONFLICT (discovered_dataset_id, column_name)
        DO UPDATE SET
            data_type = EXCLUDED.data_type,
            ordinal_position = EXCLUDED.ordinal_position,
            is_nullable = EXCLUDED.is_nullable,
            is_primary_key = EXCLUDED.is_primary_key;
        """

        with self.conn.cursor() as cur:
            for col in columns:
                cur.execute(query, (
                    str(uuid.uuid4()),
                    dataset_id,
                    col["column_name"],
                    col["data_type"],
                    col["ordinal_position"],
                    col["is_nullable"],
                    col.get("is_primary_key", False),
                    datetime.utcnow()
                ))

            self.conn.commit()