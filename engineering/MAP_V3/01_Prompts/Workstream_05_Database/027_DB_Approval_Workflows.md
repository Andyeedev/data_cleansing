MAP Nexus™ Enterprise Platform
Prompt 027
Database Schema — Approval Workflows

Version: 1.0

Prompt ID: 027

Workstream: 05 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

026_DB_Workflow_Framework

---

Purpose

Create the database schema for Approval Workflows in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables required to support approval chains, approval requests, and approval decisions.

---

Database

Database: migration_engine
Schema: platform

---

SQL Scripts

### Table: platform.approval_chains

```sql
CREATE TABLE platform.approval_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('user', 'role', 'hierarchical', 'parallel', 'sequential')),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'draft')),
    steps JSONB NOT NULL DEFAULT '[]',
    tenant_id UUID NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Indexes
CREATE INDEX idx_approval_chains_tenant_id ON platform.approval_chains (tenant_id);
CREATE INDEX idx_approval_chains_type ON platform.approval_chains (type);
CREATE INDEX idx_approval_chains_status ON platform.approval_chains (status);

-- Comments
COMMENT ON TABLE platform.approval_chains IS 'Approval chain definitions';
```

---

### Table: platform.approval_requests

```sql
CREATE TABLE platform.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_chain_id UUID NOT NULL REFERENCES platform.approval_chains(id),
    workflow_instance_id UUID REFERENCES platform.workflow_instances(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'expired')),
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    request_data JSONB DEFAULT '{}',
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER NOT NULL,
    tenant_id UUID NOT NULL,
    requested_by UUID NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_approval_requests_approval_chain_id ON platform.approval_requests (approval_chain_id);
CREATE INDEX idx_approval_requests_workflow_instance_id ON platform.approval_requests (workflow_instance_id);
CREATE INDEX idx_approval_requests_status ON platform.approval_requests (status);
CREATE INDEX idx_approval_requests_tenant_id ON platform.approval_requests (tenant_id);
CREATE INDEX idx_approval_requests_requested_by ON platform.approval_requests (requested_by);
CREATE INDEX idx_approval_requests_due_at ON platform.approval_requests (due_at);

-- Comments
COMMENT ON TABLE platform.approval_requests IS 'Pending approval requests';
```

---

### Table: platform.approvals

```sql
CREATE TABLE platform.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES platform.approval_requests(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES platform.users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'skipped', 'expired')),
    decision VARCHAR(50),
    comments TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    delegate_to UUID REFERENCES platform.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_approvals_approval_request_id ON platform.approvals (approval_request_id);
CREATE INDEX idx_approvals_approver_id ON platform.approvals (approver_id);
CREATE INDEX idx_approvals_status ON platform.approvals (status);
CREATE INDEX idx_approvals_step_index ON platform.approvals (step_index);

-- Comments
COMMENT ON TABLE platform.approvals IS 'Individual approval decisions';
```

---

### Table: platform.approval_history

```sql
CREATE TABLE platform.approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES platform.approval_requests(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    step_index INTEGER,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    details JSONB DEFAULT '{}',
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_approval_history_approval_request_id ON platform.approval_history (approval_request_id);
CREATE INDEX idx_approval_history_action ON platform.approval_history (action);
CREATE INDEX idx_approval_history_performed_by ON platform.approval_history (performed_by);

-- Comments
COMMENT ON TABLE platform.approval_history IS 'Approval request audit trail';
```

---

### Seed Data

```sql
-- Default approval chains
INSERT INTO platform.approval_chains (id, name, description, type, steps, tenant_id, is_system) VALUES
('00000000-0000-0000-0000-000000000001', 'User Role Change', 'Approval for role modifications', 'sequential',
 '[{"name": "Manager Approval", "approverType": "role", "approverRole": "Tenant Admin", "timeoutHours": 48}]',
 '00000000-0000-0000-0000-000000000001', TRUE),

('00000000-0000-0000-0000-000000000002', 'Migration Execution', 'Approval for migration jobs', 'sequential',
 '[{"name": "Technical Review", "approverType": "role", "approverRole": "Tenant Admin", "timeoutHours": 24},
   {"name": "Business Approval", "approverType": "role", "approverRole": "Super Admin", "timeoutHours": 48}]',
 '00000000-0000-0000-0000-000000000001', TRUE),

('00000000-0000-0000-0000-000000000003', 'Tenant Provisioning', 'Approval for new tenant creation', 'parallel',
 '[{"name": "Admin Approval", "approverType": "role", "approverRole": "Super Admin", "timeoutHours": 24}]',
 '00000000-0000-0000-0000-000000000001', TRUE);
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.approval_chains TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.approval_requests TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.approvals TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.approval_history TO migration_engine_app;
```

---

Acceptance Criteria

1. platform.approval_chains table created
2. platform.approval_requests table created
3. platform.approvals table created
4. platform.approval_history table created
5. Default approval chains seeded
6. All indexes created for query performance

---

Dependencies

026_DB_Workflow_Framework

---

Next Steps

After this prompt, implement:

028_DB_Notifications — Notification tables
027_API_Approval_Workflows — FastAPI endpoints for approvals
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
