import psycopg2
import psycopg2.pool
import threading
import logging

logger = logging.getLogger(__name__)


class DBConnector:
    """Direct connection — for short-lived scripts/subprocesses."""

    def __init__(self, db_config):
        self.conn = psycopg2.connect(
            host=db_config["host"],
            port=db_config["port"],
            database=db_config["database"],
            user=db_config["user"],
            password=db_config["password"],
        )
        self.conn.autocommit = True

    def execute(self, query, params=None):
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            try:
                return cur.fetchall()
            except Exception:
                return None

    def close(self):
        self.conn.close()


class PooledDBConnector:
    """
    Connection from a shared psycopg2 ThreadedConnectionPool.
    Used by the FastAPI application server (get_db_connection).
    Connections are returned to the pool on close() or __del__.
    """

    _pool = None
    _pool_lock = threading.Lock()
    _pool_config = None

    def __init__(self, db_config):
        with PooledDBConnector._pool_lock:
            if PooledDBConnector._pool is None:
                PooledDBConnector._pool_config = db_config
                PooledDBConnector._pool = psycopg2.pool.ThreadedConnectionPool(
                    minconn=2,
                    maxconn=20,
                    host=db_config["host"],
                    port=db_config["port"],
                    database=db_config["database"],
                    user=db_config["user"],
                    password=db_config["password"],
                )
                logger.info(
                    "Created connection pool: %s@%s:%s/%s (min=2, max=20)",
                    db_config["user"], db_config["host"], db_config["port"], db_config["database"],
                )
        self.conn = PooledDBConnector._pool.getconn()
        self.conn.autocommit = True
        self._returned = False

    def execute(self, query, params=None):
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            try:
                return cur.fetchall()
            except Exception:
                return None

    def cursor(self):
        return self.conn.cursor()

    def close(self):
        """Return the connection to the pool."""
        if not self._returned and PooledDBConnector._pool is not None:
            PooledDBConnector._pool.putconn(self.conn)
            self._returned = True

    def __del__(self):
        """Safety net: return connection to pool on GC."""
        try:
            self.close()
        except Exception:
            pass
