import pyodbc
from .base_adapter import BaseAdapter


class SQLServerAdapter(BaseAdapter):

    def connect(self):
        self.connection = pyodbc.connect(self.config["connection_string"])

        self.capabilities.update({
            "supports_constraints": True,
            "requires_inference": False
        })

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query, params or ())
        try:
            return cur.fetchall()
        finally:
            cur.close()

    def get_tables(self):
        return self.execute("""
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        """)

    def get_columns(self, schema, table):
        return [r[0] for r in self.execute("""
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA=? AND TABLE_NAME=?
        """, (schema, table))]

    def get_column_type(self, schema, table, column):
        r = self.execute("""
        SELECT DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?
        """, (schema, table, column))
        return r[0][0] if r else None

    def get_row_count(self, schema, table):
        return self.execute(f"SELECT COUNT(*) FROM [{schema}].[{table}]")[0][0]

    def count_nulls(self, schema, table, column):
        return self.execute(
            f"SELECT COUNT(*) FROM [{schema}].[{table}] WHERE [{column}] IS NULL"
        )[0][0]

    def get_foreign_keys(self):
        return self.execute("""
        SELECT
            sch1.name,
            tab1.name,
            col1.name,
            sch2.name,
            tab2.name,
            col2.name
        FROM sys.foreign_key_columns fkc
        JOIN sys.tables tab1 ON fkc.parent_object_id = tab1.object_id
        JOIN sys.schemas sch1 ON tab1.schema_id = sch1.schema_id
        JOIN sys.columns col1 ON fkc.parent_column_id = col1.column_id AND col1.object_id = tab1.object_id
        JOIN sys.tables tab2 ON fkc.referenced_object_id = tab2.object_id
        JOIN sys.schemas sch2 ON tab2.schema_id = sch2.schema_id
        JOIN sys.columns col2 ON fkc.referenced_column_id = col2.column_id AND col2.object_id = tab2.object_id
        """)

    def get_default_schema(self):
        return "dbo"