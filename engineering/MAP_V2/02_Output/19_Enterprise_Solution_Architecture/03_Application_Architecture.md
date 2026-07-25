# 03_Application_Architecture.md

# Application Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document describes the five implemented applications in the MAP Nexus platform, their responsibilities, entry points, dependencies, and evidence.

---

## 1. Validation Engine (Python Backend)

### Purpose
Core migration validation engine that executes 6-step validation pipeline, manages database connections, executes rules against source/target systems, and produces governance decisions.

### Responsibilities
- Execute 6-step validation pipeline (Connection Resolution → Dataset Mapping → Rule Discovery → Control Discovery → Control Execution → Governance Decision)
- Manage database adapters for 7 database types (Postgres, MySQL, SQL Server, Snowflake, BigQuery, Oracle, Databricks)
- Execute validation rules via DAG-based parallel execution
- Produce risk-weighted scoring and governance decisions
- Export audit packs for compliance

### Entry Points
- **CLI**: `app/main.py` — `run_engine()`, `export_audit()`, `discover()`
- **API**: `app/api/main.py` — FastAPI application with 12 routers
- **Execution**: `app/execution_engine.py` — `ExecutionEngine.run()`

### Dependencies
- PostgreSQL (engine database)
- 7 database adapters (`app/db/adapters/`)
- 10 validation rules (`app/rules/`)
- Governance engine (`app/governance/`)

### Evidence
| Component | File Path |
|-----------|-----------|
| Main entry | `app/main.py:16` |
| API application | `app/api/main.py:33` |
| Execution engine | `app/execution_engine.py:24` |
| Rule executor | `app/rule_executor.py:14` |
| Scoring engine | `app/scoring_engine.py:1` |

---

## 2. React Frontend

### Purpose
Single-page application providing 9 portals, authentication, and API integration for managing migrations, validations, governance, reporting, and administration.

### Responsibilities
- Render 9 portals (Executive, Operations, Migration, Validation, Governance, Risk, Reports, Security, Administration)
- Handle authentication with JWT token management
- Display dashboards, widgets, charts, and tables
- Integrate with backend via REST API (`/api/v1/`)
- Manage navigation, routing, and state via React Context

### Entry Points
- **Application root**: `MAP_V2/03_Source/frontend/src/App.tsx`
- **Portal routes**: `MAP_V2/03_Source/frontend/src/portal/routing/PortalRoutes.tsx`
- **Configuration**: `MAP_V2/03_Source/frontend/src/config/routes.ts`

### Dependencies
- React 19, React Router, TypeScript
- Tailwind CSS (styling)
- Backend API (`/api/v1/`)
- localStorage/sessionStorage (token storage)

### Evidence
| Component | File Path |
|-----------|-----------|
| App root | `MAP_V2/03_Source/frontend/src/App.tsx:7` |
| Portal routes | `MAP_V2/03_Source/frontend/src/portal/routing/PortalRoutes.tsx:48` |
| Routes config | `MAP_V2/03_Source/frontend/src/config/routes.ts:1` |
| Navigation config | `MAP_V2/03_Source/frontend/src/config/navigation.ts:10` |
| API client | `MAP_V2/03_Source/frontend/src/api/client.ts:1` |
| Auth provider | `MAP_V2/03_Source/frontend/src/authentication/context/AuthProvider.tsx:16` |
| File count | 525 TypeScript/TSX files |

---

## 3. PostgreSQL Database

### Purpose
Primary data store for platform configuration, migration metadata, execution results, and user management. Organized into multiple schemas.

### Responsibilities
- Store platform data (users, roles, permissions, workflows, tasks, approvals, calendar, notifications, settings)
- Store engine data (control registry, rule registry, batch execution, governance decisions)
- Store core data (system registry, system credentials, dataset mappings, dataset columns)
- Provide transactional consistency for all operations

### Entry Points
- **Direct connection**: `app/db/connection.py:5` — `get_db_connection()`
- **DBConnector**: `app/db_connector.py`
- **Connection factory**: `app/db/connection_factory.py:6`

