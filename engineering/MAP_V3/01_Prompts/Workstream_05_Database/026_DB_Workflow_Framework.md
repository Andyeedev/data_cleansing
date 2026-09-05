MAP Nexus™ Enterprise Platform
Prompt 026
Database Schema — Workflow Framework

Version: 1.0

Prompt ID: 026

Workstream: 05 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for the Workflow Framework in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support workflow definitions, workflow instances, and workflow execution.

---

Objective

Create a workflow framework schema capable of:

Workflow Definitions — Store workflow templates
Workflow Steps — Define steps in a workflow
Workflow Instances — Track running workflow instances
Step Instances — Track individual step execution
Workflow History — Audit trail for workflow changes

---

Database

Database: migration_engine
Schema: platform

---

SQL Scripts

### Table: platform.workflow_definitions

```sql
CREATE TABLE platform.workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('approval', 'notification', 'task', 'migration', 'governance', 'custom')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
    version INTEGER DEFAULT 1,
    steps JSONB NOT NULL DEFAULT '[]',
    triggers JSONB DEFAULT '[]',
    variables JSONB DEFAULT '{}',
    tenant_id UUID NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_workflow_definitions_tenant_id ON platform.workflow_definitions (tenant_id);
CREATE INDEX idx_workflow_definitions_type ON platform.workflow_definitions (type);
CREATE INDEX idx_workflow_definitions_status ON platform.workflow_definitions (status);
CREATE INDEX idx_workflow_definitions_name ON platform.workflow_definitions (name);
CREATE INDEX idx_workflow_definitions_deleted_at ON platform.workflow_definitions (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.workflow_definitions IS 'Workflow template definitions';
COMMENT ON COLUMN platform.workflow_definitions.steps IS 'JSON array of step definitions';
COMMENT ON COLUMN platform.workflow_definitions.triggers IS 'JSON array of trigger conditions';
```

---

### Table: platform.workflow_steps

```sql
CREATE TABLE platform.workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES platform.workflow_definitions(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('action', 'approval', 'notification', 'condition', 'parallel', 'loop', 'timer')),
    order_index INTEGER NOT NULL,
    config JSONB DEFAULT '{}',
    timeout_minutes INTEGER,
    retry_count INTEGER DEFAULT 0,
    on_success VARCHAR(100),
    on_failure VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflow_steps_workflow_definition_id ON platform.workflow_steps (workflow_definition_id);
CREATE INDEX idx_workflow_steps_order_index ON platform.workflow_steps (order_index);
CREATE INDEX idx_workflow_steps_type ON platform.workflow_steps (type);

-- Comments
COMMENT ON TABLE platform.workflow_steps IS 'Individual steps in workflow definitions';
```

---

### Table: platform.workflow_instances

```sql
CREATE TABLE platform.workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES platform.workflow_definitions(id),
    name VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    context JSONB DEFAULT '{}',
    variables JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    error_message TEXT,
    tenant_id UUID NOT NULL,
    initiated_by UUID NOT NULL,
    assigned_to UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflow_instances_workflow_definition_id ON platform.workflow_instances (workflow_definition_id);
CREATE INDEX idx_workflow_instances_status ON platform.workflow_instances (status);
CREATE INDEX idx_workflow_instances_tenant_id ON platform.workflow_instances (tenant_id);
CREATE INDEX idx_workflow_instances_initiated_by ON platform.workflow_instances (initiated_by);
CREATE INDEX idx_workflow_instances_assigned_to ON platform.workflow_instances (assigned_to);
CREATE INDEX idx_workflow_instances_created_at ON platform.workflow_instances (created_at);

-- Comments
COMMENT ON TABLE platform.workflow_instances IS 'Running workflow instances';
```

---

### Table: platform.workflow_step_instances

```sql
CREATE TABLE platform.workflow_step_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES platform.workflow_instances(id) ON DELETE CASCADE,
    workflow_step_id UUID NOT NULL REFERENCES platform.workflow_steps(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped', 'waiting')),
    input JSONB DEFAULT '{}',
    output JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    assigned_to UUID,
    approved_by UUID,
    approval_status VARCHAR(50),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflow_step_instances_workflow_instance_id ON platform.workflow_step_instances (workflow_instance_id);
CREATE INDEX idx_workflow_step_instances_workflow_step_id ON platform.workflow_step_instances (workflow_step_id);
CREATE INDEX idx_workflow_step_instances_status ON platform.workflow_step_instances (status);
CREATE INDEX idx_workflow_step_instances_assigned_to ON platform.workflow_step_instances (assigned_to);

-- Comments
COMMENT ON TABLE platform.workflow_step_instances IS 'Individual step execution instances';
```

---

### Table: platform.workflow_history

```sql
CREATE TABLE platform.workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES platform.workflow_instances(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    step_name VARCHAR(200),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    details JSONB DEFAULT '{}',
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflow_history_workflow_instance_id ON platform.workflow_history (workflow_instance_id);
CREATE INDEX idx_workflow_history_action ON platform.workflow_history (action);
CREATE INDEX idx_workflow_history_performed_by ON platform.workflow_history (performed_by);
CREATE INDEX idx_workflow_history_created_at ON platform.workflow_history (created_at);

-- Comments
COMMENT ON TABLE platform.workflow_history IS 'Workflow execution audit trail';
```

---

### Seed Data

```sql
-- Default workflow definitions
INSERT INTO platform.workflow_definitions (id, name, description, type, status, steps, tenant_id, is_system) VALUES
('00000000-0000-0000-0000-000000000001', 'User Provisioning', 'Standard user onboarding workflow', 'approval', 'active',
 '[{"name": "Manager Approval", "type": "approval", "config": {"approver": "manager"}},
   {"name": "Create Account", "type": "action", "config": {"action": "create_user"}},
   {"name": "Send Welcome Email", "type": "notification", "config": {"template": "welcome"}}]',
 '00000000-0000-0000-0000-000000000001', TRUE),

('00000000-0000-0000-0000-000000000002', 'Role Change Request', 'Role modification approval workflow', 'approval', 'active',
 '[{"name": "Admin Approval", "type": "approval", "config": {"approver": "admin"}},
   {"name": "Update Roles", "type": "action", "config": {"action": "update_roles"}},
   {"name": "Notify User", "type": "notification", "config": {"template": "role_change"}}]',
 '00000000-0000-0000-0000-000000000001', TRUE),

('00000000-0000-0000-0000-000000000003', 'Migration Execution', 'Data migration workflow with validation', 'migration', 'active',
 '[{"name": "Pre-checks", "type": "action", "config": {"action": "pre_migration_checks"}},
   {"name": "Execute Migration", "type": "action", "config": {"action": "run_migration"}},
   {"name": "Validate Results", "type": "action", "config": {"action": "validate_migration"}},
   {"name": "Notify Completion", "type": "notification", "config": {"template": "migration_complete"}}]',
 '00000000-0000-0000-0000-000000000001', TRUE);
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.workflow_definitions TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.workflow_steps TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.workflow_instances TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.workflow_step_instances TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.workflow_history TO migration_engine_app;
```

---

Acceptance Criteria

1. platform.workflow_definitions table created
2. platform.workflow_steps table created
3. platform.workflow_instances table created
4. platform.workflow_step_instances table created
5. platform.workflow_history table created
6. Default workflows seeded
7. All indexes created for query performance
8. Foreign key constraints enforce referential integrity

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

027_DB_Approval_Workflows — Approval-specific tables
026_API_Workflow_Framework — FastAPI endpoints for workflows
026_UI_Workflow_Framework — React frontend for workflows

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
