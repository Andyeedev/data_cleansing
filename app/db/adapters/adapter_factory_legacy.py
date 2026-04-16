from .postgres_adapter import PostgresAdapter
from .snowflake_adapter import SnowflakeAdapter
from .oracle_adapter import OracleAdapter
from .sqlserver_adapter import SQLServerAdapter
from .bigquery_adapter import BigQueryAdapter
from .mysql_adapter import MySQLAdapter

class AdapterFactory:

    @staticmethod
    def get_adapter(db_type):

        if db_type == "postgres":
            return PostgresAdapter()

        elif db_type == "snowflake":
            return SnowflakeAdapter()

        elif db_type == "sqlserver":
            return SQLServerAdapter()

        elif db_type == "mysql":
            return MySQLAdapter()

        elif db_type == "bigquery":
            return BigQueryAdapter()

        else:
            raise Exception(f"Unsupported DB: {db_type}")