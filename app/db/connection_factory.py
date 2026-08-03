from app.utils.logger import get_logger

logger = get_logger(__name__)


def connection_factory(config):

    db_type = config.get("type") or config.get("database_type")

    if not db_type:
        raise ValueError("Database type is required.")

    db_type = db_type.lower().strip()

    if db_type == "postgres":
        from app.adapters.postgres import PostgresAdapter
        return PostgresAdapter()

    elif db_type == "mysql":
        from app.adapters.mysql import MySQLAdapter
        return MySQLAdapter()

    elif db_type == "sqlserver":
        from app.adapters.sqlserver import SQLServerAdapter
        return SQLServerAdapter()

    elif db_type == "snowflake":
        from app.adapters.snowflake import SnowflakeAdapter
        return SnowflakeAdapter()

    elif db_type == "bigquery":
        from app.adapters.bigquery import BigQueryAdapter
        return BigQueryAdapter()

    elif db_type == "oracle":
        from app.adapters.oracle import OracleAdapter
        return OracleAdapter()

    elif db_type == "databricks":
        from app.adapters.databricks import DatabricksAdapter
        return DatabricksAdapter()

    else:
        raise ValueError(f"Unsupported DB type: {db_type}")