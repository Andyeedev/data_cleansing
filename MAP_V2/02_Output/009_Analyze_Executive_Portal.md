# Prompt 009 — Executive Portal — Analysis Report

**Date:** 2026-07-08  
**Status:** 📋 ANALYSIS COMPLETE — AWAITING GO-AHEAD  
**Prompt:** `engineering\MAP_V2\01_Prompts\Workstream_02_Portal_Framework\009_Create_Executive_Portal.md`

---

## 1. What Prompt 009 Asks For

The Executive Portal is the **first production portal** built using:
- **Portal Framework** (Prompt 008) — metadata-driven portal architecture
- **Widget Framework** (Prompt 007) — registry/factory/renderer widget system

It's the landing experience for senior stakeholders (CEO, CIO, CTO, Programme Director, Executive Sponsor, Steering Committee). Must be clean, modern, executive-focused with **no operational complexity exposed**.

---

## 2. Current State Analysis

| What Exists | Location | How It Works |
|-------------|----------|--------------|
| `ExecutiveDashboardPage.tsx` | `src/pages/dashboard/` | Uses Dashboard Framework directly (DashboardLayout, DashboardPage, DashboardGrid, DashboardSection, WidgetContainer) with direct widget imports (KPICard, StatusCard, etc.) |
| Executive Portal metadata | `src/portal/metadata/PortalMetadata.ts` | Already registered with id `executive`, route `/dashboard/executive`, 10 widgets defined |
| Portal Framework | `src/portal/framework/` | PortalShell, PortalRenderer, PortalProvider, PortalLayout, etc. all operational |
| Widget Framework | `src/components/widgets/` | WidgetRegistry (18 widgets), WidgetFactory, WidgetRenderer all operational |
| Dashboard Framework | `src/dashboard/framework/` | DashboardLayout, DashboardPage, DashboardGrid, DashboardSection, WidgetContainer |

### The Gap

The current `ExecutiveDashboardPage.tsx` uses the **Dashboard Framework** with **direct widget imports**:
```tsx
// CURRENT — direct instantiation (violates Prompt 009 requirement)
import { KPICard } from '../../dashboard/widgets/KPICard';
<KPICard title="Total Migrations" value="1,247" ... />
```

Prompt 009 requires **Widget Framework** usage:
```tsx
// REQUIRED — via Widget Renderer (metadata-driven)
<WidgetRenderer config={widgetConfig} data={widgetData} />
```

---

## 3. What Needs To Be Created

### New Files (16 files in `src/portal/executive/`)

| File | Purpose |
|------|---------|
| `ExecutivePortal.tsx` | Main portal component using PortalRenderer with executive portal ID |
| `ExecutiveHome.tsx` | Landing page composing all executive dashboard sections |
| `ExecutiveHeader.tsx` | Executive-specific header (portal name, quick stats, actions) |
| `ExecutiveSummary.tsx` | Programme overview: Migration Programme, Phase, Status, Completion %, Confidence Score |
| `ExecutiveWidgets.tsx` | Widget configuration factory — builds WidgetConfig array from executive portal metadata |
| `ExecutiveNavigation.tsx` | Executive sidebar navigation items |
| `ExecutiveActions.tsx` | Quick action cards: View Reports, Run Validation, AI Assistant, Review Risks, etc. |
| `ExecutiveReports.tsx` | Report centre: Executive Dashboard, Operational Dashboard, Audit Pack, etc. |
| `ExecutiveInsights.tsx` | AI Executive Summary narrative panel |
| `ExecutiveHealth.tsx` | Migration Health Score widget section |
| `ExecutiveRisk.tsx` | Risk Overview: Overall Risk, Critical/High/Medium/Low counts, Trend, Heat Map |
| `ExecutiveKPI.tsx` | KPI cards section: Migration Health, Control Success, Projects, Datasets, Rules, etc. |
| `ExecutiveNotifications.tsx` | Notifications: Critical Alerts, System Messages, Approvals, Escalations |

### New Files (3 files in `src/portal/hooks/` and `src/portal/types/`)

| File | Purpose |
|------|---------|
| `hooks/useExecutiveDashboard.ts` | Custom hook for executive dashboard data, refresh, and state |
| `types/ExecutiveDashboard.ts` | Executive dashboard type definitions |
| `types/ExecutiveMetrics.ts` | Executive metric data types (KPIs, health scores, risk levels) |

### Modified Files

