# Architecture Baseline (v5.06)

## Complete Technical Baseline (Pre-Frontend Freeze)

This document captures the complete technical baseline of the MAP Nexus Enterprise Platform as of v5.06, prior to the frontend freeze.

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Database** | PostgreSQL | 17.4 |
| **Backend** | Python | 3.13 |
| **Backend Framework** | FastAPI | Latest |
| **Frontend** | React | Latest |
| **Frontend Language** | TypeScript | Latest |
| **Authentication** | JWT | - |
| **Password Hashing** | bcrypt | - |
| **CI/CD** | GitHub Actions | - |

---

## 2. Database Architecture

### 2.1 Schema Overview

| Schema | Purpose | Tables |
|--------|---------|--------|
| `core` | Tenant, project, system management | 7 |
| `engine` | Validation execution, governance | 15 |
| `engine_v14` | Legacy v1.4 schema | 10 |
| `platform` | User management, RBAC, workflows | 22 |
| `audit` | Audit trail, security events | 5 |
| `reporting` | Dimension tables, views | 3 |
| **Total** | | **62** |

### 2.2 Core Schema (7 tables)

| Table | Purpose |
|-------|---------|
| `tenants` | Multi-tenant organizations |
| `projects` | Migration projects |
| `system_registry` | Database connections |
| `datasets` | Discovered tables |
| `dataset_mappings` | Source-to-target mappings |
| `dataset_columns` | Column metadata |
| `column_mappings` | Column mappings |
| `rule_dataset_mapping` | Rule-to-mapping links |

### 2.3 Engine Schema (15 tables)

| Table | Purpose |
|-------|---------|
| `control_registry` | Validation controls (C01-C03) |
| `rule_registry` | Validation rules |
| `migration_validation_batch` | Batch execution records |
| `migration_control_execution` | Control results |
| `migration_batch_intelligence` | Governance intelligence |
| `governance_config` | Configuration parameters |

### 2.4 Platform Schema (22 tables)

| Category | Tables |
|----------|--------|
| **User Management** | `users`, `roles`, `permissions` |
| **Workflow Management** | `workflow_definitions`, `workflow_instances` |
| **Approval Management** | `approval_templates`, `approval_requests` |
| **Task Management** | `tasks`, `task_comments`, `task_dependencies` |
| **Notification Management** | `notifications`, `notification_preferences` |
| **Calendar Management** | `calendar_events`, `calendar_event_reminders` |
| **System Settings** | `system_settings`, `feature_flags` |

### 2.5 Audit Schema (5 tables)

| Table | Purpose |
|-------|---------|
| `audit_events` | General audit events |
| `security_events` | Security-specific events |
| `login_history` | Login attempts |
| `api_logs` | API request/response logs |
| `configuration_history` | Config changes |

### 2.6 Reporting Schema (3 tables + 3 views)

| Object | Type | Purpose |
|--------|------|---------|
| `dim_date` | Table | Date dimension |
| `dim_severity` | Table | Severity reference |
| `dim_status` | Table | Status reference |
| `v_fact_batch` | View | Batch facts |
| `v_fact_control` | View | Control facts |
| `v_batch_governance_intelligence` | View | Governance intelligence |

### 2.7 Engine V14 Schema (10 tables)

Legacy v1.4 validation tables retained for backward compatibility.

---

## 3. Backend Architecture

### 3.1 API Endpoints (31 endpoints)

| Category | Endpoints |
|----------|-----------|
| **Authentication** | Login, Register, Refresh, Logout |
| **Systems** | CRUD, Discovery, Connection Test |
| **Projects** | CRUD, Assignment |
| **Datasets** | CRUD, Mapping, Column Metadata |
| **Execution** | Start, Stop, Status, History |
| **Validation** | Run, Results, Summary |
| **Governance** | Approvals, Exceptions, Decisions |
| **Reporting** | Dashboard, Analytics, Export |
| **Users** | CRUD, Roles, Permissions |
| **Settings** | System, Feature Flags |

### 3.2 Security Architecture

#### Authentication
- JWT tokens with refresh rotation
- bcrypt password hashing
- Rate limiting on login (5/minute)

#### Authorization
- Role-Based Access Control (RBAC)
- 6 system roles:
  1. Super Admin
  2. Platform Admin
  3. Migration Manager
  4. Validator
  5. Viewer
  6. Custom
- 48 permissions across 10 resources

#### Tenant Isolation
- Row-Level Security (RLS) policies
- `tenant_id` on all tenant-scoped tables
- Cross-schema foreign keys

### 3.3 Middleware

| Middleware | Purpose |
|------------|---------|
| CORS | Cross-origin resource sharing |
| Audit Logging | Request/response logging |
| Request Timing | Response time tracking |
| Rate Limiting | API rate limiting |

---

## 4. Frontend Architecture

### 4.1 Page Components (134 pages)

| Category | Pages |
|----------|-------|
| **Dashboard** | Executive, Operations, Analytics |
| **Systems** | List, Detail, Discovery, Connection |
| **Projects** | List, Detail, Assignment |
| **Datasets** | List, Detail, Mapping, Columns |
| **Execution** | Batch List, Control Results, History |
| **Validation** | Run, Results, Summary |
| **Governance** | Approvals, Exceptions, Decisions |
| **Reporting** | Dashboard, Analytics, Export |
| **Administration** | Users, Roles, Settings |
| **Calendar** | Events, Reminders |
| **Notifications** | List, Preferences |
| **Tasks** | List, Detail, Dependencies |

### 4.2 Routes (15 routes)

| Route | Purpose |
|-------|---------|
| `/` | Home Dashboard |
| `/systems` | System Management |
| `/projects` | Project Management |
| `/datasets` | Dataset Management |
| `/execution` | Execution Management |
| `/validation` | Validation Management |
| `/governance` | Governance Management |
| `/reports` | Reporting |
| `/users` | User Management |
| `/roles` | Role Management |
| `/settings` | System Settings |
| `/calendar` | Calendar Management |
| `/notifications` | Notification Management |
| `/tasks` | Task Management |

---

## 5. Data Flow

```
Discovery → Mapping → Execution → Governance → Reporting → Audit
    │           │           │            │            │          │
    ▼           ▼           ▼            ▼            ▼          ▼
 core.      core.       engine.      engine.     reporting.  audit.
datasets  dataset_   migration_   migration_   v_fact_*    api_logs
          mappings   control_     batch_
                     execution    intelligence
```

---

## 6. Security Controls

| Control | Implementation |
|---------|----------------|
| Authentication | JWT with refresh rotation |
| Password Hashing | bcrypt |
| Authorization | RBAC with 6 roles |
| Tenant Isolation | Cross-schema foreign keys |
| Audit Trail | Immutable audit_events table |
| Rate Limiting | 5 requests/minute on login |
| CORS | Configured for localhost |

---

## 7. Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 62 |
| Total Schemas | 6 |
| Total Views | 3 |
| Total Foreign Keys | 44 |
| Total Indexes | 71 |

---

## 8. Version

**Version:** v5.06

**Branch:** `feature/workstream-05_task_management`

**Status:** Complete Technical Baseline (Pre-Frontend Freeze)
