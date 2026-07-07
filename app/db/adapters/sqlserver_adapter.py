import pyodbc
import time
import json

from app.db.adapters.base_adapter import BaseAdapter
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SQLServerAdapter(BaseAdapter):

    _pools = {}

    # ---------------------------------------------------------
    # INIT
    # ---------------------------------------------------------
    def __init__(self, config):
        super().__init__(config)
        self._init_pool()

    # ---------------------------------------------------------
    # INIT POOL (PER DB)
    # ---------------------------------------------------------
    def _init_pool_legacy(self):

        db_key = f"{self.config.get('host')}:{self.config.get('database')}"

        if db_key in SQLServerAdapter._pools:
            return

        try:
            logger.info(f"🔌 Initializing SQL Server pool for DB: {db_key}")

            SQLServerAdapter._pools[db_key] = []

            # Pre-create connections (simple pool)
            for _ in range(10):
                SQLServerAdapter._pools[db_key].append(self._create_connection())

        except Exception as e:
            logger.error(f"❌ Failed to initialize SQL Server pool: {str(e)}")
            raise

    def _init_pool(self):

        db_key = f"{self.config.get('host')}:{self.config.get('database')}"

        if db_key in SQLServerAdapter._pools:
            logger.info(f"♻️ Reusing existing SQL Server pool: {db_key}")
            return

        try:
            logger.info(f"🔥 Initializing SQL Server pool for DB: {db_key}")

            SQLServerAdapter._pools[db_key] = []

            for i in range(3):  # reduce noise
                logger.info(f"🔥 Creating SQL Server connection {i+1}")
                SQLServerAdapter._pools[db_key].append(self._create_connection())

            logger.info(
                f"✅ SQL Server pool initialized with "
                f"{len(SQLServerAdapter._pools[db_key])} connections"
            )

        except Exception as e:
            logger.error(f"❌ Failed to initialize SQL Server pool: {str(e)}")
            raise

    def _create_connection_legacy(self):

        driver = self.config.get("options", {}).get(
            "driver",
            "ODBC Driver 17 for SQL Server"
        )

        host = self.config["host"]
        port = self.config.get("port")
        instance = self.config.get("options", {}).get("instance")

        if "\\" in host:
            server = host
        elif instance:
            server = f"{host}\\{instance}"
        elif port:
            server = f"{host},{port}"
        else:
            server = host

        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={self.config['database']};"
            f"UID={self.config['user']};"
            f"PWD={self.config['password']};"
            "TrustServerCertificate=yes;"
        )

        return pyodbc.connect(conn_str)

    def _create_connection(self):

        logger.info("🔥🔥 SQLServerAdapter creating new connection...")

        driver = self.config.get("options", {}).get(
            "driver",
            "ODBC Driver 17 for SQL Server"
        )

        host = self.config["host"]
        port = self.config.get("port")
        instance = self.config.get("options", {}).get("instance")

        if "\\" in host:
            server = host
        elif instance:
            server = f"{host}\\{instance}"
        elif port:
            server = f"{host},{port}"
        else:
            server = host

        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={self.config['database']};"
            f"UID={self.config['user']};"
            f"PWD={self.config['password']};"
            "TrustServerCertificate=yes;"
        )

        logger.info(f"🔥 Connecting with: {server}/{self.config['database']}")

        return pyodbc.connect(conn_str)

    # ---------------------------------------------------------
    # DISABLE BASE CONNECT
    # ---------------------------------------------------------
    def _connect(self):
        pass

    # ---------------------------------------------------------
    # GET / RELEASE CONNECTION
    # ---------------------------------------------------------
    def _get_connection(self, pool):
        if not pool:
            raise Exception("Connection pool exhausted")
        return pool.pop()

    def _release_connection(self, pool, conn):
        pool.append(conn)

    # ---------------------------------------------------------
    # EXECUTE (MATCH POSTGRES)
    # ---------------------------------------------------------
    def execute(self, query, params=None, retries=3):

        db_key = f"{self.config.get('host')}:{self.config.get('database')}"
        pool = SQLServerAdapter._pools[db_key]

        attempt = 0

        while attempt < retries:

            conn = None
            start_time = time.time()

            try:
                conn = self._get_connection(pool)
                cursor = conn.cursor()

                # cursor.execute(query, params or ())

                query = self._transform_query(query)

                cursor.execute(query, params or ())

                try:
                    result = cursor.fetchall()
                except Exception:
                    result = []

                conn.commit()
                cursor.close()

                duration = round((time.time() - start_time) * 1000, 2)

                logger.info(json.dumps({
                    "event": "db_query",
                    "database": self.config.get("database"),
                    "duration_ms": duration,
                    "rows": len(result),
                    "query_preview": query[:100]
                }))

                if duration > 2000:
                    logger.warning(f"🐢 Slow query detected ({duration} ms)")

                return result

            except Exception as e:

                attempt += 1
                logger.warning(
                    f"⚠️ SQLServer query failed (attempt {attempt}/{retries}): {str(e)}"
                )

                if conn:
                    conn.rollback()

                if attempt >= retries:
                    logger.error("❌ All SQLServer attempts failed")
                    raise

                time.sleep(1)

            finally:
                if conn:
                    self._release_connection(pool, conn)

    # ---------------------------------------------------------
    def _validation_query(self):
        return "SELECT 1"

    def list_tables(self):
        query = """
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        """
        rows = self.execute(query)
        return [r[0] for r in rows] if rows else []

    def _transform_query(self, query):

        schema = self.config.get("schema", "dbo")

        # Replace Postgres schema with SQL Server schema
        query = query.replace("public.", f"{schema}.")

        # Replace %s with ?
        query = query.replace("%s", "?")

        return query
