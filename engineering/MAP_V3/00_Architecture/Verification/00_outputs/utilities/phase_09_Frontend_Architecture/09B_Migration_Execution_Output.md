# 09B — Migration & Execution — Architecture Output

> **Generated from:** `09B_Migration_Execution.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09B — Migration & Execution, restoring operational execution capability.

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
MigrationPage (refactor, preserve existing logic)
    ↓
ValidationPage (refactor, preserve existing logic)
    ↓
ValidationResultsPage (refactor, preserve existing logic)
    ↓
Execution hooks (migrate to apiClient)
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

### 1.1 MigrationPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/migration` |
| Component | `MigrationPage.tsx` |
| Priority | P0 |
| Tabs | Execution, History |

#### Component Tree

```
MigrationPage
├── TabBar
│   ├── ExecutionTab
│   │   ├── StartMigrationForm
│   │   │   ├── ProjectIdInput
│   │   │   └── StartMigrationButton
│   │   └── ProgressSection
│   │       ├── ProgressBar
│   │       ├── StatusBadge
│   │       ├── TotalControlsCount
│   │       ├── CompletedCount
│   │       ├── FailedCount
│   │       └── PollingIndicator
│   └── HistoryTab
│       ├── HistoryList
│       ├── Pagination
│       └── EmptyState
```

#### State Machine

```
Idle → Loading → Loaded → Starting → Polling → Updating → Completed → Failed
```

#### Event Flow

1. User clicks "Start Migration"
2. Form validates (Project ID required)
3. Button disabled, text changes to "Starting..."
4. POST `/api/v1/execution/run`
5. Receive batchId
6. Begin polling (GET `/api/v1/execution/status/:batchId` every 2s)
7. Update progress bar
8. On completion: show toast, refetch dashboard

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/migration/systems` | GET | `[{ id, name, type, controlCount, status }]` |
| `GET /api/v1/migration/batches` | GET | `[{ id, batchNumber, status, progress }]` |
| `POST /api/v1/migration/batches` | POST | `{ id, batchNumber, status }` |
| `GET /api/v1/migration/batches/:id/history` | GET | `[{ id, action, timestamp, details }]` |

#### Permissions

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Migration | ✅ | ✅ | ❌ | ❌ |
| Start Migration | ✅ | ✅ | ❌ | ❌ |
| View History | ✅ | ✅ | ❌ | ❌ |

---

### 1.2 ValidationPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/validation` |
| Component | `ValidationPage.tsx` |
| Priority | P0 |

#### Component Tree

```
ValidationPage
├── ValidationForm
│   ├── BatchSelect
│   └── RunValidationButton
├── WorkflowList
│   └── WorkflowItem
└── EmptyState
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `POST /api/v1/validation/run` | POST | `{ id, status }` |
| `GET /api/v1/validation/workflows` | GET | `[{ id, name, status, lastRun }]` |

---

### 1.3 ValidationResultsPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/validation/reports/:id` |
| Component | `ValidationResultsPage.tsx` |
| Priority | P0 |

#### Component Tree

```
ValidationResultsPage
├── BatchStatus
│   ├── StatusBadge
│   └── ProgressDisplay
├── ValidationResultList
│   └── ValidationResultItem
└── EmptyState
```

---

## 2. Shared Components Required

| Component | Usage |
|-----------|-------|
| TabBar | Execution/History tabs |
| ProgressBar | Migration progress |
| StatusBadge | Batch status, validation status |
| EmptyState | No executions, no results |
| ErrorState | API errors |
| LoadingSkeleton | Loading states |
| Pagination | History pagination |

---

## 3. Files to Implement

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/routes/MigrationPage.tsx` | Inspect existing implementation. Refactor to align with shared components. Create only if no equivalent page exists. |
| `src/routes/ValidationPage.tsx` | Inspect existing implementation. Refactor to align with shared components. Create only if no equivalent page exists. |
| `src/routes/ValidationResultsPage.tsx` | Inspect existing implementation. Refactor to align with shared components. Create only if no equivalent page exists. |
| `src/hooks/useExecution.ts` | Inspect existing implementation. Migrate to apiClient. Preserve current behaviour. |
| `src/hooks/useExecutionHistory.ts` | Inspect existing implementation. Migrate to apiClient. Preserve current behaviour. |

---

## 4. Performance Targets

| Metric | Target |
|--------|--------|
| Initial render | < 1.5s |
| Polling interval | 2s |
| Progress update | < 100ms |

---

## 5. Acceptance Criteria

- [ ] MigrationPage renders with Execution and History tabs
- [ ] Start Migration form validates and submits
- [ ] Progress polling updates every 2 seconds
- [ ] Status badge shows correct colour coding
- [ ] History tab loads with pagination
- [ ] Empty states display when no data
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (Admin/Tenant Admin only)

---

## 6. Approval Required

- [ ] MigrationPage architecture approved
- [ ] ValidationPage architecture approved
- [ ] API contracts approved
- [ ] State machine approved
- [ ] Event flow approved

**Awaiting your approval before implementation.**
