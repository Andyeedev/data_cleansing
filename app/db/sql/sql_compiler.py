class SQLCompiler:

    def __init__(self, adapter):
        self.adapter = adapter
        self.db_type = adapter.config.get("type")

    # ----------------------------------------
    # COUNT
    # ----------------------------------------
    def count_rows(self, schema, table):

        if self.db_type in ["postgres", "mysql"]:
            return f"SELECT COUNT(*) FROM {schema}.{table}"

        elif self.db_type == "sqlserver":
            return f"SELECT COUNT(*) FROM [{schema}].[{table}]"

        elif self.db_type == "bigquery":
            return f"SELECT COUNT(*) FROM `{schema}.{table}`"

        elif self.db_type == "snowflake":
            return f'SELECT COUNT(*) FROM "{schema}"."{table}"'

        elif self.db_type == "oracle":
            return f"SELECT COUNT(*) FROM {table}"

        else:
            return f"SELECT COUNT(*) FROM {schema}.{table}"


    # ----------------------------------------
    # NULL COUNT
    # ----------------------------------------
    def count_nulls(self, schema, table, column):

        if self.db_type == "sqlserver":
            return f"SELECT COUNT(*) FROM [{schema}].[{table}] WHERE [{column}] IS NULL"

        elif self.db_type == "bigquery":
            return f"SELECT COUNT(*) FROM `{schema}.{table}` WHERE {column} IS NULL"

        else:
            return f"SELECT COUNT(*) FROM {schema}.{table} WHERE {column} IS NULL"