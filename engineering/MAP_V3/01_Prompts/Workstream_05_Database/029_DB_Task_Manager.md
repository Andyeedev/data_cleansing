MAP Nexus™ Enterprise Platform
Prompt 029
Database Schema — Task Manager

Version: 1.0

Prompt ID: 029

Workstream: 05 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for Task Manager in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables required to support task creation, assignment, tracking, and completion.

---

Database

Database: migration_engine
Schema: platform

---

SQL Scripts

### Table: platform.tasks

```sql
CREATE TABLE platform.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('general', 'approval', 'migration', 'validation', 'governance', 'system')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100),
    due_date DATE,
    due_time TIME,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_minutes INTEGER,
    actual_minutes INTEGER,
    progress INTEGER DEFAULT 0
        CHECK (progress >= 0 AND progress <= 100),
    tenant_id UUID NOT NULL,
    created_by UUID NOT NULL REFERENCES platform.users(id),
    workflow_instance_id UUID REFERENCES platform.workflow_instances(id),
    parent_task_id UUID REFERENCES platform.tasks(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_tasks_tenant_id ON platform.tasks (tenant_id);
CREATE INDEX idx_tasks_status ON platform.tasks (status);
CREATE INDEX idx_tasks_priority ON platform.tasks (priority);
CREATE INDEX idx_tasks_type ON platform.tasks (type);
CREATE INDEX idx_tasks_created_by ON platform.tasks (created_by);
CREATE INDEX idx_tasks_due_date ON platform.tasks (due_date);
CREATE INDEX idx_tasks_parent_task_id ON platform.tasks (parent_task_id);
CREATE INDEX idx_tasks_deleted_at ON platform.tasks (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.tasks IS 'Task assignments and tracking';
```

---

### Table: platform.task_assignments

```sql
CREATE TABLE platform.task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES platform.users(id),
    status VARCHAR(50) DEFAULT 'assigned'
        CHECK (status IN ('assigned', 'accepted', 'in_progress', 'completed')),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_task_assignments_task_id ON platform.task_assignments (task_id);
CREATE INDEX idx_task_assignments_user_id ON platform.task_assignments (user_id);
CREATE INDEX idx_task_assignments_status ON platform.task_assignments (status);

-- Comments
COMMENT ON TABLE platform.task_assignments IS 'Task user assignments';
```

---

### Table: platform.task_comments

```sql
CREATE TABLE platform.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES platform.task_comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_task_comments_task_id ON platform.task_comments (task_id);
CREATE INDEX idx_task_comments_user_id ON platform.task_comments (user_id);
CREATE INDEX idx_task_comments_parent_comment_id ON platform.task_comments (parent_comment_id);

-- Comments
COMMENT ON TABLE platform.task_comments IS 'Task discussion comments';
```

---

### Table: platform.task_attachments

```sql
CREATE TABLE platform.task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    storage_path VARCHAR(1000) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES platform.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_task_attachments_task_id ON platform.task_attachments (task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON platform.task_attachments (uploaded_by);

-- Comments
COMMENT ON TABLE platform.task_attachments IS 'Task file attachments';
```

---

### Table: platform.task_activity

```sql
CREATE TABLE platform.task_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}',
    performed_by UUID NOT NULL REFERENCES platform.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_task_activity_task_id ON platform.task_activity (task_id);
CREATE INDEX idx_task_activity_action ON platform.task_activity (action);
CREATE INDEX idx_task_activity_performed_by ON platform.task_activity (performed_by);

-- Comments
COMMENT ON TABLE platform.task_activity IS 'Task activity audit trail';
```

---

### Seed Data

```sql
-- Default task categories
INSERT INTO platform.tasks (title, description, type, status, priority, tenant_id, created_by) VALUES
('Review Migration Report', 'Review the latest migration validation report', 'migration', 'pending', 'medium',
 '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM platform.users WHERE email = 'admin@mapnexus.com' LIMIT 1)),
('Update Security Policies', 'Review and update platform security policies', 'governance', 'pending', 'high',
 '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM platform.users WHERE email = 'admin@mapnexus.com' LIMIT 1)),
('Approve User Provisioning', 'Approve pending user provisioning requests', 'approval', 'pending', 'medium',
 '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM platform.users WHERE email = 'admin@mapnexus.com' LIMIT 1));
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tasks TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.task_assignments TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.task_comments TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.task_attachments TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.task_activity TO migration_engine_app;
```

---

Acceptance Criteria

1. platform.tasks table created with full lifecycle fields
2. platform.task_assignments table created
3. platform.task_comments table created with threading
4. platform.task_attachments table created
5. platform.task_activity table created for audit
6. Default tasks seeded
7. All indexes created for query performance

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

030_DB_Calendar — Calendar tables
029_API_Task_Manager — FastAPI endpoints for tasks
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
