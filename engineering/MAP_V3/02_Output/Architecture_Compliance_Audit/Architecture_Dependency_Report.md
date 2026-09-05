# MAP Nexus™ Enterprise Platform

# Architecture Dependency Report

**Date:** 13 July 2026

**Version:** 1.0

**Classification:** Dependency Analysis

**Status:** Complete

---

# 1. Component Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                        │
│  (MAP_V2/03_Source/frontend/src/)                       │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Auth   │ │  Portal  │ │   AI     │ │ Reporting│  │
│  │ Provider │ │  Shell   │ │ Assistant│ │  Centre  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │             │         │
│  ┌────┴─────────────┴────────────┴─────────────┴────┐  │
│  │              api/client.ts (fetch)                │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP (Bearer JWT)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    FASTAPI LAYER                         │
│  (app/api/)                                             │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Auth   │ │   User   │ │   Task   │ │ Workflow │  │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │             │         │
│  ┌────┴─────────────┴────────────┴─────────────┴────┐  │
│  │         core/auth/dependencies.py                │  │
│  │         (get_current_user)                       │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                           │
│  (app/services/)                                        │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Auth   │ │   User   │ │   Task   │ │ Workflow │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │             │         │
│  ┌────┴─────────────┴────────────┴─────────────┴────┐  │
│  │         Raw SQL / DBConnector                    │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               REPOSITORY LAYER (Partial)                │
│  (app/db/repositories/)                                │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Credential  │  │    System    │  (2 of 8 entities) │
│  │ Repository   │  │  Repository  │                    │
│  └──────┬───────┘  └──────┬───────┘                    │
│         │                  │                            │
│  ┌──────┴──────────────────┴───────┐                   │
│  │       DBConnector / psycopg2    │                   │
│  └──────────────┬──────────────────┘                   │
└─────────────────┼───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL                             │
│  (migration_engine database)                            │
│                                                         │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────┐ │
│  │  core  │ │ engine │ │ reporting│ │platform│ │audit│ │
│  └────────┘ └────────┘ └──────────┘ └────────┘ └────┘ │
└─────────────────────────────────────────────────────────┘
```

---

# 2. Schema Dependencies

## 2.1 Cross-Schema Foreign Keys

| From Schema | From Table | From Column | To Schema | To Table | To Column |
|------------|-----------|-------------|-----------|----------|-----------|
| platform | users | tenant_id | core | tenants | tenant_id |
| platform | roles | tenant_id | core | tenants | tenant_id |
| platform | tasks | tenant_id | core | tenants | tenant_id |
| platform | tasks | project_id | core | projects | project_id |
| platform | workflow_definitions | tenant_id | core | tenants | tenant_id |
| platform | workflow_instances | tenant_id | core | tenants | tenant_id |
| platform | approval_requests | tenant_id | core | tenants | tenant_id |
| platform | approval_templates | tenant_id | core | tenants | tenant_id |
| platform | calendar_events | tenant_id | core | tenants | tenant_id |
| platform | calendar_events | project_id | core | projects | project_id |

## 2.2 Missing Cross-Schema FKs

| From Table | Should Reference | Reason |
|-----------|-----------------|--------|
| platform.tasks | engine.migration_batch_registry | Tasks should link to migration batches |
| platform.workflow_instances | engine.migration_batch_registry | Workflows should link to migration batches |
| platform.workflow_definitions | core.projects | Workflows may be project-scoped |

## 2.3 Intra-Schema Dependencies

### platform schema internal FKs

| From Table | To Table | Relationship |
|-----------|----------|-------------|
| refresh_tokens | users | Many-to-one |
| user_sessions | users | Many-to-one |
| user_roles | users | Many-to-many |
| user_roles | roles | Many-to-many |
| role_permissions | roles | Many-to-many |
| role_permissions | permissions | Many-to-many |
| roles | roles (self) | Parent-child hierarchy |
| task_comments | tasks | Many-to-one |
| task_comments | users | Many-to-one |
| task_dependencies | tasks | Many-to-many (self) |
| tasks | users (assigned_to) | Many-to-one |
| tasks | users (assigned_by) | Many-to-one |
| tasks | tasks (parent) | Self-referencing hierarchy |
| notifications | users | Many-to-one |
| notification_preferences | users | Many-to-one |
| calendar_events | users (organizer) | Many-to-one |
| calendar_event_reminders | calendar_events | Many-to-one |
| calendar_event_reminders | users | Many-to-one |
| workflow_instances | workflow_definitions | Many-to-one |
| workflow_step_instances | workflow_instances | Many-to-one |
| workflow_history | workflow_instances | Many-to-one |
| approval_requests | approval_templates | Many-to-one |
| approval_step_instances | approval_requests | Many-to-one |

---

# 3. Service Dependencies

## 3.1 Route → Service Dependencies

| Route | Depends On Service | Depends On Other Services |
|-------|-------------------|--------------------------|
| auth_routes | auth_service | None |
| user_routes | user_service | None |
| role_routes | role_service | None |
| task_routes | task_service | None |
| workflow_routes | workflow_service | None |
| notification_routes | notification_service | None |
| calendar_routes | calendar_service | None |
| settings_routes | settings_service | None |
| credential_routes | credential_service | system_service |
| system_routes | system_service | credential_service |
| execution_routes | execution_service | ExecutionEngine |

## 3.2 Service → Repository Dependencies

| Service | Repository | Raw SQL |
|---------|-----------|---------|
| auth_service | None | None (env-only) |
| credential_service | credential_repository | Partial |
| system_service | system_repository | Partial |
| workflow_service | None | YES |
| task_service | None | YES |
| user_service | None | YES |
| role_service | None | YES |
| notification_service | None | YES |
| settings_service | None | YES |
| calendar_service | None | YES |
| execution_service | None | YES (via DBConnector) |

## 3.3 ExecutionEngine Internal Dependencies

| Component | Depends On |
|-----------|-----------|
| ExecutionEngine | ConnectionResolver |
| ExecutionEngine | MappingResolver |
| ExecutionEngine | AutoRuleDiscovery |
| ExecutionEngine | RuleExecutor |
| ExecutionEngine | ControlExecutor |
| ExecutionEngine | ScoringEngine |
| ExecutionEngine | connection_factory |
| ExecutionEngine | DBConnector |

---

# 4. Frontend Dependencies

## 4.1 Hook → API Dependencies

| Hook | API Endpoint | Response Wrapper |
|------|-------------|-----------------|
| useTasks | `/api/v1/tasks/` | `{success, data: {tasks, total}}` |
| useMyTasks | `/api/v1/tasks/my/list` | `{success, data: {tasks, total}}` |
| useTask | `/api/v1/tasks/{id}` | `{success, data: Task}` |
| useWorkflows | `/api/v1/workflows/` | `{success, data: {workflows, total}}` |
| useWorkflow | `/api/v1/workflows/{id}` | `{success, data: Workflow}` |
| useNotifications | `/api/v1/notifications/` | `{success, data: {notifications, total}}` |
| useUnreadCount | `/api/v1/notifications/unread/count` | `{success, data: {count}}` |
| useEvents | `/api/v1/calendar/events` | `{success, data: {events, total}}` |
| useUpcomingEvents | `/api/v1/calendar/events/upcoming/list` | `{success, data: []}` |

## 4.2 Portal → Hook Dependencies

| Portal Page | Uses Hooks |
|-------------|-----------|
| TaskDashboard | useTasks, useNotifications, useWorkflows, useUnreadCount |
| MyTasks | useMyTasks |
| AllTasks | useTasks |
| TaskWorkflows | useWorkflows |
| TaskApprovals | (static data) |
| TaskCalendar | useEvents, useUpcomingEvents |
| TaskNotifications | useNotifications |

## 4.3 Auth Flow Dependencies

```
LoginPage → AuthProvider.login()
  → fetch('/api/v1/auth/login')
  → AuthService.login() [env vars]
  → JWT encode
  → Return access_token
  → AuthProvider stores in localStorage('access_token')
  → ProtectedRoute checks isAuthenticated
  → api/client.ts reads localStorage('access_token')
  → Sends Authorization: Bearer <token>
  → dependencies.py verifies JWT
