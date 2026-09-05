# Enterprise Functional Traceability Report

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Scope:** Full MAP Platform — Python Engine, React Frontend, PostgreSQL, FastAPI  

---

## 1. Executive Overview

This report documents the complete architectural discovery and traceability analysis of the MAP Nexus Enterprise Platform. The objective is to determine whether the React frontend correctly represents the existing Python Migration Validation Engine.

**Finding:** The frontend has evolved as a **platform-first** application with minimal integration to the Python engine. Only 9 of 134 frontend pages are fully aligned to backend capabilities.

---

## 2. System Architecture

### 2.1 Python Migration Validation Engine

**Location:** `fs-migration-validation-engine/`  
**Entry Point:** `python -m app.main run --config config.yaml`  
**Database Communication:** PostgreSQL via psycopg2 (raw SQL, no ORM)

**14 Business Capabilities:**

| # | Capability | Module | API Status |
|---|-----------|--------|------------|
| 1 | Project Management | app.execution_engine | Partial |
| 2 | Connection Management | app.db.connection_resolver | YES (CRUD) |
| 3 | Dataset Discovery | app.discovery.auto_rule_discovery | No (CLI) |
| 4 | Dataset Mappings | app.services.mapping_resolver | No (auto) |
| 5 | Column Mappings | app.services.dataset_discovery_service | No |
| 6 | Rule Discovery | app.discovery.auto_rule_discovery | No (auto) |
| 7 | Control Discovery | app.execution.control_executor | No |
| 8 | Validation Execution | app.execution_engine | YES (trigger) |
| 9 | Governance Decisions | app.governance.decision_engine | No (auto) |
| 10 | Reporting | app.audit_export | No (SQL views) |
| 11 | Audit Trail | app.api.core.middleware.audit_middleware | No (middleware) |
| 12 | Scheduling | app.execution_engine (inline DAG) | No (config) |
| 13 | Retry Engine | app.orchestration.retry.rule_retry_manager | No (auto) |
| 14 | Checkpointing | app.execution_engine._save_checkpoint() | No (auto) |

**6-Step Execution Pipeline:**
```
Connection Resolution → Dataset Mapping → Rule Discovery → Control Discovery → Control Execution → Governance Decision
```

### 2.2 React Frontend

**Location:** `MAP_V2/`  
**Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Recharts, AG Grid

**17 Top-Level Menus, 103+ Submenus:**

| Menu | Submenus | Portal |
|------|----------|--------|
| Home | — | — |
| Executive Dashboard | — | Executive |
| Operations | 7 | Operations |
| Migration | 9 | Migration |
| Task Management | 7 | Task Management |
| Validation | 3 | — |
| Governance | 9 | Governance |
| Risk | 3 | — |
| Reports | 12 | Reporting |
| Report Centre | 7 | — |
| Report Scheduler | 11 | — |
| Report Distribution | 13 | — |
| Security | 15 | Security |
| AI Platform | 4 | AI |
| Administration | 17 | Administration |
| Settings | 2 | — |
| Help | 2 | — |

**9 Portals:** Executive, Operations, Migration, Task Management, Governance, Reporting, Security, Administration, AI

### 2.3 PostgreSQL Database

**Database:** `migration_engine`  
**6 Schemas:**

| Schema | Tables | Owner |
|--------|--------|-------|
| core | 8 | Shared (migration metadata) |
| engine | 22 active | Python Engine (execution & governance) |
| platform | 22 | Platform (users, roles, workflows, tasks) |
| reporting | 3 + 5 views | Reporting/BI |
| audit | 5 | Audit/Compliance |
| engine_v14 | 10 | Deprecated (legacy backup) |

**No SQLAlchemy ORM** — raw SQL via psycopg2. Pydantic models for API request/response only.

### 2.4 FastAPI Backend

**Location:** `app/api/`  
**72+ Endpoints across 12 Route Groups:**

