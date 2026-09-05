MAP Nexus™ Enterprise Platform
Prompt 032
Database Schema — Role Management

Version: 1.0

Prompt ID: 032

Workstream: 06 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for Role Management in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support role-based access control (RBAC), permissions, and role hierarchy.

---

Objective

Create a role management schema capable of:

Role Definitions — Store role information
Permission Management — Map roles to permissions
Role Hierarchy — Support parent-child role relationships
Role Assignment — Assign roles to users
Audit Trail — Log role changes

---

Database

Database: map_nexus
Schema: platform

---

SQL Scripts

### Table: platform.roles

```sql
CREATE TABLE platform.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'custom'
        CHECK (type IN ('system', 'custom', 'template', 'virtual')),
    parent_id UUID REFERENCES platform.roles(id),
    level INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'deprecated', 'draft')),
    tenant_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(name, tenant_id)
);

-- Indexes
CREATE INDEX idx_roles_tenant_id ON platform.roles (tenant_id);
CREATE INDEX idx_roles_parent_id ON platform.roles (parent_id);
CREATE INDEX idx_roles_type ON platform.roles (type);
CREATE INDEX idx_roles_status ON platform.roles (status);
CREATE INDEX idx_roles_name ON platform.roles (name);
CREATE INDEX idx_roles_deleted_at ON platform.roles (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.roles IS 'RBAC role definitions';
COMMENT ON COLUMN platform.roles.type IS 'Role type: system, custom, template, virtual';
COMMENT ON COLUMN platform.roles.parent_id IS 'Parent role for hierarchy';
COMMENT ON COLUMN platform.roles.level IS 'Depth level in role hierarchy';
```

---

### Table: platform.permissions

```sql
CREATE TABLE platform.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL
        CHECK (action IN ('create', 'read', 'update', 'delete', 'execute', 'approve', 'export', 'import')),
    category VARCHAR(100),
    is_system BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_permissions_resource ON platform.permissions (resource);
CREATE INDEX idx_permissions_action ON platform.permissions (action);
CREATE INDEX idx_permissions_category ON platform.permissions (category);
CREATE INDEX idx_permissions_name ON platform.permissions (name);

-- Comments
COMMENT ON TABLE platform.permissions IS 'Permission definitions for RBAC';
COMMENT ON COLUMN platform.permissions.resource IS 'Resource the permission applies to';
COMMENT ON COLUMN platform.permissions.action IS 'Action type: create, read, update, delete, etc.';
```

---

### Table: platform.role_permissions (Junction)

```sql
CREATE TABLE platform.role_permissions (
    role_id UUID NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES platform.permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT TRUE,
    conditions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- Indexes
CREATE INDEX idx_role_permissions_role_id ON platform.role_permissions (role_id);
CREATE INDEX idx_role_permissions_permission_id ON platform.role_permissions (permission_id);

-- Comments
COMMENT ON TABLE platform.role_permissions IS 'Many-to-many role-permission mapping';
```

---

### Table: platform.user_roles (Junction)

```sql
CREATE TABLE platform.user_roles (
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES platform.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_temporary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes
CREATE INDEX idx_user_roles_user_id ON platform.user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON platform.user_roles (role_id);
CREATE INDEX idx_user_roles_expires_at ON platform.user_roles (expires_at);

-- Comments
COMMENT ON TABLE platform.user_roles IS 'Many-to-many user-role assignment';
```

---

### Table: platform.role_templates

```sql
CREATE TABLE platform.role_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    permissions JSONB DEFAULT '[]',
    usage_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_role_templates_category ON platform.role_templates (category);
CREATE INDEX idx_role_templates_tenant_id ON platform.role_templates (tenant_id);
CREATE INDEX idx_role_templates_is_public ON platform.role_templates (is_public);

-- Comments
COMMENT ON TABLE platform.role_templates IS 'Predefined role templates';
```

---

### Table: platform.role_audit_log

```sql
CREATE TABLE platform.role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES platform.roles(id),
    action VARCHAR(50) NOT NULL,
    changes JSONB DEFAULT '{}',
    performed_by UUID NOT NULL REFERENCES platform.users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_role_audit_log_role_id ON platform.role_audit_log (role_id);
CREATE INDEX idx_role_audit_log_performed_by ON platform.role_audit_log (performed_by);
CREATE INDEX idx_role_audit_log_created_at ON platform.role_audit_log (created_at);

-- Comments
COMMENT ON TABLE platform.role_audit_log IS 'Audit trail for role changes';
```

---

### Seed Data

```sql
-- System permissions
INSERT INTO platform.permissions (name, resource, action, category, is_system) VALUES
('users.create', 'users', 'create', 'User Management', TRUE),
('users.read', 'users', 'read', 'User Management', TRUE),
('users.update', 'users', 'update', 'User Management', TRUE),
('users.delete', 'users', 'delete', 'User Management', TRUE),
('roles.create', 'roles', 'create', 'Role Management', TRUE),
('roles.read', 'roles', 'read', 'Role Management', TRUE),
('roles.update', 'roles', 'update', 'Role Management', TRUE),
('roles.delete', 'roles', 'delete', 'Role Management', TRUE),
('tenants.create', 'tenants', 'create', 'Tenant Management', TRUE),
('tenants.read', 'tenants', 'read', 'Tenant Management', TRUE),
('tenants.update', 'tenants', 'update', 'Tenant Management', TRUE),
('tenants.delete', 'tenants', 'delete', 'Tenant Management', TRUE),
('settings.read', 'settings', 'read', 'System Settings', TRUE),
('settings.update', 'settings', 'update', 'System Settings', TRUE),
('reports.read', 'reports', 'read', 'Reporting', TRUE),
('reports.export', 'reports', 'export', 'Reporting', TRUE),
('ai.chat', 'ai', 'execute', 'AI Platform', TRUE),
('ai.insights', 'ai', 'read', 'AI Platform', TRUE);

-- System roles
INSERT INTO platform.roles (id, name, description, type, is_system, status, tenant_id) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'Full system access', 'system', TRUE, 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', 'Tenant Admin', 'Tenant administrator', 'system', TRUE, 'active', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'User', 'Standard user', 'system', TRUE, 'active', '00000000-0000-0000-0000-000000000001');

-- Assign all permissions to Super Admin
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT '00000000-0000-0000-0000-000000000001', id, TRUE
FROM platform.permissions;

-- Assign read permissions to User role
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT '00000000-0000-0000-0000-000000000003', id, TRUE
FROM platform.permissions WHERE action = 'read';
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.roles TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.permissions TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.role_permissions TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.user_roles TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.role_templates TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.role_audit_log TO map_nexus_app;
```

---

Acceptance Criteria

1. platform.roles table created with hierarchy support
2. platform.permissions table created with resource/action model
3. platform.role_permissions junction table created
4. platform.user_roles junction table created
5. platform.role_templates table created
6. platform.role_audit_log table created
7. System permissions seeded (18 permissions)
8. System roles seeded (Super Admin, Tenant Admin, User)
9. All indexes created for query performance
10. Foreign key constraints enforce referential integrity

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

033_DB_Tenant_Management — Tenant tables
037_Role_API — FastAPI endpoints for role management
042_Role_Management_UI — React frontend for role management

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
