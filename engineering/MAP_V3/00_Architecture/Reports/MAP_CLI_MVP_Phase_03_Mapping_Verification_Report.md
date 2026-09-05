# MAP CLI MVP — Phase 3: Mapping Verification Report

**Phase:** 3 — Verify Capability Mapping
**Date:** 2026-07-20
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** engineering/MAP_V2/00_Architecture/ (all architecture documents)

---

## 1. Goal

Verify every capability has complete mappings:

```
Policy → CLI Command → Metadata → Database → Runtime Generation → Frontend Consumer
```

Per the execution plan: "Do not implement, infer, or resolve missing mappings during this phase."

---

## 2. Mapping Methodology

For each of the 34 capabilities, 6 layers were verified:

| Layer | Source | Verification Method |
|-------|--------|-------------------|
| **Policy** | Doc 16 + supporting architecture docs | Confirmed in Phase 2 |
| **CLI Command** | `app/` implementation | Confirmed in Phase 2 |
| **Metadata** | Metadata contract definition | Searched architecture docs + codebase |
| **Database** | Schema scripts, seed data, live DB | Verified table existence |
| **Runtime Generation** | Engine output / API response | Verified data flow |
| **Frontend Consumer** | `frontend/src/` API calls | Verified real vs mocked calls |

### Legend

- ✅ Present and connected
- ⚠️ Present but incomplete / disconnected
- ❌ Missing
- 🔗 Dead code exists (service defined but never called)

---

## 3. Full Mapping Matrix

### DOMAIN 1: MIGRATION MANAGEMENT

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 1.1 | Project Management | ✅ Doc 16 §4.1 | ⚠️ batch-level only | ❌ No contract found | ✅ `core.projects`, `core.tenants` | ⚠️ No project CRUD API | ❌ Hardcoded | **BROKEN** at Metadata, Runtime, Frontend |
| 1.2 | Connection Management | ✅ Doc 16 §4.1 | ✅ connection_resolver | ❌ No contract found | ✅ `core.system_registry` | ✅ `/api/v1/systems/`, `/api/v1/credentials/` | ❌ Hardcoded | **BROKEN** at Metadata, Frontend |
| 1.3 | Dataset Discovery | ✅ Doc 16 §4.1 | ✅ CLI `discover` | ❌ No contract found | ✅ `core.datasets`, `core.dataset_columns` | ⚠️ No API (CLI only) | ❌ Hardcoded | **BROKEN** at Metadata, Runtime, Frontend |
| 1.4 | Dataset Mapping | ✅ Doc 16 §4.1 | ✅ auto-created | ❌ No contract found | ✅ `core.dataset_mappings` | ⚠️ No API (auto only) | ❌ Hardcoded | **BROKEN** at Metadata, Runtime, Frontend |
| 1.5 | Column Mapping | ✅ Doc 16 §4.1 | ✅ auto-created | ❌ No contract found | ✅ `core.column_mappings` | ⚠️ No API (auto only) | ❌ Hardcoded | **BROKEN** at Metadata, Runtime, Frontend |

### DOMAIN 2: VALIDATION MANAGEMENT

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 2.1 | Rule Discovery | ✅ Doc 16 §4.2 | ✅ auto_rule_discovery | ❌ No contract found | ✅ `engine.rule_registry`, `core.rule_dataset_mapping` | ⚠️ Internal only | 🔗 Dead code | **BROKEN** at Metadata, Frontend |
| 2.2 | Control Discovery | ✅ Doc 16 §4.2 | ✅ execution_engine Step 4 | ❌ No contract found | ✅ `engine.control_registry` | ⚠️ Internal only | ❌ Placeholder | **BROKEN** at Metadata, Frontend |
| 2.3 | Validation Execution | ✅ Doc 16 §4.2 | ✅ 6-step pipeline | ❌ No contract found | ✅ `engine.migration_validation_batch`, `engine.migration_control_execution` | ✅ `/api/v1/execution/run` | ❌ Hardcoded | **BROKEN** at Metadata, Frontend |
| 2.4 | Checkpointing | ✅ Doc 16 §4.2 | ✅ checkpoint/resume | ❌ No contract found | ⚠️ `engine.batch_execution_checkpoint` EXISTS (no DDL in VCS) | ⚠️ Internal only | ❌ Not implemented | **BROKEN** at Metadata, Runtime, Frontend |
| 2.5 | Retry Engine | ✅ Doc 16 §4.2 | ✅ rule_retry_manager | ❌ No contract found | ⚠️ No dedicated table | ⚠️ Internal only | ❌ Hardcoded | **BROKEN** at Metadata, Frontend |

