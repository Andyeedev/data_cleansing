from google.cloud import bigquery
from .base_adapter import BaseAdapter


class BigQueryAdapter(BaseAdapter):

    def connect(self):
        self.client = bigquery.Client()

        self.capabilities.update({
            "supports_constraints": False,
            "requires_inference": True
        })

    def execute(self, query, params=None):
        query_job = self.client.query(query)
        return [tuple(row) for row in query_job.result()]

    def get_tables(self):
        q = """
        SELECT table_schema, table_name
        FROM INFORMATION_SCHEMA.TABLES
        """
        return self.execute(q)

    def get_columns(self, schema, table):
        q = f"""
        SELECT column_name
        FROM `{schema}.INFORMATION_SCHEMA.COLUMNS`
        WHERE table_name = '{table}'
        """
        return [r[0] for r in self.execute(q)]

    def get_column_type(self, schema, table, column):
        q = f"""
        SELECT data_type
        FROM `{schema}.INFORMATION_SCHEMA.COLUMNS`
        WHERE table_name = '{table}' AND column_name = '{column}'
        """
        r = self.execute(q)
        return r[0][0] if r else None
    

    def get_row_count(self, schema, table):
        q = f"SELECT COUNT(*) FROM `{schema}.{table}`"
        return self.execute(q)[0][0]

    def count_nulls(self, schema, table, column):
        q = f"""
        SELECT COUNT(*) FROM `{schema}.{table}`
        WHERE {column} IS NULL
        """
        return self.execute(q)[0][0]

    def get_foreign_keys(self):
        # ❌ BigQuery has NO FK support
        return []

    def get_default_schema(self):
        return self.config.get("dataset")
    
    def get_foreign_keys(self):
        return []  # No FK support