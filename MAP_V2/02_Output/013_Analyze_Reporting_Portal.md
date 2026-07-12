# Prompt 013: Create Reporting Portal — Analysis

**Prompt:** `engineering/MAP_V2/01_Prompts/Workstream_02_Portal_Framework/013_Create_Reporting_Portal.md`  
**Status:** Pending Approval  
**Date:** 2026-07-09

---

## 1. What the Prompt Asks For

Create a **Reporting Portal** — a single enterprise location for viewing, generating, scheduling, exporting and distributing all MAP reports.

**Scope:** Presentation framework only. No backend, APIs, or report generation logic.

### Pages Required (13)

| # | Page | Purpose |
|---|------|---------|
| 1 | ReportingOverview | Dashboard: Reports Generated, Scheduled, Failed, Pending, Usage, Export Activity, AI Summary |
| 2 | ExecutiveReports | Executive Dashboard Report, Migration Health, Portfolio Summary, KPI Report, Board Pack |
| 3 | OperationalReports | Daily Operations, Validation Status, Execution Summary, Exception Summary, Ops Dashboard |
| 4 | MigrationReports | Migration Progress, Dataset Status, Completion Report, Summary, Metrics |
| 5 | ValidationReports | Rule Execution, Validation Summary, Failed/Passed Controls, Trends |
| 6 | GovernanceReports | Compliance Report, Governance Summary, Policy Compliance, Control Effectiveness, KPI |
| 7 | AuditReports | Audit Pack, Evidence, Timeline, Findings, History |
| 8 | RegulatoryReports | Regulatory Submission, Compliance Filing, Data Governance, Risk Report, Dashboard |
| 9 | ScheduledReports | Scheduled Jobs, Upcoming, Completed, Failed, Calendar |
| 10 | ReportTemplates | Standard, Executive, Audit, Governance, Custom Templates |
| 11 | ReportDistribution | Email Distribution, Download Centre, Secure Sharing, History, Recipients |
| 12 | ReportingWorkspace | Report Explorer, Template Library, Recent Reports, Scheduled, AI Recommendations, Notifications |

### Navigation (12 items)
Reporting Overview, Executive Reports, Operational Reports, Migration Reports, Validation Reports, Governance Reports, Audit Reports, Regulatory Reports, Scheduled Reports, Templates, Distribution, Workspace

### Widgets to Use
KPI Widget, Report Widget, Grid Widget, Timeline Widget, Notification Widget, Status Widget, AI Summary Widget

### Additional Requirements
- AI placeholder widgets (5): AI Report Summary, Report Recommendations, Report Insights, Report Quality Analysis, Suggested Reports
- Export framework placeholders: PDF, HTML, Excel, CSV, JSON, PowerPoint, Word
- Responsive behaviour (Desktop, Tablet, Mobile)
- Accessibility (Keyboard, Screen Readers, WCAG AA, ARIA, High Contrast)

---

## 2. What Already Exists

| Item | Location | Status |
|------|----------|--------|
| `reportingPortal` definition | `src/portal/metadata/PortalMetadata.ts:191-217` | ⚠️ Minimal — 3 nav items, 3 widgets, `defaultRoute: '/reports/standard'` |
| `ReportsPage` | `src/pages/reports/ReportsPage.tsx` | ⚠️ Placeholder — used by current `/reports` route |
| Existing route | `PortalRoutes.tsx:122` | `<Route path="reports" element={<ReportsPage />} />` |
| Widget Framework | `src/components/widgets/` | ✅ Complete — all widget types available |
| Dashboard Framework | `src/dashboard/framework/` | ✅ Complete |
| Portal Framework | `src/portal/framework/` | ✅ Complete — PortalShell, PortalRenderer, PortalRegistry |

---

## 3. Implementation Plan

### 3.1 Create Files (17 new files)

```
src/portal/types/ReportingMetrics.ts          — Types
src/portal/hooks/useReportingDashboard.ts     — Hook
src/portal/reporting/ReportingPortal.tsx      — Portal with route-based rendering
src/portal/reporting/ReportingOverview.tsx    — 7 KPI widgets
src/portal/reporting/ExecutiveReports.tsx     — 5 report widgets
src/portal/reporting/OperationalReports.tsx   — 5 report widgets
src/portal/reporting/MigrationReports.tsx     — 5 report widgets
src/portal/reporting/ValidationReports.tsx    — 5 report widgets
src/portal/reporting/GovernanceReports.tsx    — 5 report widgets
src/portal/reporting/AuditReports.tsx         — 5 report widgets
src/portal/reporting/RegulatoryReports.tsx    — 5 report widgets
src/portal/reporting/ScheduledReports.tsx     — 5 status widgets
src/portal/reporting/ReportTemplates.tsx      — 5 grid widgets
src/portal/reporting/ReportDistribution.tsx   — 5 status widgets
src/portal/reporting/ReportingWorkspace.tsx   — 6 widgets (grid, status, timeline, ai-summary, notification)
src/portal/reporting/ReportingNavigation.tsx  — 12-item navigation
```

### 3.2 Modify Files (3 existing files)

