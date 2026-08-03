# 09D — Operations — Architecture Output

> **Generated from:** `09D_Operations.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09D — Operations, restoring operational monitoring.

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

### 1.1 OperationsPage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/operations` |
| Component | `OperationsPage.tsx` |
| Priority | P0 |
| Tabs | Monitoring, Alerts, Schedules, Retry, Health |

#### Component Tree

```
OperationsPage
├── TabBar
│   ├── MonitoringTab
│   │   ├── SystemHealthCard
│   │   │   ├── DatabaseIndicator
│   │   │   └── APIIndicator
│   │   ├── ActiveQueueCard
│   │   └── RecentExecutionsCard
│   ├── AlertsTab → AlertList
│   ├── SchedulesTab → EmptyState
│   ├── RetryTab → EmptyState
│   └── HealthTab → HealthDetails
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/operations/health` | GET | `{ database, api, services, lastCheck }` |
| `GET /api/v1/operations/alerts` | GET | `[{ id, type, title, message, timestamp, acknowledged }]` |

#### Permissions

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Operations | ✅ | ✅ | ✅ | ❌ |
| View Monitoring | ✅ | ✅ | ✅ | ❌ |
| View Alerts | ✅ | ✅ | ✅ | ❌ |
| View Health | ✅ | ✅ | ❌ | ❌ |

---

## 2. Tab Behaviour

| Tab | Loads | Content |
|-----|-------|---------|
| Monitoring | Health, queue, executions | SystemHealthCard + ActiveQueueCard + RecentExecutionsCard |
| Alerts | Alert list | AlertList with severity badges |
| Schedules | — | EmptyState "No scheduled tasks" |
| Retry | — | EmptyState "No items in retry queue" |
| Health | Health details | Database, API, Services status |

---

## 3. Shared Components Required

| Component | Usage |
|-----------|-------|
| TabBar | 5-tab navigation |
| MetricCard | Health indicators |
| StatusBadge | Alert severity, health status |
| DataTable | Alert list, execution list |
| EmptyState | Schedules, Retry tabs |
| ErrorState | API errors |
| LoadingSkeleton | Loading states |

---

## 4. Files to Implement

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/routes/OperationsPage.tsx` | Inspect existing implementation. Refactor to align with shared components. Create only if no equivalent page exists. |
| `src/hooks/useMonitoring.ts` | Inspect existing implementation. Migrate to apiClient. Preserve current behaviour. |
| `src/hooks/useHealth.ts` | Inspect existing implementation. Migrate to apiClient. Preserve current behaviour. |

---

## 5. Acceptance Criteria

- [ ] OperationsPage renders with 5 tabs
- [ ] Monitoring tab loads health, queue, execution data
- [ ] SystemHealthCard shows green/red indicators
- [ ] Alerts tab loads with severity badges
- [ ] Schedules and Retry tabs show empty states
- [ ] Health tab loads detailed status
- [ ] Permissions enforced (Admin for Health)

---

## 6. Approval Required

- [ ] OperationsPage architecture approved
- [ ] API contracts approved
- [ ] Permissions approved

**Awaiting your approval before implementation.**
