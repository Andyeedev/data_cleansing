# Prompt 019 — Create Report Scheduler
## Analysis & Implementation Plan

**Date:** 2026-07-09
**Prompt:** 019 — Create Report Scheduler
**Workstream:** 03 — Reporting & Presentation Engine
**Status:** Analysis Complete — Awaiting Go-Ahead

---

## 1. Scope

### What This Prompt Creates
- A **presentation-only** Report Scheduler framework
- **No** scheduling engine, backend, APIs, or execution logic
- Metadata-driven placeholders for future integration

### Key Insight
The Report Centre already has:
- `ReportSchedule` interface with `id, reportId, reportName, frequency, nextRun, lastRun, status, recipients`
- `ReportQueueItem` interface with `id, reportName, status, startedAt, completedAt, error, progress`
- `ReportHistoryEntry` interface with `id, reportName, action, timestamp, user, format`
- 3 mock schedules, 3 mock queue items, 5 mock history entries in `useReportCentre.ts`
- Existing `ScheduledReports.tsx` page (table view) at `/report-centre/scheduled`

**The Report Scheduler is a NEW standalone module** at `src/reporting/scheduler/` — a dedicated scheduling workspace, not a duplicate of the Report Centre.

---

## 2. Files to Create (15 pages + 1 hook + 1 types file + components + README)

### Pages (in `src/reporting/scheduler/`)

| # | File | Purpose | Key Sections |
|---|---|---|---|
| 1 | `ReportScheduler.tsx` | Top-level router — maps URL paths to page components | Route record, 12 routes |
| 2 | `SchedulerDashboard.tsx` | Dashboard with KPI widgets | Scheduled Reports, Running Jobs, Next Executions, Failed Schedules, Queue Size, Scheduler Health, AI Recommendations |
| 3 | `ScheduleExplorer.tsx` | Browse schedules by frequency | Daily, Weekly, Monthly, Quarterly, Annual, Event Driven, On Demand — grid/list toggle |
| 4 | `ScheduleDetails.tsx` | Detail view for a single schedule | Report, Frequency, Start/End Date, Time, Time Zone, Priority, Owner, Notifications |
| 5 | `ScheduleEditor.tsx` | Create/Edit schedule form | Report selector, Frequency, Start/End Date, Time, Time Zone, Priority, Owner, Notifications, Save/Cancel |
| 6 | `ScheduleCalendar.tsx` | Calendar view | Day, Week, Month, Agenda tabs — mock calendar grid |
| 7 | `ScheduleTimeline.tsx` | Timeline view | Past Executions, Current Jobs, Future Schedules sections |
| 8 | `ScheduleHistory.tsx` | Execution history | Table: Execution History, Runtime, Status, Errors, Audit Trail |
| 9 | `ScheduleQueue.tsx` | Queue management | Pending, Running, Completed, Failed, Cancelled tabs |
| 10 | `ScheduleTemplates.tsx` | Reusable schedule templates | 5 template cards: Daily Executive, Weekly Governance, Monthly Audit Pack, Quarterly Migration Review, Annual Compliance |
| 11 | `ScheduleNotifications.tsx` | Notification settings | Email, Teams, SMS, Web notification toggles |
| 12 | `ScheduleLogs.tsx` | Scheduler logs | Log viewer with severity levels |
| 13 | `ScheduleStatistics.tsx` | Statistics dashboard | Success Rate, Failure Rate, Average Runtime, Queue Length, Peak Hours, Widget Usage — KPI widgets |
| 14 | `SchedulerSettings.tsx` | Scheduler configuration | Default timezone, retry policy, notification preferences |
| 15 | `SchedulerWorkspace.tsx` | Workspace overview | Summary cards + quick actions |

### Supporting Files

| File | Purpose |
|---|---|
| `types/SchedulerTypes.ts` | Scheduler-specific interfaces (ScheduleConfig, ScheduleTemplate, ScheduleLogEntry, etc.) |
| `hooks/useReportScheduler.ts` | Mock data, filter state, metrics, actions |
| `components/` | Shared sub-components (SchedulerHeader, ScheduleStatusBadge, FrequencyBadge) |
| `widgets/` | Scheduler-specific widget wrappers |
| `README.md` | Documentation |

---

## 3. Types to Create (in `types/SchedulerTypes.ts`)

```typescript
// Extend existing ReportSchedule with scheduler-specific fields
interface ScheduleConfig {
  id: string;
  reportId: string;
  reportName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'event-driven' | 'on-demand';
  startDate: string;
  endDate?: string;
  time: string;
  timeZone: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  recipients: string[];
  notifications: NotificationConfig;
  createdAt: string;
  updatedAt: string;
}

interface NotificationConfig {
  email: boolean;
  teams: boolean;
  sms: boolean;
  web: boolean;
}

interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  frequency: string;
  config: Partial<ScheduleConfig>;
  usageCount: number;
}

interface ScheduleLogEntry {
  id: string;
  scheduleId: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
}

interface SchedulerMetrics {
  totalScheduled: number;
  runningJobs: number;
  nextExecutions: number;
  failedSchedules: number;
  queueSize: number;
  healthScore: number;
}
```

---

## 4. Widget Integration

All pages will use Prompt 007 widgets. Planned usage:

