-- ============================================================================
-- OC-REPORT-001 — Phase 0.4 — Report role grants for ungranted seeded roles
-- ============================================================================
--
-- FINDING (measured against the live database, excluding Super Admin)
--
--   Tenant Admin     26 grants   (includes reports.read, reports.export)
--   Migration Lead    3 grants   ALL THREE are legacy residue rows:
--                                 reports.governance.view
--                                 reports.migration.view
--                                 reports.validation.view
--   Data Analyst      0 grants
--   Team Member       0 grants   (is_default = TRUE)
--   Viewer            0 grants
--
-- Migration Lead is the important one. Its ONLY permissions are three legacy
-- `reports`/`view` rows that are absent from every seed file and that no code
-- path checks. So the role appears to have report access and in fact has none.
-- That is worse than having no grants, because it makes the role matrix look
-- correct when reviewed.
--
-- Data Analyst, Team Member and Viewer are the report personas Report Studio is
-- built for, and they can currently read nothing.
--
-- SCOPE — WHY THIS MIGRATION GRANTS REPORTS PERMISSIONS ONLY
--
-- This work package is Report Studio. The four affected roles also lack
-- permissions outside reporting (control CRUD, migration execution, system and
-- connection management, discovery, mapping). Granting those is a separate
-- product decision, is not required for Report Studio, and would be silent
-- scope expansion. This migration therefore touches the `reports` resource and
-- nothing else. The wider gap is reported, not fixed.
--
-- MATRIX APPLIED (reports resource only)
--
--   role              read create update delete export share
--   ----------------  ---- ----- ------ ----- ----- -----
--   Super Admin       yes  yes   yes   yes   yes   yes   (pre-existing + share)
--   Tenant Admin      yes  -     -     -     yes   yes   (pre-existing + share)
--   Migration Lead    yes  yes   yes   yes   yes   -
--   Data Analyst      yes  yes   yes   yes   yes   yes
--   Team Member       yes  -     -     -     -     -
--   Viewer            yes  -     -     -     -     -
--
-- Rationale, role by role:
--
--   Viewer / Team Member — the seeded role descriptions are "Read-only access"
--     and "Basic team member access". Consuming a published report is the
--     minimum useful capability, so read only. Team Member is the DEFAULT role
--     (is_default = TRUE), which makes it the highest-reach grant in the
--     product: read-only is the correct ceiling for a default role, and delete
--     in particular is never granted to either. This ceiling is asserted in the
--     post-conditions below.
--
--   Migration Lead — seeded description "Lead migration projects". Builds,
--     maintains, exports and deletes reports. Not granted share: sharing is a
--     distribution act with an audience, and the plan (v2 §7.2) does not give
--     it to this role.
--
--   Data Analyst — seeded description "Analyze and report on data". The
--     primary Report Studio persona: builds, maintains, exports, shares and
--     deletes reports.
--
-- Entitlement interaction is unchanged and correct: `reports.export` is
-- bridged to `advanced_reporting` in app/api/core/auth/rbac.py, so holding the
-- permission is necessary but not sufficient — a tenant without the
-- `advanced_reporting` entitlement still receives 403 on export. RBAC and
-- entitlement remain independent layers.
--
-- ============================================================================
-- DECISION (approved) — reports:delete, and the ownership contract it depends on
-- ============================================================================
--
-- `reports:delete` is granted to Migration Lead and Data Analyst, and to
-- nobody else. Super Admin and Tenant Admin already hold it from the base seed.
-- Viewer and Team Member are explicitly refused it.
--
-- The plan (v2 §7.2) did not list reports:delete, on the grounds that deletion is
-- destructive. That is correct in principle but wrong in consequence: a user who
-- creates a report must be able to remove it, or a report they cannot use becomes
-- permanent clutter they can only ask an admin to delete.
--
-- GRANTING THE PERMISSION IS NOT THE SAME AS ALLOWING ANY DELETE.
-- The permission is a necessary, not a sufficient, condition. The service layer
-- MUST additionally enforce, on every delete (and every soft-delete, archive,
-- version overwrite and definition write):
--
--   1. OWNERSHIP / OBJECT ACCESS. A holder of reports:delete may delete a report
--      they own. Deleting a report owned by someone else additionally requires
--      the delete-any capability, which in V1 is Super Admin and Tenant Admin
--      only. The permission alone never authorises deleting another user's
--      report.
--   2. TENANT SCOPE. The report must belong to the caller's effective tenant.
--      Tenant isolation is applied before ownership.
--   3. ENTITLEMENT AND DATASOURCE AUTHORISATION. A delete re-runs the same
--      source-level check as a read, so a report cannot be used as a probe for
--      whether some other report's underlying source is reachable.
--   4. AUDIT. Every delete is written to the shared audit trail.
--
-- This migration grants capability only. The enforcement above is implemented in
-- the report-definition service (Phase 1/2 of OC-REPORT-001) and is covered by
-- the security tests required by the plan §26. If that service ever authorises a
-- delete on the strength of the permission alone, this grant becomes a
-- privilege-escalation path — which is why the ownership rule is recorded here,
-- not only in the service.
--
-- Idempotency: safe to re-run.
-- ============================================================================

