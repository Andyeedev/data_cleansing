# Backend Gap Analysis: Capabilities with NO Frontend Representation

> **Purpose**: Identifies Python engine capabilities that are fully implemented in the backend but have zero or insufficient frontend exposure, creating a functional visibility gap.
>
> **Last Updated**: 2026-07-14
>
> **Status**: Active — gaps require frontend integration work

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total Gaps Identified | 10 |
| HIGH Frontend Need | 5 |
| MEDIUM Frontend Need | 3 |
| LOW Frontend Need | 2 |
| Endpoints Needed | 12+ new REST endpoints |
| Frontend Pages Needed | 5 new views |

---

## Gap 1: Dataset Discovery

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Dataset Discovery — Automatically discovers tables, columns, data types from source/target databases |
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.services.dataset_discovery_service` |
| **Database Tables** | `core.dataset_mappings`, `core.dataset_columns`, `core.rule_dataset_mapping` |
| **API Status** | No dedicated endpoint — CLI only: `python -m app.main discover` |
| **Frontend Need** | **HIGH** |
| **Recommended Action** | Create `/api/v1/discovery` endpoints + Frontend Discovery page |

### What It Does

The discovery module connects to source and target databases, introspects schemas, and automatically populates `core.dataset_mappings` and `core.dataset_columns` with discovered table and column metadata including data types, nullability, and cardinality. It eliminates manual table/column registration.

### Gap Impact

- Users cannot trigger discovery from the UI
- Discovery results are invisible without querying the database directly
- No review/approval workflow for auto-discovered schemas
- Column-level mapping suggestions are hidden

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/discovery/trigger` | POST | Trigger a new discovery run |
| `/api/v1/discovery/status` | GET | Get discovery job status |
| `/api/v1/discovery/results` | GET | List discovered datasets |
| `/api/v1/discovery/results/{id}/columns` | GET | List columns for a discovered dataset |
| `/api/v1/discovery/approve` | POST | Approve/reject discovered mappings |

---

## Gap 2: Column Mappings

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Column Mappings — Discovers and maps individual columns between source/target tables |
| **Python Module** | `app.services.dataset_discovery_service._fetch_columns()` |
| **Database Tables** | `core.dataset_columns`, `core.column_mappings` |
| **API Status** | No dedicated endpoint |
| **Frontend Need** | **HIGH** |
| **Recommended Action** | Create `/api/v1/column-mappings` endpoints + Frontend column mapping editor |

### What It Does

Discovers columns at the source and target for each mapped dataset, infers likely column matches based on name similarity, data type compatibility, and positional ordering. Populates `core.column_mappings` with source_column_id → target_column_id relationships.

### Gap Impact

- Users cannot view or edit column-level mappings in the UI
- Data type mismatches between source/target are not visible
- Manual column mapping override is impossible without direct DB access
- Critical for validation rule configuration

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/column-mappings` | GET | List all column mappings |
| `/api/v1/column-mappings/{id}` | GET | Get single column mapping detail |
| `/api/v1/column-mappings` | POST | Create a column mapping |
| `/api/v1/column-mappings/{id}` | PUT | Update a column mapping |
| `/api/v1/column-mappings/{id}` | DELETE | Delete a column mapping |
| `/api/v1/column-mappings/auto-suggest` | POST | Get auto-suggested mappings for a dataset pair |

---

## Gap 3: Rule Discovery

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Rule Discovery — Automatically infers validation rules based on column roles (PK, FK, numeric, date) |
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.rule_factory` |
| **Database Tables** | `engine.rule_registry`, `core.rule_dataset_mapping` |
| **API Status** | No dedicated endpoint |
| **Frontend Need** | **MEDIUM** |
| **Recommended Action** | Create `/api/v1/rules/discovery` endpoints + Frontend rule review page |

### What It Does

Analyzes column metadata (data types, nullability, constraints, naming patterns) to automatically generate validation rules. For example, PK columns get uniqueness checks, FK columns get referential integrity checks, numeric columns get range validations, date columns get format and range checks.

