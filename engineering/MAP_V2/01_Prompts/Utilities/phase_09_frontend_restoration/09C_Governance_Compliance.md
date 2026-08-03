# 09C — Governance & Compliance

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
| GovernancePage | Audit first | `src/routes/GovernancePage.tsx` | ✅ | ✅ | ❌ | ❌ |
| useAuditLog | Audit first | `src/hooks/useAuditLog.ts` | ✅ | ✅ | ❌ | ❌ |
| useApprovals | Audit first | `src/hooks/useApprovals.ts` | ✅ | ✅ | ❌ | ❌ |
| RiskTab | Audit first | Check for risk data patterns | — | — | — | Feature flag only |

---

## Dependency Order

```
Shared Components (from 09A)
    ↓
GovernancePage (refactor, preserve existing tabs)
    ↓
OverviewTab (reuse MetricCards from Dashboard)
    ↓
ComplianceTab (refactor existing)
    ↓
ControlsTab (preserve empty state pattern)
    ↓
ExceptionsTab (preserve existing)
    ↓
RiskTab (wire into feature flag framework)
    ↓
AuditTab (refactor, preserve search/filter)
    ↓
ApprovalsTab (preserve existing)
```

---

## Objective

Restore governance functionality. **Wire Risk tab into feature flag framework instead of empty state.**

---

## Risk Tab Rule

> **NO mock data. Only EmptyState.** This prevents fake governance metrics appearing.

- If `engine.migration_risk_scores` does not exist → show EmptyState
- If feature flag `risk_enabled` is false → hide tab entirely
- Never fabricate risk scores, percentages, or compliance metrics
- Never use placeholder numbers that look real

---

## Scope

### Screens

| Screen | Component Hierarchy | Priority |
|--------|---------------------|----------|
| GovernancePage | TabBar → 7 tabs (Overview, Compliance, Controls, Exceptions, Risk, Audit, Approvals) | P0 |
| OverviewTab | ComplianceCards (Score, Total, Passed, Failed) | P0 |
| ComplianceTab | ComplianceDetails | P0 |
| ControlsTab | EmptyState ("No controls configured") | P0 |
| ExceptionsTab | ExceptionList | P0 |
| RiskTab | EmptyState ("No risk data available") — B-07 blocked | P0 |
| AuditTab | SearchFilter + TypeFilter + AuditList | P0 |
| ApprovalsTab | ApprovalList | P0 |

**Source:** Master Spec Step 5 (Screen → Component Hierarchy) — GovernancePage section

---

### GovernancePage

#### Component Hierarchy (Step 5)

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

#### UX Behaviours (Step 6)

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

#### Permissions (Step 7)

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Governance Page | ✅ | ✅ | ✅ | ❌ |
| View Compliance | ✅ | ✅ | ✅ | ❌ |
| View Audit Log | ✅ | ✅ | ✅ | ❌ |
| View Approvals | ✅ | ✅ | ❌ | ❌ |
| Approve/Reject | ✅ | ❌ | ❌ | ❌ |
| View Exceptions | ✅ | ✅ | ✅ | ❌ |

#### State Machine (Step 20)

```
Idle → LoadingTab → Loaded → (TabEmpty | TabData) → Error
```

#### API Endpoints (Step 14)

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/governance/compliance` | GET | `{ totalControls, compliant, nonCompliant, complianceRate, bySeverity }` |
| `GET /api/v1/governance/audit` | GET | `[{ id, controlName, action, result, timestamp, userName }]` |
| `GET /api/v1/governance/exceptions` | GET | `[{ id, controlName, severity, failureScope, description, createdAt }]` |
| `GET /api/v1/governance/approvals` | GET | `[{ id, batchNumber, gateResult, requestedAt, decidedAt }]` |

#### Performance Targets (Step 25)

| Metric | Target |
|--------|--------|
| Initial render | < 1.5s |
| Tab switch | < 300ms |
| Search debounce | 300ms |

---

## Required Shared Components (from 09A)

- TabBar (URL-driven)
- MetricCard (for ComplianceCards)
- StatusBadge (for approval status)
- DataTable (for audit list, exception list, approval list)
- SearchBar (for audit search)
- EmptyState
- ErrorState
- LoadingSkeleton
- Pagination

---

## Acceptance Criteria

- [ ] GovernancePage renders with 7 tabs
- [ ] Tab navigation is URL-driven (`/governance/:tab`)
- [ ] Overview tab loads compliance cards with real data
- [ ] Compliance tab loads compliance details
- [ ] Audit tab loads with search and type filter
- [ ] Exceptions tab loads exception list
- [ ] Approvals tab loads approval list (admin only)
- [ ] Risk tab shows "No risk data available" (B-07 blocked)
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced (Viewer blocked, Approvals admin-only)
- [ ] All API contracts match Step 14
- [ ] Performance targets met (Step 25)

---

## Blocked Items

| Blocker | Issue | Resolution |
|---------|-------|------------|
| B-07 | `engine.migration_risk_scores` does not exist | Risk tab shows empty state; BLOCKED per RULE 16/18 |

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| GovernancePage | Step 5, Step 6, Step 7, Step 20 |
| API contracts | Step 14 |
| State machine | Step 20 |
| Performance | Step 25 |
| Blocked items | Appendix A |
