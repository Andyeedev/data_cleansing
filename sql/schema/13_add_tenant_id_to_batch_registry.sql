-- ============================================================
-- Migration: Add tenant_id to migration_batch_registry
-- Purpose: Track which tenant owns each batch for tenant isolation
-- ============================================================

ALTER TABLE engine.migration_batch_registry
ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_batch_registry_tenant_id
ON engine.migration_batch_registry(tenant_id);

COMMENT ON COLUMN engine.migration_batch_registry.tenant_id
IS 'Tenant that owns this batch. Used for tenant isolation.';
