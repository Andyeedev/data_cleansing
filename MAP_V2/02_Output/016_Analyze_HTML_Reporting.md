# Prompt 016: Create HTML Reporting Framework — Analysis

**Date:** 2026-07-09  
**Status:** Analysis Complete — Awaiting Go-Ahead  
**Prompt:** `engineering\MAP_V2\01_Prompts\Workstream_03_Presentation_Engine\016_Integrate_HTML_Reporting.md`

---

## 1. What the Prompt Asks For

Create a reusable HTML Reporting Framework that replaces individual report implementations with a shared architecture. The framework produces professional enterprise reports for every MAP module.

**Scope:**
- Presentation framework only
- No backend integration
- No database integration
- No report execution
- No business logic
- No export functionality (PDF/Excel come in Prompt 017/018)

**Architecture Flow:**
```
Report Definition → Template → Sections → Widgets → Renderer → HTML Output
```

Every report is metadata-driven and inherits the same layout, styling, and rendering engine.

---

## 2. What Already Exists

| Existing Component | Location | Relevance |
|-------------------|----------|-----------|
| HtmlReportWidget | `components/widgets/reports/HtmlReportWidget.tsx` | Renders HTML via `dangerouslySetInnerHTML` — can be used as foundation for report rendering |
| AuditReportWidget | `components/widgets/reports/AuditReportWidget.tsx` | Audit-specific report widget — can be extended or used as reference |
| ReportPanel | `dashboard/widgets/ReportPanel.tsx` | Report display panel — existing report display component |
| ReportingMetrics types | `portal/types/ReportingMetrics.ts` | Defines `ReportDefinition`, `ReportTemplate`, `ReportSchedule`, `ReportingMetrics` — existing type definitions |
| ReportingService | `services/ReportingService.ts` | Has `generateReport()` returning `Blob` — existing service interface |
| Widget Framework | `components/widgets/` | 18 registered widgets — fully reusable for report sections |
| Theme System | `theme/` | Complete design token system — fully reusable for report styling |
| Portal Framework | `portal/framework/` | Portal structure — reference for report layout patterns |

**Key Insight:** The Widget Framework already provides KPI, Status, Metric, Chart, Grid, Timeline, and AI Summary widgets. The HTML Reporting Framework should **compose** these widgets into report sections rather than duplicating them.

---

## 3. Files to Create

### 3.1 Framework (`src/reporting/html/framework/` — 11 files)

| File | Purpose | Dependencies |
|------|---------|-------------|
| `HtmlReport.tsx` | Top-level report component — wraps ReportLayout with ReportContext provider | ReportLayout, ReportContext |
| `ReportLayout.tsx` | Page layout with header, content area, footer — print-optimised CSS | ReportHeader, ReportFooter, ReportTheme |
| `ReportHeader.tsx` | Report header with logo, title, metadata, generation info | Theme icons |
| `ReportFooter.tsx` | Report footer with page numbers, confidential notice, timestamps | Theme tokens |
| `ReportSection.tsx` | Generic section wrapper — title, content, optional visibility | Theme tokens |
| `ReportNavigation.tsx` | In-report table of contents sidebar — click-to-scroll navigation | ReportContext |
| `ReportRenderer.tsx` | Assembles sections, applies theme, produces final HTML output | All sections, ReportContext |
| `ReportFactory.ts` | Creates report instances from metadata — avoids switch statements | ReportRegistry, template components |
| `ReportRegistry.ts` | Singleton Map registry for report templates | ReportTypes |
| `ReportContext.tsx` | React context for report state: current report, theme, navigation | React Context |

### 3.2 Components (`src/reporting/html/components/` — 11 files)

| File | Purpose | Widget Integration |
|------|---------|-------------------|
| `CoverPage.tsx` | Report cover: title, subtitle, author, date, version, classification | Theme tokens |
| `ExecutiveSummary.tsx` | Executive summary section with key findings | AISummaryWidget |
| `TableOfContents.tsx` | Auto-generated TOC from report sections | ReportNavigation |
| `KPISection.tsx` | KPI metrics display | KPIWidget |
| `ChartSection.tsx` | Charts and visualisations | BarChartWidget, LineChartWidget, PieChartWidget, AreaChartWidget |
| `TableSection.tsx` | Data tables | GridWidget, SummaryTableWidget |
| `RiskSection.tsx` | Risk analysis display | RiskCard, StatusWidget |
| `RecommendationSection.tsx` | Recommendations list | AIRecommendationWidget |
| `AppendixSection.tsx` | Appendix content | ReportSection |
| `AuditTrailSection.tsx` | Audit trail entries | TimelineWidget |
| `EvidenceSection.tsx` | Supporting evidence | ReportSection |

