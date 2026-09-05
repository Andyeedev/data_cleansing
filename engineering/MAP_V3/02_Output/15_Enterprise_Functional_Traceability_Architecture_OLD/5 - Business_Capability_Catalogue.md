# Business Capability Catalogue

> **Version:** 1.4 | **Generated:** 2026-07-14 | **Scope:** Full System (v1.4)

---

## Overview

This catalogue provides a comprehensive inventory of all business capabilities within the Migration Product, mapping each capability to its implementation modules, data ownership, API surface, and frontend presence.

**Legend:**

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented / available |
| ⚠️ | Partially implemented |
| ❌ | Not implemented / unavailable |
| N/A | Not applicable |

---

## Capability Index

| # | Capability | API Status | Frontend Status |
|---|-----------|------------|-----------------|
| 1 | Project Management | ⚠️ Partial | ⚠️ Partial |
| 2 | Connection Management | ✅ Full | ✅ Full |
| 3 | Dataset Discovery | ❌ None | ❌ None |
| 4 | Dataset Mappings | ❌ None | ⚠️ Partial |
| 5 | Column Mappings | ❌ None | ❌ None |
| 6 | Rule Discovery | ❌ None | ⚠️ Partial |
| 7 | Control Discovery | ❌ None | ❌ None |
| 8 | Validation Execution | ✅ Full | ✅ Full |
| 9 | Governance Decisions | ❌ None | ⚠️ Mock |
| 10 | Reporting | ❌ None | ⚠️ Mock |
| 11 | Audit Trail | ❌ None | ⚠️ Mock |
| 12 | Scheduling | ❌ None | ⚠️ Mock |
| 13 | Retry Engine | ❌ None | ⚠️ Mock |
| 14 | Checkpointing | ❌ None | ❌ None |

---

## Capability Details

---

### 1. Project Management

**Description:**
Manages the lifecycle of migration validation batches, including creation, tracking, and orchestration of batch-level operations across datasets.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.execution_engine` |
| **Service Layer** | `app/services/execution_service.py` |
| **Entry Point** | `ExecutionEngine.__init__()` |
| **Database Schema** | `core`, `engine` |
| **Tables** | `engine.migration_validation_batch`, `engine.migration_batch_registry`, `core.dataset_mappings` |
| **API Status** | ⚠️ Partial (execution endpoints only) |
| **Frontend Status** | ⚠️ Partial — Migration > Projects |
| **Integration Notes** | Batch lifecycle is tightly coupled to execution engine initialization. No dedicated project CRUD endpoint exists; batch records are created implicitly through execution triggers. Frontend rendering is limited to list view with basic status display. |

---

### 2. Connection Management

**Description:**
Provides secure creation, retrieval, updating, and deletion of system registry entries and database credentials, supporting multi-system connectivity for source/target environments.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.db.connection_resolver`, `app.services.system_service`, `app.services.credential_service` |
| **Repository Layer** | `app/db/repositories/system_repository.py`, `app/db/repositories/credential_repository.py` |
| **Database Schema** | `core` |
| **Tables** | `core.system_registry`, `core.system_credentials` |
| **API Status** | ✅ Full CRUD |
| **Frontend Status** | ✅ Full — Migration > Datasets, Security > Credentials |
| **Integration Notes** | Fully implemented across all layers. Credential encryption is handled at repository level. Connection validation occurs on creation and on demand. Frontend includes form-based creation, detail views, and delete confirmation workflows. |

---

### 3. Dataset Discovery

**Description:**
Automatically discovers and catalogues datasets from connected source systems, populating the dataset registry and column metadata through rule-based introspection.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.services.dataset_discovery_service` |
| **Database Schema** | `core`, `engine` |
| **Tables** | `core.dataset_mappings`, `core.dataset_columns`, `core.rule_dataset_mapping` |
| **API Status** | ❌ None (CLI/auto-triggered) |
| **Frontend Status** | ❌ None |
| **Integration Notes** | Discovery is initiated via CLI command or automatically during execution pipeline setup. No HTTP API endpoint exposes discovery operations. Results are persisted directly to core schema tables. Column metadata is extracted during discovery and stored as array properties on dataset_mappings. |

---

### 4. Dataset Mappings

**Description:**
Maintains the mapping resolution between source and target datasets, including rule-based dataset associations and mapping validation logic.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.services.mapping_resolver`, `app.services.mapping_validator` |
| **Database Schema** | `core` |
| **Tables** | `core.dataset_mappings`, `core.rule_dataset_mapping` |
| **API Status** | ❌ None (auto-created during discovery) |
| **Frontend Status** | ⚠️ Partial — Migration > Mappings |
| **Integration Notes** | Mappings are created implicitly during dataset discovery and are not directly manipulable via API. The frontend displays mapping status in a read-only view. Mapping resolution logic handles fuzzy matching and rule-based associations. No user-initiated mapping creation or editing workflow exists. |

