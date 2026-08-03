# 09Y — Current Application Inventory

> **Reference inventory of all existing frontend assets. Use this document as the starting point for gap analysis before any implementation.**

---

## 1. Pages

| File | Route | Status |
|------|-------|--------|
| `DashboardPage.tsx` | `/` | Existing |
| `LoginPage.tsx` | `/login` | Existing |
| `HomePage.tsx` | `/home` | Existing |
| `MigrationPage.tsx` | `/migration` | Existing |
| `ValidationPage.tsx` | `/validation` | Existing |
| `ValidationResultsPage.tsx` | `/validation/reports/:id` | Existing |
| `ExecutionHistoryPage.tsx` | `/execution-history` | Functional — calls /execution/history with pagination |
| `GovernancePage.tsx` | `/governance` | Existing |
| `OperationsPage.tsx` | `/operations` | Existing |
| `SystemsPage.tsx` | `/systems` | Existing |
| `SystemDetailPage.tsx` | `/systems/:id` | Existing |
| `DiscoveryPage.tsx` | `/discovery` | Existing |
| `WorkflowsPage.tsx` | `/workflows` | Existing |
| `UsersPage.tsx` | `/users` | Existing |
| `UserDetailPage.tsx` | `/users/:id` | Existing |
| `RolesPage.tsx` | `/roles` | Existing |
| `RoleDetailPage.tsx` | `/roles/:id` | Existing |
| `SettingsPage.tsx` | `/settings` | Existing |
| `TaskManagementPage.tsx` | `/tasks` | Existing |
| `TaskDetailPage.tsx` | `/tasks/:id` | Existing |
| `NotificationsPage.tsx` | `/notifications` | Existing |
| `CalendarPage.tsx` | `/calendar` | Existing |
| `ApprovalsPage.tsx` | `/approvals` | Existing |
| `ApprovalDetailPage.tsx` | `/approvals/:id` | Existing |
| `ReportsPage.tsx` | `/reports` | Functional — calls /execution/{batch_id}/report, /governance, /risk-score, /compliance |
| `MappingPage.tsx` | `/mapping` | Existing |
| `AdministrationPage.tsx` | `/admin` | Existing |
| `NotFoundPage.tsx` | `*` | Existing |

---

## 2. Components

### 2.1 Shell & Layout

| File | Location | Purpose |
|------|----------|---------|
| `Shell.tsx` | `src/components/Shell/` | App shell with sidebar navigation |
| `Layout.tsx` | `src/components/Layout/` | Page layout wrapper |
| `DynamicNavigation.tsx` | `src/components/Navigation/` | Recursive navigation menu |
| `ProtectedRoute.tsx` | `src/components/` | Auth route guard |
| `Breadcrumb.tsx` | `src/components/Breadcrumb/` | Breadcrumb navigation |
| `RoleSwitcher.tsx` | `src/components/RoleSwitcher/` | Role switching UI |

### 2.2 UI Components

| File | Location | Purpose |
|------|----------|---------|
| `LoadingSpinner.tsx` | `src/components/LoadingSpinner/` | Loading indicator |
| `ThemeToggle.tsx` | `src/components/` | Dark/light mode toggle |
| `MetadataRenderer.tsx` | `src/components/MetadataRenderer/` | Dynamic metadata display |

---

## 3. Hooks

| File | Purpose |
|------|---------|
| `useExecution.ts` | Migration execution operations |
| `useExecutionHistory.ts` | Execution history queries |
| `useHealth.ts` | System health monitoring |
| `useMonitoring.ts` | Monitoring data |
| `useSystems.ts` | System management |
| `useWorkflows.ts` | Workflow operations |
| `useTasks.ts` | Task management |
| `useUsers.ts` | User management |
| `useRoles.ts` | Role management |
| `usePermissions.ts` | Permission checks |
| `useSettings.ts` | Settings management |
| `useNotifications.ts` | Notification operations |
| `useCalendar.ts` | Calendar events |
| `useApprovals.ts` | Approval workflows |
| `useFeatureFlags.ts` | Feature flag queries |

---

## 4. Services & Utilities

| File | Location | Purpose |
|------|----------|---------|
| `apiClient.ts` | `src/utils/` | HTTP client wrapper (raw fetch) |
| `filterByPermissions.ts` | `src/utils/` | Permission-based filtering |

---

## 5. Contexts

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Authentication state, user session, tenant context |

---

## 6. Type Definitions

| File | Domain |
|------|--------|
| `auth.ts` | Authentication types |
| `user.ts` | User types |
| `role.ts` | Role types |
| `execution.ts` | Migration execution types |
| `systems.ts` | System types |
| `workflows.ts` | Workflow types |
| `tasks.ts` | Task types |
| `settings.ts` | Settings types |
| `notifications.ts` | Notification types |
| `calendar.ts` | Calendar types |
| `approvals.ts` | Approval types |
| `metadata.ts` | Metadata types |

---

## 7. Test Files

| File | Type |
|------|------|
| `*.test.tsx` | Unit tests (co-located) |
| `*.integration.test.tsx` | Integration tests (co-located) |

Test coverage exists for: DashboardPage, MigrationPage, ValidationPage, GovernancePage, OperationsPage, SystemsPage, WorkflowsPage, UsersPage, RolesPage, SettingsPage, TaskManagementPage, NotificationsPage, CalendarPage, ApprovalsPage, DiscoveryPage, ExecutionHistoryPage, ReportsPage, Shell, DynamicNavigation, Layout, MetadataRenderer.