| Widget | Where Used |
|---|---|
| `KPIWidget` | SchedulerDashboard (6 KPIs), ScheduleStatistics (6 KPIs) |
| `StatusWidget` | SchedulerDashboard (Scheduler Health), ScheduleQueue (status indicators) |
| `TimelineWidget` | ScheduleTimeline (execution timeline), ScheduleHistory (audit trail) |
| `GridWidget` | ScheduleExplorer (schedule grid), ScheduleHistory (history table), ScheduleQueue (queue table) |
| `AISummaryWidget` | SchedulerDashboard (AI Recommendations) |
| `NotificationWidget` | ScheduleNotifications (notification preview) |
| `BarChartWidget` | ScheduleStatistics (Peak Hours chart) |

---

## 5. Navigation

### Sidebar Navigation Items

```
Reporting > Report Scheduler
├── Dashboard          /scheduler
├── Schedules          /scheduler/schedules
├── Calendar           /scheduler/calendar
├── Timeline           /scheduler/timeline
├── Queue              /scheduler/queue
├── History            /scheduler/history
├── Templates          /scheduler/templates
├── Notifications      /scheduler/notifications
├── Logs               /scheduler/logs
├── Statistics         /scheduler/statistics
└── Settings           /scheduler/settings
```

### Integration Points
- Add "Report Scheduler" link to sidebar navigation under Reporting section
- Add route to `PortalRoutes.tsx` under reporting routes
- Cross-link from Report Centre (`/report-centre/scheduled` → `/scheduler/schedules`)

---

## 6. Mock Data Plan

### useReportScheduler.ts Hook

**Schedules (10+):** Extend existing 3 mock schedules to 10+ with varying frequencies, statuses, priorities.

**Templates (5):**
1. Daily Executive Report — daily, high priority
2. Weekly Governance Report — weekly, medium priority
3. Monthly Audit Pack — monthly, high priority
4. Quarterly Migration Review — quarterly, medium priority
5. Annual Compliance Report — annually, critical priority

**Logs (15+):** Mix of info/warning/error entries with realistic messages.

**Statistics:** Mock metrics for success/failure rates, average runtime, peak hours, queue length.

---

## 7. Theme Integration

- Inherit Prompt 002 theme system (colours, typography, icons, layout, branding)
- All components use `className` with Tailwind theme classes
- Dark mode support via existing theme context
- Consistent with Report Centre and Report Viewer styling

---

## 8. Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Full sidebar + content area |
| Tablet (768-1023px) | Collapsible sidebar, stacked widgets |
| Mobile (<768px) | Bottom navigation, single-column layout |

---

## 9. Accessibility

- WCAG AA compliance
- Keyboard navigation for all interactive elements
- ARIA labels on buttons, tabs, and forms
- Screen reader support for status indicators
- High contrast mode support

---

## 10. Testing Plan

### Manual Testing Steps

1. **Build Verification**
   ```bash
   cd MAP_V2\03_Source\frontend && npm run build
   ```
   - Confirm no TypeScript errors
   - Confirm no unused imports

2. **Dev Server Test**
   ```bash
   npm run dev
   ```

3. **Route Verification** — Navigate to each route:
   - `/scheduler` — Dashboard loads with 6 KPI widgets + AI summary
   - `/scheduler/schedules` — Explorer with frequency tabs (Daily/Weekly/Monthly/Quarterly/Annual/Event/On Demand)
   - `/scheduler/calendar` — Calendar view with Day/Week/Month/Agenda tabs
   - `/scheduler/timeline` — Timeline with Past/Current/Future sections
   - `/scheduler/queue` — Queue with Pending/Running/Completed/Failed/Cancelled tabs
   - `/scheduler/history` — History table with execution records
   - `/scheduler/templates` — 5 template cards
   - `/scheduler/notifications` — Notification settings with toggles
   - `/scheduler/logs` — Log viewer
   - `/scheduler/statistics` — 6 KPI widgets + chart
   - `/scheduler/settings` — Settings form

4. **Widget Integration** — Confirm widgets render correctly:
   - KPI widgets show values, deltas, icons
   - Grid widget shows tables with headers
   - Timeline widget shows timeline entries

5. **Navigation** — Confirm sidebar link appears under Reporting section

6. **Responsive** — Resize browser to verify tablet/mobile layouts

7. **Accessibility** — Tab through all interactive elements, verify ARIA labels

### Acceptance Criteria Checklist

- [ ] Report Scheduler operational
- [ ] Schedule Explorer created (frequency tabs)
- [ ] Calendar created (Day/Week/Month/Agenda)
- [ ] Timeline created (Past/Current/Future)
- [ ] Queue Manager created (5 status tabs)
- [ ] Widget Framework integrated (KPI, Status, Timeline, Grid, AI)
- [ ] Report Centre integrated (cross-links)
- [ ] Report Viewer integrated (view from schedule details)
- [ ] Responsive behaviour implemented
- [ ] Accessibility implemented
- [ ] Ready for Prompt 020

---

## 11. Estimated Impact

| Metric | Estimate |
|---|---|
| Files created | ~20 (15 pages + hook + types + components + README) |
| Lines of code | ~2,500-3,000 |
| Build risk | Low (presentation-only, no API integration) |
| Dependencies | Only existing widget framework + theme system |

---

## 12. Dependencies Satisfied

| Dependency | Status |
|---|---|
| Prompt 007 (Widget Framework) | ✅ Complete |
| Prompt 016 (HTML Reporting) | ✅ Complete |
| Prompt 017 (Report Centre) | ✅ Complete |
| Prompt 018 (Report Viewer) | ✅ Complete |

---

## 13. Deliverables

1. `src/reporting/scheduler/` — Complete scheduler module
2. Navigation integration — Sidebar + routes
3. `019_Create_Report_Scheduler_Report.md` — Prompt report

---

**Ready for implementation. Awaiting go-ahead.**
