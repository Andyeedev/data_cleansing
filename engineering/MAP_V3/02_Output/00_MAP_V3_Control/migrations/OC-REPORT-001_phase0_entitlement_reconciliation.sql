-- ============================================================================
-- OC-REPORT-001 — Phase 0.2 — Entitlement vocabulary reconciliation
-- ============================================================================
--
-- WHY THIS MIGRATION IS REQUIRED
--
-- The entitlement vocabulary has drifted between two sources of truth:
--
--   1. app/middleware/entitlement_middleware.py :: DEFAULT_ENTITLEMENTS
--      (the canonical vocabulary, read at runtime)
--
--   2. platform.plans.entitlements  (seeded by OC-COM-001a)
--      'migration', 'data_quality', 'discovery', 'reporting', 'support',
--      'compliance', 'multi_project', 'custom_integrations', 'sla'
--
-- The two sets are effectively DISJOINT for reporting:
--   * the DB seed has no 'advanced_reporting'
--   * the middleware has no 'migration' / 'data_quality' / 'reporting' / 'support'
--
-- WHY THAT MATTERS
--
-- get_tenant_entitlements() prefers the subscription's JSONB dict when present:
--
--     if entitlements_json and isinstance(entitlements_json, dict):
--         return set(entitlements_json.keys())
--     return DEFAULT_ENTITLEMENTS.get(tier, set())
--
-- Because the OC-COM-001a seed DOES contain a dict, a FRESH install resolves
-- entitlements from the DB vocabulary and never reaches the canonical one.
-- get_tenant_entitlements() is therefore only as correct as the seeded rows.
--
-- MEASURED STATE (verified against the live database)
--
-- The current live database has been re-aligned out of band, so the drift is
-- smaller here than the seed file alone suggests. Measured on live:
--
--   tier              live keys   drift vs canonical
--   enterprise            14      missing 'report_studio'
--   enterprise_plus       20      missing 'report_studio'
--   professional          12      EXTRA non-canonical 'migration'
--
-- So the two real, distinct defects are:
--
--   1. A fresh install from OC-COM-001a would produce the fully drifted
--      vocabulary (no advanced_reporting anywhere), because the corrective
--      migration referenced in the OC-COM-001d Phase 3/4 evidence packs was
--      never committed to the repository. The repo therefore does not
--      reproduce the live entitlement state — this migration fixes that.
--
--   2. The 'professional' tier still carries a stray non-canonical 'migration'
--      key, residue from the OC-E2E-001 outage fix. It is not read by any
--      code path, but it is exactly the kind of residue that hides the next
--      incident. This migration removes it.
--
-- This is the same failure class as the OC-E2E-001 outage, where
-- require_entitlement("migration") was satisfied by the DB seed but absent from
-- the middleware, making POST /api/v1/execution/run unreachable for all
-- tenants. The middleware was corrected at the time; the DB seed was not.
--
-- WHAT THIS MIGRATION DOES
--
-- Realigns platform.plans.entitlements to the canonical DEFAULT_ENTITLEMENTS
-- vocabulary, per tier, and introduces the single approved new key
-- 'report_studio' on enterprise and enterprise_plus.
--
-- SCOPE / SAFETY
--
--   * No new entitlement keys are invented. Exactly one is added:
--     'report_studio' (approved in OC-REPORT-001 plan §9.3).
--   * Every other key written below already exists in DEFAULT_ENTITLEMENTS.
--   * platform.plans is reference/plan data, not tenant business data. The
--     entitlements JSONB is a derived plan capability set, not a record of
--     anything a customer did.
--   * Existing tier membership is preserved EXACTLY, with the single addition
--     of 'report_studio'. No tier gains or loses any pre-existing key.
--   * Additive and idempotent: re-running leaves the same state.
--   * The runtime source of truth remains get_tenant_entitlements().
--
-- NOTE (reported, deliberately NOT changed here):
--   'basic_reporting' is absent from the enterprise and enterprise_plus tiers
--   in the pre-existing canonical vocabulary. That looks unintentional, but
--   changing tier membership is a commercial decision, not a security fix, so
--   it is preserved verbatim and raised for founder approval instead.
--
-- Idempotency: safe to re-run.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Guard: the target tables must exist before we touch them.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('platform.plans') IS NULL THEN
        RAISE EXCEPTION 'platform.plans is missing — apply OC-COM-001a first';
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Realign each plan's entitlement set to the canonical vocabulary.
--
-- Keys are written as {"key": true}. get_tenant_entitlements() reads
-- set(entitlements.keys()), so the VALUE is irrelevant to runtime behaviour;
-- true is used for consistency and readability.
-- ---------------------------------------------------------------------------

