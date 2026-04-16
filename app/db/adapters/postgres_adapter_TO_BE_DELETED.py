import psycopg2
from app.db.adapters.base_adapter import BaseAdapter


class PostgresAdapter(BaseAdapter):

    def __init__(self, connection):
        self.conn = connection

    def get_tables(self, schema: str):
        query = f"""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = '{schema}'
        """
        return [row[0] for row in self.conn.execute(query).fetchall()]

    def get_columns(self, schema: str, table: str):
        query = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '{schema}'
        AND table_name = '{table}'
        """
        return [row[0] for row in self.conn.execute(query).fetchall()]

    def get_row_count(self, schema: str, table: str):
        query = f"SELECT COUNT(*) FROM {schema}.{table}"
        return self.conn.execute(query).fetchone()[0]

    def get_column_count(self, schema: str, table: str):
        return len(self.get_columns(schema, table))

    def get_primary_keys(self, schema: str, table: str):
        query = f"""
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = '{schema}'
        AND tc.table_name = '{table}'
        """
        return [row[0] for row in self.conn.execute(query).fetchall()]

    def get_foreign_keys(self, schema: str, table: str):
        query = f"""
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = '{schema}'
        AND tc.table_name = '{table}'
        """
        return [row[0] for row in self.conn.execute(query).fetchall()]