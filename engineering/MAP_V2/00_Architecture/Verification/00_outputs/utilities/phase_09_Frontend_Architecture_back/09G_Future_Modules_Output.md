# 09G — Future Modules — Architecture Output

> **Generated from:** `09G_Future_Modules.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09G — Future Modules, stub implementations behind feature flags.

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
Feature Flag Framework (inspect → refactor existing or create)
    ↓
ReportsPage (now functional — calls backend APIs for validation report, governance decision, risk score, compliance)
    ↓
MappingPage (stub behind feature flag)
    ↓
AIPage (future, not implemented)
    ↓
SecurityPage (future, not implemented)
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

## 1. Feature Flag Architecture

### 1.1 Feature Flag Service

```typescript
// src/services/featureFlags.ts

interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
}

class FeatureFlagService {
  private flags: Map<string, boolean> = new Map();

  async load(): Promise<void> {
    const response = await apiGet('/api/v1/feature-flags');
    response.forEach(flag => this.flags.set(flag.name, flag.enabled));
  }

  isEnabled(flagName: string): boolean {
    return this.flags.get(flagName) ?? false;
  }
}

// React Context
const FeatureFlagContext = React.createContext<FeatureFlagService>(null!);

export function useFeatureFlag(flagName: string): boolean {
  const service = useContext(PlatformConfigContext);
  return service.getFeatureFlag(flagName);
}

export function useTenantSetting(key: string): any {
  const service = useContext(PlatformConfigContext);
  return service.getTenantSetting(key);
}
```

export function useFeatureFlag(flagName: string): boolean {
  const service = useContext(FeatureFlagContext);
  return service.isEnabled(flagName);
}
```

### 1.2 Feature Flag Configuration

| Flag | Default | Source |
|------|---------|--------|
| `reports_enabled` | `false` | `platform.feature_flags` |
| `mapping_enabled` | `false` | `platform.feature_flags` |
| `ai_enabled` | `false` | `platform.feature_flags` |
| `workflow_advanced` | `false` | `platform.feature_flags` |
| `calendar_enabled` | `true` | `platform.feature_flags` |
| `notifications_enabled` | `true` | `platform.feature_flags` |

---

## 2. Screen Architecture

### 2.1 ReportsPage

| Property | Value |
|----------|-------|
| Route | `/reports` |
| Component | `ReportsPage.tsx` |
| Feature Flag | `reports_enabled` |
| Status | Stub |

#### Component Tree

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

#### behaviour

- Hidden from navigation when `reports_enabled = false`
- If accessed directly via URL, show "Coming Soon" message
- All buttons disabled with "Coming Soon" text
- Backend APIs not implemented (Phase 07.6.1)

---

### 2.2 MappingPage

| Property | Value |
|----------|-------|
| Route | `/mapping` |
| Component | `MappingPage.tsx` |
| Feature Flag | `mapping_enabled` |
| Status | Stub |

#### Component Tree

```
MappingPage
├── Header
│   └── Title ("Data Mapping")
├── MappingInfo
│   └── Description ("Map CLI table mappings to frontend entities")
└── EmptyState ("Mapping module not yet implemented")
```

#### behaviour

- Hidden from navigation when `mapping_enabled = false`
- If accessed directly via URL, show "Coming Soon" message
- Backend APIs not implemented

---

### 2.3 AIPage

| Property | Value |
|----------|-------|
| Route | Not registered |
| Component | Not implemented |
| Feature Flag | `ai_enabled` |
| Status | Not implemented |

#### behaviour

- No stub needed
- Feature flag `ai_enabled` defaults to `false`
- Navigation item hidden
- Route not registered

---

### 2.4 SecurityPage

| Property | Value |
|----------|-------|
| Route | Not registered |
| Component | Not implemented |
| Feature Flag | None |
| Status | Not implemented |

#### behaviour

- No stub needed
- No feature flag defined
- Navigation item not present
- Route not registered

---

## 3. Navigation Integration

### 3.1 Dynamic Navigation Filtering

```typescript
// src/components/Navigation/DynamicNavigation.tsx

function filterByFeatureFlags(navItems: NavItem[], flags: FeatureFlag[]): NavItem[] {
  return navItems.filter(item => {
    if (item.featureFlag) {
      return flags.find(f => f.name === item.featureFlag)?.enabled ?? false;
    }
    return true;
  });
}
```

### 3.2 Navigation Items with Feature Flags

| Item | Route | Feature Flag |
|------|-------|--------------|
| Reports | `/reports` | `reports_enabled` |
| Mapping | `/mapping` | `mapping_enabled` |
| Calendar | `/calendar` | `calendar_enabled` |
| Notifications | `/notifications` | `notifications_enabled` |

---

## 4. Route Guard

```typescript
// src/components/FeatureFlagGuard.tsx

function FeatureFlagGuard({ flag, children }: { flag: string; children: React.ReactNode }) {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Coming Soon</h2>
        <p>This feature is not yet available.</p>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage in AppRoutes.tsx
<Route path="/reports" element={
  <FeatureFlagGuard flag="reports_enabled">
    <ReportsPage />
  </FeatureFlagGuard>
} />
```

---

## 5. Files to Implement

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/services/featureFlags.ts` | Inspect existing feature flag patterns first; create if none exist |
| `src/context/FeatureFlagContext.tsx` | Inspect existing context patterns first; create if no suitable flag context exists |
| `src/hooks/useFeatureFlag.ts` | Inspect existing hooks first; create if no suitable flag hook exists |
| `src/components/FeatureFlagGuard.tsx` | Inspect existing guard patterns first; create if none exist |
| `src/routes/ReportsPage.tsx` | Now functional — calls /execution/{batch_id}/report, /governance, /risk-score, /compliance APIs |
| `src/routes/MappingPage.tsx` | Create stub (new module, no existing implementation) |
| `src/components/Navigation/DynamicNavigation.tsx` | Extend existing navigation with feature flag filtering |
| `src/AppRoutes.tsx` | Extend existing routes with feature flag guards |

---

## 6. Acceptance Criteria

- [ ] Feature flags fetched from API
- [ ] Feature flag context available app-wide
- [x] ReportsPage calls backend APIs and displays data
- [ ] ReportsPage hidden from nav when disabled
- [ ] MappingPage renders stub with description
- [ ] MappingPage hidden from nav when disabled
- [ ] AIPage not registered (no route)
- [ ] SecurityPage not registered (no route)
- [ ] Feature flag guards functional
- [ ] Navigation filtering works

---

## 7. Approval Required

- [ ] Feature flag architecture approved
- [ ] Stub implementations approved
- [ ] Navigation integration approved
- [ ] Route guard approach approved

**Awaiting your approval before implementation.**
