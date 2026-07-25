# Cloud Object Storage

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Source_Connector_Architecture / Cloud_Object_Storage

---

## Purpose

Connector standards for discovering data stored in cloud object storage and distributed file systems. Implements the `Connector` interface (`Connector_Interface.md`).

## Supported Stores

| Store | URI Scheme | Listing | Auth |
|-------|-----------|---------|------|
| Azure Data Lake | `abfs://` / `adl://` | Recursive prefix listing | Managed Identity / SAS |
| Amazon S3 | `s3://bucket/prefix` | Prefix + delimiter listing | IAM role / access key |
| Google Cloud Storage | `gs://bucket/prefix` | Prefix listing | Service account |
| Local File System | `file:///path` | Directory walk | OS permissions |
| SFTP | `sftp://host/path` | Remote directory list | SSH key / password |

## Discovery Behaviour

- **Listing:** Enumerate objects under a prefix/path; infer table-per-file or table-per-directory based on sibling structure.
- **Format routing:** Object key extension (`.csv`, `.parquet`, `.json`, …) selects the appropriate sub-connector:
  - `.csv`/`.tsv`/`.xlsx` → `Flat_Files.md`
  - `.parquet`/`.orc`/`.avro` → `Columnar_Files.md`
  - `.json`/`.xml`/`.yaml` → `Semi_Structured_Data.md`
- **Partitioning:** Hive-style `key=value/` partitions are detected and surfaced as `partition_columns` in `TableRegistry`.
- **Manifest:** Optional `_manifest` / `_SUCCESS` markers indicate completed datasets.

## Constraints & Limits

- Large buckets are listed incrementally with pagination; `max_keys` caps each call.
- Object storage has **no native constraints** — PK/FK discovery is naming-pattern only (`Constraint_Analysis.md`).

## Credentials

Resolved from the secret store (Doc 21); never embedded in URIs. Short-lived tokens preferred (S3/SAS/GCS).
