import mysql.connector
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class MySQLAdapter(BaseAdapter):
    def __init__(self, config):
        super().__init__(config)
        self.connect()

    def connect_current(self):
        logger.info("Connecting to MySQL...")

        self.connection = mysql.connector.connect(
            host=self.config.get("host"),
            port=self.config.get("port", 3306),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    def _connect(self):
        self.connection = mysql.connector.connect(
            host=self.config.get("host"),
            port=self.config.get("port"),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query, params)
        try:
            return cur.fetchall()
        except Exception:
            return []

    def _validation_query(self):
        return "SELECT 1"
