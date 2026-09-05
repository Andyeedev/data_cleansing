# Connector Interface

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Endpoint_Connector_Architecture / Connector_Interface

---

## Purpose

Define the **uniform connector contract** that every endpoint implements so the Discovery Engine (`01_Discovery_Engine`) can discover metadata without caring about the underlying technology.

> **Endpoint concept:** An Endpoint may act as a Source, Target, or both, depending on the migration or validation context.

## The `Connector` Interface

Every connector implements the same interface:

| Method | Responsibility | Returns |
|--------|----------------|---------|
| `connect(config)` | Establish & validate connection, authenticate | Connection handle / status |
| `list_objects(scope)` | Enumerate top-level containers (schemas, buckets, folders, files) | Object list |
| `extract_schema(object)` | Infer schema (columns, types, constraints) | Partial `SchemaRegistry` entry |
| `sample(object, n)` | Read a capped sample of rows/records | Sample dataset |
| `discover_constraints(object)` | Extract PK/FK/unique/check metadata | `ConstraintRegistry` entries |
| `test()` | Liveness/permission check | Health status |

## Cross-Cutting Requirements

- **Authentication:** Credentials are never persisted by the connector; they are resolved from the secret store referenced by Doc 21 and passed per-session.
- **Error handling:** Every failure returns a structured error (`code`, `message`, `retryable`) — no raw stack traces leak to metadata.
- **Quotas / throttling:** Connectors respect provider rate limits and expose `rate_limit_hint`.
- **Timeouts:** All operations bounded by `discovery_timeout`; long operations run async and emit progress.
- **Type mapping:** Each connector ships a **type-map** translating native types → the canonical type vocabulary in Doc 16.
- **Audit:** `connect`, `extract_schema`, and `discover_constraints` emit `Audit_Trail.md` events.

## Connector Registry

| Connector ID | Category | Implementation |
|--------------|----------|----------------|
| `relational` | Relational | `Relational_Databases.md` |
| `flatfile` | Flat file | `Flat_Files.md` |
| `semistructured` | Semi-structured | `Semi_Structured_Data.md` |
| `cloudobject` | Cloud object storage | `Cloud_Object_Storage.md` |
| `columnar` | Columnar file | `Columnar_Files.md` |

## Selection

The Discovery Engine selects a connector from `object.type` / URI scheme / file extension, then delegates all work to the interface above.
