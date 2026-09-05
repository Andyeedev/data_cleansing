# 09E — Platform Administration

> **Generated from:** `00_MASTER_FRONTEND_RESTORATION_PROMPT.md`
> **References:** `01_Master_Frontend_Restoration_Specification.md` (Revision 4)
> **Dependencies:** 09A (Platform Foundation) — requires shared components, design system, API client, error handling

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Existing Frontend Review

> **MUST be completed before ANY implementation.**

| Requested Component | Existing? | Location | Reuse | Refactor | Replace | Create |
|---------------------|-----------|----------|-------|----------|---------|--------|
| UsersPage | Audit first | `src/routes/UsersPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| RolesPage | Audit first | `src/routes/RolesPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| SettingsPage | Audit first | `src/routes/SettingsPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| TaskManagementPage | Audit first | `src/routes/TaskManagementPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| NotificationsPage | Audit first | `src/routes/NotificationsPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| usePermission | Audit first | `src/hooks/usePermission.ts` | ✅ | ✅ | ❌ | ❌ |
| AuditService | Audit first | Check audit logging patterns | — | — | — | ✅ if missing |

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

## Objective

Restore administrative capabilities. **Use existing JWT roles and backend authorization. Do not invent frontend permission models.**

---

## Audit Dependency

> **User management events MUST automatically feed Governance → Audit tab.**

Every user/role mutation must log an audit entry:

| Action | Audit Event | Feeds To |
|--------|-------------|----------|
| Create User | `user.created` | Governance → Audit |
| Update User | `user.updated` | Governance → Audit |
| Delete User | `user.deleted` | Governance → Audit |
| Role Change | `user.role_changed` | Governance → Audit |
| Password Reset | `user.password_reset` | Governance → Audit |
| Deactivate | `user.deactivated` | Governance → Audit |
| Reactivate | `user.reactivated` | Governance → Audit |
| Create Role | `role.created` | Governance → Audit |
| Update Role | `role.updated` | Governance → Audit |
| Delete Role | `role.deleted` | Governance → Audit |

- Frontend calls admin API → backend writes audit log → Governance audit tab reflects it
- Do NOT create separate frontend audit logging

---

## Scope

### Screens

| Screen | Component Hierarchy | Priority |
|--------|---------------------|----------|
| UsersPage | UserTable + Filters + Pagination + CreateUserModal | P1 |
| UserDetailPage | UserInfo + RoleAssignment + Edit/Delete | P1 |
| RolesPage | RoleTable + Filters + Pagination + CreateRoleModal | P1 |
| RoleDetailPage | RoleInfo + PermissionAssignment + Edit/Delete | P1 |
| SettingsPage | SettingsByCategory + FeatureFlags | P1 |
| TaskManagementPage | TaskTable + Filters + Pagination + CreateTaskModal | P1 |
| TaskDetailPage | TaskInfo + Comments + Edit/Delete | P1 |
| NotificationsPage | NotificationList + Filters + Pagination | P1 |

**Source:** Master Spec Step 5 (Screen → Component Hierarchy) — TaskManagementPage, NotificationsPage sections

---

### TaskManagementPage

#### Component Hierarchy (Step 5)

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

#### UX Behaviours (Step 6)

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| Header | Create Task button | Opens create modal |
| Filters | Status filter | Dropdown: All Status, Pending, In Progress, Done, Blocked |
| Filters | Priority filter | Dropdown: All Priority, High, Medium, Low |
| Filters | Reset page on filter change | Page resets to 1 when filter changes |
| TaskTable | Title link | Click navigates to `/tasks/:id` |
| TaskTable | Status badge | Color-coded: done (green), in_progress (blue), pending (yellow), blocked (red) |
| TaskTable | Priority badge | Color-coded: high (red), medium (yellow), low (green) |
| TaskTable | Delete button | Shows confirm dialog, calls `DELETE /tasks/:id` |
| Pagination | 20 items per page | Previous/Next buttons |
| Empty state | Filter-aware | "Try different filters" if filters active, else "Create your first task to get started" |
| CreateTaskModal | Title input | Required field |
| CreateTaskModal | Submit button | Disabled when creating or title empty |

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Tasks | ✅ | ✅ | ✅ | ✅ |
| Create Task | ✅ | ✅ | ❌ | ❌ |
| Delete Task | ✅ | ✅ | ❌ | ❌ |

#### State Machine (Step 20)

```
Idle → LoadingTasks → Loaded → (TasksEmpty | TasksLoaded) → Creating → Created → Loading
Idle → Loaded → Deleting → Deleted → Loading
```

#### Event Flow (Step 23)

```
Click "Create Task" → Open Modal → Fill Form → Click "Create" → Validate → POST /tasks → Close Modal → Show Toast → Refetch Tasks
```

```
Click "Delete" on Task Row → Show ConfirmDialog → Click "Confirm" → DELETE /tasks/:id → Show Toast → Refetch Tasks
```

---

### NotificationsPage

#### Component Hierarchy (Step 5)

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

#### UX Behaviours (Step 6)

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| Header | Mark All Read | Button calls `PUT /notifications/read-all`, then refetches |
| Header | Button text changes | "Mark All as Read" → "Marking..." during operation |
| Filters | Type filter | Dropdown: All Types, Info, Success, Warning, Error |
| Filters | Read filter | Dropdown: All Status, Unread, Read |
| Filters | Reset page on filter change | Page resets to 1 when filter changes |
| NotificationList | Unread indicator | Bold title + blue dot for unread items |
| NotificationList | Mark Read button | Only shown for unread items, calls `PUT /notifications/:id/read` |
| NotificationList | Delete button | Shows confirm dialog, calls `DELETE /notifications/:id` |
| Pagination | 20 items per page | Previous/Next buttons |
| Empty state | Filter-aware | "Try different filters" if filters active, else "You're all caught up!" |

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Notifications | ✅ | ✅ | ✅ | ✅ |
| Mark Read | ✅ | ✅ | ✅ | ✅ |
| Mark All Read | ✅ | ✅ | ✅ | ✅ |
| Delete Notification | ✅ | ✅ | ✅ | ✅ |

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/notifications` | GET | `[{ id, type, title, message, read, timestamp }]` |
| `PUT /api/v1/notifications/:id/read` | PUT | `{ success: true }` |
| `PUT /api/v1/notifications/read-all` | PUT | `{ success: true, count: 5 }` |
| `DELETE /api/v1/notifications/:id` | DELETE | `{ success: true }` |

