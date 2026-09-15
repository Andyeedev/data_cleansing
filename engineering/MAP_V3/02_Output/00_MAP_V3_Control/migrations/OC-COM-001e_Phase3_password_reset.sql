-- OC-COM-001e Phase 3 — Password Reset Migration
-- Creates platform.password_resets table

BEGIN;

-- =====================================================
-- PASSWORD RESETS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform.password_resets (
    reset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON platform.password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON platform.password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON platform.password_resets(expires_at);

COMMIT;