# Table Discovery

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 01_Discovery_Engine / Table_Discovery

---

## Purpose

Discover and catalog tables (and views) within each discovered schema, capturing structural and statistical metadata used by the AI mapping layer.

## Table Discovery Service

- **Input:** A discovered `SchemaRegistry` entry plus connection credentials.
- **Output:** `TableRegistry` entries with the following attributes:

| Attribute | Description |
|-----------|-------------|
| `table_name` | Physical table / view name |
| `object_type` | `TABLE` or `VIEW` |
| `row_estimate` | Approximate row count (from stats or `EXPLAIN`) |
| `column_count` | Number of columns |
| `has_primary_key` | Boolean flag derived from `ConstraintRegistry` |
| `sample_rows` | Optional capped sample (for semantic inference) |
| `discovered_at` | Timestamp |
| `discovery_confidence` | Provider-native discovery confidence |

## Discovery Flow

1. Enumerate objects from provider `information_schema` / catalog views.
2. Filter by inclusion/exclusion rules from the migration scope (Doc 22 navigation contract).
3. Collect statistics asynchronously to avoid locking production tables.
4. Persist to `TableRegistry` and emit an event to the audit trail (Doc 21 metadata contract).

## Provider Notes

- **PostgreSQL / MySQL:** `information_schema.tables` + `pg_class` reltuples for estimates.
- **SQL Server:** `sys.tables` / `sys.partitions` row counts.
- **Oracle:** `ALL_TABLES` / `NUM_ROWS` from `ALL_TABLES`.
- **Snowflake:** `INFORMATION_SCHEMA.TABLES` with `ROW_COUNT`.
- **BigQuery:** `__TABLES__` metadata via REST.
- **Databricks:** `DESCRIBE EXTENDED` / `information_schema.tables`.