### Dependencies
- PostgreSQL server (external)
- Database schemas: `platform`, `engine`, `core`

### Evidence
| Component | File Path |
|-----------|-----------|
| Connection module | `app/db/connection.py:5` |
| DBConnector | `app/db_connector.py` |
| Connection factory | `app/db/connection_factory.py:6` |
| System repository | `app/db/repositories/system_repository.py` |
| Credential repository | `app/db/repositories/credential_repository.py` |
| Safe SQL | `app/db/safe_sql.py` |

---

## 4. Authentication System

### Purpose
JWT-based authentication with role-based access control (RBAC), bcrypt password hashing, and token management.

### Responsibilities
- Authenticate users via email/password with bcrypt verification
- Issue JWT tokens with 2-hour expiry
- Validate tokens on protected routes
- Enforce RBAC via permission and role checks
- Track failed login attempts and account status

### Entry Points
- **Login API**: `app/api/routes/auth_routes.py:16` — `POST /api/v1/auth/login`
- **Auth service**: `app/services/auth_service.py:11` — `AuthService.login()`
- **JWT handler**: `app/api/core/auth/jwt_handler.py:6` — `create_token()`, `decode_token()`

### Dependencies
- PostgreSQL (user credentials in `platform.users`)
- bcrypt (password hashing via passlib)
- python-jose (JWT encoding/decoding)
- RBAC module (`app/api/core/auth/rbac.py`)

### Evidence
| Component | File Path |
|-----------|-----------|
| Auth routes | `app/api/routes/auth_routes.py:16` |
| Auth service | `app/services/auth_service.py:11` |
| JWT handler | `app/api/core/auth/jwt_handler.py:6` |
| JWT config | `app/api/core/auth/jwt_config.py` |
| RBAC | `app/api/core/auth/rbac.py:7` |
| Auth dependencies | `app/api/core/auth/dependencies.py` |

---

## 5. Reporting System

### Purpose
Generate CSV audit packs for compliance, with batch execution summaries, control details, exceptions, and governance decisions.

### Responsibilities
- Export governance decisions to CSV
- Export batch execution summaries to CSV
- Export control execution details to CSV
- Export exceptions to CSV
- Support scheduled report generation

### Entry Points
- **Export API**: `app/main.py:25` — `export_audit()`
- **Audit pack service**: `app/services/audit_pack_service.py:4` — `AuditPackService.generate()`
- **Audit exporter**: `app/audit_export.py`

### Dependencies
- PostgreSQL (execution data in `engine.migration_control_execution`)
- Python csv module

### Evidence
| Component | File Path |
|-----------|-----------|
| Audit exporter | `app/audit_export.py` |
| Audit pack service | `app/services/audit_pack_service.py:4` |
| Reporting routes | `app/api/routes/reporting_routes.py` (if present) |
| CLI export command | `app/main.py:25` |

---

## Application Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│         (525 files, 9 portals, 7 services)              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (/api/v1/*)
                       │ JWT Bearer Auth
┌──────────────────────▼──────────────────────────────────┐
│                FastAPI Application                       │
│          (12 routers, ~73 endpoints)                    │
├─────────────────────────────────────────────────────────┤
│  Auth │ Users │ Roles │ Workflows │ Tasks │ Approvals  │
│  Calendar │ Notifications │ Settings │ Systems │ Exec  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Validation Engine Core                      │
│    ExecutionEngine → ControlExecutor → RuleExecutor      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│            PostgreSQL Database                           │
│     platform/  engine/  core/ schemas                    │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

| Application | Technology | Files | Purpose |
|-------------|------------|-------|---------|
| Validation Engine | Python 3.11, FastAPI | 100+ .py files | Core validation pipeline |
| React Frontend | React 19, TypeScript | 525 .tsx/.ts files | User interface, 9 portals |
| PostgreSQL Database | PostgreSQL 15 | 3 schemas | Data persistence |
| Authentication System | JWT, bcrypt, RBAC | 8 files | Security & access control |
| Reporting System | Python csv | 2 files | Audit pack generation |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 20+*
