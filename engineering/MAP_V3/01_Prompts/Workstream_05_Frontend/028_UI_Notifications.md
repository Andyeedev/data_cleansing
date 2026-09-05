MAP Nexus™ Enterprise Platform
Prompt 028
Frontend UI — Notifications

Version: 1.0

Prompt ID: 028

Workstream: 05 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

028_DB_Notifications
028_API_Notifications

---

Purpose

Create the React frontend for Notifications in the MAP Nexus™ platform.

---

Folder Structure

Create

src/portal/notifications/
NotificationPortal.tsx
hooks/useNotifications.ts
types/notification.types.ts
components/
NotificationCenter.tsx
NotificationList.tsx
NotificationItem.tsx
NotificationPreferences.tsx
services/NotificationService.ts

---

TypeScript Types

```typescript
// types/notification.types.ts
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system' | 'approval' | 'task' | 'workflow';
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  source?: string;
  sourceId?: string;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  id: string;
  category: string;
  channel: NotificationChannel;
  enabled: boolean;
  frequency: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}
```

---

Main Pages

NotificationCenter.tsx
- Notification bell with unread count
- Dropdown panel with recent notifications
- Mark as read functionality

NotificationList.tsx
- Full notification list
- Filter by type, status
- Mark all as read

NotificationItem.tsx
- Individual notification display
- Action buttons
- Timestamp

NotificationPreferences.tsx
- Notification settings
- Channel preferences
- Quiet hours configuration

---

Acceptance Criteria

1. Notification bell shows unread count
2. Dropdown displays recent notifications
3. Mark as read works
4. Mark all as read works
5. Preferences page saves correctly
6. Different notification types display with correct styling

---

Dependencies

028_API_Notifications (backend endpoints)

---

Next Steps

After this prompt, implement:

029_UI_Task_Manager — React frontend for tasks

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
