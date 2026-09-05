MAP Nexus™ Enterprise Platform
Prompt 030
Database Schema — Calendar

Version: 1.0

Prompt ID: 030

Workstream: 05 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for Calendar in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables required to support scheduled events, maintenance windows, deadlines, and reminders.

---

Database

Database: migration_engine
Schema: platform

---

SQL Scripts

### Table: platform.calendar_events

```sql
CREATE TABLE platform.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('meeting', 'maintenance', 'deadline', 'reminder', 'task', 'custom')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    all_day BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    recurrence_rule TEXT,
    recurrence_end DATE,
    location VARCHAR(500),
    meeting_url VARCHAR(500),
    tenant_id UUID NOT NULL,
    created_by UUID NOT NULL REFERENCES platform.users(id),
    workflow_instance_id UUID REFERENCES platform.workflow_instances(id),
    task_id UUID REFERENCES platform.tasks(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_calendar_events_tenant_id ON platform.calendar_events (tenant_id);
CREATE INDEX idx_calendar_events_type ON platform.calendar_events (type);
CREATE INDEX idx_calendar_events_status ON platform.calendar_events (status);
CREATE INDEX idx_calendar_events_start_time ON platform.calendar_events (start_time);
CREATE INDEX idx_calendar_events_end_time ON platform.calendar_events (end_time);
CREATE INDEX idx_calendar_events_created_by ON platform.calendar_events (created_by);
CREATE INDEX idx_calendar_events_deleted_at ON platform.calendar_events (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.calendar_events IS 'Calendar events and scheduled items';
```

---

### Table: platform.calendar_event_attendees

```sql
CREATE TABLE platform.calendar_event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES platform.calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    status VARCHAR(50) DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'tentative')),
    role VARCHAR(50) DEFAULT 'attendee'
        CHECK (role IN ('organizer', 'required', 'optional')),
    response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_calendar_event_attendees_event_id ON platform.calendar_event_attendees (event_id);
CREATE INDEX idx_calendar_event_attendees_user_id ON platform.calendar_event_attendees (user_id);
CREATE INDEX idx_calendar_event_attendees_status ON platform.calendar_event_attendees (status);

-- Comments
COMMENT ON TABLE platform.calendar_event_attendees IS 'Event attendee invitations';
```

---

### Table: platform.calendar_reminders

```sql
CREATE TABLE platform.calendar_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES platform.calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    minutes_before INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('notification', 'email', 'sms')),
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_calendar_reminders_event_id ON platform.calendar_reminders (event_id);
CREATE INDEX idx_calendar_reminders_user_id ON platform.calendar_reminders (user_id);
CREATE INDEX idx_calendar_reminders_sent ON platform.calendar_reminders (sent);

-- Comments
COMMENT ON TABLE platform.calendar_reminders IS 'Event reminder notifications';
```

---

### Table: platform.calendar_views

```sql
CREATE TABLE platform.calendar_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    view_type VARCHAR(50) NOT NULL
        CHECK (view_type IN ('day', 'week', 'month', 'year', 'custom')),
    visible_types JSONB DEFAULT '["meeting", "maintenance", "deadline", "reminder", "task"]',
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_calendar_views_user_id ON platform.calendar_views (user_id);
CREATE INDEX idx_calendar_views_is_default ON platform.calendar_views (is_default);

-- Comments
COMMENT ON TABLE platform.calendar_views IS 'User calendar view preferences';
```

---

### Seed Data

```sql
-- Default calendar view for admin
INSERT INTO platform.calendar_views (user_id, name, view_type, is_default)
SELECT id, 'Default', 'month', TRUE
FROM platform.users WHERE email = 'admin@mapnexus.com';

-- Sample maintenance window
INSERT INTO platform.calendar_events (title, description, type, status, start_time, end_time, tenant_id, created_by, location)
VALUES (
    'Scheduled Maintenance',
    'Platform maintenance window for database optimization',
    'maintenance',
    'scheduled',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM platform.users WHERE email = 'admin@mapnexus.com' LIMIT 1),
    'Production Environment'
);
```

---

### Trigger: update_updated_at

```sql
CREATE TRIGGER trigger_calendar_events_updated_at
    BEFORE UPDATE ON platform.calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();

CREATE TRIGGER trigger_calendar_views_updated_at
    BEFORE UPDATE ON platform.calendar_views
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.calendar_events TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.calendar_event_attendees TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.calendar_reminders TO migration_engine_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.calendar_views TO migration_engine_app;
```

---

Acceptance Criteria

1. platform.calendar_events table created with recurrence support
2. platform.calendar_event_attendees table created
3. platform.calendar_reminders table created
4. platform.calendar_views table created for user preferences
5. Default calendar view seeded
6. Sample maintenance window seeded
7. All indexes created for query performance
8. Triggers auto-update timestamps

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

030_API_Calendar — FastAPI endpoints for calendar
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
