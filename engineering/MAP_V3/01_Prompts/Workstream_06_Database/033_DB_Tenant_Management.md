MAP Nexus™ Enterprise Platform
Prompt 033
Database Schema — Tenant Management

Version: 1.0

Prompt ID: 033

Workstream: 06 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management
032_DB_Role_Management

---

Purpose

Create the database schema for Tenant Management in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support multi-tenant management, tenant configuration, and tenant lifecycle.

---

Objective

Create a tenant management schema capable of:

Tenant Accounts — Store tenant information
Tenant Configuration — Per-tenant settings and branding
Tenant Hierarchy — Parent-child tenant relationships
Organisation Structure — Organisations, departments, projects
Audit Trail — Log tenant changes

---

Database

Database: map_nexus
Schema: platform

---

SQL Scripts

### Table: platform.tenants (Enhanced)

```sql
-- Note: This table may already exist in core schema
-- This creates a platform-level tenant table with additional fields

CREATE TABLE IF NOT EXISTS platform.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended', 'provisioning', 'deprovisioning', 'archived')),
    tier VARCHAR(50) NOT NULL DEFAULT 'free'
        CHECK (tier IN ('free', 'starter', 'professional', 'enterprise', 'custom')),
    parent_id UUID REFERENCES platform.tenants(id),
    contact_email VARCHAR(255),
    contact_name VARCHAR(200),
    website VARCHAR(500),
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#10B981',
    custom_css TEXT,
    login_message TEXT,
    footer_text TEXT,
    max_users INTEGER DEFAULT 10,
    max_storage_gb INTEGER DEFAULT 10,
    max_api_calls INTEGER DEFAULT 10000,
    max_projects INTEGER DEFAULT 5,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_tenants_slug ON platform.tenants (slug);
CREATE INDEX idx_tenants_status ON platform.tenants (status);
CREATE INDEX idx_tenants_tier ON platform.tenants (tier);
CREATE INDEX idx_tenants_parent_id ON platform.tenants (parent_id);
CREATE INDEX idx_tenants_created_at ON platform.tenants (created_at);
CREATE INDEX idx_tenants_deleted_at ON platform.tenants (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.tenants IS 'Multi-tenant accounts';
COMMENT ON COLUMN platform.tenants.tier IS 'Subscription tier';
COMMENT ON COLUMN platform.tenants.slug IS 'URL-safe unique identifier';
```

---

### Table: platform.organisations

```sql
CREATE TABLE platform.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'archived')),
    parent_id UUID REFERENCES platform.organisations(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_organisations_tenant_id ON platform.organisations (tenant_id);
CREATE INDEX idx_organisations_status ON platform.organisations (status);
CREATE INDEX idx_organisations_parent_id ON platform.organisations (parent_id);
CREATE INDEX idx_organisations_deleted_at ON platform.organisations (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.organisations IS 'Tenant organisations/business units';
```

---

### Table: platform.departments

```sql
CREATE TABLE platform.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES platform.organisations(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'archived')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_departments_organisation_id ON platform.departments (organisation_id);
CREATE INDEX idx_departments_status ON platform.departments (status);
CREATE INDEX idx_departments_deleted_at ON platform.departments (deleted_at) WHERE deleted_at IS NOT NULL;

-- Comments
COMMENT ON TABLE platform.departments IS 'Organisation departments';
```

---

### Table: platform.tenant_configurations

```sql
CREATE TABLE platform.tenant_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    key VARCHAR(200) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    UNIQUE(tenant_id, category, key)
);

-- Indexes
CREATE INDEX idx_tenant_configurations_tenant_id ON platform.tenant_configurations (tenant_id);
CREATE INDEX idx_tenant_configurations_category ON platform.tenant_configurations (category);
CREATE INDEX idx_tenant_configurations_key ON platform.tenant_configurations (key);

-- Comments
COMMENT ON TABLE platform.tenant_configurations IS 'Per-tenant configuration settings';
```

---

### Table: platform.tenant_features

```sql
CREATE TABLE platform.tenant_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id) ON DELETE CASCADE,
    feature_key VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, feature_key)
);

-- Indexes
CREATE INDEX idx_tenant_features_tenant_id ON platform.tenant_features (tenant_id);
CREATE INDEX idx_tenant_features_feature_key ON platform.tenant_features (feature_key);
CREATE INDEX idx_tenant_features_enabled ON platform.tenant_features (enabled);

-- Comments
COMMENT ON TABLE platform.tenant_features IS 'Per-tenant feature toggles';
```

---

### Table: platform.tenant_usage

```sql
CREATE TABLE platform.tenant_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, metric_name, period_start)
);

-- Indexes
CREATE INDEX idx_tenant_usage_tenant_id ON platform.tenant_usage (tenant_id);
CREATE INDEX idx_tenant_usage_metric_name ON platform.tenant_usage (metric_name);
CREATE INDEX idx_tenant_usage_period ON platform.tenant_usage (period_start, period_end);

-- Comments
COMMENT ON TABLE platform.tenant_usage IS 'Tenant usage metrics per period';
```

---

### Table: platform.tenant_audit_log

```sql
CREATE TABLE platform.tenant_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    changes JSONB DEFAULT '{}',
    performed_by UUID NOT NULL REFERENCES platform.users(id),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenant_audit_log_tenant_id ON platform.tenant_audit_log (tenant_id);
CREATE INDEX idx_tenant_audit_log_action ON platform.tenant_audit_log (action);
CREATE INDEX idx_tenant_audit_log_performed_by ON platform.tenant_audit_log (performed_by);
CREATE INDEX idx_tenant_audit_log_created_at ON platform.tenant_audit_log (created_at);

-- Comments
COMMENT ON TABLE platform.tenant_audit_log IS 'Audit trail for tenant changes';
```

---

### Seed Data

```sql
-- Default tenant
INSERT INTO platform.tenants (
    id,
    name,
    slug,
    description,
    status,
    tier,
    contact_email,
    max_users,
    metadata
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Tenant',
    'default',
    'Default tenant for MAP Nexus',
    'active',
    'enterprise',
    'admin@mapnexus.com',
    1000,
    '{"isDefault": true}'
);

-- Default organisation
INSERT INTO platform.organisations (
    tenant_id,
    name,
    description,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Organisation',
    'Default organisation',
    'active'
);

-- Default department
INSERT INTO platform.departments (
    organisation_id,
    name,
    description,
    status
) VALUES (
    (SELECT id FROM platform.organisations WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
    'Engineering',
    'Engineering department',
    'active'
);
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tenants TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.organisations TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.departments TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tenant_configurations TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tenant_features TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tenant_usage TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.tenant_audit_log TO map_nexus_app;
```

---

Acceptance Criteria

1. platform.tenants table created with branding and limits
2. platform.organisations table created with hierarchy
3. platform.departments table created
4. platform.tenant_configurations table created for settings
5. platform.tenant_features table created for feature toggles
6. platform.tenant_usage table created for metrics
7. platform.tenant_audit_log table created
8. Default tenant seeded
9. Default organisation and department seeded
10. All indexes created for query performance

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

034_DB_Subscription_Management — Subscription tables
038_Tenant_API — FastAPI endpoints for tenant management
043_Tenant_Management_UI — React frontend for tenant management

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
