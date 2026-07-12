# Prompt 006 Analysis: Create Analytics & Dashboard Framework

**Analysis Date:** 2026-07-08  
**Status:** Ready for Implementation  
**Location:** `MAP_V2/02_Output/006_Create_Analytics_Framework_Analysis.md`

---

## 1. Executive Summary

Prompt 006 creates the **Analytics & Dashboard Framework** — the reusable foundation for all dashboards, KPIs, reporting, and analytics across MAP Nexus™. It establishes a new `src/dashboard/framework/` directory with 12 framework files, 14 widget components, 8 chart containers, and 1 table container. All placeholder data only — no business logic, APIs, or data integration.

---

## 2. Current State vs Required State

### What Exists (Prompts 001-005)

| Component | Location | Status |
|-----------|----------|--------|
| ExecutiveDashboardPage | `pages/dashboard/ExecutiveDashboardPage.tsx` | Basic placeholder with ComingSoon |
| Theme files | `theme/dashboard/` | kpi, risk, trend, score, progress, validation styles |

### What Prompt 006 Requires

| Component | Location | Status |
|-----------|----------|--------|
| `dashboard/framework/` | `src/dashboard/framework/` | **New** |
| DashboardLayout.tsx | `dashboard/framework/` | **New** |
| DashboardPage.tsx | `dashboard/framework/` | **New** |
| DashboardGrid.tsx | `dashboard/framework/` | **New** |
| DashboardSection.tsx | `dashboard/framework/` | **New** |
| WidgetContainer.tsx | `dashboard/framework/` | **New** |
| WidgetHeader.tsx | `dashboard/framework/` | **New** |
| WidgetFooter.tsx | `dashboard/framework/` | **New** |
| DashboardToolbar.tsx | `dashboard/framework/` | **New** |
| DashboardFilters.tsx | `dashboard/framework/` | **New** |
| DashboardActions.tsx | `dashboard/framework/` | **New** |
| DashboardContext.tsx | `dashboard/framework/` | **New** |
| dashboard.types.ts | `dashboard/framework/` | **New** |
| Widget Library (14) | `dashboard/widgets/` | **New** |
| Chart Containers (8) | `dashboard/charts/` | **New** |
| Table Container | `dashboard/tables/` | **New** |

---

## 3. Key Observations

**Theme Already Exists:** `theme/dashboard/` has styles for KPI, risk, trend, score, progress, validation — these can be leveraged by the new widgets.

**No Existing Dashboard Components:** The current ExecutiveDashboardPage is just a ComingSoon placeholder. No grid system, widgets, or chart containers exist.

**Large Scope:** ~35+ new files across 3 directories (framework, widgets, charts, tables).

---

## 4. Implementation Plan

### Phase 1: Create `src/dashboard/` directory structure

### Phase 2: Create Framework (12 files)
- `dashboard.types.ts` — All TypeScript interfaces
- `DashboardContext.tsx` — React context for dashboard state
- `DashboardLayout.tsx` — Main layout wrapper
- `DashboardPage.tsx` — Page-level wrapper
- `DashboardGrid.tsx` — 12-column responsive grid
- `DashboardSection.tsx` — Section grouping
- `WidgetContainer.tsx` — Widget wrapper (header/body/footer/loading/empty/error)
- `WidgetHeader.tsx` — Widget header with title/actions
- `WidgetFooter.tsx` — Widget footer
- `DashboardToolbar.tsx` — Refresh/Export/Print/Filter/Date/Search/AI/Help
- `DashboardFilters.tsx` — Dropdown/Search/Checkbox/Toggle/Date/Multi-select
- `DashboardActions.tsx` — Action buttons

### Phase 3: Create Widget Library (14 widgets)
- KPI Card, Summary Card, Status Card, Trend Card
- Risk Card, Validation Card, Migration Card, Information Card
- Chart Panel, Table Panel, Report Panel, Activity Panel
- AI Insight Panel, Progress Panel

### Phase 4: Create Chart Containers (8 charts)
- Bar, Line, Area, Pie, Donut, Heat Map, Gauge, Timeline

### Phase 5: Create Table Container
- Sorting/Filtering/Pagination/Export placeholders

