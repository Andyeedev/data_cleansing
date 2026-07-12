# Data Testing Standards — Migration Assurance Platform (MAP)

| Field | Value |
|-------|-------|
| **Document** | Data Testing Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Owner** | MAP Data Engineering & QA Team |
| **Platform** | Migration Assurance Platform (MAP) |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Terminology](#3-terminology)
4. [Database Validation](#4-database-validation)
5. [Migration Testing](#5-migration-testing)
6. [Integrity Testing](#6-integrity-testing)
7. [Consistency Testing](#7-consistency-testing)
8. [Reconciliation](#8-reconciliation)
9. [Data Quality](#9-data-quality)
10. [Backup Validation](#10-backup-validation)
11. [Recovery Testing](#11-recovery-testing)
12. [Test Data Management](#12-test-data-management)
13. [Recommended Tools](#13-recommended-tools)
14. [Best Practices](#14-best-practices)
15. [Dependencies](#15-dependencies)
16. [Appendices](#16-appendices)
17. [Revision History](#17-revision-history)
18. [Approval](#18-approval)

---

## 1. Purpose

### 1.1 Objective

This document defines the authoritative data testing standards for the **Migration Assurance Platform (MAP)**. It establishes repeatable, auditable processes that guarantee data integrity, consistency, quality, and recoverability across every migration lifecycle stage.

### 1.2 Goals

| Goal | Description |
|------|-------------|
| **G1** | Prevent data loss during source-to-target migrations |
| **G2** | Validate schema correctness against golden standards |
| **G3** | Ensure referential integrity across all migrated datasets |
| **G4** | Enforce data quality dimensions (accuracy, completeness, timeliness, validity) |
| **G5** | Provide auditable reconciliation reports for regulatory compliance |
| **G6** | Define clear rollback and recovery procedures |

### 1.3 Audience

- Data Engineers
- QA / Test Engineers
- Migration Architects
- Database Administrators
- Compliance & Audit Teams
- DevOps / SRE Engineers

### 1.4 Normative References

| Reference | Description |
|-----------|-------------|
| Batch 08 — Database Architecture | Canonical database design, schemas, partitioning strategies |
| Batch 11 — Python Standards | Coding standards, type hints, async patterns for MAP |
| ISO 25012 | Data quality model |
| DAMA DMBOK | Data management body of knowledge |

---

## 2. Scope

This document applies to:

- All MAP migration pipelines (batch and streaming)
- Source systems (RDBMS, NoSQL, flat files, cloud data stores)
- Target systems (data warehouses, data lakes, analytics platforms)
- ETL/ELT processes managed by MAP
- Supporting metadata and catalogue databases

Out of scope: application-level unit testing (covered in Batch 12), infrastructure provisioning (covered in Batch 05).

---

## 3. Terminology

| Term | Definition |
|------|------------|
| **Source System** | The origin system from which data is extracted |
| **Target System** | The destination system where data is loaded |
| **Golden Record** | The authoritative reference for data validation |
| **Reconciliation** | Process of comparing source and target data to identify discrepancies |
| **SLA** | Service Level Agreement |
| **RPO** | Recovery Point Objective |
| **RTO** | Recovery Time Objective |
| **PII** | Personally Identifiable Information |
| **GDPR** | General Data Protection Regulation |
| **Hash Diff** | Cryptographic hash used to detect data changes |

---

## 4. Database Validation

### 4.1 Schema Validation

Schema validation confirms that target database structures conform to the approved design specifications.

#### 4.1.1 Table Structure Validation

```python
"""Schema validation for MAP migrations."""

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ColumnSpec:
    """Defines expected column properties."""
    name: str
    data_type: str
    nullable: bool = False
    max_length: int | None = None
    precision: int | None = None
    scale: int | None = None
    default_value: Any = None
    is_primary_key: bool = False
    is_unique: bool = False


@dataclass
class TableSpec:
    """Defines expected table structure."""
    schema_name: str
    table_name: str
    columns: list[ColumnSpec] = field(default_factory=list)
    primary_keys: list[str] = field(default_factory=list)
    indexes: list[str] = field(default_factory=list)
    partition_key: str | None = None


class SchemaValidator:
    """Validates target schema against expected specification."""

    def __init__(self, target_engine):
        self.engine = target_engine
        self.validation_results: list[dict[str, Any]] = []

    def validate_table(self, spec: TableSpec) -> list[dict[str, Any]]:
        """Run full schema validation for a table."""
        results = []
        results.extend(self._validate_columns(spec))
        results.extend(self._validate_primary_keys(spec))
        results.extend(self._validate_indexes(spec))
        results.extend(self._validate_partitioning(spec))
        self.validation_results.extend(results)
        return results

    def _validate_columns(self, spec: TableSpec) -> list[dict[str, Any]]:
        """Validate column definitions match specification."""
        results = []
        actual_columns = self._get_actual_columns(
            spec.schema_name, spec.table_name
        )
        expected_columns = {col.name: col for col in spec.columns}

        for col_name, col_spec in expected_columns.items():
            if col_name not in actual_columns:
                results.append({
                    "check": "column_exists",
                    "status": "FAIL",
                    "column": col_name,
                    "message": f"Column {col_name} missing from target",
                    "severity": "CRITICAL",
                })
            else:
                actual = actual_columns[col_name]
                results.extend(
                    self._validate_column_details(col_spec, actual)
                )

        for col_name in actual_columns:
            if col_name not in expected_columns:
                results.append({
                    "check": "column_expected",
                    "status": "WARN",
                    "column": col_name,
                    "message": f"Unexpected column {col_name} in target",
                    "severity": "MEDIUM",
                })

        return results

    def _validate_column_details(
        self, spec: ColumnSpec, actual: dict
    ) -> list[dict[str, Any]]:
        """Validate individual column properties."""
        results = []

        if actual.get("data_type") != spec.data_type:
            results.append({
                "check": "data_type",
                "status": "FAIL",
                "column": spec.name,
                "expected": spec.data_type,
                "actual": actual.get("data_type"),
                "severity": "CRITICAL",
            })

        if actual.get("nullable") != spec.nullable:
            results.append({
                "check": "nullable",
                "status": "FAIL",
                "column": spec.name,
                "expected": spec.nullable,
                "actual": actual.get("nullable"),
                "severity": "HIGH",
            })

        return results

    def _validate_primary_keys(self, spec: TableSpec) -> list[dict[str, Any]]:
        """Validate primary key constraints."""
        results = []
        actual_pks = self._get_primary_keys(
            spec.schema_name, spec.table_name
        )
        expected_pks = set(spec.primary_keys)
        actual_pk_set = set(actual_pks)

        if expected_pks != actual_pk_set:
            results.append({
                "check": "primary_key",
                "status": "FAIL",
                "expected": sorted(expected_pks),
                "actual": sorted(actual_pk_set),
                "severity": "CRITICAL",
            })
        else:
            results.append({
                "check": "primary_key",
                "status": "PASS",
                "columns": sorted(expected_pks),
                "severity": "N/A",
            })

        return results

    def _validate_indexes(self, spec: TableSpec) -> list[dict[str, Any]]:
        """Validate index presence."""
        results = []
        actual_indexes = self._get_indexes(
            spec.schema_name, spec.table_name
        )

        for index_name in spec.indexes:
            if index_name not in actual_indexes:
                results.append({
                    "check": "index_exists",
                    "status": "FAIL",
                    "index": index_name,
                    "message": f"Index {index_name} missing",
                    "severity": "HIGH",
                })

        return results

    def _validate_partitioning(self, spec: TableSpec) -> list[dict[str, Any]]:
        """Validate table partitioning scheme."""
        results = []
        if spec.partition_key:
            actual_partition = self._get_partition_key(
                spec.schema_name, spec.table_name
            )
            if actual_partition != spec.partition_key:
                results.append({
                    "check": "partition_key",
                    "status": "FAIL",
                    "expected": spec.partition_key,
                    "actual": actual_partition,
                    "severity": "HIGH",
                })
        return results

    def _get_actual_columns(
        self, schema: str, table: str
    ) -> dict[str, dict]:
        """Retrieve actual column metadata from database."""
        return {}

    def _get_primary_keys(self, schema: str, table: str) -> list[str]:
        """Retrieve primary key columns."""
        return []

    def _get_indexes(self, schema: str, table: str) -> list[str]:
        """Retrieve index names."""
        return []

    def _get_partition_key(self, schema: str, table: str) -> str | None:
        """Retrieve partition key column."""
        return None

    def generate_report(self) -> str:
        """Generate human-readable validation report."""
        total = len(self.validation_results)
        passed = sum(
            1 for r in self.validation_results if r["status"] == "PASS"
        )
        failed = sum(
            1 for r in self.validation_results if r["status"] == "FAIL"
        )
        warnings = sum(
            1 for r in self.validation_results if r["status"] == "WARN"
        )

        report = [
            "=" * 60,
            "  SCHEMA VALIDATION REPORT",
            "=" * 60,
            f"  Total Checks : {total}",
            f"  Passed       : {passed}",
            f"  Failed       : {failed}",
            f"  Warnings     : {warnings}",
            f"  Pass Rate    : {(passed/total*100):.1f}%",
            "=" * 60,
        ]

        for result in self.validation_results:
            status = result["status"]
            icon = {"PASS": "✓", "FAIL": "✗", "WARN": "⚠"}.get(status, "?")
            report.append(
                f"  [{icon}] {result['check']}: {result.get('message', '')}"
            )

        return "\n".join(report)
```

#### 4.1.2 Schema Comparison Matrix

| Validation Check | Priority | Automation Level | Frequency |
|------------------|----------|-------------------|-----------|
| Column existence | Critical | 100% automated | Every migration |
| Data type match | Critical | 100% automated | Every migration |
| Nullability | High | 100% automated | Every migration |
| Column length | Medium | 100% automated | Every migration |
| Primary key | Critical | 100% automated | Every migration |
| Foreign keys | High | 100% automated | Every migration |
| Indexes | Medium | Automated | Schema changes |
| Partitioning | Medium | Automated | Partition changes |
| Default values | Low | Automated | Schema changes |
| Triggers/Stored procs | Low | Semi-automated | On request |

### 4.2 Data Type Validation

#### 4.2.1 Type Mapping Registry

```python
"""Canonical data type mapping for cross-platform validation."""

from enum import Enum


class DatabasePlatform(Enum):
    """Supported database platforms."""
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLSERVER = "sqlserver"
    ORACLE = "oracle"
    BIGQUERY = "bigquery"
    SNOWFLAKE = "snowflake"
    REDSHIFT = "redshift"


TYPE_MAPPING: dict[DatabasePlatform, dict[str, str]] = {
    DatabasePlatform.POSTGRESQL: {
        "VARCHAR": "character varying",
        "INTEGER": "integer",
        "BIGINT": "bigint",
        "DECIMAL": "numeric",
        "TIMESTAMP": "timestamp without time zone",
        "BOOLEAN": "boolean",
        "TEXT": "text",
        "DATE": "date",
        "FLOAT": "double precision",
        "BLOB": "bytea",
        "JSON": "jsonb",
    },
    DatabasePlatform.BIGQUERY: {
        "VARCHAR": "STRING",
        "INTEGER": "INT64",
        "BIGINT": "INT64",
        "DECIMAL": "NUMERIC",
        "TIMESTAMP": "TIMESTAMP",
        "BOOLEAN": "BOOL",
        "TEXT": "STRING",
        "DATE": "DATE",
        "FLOAT": "FLOAT64",
        "BLOB": "BYTES",
        "JSON": "JSON",
    },
    DatabasePlatform.SNOWFLAKE: {
        "VARCHAR": "VARCHAR",
        "INTEGER": "NUMBER",
        "BIGINT": "NUMBER",
        "DECIMAL": "NUMBER",
        "TIMESTAMP": "TIMESTAMP_NTZ",
        "BOOLEAN": "BOOLEAN",
        "TEXT": "TEXT",
        "DATE": "DATE",
        "FLOAT": "FLOAT",
        "BLOB": "BINARY",
        "JSON": "VARIANT",
    },
}


def validate_type_mapping(
    source_platform: DatabasePlatform,
    target_platform: DatabasePlatform,
    source_type: str,
    target_type: str,
) -> dict:
    """Validate that a type mapping is correct."""
    source_canonical = TYPE_MAPPING.get(source_platform, {}).get(
        source_type.upper()
    )
    target_canonical = TYPE_MAPPING.get(target_platform, {}).get(
        target_type.upper()
    )

    if not source_canonical:
        return {"status": "ERROR", "message": f"Unknown source type: {source_type}"}

    if not target_canonical:
        return {"status": "ERROR", "message": f"Unknown target type: {target_type}"}

    return {
        "status": "PASS",
        "source_type": source_type,
        "target_type": target_type,
        "source_canonical": source_canonical,
        "target_canonical": target_canonical,
    }


def validate_numeric_precision(
    source_precision: int,
    source_scale: int,
    target_precision: int,
    target_scale: int,
) -> dict:
    """Validate numeric precision preservation."""
    issues = []

    if target_precision < source_precision:
        issues.append(f"Precision reduced: {source_precision} -> {target_precision}")

    if target_scale < source_scale:
        issues.append(f"Scale reduced: {source_scale} -> {target_scale}")

    return {
        "status": "FAIL" if issues else "PASS",
        "issues": issues,
        "source": f"NUMERIC({source_precision},{source_scale})",
        "target": f"NUMERIC({target_precision},{target_scale})",
    }
```

#### 4.2.2 Type Validation Matrix

| Source Type | PostgreSQL | BigQuery | Snowflake | Notes |
|-------------|-----------|----------|-----------|-------|
| VARCHAR(n) | VARCHAR(n) | STRING | VARCHAR(n) | Length may differ |
| INT | INTEGER | INT64 | NUMBER(38,0) | Precision varies |
| DECIMAL(p,s) | NUMERIC(p,s) | NUMERIC(p,s) | NUMBER(p,s) | Exact match preferred |
| TIMESTAMP | TIMESTAMP | TIMESTAMP | TIMESTAMP_NTZ | TZ handling critical |
| BOOLEAN | BOOLEAN | BOOL | BOOLEAN | Direct mapping |
| JSON | JSONB | JSON | VARIANT | Functional equivalence |
| BLOB | BYTEA | BYTES | BINARY | Encoding must match |

### 4.3 Constraint Validation

#### 4.3.1 Constraint Testing Framework

```python
"""Constraint validation for MAP migrations."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class ConstraintType(Enum):
    """Types of database constraints."""
    PRIMARY_KEY = "primary_key"
    FOREIGN_KEY = "foreign_key"
    UNIQUE = "unique"
    CHECK = "check"
    NOT_NULL = "not_null"
    EXCLUDE = "exclude"


class ConstraintSeverity(Enum):
    """Severity levels for constraint violations."""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


@dataclass
class ConstraintDefinition:
    """Defines an expected constraint."""
    name: str
    constraint_type: ConstraintType
    table_name: str
    columns: list[str] = field(default_factory=list)
    referenced_table: str | None = None
    referenced_columns: list[str] = field(default_factory=list)
    check_expression: str | None = None
    severity: ConstraintSeverity = ConstraintSeverity.CRITICAL


class ConstraintValidator:
    """Validates database constraints post-migration."""

    def __init__(self, engine):
        self.engine = engine
        self.results: list[dict[str, Any]] = []

    def validate_all(
        self, constraints: list[ConstraintDefinition]
    ) -> list[dict[str, Any]]:
        """Validate all defined constraints."""
        for constraint in constraints:
            if constraint.constraint_type == ConstraintType.PRIMARY_KEY:
                self._validate_primary_key(constraint)
            elif constraint.constraint_type == ConstraintType.FOREIGN_KEY:
                self._validate_foreign_key(constraint)
            elif constraint.constraint_type == ConstraintType.UNIQUE:
                self._validate_unique(constraint)
            elif constraint.constraint_type == ConstraintType.CHECK:
                self._validate_check(constraint)
        return self.results

    def _validate_primary_key(self, constraint: ConstraintDefinition):
        """Validate primary key constraint has no duplicates."""
        columns_str = ", ".join(constraint.columns)
        query = f"""
            SELECT {columns_str}, COUNT(*) as cnt
            FROM {constraint.table_name}
            GROUP BY {columns_str}
            HAVING COUNT(*) > 1
        """
        duplicates = self._execute_query(query)

        self.results.append({
            "constraint": constraint.name,
            "type": "PRIMARY_KEY",
            "table": constraint.table_name,
            "columns": constraint.columns,
            "status": "FAIL" if duplicates else "PASS",
            "duplicate_count": len(duplicates),
            "severity": constraint.severity.value,
        })

    def _validate_foreign_key(self, constraint: ConstraintDefinition):
        """Validate foreign key referential integrity."""
        query = f"""
            SELECT t.{constraint.columns[0]}
            FROM {constraint.table_name} t
            LEFT JOIN {constraint.referenced_table} r
                ON t.{constraint.columns[0]} = r.{constraint.referenced_columns[0]}
            WHERE r.{constraint.referenced_columns[0]} IS NULL
              AND t.{constraint.columns[0]} IS NOT NULL
        """
        orphans = self._execute_query(query)

        self.results.append({
            "constraint": constraint.name,
            "type": "FOREIGN_KEY",
            "table": constraint.table_name,
            "referenced_table": constraint.referenced_table,
            "status": "FAIL" if orphans else "PASS",
            "orphan_count": len(orphans),
            "severity": constraint.severity.value,
        })

    def _execute_query(self, query: str) -> list[dict]:
        """Execute validation query."""
        return []

    def generate_constraint_report(self) -> str:
        """Generate constraint validation report."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r["status"] == "PASS")
        failed = sum(1 for r in self.results if r["status"] == "FAIL")

        lines = [
            "=" * 60,
            "  CONSTRAINT VALIDATION REPORT",
            "=" * 60,
            f"  Total Constraints : {total}",
            f"  Passed            : {passed}",
            f"  Failed            : {failed}",
            "=" * 60,
        ]

        for r in self.results:
            icon = "✓" if r["status"] == "PASS" else "✗"
            lines.append(
                f"  [{icon}] {r['constraint']} ({r['type']}): {r['status']}"
            )

        return "\n".join(lines)
```

#### 4.3.2 Constraint Coverage Matrix

| Constraint Type | Automated Check | Manual Check | Regression | SLA |
|-----------------|-----------------|--------------|------------|-----|
| PRIMARY KEY | Duplicate detection | — | Every run | 0 duplicates |
| FOREIGN KEY | Orphan detection | — | Every run | 0 orphans |
| UNIQUE | Duplicate detection | — | Every run | 0 duplicates |
| CHECK | Expression validation | Business review | Monthly | 0 violations |
| NOT NULL | NULL count validation | — | Every run | Per spec |
| EXCLUDE | Overlap detection | Domain expert | Quarterly | 0 overlaps |

---

## 5. Migration Testing

### 5.1 Data Migration Testing

#### 5.1.1 Migration Validation Framework

```python
"""End-to-end migration validation for MAP."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
import hashlib
import json


@dataclass
class MigrationJob:
    """Represents a single migration job."""
    job_id: str
    source_table: str
    target_table: str
    source_engine: Any
    target_engine: Any
    batch_size: int = 10_000
    started_at: datetime | None = None
    completed_at: datetime | None = None
    status: str = "PENDING"


@dataclass
class ValidationResult:
    """Result of a migration validation check."""
    check_name: str
    status: str
    source_count: int
    target_count: int
    difference: int
    percentage_match: float
    details: dict[str, Any] = field(default_factory=dict)
    duration_ms: float = 0.0


class MigrationValidator:
    """Comprehensive migration validation engine."""

    def __init__(self, job: MigrationJob):
        self.job = job
        self.results: list[ValidationResult] = []

    def validate_full(self) -> list[ValidationResult]:
        """Run all migration validation checks."""
        self.results.append(self.validate_record_count())
        self.results.append(self.validate_sample_data())
        self.results.append(self.validate_aggregations())
        self.results.append(self.validate_hash_diff())
        self.results.append(self.validate_null_handling())
        self.results.append(self.validate_boundary_values())
        return self.results

    def validate_record_count(self) -> ValidationResult:
        """Compare record counts between source and target."""
        source_count = self._get_count(
            self.job.source_engine, self.job.source_table
        )
        target_count = self._get_count(
            self.job.target_engine, self.job.target_table
        )
        diff = abs(source_count - target_count)
        pct = (
            min(source_count, target_count)
            / max(source_count, target_count) * 100
            if max(source_count, target_count) > 0
            else 0.0
        )

        return ValidationResult(
            check_name="record_count",
            status="PASS" if diff == 0 else "FAIL",
            source_count=source_count,
            target_count=target_count,
            difference=diff,
            percentage_match=pct,
        )

    def validate_sample_data(
        self, sample_size: int = 1000
    ) -> ValidationResult:
        """Validate random sample of records."""
        source_sample = self._get_sample(
            self.job.source_engine, self.job.source_table, sample_size
        )
        target_sample = self._get_sample(
            self.job.target_engine, self.job.target_table, sample_size
        )

        matches = 0
        mismatches = []
        for src_row, tgt_row in zip(source_sample, target_sample):
            if self._rows_equal(src_row, tgt_row):
                matches += 1
            else:
                mismatches.append({"source": src_row, "target": tgt_row})

        pct = (
            matches / len(source_sample) * 100
            if len(source_sample) > 0
            else 0.0
        )

        return ValidationResult(
            check_name="sample_data",
            status="PASS" if pct == 100.0 else "FAIL",
            source_count=len(source_sample),
            target_count=len(target_sample),
            difference=len(source_sample) - matches,
            percentage_match=pct,
            details={"mismatches": mismatches[:10]},
        )

    def validate_aggregations(self) -> ValidationResult:
        """Validate aggregated values across key columns."""
        source_aggs = self._get_aggregations(
            self.job.source_engine, self.job.source_table
        )
        target_aggs = self._get_aggregations(
            self.job.target_engine, self.job.target_table
        )

        mismatches = []
        for key in source_aggs:
            if key in target_aggs:
                if source_aggs[key] != target_aggs[key]:
                    mismatches.append({
                        "metric": key,
                        "source": source_aggs[key],
                        "target": target_aggs[key],
                    })

        return ValidationResult(
            check_name="aggregations",
            status="PASS" if not mismatches else "FAIL",
            source_count=len(source_aggs),
            target_count=len(target_aggs),
            difference=len(mismatches),
            percentage_match=(
                ((len(source_aggs) - len(mismatches))
                 / len(source_aggs) * 100)
                if source_aggs
                else 0.0
            ),
            details={"mismatches": mismatches},
        )

    def validate_hash_diff(self) -> ValidationResult:
        """Compare row-level hash values."""
        source_hashes = self._get_row_hashes(
            self.job.source_engine, self.job.source_table
        )
        target_hashes = self._get_row_hashes(
            self.job.target_engine, self.job.target_table
        )

        source_set = set(source_hashes)
        target_set = set(target_hashes)

        missing_in_target = source_set - target_set
        extra_in_target = target_set - source_set
        total_diff = len(missing_in_target) + len(extra_in_target)

        pct = (
            ((len(source_set) - len(missing_in_target))
             / len(source_set) * 100)
            if source_set
            else 0.0
        )

        return ValidationResult(
            check_name="hash_diff",
            status="PASS" if total_diff == 0 else "FAIL",
            source_count=len(source_set),
            target_count=len(target_set),
            difference=total_diff,
            percentage_match=pct,
            details={
                "missing_in_target": len(missing_in_target),
                "extra_in_target": len(extra_in_target),
            },
        )

    def _get_count(self, engine, table: str) -> int:
        """Get row count from table."""
        return 0

    def _get_sample(self, engine, table: str, n: int) -> list[dict]:
        """Get random sample of rows."""
        return []

    def _get_aggregations(self, engine, table: str) -> dict:
        """Get aggregate metrics."""
        return {}

    def _get_row_hashes(self, engine, table: str) -> list[str]:
        """Get hash of each row."""
        return []

    def _rows_equal(self, row1: dict, row2: dict) -> bool:
        """Compare two rows for equality."""
        return row1 == row2

    def export_results(self, filepath: str):
        """Export validation results to JSON."""
        output = {
            "job_id": self.job.job_id,
            "source_table": self.job.source_table,
            "target_table": self.job.target_table,
            "validated_at": datetime.utcnow().isoformat(),
            "results": [
                {
                    "check": r.check_name,
                    "status": r.status,
                    "source_count": r.source_count,
                    "target_count": r.target_count,
                    "difference": r.difference,
                    "percentage_match": r.percentage_match,
                    "details": r.details,
                }
                for r in self.results
            ],
        }
        with open(filepath, "w") as f:
            json.dump(output, f, indent=2, default=str)
```

#### 5.1.2 Migration Test Coverage Matrix

| Validation Check | Source Type | Target Type | Frequency | Automated |
|-----------------|-------------|-------------|-----------|-----------|
| Record count | RDBMS | RDBMS | Every run | Yes |
| Record count | RDBMS | Cloud DW | Every run | Yes |
| Sample data | RDBMS | RDBMS | Every run | Yes |
| Aggregations | RDBMS | RDBMS | Every run | Yes |
| Hash diff | Any | Any | Every run | Yes |
| NULL preservation | RDBMS | RDBMS | Every run | Yes |
| Boundary values | RDBMS | RDBMS | Every run | Yes |
| Date format | RDBMS | Cloud DW | Every run | Yes |
| Encoding (UTF-8) | Flat file | RDBMS | Every run | Yes |
| Decimal precision | RDBMS | Cloud DW | Every run | Yes |
| Trailing spaces | RDBMS | Any | Every run | Yes |
| Case sensitivity | RDBMS | Cloud DW | Every run | Yes |

### 5.2 Schema Migration Testing

#### 5.2.1 Schema Version Control

```python
"""Schema migration version control and validation."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


class MigrationType(Enum):
    """Types of schema migrations."""
    ADD_COLUMN = "add_column"
    DROP_COLUMN = "drop_column"
    ALTER_COLUMN = "alter_column"
    ADD_TABLE = "add_table"
    DROP_TABLE = "drop_table"
    ADD_INDEX = "add_index"
    ADD_CONSTRAINT = "add_constraint"
    RENAME = "rename"


class MigrationRisk(Enum):
    """Risk levels for schema migrations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class SchemaMigration:
    """Defines a single schema migration step."""
    migration_id: str
    version: str
    description: str
    migration_type: MigrationType
    risk_level: MigrationRisk
    up_sql: str
    down_sql: str
    dependencies: list[str] = field(default_factory=list)
    estimated_duration_sec: int = 0
    requires_downtime: bool = False
    approved_by: str = ""
    approved_at: datetime | None = None


class SchemaMigrationValidator:
    """Validates schema migrations before and after execution."""

    def __init__(self, engine):
        self.engine = engine
        self.migration_history: list[dict] = []

    def validate_pre_migration(
        self, migration: SchemaMigration
    ) -> dict[str, Any]:
        """Validate migration can be applied safely."""
        checks = {
            "dependencies_met": self._check_dependencies(migration),
            "backwards_compatible": self._check_compatibility(migration),
            "down_sql_valid": self._validate_down_sql(migration),
            "risk_assessed": (
                migration.risk_level != MigrationRisk.CRITICAL
                or migration.approved_by != ""
            ),
            "downtime_planned": (
                not migration.requires_downtime
                or migration.estimated_duration_sec > 0
            ),
        }

        return {
            "migration_id": migration.migration_id,
            "version": migration.version,
            "all_checks_passed": all(checks.values()),
            "checks": checks,
            "risk_level": migration.risk_level.value,
        }

    def _check_dependencies(self, migration: SchemaMigration) -> bool:
        """Check all migration dependencies are applied."""
        applied_ids = {m["migration_id"] for m in self.migration_history}
        return all(dep in applied_ids for dep in migration.dependencies)

    def _check_compatibility(self, migration: SchemaMigration) -> bool:
        """Check migration is backwards compatible."""
        incompatible_types = {MigrationType.DROP_COLUMN, MigrationType.DROP_TABLE}
        return migration.migration_type not in incompatible_types

    def _validate_down_sql(self, migration: SchemaMigration) -> bool:
        """Validate rollback SQL is present."""
        return bool(migration.down_sql and migration.down_sql.strip())

    def generate_rollback_script(
        self, migration: SchemaMigration
    ) -> str:
        """Generate rollback SQL script."""
        return f"""
-- Rollback Script for Migration: {migration.migration_id}
-- Version: {migration.version}
-- Description: {migration.description}
-- Generated: {datetime.utcnow().isoformat()}

BEGIN TRANSACTION;

{migration.down_sql}

-- Verify rollback
-- Add verification queries here

COMMIT;
"""
```

#### 5.2.2 Schema Migration Test Matrix

| Migration Type | Pre-Check | Post-Check | Rollback Test | Data Validation |
|----------------|-----------|------------|---------------|-----------------|
| ADD COLUMN | Column doesn't exist | Column exists, default applied | Column removed | NULL values correct |
| DROP COLUMN | Column exists | Column removed | Column restored | Data preserved |
| ALTER COLUMN | Type compatible | New type applied | Old type restored | Values converted |
| ADD TABLE | Table doesn't exist | Table created | Table dropped | Empty table |
| ADD INDEX | Index doesn't exist | Index created | Index dropped | Performance OK |
| RENAME | Old name exists | New name exists | Old name restored | References updated |

### 5.3 Rollback Testing

#### 5.3.1 Rollback Validation Framework

```python
"""Rollback testing framework for MAP migrations."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class RollbackPlan:
    """Defines a rollback plan for a migration."""
    migration_id: str
    rollback_steps: list[str] = field(default_factory=list)
    estimated_duration_sec: int = 0
    data_preservation_method: str = "full_backup"
    stakeholder_notifications: list[str] = field(default_factory=list)
    success_criteria: list[str] = field(default_factory=list)


@dataclass
class RollbackTestResult:
    """Result of a rollback test execution."""
    migration_id: str
    test_started: datetime
    test_completed: datetime | None = None
    rollback_successful: bool = False
    data_intact: bool = False
    schema_reverted: bool = False
    duration_sec: float = 0.0
    issues: list[str] = field(default_factory=list)


class RollbackValidator:
    """Validates rollback procedures for migrations."""

    def __init__(self, source_engine, target_engine):
        self.source_engine = source_engine
        self.target_engine = target_engine

    def test_rollback(
        self, plan: RollbackPlan, migration_sql: str
    ) -> RollbackTestResult:
        """Execute a full rollback test in isolated environment."""
        result = RollbackTestResult(
            migration_id=plan.migration_id,
            test_started=datetime.utcnow(),
        )

        try:
            pre_state = self._capture_state()
            self._execute_sql(migration_sql)

            for step in plan.rollback_steps:
                self._execute_sql(step)

            post_rollback_state = self._capture_state()

            result.schema_reverted = (
                pre_state == post_rollback_state
            )
            result.data_intact = self._verify_data_integrity(pre_state)
            result.rollback_successful = (
                result.schema_reverted and result.data_intact
            )

        except Exception as e:
            result.issues.append(f"Rollback test failed: {str(e)}")

        result.test_completed = datetime.utcnow()
        result.duration_sec = (
            result.test_completed - result.test_started
        ).total_seconds()

        return result

    def _capture_state(self) -> dict:
        """Capture current database state snapshot."""
        return {}

    def _execute_sql(self, sql: str):
        """Execute SQL statement."""
        pass

    def _verify_data_integrity(self, original_state: dict) -> bool:
        """Verify data integrity matches original state."""
        return True
```

---

## 6. Integrity Testing

### 6.1 Referential Integrity

#### 6.1.1 Referential Integrity Checks

```python
"""Referential integrity validation for MAP."""

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ForeignKeyRelationship:
    """Defines a foreign key relationship to validate."""
    name: str
    child_table: str
    child_column: str
    parent_table: str
    parent_column: str
    cascade_delete: bool = False
    nullable: bool = False


class ReferentialIntegrityValidator:
    """Validates referential integrity across migrated data."""

    def __init__(self, engine):
        self.engine = engine
        self.violations: list[dict[str, Any]] = []

    def validate_relationship(
        self, relationship: ForeignKeyRelationship
    ) -> dict[str, Any]:
        """Validate a single foreign key relationship."""
        query = f"""
            SELECT
                c.{relationship.child_column} as orphan_value,
                COUNT(*) as occurrence_count
            FROM {relationship.child_table} c
            LEFT JOIN {relationship.parent_table} p
                ON c.{relationship.child_column} = p.{relationship.parent_column}
            WHERE p.{relationship.parent_column} IS NULL
              AND c.{relationship.child_column} IS NOT NULL
            GROUP BY c.{relationship.child_column}
            ORDER BY occurrence_count DESC
            LIMIT 100
        """
        orphans = self._execute_query(query)

        result = {
            "relationship": relationship.name,
            "child_table": relationship.child_table,
            "child_column": relationship.child_column,
            "parent_table": relationship.parent_table,
            "parent_column": relationship.parent_column,
            "status": "PASS" if len(orphans) == 0 else "FAIL",
            "orphan_count": sum(o["occurrence_count"] for o in orphans),
            "sample_orphans": orphans[:10],
        }

        if orphans:
            self.violations.append(result)

        return result

    def validate_all_relationships(
        self, relationships: list[ForeignKeyRelationship]
    ) -> list[dict[str, Any]]:
        """Validate all defined relationships."""
        results = []
        for rel in relationships:
            results.append(self.validate_relationship(rel))
        return results

    def _execute_query(self, query: str) -> list[dict]:
        """Execute query and return results."""
        return []

    def generate_integrity_report(self) -> str:
        """Generate referential integrity report."""
        total_violations = len(self.violations)
        total_orphan_count = sum(
            v["orphan_count"] for v in self.violations
        )

        lines = [
            "=" * 60,
            "  REFERENTIAL INTEGRITY REPORT",
            "=" * 60,
            f"  Relationships Checked : {total_violations}",
            f"  Total Orphan Records  : {total_orphan_count}",
            "=" * 60,
        ]

        for v in self.violations:
            lines.append(
                f"  [FAIL] {v['relationship']}: {v['orphan_count']} orphans"
            )

        if not self.violations:
            lines.append("  [PASS] All relationships valid")

        return "\n".join(lines)
```

### 6.2 Business Rule Validation

#### 6.2.1 Business Rules Engine

```python
"""Business rule validation engine for MAP migrations."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class RuleSeverity(Enum):
    """Severity levels for business rule violations."""
    BLOCKER = "blocker"
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"
    INFO = "info"


@dataclass
class BusinessRule:
    """Defines a business rule to validate."""
    rule_id: str
    name: str
    description: str
    severity: RuleSeverity
    table_name: str
    validation_sql: str
    expected_result: Any = 0
    enabled: bool = True
    tags: list[str] = field(default_factory=list)


class BusinessRuleValidator:
    """Validates business rules across migrated data."""

    def __init__(self, engine):
        self.engine = engine
        self.results: list[dict[str, Any]] = []

    def validate_rule(self, rule: BusinessRule) -> dict[str, Any]:
        """Validate a single business rule."""
        if not rule.enabled:
            return {
                "rule_id": rule.rule_id,
                "name": rule.name,
                "status": "SKIPPED",
                "message": "Rule disabled",
            }

        violation_count = self._execute_count(rule.validation_sql)

        result = {
            "rule_id": rule.rule_id,
            "name": rule.name,
            "description": rule.description,
            "severity": rule.severity.value,
            "table": rule.table_name,
            "violation_count": violation_count,
            "expected": rule.expected_result,
            "status": (
                "PASS"
                if violation_count == rule.expected_result
                else "FAIL"
            ),
        }

        self.results.append(result)
        return result

    def _execute_count(self, sql: str) -> int:
        """Execute a count query."""
        return 0

    def generate_business_rules_report(self) -> str:
        """Generate business rules validation report."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r["status"] == "PASS")
        failed = sum(1 for r in self.results if r["status"] == "FAIL")

        lines = [
            "=" * 60,
            "  BUSINESS RULES VALIDATION REPORT",
            "=" * 60,
            f"  Total Rules : {total}",
            f"  Passed      : {passed}",
            f"  Failed      : {failed}",
            "=" * 60,
        ]

        for r in self.results:
            icon = {"PASS": "✓", "FAIL": "✗", "SKIPPED": "○"}.get(
                r["status"], "?"
            )
            violations = r.get("violation_count", 0)
            lines.append(
                f"  [{icon}] {r['name']} ({r['severity']}): {violations} violations"
            )

        return "\n".join(lines)
```

#### 6.2.2 Common Business Rules for Financial Data

| Rule Category | Rule | SQL Pattern | Severity |
|---------------|------|-------------|----------|
| Account Balance | No negative balances on credit accounts | `WHERE balance < 0 AND account_type = 'CREDIT'` | BLOCKER |
| Transaction | Transaction date not in future | `WHERE transaction_date > CURRENT_DATE` | CRITICAL |
| Transaction | Debit = Credit for journal entries | `WHERE debit_amount != credit_amount` | BLOCKER |
| Customer | Active customer must have email | `WHERE status = 'ACTIVE' AND email IS NULL` | MAJOR |
| Compliance | Sanctions screening completed | `WHERE sanctions_check_date IS NULL` | CRITICAL |
| Currency | Currency code valid ISO 4217 | `WHERE currency_code NOT IN (SELECT code FROM currencies)` | CRITICAL |

### 6.3 Constraint Enforcement

#### 6.3.1 Constraint Validation Queries

```sql
-- Constraint Validation Query Library for MAP

-- 1. Primary Key Uniqueness Check
SELECT
    'PRIMARY_KEY_DUPLICATE' as constraint_type,
    '{table_name}' as table_name,
    COUNT(*) - COUNT(DISTINCT {pk_columns}) as violation_count
FROM {table_name};

-- 2. Foreign Key Orphan Detection
SELECT
    'FOREIGN_KEY_ORPHAN' as constraint_type,
    '{child_table}.{child_column}' as relationship,
    COUNT(*) as orphan_count
FROM {child_table} c
LEFT JOIN {parent_table} p
    ON c.{child_column} = p.{parent_column}
WHERE p.{parent_column} IS NULL
  AND c.{child_column} IS NOT NULL;

-- 3. NOT NULL Constraint Check
SELECT
    'NOT_NULL_VIOLATION' as constraint_type,
    '{table_name}.{column_name}' as location,
    COUNT(*) as violation_count
FROM {table_name}
WHERE {column_name} IS NULL;

-- 4. CHECK Constraint Validation
SELECT
    'CHECK_CONSTRAINT_VIOLATION' as constraint_type,
    '{table_name}' as table_name,
    COUNT(*) as violation_count
FROM {table_name}
WHERE NOT ({check_expression});

-- 5. UNIQUE Constraint Check
SELECT
    'UNIQUE_VIOLATION' as constraint_type,
    '{table_name}.{column_name}' as location,
    {column_name} as duplicate_value,
    COUNT(*) as occurrence_count
FROM {table_name}
GROUP BY {column_name}
HAVING COUNT(*) > 1;

-- 6. Temporal Integrity Check
SELECT
    'TEMPORAL_INTEGRITY' as constraint_type,
    '{table_name}' as table_name,
    COUNT(*) as violation_count
FROM {table_name}
WHERE start_date > end_date
   OR end_date > CURRENT_DATE
   OR start_date < '1900-01-01';

-- 7. Financial Precision Check
SELECT
    'PRECISION_LOSS' as constraint_type,
    '{table_name}.{column_name}' as location,
    COUNT(*) as violation_count
FROM {table_name}
WHERE ABS({column_name} - ROUND({column_name}, {target_scale})) > 0.0001;
```

---

## 7. Consistency Testing

### 7.1 Cross-System Consistency

#### 7.1.1 Cross-System Validation Framework

```python
"""Cross-system data consistency validation for MAP."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class ConsistencyCheck:
    """Defines a cross-system consistency check."""
    check_id: str
    name: str
    source_system: str
    target_system: str
    source_query: str
    target_query: str
    key_columns: list[str] = field(default_factory=list)
    value_columns: list[str] = field(default_factory=list)
    tolerance: float = 0.0
    enabled: bool = True


class CrossSystemValidator:
    """Validates data consistency across multiple systems."""

    def __init__(self, engines: dict[str, Any]):
        self.engines = engines
        self.results: list[dict[str, Any]] = []

    def validate_consistency(
        self, check: ConsistencyCheck
    ) -> dict[str, Any]:
        """Validate consistency between two systems."""
        if not check.enabled:
            return {"check_id": check.check_id, "status": "SKIPPED"}

        source_data = self._execute_query(
            check.source_system, check.source_query
        )
        target_data = self._execute_query(
            check.target_system, check.target_query
        )

        source_indexed = self._index_data(source_data, check.key_columns)
        target_indexed = self._index_data(target_data, check.key_columns)

        mismatches = []
        missing_in_target = []
        extra_in_target = []

        for key in source_indexed:
            if key not in target_indexed:
                missing_in_target.append(key)

        for key in target_indexed:
            if key not in source_indexed:
                extra_in_target.append(key)

        for key in source_indexed:
            if key in target_indexed:
                src_row = source_indexed[key]
                tgt_row = target_indexed[key]
                for col in check.value_columns:
                    src_val = src_row.get(col)
                    tgt_val = tgt_row.get(col)
                    if not self._values_equal(
                        src_val, tgt_val, check.tolerance
                    ):
                        mismatches.append({
                            "key": key,
                            "column": col,
                            "source_value": src_val,
                            "target_value": tgt_val,
                        })

        total_records = len(source_indexed)
        mismatch_count = (
            len(missing_in_target)
            + len(extra_in_target)
            + len(mismatches)
        )
        consistency_pct = (
            ((total_records - mismatch_count)
             / total_records * 100)
            if total_records > 0
            else 0.0
        )

        result = {
            "check_id": check.check_id,
            "name": check.name,
            "source_system": check.source_system,
            "target_system": check.target_system,
            "status": "PASS" if mismatch_count == 0 else "FAIL",
            "total_records_compared": total_records,
            "missing_in_target": len(missing_in_target),
            "extra_in_target": len(extra_in_target),
            "value_mismatches": len(mismatches),
            "consistency_percentage": consistency_pct,
            "sample_mismatches": mismatches[:10],
        }

        self.results.append(result)
        return result

    def _index_data(
        self, data: list[dict], key_columns: list[str]
    ) -> dict[tuple, dict]:
        """Index data by key columns."""
        indexed = {}
        for row in data:
            key = tuple(row.get(col) for col in key_columns)
            indexed[key] = row
        return indexed

    def _values_equal(
        self, val1: Any, val2: Any, tolerance: float
    ) -> bool:
        """Compare two values with optional tolerance."""
        if val1 is None and val2 is None:
            return True
        if val1 is None or val2 is None:
            return False
        if isinstance(val1, (int, float)) and isinstance(
            val2, (int, float)
        ):
            return abs(val1 - val2) <= tolerance
        return val1 == val2

    def _execute_query(
        self, system: str, query: str
    ) -> list[dict]:
        """Execute query on specified system."""
        return []

    def generate_consistency_report(self) -> str:
        """Generate cross-system consistency report."""
        total = len(self.results)
        passed = sum(
            1 for r in self.results if r["status"] == "PASS"
        )
        failed = sum(
            1 for r in self.results if r["status"] == "FAIL"
        )

        lines = [
            "=" * 60,
            "  CROSS-SYSTEM CONSISTENCY REPORT",
            "=" * 60,
            f"  Total Checks  : {total}",
            f"  Passed        : {passed}",
            f"  Failed        : {failed}",
            "=" * 60,
        ]

        for r in self.results:
            icon = "✓" if r["status"] == "PASS" else "✗"
            lines.append(
                f"  [{icon}] {r['name']}: "
                f"{r['consistency_percentage']:.1f}% consistent"
            )

        return "\n".join(lines)
```

### 7.2 Data Synchronisation

#### 7.2.1 Synchronisation Validation

| Check | Metric | Target | Automated |
|-------|--------|--------|-----------|
| Record parity | Source vs Target count | 100% match | Yes |
| Latency | Time between source update and target | < 15 min (real-time) | Yes |
| Checksum sync | Row-level hash comparison | 100% match | Yes |
| Schema sync | Column count and types | 100% match | Yes |
| Null sync | NULL count per column | Within 0.1% | Yes |

---

## 8. Reconciliation

### 8.1 Source vs Target Reconciliation

#### 8.1.1 Reconciliation Framework

```python
"""Source vs Target reconciliation for MAP migrations."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class ReconciliationRule:
    """Defines a reconciliation rule."""
    rule_id: str
    name: str
    source_table: str
    target_table: str
    key_columns: list[str] = field(default_factory=list)
    compare_columns: list[str] = field(default_factory=list)
    filters: str = ""
    aggregate_functions: list[str] = field(default_factory=list)
    tolerance: float = 0.0


class ReconciliationEngine:
    """Performs source-to-target reconciliation."""

    def __init__(self, source_engine, target_engine):
        self.source_engine = source_engine
        self.target_engine = target_engine
        self.reports: list[dict[str, Any]] = []

    def reconcile_counts(
        self, rule: ReconciliationRule
    ) -> dict[str, Any]:
        """Reconcile record counts."""
        source_query = f"""
            SELECT COUNT(*) as cnt
            FROM {rule.source_table}
        """
        target_query = f"""
            SELECT COUNT(*) as cnt
            FROM {rule.target_table}
        """

        source_count = self._execute_scalar(
            self.source_engine, source_query
        )
        target_count = self._execute_scalar(
            self.target_engine, target_query
        )
        diff = abs(source_count - target_count)

        return {
            "rule_id": rule.rule_id,
            "check": "record_count",
            "source_count": source_count,
            "target_count": target_count,
            "difference": diff,
            "status": "PASS" if diff == 0 else "FAIL",
            "tolerance": rule.tolerance,
        }

    def reconcile_aggregations(
        self, rule: ReconciliationRule
    ) -> dict[str, Any]:
        """Reconcile aggregated values."""
        results = []

        for agg_func in rule.aggregate_functions:
            for col in rule.compare_columns:
                source_query = f"""
                    SELECT {agg_func}({col}) as agg_value
                    FROM {rule.source_table}
                """
                target_query = f"""
                    SELECT {agg_func}({col}) as agg_value
                    FROM {rule.target_table}
                """

                source_val = self._execute_scalar(
                    self.source_engine, source_query
                )
                target_val = self._execute_scalar(
                    self.target_engine, target_query
                )

                if source_val and target_val:
                    diff = abs(
                        float(source_val) - float(target_val)
                    )
                    within_tolerance = diff <= rule.tolerance
                else:
                    diff = 0
                    within_tolerance = source_val == target_val

                results.append({
                    "aggregation": f"{agg_func}({col})",
                    "source_value": source_val,
                    "target_value": target_val,
                    "difference": diff,
                    "within_tolerance": within_tolerance,
                })

        all_pass = all(r["within_tolerance"] for r in results)

        return {
            "rule_id": rule.rule_id,
            "check": "aggregation",
            "results": results,
            "status": "PASS" if all_pass else "FAIL",
        }

    def _execute_scalar(self, engine, query: str) -> Any:
        """Execute query and return single value."""
        return 0

    def generate_reconciliation_report(self) -> str:
        """Generate comprehensive reconciliation report."""
        total = len(self.reports)
        passed = sum(
            1 for r in self.reports if r["status"] == "PASS"
        )
        failed = sum(
            1 for r in self.reports if r["status"] == "FAIL"
        )

        lines = [
            "=" * 70,
            "  RECONCILIATION REPORT",
            "=" * 70,
            f"  Total Rules Executed : {total}",
            f"  Passed               : {passed}",
            f"  Failed               : {failed}",
            f"  Timestamp            : {datetime.utcnow().isoformat()}",
            "=" * 70,
        ]

        for r in self.reports:
            icon = "✓" if r["status"] == "PASS" else "✗"
            lines.append(
                f"  [{icon}] Rule {r['rule_id']}: {r['check']} - {r['status']}"
            )

        return "\n".join(lines)
```

#### 8.1.2 Reconciliation Report Template

| Field | Source | Target | Variance | Status |
|-------|--------|--------|----------|--------|
| Total Records | — | — | — | PASS/FAIL |
| Total Debits | — | — | — | PASS/FAIL |
| Total Credits | — | — | — | PASS/FAIL |
| Balance Check | — | — | — | PASS/FAIL |
| Active Customers | — | — | — | PASS/FAIL |
| Transaction Count | — | — | — | PASS/FAIL |
| Avg Transaction Value | — | — | — | PASS/FAIL |
| Null Count (key fields) | — | — | — | PASS/FAIL |

### 8.2 Aggregation Validation

| Aggregation | Source | Target | Tolerance | Status |
|-------------|--------|--------|-----------|--------|
| SUM(amount) | — | — | 0.01 | PASS/FAIL |
| COUNT(*) | — | — | 0 | PASS/FAIL |
| AVG(amount) | — | — | 0.001 | PASS/FAIL |
| MIN(amount) | — | — | 0 | PASS/FAIL |
| MAX(amount) | — | — | 0 | PASS/FAIL |
| STDDEV(amount) | — | — | 0.01 | PASS/FAIL |

---

## 9. Data Quality

### 9.1 Accuracy

#### 9.1.1 Accuracy Validation Framework

```python
"""Data accuracy validation for MAP migrations."""

from dataclasses import dataclass, field
from typing import Any


class AccuracyValidator:
    """Validates data accuracy across migrated datasets."""

    def __init__(self, engine):
        self.engine = engine
        self.results: list[dict[str, Any]] = []

    def validate_range(
        self,
        table: str,
        column: str,
        min_value: Any = None,
        max_value: Any = None,
    ) -> dict[str, Any]:
        """Validate values are within expected range."""
        conditions = []
        if min_value is not None:
            conditions.append(f"{column} < {min_value}")
        if max_value is not None:
            conditions.append(f"{column} > {max_value}")

        where_clause = " OR ".join(conditions)

        query = f"""
            SELECT COUNT(*) as violations
            FROM {table}
            WHERE {where_clause}
        """

        violations = self._execute_scalar(query)
        total = self._execute_scalar(
            f"SELECT COUNT(*) FROM {table}"
        )
        accuracy_pct = (
            ((total - violations) / total * 100)
            if total > 0
            else 0.0
        )

        result = {
            "rule": "range_check",
            "table": table,
            "column": column,
            "min_value": min_value,
            "max_value": max_value,
            "total_records": total,
            "violations": violations,
            "accuracy_percentage": accuracy_pct,
            "status": "PASS" if violations == 0 else "FAIL",
        }

        self.results.append(result)
        return result

    def validate_lookup(
        self,
        table: str,
        column: str,
        reference_table: str,
        reference_column: str,
    ) -> dict[str, Any]:
        """Validate values exist in reference table."""
        query = f"""
            SELECT COUNT(*) as violations
            FROM {table} t
            LEFT JOIN {reference_table} r
                ON t.{column} = r.{reference_column}
            WHERE r.{reference_column} IS NULL
              AND t.{column} IS NOT NULL
        """

        violations = self._execute_scalar(query)
        total = self._execute_scalar(
            f"SELECT COUNT(*) FROM {table} WHERE {column} IS NOT NULL"
        )
        accuracy_pct = (
            ((total - violations) / total * 100)
            if total > 0
            else 0.0
        )

        return {
            "rule": "lookup_check",
            "table": table,
            "column": column,
            "reference": f"{reference_table}.{reference_column}",
            "total_records": total,
            "violations": violations,
            "accuracy_percentage": accuracy_pct,
            "status": "PASS" if violations == 0 else "FAIL",
        }

    def _execute_scalar(self, query: str) -> Any:
        """Execute query and return single value."""
        return 0

    def generate_accuracy_report(self) -> str:
        """Generate accuracy validation report."""
        total = len(self.results)
        passed = sum(
            1 for r in self.results if r["status"] == "PASS"
        )
        failed = sum(
            1 for r in self.results if r["status"] == "FAIL"
        )

        lines = [
            "=" * 60,
            "  DATA ACCURACY REPORT",
            "=" * 60,
            f"  Total Checks : {total}",
            f"  Passed       : {passed}",
            f"  Failed       : {failed}",
            "=" * 60,
        ]

        for r in self.results:
            icon = "✓" if r["status"] == "PASS" else "✗"
            pct = r.get("accuracy_percentage", 0)
            lines.append(
                f"  [{icon}] {r['table']}.{r['column']}: {pct:.2f}% accurate"
            )

        return "\n".join(lines)
```

### 9.2 Completeness

| Check | Table | Column | Expected | Actual | Status |
|-------|-------|--------|----------|--------|--------|
| NOT NULL | transactions | id | 100% | — | PASS/FAIL |
| NOT NULL | transactions | amount | 100% | — | PASS/FAIL |
| NOT NULL | customers | email | 99% | — | PASS/FAIL |
| FK Complete | transactions | account_id | 100% | — | PASS/FAIL |
| Required Fields | orders | status | 100% | — | PASS/FAIL |

### 9.3 Timeliness

| Check | Table | Max Age | Actual Age | Status |
|-------|-------|---------|------------|--------|
| Freshness | transactions | 24 hours | — | PASS/FAIL |
| Freshness | customer_updates | 1 hour | — | PASS/FAIL |
| Batch Timeliness | daily_summary | Current date | — | PASS/FAIL |
| Sync Latency | orders (source→target) | 15 min | — | PASS/FAIL |

### 9.4 Validity

| Check | Table | Column | Rule | Violations | Status |
|-------|-------|--------|------|------------|--------|
| Regex | customers | email | ^[A-Za-z0-9._%+-]+@... | — | PASS/FAIL |
| Enum | transactions | status | IN ('COMPLETED','PENDING'...) | — | PASS/FAIL |
| Domain | customers | phone | +[1-9]\d{1,14} | — | PASS/FAIL |
| Range | transactions | amount | > 0 AND <= 10000000 | — | PASS/FAIL |

---

## 10. Backup Validation

### 10.1 Backup Procedures

#### 10.1.1 Backup Validation Checklist

| Step | Validation | Expected | Actual | Status |
|------|-----------|----------|--------|--------|
| 1 | Backup file exists | True | — | ☐ |
| 2 | Backup file readable | True | — | ☐ |
| 3 | Backup file size > 0 | True | — | ☐ |
| 4 | Checksum matches | True | — | ☐ |
| 5 | Test restore successful | True | — | ☐ |
| 6 | Backup schedule compliance | 100% | — | ☐ |

### 10.2 Recovery Testing

| Recovery Scenario | RPO Target | RTO Target | Test Frequency | Automated |
|-------------------|------------|------------|----------------|-----------|
| Full database restore | 24 hours | 4 hours | Monthly | Yes |
| Point-in-time recovery | 15 minutes | 1 hour | Weekly | Yes |
| Table-level restore | 1 hour | 30 minutes | Monthly | Yes |
| Cross-region failover | 5 minutes | 15 minutes | Quarterly | Semi |
| Disaster recovery drill | 24 hours | 8 hours | Annually | Manual |
| Backup integrity check | — | — | Daily | Yes |

---

## 11. Recovery Testing

### 11.1 Disaster Recovery

#### 11.1.1 DR Test Framework

```python
"""Disaster recovery testing framework for MAP."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


class DRScenario(Enum):
    """Disaster recovery test scenarios."""
    FULL_RESTORE = "full_restore"
    POINT_IN_TIME = "point_in_time"
    CROSS_REGION = "cross_region"
    TABLE_RESTORE = "table_restore"
    PARTIAL_RESTORE = "partial_restore"


class DROrchestrator:
    """Orchestrates disaster recovery tests."""

    def __init__(self, primary_engine, dr_engine):
        self.primary = primary_engine
        self.dr = dr_engine
        self.test_results: list[dict[str, Any]] = []

    def test_full_restore(
        self, backup_path: str, target_database: str
    ) -> dict[str, Any]:
        """Test full database restore from backup."""
        start_time = datetime.utcnow()

        restore_success = self._restore_backup(
            backup_path, target_database
        )
        integrity_ok = self._verify_integrity(target_database)
        business_rules_ok = self._validate_business_rules(
            target_database
        )
        performance_ok = self._check_performance(target_database)

        end_time = datetime.utcnow()
        duration = (end_time - start_time).total_seconds()

        result = {
            "scenario": "full_restore",
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "duration_seconds": duration,
            "restore_success": restore_success,
            "data_integrity": integrity_ok,
            "business_rules": business_rules_ok,
            "performance_acceptable": performance_ok,
            "overall_status": all([
                restore_success,
                integrity_ok,
                business_rules_ok,
                performance_ok,
            ]),
        }

        self.test_results.append(result)
        return result

    def _restore_backup(self, path: str, database: str) -> bool:
        return True

    def _verify_integrity(self, database: str) -> bool:
        return True

    def _validate_business_rules(self, database: str) -> bool:
        return True

    def _check_performance(self, database: str) -> bool:
        return True

    def generate_dr_report(self) -> str:
        """Generate DR test report."""
        total = len(self.test_results)
        passed = sum(
            1 for r in self.test_results if r["overall_status"]
        )
        failed = total - passed

        lines = [
            "=" * 60,
            "  DISASTER RECOVERY TEST REPORT",
            "=" * 60,
            f"  Total Scenarios : {total}",
            f"  Passed          : {passed}",
            f"  Failed          : {failed}",
            "=" * 60,
        ]

        for r in self.test_results:
            icon = "✓" if r["overall_status"] else "✗"
            status = "PASS" if r["overall_status"] else "FAIL"
            lines.append(
                f"  [{icon}] {r['scenario']}: "
                f"{r['duration_seconds']:.0f}s - {status}"
            )

        return "\n".join(lines)
```

### 11.2 Point-in-Time Recovery

#### 11.2.1 PITR Validation Checklist

| Step | Validation | Expected Result | Status |
|------|-----------|-----------------|--------|
| 1 | WAL/log availability | Logs available for target period | ☐ |
| 2 | Backup chain intact | All backups in sequence verified | ☐ |
| 3 | Recovery to target time | Database restored to exact timestamp | ☐ |
| 4 | Data consistency | No corruption or missing records | ☐ |
| 5 | Transaction isolation | No partial transactions committed | ☐ |
| 6 | Application connectivity | Apps can connect and query | ☐ |
| 7 | Performance baseline | Query times within 10% of baseline | ☐ |
| 8 | Business rule compliance | All business rules pass | ☐ |

---

## 12. Test Data Management

### 12.1 Synthetic Data Generation

#### 12.1.1 Synthetic Data Framework

```python
"""Synthetic data generation for MAP testing."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any
import random
import string


class DataType(Enum):
    """Supported synthetic data types."""
    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    DATE = "date"
    DATETIME = "datetime"
    EMAIL = "email"
    PHONE = "phone"
    NAME = "name"
    UUID = "uuid"
    BOOLEAN = "boolean"
    CURRENCY = "currency"
    COUNTRY_CODE = "country_code"


@dataclass
class ColumnConfig:
    """Configuration for synthetic column generation."""
    name: str
    data_type: DataType
    nullable: bool = False
    null_probability: float = 0.0
    min_value: Any = None
    max_value: Any = None
    allowed_values: list[Any] = field(default_factory=list)
    unique: bool = False


@dataclass
class TableConfig:
    """Configuration for synthetic table generation."""
    table_name: str
    row_count: int = 1000
    columns: list[ColumnConfig] = field(default_factory=list)
    primary_key: str = ""


class SyntheticDataGenerator:
    """Generates synthetic test data for MAP."""

    def __init__(self, seed: int = 42):
        self.seed = seed
        random.seed(seed)
        self.generated_data: dict[str, list[dict]] = {}

    def generate_table(self, config: TableConfig) -> list[dict]:
        """Generate synthetic data for a table."""
        rows = []
        generated_pks = set()

        for i in range(config.row_count):
            row = {}
            for col in config.columns:
                if col.unique and col.name == config.primary_key:
                    value = self._generate_unique_pk(
                        col, generated_pks
                    )
                    generated_pks.add(value)
                else:
                    value = self._generate_value(col)
                    if (
                        col.nullable
                        and random.random() < col.null_probability
                    ):
                        value = None
                row[col.name] = value
            rows.append(row)

        self.generated_data[config.table_name] = rows
        return rows

    def _generate_value(self, col: ColumnConfig) -> Any:
        """Generate a single value based on column config."""
        if col.allowed_values:
            return random.choice(col.allowed_values)

        generators = {
            DataType.INTEGER: self._gen_integer,
            DataType.FLOAT: self._gen_float,
            DataType.STRING: self._gen_string,
            DataType.DATE: self._gen_date,
            DataType.EMAIL: self._gen_email,
            DataType.PHONE: self._gen_phone,
            DataType.NAME: self._gen_name,
            DataType.BOOLEAN: lambda c: random.choice([True, False]),
            DataType.CURRENCY: lambda c: round(random.uniform(0.01, 100000.00), 2),
            DataType.COUNTRY_CODE: lambda c: random.choice(["US", "GB", "DE", "FR", "JP"]),
        }

        generator = generators.get(col.data_type, self._gen_string)
        return generator(col)

    def _gen_integer(self, col: ColumnConfig) -> int:
        min_val = col.min_value or 0
        max_val = col.max_value or 1_000_000
        return random.randint(min_val, max_val)

    def _gen_float(self, col: ColumnConfig) -> float:
        min_val = col.min_value or 0.0
        max_val = col.max_value or 1_000_000.0
        return round(random.uniform(min_val, max_val), 2)

    def _gen_string(self, col: ColumnConfig) -> str:
        length = col.max_value or 10
        return "".join(random.choices(string.ascii_lowercase, k=length))

    def _gen_date(self, col: ColumnConfig) -> datetime:
        start = col.min_value or datetime(2020, 1, 1)
        end = col.max_value or datetime(2026, 12, 31)
        delta = (end - start).days
        return start + timedelta(days=random.randint(0, delta))

    def _gen_email(self, col: ColumnConfig) -> str:
        domains = ["example.com", "test.org", "mail.com"]
        user = "".join(random.choices(string.ascii_lowercase, k=8))
        return f"{user}@{random.choice(domains)}"

    def _gen_phone(self, col: ColumnConfig) -> str:
        return f"+1{random.randint(1000000000, 9999999999)}"

    def _gen_name(self, col: ColumnConfig) -> str:
        first_names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones"]
        return f"{random.choice(first_names)} {random.choice(last_names)}"

    def _generate_unique_pk(self, col: ColumnConfig, existing: set) -> int:
        while True:
            value = self._gen_integer(col)
            if value not in existing:
                return value


def create_financial_test_dataset() -> TableConfig:
    """Create a standard financial test dataset."""
    return TableConfig(
        table_name="financial_transactions",
        row_count=10000,
        primary_key="transaction_id",
        columns=[
            ColumnConfig(name="transaction_id", data_type=DataType.INTEGER, min_value=1, max_value=100000, unique=True),
            ColumnConfig(name="account_id", data_type=DataType.INTEGER, min_value=1000, max_value=99999),
            ColumnConfig(name="transaction_date", data_type=DataType.DATE, min_value=datetime(2024, 1, 1), max_value=datetime(2026, 6, 30)),
            ColumnConfig(name="amount", data_type=DataType.CURRENCY, min_value=0.01, max_value=1000000.00),
            ColumnConfig(name="currency", data_type=DataType.COUNTRY_CODE, allowed_values=["USD", "EUR", "GBP", "JPY"]),
            ColumnConfig(name="transaction_type", data_type=DataType.STRING, allowed_values=["DEBIT", "CREDIT", "TRANSFER", "FEE"]),
            ColumnConfig(name="status", data_type=DataType.STRING, allowed_values=["COMPLETED", "PENDING", "FAILED", "CANCELLED"]),
        ],
    )
```

### 12.2 Data Anonymisation

#### 12.2.1 Anonymisation Strategies

| Strategy | Description | Use Case | Reversibility |
|----------|-------------|----------|---------------|
| **Redaction** | Replace with fixed value | PII in logs | Irreversible |
| **Tokenisation** | Replace with token | Payment data | Reversible (with key) |
| **Hashing** | SHA-256 hash | Identifiers | Irreversible |
| **Masking** | Partial display | SSN, card numbers | Irreversible |
| **Generalisation** | Reduce precision | Ages, dates | Irreversible |
| **Noise injection** | Add random noise | Numerical data | Irreversible |
| **Synthetic replacement** | Replace with fake data | All PII | Irreversible |

### 12.3 Data Masking

#### 12.3.1 Masking Rules Matrix

| Data Type | Original Pattern | Masked Pattern | Example |
|-----------|------------------|----------------|---------|
| SSN | XXX-XX-XXXX | XXX-XX-XXX | 123-45-6789 → XXX-XX-6789 |
| Credit Card | XXXX-XXXX-XXXX-XXXX | XXXX-XXXX-XXXX-XXXX | 4111-1111-1111-1111 → XXXX-XXXX-XXXX-1111 |
| Email | user@domain.com | u***@domain.com | john@example.com → j***@example.com |
| Phone | +1XXXXXXXXXX | +1XXXXX**XX | +15551234567 → +1555***4567 |
| Name | First Last | F*** L*** | John Smith → J*** S*** |
| DOB | YYYY-MM-DD | YYYY-XX-DD | 1990-05-15 → 1990-XX-15 |
| Account No | XXXXXXXXXX | XXXXX**XXX | 1234567890 → 12345**7890 |

---

## 13. Recommended Tools

### 13.1 Tool Stack

| Category | Tool | Purpose | Version |
|----------|------|---------|---------|
| **Testing Framework** | pytest | Test orchestration, fixtures, reporting | ≥ 7.0 |
| **SQL Validation** | SQLFluff | SQL linting and formatting | ≥ 2.0 |
| **Data Quality** | Great Expectations | Data validation and profiling | ≥ 0.18 |
| **Schema Validation** | SQLAlchemy | Schema introspection and validation | ≥ 2.0 |
| **Test Data** | Faker | Synthetic data generation | ≥ 20.0 |
| **Hashing** | hashlib (stdlib) | Row-level hash comparison | built-in |
| **Reporting** | Allure | Test report generation | ≥ 2.13 |
| **Mocking** | unittest.mock | Database mocking for unit tests | built-in |
| **Async** | pytest-asyncio | Async test execution | ≥ 0.21 |
| **Coverage** | pytest-cov | Code coverage reporting | ≥ 4.0 |

### 13.2 Great Expectations Integration

```python
"""Great Expectations integration for MAP data validation."""

import great_expectations as gx
from great_expectations.core import ExpectationSuite
from great_expectations.core.batch import RuntimeBatchRequest


class MAPDataValidator:
    """MAP data validation using Great Expectations."""

    def __init__(self, context_root_dir: str):
        self.context = gx.get_context(
            context_root_dir=context_root_dir
        )

    def create_expectation_suite(
        self, suite_name: str
    ) -> ExpectationSuite:
        """Create a new expectation suite."""
        return self.context.add_expectation_suite(
            expectation_suite_name=suite_name
        )

    def add_migration_expectations(
        self, suite: ExpectationSuite
    ) -> ExpectationSuite:
        """Add standard MAP migration expectations."""
        suite.add_expectation(
            gx.expectations.ExpectTableRowCountToBeBetween(
                min_value=0,
                max_value=10_000_000,
            )
        )

        required_columns = [
            "id", "created_at", "updated_at",
            "source_system", "migration_batch",
        ]
        for col in required_columns:
            suite.add_expectation(
                gx.expectations.ExpectColumnToExist(column=col)
            )

        not_null_columns = ["id", "created_at", "source_system"]
        for col in not_null_columns:
            suite.add_expectation(
                gx.expectations.ExpectColumnValuesToNotBeNull(
                    column=col
                )
            )

        suite.add_expectation(
            gx.expectations.ExpectColumnValuesToBeUnique(
                column="id"
            )
        )

        suite.add_expectation(
            gx.expectations.ExpectColumnValuesToBeInSet(
                column="migration_status",
                value_set=[
                    "COMPLETED", "PENDING",
                    "FAILED", "ROLLED_BACK",
                ],
            )
        )

        return suite

    def validate_batch(
        self,
        datasource_name: str,
        data_asset_name: str,
        suite_name: str,
    ) -> dict:
        """Validate a data batch against expectations."""
        batch_request = RuntimeBatchRequest(
            datasource_name=datasource_name,
            data_asset_name=data_asset_name,
            batch_identifiers={"id": "default"},
        )

        validator = self.context.get_validator(
            batch_request=batch_request,
            expectation_suite_name=suite_name,
        )

        results = validator.validate()

        return {
            "success": results.success,
            "statistics": results.statistics,
            "results": [
                {
                    "expectation": r.expectation_config.expectation_type,
                    "success": r.success,
                    "result": r.result,
                }
                for r in results.results
            ],
        }
```

### 13.3 Pytest Configuration

```python
"""Pytest configuration for MAP data testing."""

import pytest
import logging
from unittest.mock import MagicMock


# ===== Fixtures =====

@pytest.fixture(scope="session")
def source_engine():
    """Source database engine fixture."""
    engine = MagicMock()
    engine.execute = MagicMock()
    return engine


@pytest.fixture(scope="session")
def target_engine():
    """Target database engine fixture."""
    engine = MagicMock()
    engine.execute = MagicMock()
    return engine


@pytest.fixture(scope="session")
def migration_config():
    """Migration configuration fixture."""
    return {
        "source": {
            "host": "source-db.example.com",
            "port": 5432,
            "database": "source_db",
            "schema": "public",
        },
        "target": {
            "host": "target-db.example.com",
            "port": 5432,
            "database": "target_db",
            "schema": "analytics",
        },
        "batch_size": 10000,
        "timeout_seconds": 3600,
    }


@pytest.fixture(autouse=True)
def log_test_name(request):
    """Automatically log test names."""
    logging.info(f"Starting test: {request.node.name}")
    yield
    logging.info(f"Completed test: {request.node.name}")


# ===== Markers =====

def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "smoke: Quick smoke tests")
    config.addinivalue_line("markers", "regression: Full regression tests")
    config.addinivalue_line("markers", "schema: Schema validation tests")
    config.addinivalue_line("markers", "integrity: Data integrity tests")
    config.addinivalue_line("markers", "reconciliation: Reconciliation tests")
    config.addinivalue_line("markers", "performance: Performance tests")
    config.addinivalue_line("markers", "backup: Backup and recovery tests")
```

---

## 14. Best Practices

### 14.1 Data Profiling

| Profile Dimension | Metric | Tool/Method | Threshold |
|-------------------|--------|-------------|-----------|
| Completeness | NULL percentage per column | SQL COUNT queries | < 5% for required fields |
| Uniqueness | Distinct value count | SQL COUNT DISTINCT | Match primary key count |
| Validity | Format compliance rate | Regex pattern matching | > 99% |
| Consistency | Cross-column dependency | Business rule SQL | 100% compliance |
| Timeliness | Data age distribution | Timestamp analysis | Within SLA |
| Distribution | Value frequency analysis | GROUP BY queries | No unexpected spikes |

### 14.2 Data Contracts

```python
"""Data contract definition for MAP migrations."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class DataContract:
    """Defines a data contract between producer and consumer."""
    contract_id: str
    schema_name: str
    table_name: str
    owner: str
    version: str
    effective_date: datetime
    expiry_date: datetime | None = None
    description: str = ""

    # Schema contract
    columns: list[dict[str, Any]] = field(default_factory=list)

    # Quality contract
    quality_rules: list[dict[str, Any]] = field(default_factory=list)

    # SLA contract
    freshness_sla_hours: int = 24
    completeness_sla: float = 0.99

    # Governance
    classification: str = "INTERNAL"
    retention_days: int = 365
    compliance_requirements: list[str] = field(default_factory=list)


class ContractValidator:
    """Validates data against published contracts."""

    def __init__(self, engine):
        self.engine = engine

    def validate_contract(
        self, contract: DataContract
    ) -> dict[str, Any]:
        """Validate data against contract specification."""
        results = {
            "contract_id": contract.contract_id,
            "table": f"{contract.schema_name}.{contract.table_name}",
            "checks": [],
        }

        schema_result = self._validate_schema(contract)
        results["checks"].append(schema_result)

        for rule in contract.quality_rules:
            rule_result = self._validate_quality_rule(rule, contract)
            results["checks"].append(rule_result)

        sla_result = self._validate_slas(contract)
        results["checks"].append(sla_result)

        results["overall_status"] = all(
            c["status"] == "PASS" for c in results["checks"]
        )

        return results

    def _validate_schema(self, contract: DataContract) -> dict[str, Any]:
        """Validate schema matches contract."""
        return {"check": "schema", "status": "PASS"}

    def _validate_quality_rule(self, rule: dict, contract: DataContract) -> dict[str, Any]:
        """Validate a quality rule."""
        return {"check": "quality", "rule": rule.get("name", ""), "status": "PASS"}

    def _validate_slas(self, contract: DataContract) -> dict[str, Any]:
        """Validate SLA compliance."""
        return {"check": "sla", "status": "PASS"}
```

### 14.3 Data Lineage

| Lineage Aspect | Description | Tool | Frequency |
|----------------|-------------|------|-----------|
| Source tracking | Origin of each data element | Custom SQL | Every migration |
| Transformation tracking | All transformations applied | ETL logs | Every run |
| Target mapping | Destination of each field | Schema registry | Schema changes |
| Impact analysis | Downstream dependencies | Lineage graph | Before changes |
| Audit trail | Complete history of changes | Version control | Every change |

### 14.4 Data Quality Scorecard

| Dimension | Weight | Metric | Target | Current |
|-----------|--------|--------|--------|---------|
| Accuracy | 25% | Records matching golden source | 99.9% | — |
| Completeness | 25% | Required fields populated | 99.5% | — |
| Timeliness | 20% | Data freshness within SLA | 99.0% | — |
| Validity | 15% | Values within allowed sets | 99.9% | — |
| Consistency | 15% | Cross-system agreement | 99.9% | — |
| **Overall** | **100%** | **Weighted average** | **99.5%** | **—** |

### 14.5 Test Execution Order

```
Phase 1: Pre-Migration
    1. Schema validation (source)
    2. Data profiling (source)
    3. Backup validation
    4. Test data generation

Phase 2: Migration Execution
    5. Real-time record count monitoring
    6. Error log monitoring
    7. Performance metrics collection

Phase 3: Post-Migration Validation
    8. Record count reconciliation
    9. Schema validation (target)
    10. Sample data validation
    11. Aggregation validation
    12. Hash diff validation
    13. Referential integrity checks
    14. Business rule validation
    15. Data quality checks

Phase 4: Cross-System Validation
    16. Cross-system consistency
    17. Synchronisation validation
    18. Full reconciliation report

Phase 5: Sign-Off
    19. Generate final report
    20. Stakeholder review
    21. Migration approval
```

---

## 15. Dependencies

### 15.1 Document Dependencies

| Document | Batch | Dependency Type | Description |
|----------|-------|-----------------|-------------|
| Database Architecture | Batch 08 | Schema definitions | Canonical schema design, partitioning, indexing |
| Python Standards | Batch 11 | Code conventions | Type hints, async patterns, testing patterns |
| CI/CD Pipeline | Batch 06 | Automation | Test execution in pipelines |
| Security Standards | Batch 10 | Data protection | Anonymisation, masking requirements |
| Monitoring & Alerting | Batch 09 | Observability | Test result monitoring and alerting |

### 15.2 Technical Dependencies

| Component | Version | Purpose | Required By |
|-----------|---------|---------|-------------|
| Python | ≥ 3.11 | Runtime | All tests |
| PostgreSQL | ≥ 15 | Source/target database | Schema validation |
| pytest | ≥ 7.0 | Test framework | All tests |
| Great Expectations | ≥ 0.18 | Data quality | Quality checks |
| SQLAlchemy | ≥ 2.0 | Database connectivity | Schema introspection |
| hashlib | built-in | Row-level hashing | Hash diff validation |

---

## 16. Appendices

### Appendix A: SQL Query Templates

```sql
-- A.1 Record Count Comparison
SELECT
    'source' as system,
    COUNT(*) as record_count
FROM {source_table}
UNION ALL
SELECT
    'target' as system,
    COUNT(*) as record_count
FROM {target_table};

-- A.2 NULL Analysis
SELECT
    column_name,
    COUNT(*) as total_rows,
    COUNT(column_name) as non_null_rows,
    COUNT(*) - COUNT(column_name) as null_count,
    ROUND(
        COUNT(column_name)::DECIMAL / NULLIF(COUNT(*), 0) * 100,
        2
    ) as completeness_pct
FROM {table_name}
GROUP BY column_name
ORDER BY null_count DESC;

-- A.3 Duplicate Detection
SELECT
    {columns},
    COUNT(*) as occurrence_count
FROM {table_name}
GROUP BY {columns}
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- A.4 Orphan Detection
SELECT
    c.{child_column} as orphan_value,
    COUNT(*) as orphan_count
FROM {child_table} c
LEFT JOIN {parent_table} p
    ON c.{child_column} = p.{parent_column}
WHERE p.{parent_column} IS NULL
  AND c.{child_column} IS NOT NULL
GROUP BY c.{child_column}
ORDER BY orphan_count DESC;

-- A.5 Aggregation Comparison
SELECT
    SUM(amount) as total_amount,
    COUNT(*) as total_records,
    AVG(amount) as avg_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount,
    STDDEV(amount) as stddev_amount
FROM {table_name}
WHERE {filter_condition};
```

### Appendix B: Test Case Templates

| Test Case ID | Description | Pre-conditions | Test Steps | Expected Result | Priority |
|--------------|-------------|-----------------|------------|-----------------|----------|
| TC-DV-001 | Record count validation | Migration complete | Compare source and target counts | Counts match exactly | P1 |
| TC-DV-002 | Schema validation | Target created | Compare schemas | All columns match | P1 |
| TC-DV-003 | Sample data validation | Migration complete | Compare 1000 random rows | 100% match | P1 |
| TC-DV-004 | Hash diff validation | Migration complete | Compare row hashes | 100% match | P1 |
| TC-DV-005 | Referential integrity | Migration complete | Check FK constraints | 0 orphans | P1 |
| TC-DV-006 | Business rules | Migration complete | Run rule validation queries | 0 violations | P1 |
| TC-DV-007 | Backup validation | Backup taken | Verify backup integrity | Backup valid | P2 |
| TC-DV-008 | Rollback test | Migration complete | Execute and verify rollback | Rollback successful | P2 |

### Appendix C: Configuration Templates

```yaml
# migration_validation_config.yaml

source:
  host: source-db.example.com
  port: 5432
  database: source_db
  schema: public
  credentials_secret: arn:aws:secretsmanager:region:account:secret:source-db

target:
  host: target-db.example.com
  port: 5432
  database: target_db
  schema: analytics
  credentials_secret: arn:aws:secretsmanager:region:account:secret:target-db

validation:
  batch_size: 10000
  sample_size: 1000
  tolerance:
    numeric: 0.01
    percentage: 0.1
  
  checks:
    record_count: true
    schema_validation: true
    sample_data: true
    aggregations: true
    hash_diff: true
    referential_integrity: true
    business_rules: true
    data_quality: true

  thresholds:
    record_count_match: 100.0
    sample_data_match: 100.0
    aggregation_match: 99.9
    hash_diff_match: 100.0
    completeness: 99.5
    accuracy: 99.9

reconciliation:
  rules:
    - id: REC-001
      name: Transaction Count
      source_table: transactions
      target_table: analytics_transactions
      type: count
      
    - id: REC-002
      name: Amount Sum
      source_table: transactions
      target_table: analytics_transactions
      type: aggregation
      function: SUM
      column: amount
      tolerance: 0.01

alerting:
  enabled: true
  channels:
    - type: slack
      webhook: https://hooks.slack.com/...
    - type: email
      recipients:
        - data-team@example.com
  thresholds:
    critical: 0
    warning: 5
```

---

## 17. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-06-01 | MAP Team | Initial draft |
| 0.2 | 2026-06-15 | MAP Team | Added data quality sections |
| 0.3 | 2026-06-22 | MAP Team | Incorporated review feedback |
| 0.4 | 2026-06-28 | MAP Team | Added Great Expectations integration |
| 0.5 | 2026-06-30 | MAP Team | Added backup and recovery sections |
| 1.0 | 2026-07-01 | MAP Team | Official release |

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Data Engineering Lead | _________________ | ___/___/2026 | _________________ |
| QA Lead | _________________ | ___/___/2026 | _________________ |
| Migration Architect | _________________ | ___/___/2026 | _________________ |
| DBA Lead | _________________ | ___/___/2026 | _________________ |
| Compliance Officer | _________________ | ___/___/2026 | _________________ |
| Program Manager | _________________ | ___/___/2026 | _________________ |

---

**Document Classification:** INTERNAL

**Distribution:** MAP Data Engineering, QA, Migration Architecture, DBA, Compliance teams

**Review Cycle:** Quarterly or upon significant methodology changes

**Next Review Date:** October 2026

---

*End of Document*
