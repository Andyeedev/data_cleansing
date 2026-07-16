# Architecture (v5.0)

## Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)               │
│                    134 pages, 15 routes                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Python/FastAPI)                   │
│                    31 API endpoints, JWT auth                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL 17.4)                │
│                    6 schemas, 62 tables                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Schema Architecture

### Core Schema
**Purpose:** Business entity management

- `tenants` — Multi-tenant organizations
- `projects` — Migration projects
- `system_registry` — Database connections
- `datasets` — Discovered tables
- `dataset_mappings` — Source-to-target mappings
- `dataset_columns` — Column metadata
- `column_mappings` — Column mappings
- `rule_dataset_mapping` — Rule-to-mapping links

### Engine Schema
**Purpose:** Validation execution

- `control_registry` — Validation controls (C01-C03)
- `rule_registry` — Validation rules
- `migration_validation_batch` — Batch execution records
- `migration_control_execution` — Control results
- `migration_batch_intelligence` — Governance intelligence
- `governance_config` — Configuration parameters

### Platform Schema
**Purpose:** Enterprise features

- `users`, `roles`, `permissions` — RBAC
- `workflow_definitions`, `workflow_instances` — Workflows
- `approval_templates`, `approval_requests` — Approvals
- `tasks`, `task_comments`, `task_dependencies` — Task management
- `notifications`, `notification_preferences` — Notifications
- `calendar_events`, `calendar_event_reminders` — Calendar
- `system_settings`, `feature_flags` — Configuration

### Audit Schema
**Purpose:** Immutable audit trail

- `audit_events` — General audit events
- `security_events` — Security-specific events
- `login_history` — Login attempts
- `api_logs` — API request/response logs
- `configuration_history` — Config changes

### Reporting Schema
**Purpose:** Analytics and reporting

- `dim_date` — Date dimension
- `dim_severity` — Severity reference
- `dim_status` — Status reference
- `v_fact_batch` — Batch facts view
- `v_fact_control` — Control facts view
- `v_batch_governance_intelligence` — Governance intelligence view

---

## Data Flow

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

## Security Architecture

### Authentication
- JWT tokens with refresh rotation
- bcrypt password hashing
- Rate limiting on login (5/minute)

### Authorization
- Role-Based Access Control (RBAC)
- 6 system roles (Super Admin → Viewer)
- 48 permissions across 10 resources

### Tenant Isolation
- Row-Level Security (RLS) policies
- `tenant_id` on all tenant-scoped tables
- Cross-schema foreign keys

---

## Key Design Principles

1. **Evidence-Based Documentation** — Every statement supported by repository evidence
2. **Current State Only** — No future-state or target-state documentation
3. **Repository Truth** — Database objects override assumptions
4. **Multi-Tenant** — Tenant isolation at database level
5. **Audit-First** — All actions logged to audit schema

---

## Version

**Version:** v5.0

**Branch:** `feature/workstream-05-task_management`
