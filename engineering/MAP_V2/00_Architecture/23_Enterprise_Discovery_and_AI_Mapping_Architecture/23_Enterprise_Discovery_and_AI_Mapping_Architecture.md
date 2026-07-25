# Doc 23 — Enterprise Discovery and AI Mapping Architecture

**Master Document** · Part of the MAP Nexus™ Enterprise Platform Architecture Programme (Version 2.0)

> This is the master document. The `01`–`04` subfolders contain the **detailed standards**; `Cross_Reference_Doc21_Doc16_Doc22.md` holds the dependency detail. Links to every subdocument are in the final section.

---

## 1. Purpose

Define the enterprise-grade architecture for **automated source discovery** and **AI-powered schema mapping**. This architecture enables the MAP platform to:

- Automatically discover databases, tables, columns, and constraints across multiple providers and source types.
- Use machine learning to **semantically match** and **classify** schema elements for migration mapping.
- Govern every discovery and mapping action through validation, approval, and audit.

Doc 23 is the **operational layer** that produces the metadata consumed and governed by:
- **Doc 21** — Enterprise Runtime Metadata Contract (storage & audit shapes)
- **Doc 16** — Enterprise Object Reference (canonical object model)
- **Doc 22** — Enterprise Navigation Contract (discovery sequencing & lineage)

## 2. Scope

**In scope**
- Automated discovery of relational, file-based, columnar, semi-structured, and cloud object storage sources (`01_Discovery_Engine`, `04_Endpoint_Connector_Architecture`).
- AI/ML services: semantic matching, column classification, confidence scoring (`02_AI_Machine_Learning`).
- Governance: approval workflow, metadata validation, audit trail (`03_Governance_and_Workflow`).
- The common connector interface and per-endpoint connector standards (`04_Endpoint_Connector_Architecture`).

**Out of scope**
- Pre-migration **validation runtime and execution** — covered by **Doc 24** (Enterprise Pre-Migration Validation Architecture).
- Storage / compute infrastructure — covered by Doc 05 (Database Architecture) and Doc 09 (Deployment Architecture).
- Frontend / portal implementation — Phase 4 of the MAP CLI MVP Execution Plan.

## 3. Architecture Overview

Four pillars feed a set of shared **registries** (defined by Doc 21):

| Pillar | Folder | Responsibility |
|--------|--------|----------------|
| **Discovery Engine** | `01_Discovery_Engine` | Enumerate schemas, tables, constraints into registries |
| **AI / Machine Learning** | `02_AI_Machine_Learning` | Classify columns, semantically match source→target, score confidence |
| **Governance & Workflow** | `03_Governance_and_Workflow` | Validate metadata, route approvals, record audit |
| **Endpoint Connector Architecture** | `04_Endpoint_Connector_Architecture` | Uniform connectors across all endpoints (Source, Target, or both) |

```
                 ┌─────────────────────────────┐
   Sources ─────▶│ 04 Endpoint Connector Arch. │ (Connect / extract metadata)
                 └──────────────┬──────────────┘
                                ▼
                 ┌─────────────────────────────┐
                 │ 01 Discovery Engine         │ ──▶ SchemaRegistry
                 │ (Schema/Table/Constraint)   │ ──▶ TableRegistry
                 └──────────────┬──────────────┘ ──▶ ColumnRegistry
                                ▼                ──▶ ConstraintRegistry
                 ┌─────────────────────────────┐ ──▶ RelationshipRegistry
                 │ 02 AI / Machine Learning    │
                 │ (Classify / Match / Score)  │
                 └──────────────┬──────────────┘
                                ▼
                 ┌─────────────────────────────┐
                 │ 03 Governance & Workflow    │ (Validate → Approve → Audit)
                 └──────────────┬──────────────┘
                                ▼
                   Doc 21 (contract) · Doc 16 (objects) · Doc 22 (navigation)
```

> **Endpoint concept:** An Endpoint may act as a Source, Target, or both, depending on the migration or validation context.

## 4. High-Level Workflow

```
Connect → Discover → Classify/Match → Score → Validate → Approve → Audit
```

1. **Connect** — an endpoint connector establishes a connection and authenticates (`04_Endpoint_Connector_Architecture`).
2. **Discover** — schema, table, and constraint discovery populate the registries (`01_Discovery_Engine`).
3. **Classify / Match** — AI assigns column roles and proposes source→target matches (`02_AI_Machine_Learning`).
4. **Score** — a transparent confidence score is computed for every proposal (`02_AI_Machine_Learning`).
5. **Validate** — metadata is checked against the Doc 21 contract (`03_Governance_and_Workflow`).
6. **Approve** — human-in-the-loop sign-off, role-based by risk (`03_Governance_and_Workflow`).
7. **Audit** — every action is recorded immutably (`03_Governance_and_Workflow`).

## 5. Folder Structure

