import snowflake.connector
from .base_adapter import BaseAdapter


class SnowflakeAdapter(BaseAdapter):

    def connect(self):
        self.connection = snowflake.connector.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": True,   # ✅ enable
            "supports_information_schema": True,
            "requires_inference": False     # ✅ Snowflake supports FK metadata
        })

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query, params or ())
        try:
            return cur.fetchall()
        finally:
            cur.close()

    # -----------------------------
    # METADATA
    # -----------------------------
    def get_tables_current_1(self):
        q = """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        """
        return self.execute(q)

    def get_columns_current_1(self, schema, table):
        q = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        """
        return [r[0] for r in self.execute(q, (schema, table))]

    def get_column_type(self, schema, table, column):
        q = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema=%s AND table_name=%s AND column_name=%s
        """
        r = self.execute(q, (schema, table, column))
        return r[0][0] if r else None

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    def get_row_count_current_1(self, schema, table):
        q = f'SELECT COUNT(*) FROM "{schema}"."{table}"'
        return self.execute(q)[0][0]

    def count_nulls(self, schema, table, column):
        q = f'''
        SELECT COUNT(*) FROM "{schema}"."{table}"
        WHERE "{column}" IS NULL
        '''
        return self.execute(q)[0][0]

    # -----------------------------
    # FK SUPPORT (CRITICAL)
    # -----------------------------
    def get_foreign_keys(self):

        q = """
        SELECT
            kcu.table_schema,
            kcu.table_name,
            kcu.column_name,
            kcu.referenced_table_schema,
            kcu.referenced_table_name,
            kcu.referenced_column_name
        FROM information_schema.key_column_usage kcu
        WHERE kcu.referenced_table_name IS NOT NULL
        """

        return self.execute(q)

    def get_default_schema(self):
        return "PUBLIC"
    



    def get_tables(self):
        rows = self.execute("SHOW TABLES")
        return [(r[2], r[1]) for r in rows]  # schema, table


    def get_columns(self, schema, table):
        
        rows = self.execute(f'DESCRIBE TABLE "{schema}"."{table}"')
        return [r[0] for r in rows]


    def get_row_count(self, schema, table):
        q = f'SELECT COUNT(*) FROM "{schema}"."{table}"'
        return self.execute(q)[0][0]