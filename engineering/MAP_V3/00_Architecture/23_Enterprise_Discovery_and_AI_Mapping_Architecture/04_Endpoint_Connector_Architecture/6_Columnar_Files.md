# Columnar Files

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Source_Connector_Architecture / Columnar_Files

---

## Purpose

Connector standards for discovering schema from columnar and row-columnar file formats. Implements the `Connector` interface (`Connector_Interface.md`).

## Supported Formats

| Format | Extension | Schema Source | Notes |
|--------|-----------|---------------|-------|
| Parquet | `.parquet` | Self-describing footer metadata | Nested/repetition levels supported |
| ORC | `.orc` | File footer (postscript) | Type tree + column stats |
| Avro | `.avro` | Embedded JSON schema | Row-oriented serialization w/ schema |

## Discovery Behaviour

- **Parquet / ORC:** Schema is read from the file footer — no sampling needed. Nested structs → nested `ColumnRegistry` groups; lists/maps → typed collections.
- **Avro:** Schema is embedded as JSON; parsed directly into the canonical model. Writers/sync metadata noted as `format_metadata`.
- **Statistics:** Column min/max/null_count from footers feed `Column_Classification.md` and confidence.
- **Partitioning:** Hive `key=value/` paths → `partition_columns` (see `Cloud_Object_Storage.md`).

## Type Mapping (native → canonical)

| Format Type | Canonical (Doc 16) |
|-------------|--------------------|
| INT32 / INT64 / SHORT / LONG | `integer` |
| FLOAT / DOUBLE | `decimal` |
| BINARY / STRING / CHAR | `string` |
| BOOLEAN | `boolean` |
| INT96 / TIMESTAMP / DATE | `datetime` |
| MAP / LIST / STRUCT | `group` (nested) |

## Output

Produces rich `TableRegistry` + `ColumnRegistry` with full type fidelity and nested groups. Constraint discovery is naming-pattern only (`Constraint_Analysis.md`).
