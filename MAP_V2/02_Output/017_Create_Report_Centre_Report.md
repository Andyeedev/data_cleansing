# Prompt 017: Create Report Centre — Report

**Status:** ✅ Complete  
**Date:** 2026-07-09  
**Build:** Passing

---

## Files Created

### Types
- `src/reporting/centre/types/ReportCentreTypes.ts` — ReportItem, ReportSchedule, ReportQueueItem, ReportHistoryEntry, ReportFilters, ReportCentreMetrics

### Hook
- `src/reporting/centre/hooks/useReportCentre.ts` — Mock data with reports, schedules, queue, history, filters

### Pages (15)
- `ReportHome.tsx` — 6 KPI widgets + AI Summary + Status widgets
- `ReportExplorer.tsx` — Browse reports by category with grid/list view
- `RecentReports.tsx` — Recently generated reports table
- `FavouriteReports.tsx` — Bookmarked reports grid
- `ScheduledReports.tsx` — Scheduled reports table
- `SharedReports.tsx` — Shared reports grid
- `MyReports.tsx` — User's own reports grid
- `ReportTemplates.tsx` — Reusable report templates grid
- `ReportCategories.tsx` — Browse by category cards
- `ReportPreview.tsx` — Report preview container
- `ReportHistory.tsx` — Generation/download history table
- `ReportQueue.tsx` — Running/pending/failed reports with progress
- `ReportSearch.tsx` — Global search with tag filtering
- `ReportFilters.tsx` — Advanced filters (category, status, owner, date, favourites, scheduled)
- `ReportDetails.tsx` — Report detail view with metadata
- `ReportWorkspace.tsx` — Enterprise workspace with grid/list view

### Navigation
- `ReportCentreNavigation.tsx` — 15 navigation items
- `ReportCentreSidebar.tsx` — Sidebar navigation component

### Portal Component
- `ReportCentre.tsx` — Route-based rendering

---

## Navigation Structure

| # | Page | Route |
|---|------|-------|
| 1 | Report Home | `/report-centre` |
| 2 | Recent Reports | `/report-centre/recent` |
| 3 | My Reports | `/report-centre/my` |
| 4 | Shared Reports | `/report-centre/shared` |
| 5 | Favourite Reports | `/report-centre/favourites` |
| 6 | Scheduled Reports | `/report-centre/scheduled` |
| 7 | Templates | `/report-centre/templates` |
| 8 | Categories | `/report-centre/categories` |
| 9 | Report Explorer | `/report-centre/explorer` |
| 10 | Report History | `/report-centre/history` |
| 11 | Report Queue | `/report-centre/queue` |
| 12 | Preview | `/report-centre/preview` |
| 13 | Search | `/report-centre/search` |
| 14 | Filters | `/report-centre/filters` |
| 15 | Workspace | `/report-centre/workspace` |

---

## Widget Usage

| Widget | Used In |
|--------|---------|
| KPIWidget | ReportHome (6 instances) |
| StatusWidget | ReportHome |
| AISummaryWidget | ReportHome |

---

## Report Modules

| Module | Purpose |
|--------|---------|
| Explorer | Browse by category (Executive, Migration, Validation, Governance, Risk, Security, Administration, Audit, AI) |
| Recent | Recently generated reports |
| Favourites | Bookmarked reports |
| Scheduled | Auto-generated reports |
| Shared | Reports shared by others |
| My Reports | User-owned reports |
| Templates | Reusable report templates |
| Categories | Category-based browsing |
| Preview | Report preview container |
| History | Generation/download history |
| Queue | Running/pending/failed reports |
| Search | Global search with tags |
| Filters | Advanced filtering |
| Workspace | Enterprise workspace |

---

## Files Modified

| File | Change |
|------|--------|
| `PortalRoutes.tsx` | Added Report Centre import and 16 routes |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Report Centre operational | ✅ |
| Report Explorer created | ✅ |
| Report Workspace created | ✅ |
| Report Preview created | ✅ |
| Widget Framework integrated | ✅ |
| HTML Reporting Framework integrated | ✅ |
| Responsive behaviour implemented | ✅ |
| Accessibility implemented | ✅ |
| Ready for Prompt 018 | ✅ |

---

## How to Test

```bash
cd MAP_V2\03_Source\frontend
npm run dev
```

Navigate to `http://localhost:5173/report-centre`

Expected outcomes:
- **Report Home** — 6 KPI cards showing metrics, AI summary widget, status widget
- **Report Explorer** — Grid/list view of reports with category filters
- **Report Queue** — Progress bars for running reports, status indicators
- **Report Search** — Search input with clickable tag filters
- **Report Filters** — Dropdowns for category/status, date pickers, checkboxes
- **Report Preview** — Preview container with cover page, summary, KPIs, recommendations

---

## Next Prompt

**Prompt 018 — Create Report Viewer**

The Report Viewer will provide enterprise-quality report viewing capabilities including HTML rendering, zoom, page navigation, section bookmarks, and print preview while maintaining full compatibility with the HTML Reporting Framework and Report Centre.
