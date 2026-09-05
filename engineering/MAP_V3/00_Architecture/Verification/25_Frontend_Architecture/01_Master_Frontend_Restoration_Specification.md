# Master Frontend Restoration Specification

> **Revision 4** — 2026-07-27
> **Revision 3** — 2026-07-27
> **Revision 2** — 2026-07-27
> **Revision 1** — 2026-07-27 (Initial reconciliation)
> **Status:** Master document for Phase 09 Frontend Restoration

---

## Purpose

This document is the **Master Frontend Restoration Specification**. Every Phase 09 prompt must reference this document.

> "Restore [Screen] according to Section [X] of the Master Frontend Restoration Specification."

No duplicated instructions. Single source of truth.

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Revision History

| Revision | Date | Changes |
|----------|------|---------|
| 1 | 2026-07-27 | Initial reconciliation — Steps 1-4, Traceability Chain |
| 2 | 2026-07-27 | Added Steps 5-11: Screen→Component, UX Behaviours, Permissions, State Management, Navigation, Entity Relationships, Restoration Confidence |
| 3 | 2026-07-27 | Added Steps 12-19: Component Library, Design System, API Contracts, Error Codes, Route Map, Feature Flags, Restoration Order, Acceptance Criteria |
| 4 | 2026-07-27 | Added Steps 20-29: State Machines, Component Ownership, API Versioning, Event Flow, Error Recovery, Performance, Accessibility, Testing, Responsive, Design Tokens |

---

# Step 1 — Inventory Existing Frontend Policies

| Workstream | Prompt Files | UI Maturity | Key Components Defined |
|------------|-------------|-------------|------------------------|
| WS01 — Platform Foundation | 000-007 (8 files) | Fully specified | Login, Theme System, Navigation, Layout/Shell, Dashboard Framework, Widget Framework |
| WS02 — Portal Framework | 008-015 (8 files) | Fully specified | Portal Framework, Executive Portal, Operations Portal, Migration Portal, Governance Portal, Reporting Portal, Security Portal, Administration Portal |
| WS03 — Presentation Engine | 016-020 (5 files) | Fully specified | HTML Reporting, Report Centre, Report Viewer, Report Scheduler, Report Distribution |
| WS05 — Frontend | 026-030 (5 files) | Draft | Workflow Framework, Approval Workflows, Notifications, Task Manager, Calendar |
| WS06 — Frontend | 041-045 (5 files) | Draft | User Management, Role Management, Tenant Management, Subscription Management, System Settings |
| WS07 — AI Provider Integration | 036-040 (5 files) | Draft | AI Provider Framework, Local AI Providers, Cloud AI Providers, AI Provider Administration, AI Model Management |

---

# Step 2 — Capability Mapping Matrix

| Workstream | Capability | Frozen UI | MAP CLI Backend | Decision |
|------------|-----------|-----------|-----------------|----------|
| WS01 | Login/Auth | ✅ Exists | Required (`/auth/login`) | Restore |
| WS01 | Theme System | ✅ Exists | Platform (no API) | Restore |
| WS01 | Navigation | ✅ Exists | Platform (no API) | Restore |
| WS01 | Application Shell | ✅ Exists | Platform (no API) | Restore |
| WS01 | Dashboard | ✅ Exists | Core MAP CLI (`/dashboard/*`) | Restore |
| WS02 | Migration Portal | ✅ Exists | Core MAP CLI (`/execution/*`) | Restore |
| WS02 | Governance Portal | ✅ Exists | Core MAP CLI (`/governance/*`) | Restore |
| WS02 | Operations Portal | ✅ Exists | Core MAP CLI (`/monitoring/*`) | Restore |
| WS02 | Administration Portal | ✅ Exists | Platform (`/users/*`, `/roles/*`, `/settings/*`) | Restore |
| WS03 | Report Centre | ⚠️ Stub | ⚠️ Phase 07.6.1 | Defer |
| WS05 | Workflow | ✅ Exists | Platform (`/workflows/*`) | Restore |
| WS05 | Approvals | ✅ Exists | Platform (`/approvals/*`) | Restore |
| WS05 | Notifications | ✅ Exists | Platform (`/notifications/*`) | Restore |
| WS05 | Task Manager | ✅ Exists | Platform (`/tasks/*`) | Restore |
| WS05 | Calendar | ✅ Exists | Platform (`/calendar/*`) | Restore |
| WS06 | User Management | ✅ Exists | Platform (`/users/*`) | Restore |
| WS06 | Role Management | ✅ Exists | Platform (`/roles/*`) | Restore |
| WS06 | System Settings | ✅ Exists | Platform (`/settings/*`) | Restore |
| WS07 | AI Providers | ❌ Not MVP | Not implemented | Defer |

---

# Step 2A — Data Mapping Matrix

| Frontend Page | API Endpoint | Service | Repository | Table(s) | Columns | Mapping Rules | MAP CLI Source | Business Capability |
|---------------|-------------|---------|------------|----------|---------|---------------|----------------|---------------------|
| DashboardPage.tsx | `GET /api/v1/dashboard/portfolio` | DashboardService | DashboardRepository | `core.system_registry`, `engine.migration_batch_registry`, `engine.control_registry` | Various count queries | `COUNT(*)` → `total_systems`, `total_batches`, `total_controls` | `system_repository.py`, `execution_engine.py`, SQL DDL | Portfolio summary |
| DashboardPage.tsx | `GET /api/v1/dashboard/activity` | DashboardService | DashboardRepository | `engine.migration_control_execution` | `execution_status, control_id, rule_id, created_at` | `execution_status` → `action`, `control_id` → `entity_type` | `rule_executor.py:_log_rule_execution` | Activity feed |
| GovernancePage.tsx | `GET /api/v1/governance/compliance` | GovernanceService | GovernanceRepository | `engine.migration_control_summary` | `overall_status, total_rules, passed_rules, failed_rules` | Aggregate compliance score | `rule_executor.py:_log_control_summary` | Compliance status |
| GovernancePage.tsx | `GET /api/v1/governance/audit` | GovernanceService | GovernanceRepository | `engine.migration_control_execution` | `execution_status, control_id, rule_id, created_at` | `execution_status` → `action` | `rule_executor.py:_log_rule_execution` | Audit trail |
| GovernancePage.tsx | `GET /api/v1/governance/approvals` | GovernanceService | GovernanceRepository | `engine.migration_release_decision` | `gate_result, approved_by, client_name, batch_id` | `gate_result` → `status` | `execution_engine.py:_enforce_release_gate` | Release decisions |
| GovernancePage.tsx | `GET /api/v1/governance/exceptions` | GovernanceService | GovernanceRepository | `engine.migration_control_exceptions` | `cause, failure_scope, control_id, rule_id` | `cause` → `reason` | `rule_executor.py:_log_exception` | Control exceptions |
| MigrationPage.tsx | `POST /api/v1/execution/run` | ExecutionService | ExecutionControlRepository | `engine.migration_batch_registry` | `batch_id, batch_status, project_id` | INSERT with status QUEUED | `execution_engine.py:_register_batch` | Trigger execution |
| ExecutionHistoryPage.tsx | `GET /api/v1/execution/history` | ExecutionHistoryService | ExecutionControlRepository | `engine.migration_batch_registry` | `batch_id, batch_status, project_id, created_at` | SELECT all ORDER BY created_at DESC | `execution_engine.py:_register_batch` | List batch runs |
| OperationsPage.tsx | `GET /api/v1/monitoring/*` | MonitoringService | MonitoringRepository | `engine.migration_batch_registry`, `engine.migration_control_exceptions`, `engine.migration_control_execution` | Various | Aggregate stats | `execution_engine.py`, `rule_executor.py` | Operations monitoring |
| TaskManagementPage.tsx | `GET /api/v1/tasks/` | TaskService | TaskRepository | `platform.tasks` | `id, title, status, priority, assigned_to, created_at` | SELECT all tasks | `task_service.py:create_task` | Task management |
| WorkflowsPage.tsx | `GET /api/v1/workflows/` | WorkflowService | WorkflowRepository | `platform.workflow_definitions` | `id, name, description, status, created_at` | SELECT all workflows | `workflow_service.py:create_workflow` | Workflow management |
| NotificationsPage.tsx | `GET /api/v1/notifications/` | NotificationService | NotificationRepository | `platform.notifications` | `id, title, message, is_read, created_at` | SELECT all notifications | Seed data | Notifications |
| CalendarPage.tsx | `GET /api/v1/calendar/events` | CalendarService | CalendarRepository | `platform.calendar_events` | `id, title, event_date, event_type, created_at` | SELECT all events | `calendar_service.py:create_event` | Calendar events |
| UsersPage.tsx | `GET /api/v1/users/` | UserService | UserRepository | `platform.users` | `id, email, full_name, is_active, created_at` | SELECT all users | `user_service.py:create_user` | User management |
| RolesPage.tsx | `GET /api/v1/roles/` | RoleService | RoleRepository | `platform.roles` | `id, name, description, created_at` | SELECT all roles | `role_service.py:create_role` | Role management |
| SettingsPage.tsx | `GET /api/v1/settings/` | SettingsService | SettingsRepository | `platform.system_settings` | `id, category, setting_key, setting_value` | SELECT all settings | Seed data | System settings |