---

### 5. Column Mappings

**Description:**
Manages column-level metadata and mapping relationships between source and target dataset columns, including type inference and array-based column storage.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.services.dataset_discovery_service._fetch_columns()` |
| **Database Schema** | `core` |
| **Tables** | `core.dataset_mappings` (arrays), `core.dataset_columns` |
| **API Status** | ❌ None |
| **Frontend Status** | ❌ None |
| **Integration Notes** | Column metadata is populated during dataset discovery via the `_fetch_columns()` internal method. Column mappings are stored as array properties on the parent dataset_mappings record and in the dedicated dataset_columns table. No dedicated API or UI exists for column-level mapping management. |

---

### 6. Rule Discovery

**Description:**
Automatically identifies and registers validation rules applicable to discovered datasets, leveraging rule templates and dataset metadata to populate the rule registry.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.rule_factory` |
| **Database Schema** | `engine`, `core` |
| **Tables** | `engine.rule_registry`, `core.dataset_columns`, `core.rule_dataset_mapping` |
| **API Status** | ❌ None (auto-triggered) |
| **Frontend Status** | ⚠️ Partial — Validation > Rules (read-only list) |
| **Integration Notes** | Rule discovery runs automatically after dataset discovery completes. The rule_factory instantiates rule objects from templates and persists them to the rule registry. Frontend displays discovered rules in a read-only catalogue but provides no creation, editing, or deletion capabilities. |

---

### 7. Control Discovery

**Description:**
Identifies and registers governance controls applicable to migration batches, linking control definitions to the execution engine's control registry.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.execution_engine`, `app.execution.control_executor` |
| **Database Schema** | `engine` |
| **Tables** | `engine.control_registry` |
| **API Status** | ❌ None |
| **Frontend Status** | ❌ None |
| **Integration Notes** | Control discovery is embedded within the execution engine initialization flow. Controls are loaded from the control_registry table and executed by the control_executor module. No dedicated API or frontend exists for control management. Control definitions are maintained via database seeding. |

---

### 8. Validation Execution

**Description:**
Orchestrates the end-to-end execution of validation rules and governance controls against migration batches, producing execution summaries, exception records, and batch-level status updates.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.execution_engine`, `app.rule_executor`, `app.execution.control_executor` |
| **Service Layer** | `app/services/execution_service.py` |
| **Database Schema** | `engine` |
| **Tables** | `engine.migration_validation_batch`, `engine.migration_batch_registry`, `engine.migration_control_summary`, `engine.migration_control_execution`, `engine.migration_control_exceptions`, `engine.migration_batch_summary` |
| **API Status** | ✅ Full (trigger + status polling) |
| **Frontend Status** | ✅ Full — Migration > Execution, Validation > Results |
| **Integration Notes** | Core execution pipeline with full API exposure. Supports batch trigger, status polling, and result retrieval. Frontend includes execution dashboard with real-time progress, control execution breakdown, and exception drill-down. Execution results flow into governance and reporting pipelines. |

---

### 9. Governance Decisions

**Description:**
Evaluates migration readiness through risk scoring, decision engine evaluation, and release readiness assessment, producing governance status records and release decisions.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.governance.decision_engine`, `app.governance.risk_scoring` |
| **Database Schema** | `engine` |
| **Tables** | `engine.migration_governance_status`, `engine.migration_control_decisions`, `engine.migration_risk_scores`, `engine.migration_release_decision`, `engine.governance_config` |
| **API Status** | ❌ None (auto-triggered post-execution) |
| **Frontend Status** | ⚠️ Mock — Governance (all mock data) |
| **Integration Notes** | Governance evaluation runs automatically after validation execution completes. The decision engine aggregates control outcomes and risk scores to produce release decisions. Frontend currently displays mock/synthetic data only; no live API integration exists. Governance config is stored in `engine.governance_config`. |

---

### 10. Reporting