### Gap Impact

- Users cannot see which rules were auto-discovered vs manually created
- No approval workflow for auto-generated rules
- Rule confidence scores are invisible
- Users miss potentially valuable validation rules

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/rules/discovery/preview` | POST | Preview auto-discovered rules for a dataset |
| `/api/v1/rules/discovery/apply` | POST | Apply selected discovered rules |
| `/api/v1/rules/discovery/history` | GET | History of rule discovery runs |

---

## Gap 4: Control Discovery

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Control Discovery — Fetches enabled controls from DB, dispatches to control classes |
| **Python Module** | `app.execution_engine._get_controls()`, `app.execution.control_executor` |
| **Database Tables** | `engine.control_registry` |
| **API Status** | No dedicated endpoint |
| **Frontend Need** | **MEDIUM** |
| **Recommended Action** | Create `/api/v1/controls` endpoints + Frontend controls page |

### What It Does

Reads enabled controls from `engine.control_registry`, instantiates the corresponding control class, and executes it as part of the migration governance pipeline. Controls enforce pre-migration, mid-migration, and post-migration gates.

### Gap Impact

- Users cannot see which controls are active per project
- Control enable/disable is not exposed in the UI
- Control execution results are not visible
- No governance gate visibility

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/controls` | GET | List all controls |
| `/api/v1/controls/{id}` | GET | Get control detail |
| `/api/v1/controls/{id}/toggle` | PUT | Enable/disable a control |
| `/api/v1/controls/{id}/results` | GET | Get control execution results |

---

## Gap 5: Governance Decisions

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Governance Decisions — Computes governance decisions post-execution, risk scoring, release gates |
| **Python Module** | `app.governance.decision_engine`, `app.governance.risk_scoring` |
| **Database Tables** | `engine.migration_governance_status`, `engine.migration_control_decisions`, `engine.migration_risk_scores`, `engine.migration_release_decision` |
| **API Status** | No dedicated endpoint |
| **Frontend Need** | **HIGH** |
| **Recommended Action** | Create `/api/v1/governance` endpoints + Frontend governance portal |

### What It Does

After execution completes, the governance engine evaluates all control results, computes risk scores per dataset and overall migration, makes pass/fail/release decisions, and records the complete governance audit trail. Includes release gate logic that blocks migration if critical controls fail.

### Gap Impact

- Governance decisions are completely invisible to users
- Release gate status cannot be viewed or acted upon
- Risk scores are not displayed
- Approve/reject workflow does not exist in UI
- Compliance teams cannot audit governance from the application

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/governance/decisions` | GET | List governance decisions |
| `/api/v1/governance/decisions/{id}` | GET | Get governance decision detail |
| `/api/v1/governance/risk-scores` | GET | Get risk scores |
| `/api/v1/governance/release-decision` | GET | Get release decision status |
| `/api/v1/governance/release-decision/approve` | POST | Approve release |
| `/api/v1/governance/release-decision/reject` | POST | Reject release |

---

## Gap 6: Reporting (SQL Views)

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Reporting — 6+ SQL views for batch summary, executive summary, exception details, governance report |
| **Python Module** | `app.audit_export`, `app.scoring_engine` |
| **Database Views** | `engine.v_migration_control_summary`, `engine.v_migration_executive_summary`, `engine.v_migration_exception_detail`, `engine.v_migration_governance_report`, plus additional views |
| **API Status** | No endpoint — designed for BI tools |
| **Frontend Need** | **HIGH** |
| **Recommended Action** | Create `/api/v1/reports` endpoints + Wire frontend Reports portal |

### What It Does

Provides pre-built SQL views that aggregate execution results into executive summaries, control summaries, exception details, and governance reports. Currently designed to be consumed by external BI tools like Power BI or Tableau.

### Gap Impact

- Frontend Reports portal exists but has no data source
- Users cannot view executive summaries in-app
- Exception details require direct database queries
- Governance reports are not accessible from the UI
- Duplicated effort if BI tools and frontend both query the same views

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/reports/executive-summary` | GET | Executive summary data |
| `/api/v1/reports/control-summary` | GET | Control summary data |
| `/api/v1/reports/exception-detail` | GET | Exception detail data |
| `/api/v1/reports/governance-report` | GET | Governance report data |
| `/api/v1/reports/batch-summary` | GET | Batch execution summary |
| `/api/v1/reports/export` | GET | Export report as PDF/CSV |

