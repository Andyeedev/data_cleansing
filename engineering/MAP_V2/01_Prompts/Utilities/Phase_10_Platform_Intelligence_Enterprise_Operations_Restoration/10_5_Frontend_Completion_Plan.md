# Phase 10.5 — Frontend Completion Plan

**Date:** 2026-08-04
**Status:** Planning Complete
**Scope:** Complete all 5 frontend workstreams to approved design layouts

---

## Overview

Five independent workstreams, each following the same approval gate process:

| ID | Workstream | Target Layout | Est. Effort | Priority |
|----|-----------|---------------|-------------|----------|
| 10.5.1 | Connection Manager | Option C – Full Diagnostic | 10-14 days | P0 |
| 10.5.2 | Discovery | Option C – Tree + Table | 7-10 days | P0 |
| 10.5.3 | Mapping | Option C – Spreadsheet Grid | 13-18 days | P1 |
| 10.5.4 | Validation | Option B – Real-time Dashboard Grid | 10-14 days | P1 |
| 10.5.5 | Onboarding | New build | 8-12 days | P2 |

**Total estimated effort:** 48-68 developer-days

---

## Approval Gates (Same for All Workstreams)

| Gate | Description | Deliverable |
|------|-------------|-------------|
| **G1: Design Approved** | Layout option confirmed, wireframes reviewed | Design spec document |
| **G2: Backend Complete** | All API endpoints implemented and tested | API test results |
| **G3: Frontend Complete** | UI matches approved layout, all states handled | Screenshot/video walkthrough |
| **G4: Integration Verified** | End-to-end flow works with real data | Demo to stakeholder |
| **G5: Closure** | Code reviewed, tests pass, documented | Merge to main |

---

## Cross-Cutting Concerns (Apply to All Workstreams)

### Shared Components to Use
| Component | Use In |
|-----------|--------|
| `StatusBadge` | All workstreams |
| `MetricCard` | Connection, Validation, Onboarding |
| `DataTable` | Connection, Discovery, Mapping, Validation |
| `EmptyState` | All workstreams |
| `ErrorState` | All workstreams |
| `LoadingSkeleton` | All workstreams |
| `SearchBar` | Connection, Discovery, Mapping |
| `Pagination` | Connection, Discovery, Mapping, Validation |
| `Modal` | Connection, Mapping, Onboarding |
| `ConfirmDialog` | Connection, Mapping |
| `TabBar` | Connection, Discovery, Validation |
| `ProgressBar` | Discovery, Validation |
| `PageHeader` | All workstreams |
| `PageContainer` | All workstreams |
| `TenantFilter` | All workstreams |

### Shared Infrastructure
- **API Client:** `src/utils/apiClient.ts` — `apiGet`, `apiPost`, `apiPut`, `apiDelete`
- **Auth:** `src/context/AuthContext.tsx` — `useAuth()`, `userRoles`, `currentTenant`
- **Types:** Extract to `src/types/{domain}.ts` per workstream
- **Hooks:** Create `src/hooks/use{Domain}.ts` per workstream

### Design Principles
1. All styles use inline `style` objects with CSS variables
2. No Tailwind, no CSS modules, no CSS-in-JS
3. All components use ARIA roles and keyboard navigation
4. Loading/Error/Empty states required on every data-fetching view
5. Dark mode support via CSS variables (no hardcoded colors)

---

## Dependency Map

```
10.5.1 (Connection Manager)  ← No dependencies
10.5.2 (Discovery)           ← Depends on 10.5.1 (needs systems to exist)
10.5.3 (Mapping)             ← Depends on 10.5.2 (needs discovery results)
10.5.4 (Validation)          ← No dependencies (independent of 10.5.1-3)
10.5.5 (Onboarding)          ← Depends on 10.5.1 (needs system registration)
```

**Recommended execution order:**
1. Start 10.5.1 and 10.5.4 in parallel (no dependencies)
2. Start 10.5.2 after 10.5.1 completes
3. Start 10.5.3 after 10.5.2 completes
4. Start 10.5.5 after 10.5.1 completes

---

## Related Documents

| Document | Path |
|----------|------|
| 10.5.1 Connection Manager | `10_5_1_Connection_Manager_Completion.md` |
| 10.5.2 Discovery | `10_5_2_Discovery_Completion.md` |
| 10.5.3 Mapping | `10_5_3_Mapping_Completion.md` |
| 10.5.4 Validation | `10_5_4_Validation_Completion.md` |
| 10.5.5 Onboarding | `10_5_5_Onboarding_Completion.md` |

## Phase 10.5 Implementation Gate

Before implementing anything:

Inspect the existing codebase and determine whether the capability already exists (fully or partially).
Reuse and extend existing implementations wherever possible. Do not duplicate functionality.
Cross-reference:
10_3_Assessment_Report.md
10_4_Platform_Stabilisation.md
10_4_Platform_Stabilisation_Closure_Report.md
Phase 10 architecture documents.
Document your findings before making any code changes.

For every Phase 10.5.x task, follow this mandatory sequence:

Assess the current implementation.
Compare it against the approved Phase 10 architecture.
Identify exactly what is already complete, partially complete, and missing.
Propose the minimum implementation required.
Stop and wait for approval.
After approval, implement only the approved scope.
Verify that MAP CLI, Backend, Frontend, and Database integrations remain functional.
Produce a Closure Report documenting:
Files changed
Files created
Files removed
Tests executed
Integration verification
Any remaining gaps.

No redesigns, refactoring outside the approved scope, duplicate implementations, or additional features are permitted without explicit approval.