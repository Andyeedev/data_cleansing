# Phase 25 — Master Frontend Architecture Specification

> **Revision 4** — 2026-07-27
> **Revision 3** — 2026-07-27
> **Revision 2** — 2026-07-27
> **Revision 1** — 2026-07-27 (Initial reconciliation)
> **Status:** Frozen as Revision 1 baseline; Revision 2 adds Steps 5-11; Revision 3 adds Steps 12-19; Revision 4 adds Steps 20-29 (State Machines, Component Ownership, API Versioning, Event Flow, Error Recovery, Performance, Accessibility, Testing, Responsive, Design Tokens)

---

# Purpose

Establish the authoritative relationship between the frozen frontend, MAP CLI capabilities, and existing Workstream UI policies before Phase 09 implementation.

This document is the **Master Frontend Restoration Specification**. Every Phase 09 prompt must reference this document — no duplicated instructions.

---

# Step 1 — Inventory Existing Frontend Policies

Review:

```
01_Prompts/
 ├── Workstream_01_Platform_Foundation
 ├── Workstream_02_Portal_Framework
 ├── Workstream_03_Presentation_Engine
 ├── Workstream_05_Frontend
 ├── Workstream_06_Frontend
 └── Workstream_07_AI_Provider_Integration
```

Do not rewrite them.

Classify each as:

| Category | Action |
|----------|--------|
| Already implemented in frozen frontend | Restore/reuse |
| Exists in prompts but missing in frozen frontend | Future enhancement |
| Exists but duplicates MAP CLI capability | Merge/remove duplication |
| Platform capability | Keep separate from MAP CLI |
| Not required for MVP | Defer |

---

# Step 2 — Create a Capability Mapping Matrix

| Workstream | Capability | Frozen UI | MAP CLI | Decision |
|------------|-----------|-----------|---------|----------|
| WS01 | Login/Auth | ✅ Exists | Required | Restore |
| WS01 | Theme System | ✅ Exists | Platform | Restore |
| WS02 | Migration Portal | ✅ Exists | Core MAP CLI | Restore |
| WS02 | Governance Portal | ✅ Exists | Core MAP CLI | Restore |
| WS03 | Report Centre | Partial | MAP CLI reports | Review |
| WS05 | Workflow | Partial | Not CLI core | Future platform |
| WS06 | Tenant Management | Partial | Platform | Future |
| WS06 | Subscription | Partial | Commercial | Future |
| WS07 | AI Providers | Not MVP | Future | Defer |

---

# Step 2A — Data Mapping Matrix

For every frontend feature, document:

- API endpoint
- Controller
- Service
- Repository
- Table(s)
- Required columns
- Missing columns (if any)
- Mapping rules
- Business Entity
- MAP CLI Source (Python)

---

# Step 2B — Source of Truth Verification

For every table:

- Written by which Python file
- Active row count
- Last populated date
- Status:
  - ✅ Authoritative
  - ⚠ Partial
  - ❌ Legacy
  - 🚫 Do Not Use

---

# Extended Traceability Chain

The complete chain from UI to data:

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

# Step 3 — Establish Three Product Layers

## Layer 1 — MAP CLI Product Core

Must represent actual CLI capability:

- Migration
- Validation
- Rules
- Controls
- Reconciliation
- Exceptions
- Governance
- Reporting
- Risk

## Layer 2 — MAP Platform

Reusable SaaS capabilities:

- Authentication
- Users
- Roles
- Tenants
- Notifications
- Calendar
- Themes
- Subscriptions

## Layer 3 — Future Enhancements

- AI assistant
- AI recommendations
- AI providers
- Advanced workflow automation

---

# Step 4 — Phase 09 Definition

After reconciliation:

**Phase 09 = Frontend Restoration**

Not: Build frontend

But: Restore frozen enterprise frontend using validated Workstream policies and connect to Phase 08 backend APIs.

---