### DOMAIN 3: GOVERNANCE & COMPLIANCE

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 3.1 | Governance Decisions | ✅ Doc 16 §4.3 | ✅ decision_engine | ❌ No contract found | ✅ `engine.migration_control_decisions`, `engine.migration_governance_status` EXISTS (no DDL in VCS) | ⚠️ Internal only | 🔗 Dead code | **BROKEN** at Metadata, Runtime, Frontend |
| 3.2 | Risk Scoring | ✅ Doc 16 §4.3 | ✅ scoring_engine, risk_scoring | ❌ No contract found | ✅ `engine.migration_risk_scores`, `engine.batch_anomaly_analysis` | ⚠️ Internal only | 🔗 Dead code | **BROKEN** at Metadata, Frontend |
| 3.3 | Release Gates | ✅ Doc 16 §4.3 | ✅ release gate enforcement | ❌ No contract found | ✅ `engine.migration_release_decision` | ⚠️ Internal only | ❌ Not implemented | **BROKEN** at Metadata, Runtime, Frontend |
| 3.4 | Approvals | ✅ Doc 16 §4.3 | ❌ No CLI command | ❌ No contract found | ✅ `platform.approval_templates`, `platform.approval_requests` | ✅ `/api/v1/approvals/` | ⚠️ Wrong endpoint | **BROKEN** at CLI, Metadata, Frontend (partial) |

### DOMAIN 4: REPORTING & ANALYTICS

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 4.1 | Executive Reporting | ✅ Doc 16 §4.4 | ⚠️ SQL views only | ❌ No contract found | ✅ `reporting.v_batch_governance_intelligence`, `reporting.v_fact_batch` | ❌ No API | 🔗 Dead code | **BROKEN** at CLI (no API), Metadata, Runtime, Frontend |
| 4.2 | Operational Reporting | ✅ Doc 16 §4.4 | ⚠️ SQL views only | ❌ No contract found | ✅ `reporting.v_fact_control` | ❌ No API | 🔗 Dead code | **BROKEN** at CLI (no API), Metadata, Runtime, Frontend |
| 4.3 | Governance Reporting | ✅ Doc 16 §4.4 | ⚠️ SQL views only | ❌ No contract found | ⚠️ Partial views | ❌ No API | 🔗 Dead code | **BROKEN** at CLI (no API), Metadata, Runtime, Frontend |
| 4.4 | Technical Reporting | ✅ Doc 16 §4.4 | ⚠️ SQL views only | ❌ No contract found | ⚠️ Partial views | ❌ No API | 🔗 Dead code | **BROKEN** at CLI (no API), Metadata, Runtime, Frontend |
| 4.5 | Dashboard Services | ✅ Doc 16 §4.4 | ⚠️ SQL views only | ❌ No contract found | ⚠️ `reporting.dashboards` NOT CREATED | ❌ No API | ❌ All mocked | **BROKEN** at CLI (no API), Metadata, Database, Runtime, Frontend |
| 4.6 | Export Services | ✅ Doc 16 §4.4 | ✅ CLI `export` (CSV) | ❌ No contract found | ⚠️ `reporting.export_history` NOT CREATED | ⚠️ CLI only | ❌ Not implemented | **BROKEN** at Metadata, Database, Runtime, Frontend |

