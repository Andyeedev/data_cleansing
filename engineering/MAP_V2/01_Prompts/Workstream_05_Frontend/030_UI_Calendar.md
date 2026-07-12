MAP Nexus™ Enterprise Platform
Prompt 030
Frontend UI — Calendar

Version: 1.0

Prompt ID: 030

Workstream: 05 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

030_DB_Calendar
030_API_Calendar

---

Purpose

Create the React frontend for Calendar in the MAP Nexus™ platform.

---

Folder Structure

Create

src/portal/calendar/
CalendarPortal.tsx
hooks/useCalendar.ts
types/calendar.types.ts
components/
CalendarView.tsx
EventList.tsx
EventDetail.tsx
EventForm.tsx
UpcomingEvents.tsx
services/CalendarService.ts

---

TypeScript Types

```typescript
// types/calendar.types.ts
export type EventType = 'meeting' | 'maintenance' | 'deadline' | 'reminder' | 'task' | 'custom';
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
export type CalendarViewType = 'day' | 'week' | 'month' | 'year';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  allDay: boolean;
  startTime: string;
  endTime?: string;
  recurrenceRule?: string;
  location?: string;
  meetingUrl?: string;
  tenantId: string;
  createdBy: string;
  attendees: EventAttendee[];
  reminders: EventReminder[];
  createdAt: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  role: 'organizer' | 'required' | 'optional';
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  minutesBefore: number;
  type: 'notification' | 'email' | 'sms';
  sent: boolean;
}

export interface CalendarView {
  id: string;
  userId: string;
  name: string;
  viewType: CalendarViewType;
  visibleTypes: EventType[];
  color: string;
  isDefault: boolean;
}

export interface CalendarFilters {
  startDate?: string;
  endDate?: string;
  types?: EventType[];
  view?: CalendarViewType;
}
```

---

Main Pages

CalendarView.tsx
- Monthly/weekly/daily calendar grid
- Event display on calendar
- Click to view/create events
- View switching (day/week/month)

EventList.tsx
- List of events for selected period
- Filter by type
- Sort by date

EventDetail.tsx
- Full event details
- Attendee list
- RSVP actions
- Edit/delete actions

EventForm.tsx
- Create/edit event form
- Date/time picker
- Recurrence options
- Attendee selection
- Reminder configuration

UpcomingEvents.tsx
- Widget showing upcoming events
- Quick view of next 7 days
- Link to full calendar

---

Acceptance Criteria

1. Calendar grid displays events correctly
2. Day/week/month views work
3. Event creation form works
4. Event editing works
5. Attendee management works
6. RSVP responses work
7. Reminder configuration works
8. Upcoming events widget works
9. Recurring events display correctly

---

Dependencies

030_API_Calendar (backend endpoints)

---

Next Steps

After this prompt, all Workstream 05 prompts are complete.

Verify:
1. All database schemas created (026-030)
2. All backend APIs functional (026-030)
3. All frontend UIs working (026-030)
4. Integration tests pass
5. Build succeeds

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
