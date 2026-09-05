MAP Nexus™ Enterprise Platform
Prompt 029
Frontend UI — Task Manager

Version: 1.0

Prompt ID: 029

Workstream: 05 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

029_DB_Task_Manager
029_API_Task_Manager

---

Purpose

Create the React frontend for Task Manager in the MAP Nexus™ platform.

---

Folder Structure

Create

src/portal/tasks/
TaskPortal.tsx
hooks/useTasks.ts
types/task.types.ts
components/
TaskBoard.tsx
TaskList.tsx
TaskCard.tsx
TaskDetail.tsx
TaskFilters.tsx
services/TaskService.ts

---

TypeScript Types

```typescript
// types/task.types.ts
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'general' | 'approval' | 'migration' | 'validation' | 'governance' | 'system';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  progress: number;
  tenantId: string;
  createdBy: string;
  assignments: TaskAssignment[];
  createdAt: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  status: string;
  assignedAt: string;
  assignedBy: string;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  assignedToMe?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
```

---

Main Pages

TaskBoard.tsx
- Kanban-style task board
- Columns: Pending, In Progress, Completed
- Drag and drop support

TaskList.tsx
- Table view of tasks
- Sorting and filtering
- Bulk actions

TaskCard.tsx
- Task card for board view
- Priority indicator
- Due date display
- Assignee avatars

TaskDetail.tsx
- Full task details
- Edit form
- Comments section
- Activity log

TaskFilters.tsx
- Filter panel
- Status, priority, type filters
- Assigned to me filter

---

Acceptance Criteria

1. Task board displays tasks in columns
2. Drag and drop updates task status
3. Task list supports sorting and filtering
4. Task detail shows full information
5. Task assignment works
6. Task completion updates status
7. Progress tracking works

---

Dependencies

029_API_Task_Manager (backend endpoints)

---

Next Steps

After this prompt, implement:

030_UI_Calendar — React frontend for calendar

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
