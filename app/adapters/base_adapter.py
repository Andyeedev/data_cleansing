"""
Base Connection Adapter Interface

This module defines the abstract ConnectionAdapter interface that all database adapters must implement.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from .models import TableInfo, ColumnInfo, ConnectionTestResult
from ..config import ConnectionConfig
class ConnectionAdapter(ABC):
    """Abstract base class for all database adapters."""

    @property
    def config(self) -> Dict[str, Any]:
        """Backward-compatible config access - returns dict from _config dataclass."""
        if not hasattr(self, '_config') or self._config is None:
            return {}
        from dataclasses import asdict
        d = asdict(self._config)
        # Inject 'type' key from the class name for backward compat (e.g. PostgresAdapter → postgres)
        if 'type' not in d:
            cls_name = type(self).__name__
            d['type'] = cls_name.replace('Adapter', '').lower()
        return d

    @abstractmethod
    def connect(self, config: ConnectionConfig) -> None:
        """Establish connection to the database."""
        pass

    @abstractmethod
    def execute(self, query: str, params: tuple = None) -> Any:
        """Execute a query and return results."""
        pass

    @abstractmethod
    def fetch_all(self, query: str, params: tuple = None) -> List[Dict]:
        """Execute a query and return all rows as dictionaries."""
        pass

    @abstractmethod
    def list_tables(self, schema: str = None) -> List[TableInfo]:
        """List all tables in the database or schema."""
        pass

    @abstractmethod
    def list_columns(self, schema: str, table: str) -> List[ColumnInfo]:
        """List all columns in a table."""
        pass

    @abstractmethod
    def validate(self) -> bool:
        """Validate that the connection is alive and functional."""
        pass

    @abstractmethod
    def test_connection(self, config: ConnectionConfig) -> ConnectionTestResult:
        """Test a connection and return detailed results."""
        pass

    @abstractmethod
    def close(self) -> None:
        """Close the connection."""
        pass

    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of supported capabilities."""
        pass
