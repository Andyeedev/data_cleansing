# Backend Gap Analysis

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Scope:** Python engine capabilities with no frontend representation  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Engine Capabilities | 14 |
| With Frontend | 5 (36%) |
| Without Frontend | 9 (64%) |
| HIGH Priority | 3 |
| MEDIUM Priority | 4 |
| LOW Priority | 3 |

---

## 2. Gap Inventory

### 2.1 Dataset Discovery — HIGH

| Attribute | Value |
|-----------|-------|
| **Capability** | Automatically discovers tables, columns, data types from source/target databases |
| **Python Module** | `app.discovery.auto_rule_discovery`, `app.services.dataset_discovery_service` |
| **Service File** | `app/services/dataset_discovery_service.py` |
| **Entry Point** | `DatasetDiscoveryService.discover()` |
| **Database Schema** | core, engine |
| **Tables** | core.dataset_mappings, core.dataset_columns, core.rule_dataset_mapping |
| **API Status** | No dedicated endpoint (CLI only: `python -m app.main discover`) |
| **Frontend Need** | HIGH — Users need to see discovery results, trigger discovery, review auto-mapped columns |
| **Existing Frontend** | None |
| **Recommended Action** | Create /api/v1/discovery endpoints + Frontend discovery page in Migration portal |

**Required Endpoints:**
- `POST /api/v1/discovery/run` — Trigger discovery for a project
- `GET /api/v1/discovery/status/{discovery_id}` — Check discovery progress
- `GET /api/v1/discovery/results/{project_id}` — Get discovered tables/columns
- `POST /api/v1/discovery/apply` — Apply discovered mappings

---

### 2.2 Column Mappings — MEDIUM

| Attribute | Value |
|-----------|-------|
| **Capability** | Maps individual source columns to target columns within a table mapping |
| **Python Module** | `app.services.dataset_discovery_service._fetch_columns()` |
| **Service File** | `app/services/dataset_discovery_service.py` |
| **Entry Point** | `DatasetDiscoveryService._fetch_columns()` |
| **Database Schema** | core |
| **Tables** | core.dataset_mappings (source_columns, target_columns as arrays), core.dataset_columns, core.column_mappings |
| **API Status** | No dedicated API |
| **Frontend Need** | MEDIUM — Users need to review/edit column-level mappings |
| **Existing Frontend** | None |
| **Recommended Action** | Create /api/v1/column-mappings endpoints + Frontend column mapping editor |

**Required Endpoints:**
- `GET /api/v1/column-mappings/{mapping_id}` — Get column mappings for a table mapping
- `PUT /api/v1/column-mappings/{mapping_id}` — Update column mappings
- `POST /api/v1/column-mappings/{mapping_id}/auto` — Auto-generate column mappings

---

### 2.3 Rule Discovery — MEDIUM

| Attribute | Value |
|-----------|-------|
| **Capability** | Automatically infers validation rules based on column roles |
| **Python Module** | `app.discovery.auto_rule_discovery` |
| **Service File** | `app/discovery/auto_rule_discovery.py` |
| **Entry Point** | `AutoRuleDiscovery.generate_rules()` |
| **Rule Classes** | C01-C010 (10 rule types) |
| **Database Schema** | engine, core |
| **Tables** | engine.rule_registry, core.dataset_columns, core.rule_dataset_mapping |
| **API Status** | No dedicated API (auto-discovered during execution) |
| **Frontend Need** | MEDIUM — Users need to see which rules were auto-discovered |
| **Existing Frontend** | Validation > Rules (partial — shows rules but not discovery) |
| **Recommended Action** | Create /api/v1/rules/discovery endpoints + Frontend rule review page |

**Required Endpoints:**
- `GET /api/v1/rules/discovery/{project_id}` — Get auto-discovered rules
- `POST /api/v1/rules/discovery/{project_id}/apply` — Apply discovered rules
- `GET /api/v1/rules/{rule_id}/preview` — Preview rule SQL

---

### 2.4 Control Discovery — MEDIUM

