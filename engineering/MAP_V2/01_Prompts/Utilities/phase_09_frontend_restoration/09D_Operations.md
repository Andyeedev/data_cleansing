# 09D — Operations

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
| OperationsPage | Audit first | `src/routes/OperationsPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| useHealth | Audit first | `src/hooks/useHealth.ts` | ✅ | ✅ | ❌ | ❌ |
| useMonitoring | Audit first | `src/hooks/useMonitoring.ts` | ✅ | ✅ | ❌ | ❌ |
| PollingManager | Audit first | Check for polling patterns | — | — | — | ✅ if missing |
| AlertBanner | Audit first | Check for alert components | — | — | — | ✅ if missing |

---

## Dependency Order

```
Shared Components (from 09A)
    ↓
OperationsPage (refactor, preserve existing tabs)
    ↓
MonitoringTab (refactor existing monitoring display)
    ↓
AlertsTab (create using AlertBanner from 09A)
    ↓
SchedulesTab (preserve empty state pattern)
    ↓
RetryTab (preserve empty state pattern)
    ↓
HealthTab (refactor existing health display)
```

---

## Objective

Restore operational monitoring.

---

## Polling Architecture

> **Centralised PollingManager avoids three timers running independently.**

Instead of `setInterval()` inside each component:

```
PollingService (manages all timers)
    ↓
usePolling() (hook for components)
    ↓
MonitoringTab
AlertsTab
HealthTab
```

- Single PollingService manages all polling intervals
- `usePolling(interval, callback)` hook for components
- Components mount → register polling → unmount → cleanup
- Prevents duplicate timers and memory leaks

---

## Scope

### Screens

| Screen | Component Hierarchy | Priority |
|--------|---------------------|----------|
| OperationsPage | TabBar → 5 tabs (Monitoring, Alerts, Schedules, Retry, Health) | P0 |
| MonitoringTab | SystemHealthCard + ActiveQueueCard + RecentExecutionsCard | P0 |
| AlertsTab | AlertList | P0 |
| SchedulesTab | EmptyState ("No scheduled tasks") | P0 |
| RetryTab | EmptyState ("No items in retry queue") | P0 |
| HealthTab | HealthDetails (Database, API, Services) | P0 |

**Source:** Master Spec Step 5 (Screen → Component Hierarchy) — OperationsPage section

---

### OperationsPage

#### Component Hierarchy (Step 5)

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

#### UX Behaviours (Step 6)

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

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Operations Page | ✅ | ✅ | ✅ | ❌ |
| View Monitoring | ✅ | ✅ | ✅ | ❌ |
| View Alerts | ✅ | ✅ | ✅ | ❌ |
| View Health | ✅ | ✅ | ❌ | ❌ |

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/operations/health` | GET | `{ database, api, services: { migration, validation, governance }, lastCheck }` |
| `GET /api/v1/operations/alerts` | GET | `[{ id, type, title, message, timestamp, acknowledged }]` |

---

## Required Shared Components (from 09A)

- TabBar
- MetricCard (for health indicators)
- StatusBadge (for alert severity, health status)
- DataTable (for alert list, execution list)
- EmptyState
- ErrorState
- LoadingSkeleton

---

## Acceptance Criteria

- [ ] OperationsPage renders with 5 tabs
- [ ] Monitoring tab loads health, queue, and execution data
- [ ] SystemHealthCard shows green/red indicators
- [ ] Alerts tab loads alert list with severity badges
- [ ] Schedules tab shows empty state
- [ ] Retry tab shows empty state
- [ ] Health tab loads detailed health status
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (Admin/Tenant Admin for Health)
- [ ] All API contracts match Step 14

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| OperationsPage | Step 5, Step 6, Step 7 |
| API contracts | Step 14 |
