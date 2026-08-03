# 09E — Platform Administration — Architecture Output

> **Generated from:** `09E_Platform_Administration.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09E — Platform Administration, restoring administrative capabilities.

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Dependency Order

```
Shared Components (from 09A)
    ↓
UsersPage (refactor, preserve existing)
    ↓
RolesPage (refactor, preserve existing)
    ↓
SettingsPage (refactor, preserve existing)
    ↓
TaskManagementPage (refactor, preserve existing)
    ↓
NotificationsPage (refactor, preserve existing)
    ↓
Permission hooks (enhance with existing JWT roles)
```

---

## Cross-Document Dependencies

> **Implementation order flows top-down.**

```
09A Platform Foundation
    ↓
09F Cross-Cutting Platform Services
    ↓
09B Migration & Execution
    ↓
09C Governance & Compliance
    ↓
09D Operations
    ↓
09E Platform Administration
    ↓
09G Future Modules
```

---

## 1. Screen Architecture

### 1.1 UsersPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/users` |
| Component | `UsersPage.tsx` |
| Priority | P1 |
| Permissions | Admin only |

#### Component Tree

```
UsersPage
├── Header
│   ├── Title
│   └── CreateUserButton
├── Filters
│   └── SearchFilter
├── UserTable
│   ├── TableHeader
│   └── UserRows
│       ├── UserRow (email, name, roles, status, actions)
│       └── ...
├── Pagination
├── EmptyState
└── CreateUserModal
    ├── EmailInput
    ├── NameInput
    ├── RoleSelect
    └── ModalActions
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/users` | GET | `[{ id, email, name, roles, status, lastLogin }]` |
| `POST /api/v1/users` | POST | `{ id, email }` |
| `PUT /api/v1/users/:id` | PUT | `{ success: true }` |
| `DELETE /api/v1/users/:id` | DELETE | `{ success: true }` |

---

### 1.2 RolesPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/roles` |
| Component | `RolesPage.tsx` |
| Priority | P1 |
| Permissions | Admin only |

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/roles` | GET | `[{ id, name, description, permissions, userCount }]` |
| `POST /api/v1/roles` | POST | `{ id, name }` |
| `PUT /api/v1/roles/:id` | PUT | `{ success: true }` |
| `DELETE /api/v1/roles/:id` | DELETE | `{ success: true }` |

---

### 1.3 SettingsPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/settings` |
| Component | `SettingsPage.tsx` |
| Priority | P1 |
| Permissions | Admin only |

#### Component Tree

```
SettingsPage
├── CategoryNav
│   ├── General
│   ├── Notifications
│   └── Security
├── SettingsForm
│   ├── SettingItem (key, value, edit)
│   └── ...
├── FeatureFlags
│   ├── FeatureFlagItem (name, enabled, toggle)
│   └── ...
└── SaveButton
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/settings` | GET | `{ general, notifications, security }` |
| `PUT /api/v1/settings/:category/:key` | PUT | `{ success: true }` |
| `GET /api/v1/feature-flags` | GET | `[{ name, enabled }]` |
| `PUT /api/v1/feature-flags/:name` | PUT | `{ success: true }` |

---

### 1.4 TaskManagementPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/tasks` |
| Component | `TaskManagementPage.tsx` |
| Priority | P1 |

#### Component Tree

```
TaskManagementPage
├── Header
│   ├── Title
│   └── CreateTaskButton
├── Filters
│   ├── StatusFilter
│   └── PriorityFilter
├── TaskTable
│   └── TaskRows (title, status, priority, assignedTo, dueDate, actions)
├── Pagination
├── EmptyState
└── CreateTaskModal
```

#### State Machine

```
Idle → LoadingTasks → Loaded → (TasksEmpty | TasksLoaded) → Creating → Created → Loading
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/tasks` | GET | `[{ id, title, status, priority, assignedTo, dueAt }]` |
| `POST /api/v1/tasks` | POST | `{ id, status }` |
| `PUT /api/v1/tasks/:id` | PUT | `{ success: true }` |
| `DELETE /api/v1/tasks/:id` | DELETE | `{ success: true }` |

---

### 1.5 NotificationsPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/notifications` |
| Component | `NotificationsPage.tsx` |
| Priority | P1 |

#### Component Tree

```
NotificationsPage
├── Header
│   ├── Title
│   └── MarkAllReadButton
├── Filters
│   ├── TypeFilter
│   └── ReadFilter
├── NotificationList
│   └── NotificationItem (icon, title, message, type, timestamp, actions)
├── Pagination
└── EmptyState
```

#### State Machine

```
Idle → Loading → Loaded → (Empty | Loaded) → Marking → Loaded
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/notifications` | GET | `[{ id, type, title, message, read, timestamp }]` |
| `PUT /api/v1/notifications/:id/read` | PUT | `{ success: true }` |
| `PUT /api/v1/notifications/read-all` | PUT | `{ success: true, count }` |
| `DELETE /api/v1/notifications/:id` | DELETE | `{ success: true }` |

---

## 2. Permissions Summary

| Screen | Super Admin | Tenant Admin | Operator | Viewer |
|--------|-------------|--------------|----------|--------|
| Users | ✅ | ❌ | ❌ | ❌ |
| Roles | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| Tasks | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |

---

## 3. Shared Components Required

| Component | Usage |
|-----------|-------|
| DataTable | All list views |
| StatusBadge | Task status, priority, notification type |
| EmptyState | All empty states |
| ErrorState | API errors |
| LoadingSkeleton | Loading states |
| Pagination | All paginated views |
| SearchBar | User search, task filter |
| Modal | Create/edit forms |
| ConfirmDialog | Delete confirmations |
| Toast | Success/error notifications |

---

## 4. Acceptance Criteria

- [ ] UsersPage: CRUD works, permissions enforced (Admin only)
- [ ] RolesPage: CRUD works, permissions enforced (Admin only)
- [ ] SettingsPage: Settings load/update, feature flags toggle
- [ ] TaskManagementPage: CRUD works, filters functional
- [ ] NotificationsPage: List, mark read, mark all read, delete
- [ ] All empty states display correctly
- [ ] All error states display with retry
- [ ] All permissions enforced

---

## 5. Approval Required

- [ ] All screen architectures approved
- [ ] API contracts approved
- [ ] Permissions matrix approved
- [ ] State machines approved

**Awaiting your approval before implementation.**