BEGIN;

DO $$
BEGIN
    IF to_regclass('platform.role_permissions') IS NULL THEN
        RAISE EXCEPTION 'platform.role_permissions is missing';
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Reports capability grants. reports:share must already exist (Phase 0.3).
-- Written as explicit tuples rather than a blanket CROSS JOIN so that adding a
-- new reports permission in a later phase cannot silently widen every role.
-- ---------------------------------------------------------------------------
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM platform.roles r
JOIN (VALUES
        -- role name, resource, action
        ('Migration Lead', 'reports', 'read'),
        ('Migration Lead', 'reports', 'create'),
        ('Migration Lead', 'reports', 'update'),
        ('Migration Lead', 'reports', 'delete'),
        ('Migration Lead', 'reports', 'export'),

        ('Data Analyst',   'reports', 'read'),
        ('Data Analyst',   'reports', 'create'),
        ('Data Analyst',   'reports', 'update'),
        ('Data Analyst',   'reports', 'delete'),
        ('Data Analyst',   'reports', 'export'),
        ('Data Analyst',   'reports', 'share'),

        ('Team Member',    'reports', 'read'),
        ('Viewer',         'reports', 'read')
     ) AS g(role_name, resource, action)
  ON g.role_name = r.name
JOIN platform.permissions p
  ON p.resource = g.resource AND p.action = g.action
ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = EXCLUDED.granted;

-- ---------------------------------------------------------------------------
-- Post-conditions: the exact expected matrix, verified in SQL.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    unexpected TEXT;
    missing    TEXT;