---

# Step 2B — Source of Truth Verification

| Table | Rows | Last Populated | Python Source | Status |
|-------|------|----------------|---------------|--------|
| `core.system_registry` | 3 | 2026-04-24 | `system_repository.py:insert` (line 19) | ✅ Authoritative |
| `engine.control_registry` | 10 | 2026-03-08 | SQL DDL (`install_governance_tables.sql`) | ✅ Authoritative |
| `engine.migration_batch_registry` | 543 | 2026-07-25 | `execution_engine.py:_register_batch` (line 1113) | ✅ Authoritative |
| `engine.migration_control_execution` | 7,267 | 2026-07-25 | `rule_executor.py:_log_rule_execution` (line 386) | ✅ Authoritative |
| `engine.migration_control_summary` | 3,625 | 2026-07-25 | `rule_executor.py:_log_control_summary` (line 301) | ✅ Authoritative |
| `engine.migration_control_exceptions` | 2,482 | 2026-07-25 | `rule_executor.py:_log_exception` (line 413) | ✅ Authoritative |
| `engine.migration_release_decision` | 13 | 2026-03-10 | `execution_engine.py:_enforce_release_gate` (line 759) | ✅ Authoritative |
| `engine.migration_governance_status` | 524 | 2026-07-25 | `execution_engine.py:_evaluate_governance` (line 865) | ✅ Authoritative |
| `engine.migration_validation_batch` | 21 | Unknown | `execution_engine.py:_create_batch` (line 496) | ✅ Authoritative |
| `platform.users` | 1 | 2026-07-12 | `user_service.py:create_user` (line 76) | ✅ Authoritative |
| `platform.roles` | 6 | 2026-07-12 | `role_service.py:create_role` (line 66) | ✅ Authoritative |
| `platform.tasks` | 8 | 2026-07-12 | `task_service.py:create_task` (line 89) | ✅ Authoritative |
| `platform.notifications` | 5 | 2026-07-12 | Seed data | ✅ Authoritative |
| `platform.workflow_definitions` | 4 | 2026-07-12 | `workflow_service.py:create_workflow` (line 83) | ✅ Authoritative |
| `platform.system_settings` | 15 | 2026-07-12 | Seed data | ✅ Authoritative |
| `platform.feature_flags` | 6 | 2026-07-12 | Seed data | ✅ Authoritative |
| `platform.approval_requests` | 0 | N/A | `approval_service.py:create_approval` (line 85) | ⚠️ Empty |
| `platform.calendar_events` | 0 | N/A | `calendar_service.py:create_event` (line 84) | ⚠️ Empty |
| `platform.workflow_instances` | 0 | N/A | `workflow_service.py:execute_workflow` (line 157) | ⚠️ Empty |

---

# Step 3 — Three Product Layers

## Layer 1 — MAP CLI Product Core

| Component | Frozen UI | Backend API | Status | Phase 09 Action |
|-----------|-----------|-------------|--------|-----------------|
| Migration Execution | MigrationPage.tsx | `POST /api/v1/execution/run` | Active | Restore |
| Migration History | ExecutionHistoryPage.tsx | `GET /api/v1/execution/history` | Active | Restore |
| Discovery | DiscoveryPage.tsx | `GET /api/v1/discovery/*` | Active | Restore |
| Validation | ValidationPage.tsx | `POST /api/v1/validation/*` | Active | Restore |
| Validation Results | ValidationResultsPage.tsx | `GET /api/v1/execution/:batchId/*` | Active | Restore |
| Controls | GovernancePage.tsx (Controls tab) | `GET /api/v1/governance/controls` | Active | Restore |
| Exceptions | GovernancePage.tsx (Exceptions tab) | `GET /api/v1/governance/exceptions` | Active | Restore |
| Governance | GovernancePage.tsx | `GET /api/v1/governance/*` | Active | Restore |
| Compliance | GovernancePage.tsx (Compliance tab) | `GET /api/v1/governance/compliance` | Active | Restore |
| Audit | GovernancePage.tsx (Audit tab) | `GET /api/v1/governance/audit` | Active | Restore |
| Approvals | GovernancePage.tsx (Approvals tab) | `GET /api/v1/governance/approvals` | Active | Restore |
| Reporting | ReportsPage.tsx (stub) | ⚠️ Phase 07.6.1 | Stub | Defer |
| Risk | GovernancePage.tsx (Risk tab) | ⚠️ B-07 Blocked | Blocked | Defer |

## Layer 2 — MAP Platform

| Component | Frozen UI | Backend API | Status | Phase 09 Action |
|-----------|-----------|-------------|--------|-----------------|
| Authentication | LoginPage.tsx | `POST /api/v1/auth/login` | Active | Restore |
| Users | UsersPage.tsx | `GET /api/v1/users/*` | Active | Restore |
| Roles | RolesPage.tsx | `GET /api/v1/roles/*` | Active | Restore |
| Tasks | TaskManagementPage.tsx | `GET /api/v1/tasks/*` | Active | Restore |
| Workflows | WorkflowsPage.tsx | `GET /api/v1/workflows/*` | Active | Restore |
| Notifications | NotificationsPage.tsx | `GET /api/v1/notifications/*` | Active | Restore |
| Calendar | CalendarPage.tsx | `GET /api/v1/calendar/events` | Active | Restore |
| Approvals (Platform) | ApprovalsPage.tsx | `GET /api/v1/approvals/*` | Active | Restore |
| Settings | SettingsPage.tsx | `GET /api/v1/settings/*` | Active | Restore |
| Systems | SystemsPage.tsx | `GET /api/v1/systems/*` | Active | Restore |
| Dashboard | DashboardPage.tsx | `GET /api/v1/dashboard/*` | Active | Restore |
| Operations | OperationsPage.tsx | `GET /api/v1/monitoring/*` | Active | Restore |

## Layer 3 — Future Enhancements

| Component | Status | Decision |
|-----------|--------|----------|
| AI Assistant | Not implemented | Defer |
| AI Recommendations | Not implemented | Defer |
| AI Providers | Not implemented | Defer |
| Security Portal | Not implemented | Defer |
| Report Centre | Not implemented | Defer |
| Tenant Management | Not in UI | Future |
| Subscriptions | Not in UI | Future |

---

# Step 4 — Phase 09 Definition

**Phase 09 = Frontend Restoration**

Not: Build frontend

But: Restore frozen enterprise frontend using validated Workstream policies and connect to Phase 08 backend APIs.

| Priority | Component | Frontend Page | Backend API | Action |
|----------|-----------|---------------|-------------|--------|
| **P0** | Authentication | LoginPage.tsx | `POST /api/v1/auth/login` | Restore login, token persistence, role switching |
| **P0** | App Shell | Shell.tsx, Layout.tsx | N/A | Restore sidebar, header, breadcrumbs, navigation |
| **P0** | Dashboard | DashboardPage.tsx | `GET /api/v1/dashboard/*` | Restore portfolio summary, activity feed |
| **P0** | Migration | MigrationPage.tsx | `POST /api/v1/execution/run` | Restore execution, add history |
| **P0** | Validation | ValidationPage.tsx, ValidationResultsPage.tsx | `GET /api/v1/validation/*` | Restore execution, enhance results |
| **P0** | Governance | GovernancePage.tsx | `GET /api/v1/governance/*` | Restore 7-tab governance page |
| **P0** | Operations | OperationsPage.tsx | `GET /api/v1/monitoring/*` | Restore monitoring, health, alerts |
| **P1** | Tasks | TaskManagementPage.tsx, TaskDetailPage.tsx | `GET /api/v1/tasks/*` | Restore CRUD + comments |
| **P1** | Workflows | WorkflowsPage.tsx | `GET /api/v1/workflows/*` | Restore CRUD + execute |
| **P1** | Notifications | NotificationsPage.tsx | `GET /api/v1/notifications/*` | Restore list, mark-read, delete |
| **P1** | Calendar | CalendarPage.tsx | `GET /api/v1/calendar/events` | Restore CRUD |
| **P1** | Approvals | ApprovalsPage.tsx | `GET /api/v1/approvals/*` | Restore list, approve/reject |
| **P1** | Users/Roles | UsersPage.tsx, RolesPage.tsx | `GET /api/v1/users/*`, `GET /api/v1/roles/*` | Restore CRUD + permissions |
| **P1** | Settings | SettingsPage.tsx | `GET /api/v1/settings/*` | Restore settings + feature flags |
| **P2** | Systems | SystemsPage.tsx, SystemDetailPage.tsx | `GET /api/v1/systems/*` | Restore list, detail, test connection |
| **P2** | Reports | ReportsPage.tsx | ⚠️ Phase 07.6.1 | Stub with "Coming Soon" |
| **P2** | Mapping | MappingPage.tsx | ❌ Not implemented | Stub with "Coming Soon" |

