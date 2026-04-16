import cx_Oracle
from .base.base_adapter import BaseAdapter


class OracleAdapter(BaseAdapter):

    def connect(self):
        self.connection = cx_Oracle.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": True,
            "supports_information_schema": False
        })

    def execute(self, query):
        cur = self.connection.cursor()
        cur.execute(query)
        return cur.fetchall()

    def get_tables(self):
        rows = self.execute("SELECT table_name FROM user_tables")
        return [("DEFAULT", r[0]) for r in rows]

    def get_columns(self, schema, table):
        rows = self.execute(
            f"SELECT column_name FROM user_tab_columns WHERE table_name = '{table}'"
        )
        return [r[0] for r in rows]

    def get_row_count(self, schema, table):
        return self.execute(f"SELECT COUNT(*) FROM {table}")[0][0]

    def count_nulls(self, schema, table, column):
        return self.execute(
            f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL"
        )[0][0]

    def get_column_type(self, schema, table, column):
        rows = self.execute(
            f"SELECT data_type FROM user_tab_columns WHERE table_name='{table}' AND column_name='{column}'"
        )
        return rows[0][0] if rows else None
    

    def get_foreign_keys(self):
        return self.execute("""
        SELECT
            a.owner,
            a.table_name,
            a.column_name,
            c.owner,
            c.table_name,
            c.column_name
        FROM all_cons_columns a
        JOIN all_constraints b
            ON a.constraint_name = b.constraint_name
        JOIN all_cons_columns c
            ON b.r_constraint_name = c.constraint_name
        WHERE b.constraint_type = 'R'
        """)