| File | Change |
|------|--------|
| `src/portal/metadata/PortalMetadata.ts` | Update `reportingPortal`: 12 nav items, 15+ widgets, `defaultRoute: '/reports/overview'` |
| `src/portal/routing/PortalRoutes.tsx` | Import `ReportingPortal`, add 13 routes (`/reports`, `/reports/overview`, ..., `/reports/workspace`) |
| `src/navigation/navigation.config.ts` | Update `reportsItem` with 12 sub-items |

### 3.3 File Structure

```
src/portal/reporting/
├── ReportingPortal.tsx          — Route dispatcher
├── ReportingOverview.tsx        — KPI dashboard
├── ExecutiveReports.tsx         — Executive report list
├── OperationalReports.tsx       — Operational report list
├── MigrationReports.tsx         — Migration report list
├── ValidationReports.tsx        — Validation report list
├── GovernanceReports.tsx        — Governance report list
├── AuditReports.tsx             — Audit report list
├── RegulatoryReports.tsx        — Regulatory report list
├── ScheduledReports.tsx         — Scheduled job list
├── ReportTemplates.tsx          — Template library
├── ReportDistribution.tsx       — Distribution management
├── ReportingWorkspace.tsx       — Operational workspace
└── ReportingNavigation.tsx      — Navigation component
```

### 3.4 Widget Usage by Page

| Page | Widgets Used |
|------|--------------|
| ReportingOverview | KPI (6) + AI Summary (1) = 7 |
| ExecutiveReports | Report (5) |
| OperationalReports | Report (5) |
| MigrationReports | Report (5) |
| ValidationReports | Report (5) |
| GovernanceReports | Report (5) |
| AuditReports | Report (5) |
| RegulatoryReports | Report (5) |
| ScheduledReports | Status (5) |
| ReportTemplates | Grid (5) |
| ReportDistribution | Status (5) |
| ReportingWorkspace | Grid (2) + Timeline (1) + AI Summary (1) + Notification (1) + Status (1) = 6 |

**Total widgets:** ~68

---

## 4. Testing Plan

### 4.1 Build Verification
```bash
cd MAP_V2\03_Source\frontend
npm run build
```
Expected: Build passes with no TypeScript errors.

### 4.2 Manual Testing
```bash
npm run dev
```
Open `http://localhost:5173/reports`

| Test | Expected Result |
|------|-----------------|
| Navigate to `/reports` | Reporting Portal loads with Overview page |
| Click "Overview" in sidebar | 6 KPI cards + AI Summary displayed |
| Click "Executive Reports" | 5 report cards displayed |
| Click "Operational Reports" | 5 report cards displayed |
| Click "Migration Reports" | 5 report cards displayed |
| Click "Validation Reports" | 5 report cards displayed |
| Click "Governance Reports" | 5 report cards displayed |
| Click "Audit Reports" | 5 report cards displayed |
| Click "Regulatory Reports" | 5 report cards displayed |
| Click "Scheduled Reports" | 5 status cards displayed |
| Click "Templates" | 5 grid cards displayed |
| Click "Distribution" | 5 status cards displayed |
| Click "Workspace" | 6 widget cards displayed |
| Check sidebar navigation | 12 items visible under "Reports" |
| Check header/footer | No duplication (MainLayout provides) |
| Resize to tablet | Grid adapts to 2 columns |
| Resize to mobile | Grid adapts to 1 column |
| Keyboard navigation | All links focusable, Enter activates |

### 4.3 Regression Testing
- Executive Portal still works (`/dashboard/executive`)
- Operations Portal still works (`/operations`)
- Migration Portal still works (`/migration`)
- Governance Portal still works (`/governance`)
- Navigation sidebar shows all portals correctly

---

## 5. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Route conflicts with existing `/reports` route | Replace `ReportsPage` with `ReportingPortal` |
| Unused imports after changes | Remove old `ReportsPage` import from PortalRoutes |
| Widget type mismatches | Use only proven widget types: `kpi`, `report`, `grid`, `status`, `timeline`, `ai-summary`, `notification` |
| Navigation.config.ts missing icon imports | Verify `BarChart3`, `FileText`, `Clock`, etc. are imported |

---

## 6. Acceptance Criteria Checklist

| Criterion | How to Verify |
|-----------|---------------|
| Reporting Portal operational | Navigate to `/reports`, page loads |
| Navigation complete | 12 items visible in sidebar |
| Report Workspace created | `/reports/workspace` shows 6 widgets |
| Widget Framework fully utilised | 68 widgets using WidgetRenderer |
| Placeholder pages created | 12 pages all rendering widgets |
| Report categories established | 8 categories (Executive, Operational, Migration, Validation, Governance, Audit, Regulatory, Scheduled) |
| Responsive behaviour implemented | Test at 1440px, 768px, 375px widths |
| Accessibility implemented | Tab through all links, check ARIA labels |
| Ready for Prompt 014 | Build passes, all pages functional |

---

## 7. Deliverable

Save report to: `MAP_V2/02_Output/013_Create_Reporting_Portal_Report.md`

---

## 8. Recommendation

**Approve implementation.** This prompt follows the exact same pattern as Prompts 009-012:
- Portal component with route-based rendering
- 12 pages using Widget Framework
- Navigation component
- PortalMetadata update
- PortalRoutes update
- navigation.config.ts update

No new architectural decisions required. Purely additive.
