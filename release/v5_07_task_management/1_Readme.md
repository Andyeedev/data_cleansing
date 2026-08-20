# MAP Nexus Enterprise Platform (v5.07)

## Overview

The **MAP Nexus Enterprise Platform** is a comprehensive data migration and validation platform designed for regulated Financial Services industries. This release delivers the **complete MAP Validation Pipeline** — from backend rule execution through frontend control reporting.

---

## Scope of Work

### What Was Built

| Area | Description |
|------|-------------|
| **Validation Engine** | Full MAP CLI integration — Schedule, Execute, Validate, Report |
| **System 2 Execution** | Operations → Execution reuses System 1 backend services for all 5 steps |
| **Control Reports** | Frontend modal showing Rule ID, Entity, Status, Delta, Time, Details (detail_json) |
| **Fix Options** | Pattern-based error→fix mapping with categories (permission, connection, schema, config, data) |
| **MARS Fix** | SQL Server connection pooling — MARS_Connection=Yes eliminates "Connection is busy" errors |
| **Pool Exhaustion Fix** | Every step and method closes DB connections via `finally: db.close()` |
| **Governance Check** | Full MAP Validation — runs `python -m app.main run --config config.yaml` via subprocess |

---

## Key Deliverables

### 1. Backend Stability Fixes
- SQL Server MARS connection string fix (`MARS_Connection=Yes`)
- Connection pool reset on startup
- `PooledDBConnector` and `DBConnector` compatibility (fetch_all, fetch_dataframe aliases)
- Control status logic: BLOCKED → ERROR → FAIL → ALL_SKIPPED → ANY_FAIL → PASS
- detail_json populated for ALL statuses (pass, fail, error, skipped)

### 2. System 2 (Operations → Execution)
- Reuses System 1 service classes for all 5 steps
- Fresh DB connection per step (no pool exhaustion)
- Governance Check runs full MAP CLI
- Auto-discovery endpoint with correct mapping ID resolution

### 3. Frontend Integration
- Validation → Results: Controls drilldown modal with ControlRules component
- Validation → Rules: ControlReportModal with latest-batch resolution
- Back to Rules button for navigation between Results ↔ Rules
- CascadeDropdowns error display
- Auth: JWT expiry validation, 401 redirect to login
- Operations Run History: Pagination, status filter, sorting, search, KPI cards

### 4. Fix Options API
- Pattern-based error→fix generator with 5 categories
- `GET /execution/{batch_id}/control/{control_id}/fix-options`
- `POST /execution/{batch_id}/apply-fix`
- `GET /execution/{project_id}/control/{control_id}/latest-batch`

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Database** | PostgreSQL 17.4, SQL Server (pyodbc) |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy |
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Authentication** | JWT, bcrypt |
| **Validation** | MAP CLI (data-driven DAG) |

---

## Database Schemas

| Schema | Purpose | Tables |
|--------|---------|--------|
| `core` | Tenant, project, system, mapping management | 27 |
| `engine` | Validation execution, governance, control dependencies | 47 |
| `engine_v14` | Legacy v1.4 schema | 10 |
| `reporting` | Dimension tables, views | 3 |
| `platform` | User management, RBAC, workflows | 23 |
| `audit` | Audit trail, security events | 5 |

**Total:** 115 tables, 19 views, 91 foreign keys, 220 indexes

---

## Platform Metrics

| Metric | Count |
|--------|-------|
| Backend Python files | 191 |
| API route files | 34 |
| Frontend route pages | 87 |
| Frontend components | 46 |
| Total TSX files | 140 |
| Database tables | 115 |
| Database views | 19 |
| Foreign keys | 91 |
| Indexes | 220 |

---

## Version

**Version:** v5.07

**Branch:** `feature/workstream-07-task_management`

**Status:** Validation Engine Complete — Ready for Git Upload
