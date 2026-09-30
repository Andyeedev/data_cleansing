-- OC-COM-001f — Add status column to core.leads table
-- Fixes missing core.leads.status column blocking lead-to-admin conversion flow

BEGIN;

-- Add status column to core.leads with default 'active'
ALTER TABLE core.leads
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active','inactive','converted','archived'));

-- Add index for status queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON core.leads(status);

COMMIT;