# Step 5 — Screen → Component Hierarchy

For every frozen frontend page, document the sub-component tree.

This tells developers what components belong to that page — not just that the page exists.

Example format:

```
DashboardPage
   ├── ExecutiveSummaryCards
   │   ├── TotalSystemsCard
   │   ├── TotalBatchesCard
   │   ├── TotalControlsCard
   │   └── ActiveBatchesCard
   ├── KPICards
   │   ├── MigrationScoreCard
   │   ├── PassRateCard
   │   └── ExceptionCountCard
   ├── ActivityFeed
   │   ├── ActivityTable
   │   └── ActivityFilters
   ├── QuickActions
   │   ├── ManageSystemsButton
   │   ├── StartMigrationButton
   │   └── ViewOperationsButton
   └── SystemHealth
       ├── HealthIndicator
       └── LastCheckTimestamp
```

Every page in the frozen frontend must have its component tree documented.

---

# Step 6 — UX Behaviour Specification

For every component, document the interaction behaviours.

Example format:

| Component | Behaviour | Detail |
|-----------|-----------|--------|
| ActivityFeed | Loads automatically | On page mount |
| ActivityFeed | Refresh | Every 30 seconds |
| ActivityFeed | Unread indicator | Bold text for unread items |
| ActivityFeed | Mark Read | Click to mark single item |
| ActivityFeed | Delete | Swipe or button to delete |
| ActivityFeed | Pagination | 10 items per page |
| ActivityFeed | Search | Filter by text |
| ActivityFeed | Sort | By date, by status |
| ActivityFeed | Empty state | "No recent activity" message |
| ActivityFeed | Loading state | Skeleton loader |
| ActivityFeed | Error state | Retry button |

These behaviours were defined inside workstream prompts. Do not lose them.

---

# Step 7 — Permissions Matrix

For every screen, document which roles can access which features.

Example format:

| Screen | Feature | Super Admin | Tenant Admin | Operator | Viewer | API Called |
|--------|---------|-------------|--------------|----------|--------|-----------|
| Dashboard | View Executive Summary | ✅ | ✅ | ✅ | ✅ | GET /dashboard/portfolio |
| Dashboard | View Activity Feed | ✅ | ✅ | ✅ | ❌ | GET /dashboard/activity |
| Dashboard | Quick Actions | ✅ | ✅ | ❌ | ❌ | N/A |
| Governance | View Audit Log | ✅ | ✅ | ✅ | ❌ | GET /governance/audit |
| Governance | View Approvals | ✅ | ✅ | ❌ | ❌ | GET /governance/approvals |
| Governance | Approve/Reject | ✅ | ❌ | ❌ | ❌ | PUT /governance/approvals/:id |
| Settings | Edit Settings | ✅ | ❌ | ❌ | ❌ | PUT /settings/:category/:key |
| Users | Create User | ✅ | ❌ | ❌ | ❌ | POST /users/ |
| Users | Delete User | ✅ | ❌ | ❌ | ❌ | DELETE /users/:id |

---

# Step 8 — State Management

For every screen, document the states it must handle.

Example format:

| Screen | Loading | Empty | Partial | Offline | API Timeout | Permission Denied | No Data | Complete | Error |
|--------|---------|-------|---------|---------|-------------|-------------------|---------|----------|-------|
| Dashboard | Skeleton loader | "No data" cards | Partial cards | Offline banner | Retry button | Redirect to /login | "—" placeholders | Full render | Error boundary |
| Migration | Spinner | "No batches" | Partial list | Offline banner | Retry button | Redirect to /login | "No batches found" | Full list | Error message |
| Governance | Spinner | "No data" | Partial tabs | Offline banner | Retry button | "Access Denied" | "No data available" | Full tabs | Error message |
| Notifications | Spinner | "No notifications" | Partial list | Offline banner | Retry button | Redirect to /login | "No notifications" | Full list | Error message |
| Settings | Spinner | "No settings" | Partial settings | Offline banner | Retry button | Redirect to /login | "No settings" | Full settings | Error message |