### DOMAIN 5: PLATFORM SERVICES

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 5.1 | Workflow Management | ✅ Doc 16 §4.5 | ❌ No CLI command | ❌ No contract found | ✅ `platform.workflow_definitions`, `platform.workflow_instances` | ✅ `/api/v1/workflows/` | ✅ **REAL** `useWorkflows.ts` | **BROKEN** at CLI, Metadata |
| 5.2 | Task Management | ✅ Doc 16 §4.5 | ❌ No CLI command | ❌ No contract found | ✅ `platform.tasks`, `platform.task_comments` | ✅ `/api/v1/tasks/` | ✅ **REAL** `useTasks.ts` | **BROKEN** at CLI, Metadata |
| 5.3 | Notification Services | ✅ Doc 16 §4.5 | ❌ No CLI command | ❌ No contract found | ✅ `platform.notifications`, `platform.notification_preferences` | ✅ `/api/v1/notifications/` | ✅ **REAL** `useNotifications.ts` | **BROKEN** at CLI, Metadata |
| 5.4 | Calendar Services | ✅ Doc 16 §4.5 | ❌ No CLI command | ❌ No contract found | ✅ `platform.calendar_events` | ✅ `/api/v1/calendar/events` | ✅ **REAL** `useCalendar.ts` | **BROKEN** at CLI, Metadata |
| 5.5 | AI / MAP Copilot | ✅ Doc 16 §4.5, Doc 06 | ❌ No implementation | ❌ No contract found | ❌ No tables | ❌ No API | ❌ Client-side only | **BROKEN** at all layers except Policy |
| 5.6 | Authentication | ✅ Doc 16 §4.5 | ❌ No CLI command | ❌ No contract found | ✅ `platform.users`, `platform.refresh_tokens` | ✅ `/api/v1/auth/login` | ✅ **REAL** login call | **BROKEN** at CLI, Metadata |

### DOMAIN 6: ADMINISTRATION

| # | Capability | Policy | CLI | Metadata | Database | Runtime | Frontend | Chain Status |
|---|-----------|--------|-----|----------|----------|---------|----------|-------------|
| 6.1 | User Management | ✅ Doc 16 §4.6 | ❌ No CLI command | ❌ No contract found | ✅ `platform.users`, `platform.user_roles` | ✅ `/api/v1/users/` | 🔗 Dead code | **BROKEN** at CLI, Metadata, Frontend |
| 6.2 | Role & Permission Mgmt | ✅ Doc 16 §4.6 | ❌ No CLI command | ❌ No contract found | ✅ `platform.roles`, `platform.permissions` | ✅ `/api/v1/roles/` | 🔗 Dead code | **BROKEN** at CLI, Metadata, Frontend |
| 6.3 | Tenant Management | ✅ Doc 16 §4.6 | ❌ No implementation | ❌ No contract found | ✅ `core.tenants` | ❌ No API | ❌ Hardcoded | **BROKEN** at CLI, Metadata, Runtime, Frontend |
| 6.4 | System Settings | ✅ Doc 16 §4.6 | ❌ No CLI command | ❌ No contract found | ✅ `platform.system_settings` | ✅ `/api/v1/settings/` | 🔗 Dead code | **BROKEN** at CLI, Metadata, Frontend |
| 6.5 | Feature Flags | ✅ Doc 16 §4.6 | ❌ No CLI command | ❌ No contract found | ✅ `platform.feature_flags` | ✅ `/api/v1/settings/flags/` | ❌ Hardcoded | **BROKEN** at CLI, Metadata, Frontend |
| 6.6 | Security Management | ✅ Doc 16 §4.6 | ⚠️ Fernet encryption only | ❌ No contract found | ❌ No dedicated tables | ❌ No API | ❌ Hardcoded | **BROKEN** at CLI (partial), Metadata, Database, Runtime, Frontend |
| 6.7 | Audit Trail | ✅ Doc 16 §4.6 | ⚠️ Middleware logging only | ❌ No contract found | ✅ `audit.audit_events`, `audit.security_events` | ⚠️ Middleware only | 🔗 Dead code | **BROKEN** at CLI (no API), Metadata, Runtime, Frontend |
| 6.8 | Maintenance & Health | ✅ Doc 16 §4.6 | ⚠️ Health endpoints only | ❌ No contract found | ❌ No tables | ✅ `/health`, `/api/v1/ready` | ❌ Hardcoded | **BROKEN** at CLI (no CLI), Metadata, Database, Frontend |

---

## 4. Mapping Summary

### 4.1 Chain Status Counts