| Attribute | Value |
|-----------|-------|
| **Capability** | Fetches enabled controls from DB and dispatches to control classes |
| **Python Module** | `app.execution_engine._get_controls()`, `app.execution.control_executor` |
| **Control Framework** | `app/controls/base_control.py` (ABC), `app/controls/rule_adapter_control.py` |
| **Database Schema** | engine |
| **Tables** | engine.control_registry |
| **API Status** | No dedicated API |
| **Frontend Need** | MEDIUM — Users need to see active controls per project |
| **Existing Frontend** | Governance > Controls (mock) |
| **Recommended Action** | Create /api/v1/controls endpoints + Frontend controls page |

**Required Endpoints:**
- `GET /api/v1/controls/` — List all controls
- `GET /api/v1/controls/{control_id}` — Get control details
- `PUT /api/v1/controls/{control_id}/toggle` — Enable/disable control

---

### 2.5 Governance Decisions — HIGH

| Attribute | Value |
|-----------|-------|
| **Capability** | Computes governance decisions post-execution, risk scoring, release gates |
| **Python Module** | `app.governance.decision_engine`, `app.governance.risk_scoring` |
| **Service Files** | `app/governance/decision_engine.py`, `app/governance/risk_scoring.py` |
| **Entry Points** | `record_decision()`, `calculate_migration_risk()`, `ExecutionEngine._evaluate_governance()` |
| **Database Schema** | engine |
| **Tables** | engine.migration_governance_status, engine.migration_control_decisions, engine.migration_risk_scores, engine.migration_release_decision, engine.governance_config |
| **API Status** | No dedicated endpoint |
| **Frontend Need** | HIGH — Users need to see governance decisions, approve/reject releases |
| **Existing Frontend** | Governance portal (all mock) |
| **Recommended Action** | Create /api/v1/governance endpoints + Frontend governance portal |

**Required Endpoints:**
- `GET /api/v1/governance/decisions/{batch_id}` — Get governance decisions
- `GET /api/v1/governance/risk/{batch_id}` — Get risk scores
- `POST /api/v1/governance/release/{batch_id}/approve` — Approve release
- `POST /api/v1/governance/release/{batch_id}/reject` — Reject release
- `GET /api/v1/governance/config` — Get governance config
- `PUT /api/v1/governance/config` — Update governance config

---

### 2.6 Reporting (SQL Views) — HIGH

| Attribute | Value |
|-----------|-------|
| **Capability** | SQL views for batch summary, executive summary, exception details, governance report |
| **Python Module** | `app.audit_export`, `app.scoring_engine` |
| **Service Files** | `app/audit_export.py`, `app/scoring_engine.py` |
| **Database Schema** | engine, reporting |
| **SQL Views** | engine.v_migration_control_summary, engine.v_migration_executive_summary, engine.v_migration_exception_detail, engine.v_migration_governance_report, engine.v_migration_summary, engine.v_top_failures, engine.v_control_results, engine.v_migration_risk, engine.v_exception_summary, engine.v_governance_decisions |
| **API Status** | No endpoint (designed for BI tools) |
| **Frontend Need** | HIGH — Frontend Reports portal should consume these views |
| **Existing Frontend** | Reports portal (all mock) |
| **Recommended Action** | Create /api/v1/reports endpoints + Wire frontend Reports portal |

**Required Endpoints:**
- `GET /api/v1/reports/executive/{batch_id}` — Executive summary
- `GET /api/v1/reports/controls/{batch_id}` — Control summary
- `GET /api/v1/reports/exceptions/{batch_id}` — Exception details
- `GET /api/v1/reports/governance/{batch_id}` — Governance report
- `GET /api/v1/reports/risk/{batch_id}` — Risk report
- `GET /api/v1/reports/top-failures/{batch_id}` — Top failures

---

### 2.7 Audit Trail (File-based) — MEDIUM

| Attribute | Value |
|-----------|-------|
| **Capability** | Middleware-based API call logging and compliance event tracking |
| **Python Module** | `app.api.core.middleware.audit_middleware` |
| **Middleware** | `AuditLoggingMiddleware.dispatch()` |
| **Output Files** | exports/audit.log, exports/execution.log |
| **Database Schema** | audit (tables exist but not used by middleware) |
| **Tables** | audit.audit_events, audit.security_events, audit.api_call_log |
| **API Status** | No endpoint |
| **Frontend Need** | MEDIUM — Security > Audit Logs page should show real audit data |
| **Existing Frontend** | Security > Audit Logs (mock) |
| **Recommended Action** | Create /api/v1/audit endpoints that read from audit schema |

