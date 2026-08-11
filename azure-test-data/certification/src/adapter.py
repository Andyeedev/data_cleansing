#!/usr/bin/env python3
"""
Phase 12: Standalone SQL Server Certification Adapter
Tests SQL Server → SQL Server migration flow outside MAP.

Capabilities:
- Connect to source and target SQL Server databases
- Discover schemas (tables, columns)
- Map source tables to target tables
- Execute validation rules
- Compare results
"""

import pyodbc
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass


@dataclass
class ColumnInfo:
    column_name: str
    data_type: str
    is_nullable: bool
    column_default: Optional[str]


@dataclass
class TableInfo:
    schema_name: str
    table_name: str
    columns: List[ColumnInfo]


@dataclass
class ValidationResult:
    rule_name: str
    source_value: any
    target_value: any
    status: str  # PASS, FAIL, ERROR
    details: str


class SQLServerCertificationAdapter:
    """Standalone adapter for SQL Server certification testing."""

    def __init__(self):
        self.source_conn = None
        self.target_conn = None

    # ==========================================
    # CONNECTION METHODS
    # ==========================================

    def connect_sql_login(
        self,
        host: str,
        database: str,
        username: str,
        password: str,
        connection_name: str = "source"
    ) -> bool:
        """Connect using SQL Login authentication."""
        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={host};"
            f"DATABASE={database};"
            f"UID={username};"
            f"PWD={password};"
            f"Encrypt=yes;"
            f"TrustServerCertificate=no;"
        )
        try:
            conn = pyodbc.connect(conn_str)
            if connection_name == "source":
                self.source_conn = conn
            else:
                self.target_conn = conn
            return True
        except Exception as e:
            print(f"Connection failed: {e}")
            return False

    def connect_managed_identity(
        self,
        host: str,
        database: str,
        client_id: str,
        connection_name: str = "source"
    ) -> bool:
        """Connect using Managed Identity authentication."""
        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={host};"
            f"DATABASE={database};"
            f"Authentication=ActiveDirectoryMsi;"
            f"UID={client_id};"
        )
        try:
            conn = pyodbc.connect(conn_str)
            if connection_name == "source":
                self.source_conn = conn
            else:
                self.target_conn = conn
            return True
        except Exception as e:
            print(f"Connection failed: {e}")
            return False

    # ==========================================
    # SCHEMA DISCOVERY
    # ==========================================

    def discover_tables(self, connection_name: str = "source") -> List[TableInfo]:
        """Discover all tables in the database."""
        conn = self.source_conn if connection_name == "source" else self.target_conn
        if not conn:
            raise ConnectionError(f"Not connected to {connection_name}")

        cursor = conn.cursor()
        cursor.execute("""
            SELECT TABLE_SCHEMA, TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_SCHEMA, TABLE_NAME
        """)
        rows = cursor.fetchall()

        tables = []
        for row in rows:
            schema_name = row[0]
            table_name = row[1]
            columns = self.discover_columns(schema_name, table_name, connection_name)
            tables.append(TableInfo(
                schema_name=schema_name,
                table_name=table_name,
                columns=columns
            ))
        cursor.close()
        return tables

    def discover_columns(
        self,
        schema_name: str,
        table_name: str,
        connection_name: str = "source"
    ) -> List[ColumnInfo]:
        """Discover all columns in a table."""
        conn = self.source_conn if connection_name == "source" else self.target_conn
        if not conn:
            raise ConnectionError(f"Not connected to {connection_name}")

        cursor = conn.cursor()
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        """, (schema_name, table_name))
        rows = cursor.fetchall()

        columns = []
        for row in rows:
            columns.append(ColumnInfo(
                column_name=row[0],
                data_type=row[1],
                is_nullable=row[2] == "YES",
                column_default=row[3]
            ))
        cursor.close()
        return columns

    # ==========================================
    # VALIDATION RULES
    # ==========================================

    def validate_row_count(
        self,
        schema_name: str,
        table_name: str
    ) -> ValidationResult:
        """Compare row counts between source and target."""
        try:
            source_count = self._get_count(schema_name, table_name, "source")
            target_count = self._get_count(schema_name, table_name, "target")

            if source_count == target_count:
                return ValidationResult(
                    rule_name="ROW_COUNT",
                    source_value=source_count,
                    target_value=target_count,
                    status="PASS",
                    details=f"Row counts match: {source_count}"
                )
            else:
                return ValidationResult(
                    rule_name="ROW_COUNT",
                    source_value=source_count,
                    target_value=target_count,
                    status="FAIL",
                    details=f"Row count mismatch: source={source_count}, target={target_count}"
                )
        except Exception as e:
            return ValidationResult(
                rule_name="ROW_COUNT",
                source_value=None,
                target_value=None,
                status="ERROR",
                details=str(e)
            )

    def validate_column_count(
        self,
        schema_name: str,
        table_name: str
    ) -> ValidationResult:
        """Compare column counts between source and target."""
        try:
            source_cols = self.discover_columns(schema_name, table_name, "source")
            target_cols = self.discover_columns(schema_name, table_name, "target")

            source_count = len(source_cols)
            target_count = len(target_cols)

            if source_count == target_count:
                return ValidationResult(
                    rule_name="COLUMN_COUNT",
                    source_value=source_count,
                    target_value=target_count,
                    status="PASS",
                    details=f"Column counts match: {source_count}"
                )
            else:
                return ValidationResult(
                    rule_name="COLUMN_COUNT",
                    source_value=source_count,
                    target_value=target_count,
                    status="FAIL",
                    details=f"Column count mismatch: source={source_count}, target={target_count}"
                )
        except Exception as e:
            return ValidationResult(
                rule_name="COLUMN_COUNT",
                source_value=None,
                target_value=None,
                status="ERROR",
                details=str(e)
            )

    def validate_column_names(
        self,
        schema_name: str,
        table_name: str
    ) -> ValidationResult:
        """Compare column names between source and target."""
        try:
            source_cols = self.discover_columns(schema_name, table_name, "source")
            target_cols = self.discover_columns(schema_name, table_name, "target")

            source_names = set(c.column_name for c in source_cols)
            target_names = set(c.column_name for c in target_cols)

            if source_names == target_names:
                return ValidationResult(
                    rule_name="COLUMN_NAMES",
                    source_value=list(source_names),
                    target_value=list(target_names),
                    status="PASS",
                    details="Column names match"
                )
            else:
                missing = source_names - target_names
                extra = target_names - source_names
                return ValidationResult(
                    rule_name="COLUMN_NAMES",
                    source_value=list(source_names),
                    target_value=list(target_names),
                    status="FAIL",
                    details=f"Missing in target: {missing}, Extra in target: {extra}"
                )
        except Exception as e:
            return ValidationResult(
                rule_name="COLUMN_NAMES",
                source_value=None,
                target_value=None,
                status="ERROR",
                details=str(e)
            )

    def validate_data_types(
        self,
        schema_name: str,
        table_name: str
    ) -> ValidationResult:
        """Compare column data types between source and target."""
        try:
            source_cols = {c.column_name: c.data_type for c in self.discover_columns(schema_name, table_name, "source")}
            target_cols = {c.column_name: c.data_type for c in self.discover_columns(schema_name, table_name, "target")}

            mismatches = []
            for col_name, source_type in source_cols.items():
                if col_name in target_cols:
                    target_type = target_cols[col_name]
                    if source_type != target_type:
                        mismatches.append(f"{col_name}: {source_type} vs {target_type}")

            if not mismatches:
                return ValidationResult(
                    rule_name="DATA_TYPES",
                    source_value=None,
                    target_value=None,
                    status="PASS",
                    details="All data types match"
                )
            else:
                return ValidationResult(
                    rule_name="DATA_TYPES",
                    source_value=None,
                    target_value=None,
                    status="FAIL",
                    details=f"Data type mismatches: {', '.join(mismatches)}"
                )
        except Exception as e:
            return ValidationResult(
                rule_name="DATA_TYPES",
                source_value=None,
                target_value=None,
                status="ERROR",
                details=str(e)
            )

    # ==========================================
    # HELPER METHODS
    # ==========================================

    def _get_count(self, schema_name: str, table_name: str, connection_name: str) -> int:
        """Get row count for a table."""
        conn = self.source_conn if connection_name == "source" else self.target_conn
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM [{schema_name}].[{table_name}]")
        count = cursor.fetchone()[0]
        cursor.close()
        return count

    def close(self):
        """Close all connections."""
        if self.source_conn:
            self.source_conn.close()
            self.source_conn = None
        if self.target_conn:
            self.target_conn.close()
            self.target_conn = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