| Status | Count | Capabilities |
|--------|-------|-------------|
| **COMPLETE** (all 6 layers connected) | **0** | — |
| **4/6 layers** | **7** | 1.2, 2.3, 5.1, 5.2, 5.3, 5.4, 5.6 |
| **3/6 layers** | **13** | 1.3, 1.4, 1.5, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.4, 6.5 |
| **2/6 layers** | **9** | 1.1, 2.4, 2.5, 4.1, 4.2, 4.6, 6.3, 6.7, 6.8 |
| **1/6 layers** | **5** | 4.3, 4.4, 4.5, 5.5, 6.6 |
| **0/6 layers** | **0** | — |
| **Total** | **34** | — |

### 4.2 Per-Layer Gap Counts

| Layer | Missing | Partial | Present | Gap (Missing + Partial) |
|-------|---------|---------|---------|------------------------|
| **Policy** | 0 | 0 | 34 | 0 / 34 |
| **CLI** | 14 | 8 | 12 | 22 / 34 |
| **Metadata** | 34 | 0 | 0 | 34 / 34 |
| **Database** | 2 | 8 | 24 | 10 / 34 |
| **Runtime** | 8 | 14 | 12 | 22 / 34 |
| **Frontend** | 17 | 1 | 16 | 18 / 34 |

### 4.3 Layer-by-Layer Analysis

**Metadata: No contract found after traversing the approved architecture**

No approved metadata contract was found after searching all architecture documents under `engineering/MAP_V2/00_Architecture/`. This is Policy Gap PG-1 from Phase 2.

The execution plan states:

> "Phase 4 shall not begin until the metadata contract, CLI capability mapping, and any Policy Gap Report have been explicitly approved."

> "Navigation must be driven only by an approved metadata contract that has been verified and accepted through the Phase 3.5 approval gate."

**CLI: 22 of 34 capabilities have no CLI implementation or have partial CLI**

14 capabilities have no CLI implementation at all. 8 capabilities have partial CLI (internal engine logic but no user-facing CLI command).

**Runtime: 22 of 34 capabilities have no API or have partial runtime**

8 capabilities have no API endpoint at all. 14 have internal engine logic but no exposed API.

**Frontend: 18 of 34 capabilities are hardcoded, missing, or dead code**

17 capabilities are hardcoded or missing. 1 capability has a wrong endpoint. 11 capabilities have dead code (service files exist but are never called). 5 capabilities have real API calls that are connected.

**Database: 10 of 34 capabilities have no tables or have partial database support**

2 planned tables not created: `reporting.dashboards` and `reporting.export_history` (from Doc 05, Doc 07).

3 tables exist in the live database with real data but have no CREATE TABLE DDL in version control: `engine.batch_execution_checkpoint`, `engine.migration_batch_registry`, `engine.migration_governance_status`. Additional partial support includes views existing but no API, or tables existing but code doesn't reference them.

---

## 5. Gap Analysis

### 5.1 Capabilities with No Complete Chain

Every capability fails at the Metadata layer. The most critical additional gaps:

| # | Capability | Critical Gap | Impact |
|---|-----------|-------------|--------|
| 5.5 | AI / MCPilot | No implementation at any layer except Policy | Entire AI subsystem has no implementation |
| 4.5 | Dashboard Services | No database tables, no API, all frontend mocked | Dashboard portal has no backing implementation |
| 6.6 | Security Management | No database, no API, no frontend | Security portal has no backing implementation |
| 2.4 | Checkpointing | No DDL in version control for `engine.batch_execution_checkpoint` | New environment deployments will fail |
| 3.1 | Governance Decisions | No DDL in version control for `engine.migration_governance_status` | New environment deployments will fail |
| 1.1 | Project Management | No project CRUD API | Cannot manage projects independently |

### 5.2 Dead Code Inventory

7 service files define real API calls but are never imported. Additionally, 6 of 7 have no matching backend routes:

