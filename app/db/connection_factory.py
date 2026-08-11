from app.utils.logger import get_logger

logger = get_logger(__name__)


def _dict_to_config(db_type, config):
    """Convert a dict config to the appropriate dataclass, mapping 'user' → 'username'."""
    # Normalize 'user' → 'username' for all adapters
    cfg = dict(config)
    if "user" in cfg and "username" not in cfg:
        cfg["username"] = cfg.pop("user")

    if db_type == "postgres":
        from app.config import PostgresConfig
        return PostgresConfig(
            host=cfg.get("host", ""),
            port=cfg.get("port", 5432),
            database=cfg.get("database", ""),
            username=cfg.get("username"),
            password=cfg.get("password"),
            schema=cfg.get("schema", "public"),
            ssl_mode=cfg.get("ssl_mode", "prefer"),
        )
    elif db_type == "mysql":
        from app.config import MySQLConfig
        return MySQLConfig(
            host=cfg.get("host", ""),
            port=cfg.get("port", 3306),
            database=cfg.get("database", ""),
            username=cfg.get("username"),
            password=cfg.get("password"),
            charset=cfg.get("charset", "utf8mb4"),
        )
    elif db_type == "sqlserver":
        from app.config import SQLServerConfig
        return SQLServerConfig(
            host=cfg.get("host", ""),
            port=cfg.get("port", 1433),
            database=cfg.get("database", ""),
            username=cfg.get("username"),
            password=cfg.get("password"),
            schema=cfg.get("schema", "dbo"),
        )
    elif db_type == "snowflake":
        from app.config import SnowflakeConfig
        return SnowflakeConfig(
            account=cfg.get("account", ""),
            warehouse=cfg.get("warehouse", ""),
            database=cfg.get("database", ""),
            schema=cfg.get("schema", ""),
            username=cfg.get("username"),
            password=cfg.get("password"),
        )
    elif db_type == "oracle":
        from app.config import OracleConfig
        return OracleConfig(
            host=cfg.get("host", ""),
            port=cfg.get("port", 1521),
            service_name=cfg.get("service_name", ""),
            schema=cfg.get("schema", ""),
            username=cfg.get("username"),
            password=cfg.get("password"),
        )
    elif db_type == "bigquery":
        from app.config import BigQueryConfig
        return BigQueryConfig(
            project_id=cfg.get("project_id", ""),
            dataset=cfg.get("dataset", ""),
            location=cfg.get("location", "US"),
            credentials_file=cfg.get("credentials_file"),
        )
    elif db_type == "databricks":
        from app.config import DatabricksConfig
        return DatabricksConfig(
            host=cfg.get("host", ""),
            http_path=cfg.get("http_path", ""),
            catalog=cfg.get("catalog", ""),
            schema=cfg.get("schema", ""),
        )
    else:
        return cfg


def connection_factory(config):
    db_type = config.get("type") or config.get("database_type")

    if not db_type:
        raise ValueError("Database type is required.")

    db_type = db_type.lower().strip()

    if db_type == "postgres":
        from app.adapters.postgres import PostgresAdapter
        adapter = PostgresAdapter()
        adapter.connect(_dict_to_config("postgres", config))
        return adapter

    elif db_type == "mysql":
        from app.adapters.mysql import MySQLAdapter
        adapter = MySQLAdapter()
        adapter.connect(_dict_to_config("mysql", config))
        return adapter

    elif db_type == "sqlserver":
        from app.adapters.sqlserver import SQLServerAdapter
        adapter = SQLServerAdapter()
        adapter.connect(_dict_to_config("sqlserver", config))
        return adapter

    elif db_type == "snowflake":
        from app.adapters.snowflake import SnowflakeAdapter
        adapter = SnowflakeAdapter()
        adapter.connect(_dict_to_config("snowflake", config))
        return adapter

    elif db_type == "bigquery":
        from app.adapters.bigquery import BigQueryAdapter
        adapter = BigQueryAdapter()
        adapter.connect(_dict_to_config("bigquery", config))
        return adapter

    elif db_type == "oracle":
        from app.adapters.oracle import OracleAdapter
        adapter = OracleAdapter()
        adapter.connect(_dict_to_config("oracle", config))
        return adapter

    elif db_type == "databricks":
        from app.adapters.databricks import DatabricksAdapter
        adapter = DatabricksAdapter()
        adapter.connect(_dict_to_config("databricks", config))
        return adapter

    else:
        raise ValueError(f"Unsupported DB type: {db_type}")
