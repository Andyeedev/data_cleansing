# Phase 11 — Mandatory Implementation Gates

**Document:** 00_Mandatory_Implementation_Gates.md  
**Applies To:** Phase 11, 12, 13, and all future workstreams  
**Created:** 2026-08-06  
**Status:** Mandatory  

---

## 1. Gate 0.5 — Existing Frontend Review (Mandatory)

Before proposing changes or creating new components, review the existing Validation frontend to ensure consistency and reuse.

### 1.1 Existing Validation Pages

| # | Page | File | Purpose |
|---|------|------|---------|
| 1 | Validation → Overview | `src/routes/ValidationDashboardPage.tsx` | Real-time validation health and risk monitoring |
| 2 | Validation → Results | `src/routes/ValidationResultsPage.tsx` | Detailed validation report for a specific batch |
| 3 | Validation → History | `src/routes/ExecutionHistoryPage.tsx` | Historical execution data |

### 1.2 Existing Shared Components

| # | Component | File | Purpose |
|---|-----------|------|---------|
| 1 | `StatusBadge` | `src/components/shared/StatusBadge.tsx` | Status indicators (success, error, warning, info) |
| 2 | `ProgressBar` | `src/components/shared/ProgressBar.tsx` | Progress visualization |
| 3 | `DataTable` | `src/components/shared/DataTable.tsx` | Tabular data display |
| 4 | `MetricCard` | `src/components/shared/MetricCard.tsx` | KPI metric cards |
| 5 | `EmptyState` | `src/components/shared/EmptyState.tsx` | Empty state placeholders |
| 6 | `ErrorState` | `src/components/shared/ErrorState.tsx` | Error state display |
| 7 | `LoadingSkeleton` | `src/components/shared/LoadingSkeleton.tsx` | Loading placeholders |
| 8 | `SearchBar` | `src/components/shared/SearchBar.tsx` | Search input |
| 9 | `Pagination` | `src/components/shared/Pagination.tsx` | Table pagination |
| 10 | `Modal` | `src/components/shared/Modal.tsx` | Modal dialogs |
| 11 | `ConfirmDialog` | `src/components/shared/ConfirmDialog.tsx` | Confirmation dialogs |
| 12 | `ToastContainer` | `src/components/shared/Toast.tsx` | Toast notifications |
| 13 | `TabBar` | `src/components/shared/TabBar.tsx` | Tab navigation |
| 14 | `SplitPane` | `src/components/shared/SplitPane.tsx` | Split pane layout |
| 15 | `TenantFilter` | `src/components/shared/TenantFilter.tsx` | Tenant selection filter |

### 1.3 Existing Layout Components

| # | Component | File | Purpose |
|---|-----------|------|---------|
| 1 | `PageHeader` | `src/components/PageHeader/PageHeader.tsx` | Page header with title, description, actions |

### 1.4 Existing Hooks/Services

| # | Hook | File | Purpose |
|---|------|------|---------|
| 1 | `useValidationDashboard` | `src/hooks/useValidation.ts` | Fetch validation dashboard data |
| 2 | `useValidationReport` | `src/hooks/useValidation.ts` | Fetch validation report by batch ID |
| 3 | `useGovernanceDecision` | `src/hooks/useValidation.ts` | Fetch governance decision |
| 4 | `useRiskScore` | `src/hooks/useValidation.ts` | Fetch risk score |
| 5 | `useComplianceChecks` | `src/hooks/useValidation.ts` | Fetch compliance checks |
| 6 | `useExecutionHistory` | `src/hooks/useValidation.ts` | Fetch execution history |
| 7 | `useExecutionControl` | `src/hooks/useValidation.ts` | Cancel/retry execution |
| 8 | `useAutoRefresh` | `src/hooks/useValidation.ts` | Auto-refresh polling |
| 9 | `useStatusBreakdown` | `src/hooks/useValidation.ts` | Fetch status breakdown |

### 1.5 Existing Types

| # | Type | File | Purpose |
|---|------|------|---------|
| 1 | `ValidationDashboard` | `src/types/validation.ts` | Dashboard data structure |
| 2 | `ValidationReport` | `src/types/validation.ts` | Report data structure |
| 3 | `ControlSummary` | `src/types/validation.ts` | Control summary structure |
| 4 | `GovernanceDecision` | `src/types/validation.ts` | Governance decision structure |
| 5 | `RiskScore` | `src/types/validation.ts` | Risk score structure |
| 6 | `ComplianceCheck` | `src/types/validation.ts` | Compliance check structure |
| 7 | `Exception` | `src/types/validation.ts` | Exception structure |
| 8 | `ExecutionHistoryItem` | `src/types/validation.ts` | Execution history item structure |

### 1.6 Existing Routes

| # | Route | File | Purpose |
|---|-------|------|---------|
| 1 | `/validation/overview` | `src/routes/ValidationDashboardPage.tsx` | Dashboard page |
| 2 | `/validation/results/:batchId` | `src/routes/ValidationResultsPage.tsx` | Results page |
| 3 | `/validation/history` | `src/routes/ExecutionHistoryPage.tsx` | History page |

---

## 2. Mandatory Rules for New Validation Workstreams

### 2.1 Component Reuse

- **Reuse existing shared components** (`StatusBadge`, `ProgressBar`, `MetricCard`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `TabBar`, `Modal`, etc.)
- **Do not create duplicate components** unless explicitly approved
- **Extend existing components** if new functionality is needed

### 2.2 Hook/Service Reuse

- **Reuse existing hooks** (`useValidationDashboard`, `useValidationReport`, etc.)
- **Do not create duplicate hooks** unless explicitly approved
- **Extend existing hooks** if new functionality is needed

### 2.3 Type Reuse

- **Reuse existing types** (`ValidationDashboard`, `ValidationReport`, etc.)
- **Do not create duplicate types** unless explicitly approved
- **Extend existing types** if new functionality is needed

### 2.4 Layout Consistency

- **Use `PageHeader`** for all page headers
- **Use `MetricCard`** for KPI metrics
- **Use `StatusBadge`** for status indicators
- **Use `ProgressBar`** for progress visualization
- **Use `TabBar`** for tab navigation
- **Use `DataTable`** for tabular data

### 2.5 Route Consistency

- **Follow existing route patterns** (`/validation/overview`, `/validation/results/:batchId`, `/validation/history`)
- **Register new routes** in `AppRoutes.tsx`
- **Maintain consistent URL structure**

---

## 3. Exit Criteria for Every Assessment

Every assessment (Task 11.1, 11.2, 11.3, and future tasks) must include:

- [ ] ✅ Existing Validation frontend reviewed
- [ ] ✅ Reuse opportunities documented
- [ ] ✅ New implementation aligns with Validation → Overview, History, and Results
- [ ] ✅ No duplicate components, hooks, types, or routes created
- [ ] ✅ All changes extend existing patterns

---

## 4. Implementation Checklist

Before implementing any new Validation workstream:

- [ ] Review this document (00_Mandatory_Implementation_Gates.md)
- [ ] Review existing Validation pages (Overview, Results, History)
- [ ] Review existing shared components
- [ ] Review existing hooks and types
- [ ] Document reuse opportunities
- [ ] Get approval for any new components/hooks/types
- [ ] Implement following existing patterns
- [ ] Verify consistency with existing Validation pages

---

## 5. Future Phases

This document applies to:

- **Phase 11:** Validation Frontend Integration
- **Phase 12:** Intelligent Onboarding and Automation Platform
- **Phase 13:** Future workstreams
- **All future phases** that extend the Validation frontend

---

**End of Document**