---

# Step 9 — Navigation Relationships

Document how screens relate to each other in the navigation flow.

Example format:

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
   ↓ (View Alerts)
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
```

---

# Step 10 — Entity Relationships

Document what objects every page represents and their relationships.

Example format:

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
```

---

# Step 11 — Restoration Confidence

For every screen, indicate readiness to restore.

| Screen | Frozen Exists | Backend Exists | Tables Ready | API Working | Tests Pass | Ready to Restore |
|--------|---------------|----------------|--------------|-------------|------------|------------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Migration | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Validation | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Governance | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Operations | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Workflows | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Calendar | ✅ | ✅ | ⚠️ 0 rows | ✅ | ✅ | 90% |
| Approvals | ✅ | ✅ | ⚠️ 0 rows | ✅ | ✅ | 90% |
| Users | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Roles | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Systems | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Reports | ⚠️ Stub | ⚠️ Stub | ⚠️ Partial | ⚠️ Partial | ✅ | 40% |
| Mapping | ⚠️ Stub | ❌ No API | ❌ No tables | ❌ No | ✅ | 10% |

---

# Step 12 — Component Library Standard

Define reusable components that exist **once** and are shared across all screens.

This prevents Opencode from recreating the same component 30 times.

## Component Definitions

### StatusBadge

| Input | Type | Description |
|-------|------|-------------|
| status | string | Current status value |
| variant | string | Colour mapping: success/warning/danger/info |
| size | string | sm/md/lg |

**States:** loading, error, empty

### ProgressBar

| Input | Type | Description |
|-------|------|-------------|
| value | number | 0-100 percentage |
| max | number | Maximum value (default 100) |
| colour | string | Dynamic colour based on thresholds |
| label | string | Optional text overlay |

**States:** loading, error, complete (100%), partial (0-99%)

### DataTable

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

### MetricCard

| Input | Type | Description |
|-------|------|-------------|
| title | string | Card header text |
| value | string/number | Primary metric |
| colour | string | accent colour for border/icon |
| icon | string/ReactNode | Icon component or name |
| subtitle | string | Secondary text |
| trend | object | { value, direction, period } |

**States:** loading (skeleton), error (ErrorState), empty (— placeholder)

### EmptyState

| Input | Type | Description |
|-------|------|-------------|
| title | string | "No [items] found" |
| description | string | Explanation text |
| action | ReactNode | Optional CTA button |
| icon | string | Optional icon |

**Always rendered when data array is empty.**

### ErrorState

| Input | Type | Description |
|-------|------|-------------|
| title | string | "Something went wrong" |
| message | string | Error description |
| onRetry | function | Retry button handler |
| code | number | HTTP status code |

**Always rendered on API failure.**

### LoadingSkeleton

| Input | Type | Description |
|-------|------|-------------|
| rows | number | Number of skeleton rows |
| variant | string | card/table/list/text |
| height | string | CSS height |

**Always rendered during data fetch.**

### SearchBar

| Input | Type | Description |
|-------|------|-------------|
| value | string | Current search text |
| onChange | function | Text change handler |
| onSearch | function | Submit handler |
| placeholder | string | Hint text |
| debounce | number | ms delay (default 300) |

### Pagination

| Input | Type | Description |
|-------|------|-------------|
| page | number | Current page (1-indexed) |
| pageSize | number | Items per page |
| total | number | Total items |
| onPageChange | function | Page change handler |

### Modal

| Input | Type | Description |
|-------|------|-------------|
| open | boolean | Show/hide |
| title | string | Modal header |
| onClose | function | Close handler |
| children | ReactNode | Content |
| footer | ReactNode | Action buttons |

### ConfirmDialog

