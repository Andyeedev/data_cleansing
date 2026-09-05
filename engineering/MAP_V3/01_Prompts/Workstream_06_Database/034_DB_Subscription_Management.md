MAP Nexus™ Enterprise Platform
Prompt 034
Database Schema — Subscription Management

Version: 1.0

Prompt ID: 034

Workstream: 06 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

033_DB_Tenant_Management

---

Purpose

Create the database schema for Subscription Management in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support subscription plans, billing, invoicing, and license management.

---

Objective

Create a subscription management schema capable of:

Plan Definitions — Store subscription plans
Subscriptions — Track tenant subscriptions
Billing — Manage invoices and payments
Usage Tracking — Monitor feature usage
License Management — License key generation and validation

---

Database

Database: map_nexus
Schema: platform

---

SQL Scripts

### Table: platform.plans

```sql
CREATE TABLE platform.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('free', 'starter', 'professional', 'enterprise', 'custom')),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'deprecated', 'draft')),
    monthly_price NUMERIC(10,2) DEFAULT 0,
    annual_price NUMERIC(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    trial_days INTEGER DEFAULT 0,
    setup_fee NUMERIC(10,2) DEFAULT 0,
    max_users INTEGER,
    max_storage_gb INTEGER,
    max_api_calls INTEGER,
    max_projects INTEGER,
    features JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_plans_type ON platform.plans (type);
CREATE INDEX idx_plans_status ON platform.plans (status);
CREATE INDEX idx_plans_is_public ON platform.plans (is_public);

-- Comments
COMMENT ON TABLE platform.plans IS 'Subscription plan definitions';
```

---

### Table: platform.subscriptions

```sql
CREATE TABLE platform.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    plan_id UUID NOT NULL REFERENCES platform.plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'trialing', 'past_due', 'paused', 'canceled', 'expired', 'pending')),
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly'
        CHECK (billing_cycle IN ('monthly', 'quarterly', 'annually', 'one_time')),
    quantity INTEGER DEFAULT 1,
    discount_percent NUMERIC(5,2) DEFAULT 0,
    monthly_amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    trial_end_date DATE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancel_reason TEXT,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Indexes
CREATE INDEX idx_subscriptions_tenant_id ON platform.subscriptions (tenant_id);
CREATE INDEX idx_subscriptions_plan_id ON platform.subscriptions (plan_id);
CREATE INDEX idx_subscriptions_status ON platform.subscriptions (status);
CREATE INDEX idx_subscriptions_next_billing_date ON platform.subscriptions (next_billing_date);
CREATE INDEX idx_subscriptions_trial_end_date ON platform.subscriptions (trial_end_date);

-- Comments
COMMENT ON TABLE platform.subscriptions IS 'Tenant subscriptions';
```

---

### Table: platform.invoices

```sql
CREATE TABLE platform.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES platform.subscriptions(id),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'canceled', 'refunded')),
    amount NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_invoices_subscription_id ON platform.invoices (subscription_id);
CREATE INDEX idx_invoices_tenant_id ON platform.invoices (tenant_id);
CREATE INDEX idx_invoices_status ON platform.invoices (status);
CREATE INDEX idx_invoices_due_date ON platform.invoices (due_date);
CREATE INDEX idx_invoices_invoice_number ON platform.invoices (invoice_number);

-- Comments
COMMENT ON TABLE platform.invoices IS 'Subscription invoices';
```

---

### Table: platform.invoice_items

```sql
CREATE TABLE platform.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES platform.invoices(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    quantity NUMERIC(10,2) DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    tax_rate NUMERIC(5,2) DEFAULT 0,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_invoice_items_invoice_id ON platform.invoice_items (invoice_id);

-- Comments
COMMENT ON TABLE platform.invoice_items IS 'Invoice line items';
```

---

### Table: platform.payment_methods