### 3.3 Templates (`src/reporting/html/templates/` — 7 files)

| File | Purpose | Sections Included |
|------|---------|-------------------|
| `ExecutiveTemplate.tsx` | Executive reports | Cover, Summary, KPIs, Charts, Recommendations |
| `MigrationTemplate.tsx` | Migration reports | Cover, Summary, KPIs, Tables, Timeline, Risks |
| `ValidationTemplate.tsx` | Validation reports | Cover, Summary, Tables, Risks, Evidence |
| `GovernanceTemplate.tsx` | Governance reports | Cover, Summary, Tables, Audit Trail, Appendix |
| `RiskTemplate.tsx` | Risk reports | Cover, Summary, KPIs, Charts, Risks, Recommendations |
| `SecurityTemplate.tsx` | Security reports | Cover, Summary, KPIs, Tables, Audit Trail |
| `AdministrationTemplate.tsx` | Admin reports | Cover, Summary, KPIs, Tables, Recommendations |

### 3.4 Shared (`src/reporting/html/shared/` — 3 files)

| File | Purpose |
|------|---------|
| `ReportTypes.ts` | Type definitions: ReportType, ReportSection, ReportConfig, ReportMetadata |
| `ReportModels.ts` | Data models: ReportDefinition, ReportSectionData, ReportOutput |
| `ReportTheme.ts` | Report-specific theme extensions (print styles, page breaks) |

### 3.5 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Architecture overview, usage guide, extension guide |

**Total files:** 32

---

## 4. Implementation Plan

### Phase 1: Foundation (Shared Types & Theme)
1. Create `ReportTypes.ts` — define all report type enums and interfaces
2. Create `ReportModels.ts` — define data models for report definitions and output
3. Create `ReportTheme.ts` — extend theme with print-specific styles, page break controls

### Phase 2: Framework Core
4. Create `ReportContext.tsx` — React context for report state management
5. Create `ReportRegistry.ts` — singleton registry for report templates
6. Create `ReportFactory.ts` — dynamic report creation from metadata (no switch statements)
7. Create `ReportLayout.tsx` — page layout with print-optimised CSS
8. Create `ReportHeader.tsx` — report header component
9. Create `ReportFooter.tsx` — report footer with page numbers
10. Create `ReportSection.tsx` — generic section wrapper
11. Create `ReportNavigation.tsx` — in-report TOC sidebar
12. Create `ReportRenderer.tsx` — assembles and renders final HTML
13. Create `HtmlReport.tsx` — top-level report component

### Phase 3: Components
14. Create `CoverPage.tsx`
15. Create `ExecutiveSummary.tsx`
16. Create `TableOfContents.tsx`
17. Create `KPISection.tsx` — wraps KPIWidget
18. Create `ChartSection.tsx` — wraps chart widgets
19. Create `TableSection.tsx` — wraps GridWidget
20. Create `RiskSection.tsx`
21. Create `RecommendationSection.tsx` — wraps AIRecommendationWidget
22. Create `AppendixSection.tsx`
23. Create `AuditTrailSection.tsx` — wraps TimelineWidget
24. Create `EvidenceSection.tsx`

### Phase 4: Templates
25. Create `ExecutiveTemplate.tsx`
26. Create `MigrationTemplate.tsx`
27. Create `ValidationTemplate.tsx`
28. Create `GovernanceTemplate.tsx`
29. Create `RiskTemplate.tsx`
30. Create `SecurityTemplate.tsx`
31. Create `AdministrationTemplate.tsx`

### Phase 5: Documentation
32. Create `README.md`

---

## 5. Widget Integration Strategy

The HTML Reporting Framework should **not** duplicate widget implementations. Instead, it should compose existing widgets:

| Report Section Component | Wraps Widget |
|------------------------|-------------|
| KPISection | KPIWidget (from `components/widgets/cards/KPIWidget.tsx`) |
| ChartSection | BarChartWidget, LineChartWidget, PieChartWidget, AreaChartWidget (from `components/widgets/charts/`) |
| TableSection | GridWidget, SummaryTableWidget (from `components/widgets/tables/`) |
| ExecutiveSummary | AISummaryWidget (from `components/widgets/ai/AISummaryWidget.tsx`) |
| RecommendationSection | AIRecommendationWidget (from `components/widgets/ai/AIRecommendationWidget.tsx`) |
| AuditTrailSection | TimelineWidget (from `components/widgets/system/TimelineWidget.tsx`) |

**Pattern:**
```tsx
// KPISection.tsx
import { KPIWidget } from '../../../components/widgets/cards/KPIWidget';

export const KPISection = ({ data }) => (
  <ReportSection title="Key Metrics">
    {data.kpis.map(kpi => (
      <KPIWidget key={kpi.id} config={kpi.config} state="success" data={kpi.data} />
    ))}
  </ReportSection>
);
```

