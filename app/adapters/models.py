"""
Database adapter models

This module defines data structures used by the connection adapter framework.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
@dataclass
class TableInfo:
    """Metadata about a database table."""
    schema_name: str
    table_name: str
    table_type: str  # 'BASE TABLE', 'VIEW', 'MATERIALIZED VIEW'
    row_count: Optional[int] = None
    column_count: Optional[int] = None
@dataclass
class ColumnInfo:
    """Metadata about a table column."""
    column_name: str
    data_type: str
    is_nullable: bool
    column_default: Optional[str] = None
    is_primary_key: bool = False
@dataclass
class ConnectionTestResult:
    """Result of a connection test."""
    success: bool
    message: str
    latency_ms: int
    server_version: Optional[str] = None
    capabilities: List[str] = None
