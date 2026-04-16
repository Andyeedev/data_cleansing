import snowflake.connector
from .base.base_adapter import BaseAdapter


class SnowflakeAdapter(BaseAdapter):

    def connect(self):
        self.connection = snowflake.connector.connect(**self.config)

        self.capabilities.update({
            "supports_constraints": False,   # ⚠️ key difference
            "supports_information_schema": True,
            "requires_inference": True
        })

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query)
        return cur.fetchall()

    def get_tables(self):
        return self.execute("SHOW TABLES")

    def get_columns(self):
        return self.execute("SHOW COLUMNS")

    def get_constraints(self):
        return []  # Snowflake limitations → handled via inference