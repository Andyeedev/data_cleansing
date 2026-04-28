from databricks import sql
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class DatabricksAdapter(BaseAdapter):

    def connect(self):
        logger.info("Connecting to Databricks...")

        self.connection = sql.connect(
            server_hostname=self.config.get("host"),
            http_path=self.config.get("http_path"),
            access_token=self.config.get("token")
        )

    def execute(self, query, params=None):
        with self.connection.cursor() as cur:
            cur.execute(query)
            try:
                return cur.fetchall()
            except:
                return []