```

---

# 5. Database Object Dependencies

## 5.1 Views Depending on Tables

| View | Depends On Tables | Schema |
|------|------------------|--------|
| v_batch_governance_summary | migration_batch_summary, migration_governance_status | engine |
| v_batch_monitor | migration_batch_registry, migration_control_execution | engine |
| v_dataset_risk_heatmap | (complex query) | engine |
| v_dataset_risk_index | (complex query) | engine |
| v_execution_anomalies | batch_anomaly_analysis | engine |
| v_migration_health_dashboard | (complex query) | engine |
| v_migration_score_trend | unified_scores, migration_score_summary | engine |
| v_migration_stability_score | unified_scores | engine |
| v_rule_failure_analysis | migration_control_execution, rule_registry | engine |
| v_rule_failure_trend | migration_control_execution | engine |
| v_slowest_controls | migration_control_execution | engine |

## 5.2 Missing View Dependencies

| Expected View | Should Query | Status |
|--------------|-------------|--------|
| Executive Dashboard | core.projects, engine.migration_batch_summary | MISSING |
| Validation Summary | engine.migration_control_summary | MISSING |
| Governance Report | engine.migration_governance_status | MISSING |
| Tenant Usage | platform.users, core.tenants | MISSING |

---

# 6. External Dependencies

| Component | External Dependency | Status |
|-----------|-------------------|--------|
| Backend | PostgreSQL (127.0.0.1:5432) | Configured |
| Backend | python-dotenv | Installed |
| Backend | FastAPI | Installed |
| Backend | python-jose (JWT) | Installed |
| Backend | psycopg2 | Installed |
| Frontend | React | Installed |
| Frontend | Vite | Installed |
| Frontend | Tailwind CSS | Installed |
| Frontend | React Router | Installed |
| Frontend | Lucide React | Installed |
| Frontend | Recharts | Installed |

---

*Generated by Architecture Compliance Audit Framework v1.0*
