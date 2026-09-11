-- OC-COM-001d_Phase3: Add past_due and pending_cancellation to subscription status CHECK
-- Date: 2026-09-10
-- Depends: OC-COM-001a (platform.subscriptions)
--
-- Rationale:
--   past_due: Stripe sends this event when payment fails but subscription is in grace period.
--             Previously mapped to 'suspended' which immediately revoked entitlements.
--             Now stored natively so entitlements can be preserved during grace period.
--   pending_cancellation: User requested cancellation but subscription remains active until
--                         period end. Previously 'cancelled' was set immediately which
--                         incorrectly revoked entitlements before period end.
--
-- This migration replaces the CHECK constraint with an expanded version.

DO $$
BEGIN
    -- Drop the existing CHECK constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_status_check'
        AND conrelid = 'platform.subscriptions'::regclass
    ) THEN
        ALTER TABLE platform.subscriptions DROP CONSTRAINT subscriptions_status_check;
    END IF;

    -- Add the new CHECK constraint with all valid statuses
    ALTER TABLE platform.subscriptions
        ADD CONSTRAINT subscriptions_status_check
        CHECK (status IN ('active','trialing','past_due','pending_cancellation','suspended','cancelled','expired','pending'));

    RAISE NOTICE 'OC-COM-001d Phase 3: subscription status CHECK constraint updated with past_due, pending_cancellation';
END $$;

-- Document the lifecycle:
--   TRIALING -> ACTIVE (checkout completed)
--   ACTIVE -> PAST_DUE (payment failed, grace period)
--   PAST_DUE -> ACTIVE (invoice paid, recovery)
--   PAST_DUE -> SUSPENDED (grace period exceeded, entitlements revoked)
--   ACTIVE -> PENDING_CANCELLATION (user requested cancel_at_period_end)
--   PENDING_CANCELLATION -> CANCELLED (Stripe confirms deletion at period end)
--   ACTIVE -> CANCELLED (immediate cancellation or Stripe webhook)
--   Any -> EXPIRED (end_date passed)
--   Any -> PENDING (initial state before checkout)