BEGIN
    -- 1. Every reports grant outside Super Admin / Tenant Admin must appear in
    --    the approved matrix below, and nothing else may — EXCEPT the five
    --    legacy residue rows, which are pre-existing historical state that this
    --    migration deliberately leaves untouched (see header). They are named
    --    explicitly so the exclusion is exact rather than a blanket action
    --    wildcard, and so a sixth residue row would still be caught.
    WITH approved(role_name, action) AS (VALUES
        ('Migration Lead', 'read'), ('Migration Lead', 'create'),
        ('Migration Lead', 'update'), ('Migration Lead', 'delete'),
        ('Migration Lead', 'export'),
        ('Data Analyst',   'read'), ('Data Analyst',   'create'),
        ('Data Analyst',   'update'), ('Data Analyst', 'delete'),
        ('Data Analyst',   'export'), ('Data Analyst', 'share'),
        ('Team Member',    'read'),
        ('Viewer',         'read')
    ),
    legacy_residue(permission_name) AS (VALUES
        ('reports.audit.view'),
        ('reports.governance.view'),
        ('reports.migration.view'),
        ('reports.operational.view'),
        ('reports.validation.view')
    )
    SELECT string_agg(format('%s:%s', r.name, p.name), ', ') INTO unexpected
    FROM platform.role_permissions rp
    JOIN platform.roles r       ON r.id = rp.role_id
    JOIN platform.permissions p ON p.id = rp.permission_id
    LEFT JOIN approved a ON a.role_name = r.name AND a.action = p.action
    LEFT JOIN legacy_residue lr ON lr.permission_name = p.name
    WHERE rp.granted IS TRUE
      AND p.resource = 'reports'
      AND r.name NOT IN ('Super Admin', 'Tenant Admin')
      AND a.role_name IS NULL
      AND lr.permission_name IS NULL;

    IF unexpected IS NOT NULL THEN
        RAISE EXCEPTION 'unexpected reports grants: %', unexpected;
    END IF;

    -- 2. Every approved grant must actually exist.
    WITH approved(role_name, action) AS (VALUES
        ('Migration Lead', 'read'), ('Migration Lead', 'create'),
        ('Migration Lead', 'update'), ('Migration Lead', 'delete'),
        ('Migration Lead', 'export'),
        ('Data Analyst',   'read'), ('Data Analyst',   'create'),
        ('Data Analyst',   'update'), ('Data Analyst', 'delete'),
        ('Data Analyst',   'export'), ('Data Analyst', 'share'),
        ('Team Member',    'read'),
        ('Viewer',         'read')
    )
    SELECT string_agg(format('%s:%s', a.role_name, a.action), ', ') INTO missing
    FROM approved a
    LEFT JOIN platform.roles r ON r.name = a.role_name
    LEFT JOIN platform.permissions p
           ON p.resource = 'reports' AND p.action = a.action
    LEFT JOIN platform.role_permissions rp
           ON rp.role_id = r.id AND rp.permission_id = p.id AND rp.granted IS TRUE
    WHERE rp.role_id IS NULL;

    IF missing IS NOT NULL THEN
        RAISE EXCEPTION 'missing approved reports grants: %', missing;
    END IF;

    -- 3. Viewer and Team Member must remain strictly read-only. This is the
    --    highest-reach grant in the product because Team Member is the seeded
    --    DEFAULT role, and delete in particular must never reach either.
    IF EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r       ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name IN ('Viewer','Team Member')
          AND rp.granted IS TRUE AND p.resource = 'reports'
          AND p.action <> 'read'
    ) THEN
        RAISE EXCEPTION 'Viewer/Team Member must hold reports:read only';
    END IF;

    IF EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r       ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name IN ('Viewer','Team Member')
          AND rp.granted IS TRUE AND p.resource = 'reports'
          AND p.action = 'delete'
    ) THEN
        RAISE EXCEPTION 'reports:delete must never be granted to Viewer or Team Member';
    END IF;

    -- 4. reports:delete must be held by exactly the two approved non-admin
    --    roles. Super Admin and Tenant Admin already hold it from the base seed
    --    and are not restated here.
    IF NOT EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r       ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name='Migration Lead' AND p.resource='reports'
          AND p.action='delete' AND rp.granted IS TRUE) THEN
        RAISE EXCEPTION 'Migration Lead must hold reports:delete (approved)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM platform.role_permissions rp
        JOIN platform.roles r       ON r.id = rp.role_id
        JOIN platform.permissions p ON p.id = rp.permission_id
        WHERE r.name='Data Analyst' AND p.resource='reports'
          AND p.action='delete' AND rp.granted IS TRUE) THEN
        RAISE EXCEPTION 'Data Analyst must hold reports:delete (approved)';
    END IF;

    RAISE NOTICE 'report grants reconciled for Migration Lead, Data Analyst, Team Member, Viewer';
    RAISE NOTICE 'reports:delete granted to Migration Lead + Data Analyst only; ownership enforcement is a service-layer requirement';
END
$$;

COMMIT;
