#!/usr/bin/env python3
"""
Snowflake Certification — Standalone Adapter (OUTSIDE MAP)
Reuses Phase 12 azure-test-data/certification/src/adapter.py pattern, adapted for Snowflake JWT
Location: snowflake-certification/src/adapter.py — NOT in app/adapters/ until Gate 2 approval
Auth: SNOWFLAKE_JWT via private_key_path (path-only, never PEM in Terraform state per 12_9 §5.2)
Least-privilege: tested with MAP_CERT_ROLE, not ACCOUNTADMIN (warehouse creation used ACCOUNTADMIN only)
"""

from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import snowflake.connector
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend


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
    source_value: Any
    target_value: Any
    status: str  # PASS, FAIL, ERROR
    details: str


class SnowflakeCertificationAdapter:
    """Standalone adapter for Snowflake certification — JWT + password, discovery, validation."""

    def __init__(self):
        self.source_conn = None
        self.target_conn = None

    # ---- Connection ----
    def _load_private_key(self, private_key_path: str):
        with open(private_key_path, 'rb') as f:
            p_key = serialization.load_pem_private_key(f.read(), password=None, backend=default_backend())
            return p_key.private_bytes(
                encoding=serialization.Encoding.DER,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            )

    def connect_jwt(self, account: str, user: str, private_key_path: str, role: str, warehouse: str, database: str, schema: str, connection_name: str = "source") -> bool:
        """Connect via SNOWFLAKE_JWT (private_key_path outside Terraform)."""
        pkb = self._load_private_key(private_key_path)
        try:
            conn = snowflake.connector.connect(
                account=account,
                user=user,
                private_key=pkb,
                role=role,
                warehouse=warehouse,
                database=database,
                schema=schema,
                authenticator='snowflake_jwt',
            )
            if connection_name == "source":
                self.source_conn = conn
            else:
                self.target_conn = conn
            return True
        except Exception as e:
            print(f"JWT connect failed ({connection_name}): {e}")
            return False

    def connect_password(self, account: str, user: str, password: str, role: str, warehouse: str, database: str, schema: str, connection_name: str = "source") -> bool:
        try:
            conn = snowflake.connector.connect(
                account=account, user=user, password=password, role=role,
                warehouse=warehouse, database=database, schema=schema,
            )
            if connection_name == "source":
                self.source_conn = conn
            else:
                self.target_conn = conn
            return True
        except Exception as e:
            print(f"Password connect failed ({connection_name}): {e}")
            return False

    # ---- Discovery ----
    def discover_tables(self, connection_name: str = "source") -> List[TableInfo]:
        conn = self.source_conn if connection_name == "source" else self.target_conn
        if not conn:
            raise ConnectionError(f"Not connected to {connection_name}")
        cs = conn.cursor()
        cs.execute("SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_SCHEMA, TABLE_NAME")
        rows = cs.fetchall()
        tables = []
        for schema_name, table_name in rows:
            cols = self.discover_columns(schema_name, table_name, connection_name)
            tables.append(TableInfo(schema_name=schema_name, table_name=table_name, columns=cols))
        cs.close()
        return tables

    def discover_columns(self, schema_name: str, table_name: str, connection_name: str = "source") -> List[ColumnInfo]:
        conn = self.source_conn if connection_name == "source" else self.target_conn
        cs = conn.cursor()
        cs.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
            ORDER BY ORDINAL_POSITION
        """, (schema_name, table_name))
        rows = cs.fetchall()
        cs.close()
        return [ColumnInfo(column_name=r[0], data_type=r[1], is_nullable=r[2]=='YES', column_default=r[3]) for r in rows]

    # ---- Validation ----
    def _get_count(self, schema: str, table: str, conn_name: str) -> int:
        conn = self.source_conn if conn_name == "source" else self.target_conn
        cs = conn.cursor()
        # Use 3-part unquoted uppercase (Snowflake default)
        cs.execute(f'SELECT COUNT(*) FROM {schema}.{table}')
        cnt = cs.fetchone()[0]
        cs.close()
        return cnt

    def validate_row_count(self, schema: str, table: str) -> ValidationResult:
        try:
            s = self._get_count(schema, table, "source")
            t = self._get_count(schema, table, "target")
            return ValidationResult("ROW_COUNT", s, t, "PASS" if s==t else "FAIL", f"Row counts match: {s}" if s==t else f"Row count mismatch: source={s}, target={t}")
        except Exception as e:
            return ValidationResult("ROW_COUNT", None, None, "ERROR", str(e))

    def validate_column_count(self, schema: str, table: str) -> ValidationResult:
        try:
            s = len(self.discover_columns(schema, table, "source"))
            t = len(self.discover_columns(schema, table, "target"))
            return ValidationResult("COLUMN_COUNT", s, t, "PASS" if s==t else "FAIL", f"Column counts match: {s}" if s==t else f"Column count mismatch: source={s}, target={t}")
        except Exception as e:
            return ValidationResult("COLUMN_COUNT", None, None, "ERROR", str(e))

    def validate_column_names(self, schema: str, table: str) -> ValidationResult:
        try:
            s = set(c.column_name for c in self.discover_columns(schema, table, "source"))
            t = set(c.column_name for c in self.discover_columns(schema, table, "target"))
            if s==t:
                return ValidationResult("COLUMN_NAMES", list(s), list(t), "PASS", "Column names match")
            return ValidationResult("COLUMN_NAMES", list(s), list(t), "FAIL", f"Missing in target: {s-t}, Extra: {t-s}")
        except Exception as e:
            return ValidationResult("COLUMN_NAMES", None, None, "ERROR", str(e))

    def validate_data_types(self, schema: str, table: str) -> ValidationResult:
        try:
            s = {c.column_name: c.data_type for c in self.discover_columns(schema, table, "source")}
            t = {c.column_name: c.data_type for c in self.discover_columns(schema, table, "target")}
            mism = [f"{k}: {s[k]} vs {t[k]}" for k in s if k in t and s[k]!=t[k]]
            if not mism:
                return ValidationResult("DATA_TYPES", None, None, "PASS", "All data types match")
            return ValidationResult("DATA_TYPES", None, None, "FAIL", f"Data type mismatches: {', '.join(mism)}")
        except Exception as e:
            return ValidationResult("DATA_TYPES", None, None, "ERROR", str(e))

    def close(self):
        for c in [self.source_conn, self.target_conn]:
            if c:
                try: c.close()
                except: pass
        self.source_conn = self.target_conn = None
    def __enter__(self): return self
    def __exit__(self, *a): self.close()