| Input | Type | Description |
|-------|------|-------------|
| open | boolean | Show/hide |
| title | string | Confirmation text |
| message | string | Explanation |
| onConfirm | function | Confirm handler |
| onCancel | function | Cancel handler |
| variant | string | danger/warning/info |

### Toast

| Input | Type | Description |
|-------|------|-------------|
| message | string | Toast text |
| type | string | success/error/warning/info |
| duration | number | Auto-dismiss ms (default 5000) |
| onDismiss | function | Close handler |

**Triggered by:** API success, API error, form validation, permission denied.

---

# Step 13 — Design System

Freeze styling constants to prevent Opencode from inventing styling.

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

Freeze response DTOs to prevent frontend/backend drift.

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

Standardize error handling across all screens.

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

All API errors return:

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

Freeze canonical routing table. No route additions without specification update.

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

Document which screens are behind feature flags.

| Screen | Feature Flag | Default | Behaviour When Disabled |
|--------|-------------|---------|------------------------|
| Reports | `reports_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| Mapping | `mapping_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| AI Features | `ai_enabled` | `false` | Hide AI components; no AI endpoints called |
| Advanced Workflow | `workflow_advanced` | `false` | Show basic workflow only |
| Calendar | `calendar_enabled` | `true` | Show in nav |
| Notifications | `notifications_enabled` | `true` | Show in nav |

## Feature Flag Source

Flags are stored in `platform.feature_flags` and fetched at app initialization.

```json
{
  "feature_name": "reports_enabled",
  "feature_value": "false",
  "description": "Enable Reports screen"
}
```

## Frontend Implementation

```typescript
// Feature flag context
const FeatureFlagProvider = ({ children }) => {
  const [flags, setFlags] = useState({});
  
  useEffect(() => {
    apiGet('/api/v1/feature-flags').then(setFlags);
  }, []);
  
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// Usage
const isFeatureEnabled = (flag) => {
  const flags = useContext(FeatureFlagContext);
  return flags[flag] === 'true';
};
```

---

# Step 18 — Screen Restoration Order

Define exact restoration sequence. Opencode must follow this order — no random page restoration.

## Wave 1 — Platform Foundation

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 1.1 | LoginPage | Auth API | Low |
| 1.2 | AppShell | — | Medium |
| 1.3 | Navigation | AppShell | Low |
| 1.4 | DashboardPage | Portfolio API, Activity API | Medium |
| 1.5 | Protected Routes | Auth context | Low |

**Deliverable:** User can log in, see dashboard, navigate between pages.

## Wave 2 — Execution

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 2.1 | MigrationPage | Systems API, Batches API | Medium |
| 2.2 | BatchDetailPage | Batch API, History API | Medium |
| 2.3 | ValidationPage | Validation API | Medium |
| 2.4 | ReportDetailPage | Report API | Low |

**Deliverable:** User can start migrations, view progress, see results.

## Wave 3 — Governance

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 3.1 | GovernancePage | Compliance API | Medium |
| 3.2 | AuditTab | Audit API | Low |
| 3.3 | ComplianceTab | Compliance API | Low |
| 3.4 | ExceptionsTab | Exceptions API | Low |
| 3.5 | ApprovalsTab | Approvals API | Low |

**Deliverable:** User can view compliance, audit logs, exceptions, approvals.

## Wave 4 — Operations

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 4.1 | OperationsPage | Health API, Alerts API | Medium |
| 4.2 | HealthTab | Health API | Low |
| 4.3 | AlertsTab | Alerts API | Low |

**Deliverable:** User can monitor system health and view alerts.

## Wave 5 — Platform

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 5.1 | UsersPage | Users API | Medium |
| 5.2 | RolesPage | Roles API | Low |
| 5.3 | TaskManagementPage | Tasks API | Medium |
| 5.4 | NotificationsPage | Notifications API | Low |
| 5.5 | SettingsPage | Settings API | Low |

**Deliverable:** User can manage users, roles, tasks, notifications, settings.