---

# Step 5 — Screen → Component Hierarchy

## DashboardPage

```
DashboardPage
   ├── ExecutiveSummaryCards
   │   ├── TotalSystemsCard
   │   ├── TotalBatchesCard
   │   ├── TotalControlsCard
   │   └── ActiveBatchesCard
   ├── QuickActions
   │   ├── ManageSystemsButton
   │   ├── StartMigrationButton
   │   └── ViewOperationsButton
   └── ActivityFeed
       ├── ActivityTable
       │   ├── ActionColumn (PASS/FAIL badge)
       │   ├── ControlColumn
       │   ├── EntityColumn
       │   └── TimeColumn
       └── EmptyState ("No recent activity")
```

## MigrationPage

```
MigrationPage
   ├── TabBar
   │   ├── ExecutionTab
   │   └── HistoryTab
   ├── ExecutionTab
   │   ├── StartMigrationForm
   │   │   ├── ProjectIdInput
   │   │   └── StartMigrationButton
   │   └── ProgressSection
   │       ├── ProgressBar
   │       ├── StatusBadge
   │       ├── TotalControlsCount
   │       ├── CompletedCount
   │       ├── FailedCount
   │       └── PollingIndicator
   └── HistoryTab
       ├── HistoryList
       │   ├── HistoryItem (batch_id, project_id, controls, status)
       │   └── ...
       ├── Pagination
       │   ├── PreviousButton
       │   ├── PageIndicator
       │   └── NextButton
       └── EmptyState ("No executions yet")
```

## GovernancePage

```
GovernancePage
   ├── TabBar
   │   ├── OverviewTab
   │   ├── ComplianceTab
   │   ├── ControlsTab
   │   ├── ExceptionsTab
   │   ├── RiskTab
   │   ├── AuditTab
   │   └── ApprovalsTab
   ├── OverviewTab
   │   └── ComplianceCards
   │       ├── ComplianceScoreCard
   │       ├── TotalControlsCard
   │       ├── PassedControlsCard
   │       └── FailedControlsCard
   ├── ComplianceTab
   │   └── ComplianceDetails
   ├── ControlsTab
   │   └── EmptyState ("No controls configured")
   ├── ExceptionsTab
   │   └── ExceptionList
   │       ├── ExceptionItem (entity_type, reason)
   │       └── ...
   ├── RiskTab
   │   └── EmptyState ("No risk data available")
   ├── AuditTab
   │   ├── SearchFilter
   │   ├── TypeFilter (All/Migration Batch/System/Rule)
   │   └── AuditList
   │       ├── AuditEntry (action, entity_type, user_email, timestamp)
   │       └── ...
   └── ApprovalsTab
       └── ApprovalList
           ├── ApprovalItem (entity_type, entity_id, status badge)
           └── ...
```

## OperationsPage

```
OperationsPage
   ├── TabBar
   │   ├── MonitoringTab
   │   ├── AlertsTab
   │   ├── SchedulesTab
   │   ├── RetryTab
   │   └── HealthTab
   ├── MonitoringTab
   │   ├── SystemHealthCard
   │   │   ├── DatabaseIndicator
   │   │   └── APIIndicator
   │   ├── ActiveQueueCard
   │   │   └── QueueItemList
   │   └── RecentExecutionsCard
   │       └── ExecutionItemList
   ├── AlertsTab
   │   └── AlertList
   │       ├── AlertItem (severity badge, message, timestamp)
   │       └── ...
   ├── SchedulesTab
   │   └── EmptyState ("No scheduled tasks")
   ├── RetryTab
   │   └── EmptyState ("No items in retry queue")
   └── HealthTab
       └── HealthDetails
           ├── DatabaseConnectionStatus
           ├── APIServiceStatus
           └── LastCheckTimestamp
```

## NotificationsPage

```
NotificationsPage
   ├── Header
   │   ├── Title
   │   └── MarkAllReadButton
   ├── Filters
   │   ├── TypeFilter (All/Info/Success/Warning/Error)
   │   └── ReadFilter (All/Unread/Read)
   ├── NotificationList
   │   ├── NotificationItem
   │   │   ├── NotificationIcon
   │   │   ├── NotificationContent
   │   │   │   ├── Title (bold if unread)
   │   │   │   ├── Message
   │   │   │   ├── TypeBadge
   │   │   │   └── Timestamp
   │   │   └── Actions
   │   │       ├── MarkReadButton (if unread)
   │   │       └── DeleteButton
   │   └── ...
   ├── Pagination
   │   ├── PreviousButton
   │   ├── PageIndicator
   │   └── NextButton
   └── EmptyState ("No notifications")
```

## TaskManagementPage

```
TaskManagementPage
   ├── Header
   │   ├── Title
   │   └── CreateTaskButton
   ├── Filters
   │   ├── StatusFilter (All/Pending/In Progress/Done/Blocked)
   │   └── PriorityFilter (All/High/Medium/Low)
   ├── TaskTable
   │   ├── TableHeader (Title, Status, Priority, Assigned To, Due Date, Actions)
   │   └── TaskRows
   │       ├── TaskRow
   │       │   ├── TitleLink (navigates to /tasks/:id)
   │       │   ├── StatusBadge
   │       │   ├── PriorityBadge
   │       │   ├── AssignedTo
   │       │   ├── DueDate
   │       │   └── Actions (View, Delete)
   │       └── ...
   ├── Pagination
   │   ├── PreviousButton
   │   ├── PageIndicator
   │   └── NextButton
   ├── EmptyState ("No tasks found")
   └── CreateTaskModal
       ├── TitleInput
       ├── DescriptionTextarea
       ├── PrioritySelect
       ├── AssignedToInput
       └── ModalActions (Cancel, Create)
```

---

# Step 6 — UX Behaviour Specification

## DashboardPage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| ExecutiveSummaryCards | Loads automatically | On page mount via `GET /dashboard/portfolio` |
| ExecutiveSummaryCards | Refresh | Manual (no auto-refresh) |
| ExecutiveSummaryCards | Empty state | Show "—" dash placeholders |
| ExecutiveSummaryCards | Loading state | Skeleton loader |
| ActivityFeed | Loads automatically | On page mount via `GET /dashboard/activity?limit=5` (executive roles only) |
| ActivityFeed | Refresh | Manual (no auto-refresh) |
| ActivityFeed | Empty state | "No recent activity" message |
| ActivityFeed | Loading state | Skeleton loader |
| QuickActions | Role-based visibility | "Manage Systems" visible to admin, "Start Migration" visible to admin/manager |
| QuickActions | Navigation | Click navigates to target page |

## MigrationPage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| TabBar | Switch between Execution and History | URL not updated (state only) |
| StartMigrationForm | Input validation | Project ID required (defaults to "default") |
| StartMigrationForm | Button disabled during execution | Disabled when `running` or `polling` is true |
| StartMigrationForm | Button text changes | "Start Migration" → "Starting..." → "Migration Running..." |
| ProgressSection | Auto-polling | Polls `GET /execution/status/:batchId` every 2 seconds |
| ProgressSection | Progress bar | Shows percentage based on completed/total controls |
| ProgressSection | Status badge | Color-coded: COMPLETED (green), RUNNING (blue), FAILED (red) |
| ProgressSection | Polling indicator | Shows spinner + "Polling for updates..." |
| HistoryTab | Loads on tab switch | Fetches history on tab change |
| HistoryTab | Pagination | Previous/Next buttons, page indicator |
| HistoryTab | Empty state | "No executions yet" message |
| HistoryTab | Item click | N/A (no detail view in MVP) |

## GovernancePage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| TabBar | URL-driven routing | `/governance/overview`, `/governance/compliance`, etc. |
| ComplianceCards | Loads automatically | On tab mount via `GET /governance/compliance` |
| ComplianceCards | Refresh | Manual (no auto-refresh) |
| ComplianceCards | Empty state | "—" dash placeholders |
| AuditTab | Loads on tab switch | Fetches audit entries via `GET /governance/audit?limit=50` |
| AuditTab | Search | Text filter on action, entity_type, user_email |
| AuditTab | Type filter | Dropdown: All Types, Migration Batch, System, Rule |
| AuditTab | Empty state | "No audit entries found" |
| ApprovalsTab | Loads on tab switch | Fetches approvals via `GET /governance/approvals` |
| ApprovalsTab | Empty state | "No pending approvals" |
| ApprovalsTab | Status badge | Color-coded status display |
| ExceptionsTab | Loads on tab switch | Fetches exceptions via `GET /governance/exceptions` |
| ExceptionsTab | Empty state | "No active exceptions" |
| RiskTab | Empty state | "No risk data available" (B-07 blocked) |

