-- OC-COM-001b: Stripe Columns on core.tenants
-- Date: 2026-09-07
-- Depends: OC-COM-001a (core.tenants extensions)

ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer_id ON core.tenants(stripe_customer_id);

COMMENT ON COLUMN core.tenants.stripe_customer_id IS 'Stripe Customer ID for billing integration';
COMMENT ON COLUMN core.tenants.stripe_subscription_id IS 'Stripe Subscription ID for active subscription';
