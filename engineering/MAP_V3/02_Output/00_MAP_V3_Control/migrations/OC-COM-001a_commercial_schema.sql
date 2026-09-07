-- OC-COM-001a: Commercial Schema — Plans, Subscriptions, Tenant Extensions
-- Date: 2026-09-07
-- Depends: core.tenants (UUID tenant_id PK)

-- =========================
-- 1. PLANS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS platform.plans (
    plan_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    tier            VARCHAR(50) NOT NULL
                    CHECK (tier IN ('professional','enterprise','enterprise_plus','government','msp','oem','foundation')),
    monthly_price   NUMERIC(10,2),
    annual_price    NUMERIC(10,2),
    entitlements    JSONB DEFAULT '{}',
    max_users       INTEGER DEFAULT 5,
    max_projects    INTEGER DEFAULT 3,
    max_connections  INTEGER DEFAULT 5,
    status          VARCHAR(50) DEFAULT 'active'
                    CHECK (status IN ('active','inactive','deprecated')),
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

COMMENT ON TABLE platform.plans IS 'Subscription plan definitions with entitlements and limits';

-- =========================
-- 2. SEED DEFAULT PLANS
-- =========================
INSERT INTO platform.plans (name, tier, annual_price, entitlements, max_users, max_projects, max_connections, description)
VALUES
    ('Professional', 'professional', 25000.00,
     '{"migration": true, "data_quality": true, "discovery": true, "reporting": "basic", "support": "standard"}',
     5, 3, 5, 'Standard plan for mid-size financial institutions'),
    ('Enterprise', 'enterprise', 75000.00,
     '{"migration": true, "data_quality": true, "discovery": true, "reporting": "advanced", "support": "priority", "compliance": true, "multi_project": true}',
     20, 10, 20, 'Full-featured plan for large enterprises'),
    ('Enterprise Plus', 'enterprise_plus', 200000.00,
     '{"migration": true, "data_quality": true, "discovery": true, "reporting": "advanced", "support": "dedicated", "compliance": true, "multi_project": true, "custom_integrations": true, "sla": true}',
     100, 50, 100, 'Premium plan with dedicated support and custom integrations')
ON CONFLICT DO NOTHING;

-- =========================
-- 3. SUBSCRIPTIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS platform.subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
    plan_id         UUID NOT NULL REFERENCES platform.plans(plan_id),
    status          VARCHAR(50) DEFAULT 'pending'
                    CHECK (status IN ('active','trialing','suspended','cancelled','expired','pending')),
    start_date      DATE,
    end_date        DATE,
    billing_cycle   VARCHAR(20) DEFAULT 'annual'
                    CHECK (billing_cycle IN ('monthly','annual','one_off')),
    trial_end_date  DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    created_by      UUID
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON platform.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON platform.subscriptions(status);

COMMENT ON TABLE platform.subscriptions IS 'Tenant subscription records linking tenants to plans';

-- =========================
-- 4. EXTEND core.tenants
-- =========================
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES platform.plans(plan_id);
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255);
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 5;
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS max_projects INTEGER DEFAULT 3;
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS max_connections INTEGER DEFAULT 5;
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

COMMENT ON COLUMN core.tenants.plan_id IS 'Current subscription plan';
COMMENT ON COLUMN core.tenants.billing_email IS 'Email for billing communications';
COMMENT ON COLUMN core.tenants.max_users IS 'Maximum users allowed under current plan';
COMMENT ON COLUMN core.tenants.max_projects IS 'Maximum projects allowed under current plan';
COMMENT ON COLUMN core.tenants.max_connections IS 'Maximum system connections allowed under current plan';
