import psycopg2
from app.utils.logger import get_logger

logger = get_logger(__name__)


class PostgresAdapter:

     # =========================
    # 🚀 INIT
    # =========================
    def __init__(self, config):
        self.config = config
        self.connection = None

        # ✅ ALWAYS connect on init
        self.connect()

    # =========================
    # 🔌 CONNECTION
    # =========================
    def connect(self):
        self._connect()
        self.validate_connection()

    def _connect(self):
        logger.info("🔌 Connecting to PostgreSQL...")

        self.connection = psycopg2.connect(
            host=self.config.get("host"),
            port=self.config.get("port"),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    def validate_connection(self):
        if not self.connection:
            raise RuntimeError("❌ Failed to establish PostgreSQL connection")

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