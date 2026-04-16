#from app.db.db_connector import DBConnector
from .db_connector import DBConnector

# Future imports
# from app.db.snowflake_connector import SnowflakeConnector
# from app.db.databricks_connector import DatabricksConnector


def connection_factory(config):

    db_type = config.get("database_type", "").upper()

    print("DEBUG CONFIG:", config)

    if db_type == "POSTGRES":
        return DBConnector(config)

    # Future ready
    # elif db_type == "SNOWFLAKE":
    #     return SnowflakeConnector(config)

    # elif db_type == "DATABRICKS":
    #     return DatabricksConnector(config)

    else:
        raise Exception(f"Unsupported database type: {db_type}")