# Schema Discovery

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 01_Discovery_Engine / Schema_Discovery

---

## Purpose

Define the architecture for automated database schema discovery across all supported providers and source types.

## Registry Model

Centralized repository for discovered schema metadata (shapes governed by Doc 21):

| Registry Item | Purpose |
|---------------|---------|
| `SchemaRegistry` | Database schema definitions with provider support |
| `TableRegistry` | Table metadata including size, usage, compatibility |
| `ColumnRegistry` | Column metadata with inferred roles and data types |
| `ConstraintRegistry` | Primary key, foreign key, and unique constraint definitions |
| `RelationshipRegistry` | Inter-schema and intra-schema relationships |
| `DiscoveryMetadata` | Timestamps, confidence scores, discovery source |

## Schema Discovery Service

**Purpose:** Extract and standardize schema information from every connected source.

- **Input:** Connection parameters (resolved via connector, `04_Source_Connector_Architecture`).
- **Output:** Standardized schema metadata in registry format.
- **Coverage:** Relational (PostgreSQL, SQL Server, Oracle, MySQL, DB2, Snowflake, Databricks SQL, BigQuery, Redshift), flat files, semi-structured, columnar, and cloud object storage.
- **Granularity:** Full discovery — tables, columns, types, constraints.

## Provider Support Matrix

| Source Category | Connector | Confidence |
|-----------------|-----------|-----------|
| Relational (9 engines) | `Relational_Databases.md` | ✅ |
| Flat files (CSV/TSV/FW/XLSX) | `Flat_Files.md` | ✅ |
| Semi-structured (JSON/XML/YAML) | `Semi_Structured_Data.md` | ✅ |
| Cloud object storage | `Cloud_Object_Storage.md` | ✅ |
| Columnar (Parquet/ORC/Avro) | `Columnar_Files.md` | ✅ |

## Known Gap (MAP v1.9)

The legacy system uses hardcoded `%s` parameter style with `information_schema` queries, which breaks on SQL Server/Oracle/DB2 and is incompatible with Snowflake, BigQuery, Databricks, and file/object sources. The connector architecture (`04`) resolves this with per-source param styles and type maps.
