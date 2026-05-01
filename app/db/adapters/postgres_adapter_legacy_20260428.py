import psycopg2
from app.db.adapters.base_adapter import BaseAdapter
from app.utils.logger import get_logger

logger = get_logger(__name__)


class PostgresAdapter(BaseAdapter):

    # =========================
    # 🚀 INIT
    # =========================
    def __init__(self, config):
        super().__init__(config)

        # ✅ Use BaseAdapter connection lifecycle
        self.connect()

    # =========================
    # 🔌 CONNECTION IMPLEMENTATION
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
    # 🧪 VALIDATION QUERY
    # =========================
    def _validation_query(self):
        return "SELECT 1"

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