## OperationsPage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| TabBar | Switch between 5 tabs | Monitoring, Alerts, Schedules, Retry, Health |
| MonitoringTab | Loads on tab switch | Fetches health, monitoring, and execution history |
| SystemHealthCard | Health indicators | Green/red dots for Database and API |
| ActiveQueueCard | Empty state | "No active items in queue" |
| RecentExecutionsCard | Shows last 5 | Sliced from execution history |
| AlertsTab | Loads on tab switch | Fetches alerts via `GET /monitoring/alerts` |
| AlertsTab | Severity badges | Color-coded: critical (red), warning (yellow), info (blue) |
| AlertsTab | Empty state | "No active alerts" |
| HealthTab | Loads on tab switch | Fetches health via `GET /monitoring/health` |
| HealthTab | Status display | "Healthy"/"Unhealthy" for each component |

## NotificationsPage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| Header | Mark All Read | Button calls `PUT /notifications/read-all`, then refetches |
| Header | Button text changes | "Mark All as Read" → "Marking..." during operation |
| Filters | Type filter | Dropdown: All Types, Info, Success, Warning, Error |
| Filters | Read filter | Dropdown: All Status, Unread, Read |
| Filters | Reset page on filter change | Page resets to 1 when filter changes |
| NotificationList | Unread indicator | Bold title + blue dot for unread items |
| NotificationList | Background color | Light blue background for unread items |
| NotificationList | Mark Read button | Only shown for unread items, calls `PUT /notifications/:id/read` |
| NotificationList | Delete button | Shows confirm dialog, calls `DELETE /notifications/:id` |
| NotificationList | Type icon | Info (i), Success (check), Warning (warning), Error (x), Default (bell) |
| NotificationList | Type badge | Color-coded type text |
| Pagination | 20 items per page | Previous/Next buttons |
| Empty state | Filter-aware | "Try different filters" if filters active, else "You're all caught up!" |

## TaskManagementPage

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| Header | Create Task button | Opens create modal |
| Filters | Status filter | Dropdown: All Status, Pending, In Progress, Done, Blocked |
| Filters | Priority filter | Dropdown: All Priority, High, Medium, Low |
| Filters | Reset page on filter change | Page resets to 1 when filter changes |
| TaskTable | Title link | Click navigates to `/tasks/:id` |
| TaskTable | Status badge | Color-coded: done (green), in_progress (blue), pending (yellow), blocked (red) |
| TaskTable | Priority badge | Color-coded: high (red), medium (yellow), low (green) |
| TaskTable | View button | Navigates to `/tasks/:id` |
| TaskTable | Delete button | Shows confirm dialog, calls `DELETE /tasks/:id` |
| Pagination | 20 items per page | Previous/Next buttons |
| Empty state | Filter-aware | "Try different filters" if filters active, else "Create your first task to get started" |
| CreateTaskModal | Title input | Required field |
| CreateTaskModal | Description textarea | Optional field |
| CreateTaskModal | Priority select | Low, Medium (default), High |
| CreateTaskModal | Assigned To input | Optional field (user ID) |
| CreateTaskModal | Submit button | Disabled when creating or title empty |
| CreateTaskModal | Cancel button | Closes modal |

---

# Step 7 — Permissions Matrix

## Dashboard

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Executive Summary | ✅ | ✅ | ✅ | ✅ | `GET /dashboard/portfolio` |
| View Activity Feed | ✅ | ✅ | ✅ | ❌ | `GET /dashboard/activity` |
| Quick Actions - Manage Systems | ✅ | ❌ | ❌ | ❌ | N/A (navigation) |
| Quick Actions - Start Migration | ✅ | ✅ | ❌ | ❌ | N/A (navigation) |
| Quick Actions - View Operations | ✅ | ✅ | ✅ | ✅ | N/A (navigation) |

## Migration

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Migration Page | ✅ | ✅ | ❌ | ❌ | N/A |
| Start Migration | ✅ | ✅ | ❌ | ❌ | `POST /execution/run` |
| View Progress | ✅ | ✅ | ❌ | ❌ | `GET /execution/status/:batchId` |
| View History | ✅ | ✅ | ❌ | ❌ | `GET /execution/history` |

## Governance

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Governance Page | ✅ | ✅ | ✅ | ❌ | N/A |
| View Compliance | ✅ | ✅ | ✅ | ❌ | `GET /governance/compliance` |
| View Audit Log | ✅ | ✅ | ✅ | ❌ | `GET /governance/audit` |
| View Approvals | ✅ | ✅ | ❌ | ❌ | `GET /governance/approvals` |
| Approve/Reject | ✅ | ❌ | ❌ | ❌ | `PUT /governance/approvals/:id` |
| View Exceptions | ✅ | ✅ | ✅ | ❌ | `GET /governance/exceptions` |

## Operations

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Operations Page | ✅ | ✅ | ✅ | ❌ | N/A |
| View Monitoring | ✅ | ✅ | ✅ | ❌ | `GET /monitoring/*` |
| View Alerts | ✅ | ✅ | ✅ | ❌ | `GET /monitoring/alerts` |
| View Health | ✅ | ✅ | ❌ | ❌ | `GET /monitoring/health` |

## Tasks

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Tasks | ✅ | ✅ | ✅ | ✅ | `GET /tasks/` |
| Create Task | ✅ | ✅ | ❌ | ❌ | `POST /tasks/` |
| Delete Task | ✅ | ✅ | ❌ | ❌ | `DELETE /tasks/:id` |

## Notifications

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Notifications | ✅ | ✅ | ✅ | ✅ | `GET /notifications/` |
| Mark Read | ✅ | ✅ | ✅ | ✅ | `PUT /notifications/:id/read` |
| Mark All Read | ✅ | ✅ | ✅ | ✅ | `PUT /notifications/read-all` |
| Delete Notification | ✅ | ✅ | ✅ | ✅ | `DELETE /notifications/:id` |

## Settings

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Settings | ✅ | ❌ | ❌ | ❌ | `GET /settings/` |
| Edit Setting | ✅ | ❌ | ❌ | ❌ | `PUT /settings/:category/:key` |
| View Feature Flags | ✅ | ❌ | ❌ | ❌ | `GET /settings/flags/list` |
| Toggle Feature Flag | ✅ | ❌ | ❌ | ❌ | `PUT /settings/flags/:key` |

## Users

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Users | ✅ | ❌ | ❌ | ❌ | `GET /users/` |
| Create User | ✅ | ❌ | ❌ | ❌ | `POST /users/` |
| Edit User | ✅ | ❌ | ❌ | ❌ | `PUT /users/:id` |
| Delete User | ✅ | ❌ | ❌ | ❌ | `DELETE /users/:id` |

## Roles

| Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|---------|-------------|--------------|----------|--------|-----------|
| View Roles | ✅ | ❌ | ❌ | ❌ | `GET /roles/` |
| Create Role | ✅ | ❌ | ❌ | ❌ | `POST /roles/` |
| Edit Role | ✅ | ❌ | ❌ | ❌ | `PUT /roles/:id` |
| Delete Role | ✅ | ❌ | ❌ | ❌ | `DELETE /roles/:id` |
| Assign Permission | ✅ | ❌ | ❌ | ❌ | `POST /roles/:id/permissions` |

---

# Step 8 — State Management

| Screen | Loading | Empty | Partial | Offline | API Timeout | Permission Denied | No Data | Complete | Error |
|--------|---------|-------|---------|---------|-------------|-------------------|---------|----------|-------|
| Dashboard | Skeleton loader | "—" dash placeholders | Partial cards | Offline banner | Retry button | Redirect to /login | "—" placeholders | Full render | Error boundary |
| Migration | Spinner | "No executions yet" | Partial history | Offline banner | Retry button | "Access Denied" message | "No executions yet" | Full render | Error message |
| Governance | Spinner | Tab-specific empty states | Partial tabs | Offline banner | Retry button | "Access Denied" message | "No data available" | Full tabs | Error message |
| Operations | Spinner | Tab-specific empty states | Partial data | Offline banner | Retry button | "Access Denied" message | "No data" | Full render | Error message |
| Notifications | Spinner | "No notifications" | Partial list | Offline banner | Retry button | Redirect to /login | "No notifications" | Full list | Error message |
| Tasks | Spinner | "No tasks found" | Partial table | Offline banner | Retry button | "Access Denied" message | "No tasks found" | Full table | Error message |
| Settings | Spinner | "No settings" | Partial settings | Offline banner | Retry button | Redirect to /login | "No settings" | Full settings | Error message |
| Users | Spinner | "No users" | Partial list | Offline banner | Retry button | Redirect to /login | "No users" | Full list | Error message |
| Roles | Spinner | "No roles" | Partial list | Offline banner | Retry button | Redirect to /login | "No roles" | Full list | Error message |

---

# Step 9 — Navigation Relationships

