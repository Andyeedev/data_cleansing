def connection_factory_legacy(config):

    db_type = config.get("type")

    if db_type == "postgres":
        from app.db.adapters.postgres_adapter import PostgresAdapter
        return PostgresAdapter(config)

    elif db_type == "snowflake":
        from app.db.adapters.snowflake_adapter import SnowflakeAdapter
        return SnowflakeAdapter(config)

    else:
        raise ValueError(f"Unsupported DB type: {db_type}")
    



def connection_factory(config):

    db_type = config.get("type")

    if db_type == "postgres":
        from app.db.adapters.postgres_adapter import PostgresAdapter
        return PostgresAdapter(config)

    elif db_type == "snowflake":
        from app.db.adapters.snowflake_adapter import SnowflakeAdapter
        return SnowflakeAdapter(config)

    elif db_type == "sqlserver":
        from app.db.adapters.sqlserver_adapter import SQLServerAdapter
        return SQLServerAdapter(config)

    elif db_type == "mysql":
        from app.db.adapters.mysql_adapter import MySQLAdapter
        return MySQLAdapter(config)

    elif db_type == "bigquery":
        from app.db.adapters.bigquery_adapter import BigQueryAdapter
        return BigQueryAdapter(config)

    elif db_type == "oracle":
        from app.db.adapters.oracle_adapter import OracleAdapter
        return OracleAdapter(config)

    #elif db_type == "databricks":
    #    from flask import config
    #    from app.db.adapters.databricks_adapter import DatabricksAdapter
    #    return DatabricksAdapter(config)
    
    elif db_type == "databricks":
        from app.db.adapters.databricks_adapter import DatabricksAdapter
        return DatabricksAdapter(config)


    else:
        raise ValueError(f"Unsupported DB type: {db_type}")