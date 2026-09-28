-- ============================================================================
-- OC-REPORT-001 — Phase 0.3 — Permission reconciliation
-- ============================================================================
--
-- WHAT THIS MIGRATION DOES
--
-- 1. Adds the single approved new permission:  reports:share
-- 2. Grants it to Super Admin (full system access) and Tenant Admin
--    (tenant-scoped report sharing), consistent with the existing Stage A
--    grant pattern for reports.read / reports.export.
--
-- WHAT IT DELIBERATELY DOES NOT DO
--
--   * Does NOT add reports:view      (explicitly prohibited; and the residue
--                                     rows that look like it are classified
--                                     below rather than extended)
--   * Does NOT add reports:schedule  (V2 — the permission must not exist for a
--                                     feature that has not shipped; seeding it
--                                     now would be inventory debt)
--   * Does NOT delete or rewrite any existing permission or grant.
--
-- ============================================================================
-- FINDING: the live-vs-seed permission delta is 5 rows, not 3
-- ============================================================================
--
-- Verified against the live database:
--
--   base seed   MAP_V2/03_Source/database/seed_platform_data.sql   44 rows
--   Stage A     OC-E2E-003_STAGE_A_rbac_seed.sql                   +8 rows
--                                                                  -----
--                                                                  52 seeded
--   live database platform.permissions                             57 rows
--                                                                  -----
--                                                                  delta = 5
--
-- The 5 rows present in the live database and in NO seed file are all
-- resource='reports', action='view':
--
--     reports.audit.view
--     reports.governance.view
--     reports.migration.view
--     reports.operational.view
--     reports.validation.view
--
-- CLASSIFICATION: legacy report-pack residue. Reasoning:
--
--   * They are absent from every seed file, so a fresh install would not have
--     them. They exist only as database state.
--   * Their names map one-to-one onto the legacy core.role_permissions report
--     pack keys (operational / validation / governance / audit / migration),
--     which is the model Stage A moved away from. They are the fingerprint of
--     that migration.
--   * No code reads them. The report suite gates on its own hard-coded
--     fallbackRoleMap (ReportSuitePage.tsx) and the frontend pack system reads
--     core.role_permissions, not platform.permissions.
--   * They are NOT duplicates of reports:read: the action differs ('view' vs
--     'read'), so uniqueness on (resource, action) is not violated and no
--     constraint is broken.
--   * Super Admin currently holds a grant on all 57 rows including these 5.
--
-- ACTION TAKEN: none — they are RETAINED and left untouched.
--
-- Rationale for not deleting: they are not causing harm (no code path grants or
-- checks them), Super Admin holds grants against them, and deletion is
-- irreversible. Removing them is a cleanup decision for the founder, not a
-- prerequisite for Report Studio. They are pinned by
-- tests/test_report_permission_catalogue.py so they cannot be lost or
-- duplicated unnoticed, and the same test fails if the count drifts.
--
-- ============================================================================
-- IDEMPOTENCY: safe to re-run.
-- ============================================================================

BEGIN;

DO $$
BEGIN
    IF to_regclass('platform.permissions') IS NULL THEN
        RAISE EXCEPTION 'platform.permissions is missing — apply the platform schema first';
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 1. The one approved new permission
-- ---------------------------------------------------------------------------
INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'reports.share', 'reports', 'share', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM platform.permissions WHERE resource = 'reports' AND action = 'share'
);

-- ---------------------------------------------------------------------------
-- 2. Grants — Super Admin and Tenant Admin only.
--    Migration Lead / Data Analyst grants are handled separately in the
--    OC-REPORT-001 role-grant migration once the role matrix is approved;
--    they are NOT guessed here.
-- ---------------------------------------------------------------------------
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.name IN ('Super Admin', 'Tenant Admin')
  AND p.resource = 'reports'
  AND p.action = 'share'
ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = EXCLUDED.granted;

-- ---------------------------------------------------------------------------
-- 3. Post-conditions
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    n_report_perms INT;
    has_share BOOLEAN;
    has_schedule BOOLEAN;
    sa_has_share BOOLEAN;
    ta_has_share BOOLEAN;
BEGIN
    SELECT count(*) INTO n_report_perms
    FROM platform.permissions WHERE resource = 'reports';

    SELECT EXISTS (SELECT 1 FROM platform.permissions
                   WHERE resource='reports' AND action='share') INTO has_share;

    -- reports:schedule is V2 and must NOT exist yet
    SELECT EXISTS (SELECT 1 FROM platform.permissions
                   WHERE resource='reports' AND action='schedule') INTO has_schedule;

    SELECT EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name='Super Admin' AND p.resource='reports' AND p.action='share'
          AND rp.granted IS TRUE) INTO sa_has_share;

    SELECT EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name='Tenant Admin' AND p.resource='reports' AND p.action='share'
          AND rp.granted IS TRUE) INTO ta_has_share;

    IF NOT has_share THEN
        RAISE EXCEPTION 'reports.share was not created';
    END IF;
    IF has_schedule THEN
        RAISE EXCEPTION 'reports.schedule must not exist in V1 (scheduling is V2)';
    END IF;
    IF NOT sa_has_share THEN
        RAISE EXCEPTION 'Super Admin must hold reports.share';
    END IF;
    IF NOT ta_has_share THEN
        RAISE EXCEPTION 'Tenant Admin must hold reports.share';
    END IF;

    RAISE NOTICE 'reports resource permissions: % (incl. 5 retained legacy *view rows)', n_report_perms;
END
$$;

COMMIT;