| Service File | API Calls Defined | Backend Routes Exist? | Used By |
|-------------|------------------|----------------------|---------|
| `src/services/MigrationService.ts` | getJobs, getJob, startJob, stopJob, getJobStatus | ❌ No `/api/v1/migration/*` | **Nothing** |
| `src/services/ValidationService.ts` | getRules, getRule, createRule, updateRule, deleteRule, getResults, getQueue | ❌ No `/api/v1/validation/*` | **Nothing** |
| `src/services/GovernanceService.ts` | getPolicies, getCompliance, getAuditLog | ❌ No `/api/v1/governance/*` | **Nothing** |
| `src/services/ReportingService.ts` | getStandardReports, getCustomReports, getScheduledReports, generateReport | ❌ No `/api/v1/reports/*` | **Nothing** |
| `src/services/RiskService.ts` | getAssessment, getRegister, getMatrix | ❌ No `/api/v1/risk/*` | **Nothing** |
| `src/services/AIService.ts` | chat, getInsights, getPrompts | ❌ No `/api/v1/ai/*` | **Nothing** |
| `src/services/AdminService.ts` | getUsers, getUser, createUser, updateUser, deleteUser, getRoles, getSettings, updateSettings | ⚠️ Partial — `/users` CRUD works; `/admin/roles` and `/admin/settings` paths mismatch | **Nothing** |

### 5.3 Database Tables — DDL Not in Version Control

3 tables exist in the live database with real data, but have no CREATE TABLE statements in the codebase. They were created out-of-band (manually or via uncommitted scripts).

| Table | In Live DB? | DDL in VCS? | Referenced In |
|-------|-------------|-------------|---------------|
| `engine.batch_execution_checkpoint` | ✅ Yes (has data) | ❌ No | `execution_engine.py` L887, L905 |
| `engine.migration_batch_registry` | ✅ Yes (has data) | ❌ No | `execution_engine.py` L784, L1113; `audit_export.py` L60 |
| `engine.migration_governance_status` | ✅ Yes (has data) | ❌ No | `execution_engine.py` L865; `audit_export.py` L29 |

Additionally, 2 planned tables from architecture docs have not been created:

| Table | Planned In | Status |
|-------|-----------|--------|
| `reporting.dashboards` | Doc 05, Doc 07 | NOT CREATED |
| `reporting.export_history` | Doc 07 | NOT CREATED |

---

## 6. Policy Gaps Identified

The following gaps were identified during Phase 3 mapping verification. These are recorded for the architecture owner.

| # | Gap | Source | Finding |
|---|-----|--------|---------|
| PG-1 | Metadata contract | Phase 2, verified in Phase 3 | No approved metadata contract was found after traversing the approved architecture. 34 of 34 capabilities have no metadata contract. |
| PG-2 | Navigation sources | Phase 2, verified in Phase 3 | Multiple navigation implementations were identified. Phase 3 could not verify whether an approved canonical navigation contract exists within the approved architecture. This requires verification in Phase 3.5. |
| PG-3 | Reporting APIs | Phase 2 | No `/api/v1/reports/*` endpoints exist in the backend. |
| PG-4 | AI APIs | Phase 2 | No `/api/v1/ai/*` endpoints exist in the backend. |
| PG-5 | Tenant Management | Phase 2 | No `/api/v1/tenants/*` endpoints exist in the backend. |
| PG-6 | Security Management | Phase 2 | No dedicated security tables or API exist. |
| PG-7 | DDL not in VCS | Phase 3 | 3 runtime tables exist in live DB but have no CREATE TABLE DDL in version control. New environment deployments will fail. |
| PG-8 | Dead frontend services | Phase 3 | 7 frontend service files define API calls but are never imported. 6 of 7 have no matching backend routes. |

---

## 7. Phase 3 Gate

**Recommendation:** DO NOT PROCEED to Phase 4

**Findings:**
- 0 of 34 capabilities have complete 6-layer mapping
- 34 of 34 capabilities have no metadata contract found
- 14 of 34 capabilities have no CLI implementation
- 8 of 34 capabilities have no API endpoint
- 17 of 34 capabilities are hardcoded or missing in frontend
- 3 runtime tables exist in live DB but have no DDL in version control
- 7 frontend service files are dead code (6 have no backend routes; 1 has partial backend)
- 8 policy gaps identified (PG-1 and PG-2 are Phase 4 blockers per execution plan)

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
