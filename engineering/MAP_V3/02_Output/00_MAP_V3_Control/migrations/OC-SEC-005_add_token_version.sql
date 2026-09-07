-- OC-SEC-005: Add token_version column for session invalidation on password change
-- This column tracks the token version; when incremented, all existing JWTs are invalidated.

ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS token_version INTEGER DEFAULT 0;

COMMENT ON COLUMN platform.users.token_version IS 'Monotonic version counter. Incremented on password change to invalidate all existing JWTs.';
