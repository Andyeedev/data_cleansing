# Technical Architecture — v5.08

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│  Validation Results │ Validation Rules │ Operations │ Reports │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP (proxy /api/v1)
┌──────────────┴──────────────────────────────────────────────┐
│                    Backend (FastAPI + Uvicorn)                │
│  Auth │ Execution │ Rules │ Governance │ Mapping │ Discovery  │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────┴──────────────────────────────────────────────┐
│                    Database (PostgreSQL 17.4)                 │
│  core │ engine │ engine_v14 │ platform │ audit │ reporting   │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Layer Architecture

### API Routes (34 files)

| Domain | Route Files | Purpose |
|--------|-------------|---------|
| Auth | `auth_routes.py` | Login, JWT token management |
| Execution | `execution_routes.py`, `execution_control_routes.py`, `execution_history_routes.py` | Batch execution, lifecycle, history |
| Rules | `rule_execution_routes.py`, `rule_discovery_routes.py`, `rule_registry_routes.py` | Control execution, auto-discovery, registry |
| Validation | `validation_report_routes.py` | Report, governance, risk, compliance |
| Operations | `operations_execution_routes.py` | System 2 — Operations → Execution pipeline |
| Mapping | `mapping_routes.py`, `migration_dataset_routes.py` | Column mapping, dataset management |
| Discovery | `discovery_routes.py` | Schema discovery, tree view |
| Governance | `governance_routes.py` | Audit, approvals, exceptions, compliance |
| Dashboard | `dashboard_routes.py` | Portfolio, KPIs, activity |
| Systems | `system_routes.py`, `credential_routes.py` | DB connections, credentials |
| Controls | `control_routes.py`, `control_dependencies_routes.py` | Control CRUD, dependency management |
| Schedules | `schedule_routes.py` | Migration schedule management |
| Export | `export_routes.py` | CSV, PDF export |
| Diagnostics | `diagnostics_routes.py` | Connection diagnostics |

### Services Layer

| Service | Purpose |
|---------|---------|
| `run_orchestrator_service.py` | System 2 — orchestrates all 5 steps using System 1 services |
| `execution_service.py` | Batch execution lifecycle |
| `rule_execution_service.py` | Control/rule execution logic |
| `fix_options_service.py` | Pattern-based error→fix resolution |
| `auth_service.py` | JWT authentication |
| `schedule_runner.py` | Schedule execution with MAP CLI |
| `rule_discovery_service.py` | Auto-discovery of rule-to-dataset bindings |
| `validation_report_service.py` | Report generation |

### Database Connection

| Class | Purpose |
|-------|---------|
| `DBConnector` | Direct connection with fetch_all/fetch_dataframe aliases |
| `PooledDBConnector` | Pooled connection with MARS_Connection=Yes for SQL Server |
| `ConnectionPoolManager` | Singleton pool manager, reset on startup |

---

## Frontend Architecture

### Route Pages (87 .tsx files)

| Area | Pages |
|------|-------|
| Validation | Results, Rules, Dashboard, Discovery, Controls, Governance |
| Operations | Execution, History, Workflows |
| Migration | Projects, Schedules, Timeline, Overview |
| Discovery | Page, TreeTable |
| Mapping | Spreadsheet |
| Administration | Users, Roles, Settings, Notifications |
| Reports | Reports page |

### Shared Components (46 .tsx files)

| Component | Purpose |
|-----------|---------|
| `StatusBadge` | Status indicator (pass/fail/error/skipped) |
| `MetricCard` | KPI display card |
| `TabBar` | Tab navigation |
| `CascadeDropdowns` | Tenant → Project → Batch cascade selector |
| `ControlReportModal` | Control rules popup (View Report) |
| `ProgressBar` | Execution progress display |
| `EmptyState` | Empty state placeholder |
| `ErrorState` | Error state with retry |
| `LoadingSkeleton` | Loading placeholder |
| `SearchBar` | Search input |

---

## Validation Pipeline

```
1. Schedule     → Create migration schedule (project, tenant, controls)
2. Execute      → Run MAP CLI: python -m app.main run --config config.yaml
3. Validate     → Execute controls (C01-C09), compute deltas
4. Report       → Generate validation report, governance decision
5. Fix Options  → Pattern-based error resolution
```

### Control Execution Flow

```
Control (e.g., C02) 
  → Rule (e.g., C02_BALANCE_RECON)
    → Resolve mapping (core.rule_dataset_mapping → dataset_mappings)
    → Execute SQL against source + target
    → Compute delta
    → Populate detail_json (query, source_count, target_count, systems)
    → Status: PASS | FAIL | ERROR | SKIPPED | BLOCKED
```

---

## Security Architecture

| Layer | Implementation |
|-------|---------------|
| Authentication | JWT tokens with expiry validation |
| Authorization | RBAC middleware on all endpoints |
| Tenant Isolation | `tenant_id` filter on all queries |
| CORS | Configured for development and production |
| Rate Limiting | SlowAPI limiter on auth endpoints |

---

## Connection Pool Architecture

```
Startup → ConnectionPoolManager.reset()
  → Creates new PooledDB per adapter (postgres, sqlserver, etc.)
  → MARS_Connection=Yes for SQL Server

Per Step → Fresh DB connection
  → try: use connection
  → finally: db.close()  (returns to pool)
```

---

## Version

**Version:** v5.08

**Branch:** `feature/workstream-07-task_management`

**Status:** Validation Engine Complete
