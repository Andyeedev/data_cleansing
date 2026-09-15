-- OC-COM-001e Phase 2 — Invitation System Migration
-- Creates platform.invitations table and adds invitation_id to platform.users

BEGIN;

-- =====================================================
-- INVITATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform.invitations (
    invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    invited_by UUID REFERENCES platform.users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_tenant_id ON platform.invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON platform.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON platform.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON platform.invitations(status);

-- Prevent duplicate pending invitations per tenant+email
CREATE UNIQUE INDEX IF NOT EXISTS uq_invitations_tenant_email_pending
    ON platform.invitations (tenant_id, email)
    WHERE status = 'pending';

-- =====================================================
-- USERS TABLE - ADD invitation_id COLUMN
-- =====================================================

ALTER TABLE platform.users
    ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES platform.invitations(invitation_id);

CREATE INDEX IF NOT EXISTS idx_users_invitation_id ON platform.users(invitation_id);

COMMIT;