## Wave 6 — Future

| Order | Screen | Depends On | Estimated Complexity |
|-------|--------|-----------|---------------------|
| 6.1 | ReportsPage | Reports API | Medium |
| 6.2 | MappingPage | Mapping API | High |
| 6.3 | AIPage | AI API | High |
| 6.4 | SecurityPage | Security API | High |

**Deliverable:** Future features behind feature flags.

---

# Step 19 — Acceptance Criteria

Define completion criteria for each screen. Opencode must verify these before marking a screen complete.

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

Define explicit state machines for every page. Each page references one state machine.

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
Idle
  ↓ (onMount)
LoadingPortfolio + LoadingActivity
  ↓ (portfolioLoaded ∧ activityLoaded)
Loaded
  ├── PortfolioEmpty ∧ ActivityEmpty → "No data available"
  ├── PortfolioPartial ∨ ActivityPartial → Partial render
  └── PortfolioComplete ∧ ActivityComplete → Full render
  ↓ (anyFetchFailed)
Error
  ↓ (retry)
Loading
```

### MigrationPage

```
Idle
  ↓ (onMount)
LoadingSystems + LoadingBatches
  ↓ (systemsLoaded ∧ batchesLoaded)
Loaded
  ├── SystemsEmpty ∧ BatchesEmpty → "No migrations yet"
  └── Loaded → Render systems + batches
  ↓ (startMigration)
Starting
  ↓ (batchCreated)
Polling
  ↓ (progressUpdate)
Updating
  ↓ (progress < 100)
Polling
  ↓ (progress === 100)
Completed
  ↓ (error)
Failed
```

### GovernancePage

```
Idle
  ↓ (onTabSwitch)
LoadingTab
  ↓ (tabLoaded)
Loaded
  ├── TabEmpty → Tab-specific empty state
  └── TabData → Render tab data
  ↓ (tabLoadFailed)
Error
```

### TaskManagementPage

```
Idle
  ↓ (onMount)
LoadingTasks
  ↓ (tasksLoaded)
Loaded
  ├── TasksEmpty → "No tasks found"
  └── TasksLoaded → Render task table
  ↓ (createTask)
Creating
  ↓ (taskCreated)
Created → refetch tasks
  ↓ (deleteTask)
Deleting
  ↓ (taskDeleted)
Deleted → refetch tasks
```

### NotificationsPage

```
Idle
  ↓ (onMount)
LoadingNotifications
  ↓ (notificationsLoaded)
Loaded
  ├── NotificationsEmpty → "No notifications"
  └── NotificationsLoaded → Render notification list
  ↓ (markRead)
Marking
  ↓ (marked)
Loaded → refetch
  ↓ (markAllRead)
MarkingAll
  ↓ (markedAll)
Loaded → refetch
```

### LoginPage

```
Idle
  ↓ (formSubmit)
Authenticating
  ↓ (authSuccess)
Authenticated → redirect to /dashboard
  ↓ (authFailed)
Error → show error message
  ↓ (retry)
Idle
  ↓ (rateLimited)
RateLimited → show retry timer
```

---

# Step 21 — Component Ownership Matrix

Define which team or module owns each component. Prevents duplicate implementations.

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
| Version Negotiation | Client specifies version in URL path |

### Deprecation Header Format

```
Deprecation: true
Sunset: 2027-01-27
Link: <https://docs.mapnexus.com/api/v2/migration>; rel="successor-version"
```

### Version Migration Checklist

- [ ] New version endpoints created
- [ ] Old version marked deprecated with headers
- [ ] Client applications migrated
- [ ] Documentation updated
- [ ] Old version sunset date announced

---

# Step 23 — Event Flow

Define explicit UI event flows for every major user action.

## DashboardPage

### Load Dashboard

```
Page Mount
  ↓
Fetch Portfolio (GET /dashboard/portfolio)
  ↓