**Description:**
Generates migration reports and audit exports through SQL views, scoring engine computations, and audit export modules.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.audit_export`, `app.scoring_engine` |
| **Database Schema** | `engine` |
| **Tables** | 6+ SQL views (pre-materialized) |
| **API Status** | ❌ None (SQL view-driven) |
| **Frontend Status** | ⚠️ Mock — Reports (all mock data) |
| **Integration Notes** | Reports are generated via database SQL views rather than application-level API endpoints. The scoring engine computes aggregate metrics. Frontend displays mock report data with no live data connection. Export functionality (PDF, CSV) is handled by the audit_export module. |

---

### 11. Audit Trail

**Description:**
Records all API request/response activity and system events through middleware-based audit logging to persistent file storage.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.api.core.middleware.audit_middleware` |
| **Database Schema** | N/A (file-based) |
| **Tables** | `exports/audit.log` |
| **API Status** | ❌ None (middleware-level) |
| **Frontend Status** | ⚠️ Mock — Governance > Audit Centre |
| **Integration Notes** | Audit logging is implemented as FastAPI middleware intercepting all requests and responses. Logs are written to `exports/audit.log` in structured format. No query API exists for audit log retrieval. Frontend Audit Centre displays mock data only. No log rotation or retention policy is configured. |

---

### 12. Scheduling

**Description:**
Provides time-based execution scheduling for migration batches through an in-memory DAG (Directed Acyclic Graph) engine driven by configuration.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.execution_engine` (inline DAG) |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | ❌ None (config-driven) |
| **Frontend Status** | ⚠️ Mock — Operations > Schedules |
| **Integration Notes** | Scheduling is implemented as an in-memory DAG within the execution engine, configured via application settings. No persistence layer exists; schedule state is lost on restart. Frontend displays mock schedule data. No cron expression support or calendar-based scheduling exists. |

---

### 13. Retry Engine

**Description:**
Manages automatic retry of failed validation rules through a configurable retry manager with backoff strategies, operating entirely in-memory.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.orchestration.retry.rule_retry_manager` |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | ❌ None (automatic) |
| **Frontend Status** | ⚠️ Mock — Operations > Retry Centre |
| **Integration Notes** | Retry logic is triggered automatically when rule execution fails. The retry manager applies configurable backoff strategies (exponential, linear). No retry state is persisted. Frontend displays mock retry queue data. Retry configuration is embedded in application settings with no external API for modification. |

---

### 14. Checkpointing

**Description:**
Provides execution state persistence and recovery through checkpoint save/load operations, enabling resumption of interrupted batch executions.

| Attribute | Value |
|-----------|-------|
| **Python Module** | `app.execution_engine._save_checkpoint()`, `_load_checkpoint()` |
| **Database Schema** | `engine` |
| **Tables** | `engine.batch_execution_checkpoint`, `engine.migration_batch_registry` |
| **API Status** | ❌ None (automatic) |
| **Frontend Status** | ❌ None |
| **Integration Notes** | Checkpoints are saved automatically at defined intervals during batch execution. Recovery is initiated on engine startup by scanning for incomplete batches in `migration_batch_registry` and loading the latest checkpoint from `batch_execution_checkpoint`. No API or frontend exposes checkpoint management. Checkpoint data includes execution state, progress counters, and partial results. |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Capabilities | 14 |
| Capabilities with API | 2 (Project Mgmt partial, Execution full) |
| Capabilities with Full Frontend | 2 (Connection Mgmt, Execution) |
| Capabilities with Mock Frontend | 4 (Governance, Reporting, Audit, Scheduling, Retry) |
| Capabilities with No Frontend | 5 (Discovery, Column Mappings, Control Discovery, Checkpointing, Column Mappings) |
| File-based / In-memory | 4 (Audit, Scheduling, Retry, Checkpointing partial) |
| Database-backed | 10 |

---

## Cross-Capability Dependencies

```
Project Management
  └──▶ Validation Execution
         ├──▶ Rule Discovery
         ├──▶ Control Discovery
         ├──▶ Governance Decisions
         │       └──▶ Reporting
         ├──▶ Checkpointing
         └──▶ Retry Engine

Connection Management
  └──▶ Dataset Discovery
         └──▶ Dataset Mappings
               └──▶ Column Mappings

Audit Trail (cross-cutting — middleware level)
Scheduling (config-driven — execution engine level)
```
