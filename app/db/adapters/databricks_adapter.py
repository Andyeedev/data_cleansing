from .base.base_adapter import BaseAdapter
import databricks.sql


class DatabricksAdapter(BaseAdapter):

    def connect(self):
        self.connection = databricks.sql.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": False,
            "requires_inference": True
        })

    def execute(self, query):
        cur = self.connection.cursor()
        cur.execute(query)
        return cur.fetchall()

    def get_tables(self):
        rows = self.execute("SHOW TABLES")
        return [(r[0], r[1]) for r in rows]

    def get_columns(self, schema, table):
        rows = self.execute(f"DESCRIBE {schema}.{table}")
        return [r[0] for r in rows]

    def get_row_count(self, schema, table):
        return self.execute(f"SELECT COUNT(*) FROM {schema}.{table}")[0][0]

    def count_nulls(self, schema, table, column):
        return self.execute(
            f"SELECT COUNT(*) FROM {schema}.{table} WHERE {column} IS NULL"
        )[0][0]

    def get_column_type(self, schema, table, column):
        rows = self.execute(f"DESCRIBE {schema}.{table}")
        for r in rows:
            if r[0] == column:
                return r[1]
            
    def get_foreign_keys(self):
        return []  # Not supported → inference