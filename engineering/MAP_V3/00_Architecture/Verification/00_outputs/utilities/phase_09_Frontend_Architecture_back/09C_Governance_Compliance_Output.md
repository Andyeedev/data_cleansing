# 09C — Governance & Compliance — Architecture Output

> **Generated from:** `09C_Governance_Compliance.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09C — Governance & Compliance, restoring governance functionality.

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

### 1.1 GovernancePage

> Existing page-specific business logic should remain in place wherever possible; only presentation, shared components, and platform services should be standardised.

| Property | Value |
|----------|-------|
| Route | `/governance` |
| Component | `GovernancePage.tsx` |
| Priority | P0 |
| Tabs | Overview, Compliance, Controls, Exceptions, Risk, Audit, Approvals |

#### Component Tree

```
GovernancePage
├── TabBar (URL-driven)
│   ├── OverviewTab → ComplianceCards
│   ├── ComplianceTab → ComplianceDetails
│   ├── ControlsTab → EmptyState
│   ├── ExceptionsTab → ExceptionList
│   ├── RiskTab → EmptyState (B-07 blocked)
│   ├── AuditTab → SearchFilter + TypeFilter + AuditList
│   └── ApprovalsTab → ApprovalList
```

#### State Machine

```
Idle → LoadingTab → Loaded → (TabEmpty | TabData) → Error
```

#### API Contracts

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/governance/compliance` | GET | `{ totalControls, compliant, nonCompliant, complianceRate, bySeverity }` |
| `GET /api/v1/governance/audit` | GET | `[{ id, controlName, action, result, timestamp, userName }]` |
| `GET /api/v1/governance/exceptions` | GET | `[{ id, controlName, severity, failureScope, description, createdAt }]` |
| `GET /api/v1/governance/approvals` | GET | `[{ id, batchNumber, gateResult, requestedAt, decidedAt }]` |

#### Permissions

| Feature | Super Admin | Tenant Admin | Operator | Viewer |
|---------|-------------|--------------|----------|--------|
| View Governance | ✅ | ✅ | ✅ | ❌ |
| View Compliance | ✅ | ✅ | ✅ | ❌ |
| View Audit | ✅ | ✅ | ✅ | ❌ |
| View Approvals | ✅ | ✅ | ❌ | ❌ |
| Approve/Reject | ✅ | ❌ | ❌ | ❌ |
| View Exceptions | ✅ | ✅ | ✅ | ❌ |

---

## 2. Tab Behaviour

| Tab | URL | Loads | Empty State |
|-----|-----|-------|-------------|
| Overview | `/governance/overview` | Compliance cards | "—" placeholders |
| Compliance | `/governance/compliance` | Compliance details | "No compliance data" |
| Controls | `/governance/controls` | — | "No controls configured" |
| Exceptions | `/governance/exceptions` | Exception list | "No active exceptions" |
| Risk | `/governance/risk` | — | "No risk data available" |
| Audit | `/governance/audit` | Audit list + filters | "No audit entries found" |
| Approvals | `/governance/approvals` | Approval list | "No pending approvals" |

---

## 3. Shared Components Required

| Component | Usage |
|-----------|-------|
| TabBar | URL-driven 7-tab navigation |
| MetricCard | Compliance score cards |
| StatusBadge | Approval status, exception severity |
| DataTable | Audit list, exception list, approval list |
| SearchBar | Audit search |
| EmptyState | Tab-specific empty states |
| ErrorState | API errors |
| LoadingSkeleton | Loading states |

---

## 4. Files to Implement

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/routes/GovernancePage.tsx` | Inspect existing implementation. Refactor to align with shared components. Create only if no equivalent page exists. |

---

## 5. Blocked Items

| Blocker | Issue | Impact |
|---------|-------|--------|
| B-07 | `engine.migration_risk_scores` does not exist | Risk tab shows empty state only |

---

## 6. Performance Targets

| Metric | Target |
|--------|--------|
| Initial render | < 1.5s |
| Tab switch | < 300ms |
| Search debounce | 300ms |

---

## 7. Acceptance Criteria

- [ ] GovernancePage renders with 7 tabs
- [ ] Tab navigation is URL-driven
- [ ] Overview tab loads compliance cards
- [ ] Audit tab loads with search and type filter
- [ ] Exceptions tab loads exception list
- [ ] Approvals tab loads approval list (admin only)
- [ ] Risk tab shows empty state (B-07 blocked)
- [ ] Skeleton loaders display during fetch
- [ ] Error states display with retry button
- [ ] Permissions enforced

---

## 8. Approval Required

- [ ] GovernancePage architecture approved
- [ ] Tab behaviour approved
- [ ] API contracts approved
- [ ] Blocked items acknowledged

**Awaiting your approval before implementation.**
