MAP Nexus™ Enterprise Platform
Prompt 028
Database Schema — Notifications

Version: 1.0

Prompt ID: 028

Workstream: 05 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for Notifications in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables required to support in-app notifications, notification preferences, and notification history.

---

Database

Database: migration_engine
Schema: platform

---

SQL Scripts

### Table: platform.notifications

```sql
CREATE TABLE platform.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('info', 'warning', 'success', 'error', 'system', 'approval', 'task', 'workflow')),
    title VARCHAR(500) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    source VARCHAR(100),
    source_id UUID,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON platform.notifications (user_id);
CREATE INDEX idx_notifications_tenant_id ON platform.notifications (tenant_id);
CREATE INDEX idx_notifications_type ON platform.notifications (type);
CREATE INDEX idx_notifications_read ON platform.notifications (read);
CREATE INDEX idx_notifications_created_at ON platform.notifications (created_at);

-- Comments
COMMENT ON TABLE platform.notifications IS 'User notifications';
COMMENT ON COLUMN platform.notifications.source IS 'Source module that created notification';
COMMENT ON COLUMN platform.notifications.source_id IS 'ID of the source entity';
```

---

### Table: platform.notification_preferences

```sql
CREATE TABLE platform.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL
        CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
    enabled BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(50) DEFAULT 'immediate'
        CHECK (frequency IN ('immediate', 'hourly', 'daily', 'weekly', 'never')),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, channel)
);

-- Indexes
CREATE INDEX idx_notification_preferences_user_id ON platform.notification_preferences (user_id);
CREATE INDEX idx_notification_preferences_category ON platform.notification_preferences (category);
CREATE INDEX idx_notification_preferences_channel ON platform.notification_preferences (channel);

-- Comments
COMMENT ON TABLE platform.notification_preferences IS 'User notification preferences';
```

---

### Table: platform.notification_templates

```sql
CREATE TABLE platform.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(500),
    body_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    tenant_id UUID,
    is_system BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notification_templates_name ON platform.notification_templates (name);
CREATE INDEX idx_notification_templates_type ON platform.notification_templates (type);
CREATE INDEX idx_notification_templates_channel ON platform.notification_templates (channel);
CREATE INDEX idx_notification_templates_tenant_id ON platform.notification_templates (tenant_id);

-- Comments
COMMENT ON TABLE platform.notification_templates IS 'Notification message templates';
```

---

### Table: platform.notification_log

```sql
CREATE TABLE platform.notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES platform.notifications(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_notification_log_notification_id ON platform.notification_log (notification_id);
CREATE INDEX idx_notification_log_user_id ON platform.notification_log (user_id);
CREATE INDEX idx_notification_log_channel ON platform.notification_log (channel);
CREATE INDEX idx_notification_log_status ON platform.notification_log (status);
CREATE INDEX idx_notification_log_sent_at ON platform.notification_log (sent_at);

-- Comments
COMMENT ON TABLE platform.notification_log IS 'Notification delivery log';
```

---

### Seed Data

```sql
-- Default notification templates
INSERT INTO platform.notification_templates (name, type, channel, subject, body_template, variables, is_system) VALUES
('user_created', 'system', 'email', 'Welcome to MAP Nexus', 'Hello {{firstName}}, your account has been created.', '["firstName", "email"]', TRUE),
('role_changed', 'system', 'in_app', 'Role Updated', 'Your role has been updated to {{roleName}}.', '["roleName"]', TRUE),
('approval_required', 'approval', 'in_app', 'Approval Required', 'You have a pending approval: {{title}}.', '["title", "requestedBy"]', TRUE),
('approval_decided', 'approval', 'email', 'Approval Decision', 'Your request "{{title}}" has been {{decision}}.', '["title", "decision"]', TRUE),
('task_assigned', 'task', 'in_app', 'Task Assigned', 'You have been assigned a task: {{taskTitle}}.', '["taskTitle", "assignedBy"]', TRUE),
('task_completed', 'task', 'in_app', 'Task Completed', 'Task "{{taskTitle}}" has been completed.', '["taskTitle"]', TRUE),
('workflow_started', 'workflow', 'in_app', 'Workflow Started', 'Workflow "{{workflowName}}" has been started.', '["workflowName"]', TRUE),
('workflow_completed', 'workflow', 'email', 'Workflow Completed', 'Workflow "{{workflowName}}" completed successfully.', '["workflowName"]', TRUE),
('subscription_expiring', 'system', 'email', 'Subscription Expiring', 'Your subscription expires in {{daysLeft}} days.', '["daysLeft", "planName"]', TRUE),
('maintenance_scheduled', 'system', 'in_app', 'Maintenance Scheduled', 'Maintenance scheduled for {{startTime}}.', '["startTime", "endTime"]', TRUE);

-- Default notification preferences for user
INSERT INTO platform.notification_preferences (user_id, category, channel, enabled, frequency)
SELECT id, 'approval', 'in_app', TRUE, 'immediate'
FROM platform.users WHERE email = 'admin@mapnexus.com';

INSERT INTO platform.notification_preferences (user_id, category, channel, enabled, frequency)
SELECT id, 'task', 'in_app', TRUE, 'immediate'
FROM platform.users WHERE email = 'admin@mapnexus.com';

INSERT INTO platform.notification_preferences (user_id, category, channel, enabled, frequency)
SELECT id, 'workflow', 'in_app', TRUE, 'immediate'
FROM platform.users WHERE email = 'admin@mapnexus.com';

INSERT INTO platform.notification_preferences (user_id, category, channel, enabled, frequency)
SELECT id, 'system', 'email', TRUE, 'daily'
FROM platform.users WHERE email = 'admin@mapnexus.com';
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.notifications TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.notification_preferences TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.notification_templates TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.notification_log TO migration_engine_app;
```

---

Acceptance Criteria

1. platform.notifications table created
2. platform.notification_preferences table created
3. platform.notification_templates table created
4. platform.notification_log table created
5. Default templates seeded (10 templates)
6. Default preferences seeded for admin user
7. All indexes created for query performance

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

029_DB_Task_Manager — Task tables
028_API_Notifications — FastAPI endpoints for notifications
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
