import psycopg2
from psycopg2 import pool  # noqa: F401
import time
import json

from app.db.adapters.base_adapter import BaseAdapter
from app.utils.logger import get_logger

logger = get_logger(__name__)


class PostgresAdapter(BaseAdapter):

    # _pool = None
    _pools = {}

    # ---------------------------------------------------------
    # INIT
    # ---------------------------------------------------------
    def __init__(self, config):
        super().__init__(config)
        self._init_pool()

    # ---------------------------------------------------------
    # INIT POOL (ONCE PER PROCESS)
    # ---------------------------------------------------------
    def _init_pool_legacy(self):

        if PostgresAdapter._pool:
            return

        try:
            logger.debug("🔌 Initializing PostgreSQL connection pool...")

            PostgresAdapter._pool = psycopg2.pool.SimpleConnectionPool(
                1,
                20,  # ✅ increase pool size for parallel engine
                host=self.config.get("host"),
                port=self.config.get("port"),
                database=self.config.get("database"),
                user=self.config.get("user"),
                password=self.config.get("password"),
                connect_timeout=10
            )

        except Exception as e:
            logger.error(f"❌ Failed to initialize pool: {str(e)}")
            raise

    def _init_pool(self):

        db_key = (
            f"{self.config.get('host')}:{self.config.get('port')}:"
            f"{self.config.get('database')}"
        )

        if db_key in PostgresAdapter._pools:
            return

        try:
            logger.debug(f"🔌 Initializing pool for DB: {db_key}")

            PostgresAdapter._pools[db_key] = psycopg2.pool.SimpleConnectionPool(
                1,
                20,
                host=self.config.get("host"),
                port=self.config.get("port"),
                database=self.config.get("database"),
                user=self.config.get("user"),
                password=self.config.get("password"),
                connect_timeout=10
            )

        except Exception as e:
            logger.error(f"❌ Failed to initialize pool: {str(e)}")
            raise

    # ---------------------------------------------------------
    # ❌ DO NOT USE BASE CONNECTION ANYMORE
    # ---------------------------------------------------------
    def _connect(self):
        pass  # intentionally disabled

    # ---------------------------------------------------------
    # EXECUTE (POOL SAFE)
    # ---------------------------------------------------------
    def execute_legacy(self, query, params=None, retries=3):

        attempt = 0

        while attempt < retries:

            conn = None

            try:
                conn = PostgresAdapter._pool.getconn()
                cursor = conn.cursor()

                cursor.execute(query, params or ())

                if cursor.description:
                    result = cursor.fetchall()
                else:
                    result = []

                conn.commit()
                cursor.close()

                return result

            except Exception as e:

                attempt += 1

                logger.warning(
                    f"⚠️ Query failed (attempt {attempt}/{retries}): {str(e)}"
                )

                if conn:
                    conn.rollback()

                if attempt >= retries:
                    logger.error("❌ All connection attempts failed")
                    raise

                time.sleep(1)

            finally:
                if conn:
                    PostgresAdapter._pool.putconn(conn)

    def execute_legacy_2(self, query, params=None, retries=3):

        attempt = 0

        while attempt < retries:

            conn = None

            try:
                # conn = PostgresAdapter._pool.getconn()

                db_key = (
                    f"{self.config.get('host')}:{self.config.get('port')}:"
                    f"{self.config.get('database')}"
                )
                db_pool = PostgresAdapter._pools[db_key]

                conn = db_pool.getconn()

                cursor = conn.cursor()

                cursor.execute(query, params or ())

                if cursor.description:
                    result = cursor.fetchall()
                else:
                    result = []

                conn.commit()
                cursor.close()

                return result

            except Exception as e:

                attempt += 1

                logger.warning(
                    f"⚠️ Query failed (attempt {attempt}/{retries}): {str(e)}"
                )

                if conn:
                    conn.rollback()

                if attempt >= retries:
                    logger.error("❌ All connection attempts failed")
                    raise

                time.sleep(1)

            finally:
                if conn:
                    # PostgresAdapter._pool.putconn(conn)
                    db_pool.putconn(conn)

    def execute(self, query, params=None, retries=3):

        db_key = (
            f"{self.config.get('host')}:{self.config.get('port')}:"
            f"{self.config.get('database')}"
        )
        db_pool = PostgresAdapter._pools[db_key]

        attempt = 0

        while attempt < retries:

            conn = None
            start_time = time.time()

            try:
                conn = db_pool.getconn()
                cursor = conn.cursor()

                cursor.execute(query, params or ())

                if cursor.description:
                    result = cursor.fetchall()
                else:
                    result = []

                conn.commit()
                cursor.close()

                duration = round((time.time() - start_time) * 1000, 2)

                # ✅ STRUCTURED LOG
                logger.debug(json.dumps({
                    "event": "db_query",
                    "database": self.config.get("database"),
                    "duration_ms": duration,
                    "rows": len(result),
                    "query_preview": query[:100]
                }))

                # 🐢 SLOW QUERY ALERT
                if duration > 2000:
                    logger.warning(f"🐢 Slow query detected ({duration} ms)")

                return result

            except Exception as e:

                attempt += 1
                logger.warning(f"⚠️ Query failed (attempt {attempt}/{retries}): {str(e)}")

                if conn:
                    conn.rollback()

                if attempt >= retries:
                    logger.error("❌ All connection attempts failed")
                    raise

                time.sleep(1)

            finally:
                if conn:
                    db_pool.putconn(conn)

    # ---------------------------------------------------------
    # KEEP THESE (DO NOT REMOVE)
    # ---------------------------------------------------------
    def _validation_query(self):
        return "SELECT 1"

    def list_tables(self):
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        """
        rows = self.execute(query)
        return [r[0] for r in rows] if rows else []