| Group | Prefix | Endpoints | Service |
|-------|--------|-----------|---------|
| Health | /health, /api/v1/health, /api/v1/ready | 3 | Inline |
| Auth | /api/v1/auth | 1 | AuthService |
| Systems | /api/v1/systems | 4 | SystemService |
| Credentials | /api/v1/credentials | 4 | CredentialService |
| Execution | /api/v1/execution | 2 | ExecutionService |
| Users | /api/v1/users | 8 | UserService |
| Roles | /api/v1/roles | 9 | RoleService |
| Workflows | /api/v1/workflows | 8 | WorkflowService |
| Tasks | /api/v1/tasks | 8 | TaskService |
| Notifications | /api/v1/notifications | 8 | NotificationService |
| Calendar | /api/v1/calendar | 6 | CalendarService |
| Approvals | /api/v1/approvals | 6 | ApprovalService |
| Settings | /api/v1/settings | 5 | SettingsService |

**Security:** JWT Bearer tokens, RBAC via `require_permissions()`, tenant isolation via `get_current_user_with_tenant()`

---

## 3. Traceability Analysis

### 3.1 Aligned Pages (9)

Pages where the frontend correctly calls a working backend API:

| Frontend Page | API Endpoint | Service | Engine Module |
|---------------|-------------|---------|---------------|
| Executive Dashboard | GET /api/v1/execution/status/{id} | ExecutionService | app.execution_engine |
| Migration > Execution | POST /api/v1/execution/run | ExecutionService | app.execution_engine |
| Migration > Datasets | GET /api/v1/systems/ | SystemService | app.services.system_service |
| Validation > Rules | GET /api/v1/validation/rules | ValidationService | app.rule_factory |
| Validation > Results | GET /api/v1/validation/results | ExecutionService | app.execution_engine |
| Security > Credentials | GET /api/v1/credentials/ | CredentialService | app.services.credential_service |
| Administration > Users | GET /api/v1/users/ | UserService | app.services.user_service |
| Administration > Roles | GET /api/v1/roles/ | RoleService | app.services.role_service |
| Settings | GET /api/v1/settings/ | SettingsService | app.services.settings_service |

### 3.2 Partial Pages (10)

Pages with some backend integration but incomplete:

| Frontend Page | API Endpoint | Gap |
|---------------|-------------|-----|
| Migration > Projects | POST /api/v1/execution/run | No project CRUD |
| Migration > Mappings | (auto-created) | No mapping management API |
| Validation > Queue | GET /api/v1/validation/queue | Incomplete |
| Task Management > Dashboard | GET /api/v1/tasks/ | Platform-only |
| Task Management > My Tasks | GET /api/v1/tasks/my/list | Platform-only |
| Task Management > All Tasks | GET /api/v1/tasks/ | Platform-only |
| Task Management > Workflows | GET /api/v1/workflows/ | Platform-only |
| Task Management > Approvals | GET /api/v1/approvals/ | Platform-only |
| Task Management > Calendar | GET /api/v1/calendar/events | Platform-only |
| Task Management > Notifications | GET /api/v1/notifications/ | Platform-only |

### 3.3 Missing Pages (111)

Pages displaying mock/placeholder data with no backend:

| Portal | Pages | Mock Data Source |
|--------|-------|-----------------|
| Operations | 8 | useOperationsDashboard.ts |
| Governance | 9 | useGovernanceDashboard.ts |
| Reports | 12 | useReportingDashboard.ts |
| Risk | 4 | Static mock |
| AI | 4 | Local AIEngine class |
| Security | 15 | useSecurityDashboard.ts |
| Administration | 17 | useAdminDashboard.ts |
| Report Centre | 16 | useReportCentre.ts |
| Report Scheduler | 12 | useReportScheduler.ts |
| Report Distribution | 13 | useDistribution.ts |

---

## 4. End-to-End Functional Flows

### 4.1 Validation Execution (ALIGNED)

```
Frontend (MigrationExecutionPage)
  ↓ POST /api/v1/execution/run?project_id=...
FastAPI (execution_routes.py)
  ↓ ExecutionService().run(project_id, batch_id)
Python Engine (ExecutionEngine.run())
  ↓ 6-step pipeline
PostgreSQL (engine.migration_batch_registry, engine.migration_control_execution, ...)
  ↓ Response
FastAPI → Frontend (batch_id, status_url)
```

