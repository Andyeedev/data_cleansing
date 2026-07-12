MAP Nexus™ Enterprise Platform
Prompt 031
Database Schema — User Management

Version: 1.0

Prompt ID: 031

Workstream: 06 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

Prompt 000 — Prepare Development Environment

---

Purpose

Create the database schema for User Management in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support user accounts, authentication, and user lifecycle management.

---

Objective

Create a user management schema capable of:

User Accounts — Store user profile information
Authentication — Support JWT tokens and refresh tokens
User Status — Track user lifecycle states
Audit Trail — Log user activity and changes
Multi-tenant — Scope users to tenants

---

Database

Database: map_nexus
Schema: platform

---

SQL Scripts

### Table: platform.users

```sql
CREATE TABLE platform.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    avatar_url TEXT,
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('active', 'inactive', 'suspended', 'pending', 'locked', 'deactivated')),
    tenant_id UUID NOT NULL,
    organisation_id UUID,
    department_id UUID,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON platform.users (email);
CREATE INDEX idx_users_tenant_id ON platform.users (tenant_id);
CREATE INDEX idx_users_status ON platform.users (status);
CREATE INDEX idx_users_organisation_id ON platform.users (organisation_id);
CREATE INDEX idx_users_created_at ON platform.users (created_at);
CREATE INDEX idx_users_deleted_at ON platform.users (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.users IS 'Platform user accounts';
COMMENT ON COLUMN platform.users.status IS 'User lifecycle status';
COMMENT ON COLUMN platform.users.mfa_enabled IS 'Multi-factor authentication enabled';
COMMENT ON COLUMN platform.users.metadata IS 'Extensible user metadata as JSON';
```

---

### Table: platform.refresh_tokens

```sql
CREATE TABLE platform.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON platform.refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON platform.refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON platform.refresh_tokens (expires_at);

-- Comments
COMMENT ON TABLE platform.refresh_tokens IS 'JWT refresh token storage';
```

---

### Table: platform.user_sessions

```sql
CREATE TABLE platform.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON platform.user_sessions (user_id);
CREATE INDEX idx_user_sessions_is_active ON platform.user_sessions (is_active);
CREATE INDEX idx_user_sessions_expires_at ON platform.user_sessions (expires_at);

-- Comments
COMMENT ON TABLE platform.user_sessions IS 'Active user sessions';
```

---

### Table: platform.user_activity_log

```sql
CREATE TABLE platform.user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_activity_log_user_id ON platform.user_activity_log (user_id);
CREATE INDEX idx_user_activity_log_action ON platform.user_activity_log (action);
CREATE INDEX idx_user_activity_log_created_at ON platform.user_activity_log (created_at);
CREATE INDEX idx_user_activity_log_resource ON platform.user_activity_log (resource_type, resource_id);

-- Comments
COMMENT ON TABLE platform.user_activity_log IS 'User activity audit trail';
```

---

### Table: platform.user_invitations

```sql
CREATE TABLE platform.user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    tenant_id UUID NOT NULL,
    invited_by UUID NOT NULL REFERENCES platform.users(id),
    role_id UUID,
    token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_invitations_email ON platform.user_invitations (email);
CREATE INDEX idx_user_invitations_token ON platform.user_invitations (token);
CREATE INDEX idx_user_invitations_tenant_id ON platform.user_invitations (tenant_id);
CREATE INDEX idx_user_invitations_status ON platform.user_invitations (status);

-- Comments
COMMENT ON TABLE platform.user_invitations IS 'Pending user invitations';
```

---

### Function: update_updated_at

```sql
CREATE OR REPLACE FUNCTION platform.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON platform.users
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();
```

---

### Seed Data

```sql
-- Default admin user (password: Admin123!@#)
INSERT INTO platform.users (
    email,
    email_verified,
    password_hash,
    first_name,
    last_name,
    display_name,
    status,
    tenant_id,
    metadata
) VALUES (
    'admin@mapnexus.com',
    TRUE,
    '$2b$12$LJ3m4ys3Lk0TSwHjnF4oR.K3Z5y7rCjXqZ5y7rCjXqZ5y7rCjXqZ',
    'System',
    'Administrator',
    'System Administrator',
    'active',
    '00000000-0000-0000-0000-000000000001',
    '{"isSystemAdmin": true}'
);
```

---

### Grant Permissions

```sql
-- Grant permissions to application role
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.users TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.refresh_tokens TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.user_sessions TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.user_activity_log TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.user_invitations TO map_nexus_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA platform TO map_nexus_app;
```

---

Acceptance Criteria

1. platform.users table created with all required columns
2. platform.refresh_tokens table created for JWT management
3. platform.user_sessions table created for session tracking
4. platform.user_activity_log table created for audit trail
5. platform.user_invitations table created for user provisioning
6. All indexes created for query performance
7. Foreign key constraints enforce referential integrity
8. Check constraints validate status values
9. Trigger auto-updates updated_at timestamp
10. Default admin user seeded

---

Dependencies

PostgreSQL database server
platform schema created
map_nexus_app role created

---

Next Steps

After this prompt, implement:

032_DB_Role_Management — Role and permission tables
036_User_API — FastAPI endpoints for user management
041_User_Management_UI — React frontend for user management

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