---

## Gap 7: Audit Trail (File-based)

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Audit Trail — Logs every API call to `exports/audit.log` |
| **Python Module** | `app.api.core.middleware.audit_middleware` |
| **Database Tables** | `audit.audit_events` (exists but not exposed) |
| **API Status** | No endpoint |
| **Frontend Need** | **MEDIUM** |
| **Recommended Action** | Create `/api/v1/audit` endpoints that read from `audit.audit_events` table |

### What It Does

Middleware intercepts every API request and response, logging the method, path, status code, user, timestamp, and payload size to both a file (`exports/audit.log`) and the `audit.audit_events` database table.

### Gap Impact

- Security > Audit Logs page exists but shows no data
- Compliance teams cannot review API access from the UI
- No ability to search/filter audit events
- Security incident investigation requires log file access

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/audit/events` | GET | List audit events (paginated, filterable) |
| `/api/v1/audit/events/{id}` | GET | Get audit event detail |
| `/api/v1/audit/events/export` | GET | Export audit events as CSV |

---

## Gap 8: Scheduling (In-memory DAG)

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Scheduling — Config-driven DAG scheduling via `config.yaml` |
| **Python Module** | `app.execution_engine` (inline DAG) |
| **Database Tables** | None (in-memory only) |
| **API Status** | No endpoint |
| **Frontend Need** | **LOW** |
| **Recommended Action** | Future enhancement — create `/api/v1/schedules` endpoint |

### What It Does

Builds an in-memory DAG of validation rules based on config.yaml dependencies, executing them in topological order. Supports conditional execution and parallel branches.

### Gap Impact

- Scheduling is config-driven, not user-facing
- DAG visualization would be a nice-to-have
- Dependency chains are invisible

### Recommended Future Work

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/schedules/dag` | GET | Get DAG structure for visualization |
| `/api/v1/schedules` | GET | List scheduled execution plans |

---

## Gap 9: Retry Engine (In-memory)

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Retry Engine — Retries failed rules automatically |
| **Python Module** | `app.orchestration.retry.rule_retry_manager` |
| **Database Tables** | None (in-memory, updates existing rule status) |
| **API Status** | No endpoint |
| **Frontend Need** | **LOW** |
| **Recommended Action** | Expose retry status via `/api/v1/execution/status` |

### What It Does

When a rule execution fails, the retry manager automatically re-queues and re-executes the rule up to a configurable maximum retry count with configurable backoff.

### Gap Impact

- Retry status is not visible to users
- Users cannot manually trigger a retry
- Retry history is not recorded

### Recommended Enhancement

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/execution/{id}/retry` | POST | Manually retry a failed rule |
| `/api/v1/execution/{id}/retry-status` | GET | Get retry status for a rule |

---

## Gap 10: Checkpointing

| Attribute | Detail |
|-----------|--------|
| **Backend Capability** | Checkpointing — Saves execution state for resume |
| **Python Module** | `app.execution_engine._save_checkpoint()`, `app.execution_engine._load_checkpoint()` |
| **Database Tables** | `engine.batch_execution_checkpoint` |
| **API Status** | No endpoint |
| **Frontend Need** | **LOW** |
| **Recommended Action** | Expose checkpoint status via `/api/v1/execution/status` |

### What It Does

During long-running batch executions, periodically saves the current execution state (completed rules, failed rules, pending rules) so that if the process is interrupted, it can resume from the last checkpoint rather than restarting.

### Gap Impact

- Resume capability is invisible to users
- Checkpoint timestamps are not shown
- Users cannot trigger a resume from the UI

### Recommended Enhancement

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/execution/checkpoints` | GET | List checkpoints for a batch |
| `/api/v1/execution/resume` | POST | Resume from a specific checkpoint |