```
Dashboard
   ↓ (Quick Action: Start Migration)
Migration
   ↓ (Execute)
Execution History
   ↓ (View Results)
Validation Result
   ↓ (View Governance)
Governance Decision
   ↓ (View Release)
Release Gate

Dashboard
   ↓ (Quick Action: View Operations)
Operations
   ↓ (Tab: Alerts)
Alerts
   ↓ (View Details)
Exception Details

Dashboard
   ↓ (Quick Action: Manage Systems)
Systems
   ↓ (View System)
System Detail
   ↓ (Test Connection)
Connection Test Result

Governance
   ↓ (Tab: Audit)
Audit Log
   ↓ (Filter by Control)
Control Details

Governance
   ↓ (Tab: Approvals)
Approval List
   ↓ (View Approval)
Approval Detail
   ↓ (Approve/Reject)
Approval Decision

Tasks
   ↓ (Click Task Title)
Task Detail
   ↓ (Add Comment)
Comment

Workflows
   ↓ (Execute Workflow)
Workflow Instance
   ↓ (Requires Approval)
Approval Request
```

---

# Step 10 — Entity Relationships

```
System
   ↓ (has many)
Batch
   ↓ (has many)
Control Summary
   ↓ (has many)
Rule Execution
   ↓ (may produce)
Exception
   ↓ (triggers)
Governance Decision
   ↓ (enforces)
Release Gate

User
   ↓ (has many)
Role
   ↓ (has many)
Permission

Task
   ↓ (has many)
Comment
   ↓ (assigned to)
User

Workflow
   ↓ (creates many)
Workflow Instance
   ↓ (has many)
Approval Request

Notification
   ↓ (belongs to)
User
```

---

# Step 11 — Restoration Confidence

| Screen | Frozen Exists | Backend Exists | Tables Ready | API Working | Tests Pass | Ready to Restore |
|--------|---------------|----------------|--------------|-------------|------------|------------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Migration | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Validation | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Governance | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Operations | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Workflows | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Calendar | ✅ | ✅ | ⚠️ 0 rows | ✅ | ✅ | **90%** |
| Approvals | ✅ | ✅ | ⚠️ 0 rows | ✅ | ✅ | **90%** |
| Users | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Roles | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Systems | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Reports | ⚠️ Stub | ⚠️ Stub | ⚠️ Partial | ⚠️ Partial | ✅ | **40%** |
| Mapping | ⚠️ Stub | ❌ No API | ❌ No tables | ❌ No | ✅ | **10%** |

---

# Step 12 — Component Library Standard

Reusable components that exist **once** across all screens.

## StatusBadge

| Input | Type | Description |
|-------|------|-------------|
| status | string | Current status value |
| variant | string | success/warning/danger/info |
| size | string | sm/md/lg |

**States:** loading, error, empty

## ProgressBar

| Input | Type | Description |
|-------|------|-------------|
| value | number | 0-100 percentage |
| max | number | Maximum value (default 100) |
| colour | string | Dynamic colour based on thresholds |
| label | string | Optional text overlay |

**States:** loading, error, complete (100%), partial (0-99%)

## DataTable

| Input | Type | Description |
|-------|------|-------------|
| columns | array | Column definitions with key, label, sortable, width |
| data | array | Row data |
| loading | boolean | Show skeleton rows |
| empty | boolean | Show empty state |
| pagination | object | { page, pageSize, total } |
| onSort | function | Column sort handler |
| onPageChange | function | Page change handler |

**States:** loading (skeleton), empty (EmptyState), error (ErrorState), populated

## MetricCard

| Input | Type | Description |
|-------|------|-------------|
| title | string | Card header text |
| value | string/number | Primary metric |
| colour | string | Accent colour for border/icon |
| icon | string/ReactNode | Icon component or name |
| subtitle | string | Secondary text |
| trend | object | { value, direction, period } |

**States:** loading (skeleton), error (ErrorState), empty (— placeholder)

## EmptyState

| Input | Type | Description |
|-------|------|-------------|
| title | string | "No [items] found" |
| description | string | Explanation text |
| action | ReactNode | Optional CTA button |
| icon | string | Optional icon |

## ErrorState

| Input | Type | Description |
|-------|------|-------------|
| title | string | "Something went wrong" |
| message | string | Error description |
| onRetry | function | Retry button handler |
| code | number | HTTP status code |

## LoadingSkeleton

| Input | Type | Description |
|-------|------|-------------|
| rows | number | Number of skeleton rows |
| variant | string | card/table/list/text |
| height | string | CSS height |

## SearchBar

| Input | Type | Description |
|-------|------|-------------|
| value | string | Current search text |
| onChange | function | Text change handler |
| onSearch | function | Submit handler |
| placeholder | string | Hint text |
| debounce | number | ms delay (default 300) |

## Pagination

| Input | Type | Description |
|-------|------|-------------|
| page | number | Current page (1-indexed) |
| pageSize | number | Items per page |
| total | number | Total items |
| onPageChange | function | Page change handler |

## Modal

| Input | Type | Description |
|-------|------|-------------|
| open | boolean | Show/hide |
| title | string | Modal header |
| onClose | function | Close handler |
| children | ReactNode | Content |
| footer | ReactNode | Action buttons |

## ConfirmDialog

| Input | Type | Description |
|-------|------|-------------|
| open | boolean | Show/hide |
| title | string | Confirmation text |
| message | string | Explanation |
| onConfirm | function | Confirm handler |
| onCancel | function | Cancel handler |
| variant | string | danger/warning/info |

## Toast

| Input | Type | Description |
|-------|------|-------------|
| message | string | Toast text |
| type | string | success/error/warning/info |
| duration | number | Auto-dismiss ms (default 5000) |
| onDismiss | function | Close handler |

---

# Step 13 — Design System

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| space-xs | 4px | Inline spacing, icon gaps |
| space-sm | 8px | Small component padding |
| space-md | 16px | Standard component padding |
| space-lg | 24px | Section spacing |
| space-xl | 32px | Page-level spacing |

## Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| heading-1 | 28px | 700 | Page titles |
| heading-2 | 22px | 600 | Section headers |
| heading-3 | 18px | 600 | Subsection headers |
| body | 14px | 400 | Standard text |
| caption | 12px | 400 | Metadata, timestamps |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Badges, small elements |
| radius-md | 8px | Cards, buttons, inputs |
| radius-lg | 12px | Modals, panels |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Cards, dropdowns |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals, popovers |

## Colours

| Token | Value | Usage |
|-------|-------|-------|
| colour-primary | #2563EB | Primary actions, links |
| colour-secondary | #6B7280 | Secondary text, borders |
| colour-success | #059669 | Success states, positive trends |
| colour-warning | #D97706 | Warnings, caution |
| colour-danger | #DC2626 | Errors, destructive actions |
| colour-info | #2563EB | Informational messages |
| colour-bg | #F9FAFB | Page background |
| colour-surface | #FFFFFF | Card/panel background |
| colour-border | #E5E7EB | Default borders |
| colour-text | #111827 | Primary text |
| colour-text-secondary | #6B7280 | Secondary/muted text |

---

# Step 14 — API Response Contracts

## Dashboard

### GET /api/v1/dashboard/portfolio

```json
{
  "totalSystems": 3,
  "totalBatches": 543,
  "totalControls": 10,
  "activeBatches": 2
}
```

### GET /api/v1/dashboard/kpis

```json
{
  "migrationScore": 85.5,
  "passRate": 92.3,
  "exceptionCount": 2494,
  "pendingApprovals": 13,
  "activeBatches": 2,
  "completedBatches": 541
}
```

### GET /api/v1/dashboard/activity

```json
[
  {
    "id": "uuid",
    "type": "migration_started|migration_completed|validation_run|governance_decision|exception_logged",
    "title": "Migration batch 42 started",
    "description": "System: SAP, 120 controls",
    "timestamp": "2026-07-27T10:30:00Z",
    "status": "success|warning|error|info",
    "userId": "uuid",
    "userName": "admin@mapnexus.com"
  }
]
```

### GET /api/v1/dashboard/health

```json
{
  "database": "healthy",
  "api": "healthy",
  "lastCheck": "2026-07-27T10:30:00Z",
  "uptime": 86400
}
```

## Migration

### GET /api/v1/migration/systems

```json
[
  {
    "id": "uuid",
    "name": "SAP",
    "type": "ERP",
    "controlCount": 120,
    "lastMigration": "2026-07-27T10:30:00Z",
    "status": "active|inactive|migrating"
  }
]
```

### GET /api/v1/migration/batches

```json
[
  {
    "id": "uuid",
    "systemId": "uuid",
    "systemName": "SAP",
    "batchNumber": 42,
    "controlCount": 120,
    "status": "pending|running|completed|failed",
    "startedAt": "2026-07-27T10:30:00Z",
    "completedAt": null,
    "progress": 65
  }
]
```

### POST /api/v1/migration/batches

```json
{
  "systemId": "uuid",
  "controlIds": ["uuid1", "uuid2"]
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "batchNumber": 43,
  "status": "pending"
}
```

### GET /api/v1/migration/batches/:id/history

```json
[
  {
    "id": "uuid",
    "batchId": "uuid",
    "action": "started|progress|completed|failed",
    "timestamp": "2026-07-27T10:30:00Z",
    "details": "Processed 50 of 120 controls",
    "userId": "uuid"
  }
]
```