| File | Change |
|------|--------|
| `src/pages/dashboard/ExecutiveDashboardPage.tsx` | Refactor to use ExecutivePortal component |
| `src/portal/metadata/PortalMetadata.ts` | Update executive portal widgets list (add new widget IDs for programme status, risk overview, reports, notifications, quick actions) |
| `src/portal/routing/PortalRoutes.tsx` | Update executive route to use new ExecutivePortal component |

---

## 4. Implementation Approach

### Step 1: Create Types (`src/portal/types/`)
Define `ExecutiveDashboard.ts` and `ExecutiveMetrics.ts` with:
- `ExecutiveDashboardData` — all dashboard data in one type
- `ExecutiveKPIData` — KPI metrics (Migration Health 96%, Programme Status, etc.)
- `ExecutiveRiskData` — risk overview data
- `ExecutiveNotificationData` — notification data
- `ExecutiveReportData` — report definitions

### Step 2: Create Hook (`src/portal/hooks/useExecutiveDashboard.ts`)
- Returns mock data matching Prompt 009 sample data
- Provides refresh function
- Manages loading/error states
- Ready for backend integration

### Step 3: Create Executive Components (`src/portal/executive/`)
Build each component using **Widget Framework**:

```tsx
// Pattern for all sections:
import { WidgetRenderer } from '../../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../../components/widgets/types/WidgetTypes';

// Widget configs built from portal metadata + section data
const widgetConfig: WidgetConfig = {
  id: 'kpi-health',
  type: 'kpi',
  title: 'Migration Health',
  size: 'md',
};

<WidgetRenderer config={widgetConfig} data={healthData} />
```

### Step 4: Create ExecutiveHome.tsx
Compose all sections in a responsive grid:
```
┌─────────────────────────────────────────────┐
│           Executive Summary Bar              │
├──────────┬──────────┬──────────┬────────────┤
│ KPI 1    │ KPI 2    │ KPI 3    │ KPI 4      │
├──────────┴──────────┴──────────┴────────────┤
│           Programme Status                   │
├─────────────────────┬───────────────────────┤
│   Risk Overview     │   AI Executive Summary │
├─────────────────────┼───────────────────────┤
│   Recent Activity   │   Executive Reports    │
├─────────────────────┴───────────────────────┤
│         Quick Actions  |  Notifications      │
└─────────────────────────────────────────────┘
```

### Step 5: Update ExecutiveDashboardPage.tsx
Replace direct widget imports with ExecutivePortal:
```tsx
import { ExecutivePortal } from '../../portal/executive/ExecutivePortal';

export const ExecutiveDashboardPage = () => {
  return <ExecutivePortal />;
};
```

### Step 6: Update Portal Metadata
Add new widget IDs to executive portal definition for all 9 dashboard sections.

### Step 7: Update Routing
Ensure `/dashboard/executive` route uses the new component chain.

---

## 5. Widget Mapping (Prompt 009 Sections → Widget Framework)

| Section | Widget Type | Widget ID | Data Source |
|---------|-------------|-----------|-------------|
| Executive Summary | `metric` | `exec-summary` | Programme status, phase, completion % |
| KPI Cards (10) | `kpi` | `exec-kpi-*` | Migration Health 96%, Control Success 99.6%, etc. |
| Programme Status | `status` | `exec-programme-*` | Discovery, Mapping, Validation, Execution, etc. |
| Risk Overview | `metric` + `status` | `exec-risk-*` | Overall Risk, Critical/High/Medium/Low counts |
| AI Executive Summary | `ai-summary` | `exec-ai-summary` | AI narrative text |
| Recent Activity | `timeline` | `exec-activity` | Recent validations, reports, executions |
| Executive Reports | `html-report` | `exec-reports` | Report list with click-to-launch |
| Executive Notifications | `notification` | `exec-notifications` | Critical alerts, approvals, escalations |
| Quick Actions | `metric` | `exec-actions` | Action cards (View Reports, Run Validation, etc.) |

---

## 6. Sample Data (from Prompt 009)

```ts
const executiveMetrics = {
  migrationHealth: 96,
  programmeStatus: 'On Track',
  projects: 12,
  datasets: 847,
  rulesExecuted: 1842,
  controlsPassed: 99.6,
  criticalRisks: 1,
  highRisks: 3,
  mediumRisks: 8,
  lowRisks: 11,
  aiSummary: 'Migration progressing normally. Validation success is above target. No critical issues detected. One project requires attention due to increased warning volume.',
};
```

---

## 7. Integration Points

