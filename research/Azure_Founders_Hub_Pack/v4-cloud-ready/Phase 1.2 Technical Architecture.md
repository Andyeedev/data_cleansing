# Phase 1.2 — Technical Architecture

**Version:** 2.0  
**Product:** FS Migration Validation Engine  
**Status:** Architecture Baseline  
**Audience:** Microsoft Founders Hub, Technical Reviewers, Engineering Team

---

## 1. Introduction

The FS Migration Validation Engine is an automated, metadata-driven data migration validation and governance platform designed for regulated Financial Services environments. It validates data migrations across core banking, payments, lending, asset management, and regulatory reporting systems.

The platform is architected as a modular, cloud-ready solution with a centralised orchestration layer (Platform Core) that coordinates independent domain engines responsible for discovery, validation, scoring, and governance.

---

## 2. Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Modularity** | Independent engines communicate through the Platform Core |
| **Metadata-driven** | All validation is driven by database schema metadata |
| **Security-by-design** | Zero Trust, encryption at rest and in transit, secrets isolation |
| **Governance-first** | Release gates, audit trails, and compliance built into every execution |
| **Extensibility** | Plugin-based engine architecture for adding new controls |
| **Cloud-native** | Designed for Azure, deployable anywhere with Docker |
| **Observability** | Comprehensive logging, metrics, and audit trails |
| **Repeatability** | Deterministic validation — same inputs produce same outputs |

---

## 3. High-Level Architecture

```
                     Users / CLI / API
                            │
                     ┌──────┴──────┐
                     │  API Layer  │
                     │  (FastAPI)  │
                     └──────┬──────┘
                            │
                     ┌──────┴──────┐
                     │ Platform   │
                     │ Core       │
                     │ (Orchestrator)│
                     └──────┬──────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
    ┌─────┴─────┐   ┌──────┴──────┐   ┌──────┴──────┐
    │ Discovery │   │  Validation │   │  Scoring    │
    │ Engine    │   │  Engine     │   │  Engine     │
    └─────┬─────┘   └──────┬──────┘   └──────┬──────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                     ┌──────┴──────┐
                     │ Governance  │
                     │ Engine      │
                     └──────┬──────┘
                            │
                     ┌──────┴──────┐
                     │  Database   │
                     │  (PostgreSQL)│
                     └─────────────┘
```

---

## 4. Core Platform Components

### 4.1 Platform Core

The central orchestration layer responsible for:

- **Workflow orchestration** — Controlling execution sequence of discovery, validation, scoring
- **Control dependency management** — DAG-based execution (C02 depends on C01, C09 depends on C03)
- **State management** — Tracking batch execution state, checkpointing
- **Configuration management** — Centralised config for all engines
- **Security enforcement** — Authentication, authorisation, audit logging
- **Event routing** — Emitting and consuming events between engines
- **Error handling** — Failure isolation, retry logic, graceful degradation

### 4.2 Discovery Engine

Responsible for automated schema discovery from source and target databases.

**Capabilities:**
- Database connection management via `app/db_connector.py`
- Schema discovery — tables, columns, data types, constraints
- Metadata extraction and repository population
- Relationship detection (primary keys, foreign keys)

**Output:** Metadata repository in the engine database.

### 4.3 Validation Engine

The core validation component executing 10 structured migration controls.

**Validation Controls (C01–C010):**
| Control | Description | SQL Template |
|---------|-------------|-------------|
| C01 | Row count reconciliation | `sql/controls/` |
| C02 | Column-level data type validation | `sql/controls/` |
| C03 | Nullability constraint verification | `sql/controls/` |
| C04 | Primary key integrity check | `sql/controls/` |
| C05 | Foreign key referential integrity | `sql/controls/` |
| C06 | Business rule validation | `sql/controls/` |
| C07 | Date/time boundary validation | `sql/controls/` |
| C08 | Numeric range and precision checks | `sql/controls/` |
| C09 | String pattern and format validation | `sql/controls/` |
| C010 | Regulatory field completeness check | `sql/controls/` |

Controls are implemented as SQL templates executed against source and target databases, with results stored in the engine database.

### 4.4 Scoring Engine

Responsible for evaluating validation results and producing quality metrics.

**Capabilities:**
- Control-level pass/fail determination
- Aggregate scoring across all controls
- Configurable pass thresholds
- Weighted scoring by control criticality
- Exception register management

### 4.5 Governance Engine

Provides enterprise governance across the migration lifecycle.

**Capabilities:**
- Release gate enforcement — blocks migration if score below threshold
- Batch-level tracking with unique batch IDs
- Audit trail — every execution logged with timestamp and result
- Exception register — all validation failures recorded
- CSV audit export for regulatory review

---

## 5. Data Architecture

### 5.1 Engine Database (PostgreSQL)

The engine database stores all operational data:

