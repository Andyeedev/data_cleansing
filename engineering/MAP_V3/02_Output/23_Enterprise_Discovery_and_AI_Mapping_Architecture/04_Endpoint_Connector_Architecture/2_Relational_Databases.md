# Relational Databases

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Source_Connector_Architecture / Relational_Databases

---

## Purpose

Connector standards for discovering relational database schemas. All implement the `Connector` interface (`Connector_Interface.md`).

## Supported Engines

| Engine | Connection Pattern | Catalog Query | Notes |
|--------|-------------------|---------------|-------|
| PostgreSQL | `postgres://host:port/db` | `information_schema` + `pg_catalog` | `%s` param style; row estimates via `pg_class.reltuples` |
| SQL Server | `jdbc:sqlserver://host:port;databaseName=` | `INFORMATION_SCHEMA` (square brackets) | Uses `sqlserver` param style; row counts via `sys.partitions` |
| Oracle | `oracle://user:pass@host:port/service` | `ALL_TABLES` / `ALL_TAB_COLUMNS` | `:name` bind style; `NUM_ROWS` from stats |
| MySQL | `mysql://host:port/db` | `information_schema` (backticks) | `%s` param style |
| DB2 | `db2://host:port/db` | `SYSCAT.TABLES` / `SYSCOLUMNS` | `?` param style |
| Snowflake | `snowflake://user:pass@account/db` | `INFORMATION_SCHEMA` (ANSI) | ANSI quoting; `ROW_COUNT` from `TABLES` |
| Databricks SQL | `spark://host:port` / ODBC | `information_schema.tables` | Unity Catalog aware |
| BigQuery | `gcloud://project/dataset` | `INFORMATION_SCHEMA` (REST) | Dataset-scoped; types are ANSI SQL |
| Redshift | `redshift://host:port/db` | `INFORMATION_SCHEMA` + `SVV_COLUMNS` | PG-compatible; uses `pg_catalog` extensions |

## Type Mapping (native → canonical)

| Native Family | Canonical (Doc 16) |
|---------------|--------------------|
| `int`, `integer`, `number(p,0)`, `BIGINT` | `integer` |
| `numeric`, `decimal`, `float`, `double` | `decimal` |
| `varchar`, `text`, `string`, `CLOB` | `string` |
| `date`, `timestamp`, `timestamptz`, `DATETIME` | `datetime` |
| `boolean` | `boolean` |
| `blob`, `binary`, `VARBINARY` | `binary` |

## Discovery Quirks

- **SQL Server / Oracle / DB2** require engine-specific quoting and param styles — the hardcoded `%s` approach in MAP v1.9 breaks here.
- **Snowflake / BigQuery / Redshift / Databricks** need async-safe statistics collection to avoid warehouse compute cost.
- **Cross-schema FKs** must resolve to a single `RelationshipRegistry` entry referencing both schema IDs.

## Constraints

PK/FK/unique/check discovery follows `Constraint_Analysis.md` using each engine's catalog views.