```
23_Enterprise_Discovery_and_AI_Mapping_Architecture/
├── 23_Enterprise_Discovery_and_AI_Mapping_Architecture.md   (this master doc)
├── 01_Discovery_Engine/
│   ├── 1_Schema_Discovery.md
│   ├── 2_Table_Discovery.md
│   └── 3_Constraint_Analysis.md
├── 02_AI_Machine_Learning/
│   ├── 1_Semantic_Matching.md
│   ├── 2_Column_Classification.md
│   └── 3_Confidence_Scoring.md
├── 03_Governance_and_Workflow/
│   ├── 1_Approval_Workflow.md
│   ├── 2_Metadata_Validation.md
│   └── 3_Audit_Trail.md
├── 04_Endpoint_Connector_Architecture/
│   ├── 1_Connector_Interface.md
│   ├── 2_Relational_Databases.md
│   ├── 3_Flat_Files.md
│   ├── 4_Semi_Structured_Data.md
│   ├── 5_Cloud_Object_Storage.md
│   └── 6_Columnar_Files.md
└── Cross_Reference_Doc21_Doc16_Doc22.md
```

## 6. Cross References

| Document | Relationship to Doc 23 |
|----------|------------------------|
| **Doc 21 — Enterprise Runtime Metadata Contract** | Doc 23 registries conform to Doc 21 shapes; every event writes a Doc 21 audit record; approved mappings persist under Doc 21. |
| **Doc 16 — Enterprise Object Reference** | Doc 16 defines the canonical object model Doc 23 discovers and enriches; semantic matching targets Doc 16 objects. |
| **Doc 22 — Enterprise Navigation Contract** | Doc 22 governs discovery sequencing and approval batching; Doc 22 lineage surfaces Doc 23 audit events. |

Full dependency detail: see [`Cross_Reference_Doc21_Doc16_Doc22.md`](./Cross_Reference_Doc21_Doc16_Doc22.md).

## 7. Links to All Subdocuments

### `01_Discovery_Engine` — detailed standards
- [1_Schema_Discovery.md](./01_Discovery_Engine/1_Schema_Discovery.md) — schema registry & multi-provider discovery service.
- [2_Table_Discovery.md](./01_Discovery_Engine/2_Table_Discovery.md) — table/view enumeration & statistics.
- [3_Constraint_Analysis.md](./01_Discovery_Engine/3_Constraint_Analysis.md) — PK/FK/unique/check extraction & relationship graph.

### `02_AI_Machine_Learning` — detailed standards
- [1_Semantic_Matching.md](./02_AI_Machine_Learning/1_Semantic_Matching.md) — embedding-based source→target matching.
- [2_Column_Classification.md](./02_AI_Machine_Learning/2_Column_Classification.md) — role & PII classification taxonomy.
- [3_Confidence_Scoring.md](./02_AI_Machine_Learning/3_Confidence_Scoring.md) — explainable confidence model & thresholds.

### `03_Governance_and_Workflow` — detailed standards
- [1_Approval_Workflow.md](./03_Governance_and_Workflow/1_Approval_Workflow.md) — human-in-the-loop states & role-based access.
- [2_Metadata_Validation.md](./03_Governance_and_Workflow/2_Metadata_Validation.md) — validation layers & report schema.
- [3_Audit_Trail.md](./03_Governance_and_Workflow/3_Audit_Trail.md) — immutable event record schema.

### `04_Endpoint_Connector_Architecture` — detailed standards
- [1_Connector_Interface.md](./04_Endpoint_Connector_Architecture/1_Connector_Interface.md) — common connector contract.
- [2_Relational_Databases.md](./04_Endpoint_Connector_Architecture/2_Relational_Databases.md) — PostgreSQL, SQL Server, Oracle, MySQL, DB2, Snowflake, Databricks SQL, BigQuery, Redshift.
- [3_Flat_Files.md](./04_Endpoint_Connector_Architecture/3_Flat_Files.md) — CSV, TSV, Fixed Width, Excel.
- [4_Semi_Structured_Data.md](./04_Endpoint_Connector_Architecture/4_Semi_Structured_Data.md) — JSON, XML, YAML.
- [5_Cloud_Object_Storage.md](./04_Endpoint_Connector_Architecture/5_Cloud_Object_Storage.md) — Azure Data Lake, Amazon S3, Google Cloud Storage, Local File System, SFTP.
- [6_Columnar_Files.md](./04_Endpoint_Connector_Architecture/6_Columnar_Files.md) — Parquet, ORC, Avro.

### Cross reference
- [Cross_Reference_Doc21_Doc16_Doc22.md](./Cross_Reference_Doc21_Doc16_Doc22.md) — full dependency map.

---

*Draft for review. Once approved, this folder promotes to `00_Architecture/23_Enterprise_Discovery_and_AI_Mapping_Architecture/` with the same structure.*