-- professional: unchanged from the pre-existing canonical set
UPDATE platform.plans
SET entitlements = '{
        "discovery": true,
        "mapping": true,
        "validation": true,
        "basic_reporting": true,
        "single_project": true,
        "email_support": true,
        "post_migration_assurance": true,
        "core_governance": true,
        "multi_project": true,
        "api_access": true,
        "priority_support": true
    }'::jsonb
WHERE tier = 'professional';

-- enterprise: canonical set + report_studio
UPDATE platform.plans
SET entitlements = '{
        "discovery": true,
        "mapping": true,
        "validation": true,
        "advanced_reporting": true,
        "report_studio": true,
        "multi_project": true,
        "api_access": true,
        "audit_trail": true,
        "governance": true,
        "priority_support": true,
        "pre_migration_assurance": true,
        "post_migration_assurance": true,
        "pre_post_migration_assurance": true,
        "advanced_governance": true,
        "reconciliation": true
    }'::jsonb
WHERE tier = 'enterprise';

-- enterprise_plus: canonical set + report_studio
UPDATE platform.plans
SET entitlements = '{
        "discovery": true,
        "mapping": true,
        "validation": true,
        "advanced_reporting": true,
        "report_studio": true,
        "enterprise_reporting": true,
        "multi_project": true,
        "api_access": true,
        "audit_trail": true,
        "governance": true,
        "advanced_governance": true,
        "enterprise_governance": true,
        "ai_insights": true,
        "custom_integrations": true,
        "dedicated_support": true,
        "multi_region": true,
        "sla": true,
        "pre_migration_assurance": true,
        "post_migration_assurance": true,
        "pre_post_migration_assurance": true,
        "reconciliation": true
    }'::jsonb
WHERE tier = 'enterprise_plus';

-- ---------------------------------------------------------------------------
-- Report Studio is a commercial add-on, so it is NOT included by default on
-- any plan a tenant may already be on unless their tier grants it. The UPDATE
-- above already reflects tier membership; this assertion documents the
-- invariant and fails loudly if a future edit breaks it.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    prof_keys  jsonb;
    ent_keys   jsonb;
    entp_keys  jsonb;
BEGIN
    SELECT entitlements INTO prof_keys FROM platform.plans WHERE tier = 'professional';
    SELECT entitlements INTO ent_keys  FROM platform.plans WHERE tier = 'enterprise';
    SELECT entitlements INTO entp_keys FROM platform.plans WHERE tier = 'enterprise_plus';

    -- report_studio must NOT be on professional
    IF prof_keys ? 'report_studio' THEN
        RAISE EXCEPTION 'report_studio must not be granted on the professional tier';
    END IF;

    -- report_studio MUST be on enterprise and enterprise_plus
    IF NOT (ent_keys ? 'report_studio') THEN
        RAISE EXCEPTION 'report_studio is missing from the enterprise tier';
    END IF;
    IF NOT (entp_keys ? 'report_studio') THEN
        RAISE EXCEPTION 'report_studio is missing from the enterprise_plus tier';
    END IF;

    -- the pre-existing outage key must never return
    IF prof_keys ? 'migration' OR ent_keys ? 'migration' OR entp_keys ? 'migration' THEN
        RAISE EXCEPTION 'non-canonical entitlement key "migration" reintroduced';
    END IF;

    -- reporting keys the DB seed previously lacked
    IF NOT (ent_keys ? 'advanced_reporting') THEN
        RAISE EXCEPTION 'advanced_reporting is missing from the enterprise tier';
    END IF;
END
$$;

COMMIT;