```sql
CREATE TABLE platform.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'invoice')),
    last_four VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    billing_name VARCHAR(200),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(2),
    token VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'expired')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_methods_tenant_id ON platform.payment_methods (tenant_id);
CREATE INDEX idx_payment_methods_is_default ON platform.payment_methods (is_default);
CREATE INDEX idx_payment_methods_status ON platform.payment_methods (status);

-- Comments
COMMENT ON TABLE platform.payment_methods IS 'Tenant payment methods';
```

---

### Table: platform.licenses

```sql
CREATE TABLE platform.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    subscription_id UUID NOT NULL REFERENCES platform.subscriptions(id),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    plan_id UUID NOT NULL REFERENCES platform.plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'revoked', 'pending')),
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_activations INTEGER DEFAULT 1,
    current_activations INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_licenses_key ON platform.licenses (key);
CREATE INDEX idx_licenses_subscription_id ON platform.licenses (subscription_id);
CREATE INDEX idx_licenses_tenant_id ON platform.licenses (tenant_id);
CREATE INDEX idx_licenses_status ON platform.licenses (status);

-- Comments
COMMENT ON TABLE platform.licenses IS 'License keys for activation';
```

---

### Table: platform.usage_records

```sql
CREATE TABLE platform.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    subscription_id UUID NOT NULL REFERENCES platform.subscriptions(id),
    feature_key VARCHAR(100) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'count',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_usage_records_tenant_id ON platform.usage_records (tenant_id);
CREATE INDEX idx_usage_records_subscription_id ON platform.usage_records (subscription_id);
CREATE INDEX idx_usage_records_feature_key ON platform.usage_records (feature_key);
CREATE INDEX idx_usage_records_recorded_at ON platform.usage_records (recorded_at);

-- Comments
COMMENT ON TABLE platform.usage_records IS 'Feature usage tracking';
```

---

### Seed Data

```sql
-- Plans
INSERT INTO platform.plans (id, name, description, type, monthly_price, annual_price, trial_days, max_users, max_storage_gb, features, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'Free', 'Free tier with basic features', 'free', 0, 0, 0, 5, 1, '["basic_reporting"]', 1),
('00000000-0000-0000-0000-000000000002', 'Starter', 'Starter plan for small teams', 'starter', 29, 290, 14, 25, 10, '["basic_reporting", "email_support", "api_access"]', 2),
('00000000-0000-0000-0000-000000000003', 'Professional', 'Professional plan for growing businesses', 'professional', 99, 990, 14, 100, 50, '["advanced_reporting", "priority_support", "api_access", "custom_branding"]', 3),
('00000000-0000-0000-0000-000000000004', 'Enterprise', 'Enterprise plan for large organisations', 'enterprise', 299, 2990, 30, 500, 200, '["all_features", "dedicated_support", "sla", "custom_integrations"]', 4);

-- Default subscription for default tenant
INSERT INTO platform.subscriptions (
    tenant_id,
    plan_id,
    status,
    billing_cycle,
    monthly_amount,
    start_date,
    next_billing_date
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'active',
    'monthly',
    299,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 month'
);
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.plans TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.subscriptions TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.invoices TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.invoice_items TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.payment_methods TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.licenses TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.usage_records TO map_nexus_app;
```

---

Acceptance Criteria

1. platform.plans table created with pricing and limits
2. platform.subscriptions table created with billing cycle
3. platform.invoices table created for billing
4. platform.invoice_items table created for line items
5. platform.payment_methods table created
6. platform.licenses table created
7. platform.usage_records table created
8. Plans seeded (Free, Starter, Professional, Enterprise)
9. Default subscription created for default tenant
10. All indexes created for query performance

---

Dependencies

033_DB_Tenant_Management (platform.tenants table)

---

Next Steps

After this prompt, implement:

035_DB_System_Settings — System settings tables
039_Subscription_API — FastAPI endpoints for subscription management
044_Subscription_UI — React frontend for subscription management

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
