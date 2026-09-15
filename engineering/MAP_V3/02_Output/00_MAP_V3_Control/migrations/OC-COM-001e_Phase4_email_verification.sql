-- OC-COM-001e Phase 4 — Email Verification Migration
-- Creates platform.email_verifications table and backfills existing users

BEGIN;

-- =====================================================
-- EMAIL VERIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform.email_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON platform.email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON platform.email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON platform.email_verifications(expires_at);

-- =====================================================
-- BACKFILL EXISTING USERS
-- =====================================================

-- One-time backfill: Set email_verified = TRUE for all existing active users
-- This preserves production access for users created before email verification existed
UPDATE platform.users
SET email_verified = TRUE
WHERE email_verified = FALSE
  AND status = 'active'
  AND deleted_at IS NULL;

COMMIT;