---

### UsersPage

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Users | ✅ | ❌ | ❌ | ❌ |
| Create User | ✅ | ❌ | ❌ | ❌ |
| Edit User | ✅ | ❌ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ |

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/users` | GET | `[{ id, email, name, roles, status, lastLogin }]` |
| `POST /api/v1/users` | POST | `{ id, email }` |
| `PUT /api/v1/users/:id` | PUT | `{ success: true }` |
| `DELETE /api/v1/users/:id` | DELETE | `{ success: true }` |

---

### RolesPage

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Roles | ✅ | ❌ | ❌ | ❌ |
| Create Role | ✅ | ❌ | ❌ | ❌ |
| Edit Role | ✅ | ❌ | ❌ | ❌ |
| Delete Role | ✅ | ❌ | ❌ | ❌ |
| Assign Permission | ✅ | ❌ | ❌ | ❌ |

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/roles` | GET | `[{ id, name, description, permissions, userCount }]` |

---

### SettingsPage

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Settings | ✅ | ❌ | ❌ | ❌ |
| Edit Setting | ✅ | ❌ | ❌ | ❌ |
| View Feature Flags | ✅ | ❌ | ❌ | ❌ |
| Toggle Feature Flag | ✅ | ❌ | ❌ | ❌ |

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/settings` | GET | `{ general, notifications, security }` |
| `PUT /api/v1/settings/:category/:key` | PUT | `{ success: true }` |

---

## Required Shared Components (from 09A)

- DataTable (for all list views)
- StatusBadge (for task status, priority, notification type)
- EmptyState
- ErrorState
- LoadingSkeleton
- Pagination
- SearchBar
- Modal
- ConfirmDialog (for delete confirmations)
- Toast (for success/error notifications)

---

## Acceptance Criteria

- [ ] UsersPage loads user list with real data
- [ ] CreateUser action works with form validation
- [ ] EditUser updates user roles
- [ ] DeleteUser works with confirmation dialog
- [ ] RolesPage loads role list with real data
- [ ] CreateRole action works
- [ ] EditRole updates permissions
- [ ] DeleteRole works with confirmation
- [ ] SettingsPage loads settings by category
- [ ] UpdateSetting works
- [ ] FeatureFlags toggle works
- [ ] TaskManagementPage loads task list with filters
- [ ] CreateTask action works
- [ ] DeleteTask works with confirmation
- [ ] NotificationsPage loads notification list
- [ ] MarkRead works
- [ ] MarkAllRead works
- [ ] DeleteNotification works with confirmation
- [ ] Permissions enforced (Admin-only for Users, Roles, Settings)
- [ ] All API contracts match Step 14

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| TaskManagementPage | Step 5, Step 6, Step 7, Step 20, Step 23 |
| NotificationsPage | Step 5, Step 6, Step 7, Step 20, Step 23 |
| UsersPage | Step 7, Step 14 |
| RolesPage | Step 7, Step 14 |
| SettingsPage | Step 7, Step 14 |
| API contracts | Step 14 |
