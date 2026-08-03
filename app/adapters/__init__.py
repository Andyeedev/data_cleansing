"""
Connection Adapter Framework

This module provides the adapter interface for database connections in the MAP platform.
"""

from .base_adapter import ConnectionAdapter
from .registry import AdapterRegistry
from .pool import ConnectionPoolManager
from .models import TableInfo, ColumnInfo, ConnectionTestResult
from .postgres import PostgresAdapter

__all__ = [
    "ConnectionAdapter",
    "AdapterRegistry",
    "ConnectionPoolManager",
    "TableInfo",
    "ColumnInfo",
    "ConnectionTestResult",
    "PostgresAdapter",
]