---

## Priority Matrix

| Priority | Gap | Frontend Need | Effort | Impact |
|----------|-----|---------------|--------|--------|
| P1 | Governance Decisions | HIGH | High | Unlocks release gate workflow |
| P1 | Reporting (SQL Views) | HIGH | Medium | Powers Reports portal |
| P1 | Dataset Discovery | HIGH | High | Enables discovery workflow |
| P2 | Column Mappings | HIGH | High | Enables mapping editor |
| P2 | Audit Trail | MEDIUM | Low | Powers Security > Audit Logs |
| P2 | Control Discovery | MEDIUM | Low | Powers Controls page |
| P2 | Rule Discovery | MEDIUM | Medium | Enables rule review |
| P3 | Scheduling | LOW | Medium | Nice-to-have DAG visualization |
| P3 | Retry Engine | LOW | Low | Enhances execution visibility |
| P3 | Checkpointing | LOW | Low | Enhances execution visibility |

---

## Implementation Roadmap

### Phase 1: Core Visibility (Weeks 1-3)

- [ ] `/api/v1/reports/*` — Wire Reports portal to SQL views
- [ ] `/api/v1/governance/*` — Create governance portal endpoints
- [ ] `/api/v1/audit/*` — Power Audit Logs page from `audit.audit_events`

### Phase 2: Discovery Workflow (Weeks 4-6)

- [ ] `/api/v1/discovery/*` — Dataset discovery trigger and results
- [ ] `/api/v1/column-mappings/*` — Column mapping editor
- [ ] `/api/v1/rules/discovery/*` — Rule discovery preview and apply

### Phase 3: Operational Visibility (Weeks 7-8)

- [ ] `/api/v1/controls/*` — Control management
- [ ] `/api/v1/execution/status` — Unified execution status (retries + checkpoints)

### Phase 4: Future Enhancements (Backlog)

- [ ] `/api/v1/schedules/*` — DAG visualization
- [ ] `/api/v1/execution/checkpoints` — Checkpoint management

---

## Cross-Reference: Backend Module → Frontend Gap

| Backend Module | Frontend Gap | Database Objects |
|----------------|--------------|------------------|
| `app.discovery.auto_rule_discovery` | No discovery page | `core.dataset_mappings`, `core.dataset_columns` |
| `app.services.dataset_discovery_service` | No column mapping UI | `core.column_mappings` |
| `app.rule_factory` | No rule review page | `engine.rule_registry` |
| `app.execution_engine._get_controls()` | No controls page | `engine.control_registry` |
| `app.governance.decision_engine` | No governance portal | `engine.migration_governance_status`, `engine.migration_release_decision` |
| `app.governance.risk_scoring` | No risk score display | `engine.migration_risk_scores` |
| `app.audit_export` | Reports portal empty | `engine.v_migration_*` views |
| `app.scoring_engine` | Reports portal empty | `engine.v_migration_executive_summary` |
| `app.api.core.middleware.audit_middleware` | Audit Logs page empty | `audit.audit_events` |
| `app.orchestration.retry.rule_retry_manager` | No retry visibility | None (in-memory) |
| `app.execution_engine._save_checkpoint()` | No checkpoint visibility | `engine.batch_execution_checkpoint` |

---

## Summary

The backend engine has 10 significant capabilities with no frontend representation. The highest-impact gaps are **Governance Decisions**, **Reporting**, and **Dataset Discovery** — all rated HIGH need and critical to user workflows. Addressing the Phase 1 items alone would close the most visible gaps and enable the Reports portal and Governance portal to become functional.