Fetch Activity (GET /dashboard/activity)
  ↓
Fetch Health (GET /dashboard/health)
  ↓
Render Cards
  ↓
Render Activity Feed
  ↓
Render Health Indicators
```

### Quick Action Click

```
Click Quick Action Button
  ↓
Navigate to Target Page (react-router)
```

## MigrationPage

### Start Migration

```
Click "Start Migration"
  ↓
Validate Form (projectId required)
  ↓
Disable Button
  ↓
POST /execution/run
  ↓
Receive Response { batchId }
  ↓
Store batchId in state
  ↓
Begin Polling (GET /execution/status/:batchId every 2s)
  ↓
Update Progress Bar
  ↓
Progress < 100 → Continue Polling
  ↓
Progress === 100 → Stop Polling
  ↓
Show Toast "Migration Complete"
  ↓
Refetch Dashboard Data
```

### View History

```
Click "History" Tab
  ↓
Fetch History (GET /execution/history?page=1&limit=10)
  ↓
Render History List
  ↓
Click Page → Fetch Next/Previous Page
```

## GovernancePage

### Switch Tab

```
Click Tab
  ↓
Update URL (/governance/:tab)
  ↓
Fetch Tab Data
  ↓
Render Tab Content
```

### Search Audit

```
Type in Search Bar
  ↓
Debounce (300ms)
  ↓
Fetch Audit (GET /governance/audit?search=:query)
  ↓
Render Filtered Results
```

## TaskManagementPage

### Create Task

```
Click "Create Task"
  ↓
Open Modal
  ↓
Fill Form (title, description, priority, assignedTo)
  ↓
Click "Create"
  ↓
Validate Form (title required)
  ↓
POST /tasks
  ↓
Close Modal
  ↓
Show Toast "Task Created"
  ↓
Refetch Tasks
```

### Delete Task

```
Click "Delete" on Task Row
  ↓
Show ConfirmDialog "Delete this task?"
  ↓
Click "Confirm"
  ↓
DELETE /tasks/:id
  ↓
Show Toast "Task Deleted"
  ↓
Refetch Tasks
```

## NotificationsPage

### Mark as Read

```
Click "Mark Read" on Notification
  ↓
PUT /notifications/:id/read
  ↓
Update local state (read = true)
  ↓
Refetch Notifications
```

### Mark All as Read

```
Click "Mark All as Read"
  ↓
Disable Button
  ↓
PUT /notifications/read-all
  ↓
Show Toast "All marked as read"
  ↓
Refetch Notifications
```

---

# Step 24 — Error Recovery

Define recovery actions for every error code.

| Code | Trigger | Recovery Sequence |
|------|---------|-------------------|
| 401 | JWT expired or invalid | 1. Clear JWT from storage 2. Redirect to `/login` 3. Store requested URL in sessionStorage 4. After login, redirect to stored URL |
| 403 | Insufficient permissions | 1. Show "Access Denied" page 2. Log permission failure 3. Offer "Request Access" link |
| 404 | Resource not found | 1. Show "Not Found" page 2. Log missing resource 3. Offer "Go Home" link |
| 422 | Validation error | 1. Parse error response 2. Highlight invalid fields 3. Show inline error messages 4. Focus first invalid field |
| 429 | Rate limited | 1. Parse Retry-After header 2. Show "Too many requests" 3. Show countdown timer 4. Auto-retry after timer |
| 500 | Server error | 1. Show error with retry button 2. Generate support ID 3. Log error details 4. Offer "Contact Support" link |
| 503 | Maintenance | 1. Show maintenance banner 2. Disable all actions 3. Show estimated restore time 4. Auto-refresh every 60s |

## Error Recovery UI Patterns

### 401 Recovery Flow

```
JWT Expired
  ↓
Clear localStorage (token, user)
  ↓
Save current URL to sessionStorage
  ↓
Redirect to /login
  ↓
After successful login
  ↓