### Phase 6: Verify & Report
- Run build verification
- Generate completion report

---

## 5. Widget Library Details

### KPI Components
| Widget | Purpose | Fields |
|--------|---------|--------|
| KPI Card | Key performance indicator | Title, Value, Delta, Trend, Status, Icon, Footer |
| Summary Card | Summary metric | Title, Value, Subtitle, Icon |
| Status Card | Status indicator | Title, Status, Description, Icon |
| Trend Card | Trend indicator | Title, Value, Trend, Period |
| Risk Card | Risk metric | Title, Level, Score, Icon |
| Validation Card | Validation metric | Title, Count, Pass/Fail, Icon |
| Migration Card | Migration metric | Title, Count, Progress, Icon |
| Information Card | Info display | Title, Value, Description, Icon |

### Panel Components
| Panel | Purpose |
|-------|---------|
| Chart Panel | Chart container with header |
| Table Panel | Table container with header |
| Report Panel | Report container |
| Activity Panel | Activity feed |
| AI Insight Panel | AI recommendations/warnings |
| Progress Panel | Progress indicator |

---

## 6. Dashboard Grid Structure

```
+---+---+---+---+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |
+---+---+---+---+---+---+---+---+---+---+---+---+
|       KPI Card       |       KPI Card       |
+---+---+---+---+---+---+---+---+---+---+---+---+
|               Chart Panel                |
+---+---+---+---+---+---+---+---+---+---+---+---+
|     Table Panel     |   Activity Panel    |
+---+---+---+---+---+---+---+---+---+---+---+---+
```

---

## 7. Files Summary

| Category | Count | Files |
|----------|-------|-------|
| Framework | 12 | Types, Context, Layout, Page, Grid, Section, WidgetContainer/Header/Footer, Toolbar, Filters, Actions |
| Widgets | 14 | KPI, Summary, Status, Trend, Risk, Validation, Migration, Information, Chart, Table, Report, Activity, AI Insight, Progress |
| Charts | 8 | Bar, Line, Area, Pie, Donut, Heat Map, Gauge, Timeline |
| Tables | 1 | TableContainer |
| **Total** | **35** | |

---

## 8. Testing Instructions

| Test | Command/Action | Expected Result |
|------|----------------|-----------------|
| Build | `npm run build` | No errors |
| Type check | `npx tsc --noEmit` | No TypeScript errors |
| Dev server | `npm run dev` | Starts on `:5173` |
| Dashboard grid | View any dashboard | 12-column grid visible |
| Widget container | View any widget | Header/Body/Footer structure |
| KPI card | View KPI widget | Title, value, delta, trend, icon |
| Toolbar | View dashboard toolbar | Refresh/Export/Print/Filter buttons |
| Filters | Click filter dropdown | Dropdown/search/toggle options |
| Responsive | Resize browser | Widgets reflow to single column |
| Empty state | View empty dashboard | "No data available" message |
| Loading state | Trigger loading | Spinner overlay visible |
| Error state | Trigger error | Error message with retry |

---

## 9. Acceptance Criteria

| Criteria | Status |
|----------|--------|
| ✓ Dashboard framework operational | Pending |
| ✓ Widget library created | Pending |
| ✓ KPI cards reusable | Pending |
| ✓ Dashboard layouts reusable | Pending |
| ✓ Toolbar created | Pending |
| ✓ Filter framework created | Pending |
| ✓ Chart placeholders created | Pending |
| ✓ Table placeholders created | Pending |
| ✓ Responsive behaviour implemented | Pending |
| ✓ Ready for Prompt 007 | Pending |

---

## 10. Estimated Effort

| Phase | Time |
|-------|------|
| Directory & Types | 15 min |
| Framework (12 files) | 45 min |
| Widget Library (14 widgets) | 60 min |
| Chart Containers (8 charts) | 30 min |
| Table Container | 10 min |
| Testing & Fixes | 20 min |
| Report Generation | 10 min |
| **Total** | **~3 hours** |

---

*Analysis saved to: `MAP_V2/02_Output/006_Create_Analytics_Framework_Analysis.md`*
