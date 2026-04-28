import psycopg2
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class PostgresAdapter(BaseAdapter):

    def __init__(self, config):
        super().__init__(config)

    # =========================
    # 🔌 CONNECTION
    # =========================
    def _connect(self):
        logger.info("🔌 Connecting to PostgreSQL...")

        self.connection = psycopg2.connect(
            host=self.config.get("host"),
            port=self.config.get("port"),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    # =========================
    # 🔄 EXECUTE
    # =========================
    def execute(self, query, params=None):
        with self.connection.cursor() as cursor:
            cursor.execute(query, params or ())

            if cursor.description:
                return cursor.fetchall()

            self.connection.commit()
            return None

    # =========================
    # 📋 TABLES
    # =========================
    def list_tables(self):
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        """
        rows = self.execute(query)
        return [r[0] for r in rows] if rows else []