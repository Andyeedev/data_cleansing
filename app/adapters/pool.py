"""
Connection Pool Manager

This module provides connection pooling management for database adapters.
Pool is a singleton — all adapters sharing the same database instance
reuse the same pool of connections.
"""

import threading
from typing import Dict, Any, Optional, List

from app.adapters.registry import AdapterRegistry


class ConnectionPool:
    """Thread-safe connection pool with health validation."""

    def __init__(self, adapter_class: type, config: Any, db_type: str,
                 min_connections: int = 2, max_connections: int = 5):
        self.adapter_class = adapter_class
        self.config = config
        self.db_type = db_type
        self.min_connections = min_connections
        self.max_connections = max_connections
        self._available: List[Any] = []
        self._active: List[Any] = []
        self._lock = threading.Lock()

    def acquire(self):
        """Acquire a connection from the pool, validating stale ones."""
        with self._lock:
            while self._available:
                conn = self._available.pop()
                if self._is_alive(conn):
                    self._active.append(conn)
                    return conn
                else:
                    self._safe_close(conn)
            if len(self._active) < self.max_connections:
                conn = self._create_connection()
                self._active.append(conn)
                return conn
        raise ConnectionError(
            f"Pool exhausted ({self.max_connections} active)"
        )

    def release(self, connection):
        """Return a connection to the pool."""
        with self._lock:
            if connection in self._active:
                self._active.remove(connection)
                self._available.append(connection)

    def health_check(self) -> bool:
        """Check if the pool is healthy."""
        with self._lock:
            alive = sum(1 for c in self._available if self._is_alive(c))
            return alive > 0 or len(self._active) > 0

    def close(self):
        """Close all connections in the pool."""
        with self._lock:
            for conn in self._available + self._active:
                self._safe_close(conn)
            self._available.clear()
            self._active.clear()

    def get_info(self) -> Dict[str, Any]:
        """Get pool information."""
        with self._lock:
            return {
                'db_type': self.db_type,
                'host': getattr(self.config, 'host', '?'),
                'min_connections': self.min_connections,
                'max_connections': self.max_connections,
                'available': len(self._available),
                'active': len(self._active),
                'is_healthy': self.health_check()
            }

    def _is_alive(self, conn) -> bool:
        """Validate connection with SELECT 1."""
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            return True
        except Exception:
            return False

    def _safe_close(self, conn):
        """Close connection ignoring errors."""
        try:
            if hasattr(conn, 'close'):
                conn.close()
        except Exception:
            pass

    def _create_connection(self):
        """Create a new connection based on database type."""
        config = self.config
        username = getattr(config, "username", None) or getattr(config, "user", None)
        password = getattr(config, "password", None)

        if self.db_type == "postgres":
            import psycopg2
            conn = psycopg2.connect(
                host=config.host,
                port=config.port,
                database=config.database,
                user=username,
                password=password,
                sslmode=getattr(config, "ssl_mode", "prefer"),
            )
            conn.autocommit = True
        elif self.db_type == "sqlserver":
            import pyodbc
            host = getattr(config, "host", "")
            port = getattr(config, "port", 1433)
            database = getattr(config, "database", "")
            driver = "ODBC Driver 17 for SQL Server"
            if "\\" in host:
                server = host
            elif port:
                server = f"{host},{port}"
            else:
                server = host
            conn_str = (
                f"DRIVER={{{driver}}};"
                f"SERVER={server};"
                f"DATABASE={database};"
                f"UID={username};"
                f"PWD={password};"
                "MARS_Connection=Yes;"
            )
            if host.endswith(".database.windows.net"):
                conn_str += "Encrypt=yes;TrustServerCertificate=yes;"
            else:
                conn_str += "TrustServerCertificate=yes;"
            conn = pyodbc.connect(conn_str, autocommit=True)
        elif self.db_type == "mysql":
            import psycopg2
            conn = psycopg2.connect(
                host=config.host,
                port=config.port,
                database=config.database,
                user=username,
                password=password,
            )
            conn.autocommit = True
        else:
            raise ValueError(f"Unsupported db_type for pool: {self.db_type}")

        return conn


class ConnectionPoolManager:
    """Singleton pool manager — all adapters share one pool per database instance."""

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._pools: Dict[str, ConnectionPool] = {}
            return cls._instance

    def get_connection(self, system_id: str, config: Any, db_type: str):
        """Get a connection from the shared pool."""
        pool_key = self._get_pool_key(config, db_type)

        if pool_key not in self._pools:
            adapter_class = AdapterRegistry.get(db_type)
            self._pools[pool_key] = ConnectionPool(
                adapter_class=adapter_class,
                config=config,
                db_type=db_type,
                min_connections=2,
                max_connections=5
            )

        return self._pools[pool_key].acquire()

    def release_connection(self, pool_key: str, connection):
        """Return a connection to the pool."""
        if pool_key in self._pools:
            self._pools[pool_key].release(connection)

    def release_by_config(self, config: Any, db_type: str, connection):
        """Return a connection using config-based lookup."""
        pool_key = self._get_pool_key(config, db_type)
        self.release_connection(pool_key, connection)

    def health_check(self) -> Dict[str, bool]:
        """Check health of all pools."""
        results = {}
        for pool_key, pool in self._pools.items():
            results[pool_key] = pool.health_check()
        return results

    def close_all(self):
        """Close all connections in all pools."""
        for pool in self._pools.values():
            pool.close()

    def reset(self):
        """Reset the pool manager - close all pools and clear the instance."""
        self.close_all()
        self._pools.clear()

    def get_pools_info(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all pools."""
        pools_info = {}
        for pool_key, pool in self._pools.items():
            pools_info[pool_key] = pool.get_info()
        return pools_info

    def _get_pool_key(self, config: Any, db_type: str) -> str:
        """Generate a unique pool key for the configuration."""
        return f"{db_type}:{config.host}:{config.port}:{config.database}"
