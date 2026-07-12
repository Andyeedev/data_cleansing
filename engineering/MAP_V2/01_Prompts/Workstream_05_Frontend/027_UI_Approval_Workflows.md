MAP Nexus™ Enterprise Platform
Prompt 027
Frontend UI — Approval Workflows

Version: 1.0

Prompt ID: 027

Workstream: 05 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

027_DB_Approval_Workflows
027_API_Approval_Workflows

---

Purpose

Create the React frontend for Approval Workflows in the MAP Nexus™ platform.

---

Folder Structure

Create

src/portal/approvals/
ApprovalPortal.tsx
hooks/useApprovals.ts
types/approval.types.ts
components/
ApprovalQueue.tsx
ApprovalDetail.tsx
ApprovalChainList.tsx
ApprovalHistory.tsx
services/ApprovalService.ts

---

TypeScript Types

```typescript
// types/approval.types.ts
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
export type ApprovalPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ApprovalChain {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  steps: any[];
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  approvalChainId: string;
  workflowInstanceId?: string;
  title: string;
  description?: string;
  status: ApprovalStatus;
  priority: ApprovalPriority;
  requestData: any;
  currentStep: number;
  totalSteps: number;
  requestedBy: string;
  dueAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  approvalRequestId: string;
  stepIndex: number;
  approverId: string;
  status: ApprovalStatus;
  decision?: string;
  comments?: string;
  decidedAt?: string;
  createdAt: string;
}
```

---

Main Pages

ApprovalQueue.tsx
- List of pending approvals
- Priority filters
- Quick approve/reject actions

ApprovalDetail.tsx
- Approval request details
- Decision form
- Comments section

ApprovalChainList.tsx
- List of approval chains
- Chain configuration

ApprovalHistory.tsx
- Historical approvals
- Audit trail

---

Acceptance Criteria

1. Approval queue displays pending items
2. Approval detail shows full context
3. Approve/reject actions work
4. Comments can be added
5. History displays correctly

---

Dependencies

027_API_Approval_Workflows (backend endpoints)

---

Next Steps

After this prompt, implement:

028_UI_Notifications — React frontend for notifications

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
