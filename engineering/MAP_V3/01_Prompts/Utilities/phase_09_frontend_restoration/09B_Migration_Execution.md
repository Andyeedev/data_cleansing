# 09B — Migration & Execution

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
| MigrationPage | Audit first | `src/routes/MigrationPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| ValidationPage | Audit first | `src/routes/ValidationPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| ValidationResultsPage | Audit first | `src/routes/ValidationResultsPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| useExecution | Audit first | `src/hooks/useExecution.ts` | ✅ | ✅ | ❌ | ❌ |
| useExecutionHistory | Audit first | `src/hooks/useExecutionHistory.ts` | ✅ | ✅ | ❌ | ❌ |
| PollingService | Audit first | Check for polling patterns | — | — | — | ✅ if missing |

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

## Objective

Restore operational execution capability. **Consume existing backend APIs. Only add new API endpoints if missing.**

---

## Polling Architecture

> **Polling logic MUST live in `useExecution()` hook, NOT inside MigrationPage.**

```
MigrationPage
    ↓
useExecution()  ← owns polling lifecycle
    ↓
apiClient
    ↓
ExecutionService
```

- `useExecution()` manages: start, poll, stop, error, cleanup
- MigrationPage only reads state from hook
- This prevents every execution page from copying polling logic

---

## Scope

### Screens

| Screen | Component Hierarchy | Priority |
|--------|---------------------|----------|
| MigrationPage | TabBar → ExecutionTab + HistoryTab | P0 |
| ExecutionTab | StartMigrationForm + ProgressSection | P0 |
| HistoryTab | HistoryList + Pagination + EmptyState | P0 |
| BatchDetailPage | BatchInfo + ProgressSection + HistoryList | P0 |
| ValidationPage | ValidationForm + WorkflowList | P0 |
| ValidationResultsPage | BatchStatus + ProgressDisplay | P0 |

**Source:** Master Spec Step 5 (Screen → Component Hierarchy) — MigrationPage section

---

### MigrationPage

#### Component Hierarchy (Step 5)

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

#### UX Behaviours (Step 6)

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

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Migration Page | ✅ | ✅ | ❌ | ❌ |
| Start Migration | ✅ | ✅ | ❌ | ❌ |
| View Progress | ✅ | ✅ | ❌ | ❌ |
| View History | ✅ | ✅ | ❌ | ❌ |

#### State Machine (Step 20)

```
Idle → LoadingSystems + LoadingBatches → Loaded → Starting → Polling → Updating → Polling → Completed → Failed
```

#### Event Flow (Step 23)

```
Click "Start Migration" → Validate Form → Disable Button → POST /execution/run → Receive batchId → Store batchId → Begin Polling (2s) → Update Progress Bar → Progress < 100 → Continue Polling → Progress === 100 → Stop Polling → Show Toast → Refetch Dashboard
```

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/migration/systems` | GET | `[{ id, name, type, controlCount, status }]` |
| `GET /api/v1/migration/batches` | GET | `[{ id, batchNumber, status, progress }]` |
| `POST /api/v1/migration/batches` | POST | `{ id, batchNumber, status }` |
| `GET /api/v1/migration/batches/:id/history` | GET | `[{ id, action, timestamp, details }]` |

#### Performance Targets (Step 25)

| Metric | Target |
|--------|--------|
| Initial render | < 1.5s |
| Polling interval | 2s |

---

### ValidationPage

#### Component Hierarchy

```
ValidationPage
   ├── ValidationForm
   │   ├── BatchSelect
   │   └── RunValidationButton
   ├── WorkflowList
   │   ├── WorkflowItem
   │   └── ...
   └── EmptyState ("No validation workflows")
```

#### API Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `POST /api/v1/validation/run` | POST | `{ id, status }` |
| `GET /api/v1/validation/workflows` | GET | `[{ id, name, status, lastRun }]` |

---

### ValidationResultsPage

#### Component Hierarchy

```
ValidationResultsPage
   ├── BatchStatus
   │   ├── StatusBadge
   │   └── ProgressDisplay
   ├── ValidationResultList
   │   ├── ValidationResultItem
   │   └── ...
   └── EmptyState ("No results available")
```

---

## Required Shared Components (from 09A)

- TabBar
- ProgressBar
- StatusBadge
- EmptyState
- ErrorState
- LoadingSkeleton
- Pagination
- Modal (for confirmations)
- Toast (for success/error notifications)

---

## Acceptance Criteria

- [ ] MigrationPage renders with Execution and History tabs
- [ ] Start Migration form validates and submits
- [ ] Progress polling updates every 2 seconds
- [ ] Status badge shows correct colour coding
- [ ] History tab loads with pagination
- [ ] Empty states display when no data
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (Admin/Tenant Admin only)
- [ ] ValidationPage renders with form and workflow list
- [ ] ValidationResultsPage renders batch status and results
- [ ] All API contracts match Step 14
- [ ] Performance targets met (Step 25)

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| MigrationPage | Step 5, Step 6, Step 7, Step 20, Step 23 |
| ValidationPage | Step 5, Step 6, Step 7 |
| API contracts | Step 14 |
| State machine | Step 20 |
| Event flow | Step 23 |
| Performance | Step 25 |