## Governance

### GET /api/v1/governance/compliance

```json
{
  "totalControls": 3688,
  "compliant": 3200,
  "nonCompliant": 488,
  "complianceRate": 86.8,
  "bySeverity": {
    "critical": 12,
    "high": 45,
    "medium": 200,
    "low": 231
  }
}
```

### GET /api/v1/governance/audit

```json
[
  {
    "id": "uuid",
    "controlName": "SOX-001",
    "action": "execute|validate|approve|reject",
    "result": "pass|fail|skip",
    "timestamp": "2026-07-27T10:30:00Z",
    "userId": "uuid",
    "userName": "admin@mapnexus.com",
    "details": "Control executed successfully"
  }
]
```

### GET /api/v1/governance/exceptions

```json
[
  {
    "id": "uuid",
    "controlName": "SOX-001",
    "severity": "critical|high|medium|low",
    "failureScope": "OPEN|CLOSED|IN_PROGRESS",
    "description": "Control failed validation",
    "createdAt": "2026-07-27T10:30:00Z",
    "resolvedAt": null,
    "assignedTo": "admin@mapnexus.com"
  }
]
```

### GET /api/v1/governance/approvals

```json
[
  {
    "id": "uuid",
    "batchId": "uuid",
    "batchNumber": 42,
    "gateResult": "PENDING|APPROVED|REJECTED",
    "requestedAt": "2026-07-27T10:30:00Z",
    "decidedAt": null,
    "decidedBy": null,
    "comments": null
  }
]
```

## Operations

### GET /api/v1/operations/health

```json
{
  "database": "healthy",
  "api": "healthy",
  "services": {
    "migration": "healthy",
    "validation": "healthy",
    "governance": "healthy"
  },
  "lastCheck": "2026-07-27T10:30:00Z"
}
```

### GET /api/v1/operations/alerts

```json
[
  {
    "id": "uuid",
    "type": "info|warning|error|critical",
    "title": "Migration batch 42 failed",
    "message": "Control SOX-001 failed validation",
    "timestamp": "2026-07-27T10:30:00Z",
    "acknowledged": false
  }
]
```

## Notifications

### GET /api/v1/notifications

```json
[
  {
    "id": "uuid",
    "type": "info|warning|error|success",
    "title": "Migration completed",
    "message": "Batch 42 completed successfully",
    "timestamp": "2026-07-27T10:30:00Z",
    "read": false,
    "actionUrl": "/migration/batches/uuid"
  }
]
```

### PUT /api/v1/notifications/:id/read

**Response 200:** `{ "success": true }`

### PUT /api/v1/notifications/read-all

**Response 200:** `{ "success": true, "count": 5 }`

## Tasks

### GET /api/v1/tasks

```json
[
  {
    "id": "uuid",
    "title": "Review SOX-001 exception",
    "description": "Exception requires manual review",
    "status": "pending|in_progress|completed|cancelled",
    "priority": "low|medium|high|critical",
    "assignedTo": "uuid",
    "assignedToName": "admin@mapnexus.com",
    "createdAt": "2026-07-27T10:30:00Z",
    "dueAt": "2026-08-03T10:30:00Z",
    "completedAt": null
  }
]
```

### POST /api/v1/tasks

```json
{
  "title": "Review SOX-001 exception",
  "description": "Exception requires manual review",
  "assignedTo": "uuid",
  "priority": "high",
  "dueAt": "2026-08-03T10:30:00Z"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "status": "pending"
}
```

### PUT /api/v1/tasks/:id

```json
{
  "status": "completed",
  "comment": "Reviewed and resolved"
}
```

**Response 200:** `{ "success": true }`

## Settings

### GET /api/v1/settings

```json
{
  "general": {
    "applicationName": "MAP Nexus",
    "timezone": "UTC",
    "dateFormat": "YYYY-MM-DD"
  },
  "notifications": {
    "emailEnabled": true,
    "slackEnabled": false
  },
  "security": {
    "sessionTimeout": 3600,
    "mfaEnabled": false
  }
}
```

### PUT /api/v1/settings/:category/:key

```json
{
  "value": "new-value"
}
```

**Response 200:** `{ "success": true }`

## Users

### GET /api/v1/users