| Entity | Description |
|--------|-------------|
| `migration_validation_batch` | Batch-level execution tracking |
| `migration_control_execution` | Individual control execution results |
| `migration_exception_register` | All validation exceptions |
| Source/target metadata | Discovered schema information |

See `sql/schema/01_engine_schema.sql` for full schema definition.

### 5.2 Source & Target Databases

The platform connects to source and target PostgreSQL databases to perform validation. The connector layer (`app/db_connector.py`) manages connections and handles credential security through environment variables and Azure Key Vault.

---

## 6. Security Architecture

| Layer | Implementation |
|-------|----------------|
| **Identity** | Environment-based authentication, future: Microsoft Entra ID |
| **Secrets** | Environment variables → Azure Key Vault migration path |
| **Encryption at rest** | PostgreSQL TDE / Azure SQL transparent encryption |
| **Encryption in transit** | TLS for all database connections |
| **API security** | FastAPI with CORS, future: OAuth2 / Entra ID |
| **Secrets isolation** | No credentials in source code — all via environment variables |
| **Audit logging** | Every control execution logged with batch ID and timestamp |

---

## 7. Integration Architecture

### 7.1 CLI Interface
```
python app/main.py run --config config.yaml
python app/main.py discover --config config.yaml
python app/main.py export --config config.yaml --batch-id <id>
```

### 7.2 REST API (FastAPI)
- `GET /health` — Health check
- `POST /api/v1/validate` — Run validation batch
- `GET /api/v1/batch/{id}` — Get batch results
- `GET /api/v1/export/{batch_id}` — Export audit CSV

### 7.3 Docker Deployment
- `docker-compose up --build` — Full stack deployment
- Containerised engine, database, and API

---

## 8. Deployment Architecture

| Environment | Deployment Model | Database |
|-------------|-----------------|----------|
| **Development** | Local Docker Compose | Local PostgreSQL |
| **Test/QA** | Azure Container Apps | Azure SQL Database |
| **Production** | Azure Container Apps / AKS | Azure SQL Database |
| **On-premises** | Docker Compose | PostgreSQL |

---

## 9. Current Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| CLI Engine | ✅ Production-ready | `app/main.py`, `app/execution_engine.py` |
| 10 Validation Controls | ✅ Implemented | `sql/controls/` |
| Scoring Engine | ✅ Implemented | `app/scoring_engine.py` |
| Governance / Release Gates | ✅ Implemented | `config.yaml`, `app/execution_engine.py` |
| Audit Export | ✅ Implemented | `app/audit_export.py` |
| Database Schema | ✅ Production-ready | `sql/schema/` |
| Docker Deployment | ✅ Ready | `Dockerfile`, `docker-compose.yml` |
| REST API | ✅ Built | `app/api/` |
| Discovery Service | ✅ Built | `app/services/dataset_discovery_service.py` |
| Rule Executor | ✅ Built | `app/rule_executor.py`, `app/rule_factory.py` |
| Web Dashboard | 🔄 In Development | `dashboard/` |
| AI Mapping Engine | 🔄 Planned | `app/mapping_engine/` |
| Multi-tenant SaaS | 🔄 Planned | Future phase |

---

## 10. Technology Stack

| Layer | Technology |
|-------|-----------|
| **Language** | Python 3.11 |
| **API Framework** | FastAPI, Uvicorn |
| **Database** | PostgreSQL 15+ |
| **Containerisation** | Docker, Docker Compose |
| **Configuration** | YAML + Environment Variables |
| **Validation** | SQL-driven control templates |
| **Reporting** | CSV export (future: interactive dashboards) |
| **Security** | python-jose, cryptography |
| **Testing** | pytest |

---

## 11. Scalability

The architecture supports horizontal scaling through:

- **Stateless API** — FastAPI instances can be scaled horizontally
- **Independent engine scaling** — Each engine can scale independently
- **Database connections** — Connection pooling via PostgreSQL
- **Container orchestration** — Kubernetes-ready (Docker images)
- **Async processing** — Future: background task queues for large batches

---

## 12. Future Architecture Evolution

```
Current:                 Future:
┌──────────┐            ┌──────────┐
│ CLI +    │            │ Web UI   │
│ API      │            │ + API    │
├──────────┤            ├──────────┤
│ Platform │            │ Platform │
│ Core     │            │ Core     │
├──────────┤            ├──────────┤
│ Validation│           │ Discovery│
│ Controls  │           │ Mapping  │
│           │           │ Validation│
│           │           │ Scoring  │
│           │           │ AI       │
│           │           │ Governance│
└──────────┘            └──────────┘
```

The modular Platform Core architecture ensures that new engines can be added without architectural redesign. The AI Intelligence Layer (Azure OpenAI) can be integrated as an additional engine providing mapping recommendations, anomaly detection, and natural language querying.