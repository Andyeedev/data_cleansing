from app.utils.logger import get_logger

logger = get_logger(__name__)


def connection_factory(config):

    db_type = config.get("type") or config.get("database_type")
    
    if not db_type:
        raise ValueError("Database type is required.")
    
    db_type = db_type.lower().strip()

    

    if db_type == "postgres":
        from app.db.adapters.postgres_adapter import PostgresAdapter
        return PostgresAdapter(config)
    

    elif db_type == "mysql":
        from app.db.adapters.mysql_adapter import MySQLAdapter
        return MySQLAdapter(config)

    elif db_type == "sqlserver":
        from app.db.adapters.sqlserver_adapter import SQLServerAdapter
        return SQLServerAdapter(config)

    elif db_type == "snowflake":
        from app.db.adapters.snowflake_adapter import SnowflakeAdapter
        return SnowflakeAdapter(config)

    elif db_type == "bigquery":
        from app.db.adapters.bigquery_adapter import BigQueryAdapter
        return BigQueryAdapter(config)

    elif db_type == "oracle":
        from app.db.adapters.oracle_adapter import OracleAdapter
        return OracleAdapter(config)

    elif db_type == "databricks":
        from app.db.adapters.databricks_adapter import DatabricksAdapter
        return DatabricksAdapter(config)

    else:
        raise ValueError(f"Unsupported DB type: {db_type}")