```json
[
  {
    "id": "uuid",
    "email": "admin@mapnexus.com",
    "name": "Admin User",
    "roles": ["Super Admin"],
    "status": "active|inactive",
    "lastLogin": "2026-07-27T10:30:00Z",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

### POST /api/v1/users

```json
{
  "email": "user@example.com",
  "name": "New User",
  "roles": ["Operator"]
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

### PUT /api/v1/users/:id

```json
{
  "roles": ["Tenant Admin"],
  "status": "active"
}
```

**Response 200:** `{ "success": true }`

### DELETE /api/v1/users/:id

**Response 200:** `{ "success": true }`

## Roles

### GET /api/v1/roles

```json
[
  {
    "id": "uuid",
    "name": "Super Admin",
    "description": "Full system access",
    "permissions": ["*"],
    "userCount": 1
  }
]
```

---

# Step 15 — Error Codes

| HTTP Code | Meaning | Frontend Behaviour |
|-----------|---------|-------------------|
| 401 | Unauthorized | Redirect to `/login` |
| 403 | Forbidden | Show "Access Denied" message |
| 404 | Not Found | Show "Not Found" page |
| 422 | Validation Error | Show inline validation messages |
| 429 | Rate Limited | Show "Too many requests" with retry timer |
| 500 | Server Error | Show error with retry button |
| 503 | Maintenance | Show maintenance banner |

## Error Response Format

```json
{
  "detail": "Human-readable error message",
  "code": "ERROR_CODE",
  "field": "optional_field_name"
}
```

## Frontend Error Handling

| Context | Behaviour |
|---------|-----------|
| Page load failure | Show ErrorState with retry button |
| Form submission failure | Show Toast with error message |
| Data fetch failure | Show ErrorState within component |
| Permission denied | Show "Access Denied" or redirect |
| Network failure | Show offline banner + retry |

---

# Step 16 — Route Map

| Path | Component | Auth Required | Roles | Feature Flag |
|------|-----------|---------------|-------|--------------|
| `/login` | LoginPage | No | — | — |
| `/` | Redirect → `/dashboard` | Yes | All | — |
| `/dashboard` | DashboardPage | Yes | All | — |
| `/dashboard/activity` | DashboardPage (Activity tab) | Yes | All | — |
| `/migration` | MigrationPage | Yes | All | — |
| `/migration/history` | MigrationPage (History tab) | Yes | All | — |
| `/migration/batches/:id` | BatchDetailPage | Yes | All | — |
| `/validation` | ValidationPage | Yes | All | — |
| `/validation/reports/:id` | ReportDetailPage | Yes | All | — |
| `/governance` | GovernancePage | Yes | All | — |
| `/governance/audit` | GovernancePage (Audit tab) | Yes | All | — |
| `/governance/compliance` | GovernancePage (Compliance tab) | Yes | All | — |
| `/governance/exceptions` | GovernancePage (Exceptions tab) | Yes | All | — |
| `/governance/approvals` | GovernancePage (Approvals tab) | Yes | Admin | — |
| `/operations` | OperationsPage | Yes | Admin | — |
| `/operations/health` | OperationsPage (Health tab) | Yes | Admin | — |
| `/operations/alerts` | OperationsPage (Alerts tab) | Yes | Admin | — |
| `/tasks` | TaskManagementPage | Yes | All | — |
| `/tasks/:id` | TaskDetailPage | Yes | All | — |
| `/workflows` | WorkflowPage | Yes | All | — |
| `/users` | UsersPage | Yes | Admin | — |
| `/roles` | RolesPage | Yes | Admin | — |
| `/settings` | SettingsPage | Yes | Admin | — |
| `/notifications` | NotificationsPage | Yes | All | — |
| `/reports` | ReportsPage | Yes | All | `reports_enabled` |
| `/mapping` | MappingPage | Yes | All | `mapping_enabled` |

---

# Step 17 — Feature Flags

| Screen | Feature Flag | Default | Behaviour When Disabled |
|--------|-------------|---------|------------------------|
| Reports | `reports_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| Mapping | `mapping_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| AI Features | `ai_enabled` | `false` | Hide AI components; no AI endpoints called |
| Advanced Workflow | `workflow_advanced` | `false` | Show basic workflow only |
| Calendar | `calendar_enabled` | `true` | Show in nav |
| Notifications | `notifications_enabled` | `true` | Show in nav |

---

# Step 18 — Screen Restoration Order

## Wave 1 — Platform Foundation

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 1.1 | LoginPage | Auth API | Low |
| 1.2 | AppShell | — | Medium |
| 1.3 | Navigation | AppShell | Low |
| 1.4 | DashboardPage | Portfolio API, Activity API | Medium |
| 1.5 | Protected Routes | Auth context | Low |

## Wave 2 — Execution

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 2.1 | MigrationPage | Systems API, Batches API | Medium |
| 2.2 | BatchDetailPage | Batch API, History API | Medium |
| 2.3 | ValidationPage | Validation API | Medium |
| 2.4 | ReportDetailPage | Report API | Low |

## Wave 3 — Governance

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 3.1 | GovernancePage | Compliance API | Medium |
| 3.2 | AuditTab | Audit API | Low |
| 3.3 | ComplianceTab | Compliance API | Low |
| 3.4 | ExceptionsTab | Exceptions API | Low |
| 3.5 | ApprovalsTab | Approvals API | Low |

## Wave 4 — Operations

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 4.1 | OperationsPage | Health API, Alerts API | Medium |
| 4.2 | HealthTab | Health API | Low |
| 4.3 | AlertsTab | Alerts API | Low |

## Wave 5 — Platform

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 5.1 | UsersPage | Users API | Medium |
| 5.2 | RolesPage | Roles API | Low |
| 5.3 | TaskManagementPage | Tasks API | Medium |
| 5.4 | NotificationsPage | Notifications API | Low |
| 5.5 | SettingsPage | Settings API | Low |

## Wave 6 — Future

| Order | Screen | Depends On | Complexity |
|-------|--------|-----------|------------|
| 6.1 | ReportsPage | Reports API | Medium |
| 6.2 | MappingPage | Mapping API | High |
| 6.3 | AIPage | AI API | High |
| 6.4 | SecurityPage | Security API | High |

---

# Step 19 — Acceptance Criteria

## DashboardPage

- [ ] Portfolio cards load with real data
- [ ] Activity feed loads with real data
- [ ] Quick actions navigate to correct pages
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (all roles can view)
- [ ] Empty states display when no data
- [ ] Responsive layout works on mobile

## MigrationPage

- [ ] Systems list loads with real data
- [ ] Batches list loads with real data
- [ ] Start migration action works
- [ ] Batch progress updates via polling
- [ ] History tab loads with real data
- [ ] Pagination works correctly
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (all roles can view)

## GovernancePage

- [ ] Compliance summary loads with real data
- [ ] Audit tab loads with real data
- [ ] Exceptions tab loads with real data
- [ ] Approvals tab loads with real data (admin only)
- [ ] Tab navigation works via URL
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (admin for approvals)

## OperationsPage

- [ ] Health status loads with real data
- [ ] Alerts list loads with real data
- [ ] Tab navigation works via URL
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (admin only)

## TaskManagementPage

- [ ] Tasks list loads with real data
- [ ] Create task action works
- [ ] Update task status works
- [ ] Task detail view loads
- [ ] Pagination works correctly
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (all roles can view)

## NotificationsPage

- [ ] Notifications list loads with real data
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Empty state displays when no notifications
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (all roles can view)

## UsersPage

- [ ] Users list loads with real data
- [ ] Create user action works
- [ ] Edit user roles works
- [ ] Delete user works with confirmation
- [ ] Pagination works correctly
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (admin only)

## SettingsPage

- [ ] Settings load with real data
- [ ] Update settings works
- [ ] Category navigation works
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (admin only)

## LoginPage

- [ ] Login form validates inputs
- [ ] Login API call works
- [ ] JWT token stored correctly
- [ ] Redirect to dashboard on success
- [ ] Error message on failure
- [ ] Rate limiting handled (5/minute)
- [ ] Loading state during auth

---

# Step 20 — State Machine Definitions

## Standard Page State Machine

```
Idle
  ↓ (onMount / fetchData)
Loading
  ↓ (fetchSuccess)
Loaded
  ├── Empty (data.length === 0)
  ├── Partial (data.length < expected)
  ├── Complete (data.length >= expected)
  └── Error (fetchFailed)
```

## Page-Specific State Machines

### DashboardPage

```
Idle → LoadingPortfolio + LoadingActivity → Loaded → (Empty | Partial | Complete) → Error → Loading
```

### MigrationPage

```
Idle → LoadingSystems + LoadingBatches → Loaded → Starting → Polling → Updating → Polling → Completed → Failed
```

### GovernancePage

```
Idle → LoadingTab → Loaded → (TabEmpty | TabData) → Error
```

### TaskManagementPage

```
Idle → LoadingTasks → Loaded → (TasksEmpty | TasksLoaded) → Creating → Created → Loading
Idle → Loaded → Deleting → Deleted → Loading
```

### NotificationsPage

```
Idle → LoadingNotifications → Loaded → (NotificationsEmpty | NotificationsLoaded) → Marking → Loaded
Idle → Loaded → MarkingAll → Loaded
```

### LoginPage

```
Idle → Authenticating → (Authenticated | Error) → RateLimited
```

---

# Step 21 — Component Ownership Matrix

| Component | Owner | Type | Shared Across |
|-----------|-------|------|---------------|
| StatusBadge | Shared | Reusable | All screens |
| ProgressBar | Shared | Reusable | Migration, Governance, Tasks |
| DataTable | Shared | Reusable | All list views |
| MetricCard | Shared | Reusable | Dashboard, Governance |
| EmptyState | Shared | Reusable | All screens |
| ErrorState | Shared | Reusable | All screens |
| LoadingSkeleton | Shared | Reusable | All screens |
| SearchBar | Shared | Reusable | Governance, Tasks, Notifications |
| Pagination | Shared | Reusable | All paginated views |
| Modal | Shared | Reusable | All modals |
| ConfirmDialog | Shared | Reusable | All delete/confirm actions |
| Toast | Shared | Reusable | All success/error notifications |
| TabBar | Shared | Reusable | Migration, Governance, Operations |
| ExecutiveSummaryCards | Dashboard | Page-specific | DashboardPage |
| ActivityFeed | Dashboard | Page-specific | DashboardPage |
| QuickActions | Dashboard | Page-specific | DashboardPage |
| ComplianceCards | Governance | Page-specific | GovernancePage |
| AuditList | Governance | Page-specific | GovernancePage |
| ExceptionList | Governance | Page-specific | GovernancePage |
| ApprovalList | Governance | Page-specific | GovernancePage |
| SystemHealthCard | Operations | Page-specific | OperationsPage |
| AlertList | Operations | Page-specific | OperationsPage |
| TaskTable | Tasks | Page-specific | TaskManagementPage |
| CreateTaskModal | Tasks | Page-specific | TaskManagementPage |
| NotificationList | Notifications | Page-specific | NotificationsPage |
| UserTable | Users | Page-specific | UsersPage |
| RoleTable | Roles | Page-specific | RolesPage |
| SettingsForm | Settings | Page-specific | SettingsPage |

---

# Step 22 — API Versioning

| Property | Value |
|----------|-------|
| Current Version | v1 |
| Base Path | `/api/v1/` |
| Versioning Strategy | URL path versioning (`/api/v1/`, `/api/v2/`) |
| Breaking Change Policy | New version required for: removing fields, renaming fields, changing field types, changing response structure |
| Non-Breaking Changes | Adding optional fields, adding new endpoints, adding new query parameters |
| Deprecation Strategy | Minimum 6 months notice, `Deprecation` header in response, documentation update |

### Deprecation Header Format

```
Deprecation: true
Sunset: 2027-01-27
Link: <https://docs.mapnexus.com/api/v2/migration>; rel="successor-version"
```

---

# Step 23 — Event Flow

## MigrationPage — Start Migration

```
Click "Start Migration" → Validate Form → Disable Button → POST /execution/run → Receive batchId → Store batchId → Begin Polling (2s) → Update Progress Bar → Progress < 100 → Continue Polling → Progress === 100 → Stop Polling → Show Toast → Refetch Dashboard
```

## GovernancePage — Tab Switch

```
Click Tab → Update URL → Fetch Tab Data → Render Tab Content
```

## TaskManagementPage — Create Task

```
Click "Create Task" → Open Modal → Fill Form → Click "Create" → Validate → POST /tasks → Close Modal → Show Toast → Refetch Tasks
```

## NotificationsPage — Mark All Read

```
Click "Mark All as Read" → Disable Button → PUT /notifications/read-all → Show Toast → Refetch Notifications
```

---

# Step 24 — Error Recovery

| Code | Trigger | Recovery Sequence |
|------|---------|-------------------|
| 401 | JWT expired | Clear JWT → Redirect to /login → Store URL → After login → Redirect to stored URL |
| 403 | Insufficient permissions | Show "Access Denied" → Log failure → Offer "Request Access" |
| 404 | Resource not found | Show "Not Found" → Log missing resource → Offer "Go Home" |
| 422 | Validation error | Parse error → Highlight fields → Show inline messages → Focus first invalid |
| 429 | Rate limited | Parse Retry-After → Show "Too many requests" → Show countdown → Auto-retry |
| 500 | Server error | Show error → Generate support ID → Log details → Offer "Contact Support" |
| 503 | Maintenance | Show banner → Disable actions → Show restore time → Auto-refresh 60s |

---

# Step 25 — Performance Targets

| Screen | Metric | Target |
|--------|--------|--------|
| Dashboard | Initial render | < 1.5s |
| Dashboard | Portfolio fetch | < 500ms |
| Dashboard | Activity fetch | < 500ms |
| Migration | Initial render | < 1.5s |
| Migration | Polling interval | 2s |
| Governance | Initial render | < 1.5s |
| Governance | Tab switch | < 300ms |
| Governance | Search debounce | 300ms |
| Tasks | Initial render | < 1.5s |
| Tasks | Create task | < 300ms |
| Notifications | Initial render | < 1.5s |
| Notifications | Mark read | < 200ms |
| Login | Initial render | < 1s |
| Login | Auth attempt | < 2s |
| All | Pagination | < 500ms |
| All | Search results | < 500ms |

### Bundle Size Targets

| Bundle | Target |
|--------|--------|
| Initial JS | < 200KB gzipped |
| Initial CSS | < 50KB gzipped |
| Total First Load | < 250KB gzipped |
| Lazy chunks | < 50KB each |

---

# Step 26 — Accessibility

## WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Colour Contrast | 4.5:1 normal text, 3:1 large text |
| Keyboard Navigation | All interactive elements focusable and operable |
| Focus Order | Logical tab order matching visual layout |
| Screen Readers | ARIA labels for all interactive elements |
| Modal Focus Trapping | Tab cycles within modal when open |
| Escape Handling | Escape closes modals, dropdowns, popovers |
| Button Labels | All buttons have visible text or aria-label |
| Form Labels | All inputs have associated labels |
| Error Messages | Linked to inputs via aria-describedby |
| Loading States | aria-busy="true" on loading containers |
| Skip Link | "Skip to main content" at top of page |

## ARIA Labels

| Element | ARIA Label |
|---------|------------|
| Navigation sidebar | `aria-label="Main navigation"` |
| Loading spinner | `aria-label="Loading"` |
| Search input | `aria-label="Search"` |
| Pagination | `aria-label="Pagination"` |
| Modal | `role="dialog"`, `aria-modal="true"` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Progress bar | `role="progressbar"` |
| Tab panel | `role="tabpanel"` |
| Tab button | `role="tab"`, `aria-selected` |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Next focusable element |
| `Shift+Tab` | Previous focusable element |
| `Enter` | Activate button/link |
| `Space` | Activate button/checkbox |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigate within tabs/dropdowns |

---

# Step 27 — Testing Matrix

| Test Type | Scope | Tools | Coverage |
|-----------|-------|-------|----------|
| Unit Tests | Components, hooks, utilities | Vitest, React Testing Library | 80% |
| Integration Tests | Page + API interactions | Vitest, MSW | 70% |
| E2E Tests | Critical user flows | Playwright | P0 screens |
| Visual Regression | UI component snapshots | Playwright screenshot | Shared components |
| API Mock Tests | API contract validation | MSW, Vitest | All endpoints |
| Permission Tests | Role-based access | Vitest, custom helpers | All protected routes |
| Accessibility Tests | WCAG compliance | axe-core, Playwright | All pages |
| Performance Tests | Load time, bundle size | Lighthouse CI | All pages |

### Critical E2E Flows

| Flow | Steps | Expected |
|------|-------|----------|
| Login | Enter credentials → Submit → Redirect | Dashboard loads |
| Start Migration | Click Start → Enter Project ID → Submit | Migration starts, progress updates |
| View Governance | Navigate → Click tabs → Verify data | Tabs load with real data |
| Create Task | Click Create → Fill form → Submit | Task appears in list |
| Mark Notification Read | Click Mark Read → Verify | Notification marked as read |
| Permission Denied | Login as Viewer → Access /users | Access Denied shown |

---

# Step 28 — Responsive Breakpoints

| Breakpoint | Width | Columns | Layout |
|------------|-------|---------|--------|
| Desktop | ≥ 1280px | 12 | Full sidebar + content |
| Tablet | 768px - 1279px | 8 | Collapsed sidebar + content |
| Mobile | < 768px | 4 | Bottom navigation + content |

## Layout Changes by Breakpoint

### DashboardPage

| Breakpoint | Layout |
|------------|--------|
| Desktop | 4-column card grid, full activity table |
| Tablet | 2-column card grid, compact activity table |
| Mobile | 1-column card grid, activity list |

### MigrationPage

| Breakpoint | Layout |
|------------|--------|
| Desktop | Full form + progress side by side |
| Tablet | Full form + progress stacked |
| Mobile | Compact form + progress stacked |

### GovernancePage

| Breakpoint | Layout |
|------------|--------|
| Desktop | Full tab bar, full content |
| Tablet | Scrollable tab bar, full content |
| Mobile | Dropdown tab selector, compact content |

### TaskManagementPage

| Breakpoint | Layout |
|------------|--------|
| Desktop | Full table with all columns |
| Tablet | Table with hidden次要 columns |
| Mobile | Card list instead of table |

## Navigation by Breakpoint

| Breakpoint | Navigation |
|------------|------------|
| Desktop | Fixed left sidebar |
| Tablet | Collapsible left sidebar |
| Mobile | Bottom navigation bar (5 items: Home, Migration, Governance, Tasks, More) |

---

# Step 29 — Design Tokens (Extended)

## Animation

| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 100ms | Tooltip show/hide |
| duration-normal | 200ms | Button hover, focus ring |
| duration-slow | 300ms | Modal open/close, toast show/hide |
| duration-slower | 500ms | Page transition |
| easing-default | ease-in-out | Standard transitions |
| easing-bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Bounce effects |
| easing-smooth | cubic-bezier(0.4, 0, 0.2, 1) | Smooth transitions |

## Z-Index Layers

| Token | Value | Usage |
|-------|-------|-------|
| z-base | 0 | Default stacking |
| z-dropdown | 100 | Dropdowns, popovers |
| z-sticky | 200 | Sticky headers |
| z-modal-backdrop | 300 | Modal overlay |
| z-modal | 400 | Modal content |
| z-toast | 500 | Toast notifications |
| z-tooltip | 600 | Tooltips |
| z-skip-link | 700 | Skip to content link |

## Icon Sizes

| Token | Value | Usage |
|-------|-------|-------|
| icon-xs | 12px | Inline badges |
| icon-sm | 16px | Button icons, list icons |
| icon-md | 20px | Navigation icons |
| icon-lg | 24px | Header icons |
| icon-xl | 32px | Empty state icons |

## Grid

| Token | Value | Usage |
|-------|-------|-------|
| grid-columns | 12 | Default grid |
| grid-gutter | 16px | Column gap |
| grid-margin | 24px | Page margin |
| container-sm | 640px | Small content |
| container-md | 768px | Medium content |
| container-lg | 1024px | Large content |
| container-xl | 1280px | Extra large content |

## Border Width

| Token | Value | Usage |
|-------|-------|-------|
| border-width | 1px | Default borders |
| border-width-focus | 2px | Focus rings |

## Opacity

| Token | Value | Usage |
|-------|-------|-------|
| opacity-disabled | 0.5 | Disabled elements |
| opacity-overlay | 0.5 | Modal backdrop |
| opacity-loading | 0.7 | Loading states |

---

# Extended Traceability Chain

Complete chain from UI to data:

```
Workstream Policy
        ↓
Frozen Screen
        ↓
React Component
        ↓
User Interaction
        ↓
API Endpoint
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
Table
        ↓
Columns
        ↓
Business Entity
        ↓
MAP CLI Capability
```

---

# Appendix A — Blocked Items

| Blocker | Table | Issue | Resolution |
|---------|-------|-------|------------|
| B-06 | `engine.migration_batch_lifecycle` | Table does not exist | Partial implementation using `engine.batch_execution_checkpoint` for `batch_id` + `last_completed_control` only |
| B-07 | `engine.migration_risk_scores` | DDL exists but never executed | BLOCKED per RULE 16 — investigate `engine.unified_scores` or defer |

# Appendix B — Empty Tables

| Table | Rows | Issue | Recommendation |
|-------|------|-------|----------------|
| `platform.approval_requests` | 0 | No MAP CLI data flows here | Restore UI but flag as empty |
| `platform.calendar_events` | 0 | No MAP CLI data flows here | Restore UI but flag as empty |
| `platform.workflow_instances` | 0 | No workflow executions yet | Restore UI but flag as empty |
| `platform.task_comments` | 0 | No comments added yet | Restore UI but flag as empty |

# Appendix C — Phase 09 NOT in Scope

| Component | Reason |
|-----------|--------|
| AI Features | No backend support |
| Security Portal | No backend support |
| Tenant Management | Platform feature, not MVP |
| Subscriptions | Commercial feature, not MVP |
| Report Centre | Requires Phase 07.6.1 |
| Advanced Themes | Enhancement, not critical |

---

**Document Generated:** 2026-07-27
**Status:** Master Frontend Restoration Specification — Revision 4
**Next Phase:** Phase 09 — Frontend Restoration
