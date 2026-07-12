# Prompt 007 Analysis: Create Widget Framework

**Analysis Date:** 2026-07-08  
**Status:** Ready for Implementation  
**Location:** `MAP_V2/02_Output/007_Create_Widget_Framework_Analysis.md`

---

## 1. Executive Summary

Prompt 007 creates a **metadata-driven Widget Framework** with a Registry, Factory, and Renderer pattern. Unlike Prompt 006 (standalone widgets), this framework enables dynamic widget instantiation via configuration — no hardcoded widget code in dashboard pages.

---

## 2. Current State vs Required State

### What Exists (Prompt 006)

| Component | Location | Count |
|-----------|----------|-------|
| Dashboard framework | `dashboard/framework/` | 12 files |
| Standalone widgets | `dashboard/widgets/` | 14 files |
| Chart placeholders | `dashboard/charts/` | 8 files |
| Table container | `dashboard/tables/` | 1 file |

### What Prompt 007 Requires

| Category | Files | Location |
|----------|-------|----------|
| Types | WidgetTypes, WidgetProps | `components/widgets/types/` |
| Base | Widget, WidgetHeader, WidgetBody, WidgetFooter, WidgetLoader, WidgetError | `components/widgets/base/` |
| Registry | WidgetRegistry | `components/widgets/registry/` |
| Engine | WidgetFactory, WidgetRenderer | `components/widgets/engine/` |
| Hooks | useWidget | `components/widgets/hooks/` |
| Cards | KPI, Status, Metric | `components/widgets/cards/` |
| Charts | Bar, Line, Pie, Area, Gauge | `components/widgets/charts/` |
| Tables | Grid, SummaryTable | `components/widgets/tables/` |
| Reports | HtmlReport, AuditReport | `components/widgets/reports/` |
| AI | Summary, Insight, Recommendation | `components/widgets/ai/` |
| System | Notification, Task, Timeline | `components/widgets/system/` |

---

## 3. Key Differences: Prompt 006 vs 007

| Aspect | Prompt 006 | Prompt 007 |
|--------|------------|------------|
| Pattern | Standalone components | Metadata-driven framework |
| Usage | `<KPICard title="..." value="..." />` | `<WidgetRenderer config={widgetConfig} />` |
| Registration | Manual imports | Auto-registry |
| Instantiation | Direct component use | Factory pattern |
| Configuration | Props per widget | Centralized metadata |
| Extensibility | Add new component | Register new widget type |

---

## 4. Implementation Plan

### Phase 1: Create `src/components/widgets/` directory structure

### Phase 2: Create Types (2 files)
- `WidgetTypes.ts` — WidgetDefinition, WidgetConfig, WidgetCategory enums
- `WidgetProps.ts` — Base props interfaces

### Phase 3: Create Base Components (6 files)
- `Widget.tsx` — Base wrapper with loading/error/empty states
- `WidgetHeader.tsx` — Title, icon, actions
- `WidgetBody.tsx` — Content container
- `WidgetFooter.tsx` — Footer actions
- `WidgetLoader.tsx` — Loading spinner
- `WidgetError.tsx` — Error display with retry

### Phase 4: Create Widget Registry
- `WidgetRegistry.ts` — Auto-registration map

### Phase 5: Create Widget Engine (2 files)
- `WidgetFactory.ts` — Dynamic instantiation from config
- `WidgetRenderer.tsx` — Generic renderer

### Phase 6: Create Hooks
- `useWidget.ts` — Widget state management

### Phase 7: Create Widget Implementations (18 files)
- Cards (3): KPI, Status, Metric
- Charts (5): Bar, Line, Pie, Area, Gauge
- Tables (2): Grid, SummaryTable
- Reports (2): HtmlReport, AuditReport
- AI (3): Summary, Insight, Recommendation
- System (3): Notification, Task, Timeline

### Phase 8: Verify & Report

---

## 5. Widget Registry Structure

```typescript
const widgetRegistry: Map<string, WidgetDefinition> = new Map([
  ['kpi', { component: KPIWidget, category: 'cards', ... }],
  ['status', { component: StatusWidget, category: 'cards', ... }],
  ['bar-chart', { component: BarChartWidget, category: 'charts', ... }],
  // ... etc
]);
```

---

## 6. Widget Factory Flow

```
WidgetConfig (metadata)
    ↓
WidgetFactory.create(config)
    ↓
WidgetRegistry.get(config.type)
    ↓
React Component
    ↓
WidgetRenderer (loading/error/states)
    ↓
Rendered Widget
```

---

## 7. Files Summary

| Category | Count | Files |
|----------|-------|-------|
| Types | 2 | WidgetTypes, WidgetProps |
| Base | 6 | Widget, WidgetHeader, WidgetBody, WidgetFooter, WidgetLoader, WidgetError |
| Registry | 1 | WidgetRegistry |
| Engine | 2 | WidgetFactory, WidgetRenderer |
| Hooks | 1 | useWidget |
| Cards | 3 | KPI, Status, Metric |
| Charts | 5 | Bar, Line, Pie, Area, Gauge |
| Tables | 2 | Grid, SummaryTable |
| Reports | 2 | HtmlReport, AuditReport |
| AI | 3 | Summary, Insight, Recommendation |
| System | 3 | Notification, Task, Timeline |
| **Total** | **30** | |

---

## 8. Testing Instructions

| Test | Command/Action | Expected Result |
|------|----------------|-----------------|
| Build | `npm run build` | No errors |
| Type check | `npx tsc --noEmit` | No TypeScript errors |
| Registry | Import WidgetRegistry | All widgets registered |
| Factory | Call WidgetFactory.create('kpi') | Returns KPIWidget |
| Renderer | Render WidgetRenderer with config | Widget displays |
| Loading | Set widget loading state | Spinner shows |
| Error | Set widget error state | Error with retry |
| Empty | Set widget empty state | "No data" message |
| Theme | Toggle dark mode | Widgets inherit colors |
| Responsive | Resize browser | Widgets reflow |

---

## 9. Acceptance Criteria

| Criteria | Status |
|----------|--------|
| ✓ Widgets render dynamically | Pending |
| ✓ Widget Registry operational | Pending |
| ✓ Widget Renderer operational | Pending |
| ✓ Widget Factory operational | Pending |
| ✓ Theme integration complete | Pending |
| ✓ Responsive layout complete | Pending |
| ✓ Loading states implemented | Pending |
| ✓ Ready for Portal Development | Pending |

---

## 10. Estimated Effort

| Phase | Time |
|-------|------|
| Directory & Types | 15 min |
| Base Components | 20 min |
| Registry & Engine | 25 min |
| Hooks | 10 min |
| Card Widgets | 20 min |
| Chart Widgets | 25 min |
| Table Widgets | 15 min |
| Report Widgets | 15 min |
| AI Widgets | 15 min |
| System Widgets | 15 min |
| Testing & Fixes | 20 min |
| Report Generation | 10 min |
| **Total** | **~3 hours** |

---

*Analysis saved to: `MAP_V2/02_Output/007_Create_Widget_Framework_Analysis.md`*
