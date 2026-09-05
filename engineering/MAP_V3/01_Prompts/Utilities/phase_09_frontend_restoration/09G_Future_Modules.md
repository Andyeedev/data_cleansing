# 09G — Future Modules

> **Generated from:** `00_MASTER_FRONTEND_RESTORATION_PROMPT.md`
> **References:** `01_Master_Frontend_Restoration_Specification.md` (Revision 4)
> **Dependencies:** 09A (Platform Foundation) — requires shared components, design system, feature flags

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
| ReportsPage | Audit first | `src/routes/ReportsPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| MappingPage | Audit first | `src/routes/MappingPage.tsx` | ✅ | ✅ | ❌ | ❌ |
| FeatureFlagService | Audit first | `src/config/featureFlags.ts` or similar | ✅ | ✅ | ❌ | ❌ |

---

## Dependency Order

```
Shared Components (from 09A)
    ↓
Feature Flag Framework (inspect → refactor existing or create)
    ↓
ReportsPage (stub behind feature flag)
    ↓
MappingPage (stub behind feature flag)
    ↓
AIPage (future, not implemented)
    ↓
SecurityPage (future, not implemented)
```

---

## Objective

Create stub implementations for future modules, hidden behind feature flags.

---

## Scope

### Screens

| Screen | Feature Flag | Status | Priority |
|--------|-------------|--------|----------|
| ReportsPage | `reports_enabled` | Stub | P2 |
| MappingPage | `mapping_enabled` | Stub | P2 |
| AIPage | `ai_enabled` | Not implemented | Future |
| SecurityPage | Not implemented | Not implemented | Future |

**Source:** Master Spec Step 17 (Feature Flags) + Appendix C (Phase 09 NOT in Scope)

---

### Feature Flags (Step 17)

#### Flag Source Priority

> **Resolution order when multiple sources define the same flag.**

```
1. Environment variable (highest priority) — VITE_FLAG_* 
2. Database (via API) — runtime override
3. Default value in code (lowest priority)
```

- Environment overrides database
- Database overrides default
- This allows hot-fixes without redeploy

#### Feature Flag Table

| Screen | Feature Flag | Default | Behaviour When Disabled |
|--------|-------------|---------|------------------------|
| Reports | `reports_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| Mapping | `mapping_enabled` | `false` | Hide from nav; show "Coming Soon" if accessed directly |
| AI Features | `ai_enabled` | `false` | Hide AI components; no AI endpoints called |

#### Implementation

- Feature flags stored in `platform.feature_flags` table
- Fetched at app initialization via `GET /api/v1/feature-flags`
- Stored in React context: `FeatureFlagContext`
- Hook: `useFeatureFlag(flagName)` returns boolean
- Navigation filtering: hide flagged items from sidebar when disabled
- Route guarding: redirect to `/` or show "Coming Soon" when accessed directly

---

### ReportsPage

#### Stub Implementation

```
ReportsPage
   ├── Header
   │   └── Title ("Reports")
   ├── ReportTypeList
   │   ├── ReportTypeItem ("Migration Summary")
   │   │   └── Button ("Coming Soon") [disabled]
   │   ├── ReportTypeItem ("Compliance Report")
   │   │   └── Button ("Coming Soon") [disabled]
   │   ├── ReportTypeItem ("Audit Log Export")
   │   │   └── Button ("Coming Soon") [disabled]
   │   └── ReportTypeItem ("Exception Summary")
   │       └── Button ("Coming Soon") [disabled]
   └── EmptyState ("Reports require Phase 07.6.1 implementation")
```

#### Notes

- All report buttons disabled with "Coming Soon" text
- Page hidden from navigation when `reports_enabled = false`
- If accessed directly via URL, show "Coming Soon" message
- Backend APIs not implemented (Phase 07.6.1)

---

### MappingPage

#### Stub Implementation

```
MappingPage
   ├── Header
   │   └── Title ("Data Mapping")
   ├── MappingInfo
   │   └── Description ("Map CLI table mappings to frontend entities")
   └── EmptyState ("Mapping module not yet implemented")
```

#### Notes

- Page hidden from navigation when `mapping_enabled = false`
- If accessed directly via URL, show "Coming Soon" message
- Backend APIs not implemented

---

### AIPage

#### Not Implemented

- No stub needed
- Feature flag `ai_enabled` defaults to `false`
- Navigation item hidden
- Route not registered

---

### SecurityPage

#### Not Implemented

- No stub needed
- No feature flag defined
- Navigation item not present
- Route not registered

---

## Required Shared Components (from 09A)

- EmptyState (for stub messages)
- LoadingSkeleton (if data fetching is added later)

---

## Acceptance Criteria

- [ ] ReportsPage renders stub with "Coming Soon" buttons
- [ ] ReportsPage hidden from nav when `reports_enabled = false`
- [ ] ReportsPage shows "Coming Soon" when accessed directly
- [ ] MappingPage renders stub with description
- [ ] MappingPage hidden from nav when `mapping_enabled = false`
- [ ] MappingPage shows "Coming Soon" when accessed directly
- [ ] AIPage not registered (no route)
- [ ] SecurityPage not registered (no route)
- [ ] Feature flags fetched from API
- [ ] Feature flag context available app-wide

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| Feature flags | Step 17 |
| ReportsPage | Appendix C |
| MappingPage | Appendix C |
