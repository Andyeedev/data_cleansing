"""
Connection Adapter Framework

This module provides the adapter interface for database connections in the MAP platform.
"""

from .base_adapter import ConnectionAdapter
from .registry import AdapterRegistry
from .pool import ConnectionPoolManager
from .models import TableInfo, ColumnInfo, ConnectionTestResult
from .postgres import PostgresAdapter
from .sqlserver import SQLServerAdapter
from .mysql import MySQLAdapter
from .oracle import OracleAdapter
from .snowflake import SnowflakeAdapter
from .bigquery import BigQueryAdapter
from .databricks import DatabricksAdapter

__all__ = [
    "ConnectionAdapter",
    "AdapterRegistry",
    "ConnectionPoolManager",
    "TableInfo",
    "ColumnInfo",
    "ConnectionTestResult",
    "PostgresAdapter",
    "SQLServerAdapter",
    "MySQLAdapter",
    "OracleAdapter",
    "SnowflakeAdapter",
    "BigQueryAdapter",
    "DatabricksAdapter",
]