**Required Endpoints:**
- `GET /api/v1/audit/events` — List audit events
- `GET /api/v1/audit/events/{event_id}` — Get event details
- `GET /api/v1/audit/security` — List security events

---

### 2.8 Scheduling (In-memory DAG) — LOW

| Attribute | Value |
|-----------|-------|
| **Capability** | Config-driven DAG scheduling embedded in ExecutionEngine |
| **Python Module** | `app.execution_engine.ExecutionEngine` (inline DAG) |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | No endpoint (config-driven) |
| **Frontend Need** | LOW — Currently config-driven, not user-facing |
| **Existing Frontend** | Operations > Schedules (mock) |
| **Recommended Action** | Future enhancement — create /api/v1/schedules endpoint |

---

### 2.9 Retry Engine (In-memory) — LOW

| Attribute | Value |
|-----------|-------|
| **Capability** | Automatic retry of failed rules at multiple levels |
| **Python Module** | `app.orchestration.retry.rule_retry_manager` |
| **Database Schema** | N/A (in-memory) |
| **Tables** | None |
| **API Status** | No endpoint (automatic) |
| **Frontend Need** | LOW — Automatic, not user-facing |
| **Existing Frontend** | Operations > Retry Centre (mock) |
| **Recommended Action** | Expose retry status via /api/v1/execution/status |

---

### 2.10 Checkpointing — LOW

| Attribute | Value |
|-----------|-------|
| **Capability** | Saves execution state for resume after failure |
| **Python Module** | `app.execution_engine._save_checkpoint()` / `_load_checkpoint()` |
| **Database Schema** | engine |
| **Tables** | engine.batch_execution_checkpoint, engine.migration_batch_registry |
| **API Status** | No endpoint (automatic) |
| **Frontend Need** | LOW — Automatic, not user-facing |
| **Existing Frontend** | None |
| **Recommended Action** | Expose checkpoint status via /api/v1/execution/status |

---

## 3. Priority Matrix

| Priority | Capability | Frontend Pages Unlocked | Effort |
|----------|-----------|------------------------|--------|
| HIGH | Governance Decisions | 9 (Governance portal) | Medium |
| HIGH | Reporting (SQL Views) | 12 (Reports portal) | Low |
| HIGH | Dataset Discovery | 3 (Migration pages) | Medium |
| MEDIUM | Column Mappings | 2 (Migration pages) | Low |
| MEDIUM | Rule Discovery | 2 (Validation pages) | Low |
| MEDIUM | Control Discovery | 2 (Governance pages) | Low |
| MEDIUM | Audit Trail | 3 (Security pages) | Low |
| LOW | Scheduling | 3 (Operations pages) | High |
| LOW | Retry Engine | 1 (Operations page) | Low |
| LOW | Checkpointing | 0 | Low |

---

## 4. Required New Endpoints

| # | Endpoint | Method | Purpose | Priority |
|---|----------|--------|---------|----------|
| 1 | /api/v1/governance/decisions/{batch_id} | GET | Get governance decisions | HIGH |
| 2 | /api/v1/governance/risk/{batch_id} | GET | Get risk scores | HIGH |
| 3 | /api/v1/governance/release/{batch_id}/approve | POST | Approve release | HIGH |
| 4 | /api/v1/governance/release/{batch_id}/reject | POST | Reject release | HIGH |
| 5 | /api/v1/governance/config | GET/PUT | Governance config | HIGH |
| 6 | /api/v1/reports/executive/{batch_id} | GET | Executive summary | HIGH |
| 7 | /api/v1/reports/controls/{batch_id} | GET | Control summary | HIGH |
| 8 | /api/v1/reports/exceptions/{batch_id} | GET | Exception details | HIGH |
| 9 | /api/v1/reports/governance/{batch_id} | GET | Governance report | HIGH |
| 10 | /api/v1/discovery/run | POST | Trigger discovery | HIGH |
| 11 | /api/v1/discovery/results/{project_id} | GET | Discovery results | HIGH |
| 12 | /api/v1/column-mappings/{mapping_id} | GET/PUT | Column mappings | MEDIUM |
| 13 | /api/v1/rules/discovery/{project_id} | GET | Rule discovery | MEDIUM |
| 14 | /api/v1/controls/ | GET | List controls | MEDIUM |
| 15 | /api/v1/audit/events | GET | Audit events | MEDIUM |

---

*This analysis is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
