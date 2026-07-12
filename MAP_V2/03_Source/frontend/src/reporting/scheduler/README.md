# Report Scheduler

Enterprise Report Scheduler for MAP Nexus — presentation-only framework for managing automated report schedules.

## Structure

```
src/reporting/scheduler/
├── types/
│   └── SchedulerTypes.ts          # Scheduler interfaces
├── hooks/
│   └── useReportScheduler.ts      # Mock data hook
├── ReportScheduler.tsx            # Top-level router
├── SchedulerDashboard.tsx         # Dashboard with KPI widgets
├── ScheduleExplorer.tsx           # Browse by frequency
├── ScheduleDetails.tsx            # Schedule detail view
├── ScheduleEditor.tsx             # Create/edit schedule
├── ScheduleCalendar.tsx           # Calendar view
├── ScheduleTimeline.tsx           # Timeline view
├── ScheduleHistory.tsx            # Execution history
├── ScheduleQueue.tsx              # Queue management
├── ScheduleTemplates.tsx          # Reusable templates
├── ScheduleNotifications.tsx      # Notification settings
├── ScheduleLogs.tsx               # Scheduler logs
├── ScheduleStatistics.tsx         # Statistics dashboard
├── SchedulerSettings.tsx          # Scheduler configuration
├── SchedulerWorkspace.tsx         # Workspace overview
└── README.md                      # This file
```

## Routes

| Route | Component |
|-------|-----------|
| `/scheduler` | SchedulerDashboard |
| `/scheduler/schedules` | ScheduleExplorer |
| `/scheduler/calendar` | ScheduleCalendar |
| `/scheduler/timeline` | ScheduleTimeline |
| `/scheduler/queue` | ScheduleQueue |
| `/scheduler/history` | ScheduleHistory |
| `/scheduler/templates` | ScheduleTemplates |
| `/scheduler/notifications` | ScheduleNotifications |
| `/scheduler/logs` | ScheduleLogs |
| `/scheduler/statistics` | ScheduleStatistics |
| `/scheduler/settings` | SchedulerSettings |
| `/scheduler/workspace` | SchedulerWorkspace |
| `/scheduler/details/:id` | ScheduleDetails |
| `/scheduler/editor/:id?` | ScheduleEditor |

## Widgets Used

- KPIWidget — Dashboard and Statistics pages
- StatusWidget — Dashboard and Workspace
- AISummaryWidget — Dashboard AI Recommendations
- TimelineWidget — Timeline and History
- BarChartWidget — Statistics charts

## Theme Integration

All pages use Tailwind classes from the Prompt 002 theme system:
- `text-neutral-100` for primary text
- `text-neutral-60` for secondary text
- `bg-blue-600` for primary actions
- `bg-success-100` for success states
- `bg-warning-100` for warning states
- `bg-danger-100` for error states