Check sessionStorage for saved URL
  ↓
Redirect to saved URL (or /dashboard)
```

### 500 Recovery Flow

```
Server Error
  ↓
Show ErrorState component
  ↓
Display support ID (generated UUID)
  ↓
Show retry button
  ↓
Click retry → retry request
  ↓
If retry fails → show "Contact Support" with support ID
```

### Network Failure Recovery

```
Network Error
  ↓
Show offline banner
  ↓
Monitor network status
  ↓
Network restored → auto-retry pending requests
  ↓
Show "Connection restored" toast
```

---

# Step 25 — Performance Targets

| Screen | Metric | Target | Measurement |
|--------|--------|--------|-------------|
| Dashboard | Initial render | < 1.5s | Time to interactive |
| Dashboard | Portfolio fetch | < 500ms | API response time |
| Dashboard | Activity fetch | < 500ms | API response time |
| Migration | Initial render | < 1.5s | Time to interactive |
| Migration | Systems fetch | < 500ms | API response time |
| Migration | Batches fetch | < 500ms | API response time |
| Migration | Polling interval | 2s | Fixed interval |
| Migration | Progress update | < 100ms | State update time |
| Governance | Initial render | < 1.5s | Time to interactive |
| Governance | Tab switch | < 300ms | Tab content render |
| Governance | Search debounce | 300ms | Debounce delay |
| Governance | Audit fetch | < 500ms | API response time |
| Tasks | Initial render | < 1.5s | Time to interactive |
| Tasks | Create task | < 300ms | Form submit to modal close |
| Tasks | Delete task | < 300ms | Confirm to toast |
| Notifications | Initial render | < 1.5s | Time to interactive |
| Notifications | Mark read | < 200ms | API response time |
| Notifications | Mark all read | < 300ms | API response time |
| Settings | Initial render | < 1.5s | Time to interactive |
| Settings | Save setting | < 300ms | Form submit to toast |
| Login | Initial render | < 1s | Time to interactive |
| Login | Auth attempt | < 2s | API response time |
| All | Skeleton display | < 100ms | Time to show skeleton |
| All | Error display | < 100ms | Time to show error |
| All | Toast display | < 100ms | Time to show toast |
| All | Pagination | < 500ms | Page load time |
| All | Search results | < 500ms | API response time |

## Bundle Size Targets

| Bundle | Target | Notes |
|--------|--------|-------|
| Initial JS | < 200KB | gzipped |
| Initial CSS | < 50KB | gzipped |
| Total First Load | < 250KB | gzipped |
| Lazy-loaded chunks | < 50KB each | Per-route chunks |

---

# Step 26 — Accessibility

## WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Colour Contrast | 4.5:1 for normal text, 3:1 for large text |
| Keyboard Navigation | All interactive elements focusable and operable via keyboard |
| Focus Order | Logical tab order matching visual layout |
| Screen Readers | ARIA labels for all interactive elements |
| Modal Focus Trapping | Tab cycles within modal when open |
| Escape Handling | Escape closes modals, dropdowns, popovers |
| Button Labels | All buttons have visible text or aria-label |
| Form Labels | All inputs have associated labels |
| Error Messages | Linked to inputs via aria-describedby |
| Loading States | aria-busy="true" on loading containers |
| Skip Link | "Skip to main content" link at top of page |

## ARIA Labels

| Element | ARIA Label |
|---------|------------|
| Navigation sidebar | `aria-label="Main navigation"` |
| Page header | `role="banner"` |
| Main content | `role="main"` |
| Footer | `role="contentinfo"` |
| Loading spinner | `aria-label="Loading"` |
| Search input | `aria-label="Search"` |
| Pagination | `aria-label="Pagination"` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Status badge | `aria-label="[status]"` |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Tab panel | `role="tabpanel"`, `aria-labelledby` |
| Tab button | `role="tab"`, `aria-selected`, `aria-controls` |
| Table | `role="table"`, `aria-label` |
| Table sort button | `aria-sort="ascending|descending|none"` |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` | Activate button/link |
| `Space` | Activate button/checkbox |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigate within tabs/dropdowns |
| `Home` | Move to first item in list |
| `End` | Move to last item in list |