| System | Integration Method |
|--------|--------------------|
| **Portal Framework** | ExecutivePortal uses PortalRenderer with `portalId="executive"` |
| **Widget Framework** | All sections use WidgetRenderer with WidgetConfig from registry |
| **Portal Registry** | Executive portal already registered; update widget list |
| **Portal Routing** | Route `/dashboard/executive` updated to use ExecutivePortal |
| **Theme System** | Inherited from PortalShell; no hardcoded colours |
| **Navigation** | ExecutiveNavigation defines portal-specific sidebar items |
| **Layout** | PortalShell provides Header, Sidebar, Footer, Breadcrumb |

---

## 8. Files Summary

| Category | Count | Files |
|----------|-------|-------|
| **New: Portal Components** | 13 | ExecutivePortal, ExecutiveHome, ExecutiveHeader, ExecutiveSummary, ExecutiveWidgets, ExecutiveNavigation, ExecutiveActions, ExecutiveReports, ExecutiveInsights, ExecutiveHealth, ExecutiveRisk, ExecutiveKPI, ExecutiveNotifications |
| **New: Hook** | 1 | useExecutiveDashboard |
| **New: Types** | 2 | ExecutiveDashboard, ExecutiveMetrics |
| **Modified** | 3 | ExecutiveDashboardPage, PortalMetadata, PortalRoutes |
| **Total** | 19 | |

---

## 9. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Widget Framework widgets may not render correctly in portal context | Test each widget type individually via WidgetRenderer |
| Dashboard Framework vs Portal Framework conflict | ExecutiveDashboardPage becomes thin wrapper; all logic in portal/executive/ |
| Route conflicts with existing `/dashboard/executive` | PortalRoutes already handles this; just update component reference |
| Type conflicts between Dashboard types and Portal types | Use separate type files; no shared state |

---

## 10. Testing Strategy

### How to Test

```bash
cd MAP_V2\03_Source\frontend
npm run dev
```

Open `http://localhost:5173/dashboard/executive`

### What to Look For

| Element | Expected Result |
|---------|-----------------|
| **Page load** | Executive Portal renders with Portal Shell (Header, Sidebar, Footer) |
| **Executive Summary** | Shows: Migration Programme, Current Phase, Overall Status, Completion %, Confidence Score |
| **KPI Cards (10)** | Migration Health (96%), Control Success (99.6%), Projects (12), Datasets (847), Rules Executed (1,842), Controls Executed, Failures, Warnings, Exceptions, Audit Findings |
| **Programme Status** | Visual indicators for Discovery, Mapping, Validation, Execution, Reporting, Governance, Completed, Running, Pending, Blocked |
| **Risk Overview** | Overall Risk level, Critical (1), High (3), Medium (8), Low (11), Trend indicator |
| **AI Summary** | Narrative text: "Migration progressing normally..." |
| **Recent Activity** | Timeline with recent validations, reports, executions |
| **Executive Reports** | Report cards: Executive Dashboard, Operational Dashboard, Audit Pack, etc. |
| **Notifications** | Critical alerts, system messages, approvals |
| **Quick Actions** | Action cards: View Reports, Run Validation, AI Assistant, Review Risks |
| **Responsive** | Widgets rearrange on tablet/mobile |
| **Theme toggle** | Light/dark mode works |
| **Console** | No errors, no warnings |

### Build Verification

```bash
npm run build   # Must pass with zero errors
```

### Regression Check

| Page | Expected |
|------|----------|
| `/` | Home page still works |
| `/migration` | Migration page still works |
| `/validation` | Validation page still works |
| All other routes | Still work unchanged |

---

## 11. Success Criteria

- ✅ Executive Portal operational
- ✅ Uses Portal Framework (PortalRenderer → PortalShell)
- ✅ Uses Widget Framework (WidgetRenderer for all dashboard elements)
- ✅ Responsive (desktop, tablet, mobile)
- ✅ Theme integrated (light/dark)
- ✅ Metadata registered (portal + widgets in registry)
- ✅ Role-aware (Executive, Programme Director, CIO, CTO, Executive Sponsor)
- ✅ AI-ready (AI Summary section present)
- ✅ Ready for backend integration (mock data in hook)
- ✅ No direct widget instantiation (all via WidgetRenderer)

---

## 12. Implementation Order

1. Types (ExecutiveDashboard.ts, ExecutiveMetrics.ts)
2. Hook (useExecutiveDashboard.ts)
3. Executive Components (ExecutivePortal → ExecutiveHome → sections)
4. Update ExecutiveDashboardPage.tsx
5. Update PortalMetadata.ts (add widget IDs)
6. Update PortalRoutes.tsx (if needed)
7. Build verification
8. Save report

---

**Analysis saved to:** `MAP_V2/02_Output/009_Analyze_Executive_Portal.md`
