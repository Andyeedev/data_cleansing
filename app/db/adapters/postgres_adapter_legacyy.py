import psycopg2
from .base_adapter import BaseAdapter


class PostgresAdapter(BaseAdapter):

    def connect_legacy(self):
        self.connection = psycopg2.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": True,
            "supports_information_schema": True,
            "requires_inference": False
        })

    def connect(self):

        import psycopg2

        # ✅ Only allow valid Postgres keys
        allowed_keys = ["host", "port", "dbname", "user", "password"]

        clean_config = {
            k: v for k, v in self.config.items()
            if k in allowed_keys
        }

        self.connection = psycopg2.connect(**clean_config)



    def execute(self, query, params=None):
        with self.connection.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

    def get_tables_legacy(self):
        query = """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        """
        return self.execute(query)

    def get_columns_legacy(self):
        query = """
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        """
        return self.execute(query)

    def get_constraints(self):
        query = """
        SELECT
            tc.table_name,
            tc.constraint_type,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        """
        return self.execute(query)
    


    def get_tables(self):

        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        """

        rows = self.execute(query)
        return [r[0] for r in rows]


    def get_columns(self, table):

        query = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = %s
        """

        rows = self.execute(query, (table,))
        return [r[0] for r in rows]
    
    def get_row_count(self, schema, table):

        query = f"SELECT COUNT(*) FROM {schema}.{table}"
        return self.execute(query)[0][0]