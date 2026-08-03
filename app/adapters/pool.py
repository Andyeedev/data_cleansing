"""
Connection Pool Manager

This module provides connection pooling management for database adapters.
"""

from typing import Dict, Any, Optional, List


class ConnectionPool:
    """Simple connection pool implementation."""

    def __init__(self, adapter_class: type, config: Any, min_connections: int, max_connections: int):
        self.adapter_class = adapter_class
        self.config = config
        self.min_connections = min_connections
        self.max_connections = max_connections
        self._available_connections: List[Any] = []
        self._active_connections: List[Any] = []

    def acquire(self):
        """Acquire a connection from the pool."""
        if self._available_connections:
            connection = self._available_connections.pop()
            self._active_connections.append(connection)
            return connection
        else:
            return self._create_connection()

    def release(self, connection):
        """Return a connection to the pool."""
        if connection in self._active_connections:
            self._active_connections.remove(connection)
            self._available_connections.append(connection)

    def health_check(self) -> bool:
        """Check if the pool is healthy."""
        return len(self._active_connections) > 0

    def close(self):
        """Close all connections in the pool."""
        # Close all available and active connections
        for connection in self._available_connections + self._active_connections:
            if hasattr(connection, 'close'):
                connection.close()
        self._available_connections.clear()
        self._active_connections.clear()

    def get_info(self) -> Dict[str, Any]:
        """Get pool information."""
        return {
            'min_connections': self.min_connections,
            'max_connections': self.max_connections,
            'available_connections': len(self._available_connections),
            'active_connections': len(self._active_connections),
            'is_healthy': self.health_check()
        }

    def _create_connection(self):
        """Create a new connection."""
        # This would normally create a real database connection
        # For now, return a mock connection
        class MockConnection:
            def close(self):
                pass

        connection = MockConnection()
        self._active_connections.append(connection)
        return connection


class ConnectionPoolManager:
    """Manages connection pools per database type and instance."""

    def __init__(self):
        self._pools: Dict[str, ConnectionPool] = {}

    def get_connection(self, system_id: str, config: Any, db_type: str):
        """Get a connection from the pool or create a new one."""
        pool_key = self._get_pool_key(config, db_type)

        if pool_key not in self._pools:
            adapter_class = AdapterRegistry.get(db_type)
            self._pools[pool_key] = ConnectionPool(
                adapter_class=adapter_class,
                config=config,
                min_connections=1,
                max_connections=20
            )

        return self._pools[pool_key].acquire()

    def release_connection(self, pool_key: str, connection):
        """Return a connection to the pool."""
        if pool_key in self._pools:
            self._pools[pool_key].release(connection)

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

    def get_pools_info(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all pools."""
        pools_info = {}
        for pool_key, pool in self._pools.items():
            pools_info[pool_key] = pool.get_info()
        return pools_info

    def _get_pool_key(self, config: Any, db_type: str) -> str:
        """Generate a unique pool key for the configuration."""
        return f"{db_type}:{config.host}:{config.port}:{config.database}"
