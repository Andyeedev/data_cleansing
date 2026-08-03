from app.api.core.app_config import CONFIG
from app.db_connector import DBConnector, PooledDBConnector


def get_db_connection():
    """
    Returns a pooled DB connection (PooledDBConnector) using config.yaml.
    Connections are managed by a shared ThreadedConnectionPool and returned
    automatically on close() or garbage collection.
    """
    return PooledDBConnector(CONFIG["engine_db"])
