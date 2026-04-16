import mysql.connector
from .base.base_adapter import BaseAdapter


class MySQLAdapter(BaseAdapter):

    def connect(self):
        self.connection = mysql.connector.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": True,
            "supports_information_schema": True
        })

    def execute(self, query):
        cur = self.connection.cursor()
        cur.execute(query)
        return cur.fetchall()

    def get_tables(self):
        rows = self.execute("SHOW TABLES")
        return [(self.config["database"], r[0]) for r in rows]

    def get_columns(self, schema, table):
        rows = self.execute(f"DESCRIBE {table}")
        return [r[0] for r in rows]

    def get_row_count_current_1(self, schema, table):
        return self.execute(f"SELECT COUNT(*) FROM {table}")[0][0]
    
    def get_row_count(self, schema, table):
        query = self.sql.count_rows(schema, table)
        return self.execute(query)[0][0]

    def count_nulls_current_1(self, schema, table, column):
        return self.execute(
            f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL"
        )[0][0]
    
    def count_nulls(self, schema, table, column):
        query = self.sql.count_nulls(schema, table, column)
        return self.execute(query)[0][0]

    def get_column_type(self, schema, table, column):
        rows = self.execute(f"DESCRIBE {table}")
        for r in rows:
            if r[0] == column:
                return r[1]
            
    def get_foreign_keys(self):
        return self.execute("""
        SELECT
            TABLE_SCHEMA,
            TABLE_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_SCHEMA,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_NAME IS NOT NULL
        """)


    


