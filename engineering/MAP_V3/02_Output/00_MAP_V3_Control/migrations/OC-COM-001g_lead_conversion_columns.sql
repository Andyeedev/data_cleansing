-- OC-COM-001g — Lead conversion columns on core.leads
-- Reconciliation: Phase 5 minimum lead model (plan_interest, phone, status,
-- converted_to_tenant, converted_at). Approved remediation; supersedes the
-- partial OC-COM-001f (status column only, wrong default).
--
-- What this does (all idempotent, safe to re-run):
--   1. Adds plan_interest / phone / converted_to_tenant / converted_at.
--      converted_to_tenant references core.tenants(tenant_id).
--   2. Corrects the status default 'active' -> 'pending' (agreed model:
--      new leads enter the pending triage queue).
--   3. Extends the status CHECK with 'pending' (currently unwritable, which
--      blocks the entire pending -> converted machine).
-- Deliberately NOT included: backfill of pre-machine rows, 'rejected'
-- status (no producer/consumer), plan_tier column (interest string doubles
-- as the tier argument, validated by get_plan_by_tier at convert time).

BEGIN;

ALTER TABLE core.leads ADD COLUMN IF NOT EXISTS plan_interest TEXT;
ALTER TABLE core.leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE core.leads ADD COLUMN IF NOT EXISTS converted_to_tenant UUID REFERENCES core.tenants(tenant_id);
ALTER TABLE core.leads ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;

ALTER TABLE core.leads ALTER COLUMN status SET DEFAULT 'pending';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leads_status_check'
      AND pg_get_constraintdef(oid) LIKE '%pending%'
  ) THEN
    ALTER TABLE core.leads DROP CONSTRAINT IF EXISTS leads_status_check;
    ALTER TABLE core.leads ADD CONSTRAINT leads_status_check
      CHECK (status IN ('active', 'inactive', 'converted', 'archived', 'pending'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_status ON core.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_converted_to_tenant ON core.leads(converted_to_tenant);

COMMIT;
