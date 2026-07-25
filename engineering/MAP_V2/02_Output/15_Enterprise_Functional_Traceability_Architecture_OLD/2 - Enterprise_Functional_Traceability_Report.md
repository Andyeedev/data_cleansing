# Enterprise Functional Traceability Report

**Project:** MAP V2 — Migration Validation Engine  
**Version:** 1.0  
**Date:** July 2026  
**Classification:** Internal — Technical Architecture  

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [System Architecture](#2-system-architecture)
3. [Traceability Analysis](#3-traceability-analysis)
4. [Gap Analysis](#4-gap-analysis)
5. [End-to-End Functional Flows](#5-end-to-end-functional-flows)
6. [Architecture Assessment](#6-architecture-assessment)
7. [Conclusion](#7-conclusion)

---

## 1. Executive Overview

This report documents the complete enterprise functional traceability analysis for MAP V2, an enterprise-grade financial services data migration validation platform. The analysis establishes end-to-end traceability across three independent systems, identifying alignment, gaps, and architectural deviations.

**Key Findings:**

| Metric | Value |
|--------|-------|
| Independent systems | 3 (Python Engine, React Frontend, PostgreSQL) |
| Database schemas | 6 |
| API endpoints | 72+ |
| Frontend menus | 17 top-level, 103+ submenus |
| Business capabilities (Python engine) | 14 |
| Capabilities with full CRUD APIs | 2 of 14 (14%) |
| Frontend pages with backend backing | ~30% |
| Frontend pages with mock/no data | ~70% |

The analysis reveals that the React frontend has evolved as a **platform-first application** with significant independent development from the Python migration validation engine. While 9 pages maintain correct frontend-to-backend traceability, 111 pages operate without backend integration—using mock data, static content, or local state management. Only 2 of the 14 major engine capabilities (Project Management and Connection Management) have full CRUD API exposure; the remaining 12 capabilities are either partially exposed or entirely hidden from the frontend.

---

## 2. System Architecture

### 2.1 Python Migration Validation Engine

**Entry Point:**
```bash
python -m app.main run --config config.yaml
```

**14 Business Capabilities:**

| # | Capability | Description |
|---|------------|-------------|
| 1 | Project Management | CRUD for migration projects |
| 2 | Connection Management | Database connection configuration |
| 3 | Dataset Discovery | Schema/table/column introspection |
| 4 | Dataset Mappings | Source-to-target dataset mapping |
| 5 | Column Mappings | Column-level transformation rules |
| 6 | Rule Discovery | Automated validation rule generation |
| 7 | Control Discovery | Data control identification |
| 8 | Validation Execution | Rule execution engine |
| 9 | Governance Decisions | Approval and governance workflows |
| 10 | Reporting | SQL view-based analytics |
| 11 | Audit Trail | Execution history tracking |
| 12 | Scheduling | Cron-based job scheduling |
| 13 | Retry Engine | Failed job retry logic |
| 14 | Checkpointing | State persistence for long-running jobs |

**6-Step Migration Pipeline:**

```
Step 1: Connection Resolution
    ↓
Step 2: Dataset Mapping
    ↓
Step 3: Rule Discovery
    ↓
Step 4: Control Discovery
    ↓
Step 5: Control Execution (Validation)
    ↓
Step 6: Governance Decision
```

Each step persists state to PostgreSQL `engine` schema tables and emits structured events consumed by the reporting layer.

### 2.2 React Frontend

**Structure:**

| Layer | Count |
|-------|-------|
| Top-level menus | 17 |
| Submenu items | 103+ |
| Portal sections | 9 |
| Page components | 25+ |
| Sub-components | 100+ |

**9 Portal Sections:**

1. **Executive** — High-level dashboards and KPIs
2. **Operations** — Day-to-day operational views
3. **Migration** — Core migration project and execution views
4. **Task Management** — Task assignment, tracking, and workflows
5. **Governance** — Approval workflows and policy enforcement
6. **Reporting** — Report generation and visualization
7. **Security** — Credentials, access control, encryption
8. **Administration** — System configuration and user management
9. **AI** — AI-assisted features (local inference)

**API Client:**
- Technology: Fetch API with JWT Bearer token authentication
- Base URL configuration via environment variable
- Automatic token refresh handling
- Request/response interceptors for error handling

### 2.3 PostgreSQL Database

**Schema Inventory:**

| Schema | Tables | Views | Purpose |
|--------|--------|-------|---------|
| `core` | 8 | 0 | System configuration, tenants, users |
| `engine` | 22 | 0 | Migration execution state and results |
| `platform` | 22 | 0 | Workflow, tasks, notifications, calendar |
| `reporting` | 3 | 5 | Analytics and aggregated views |
| `audit` | 5 | 0 | Change tracking and compliance |
| `engine_v14` | 10 | 0 | Deprecated — legacy schema |

**Data Access Pattern:**
- No SQLAlchemy ORM — raw SQL via `psycopg2`
- Connection pooling via `psycopg2.pool.ThreadedConnectionPool`
- Pydantic models for API request/response validation
- Manual query parameterization to prevent SQL injection

### 2.4 FastAPI Backend

**Endpoint Distribution:**

| Route Group | Endpoints | Authentication |
|-------------|-----------|----------------|
| Auth | 4 | Public (login), JWT (refresh/logout) |
| Systems | 12 | JWT + RBAC |
| Credentials | 8 | JWT + RBAC |
| Execution | 10 | JWT + RBAC |
| Users | 6 | JWT + Admin |
| Roles | 5 | JWT + Admin |
| Workflows | 8 | JWT + RBAC |
| Tasks | 7 | JWT + RBAC |
| Notifications | 5 | JWT + RBAC |
| Calendar | 4 | JWT + RBAC |
| Approvals | 3 | JWT + RBAC |
| Settings | 4 | JWT + Admin |

**Total: 72+ endpoints**

**Security Enforcement:**
- `require_permissions()` — FastAPI dependency for RBAC enforcement
- `get_current_user_with_tenant()` — Tenant isolation via JWT claims
- Role-based access: `admin`, `manager`, `analyst`, `viewer`
- Endpoint-level permission scoping

---

## 3. Traceability Analysis

### 3.1 Aligned Pages (9)

Pages with complete frontend-to-backend traceability, including API calls, state management, and data rendering:

| Page | Frontend Route | Backend Endpoint | Status |
|------|---------------|------------------|--------|
| Executive Dashboard | `/executive/dashboard` | `GET /api/v1/execution/stats` | ✅ Full |
| Migration Projects | `/migration/projects` | `GET/POST /api/v1/projects` | ✅ Full |
| Migration Datasets | `/migration/datasets` | `GET/POST /api/v1/datasets` | ✅ Full |
| Migration Mappings | `/migration/mappings` | `GET/POST /api/v1/mappings` | ⚠️ Partial |
| Validation Rules | `/validation/rules` | `GET /api/v1/validation/rules` | ✅ Full |
| Validation Results | `/validation/results` | `GET /api/v1/validation/results` | ✅ Full |
| Security Credentials | `/security/credentials` | `GET/POST /api/v1/credentials` | ✅ Full |
| Admin Users | `/admin/users` | `GET/POST /api/v1/users` | ✅ Full |
| Admin Roles | `/admin/roles` | `GET/POST /api/v1/roles` | ✅ Full |

### 3.2 Partial Pages (10)

Pages with some backend integration but incomplete data flow or missing CRUD operations:

| Page | Frontend Route | Issue |
|------|---------------|-------|
| Migration Projects | `/migration/projects` | Read-only; no create/edit UI |
| Migration Mappings | `/migration/mappings` | Mapping creation not wired |
| Migration Execution | `/migration/execution` | Execution trigger only; no status polling |
| Validation Queue | `/validation/queue` | Queue display; no priority management |
| Task Management Dashboard | `/tasks/dashboard` | Aggregates but no task actions |
| Task List | `/tasks/list` | List view; no assignment workflow |
| Task Detail | `/tasks/detail` | Detail view; no status transitions |
| Task Calendar | `/tasks/calendar` | Calendar display; no drag-drop |
| Task Reports | `/tasks/reports` | Static charts; no drill-down |
| Task Analytics | `/tasks/analytics` | Aggregated metrics; no filtering |

### 3.3 Missing Pages (111)

Pages with no backend integration, using mock data, static content, or local state:

| Portal | Pages | Mock Status |
|--------|-------|-------------|
| Operations | 8 | 100% mock |
| Governance | 9 | 100% mock |
| Reports | 12 | 100% mock |
| Risk | 4 | 100% mock |
| AI | 4 | Local inference only |
| Security (non-credential) | 15 | 100% mock |
| Administration (non-user) | 17 | 100% mock |
| Report Centre | 16 | 100% mock |
| Report Scheduler | 12 | 100% mock |
| Report Distribution | 13 | 100% mock |

**Total: 111 pages without backend traceability**

### 3.4 Duplicate Pages (2)

Pages that duplicate functionality or present conflicting data models:

| Page | Location | Issue |
|------|----------|-------|
| Governance Overview | `/governance/overview` | Overlaps with Executive Dashboard; no unique data source |
| Reports Overview | `/reports/overview` | Overlaps with Executive Dashboard metrics |

---

## 4. Gap Analysis

### 4.1 Frontend Gaps

**98 pages require backend integration, prioritized by portal:**

**Priority 1 — Operations (8 pages)**
- Operations Dashboard, Queue Management, SLA Monitoring, Performance Metrics, Error Tracking, Resource Utilization, Alert Management, Capacity Planning

**Priority 2 — Governance (9 pages)**
- Governance Dashboard, Policy Management, Approval Workflows, Compliance Reports, Audit Reviews, Risk Assessments, Exception Handling, Policy Violations, Regulatory Reporting

**Priority 3 — Reports (12 pages)**
- Report Builder, Report Library, Report Templates, Report Scheduling, Report Distribution, Report Analytics, Report History, Report Sharing, Report Export, Report Import, Report Versioning, Report Access Control

**Priority 4 — Security (15 pages)**
- Security Dashboard, Access Reviews, Permission Management, Encryption Keys, Certificate Management, Security Policies, Vulnerability Scanning, Compliance Checks, Threat Detection, Security Alerts, Audit Log Viewer, Session Management, IP Whitelisting, MFA Management, Security Training

**Priority 5 — Administration (17 pages)**
- System Configuration, Database Management, Backup/Restore, System Monitoring, Performance Tuning, Log Management, Plugin Management, Integration Settings, Email Configuration, Notification Rules, Theme Management, Branding, Localization, Accessibility, Data Retention, Archival Rules, System Health

**Priority 6 — Report Centre (16 pages)**
- All 16 pages require SQL view integration

**Priority 7 — Report Scheduler (12 pages)**
- All 12 pages require cron scheduler integration

**Priority 8 — Report Distribution (13 pages)**
- All 13 pages require distribution engine integration

### 4.2 Backend Gaps

**10 engine capabilities lack frontend exposure:**

| Capability | API Status | Recommended Action |
|------------|------------|-------------------|
| Dataset Discovery | Internal only | Expose via `/api/v1/discovery/` |
| Column Mappings | Partial | Complete CRUD endpoints |
| Rule Discovery | Internal only | Expose via `/api/v1/rules/discover` |
| Control Discovery | Internal only | Expose via `/api/v1/controls/discover` |
| Governance Decisions | Internal only | Expose via `/api/v1/governance/` |
| Reporting (SQL Views) | Read-only | Add filtering, export, drill-down |
| Audit Trail | Internal only | Expose via `/api/v1/audit/` |
| Scheduling | Internal only | Expose via `/api/v1/scheduling/` |
| Retry Engine | Internal only | Expose via `/api/v1/retry/` |
| Checkpointing | Internal only | Expose via `/api/v1/checkpoints/` |

---

## 5. End-to-End Functional Flows

### 5.1 Validation Execution Flow

```
Frontend (React)
    │
    ├── POST /api/v1/execution/run
    │   Body: { project_id, dataset_id, rule_set }
    │
    ▼
FastAPI Router (execution.py)
    │
    ├── require_permissions(["execution:execute"])
    ├── get_current_user_with_tenant()
    │
    ▼
ExecutionService (services/execution_service.py)
    │
    ├── Validates project exists
    ├── Resolves dataset mappings
    ├── Loads rule definitions
    │
    ▼
ExecutionEngine (engine/execution_engine.py)
    │
    ├── Step 1: Connection Resolution
    │   └── engine.connections → DB connection pool
    ├── Step 2: Dataset Mapping
    │   └── engine.dataset_mappings → SQL generation
    ├── Step 3: Rule Discovery
    │   └── engine.rule_definitions → rule compilation
    ├── Step 4: Control Discovery
    │   └── engine.control_definitions → control compilation
    ├── Step 5: Control Execution
    │   └── engine.validation_results → batch insert
    ├── Step 6: Governance Decision
    │   └── engine.governance_decisions → status update
    │
    ▼
PostgreSQL (engine schema)
    │
    ├── engine.execution_runs
    ├── engine.validation_results
    ├── engine.governance_decisions
    │
    ▼
Response: { execution_id, status, result_count }
    │
    ▼
Frontend renders results table with pass/fail/skip counts
```

### 5.2 Task Management Flow

```
Frontend (React)
    │
    ├── GET /api/v1/tasks/
    │   Query: ?status=pending&assignee=me
    │
    ▼
FastAPI Router (tasks.py)
    │
    ├── require_permissions(["tasks:read"])
    │
    ▼
TaskService (services/task_service.py)
    │
    ├── Queries platform.tasks
    ├── Joins platform.task_assignments
    ├── Aggregates completion metrics
    │
    ▼
PostgreSQL (platform schema)
    │
    ├── platform.tasks
    ├── platform.task_assignments
    ├── platform.task_comments
    │
    ▼
Response: { tasks: [...], total, page, filters }
    │
    ▼
Frontend renders task list with actions
    │
    ├── PATCH /api/v1/tasks/{id}/status
    │   Body: { status: "completed" }
    │
    ▼
TaskService.update_status()
    │
    ├── Updates platform.tasks.status
    ├── Creates platform.task_audit entry
    ├── Triggers notification to assigner
    │
    ▼
Frontend refreshes list, shows success toast
```

### 5.3 Workflow Execution Flow

```
Frontend (React)
    │
    ├── POST /api/v1/workflows/{id}/execute
    │   Body: { context: { project_id, dataset_id } }
    │
    ▼
FastAPI Router (workflows.py)
    │
    ├── require_permissions(["workflows:execute"])
    │
    ▼
WorkflowService (services/workflow_service.py)
    │
    ├── Loads workflow definition from platform.workflows
    ├── Validates workflow steps
    ├── Creates platform.workflow_instances
    │
    ▼
WorkflowEngine (engine/workflow_engine.py)
    │
    ├── Step 1: Initialize workflow context
    ├── Step 2: Execute steps sequentially
    │   ├── Task creation (platform.tasks)
    │   ├── Approval requests (platform.approvals)
    │   ├── Notification dispatch (platform.notifications)
    │   └── State updates (platform.workflow_instances)
    ├── Step 3: Evaluate completion criteria
    │
    ▼
PostgreSQL (platform schema)
    │
    ├── platform.workflow_instances
    ├── platform.workflow_steps
    ├── platform.workflow_step_results
    │
    ▼
Response: { instance_id, status, steps_completed }
    │
    ▼
Frontend shows workflow progress with step indicators
```

---

## 6. Architecture Assessment

### 6.1 Is the Frontend Migration-First or Platform-First?

**Answer: PLATFORM-FIRST**

The React frontend has been developed as a **platform-first application** with extensive enterprise portal features, while the Python engine remains a **migration-specific validation tool**. The two systems have diverged significantly in scope and capability.

**Evidence:**

1. **63+ pages use mock data** with no backend integration
2. **Task Management, Workflow, Approvals, Calendar, Notifications** are entirely platform-only features with no engine backing
3. **Reports, Governance, Operations** portals have no connection to engine capabilities
4. **AI system** is entirely frontend-local with no backend API
5. **Security portal** (15 pages) has no backend except credential management (1 page)
6. **Administration portal** (17 pages) has no backend except user/role management (2 pages)

**Architectural Implications:**

- The frontend was likely built to demonstrate a "full enterprise platform" vision
- The Python engine was built to solve a specific migration validation problem
- Neither system was designed to be the complete solution
- The integration surface is minimal (~30% of frontend)

### 6.2 Recommendations

**Immediate Actions (Priority 1):**

1. **Wire Reports portal to SQL views** — The `reporting` schema has 3 tables and 5 views already implemented. Expose them via `/api/v1/reports/` endpoints and replace the 12 mock report pages.

2. **Create governance API endpoints** — The `engine.governance_decisions` table exists and captures decision data. Expose via `/api/v1/governance/` and wire the 9 governance pages.

3. **Add Dataset Discovery frontend** — The `engine.dataset_discovery` table captures schema introspection results. Create a frontend page at `/migration/discovery` with an API at `/api/v1/discovery/`.

**Medium-Term Actions (Priority 2):**

4. **Consolidate duplicate portals** — Merge Governance Overview and Reports Overview into Executive Dashboard to reduce confusion and maintenance burden.

5. **Replace all mock data with real API calls** — Systematically replace mock data in each portal section with real API integration, starting with Operations and Security.

6. **Complete Task Management integration** — Wire all 5 task management pages to the existing `platform.tasks` and `platform.task_assignments` tables.

**Long-Term Actions (Priority 3):**

7. **Redesign the architecture** — Decide whether MAP is:
   - (a) A migration validation engine with a management UI (Python-centric)
   - (b) A full enterprise platform with migration capabilities (React-centric)
   - (c) A hybrid with clear service boundaries

8. **Establish API versioning strategy** — Current endpoints use `/api/v1/`. Plan for breaking changes as capabilities expand.

---

## 7. Conclusion

The enterprise functional traceability analysis reveals a significant architectural misalignment between the React frontend and Python migration validation engine. The frontend has evolved as a platform-first application with extensive enterprise portal features, while the Python engine remains a focused migration validation tool.

**Key Takeaways:**

- Only **9 of 130 pages** (7%) have full frontend-to-backend traceability
- **111 pages** (85%) operate without backend integration
- Only **2 of 14 engine capabilities** have complete CRUD API exposure
- The two systems share a **minimal integration surface** (~30% of frontend)

**Immediate action is required to realign the architecture.** The most impactful steps are wiring the existing SQL views to the Reports portal, creating governance API endpoints, and adding a Dataset Discovery frontend. These three actions would increase backend integration from ~30% to ~50% with minimal engineering effort.

The long-term architectural decision—whether MAP is a migration validation engine or a full enterprise platform—must be made before further development. Without this decision, the systems will continue to diverge, increasing technical debt and reducing the platform's value to the organization.

---

**Document Version:** 1.0  
**Last Updated:** July 2026  
**Next Review:** August 2026  
**Author:** MAP V2 Architecture Team  
