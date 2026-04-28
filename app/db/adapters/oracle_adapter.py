import oracledb
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class OracleAdapter(BaseAdapter):

    def connect(self):
        logger.info("Connecting to Oracle...")

        dsn = oracledb.makedsn(
            self.config.get("host"),
            self.config.get("port", 1521),
            service_name=self.config.get("service_name")
        )

        self.connection = oracledb.connect(
            user=self.config.get("user"),
            password=self.config.get("password"),
            dsn=dsn
        )

    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query, params or {})
        try:
            return cur.fetchall()
        except:
            return []