---

## 6. Theme Integration Strategy

The framework reuses the existing Theme System (`src/theme/`):

**Tailwind Classes (JSX):**
- `bg-neutral-0`, `text-neutral-100`, `border-neutral-30` — standard colours
- `bg-primary-500`, `text-primary-600` — primary palette
- `font-heading`, `text-lg`, `font-semibold` — typography
- `rounded-lg`, `shadow-md` — radius and shadows
- `p-4`, `m-2`, `gap-4` — spacing

**TypeScript Imports (Programmatic):**
```typescript
import { colours } from '../../../theme/colours';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
```

**Print-Specific Styles (ReportTheme.ts):**
- `@media print` rules for page breaks
- `break-inside: avoid` for sections
- Print-optimised fonts and colours
- Page margin controls

---

## 7. Responsive Behaviour

| Breakpoint | Report Layout |
|-----------|--------------|
| Desktop (≥1024px) | Full layout: sidebar TOC + content area |
| Tablet (640-1023px) | Collapsed sidebar, full-width content |
| Mobile (<640px) | Optional — stacked layout, hidden TOC |

**Print:** Optimised for A4/Letter landscape/portrait with page break controls.

---

## 8. Accessibility

| Requirement | Implementation |
|------------|---------------|
| WCAG AA | Colour contrast ratios via theme tokens |
| Semantic HTML | `<article>`, `<section>`, `<header>`, `<footer>`, `<nav>` |
| Keyboard Navigation | TOC links, section focus management |
| Screen Readers | ARIA labels on sections, table headers, charts |
| High Contrast | Theme supports high contrast mode via Tailwind classes |

---

## 9. Testing Strategy

### 9.1 Unit Tests

| Test | What to Verify |
|------|---------------|
| `ReportRegistry.test.ts` | Register, unregister, get, getAll, getByType methods |
| `ReportFactory.test.ts` | Create report from metadata, handle unknown types |
| `ReportContext.test.ts` | Context provider renders, consumes correctly |

### 9.2 Component Tests

| Test | What to Verify |
|------|---------------|
| `ReportLayout.test.tsx` | Renders header, content, footer; applies print styles |
| `ReportSection.test.tsx` | Renders title, content; hides when `visible=false` |
| `CoverPage.test.tsx` | Renders title, subtitle, metadata |
| `KPISection.test.tsx` | Renders KPI widgets from data |
| `TableSection.test.tsx` | Renders grid from table data |

### 9.3 Integration Tests

| Test | What to Verify |
|------|---------------|
| `ExecutiveTemplate.test.tsx` | Template renders all sections in correct order |
| `ReportRenderer.test.tsx` | Renderer assembles template + data into complete HTML |
| `HtmlReport.test.tsx` | Full report renders without errors |

### 9.4 Visual Tests

| Test | What to Verify |
|------|---------------|
| Print layout | Page breaks, margins, fonts render correctly |
| Responsive | Layout adapts at tablet/desktop breakpoints |
| Theme | Colours, fonts, spacing match design tokens |

### 9.5 Test Commands

```bash
cd MAP_V2\03_Source\frontend
npm run test -- --coverage --watchAll=false
npm run lint
npm run typecheck
```

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Widget import paths may break | Use relative imports from `reporting/html/components/` back to `components/widgets/` |
| Print CSS conflicts | Use `@media print` with `!important` overrides, test in Chrome/Firefox print preview |
| Template duplication | Each template composes shared sections — no layout duplication |
| Type conflicts with existing ReportingMetrics | Prefix new types with `HtmlReport*` to avoid collisions |
| Large bundle size | Lazy-load templates, tree-shake unused sections |

---

## 11. Acceptance Criteria Checklist

| Criterion | Status |
|-----------|--------|
| HTML Reporting Framework operational | ⬜ Pending |
| Report Registry operational | ⬜ Pending |
| Report Factory operational | ⬜ Pending |
| Report Renderer created | ⬜ Pending |
| Report templates reusable | ⬜ Pending |
| Widget Framework integrated | ⬜ Pending |
| Theme System integrated | ⬜ Pending |
| Responsive layouts implemented | ⬜ Pending |
| Accessibility implemented | ⬜ Pending |
| Ready for Prompt 017 | ⬜ Pending |

---

## 12. Next Prompt

**Prompt 017 — Create PDF Reporting Framework**

Transforms the HTML reporting architecture into enterprise-quality PDF documents suitable for regulatory submissions, audit evidence, executive reporting and customer deliverables.

---

**Recommendation:** Proceed with implementation. All dependencies (Widget Framework, Theme System, Portal Framework) are in place. The framework follows established patterns (registry, factory, context) already used in the codebase.