### 4.2 Task Management (PLATFORM-ONLY)

```
Frontend (TaskDashboard)
  ↓ GET /api/v1/tasks/
FastAPI (task_routes.py)
  ↓ TaskService(db.conn, tenant_id).list_tasks()
PostgreSQL (platform.tasks)
  ↓ Response
FastAPI → Frontend (task list)
```

**Note:** No connection to Python engine. Tasks are a platform-only concept.

### 4.3 Governance Decisions (MISSING BACKEND)

```
Frontend (GovernanceOverview)
  ↓ (no API call — displays mock data)
  ↓
  ✗ NO BACKEND CONNECTION
```

**Python engine has:** app.governance.decision_engine, engine.migration_governance_status, engine.migration_release_decision  
**Frontend has:** Mock governance dashboard with placeholder metrics

---

## 5. Gap Analysis Summary

### 5.1 Frontend Gaps (98 pages)

| Priority | Portal | Pages | Needed Backend |
|----------|--------|-------|----------------|
| HIGH | Reports | 12 | SQL views (engine.v_*) |
| HIGH | Governance | 9 | New /api/v1/governance endpoints |
| HIGH | Operations | 8 | Execution status APIs |
| MEDIUM | Security | 15 | Audit events, security tables |
| MEDIUM | Administration | 17 | Platform settings APIs |
| MEDIUM | AI | 4 | Python engine AI service |
| LOW | Report Centre | 16 | Report metadata APIs |
| LOW | Report Scheduler | 12 | Schedule management APIs |
| LOW | Report Distribution | 13 | Distribution channel APIs |

### 5.2 Backend Gaps (10 capabilities)

| Priority | Capability | Module | Frontend Need |
|----------|-----------|--------|---------------|
| HIGH | Dataset Discovery | app.discovery | New page in Migration portal |
| HIGH | Governance Decisions | app.governance | Wire to Governance portal |
| HIGH | Reporting (SQL Views) | app.audit_export | Wire to Reports portal |
| MEDIUM | Column Mappings | app.services.dataset_discovery_service | New editor page |
| MEDIUM | Rule Discovery | app.discovery.auto_rule_discovery | New review page |
| MEDIUM | Control Discovery | app.execution.control_executor | New controls page |
| MEDIUM | Audit Trail | audit_middleware | Wire to Security > Audit Logs |
| LOW | Scheduling | execution_engine (DAG) | Expose status only |
| LOW | Retry Engine | rule_retry_manager | Expose status only |
| LOW | Checkpointing | execution_engine | Expose status only |

---

## 6. Architecture Assessment

### 6.1 Migration-First or Platform-First?

**Verdict: PLATFORM-FIRST**

| Evidence | Detail |
|----------|--------|
| 111/134 pages mock | No engine integration |
| Task Management platform-only | No engine equivalent |
| Workflow platform-only | No engine equivalent |
| Approvals platform-only | No engine equivalent |
| Calendar platform-only | No engine equivalent |
| Notifications platform-only | No engine equivalent |
| AI frontend-local | No backend AI service |
| Reports all mock | SQL views exist but unused |

### 6.2 Realignment Recommendations

1. **Immediate:** Wire Reports portal to existing SQL views
2. **Immediate:** Create /api/v1/governance endpoints
3. **Short-term:** Add Dataset Discovery page
4. **Short-term:** Add Column Mapping editor
5. **Medium-term:** Consolidate duplicate portals
6. **Medium-term:** Reduce 17 menus to 8
7. **Long-term:** Replace all mock data with real APIs

---

## 7. Conclusion

The MAP platform has a strong Python engine and a feature-rich React frontend, but they evolved independently. This audit provides the complete map needed to realign the frontend as a true presentation layer for the migration engine.

**Total deliverables:** 10 documents  
**Total findings:** 9 Aligned, 10 Partial, 111 Missing, 2 Duplicate, 2 Unknown  
**Recommended action:** Begin with P1 items (Reports wiring, Governance APIs, Discovery endpoints)

---

*This report is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