## Focus Management

| Scenario | Behaviour |
|----------|-----------|
| Page load | Focus first heading or main content |
| Modal open | Focus first focusable element in modal |
| Modal close | Return focus to trigger element |
| Tab switch | Focus new tab panel |
| Form error | Focus first invalid field |
| Toast show | Do not steal focus |
| Navigation | Focus new page main content |

---

# Step 27 — Testing Matrix

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Unit Tests | Components, hooks, utilities | Vitest, React Testing Library | 80% |
| Integration Tests | Page + API interactions | Vitest, MSW | 70% |
| E2E Tests | Critical user flows | Playwright | P0 screens |
| Visual Regression | UI component snapshots | Playwright screenshot | Shared components |
| API Mock Tests | API contract validation | MSW, Vitest | All endpoints |
| Permission Tests | Role-based access | Vitest, custom helpers | All protected routes |
| Accessibility Tests | WCAG compliance | axe-core, Playwright | All pages |
| Performance Tests | Load time, bundle size | Lighthouse CI | All pages |

## Critical E2E Flows

| Flow | Steps | Expected Result |
|------|-------|-----------------|
| Login | Enter credentials → Submit → Redirect | Dashboard loads |
| Start Migration | Click Start → Enter Project ID → Submit | Migration starts, progress updates |
| View Governance | Navigate → Click tabs → Verify data | Tabs load with real data |
| Create Task | Click Create → Fill form → Submit | Task appears in list |
| Mark Notification Read | Click Mark Read → Verify | Notification marked as read |
| Permission Denied | Login as Viewer → Access /users | Access Denied shown |

## Test Data Strategy

| Data Type | Source | Refresh |
|-----------|--------|---------|
| Users | Seed data + test fixtures | On migration |
| Systems | Seed data | On migration |
| Batches | Test fixtures | On migration |
| Controls | Seed data | On migration |
| Notifications | Test fixtures | On test start |
| Tasks | Test fixtures | On test start |

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
| Mobile | 1-column card grid, activity list (no table) |

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

### NotificationsPage

| Breakpoint | Layout |
|------------|--------|
| Desktop | Full notification list |
| Tablet | Full notification list |
| Mobile | Compact notification list |

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

# Deliverables

Produce:

`01_Master_Frontend_Restoration_Specification.md`

Save report to:

```
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Verification/
           └── 25_Frontend_Architecture/
```

Also produce:

`01_Master_Frontend_Restoration_Specification.xlsx`

With tabs for every section.

Also produce:

`02_Master_Component_Library.md`

Save report to:

```
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Verification/
           └── 25_Frontend_Architecture/
```

---

This document is the **Master Frontend Restoration Specification**. Every Phase 09 prompt simply says:

> "Restore [Screen] according to Section [X] of the Master Frontend Restoration Specification."

No duplicated instructions. Single source of truth.

---

**Document Revision History**

| Revision | Date | Changes |
|----------|------|---------|
| 1 | 2026-07-27 | Initial reconciliation — Steps 1-4, Traceability Chain |
| 2 | 2026-07-27 | Added Steps 5-11: Screen→Component, UX Behaviours, Permissions, State Management, Navigation, Entity Relationships, Restoration Confidence |
| 3 | 2026-07-27 | Added Steps 12-19: Component Library, Design System, API Contracts, Error Codes, Route Map, Feature Flags, Restoration Order, Acceptance Criteria |
| 4 | 2026-07-27 | Added Steps 20-29: State Machines, Component Ownership, API Versioning, Event Flow, Error Recovery, Performance, Accessibility, Testing, Responsive, Design Tokens |
