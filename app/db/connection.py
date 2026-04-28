from app.api.core.app_config import CONFIG
from app.db_connector import DBConnector


def get_db_connection():
    """
    Returns SYSTEM DB connection using config.yaml
    """
    return DBConnector(CONFIG["engine_db"])



