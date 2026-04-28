import snowflake.connector
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class SnowflakeAdapter(BaseAdapter):

    def connect(self):
        logger.info("Connecting to Snowflake...")

        self.connection = snowflake.connector.connect(
            user=self.config.get("user"),
            password=self.config.get("password"),
            account=self.config.get("account"),
            warehouse=self.config.get("warehouse"),
            database=self.config.get("database"),
            schema=self.config.get("schema")
        )

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query)
        try:
            return cur.fetchall()
        except:
            return []