MAP Nexus™ Enterprise Platform
Prompt 026
Frontend UI — Workflow Framework

Version: 1.0

Prompt ID: 026

Workstream: 05 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

026_DB_Workflow_Framework
026_API_Workflow_Framework

---

Purpose

Create the React frontend for the Workflow Framework in the MAP Nexus™ platform.

---

Folder Structure

Create

src/portal/workflow/
WorkflowPortal.tsx
hooks/useWorkflows.ts
types/workflow.types.ts
components/
WorkflowList.tsx
WorkflowDesigner.tsx
WorkflowInstanceList.tsx
WorkflowDetail.tsx
services/WorkflowService.ts

---

TypeScript Types

```typescript
// types/workflow.types.ts
export type WorkflowStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type WorkflowStepType = 'action' | 'approval' | 'notification' | 'condition' | 'parallel' | 'loop' | 'timer';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  version: number;
  steps: WorkflowStep[];
  triggers: any[];
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  orderIndex: number;
  config: any;
}

export interface WorkflowInstance {
  id: string;
  workflowDefinitionId: string;
  name?: string;
  status: WorkflowStatus;
  priority: string;
  context: any;
  startedAt?: string;
  completedAt?: string;
  initiatedBy: string;
  assignedTo?: string;
  createdAt: string;
}

export interface WorkflowHistory {
  id: string;
  action: string;
  stepName?: string;
  oldStatus?: string;
  newStatus?: string;
  details: any;
  performedBy: string;
  createdAt: string;
}
```

---

API Endpoints Used

```typescript
const WORKFLOW_ENDPOINTS = {
  DEFINITIONS: '/workflows',
  INSTANCES: '/workflows/instances',
  START: (id: string) => `/workflows/${id}/start`,
  PAUSE: (id: string) => `/workflows/instances/${id}/pause`,
  RESUME: (id: string) => `/workflows/instances/${id}/resume`,
  CANCEL: (id: string) => `/workflows/instances/${id}/cancel`,
  HISTORY: (id: string) => `/workflows/instances/${id}/history`,
};
```

---

Main Pages

WorkflowList.tsx
- List of workflow definitions
- Search and filter
- Create new workflow button

WorkflowDesigner.tsx
- Visual workflow designer
- Step configuration
- Drag and drop interface

WorkflowInstanceList.tsx
- List of running workflow instances
- Status filters
- Quick actions (pause, resume, cancel)

WorkflowDetail.tsx
- Workflow instance details
- Step progress
- History timeline

---

Acceptance Criteria

1. Workflow list displays definitions
2. Workflow designer allows visual editing
3. Instance list shows running workflows
4. Detail view shows step progress
5. Pause/resume/cancel actions work
6. History timeline displays correctly

---

Dependencies

026_API_Workflow_Framework (backend endpoints)
Widget Framework (Prompt 007)

---

Next Steps

After this prompt, implement:

027_UI_Approval_Workflows — React frontend for approvals

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
