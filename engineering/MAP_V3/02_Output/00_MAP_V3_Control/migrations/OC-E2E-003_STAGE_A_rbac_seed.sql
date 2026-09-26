-- OC-E2E-003_STAGE_A_rbac_seed
-- Date: 2026-09-24
-- Depends: create_platform_schema (platform.permissions, platform.roles, platform.role_permissions)
--
-- Stage A RBAC seed & normalization:
--   1. Add permission rows that Stage A route hardening depends on but that
--      the original seed omitted:
--        - systems:list, systems:test   (system/credential listing & connectivity test)
--        - roles:assign                 (canonical per-role permission grants)
--        - invitations:read/create/revoke/resend
--   2. Grant the new permissions to Super Admin.
--   3. Grant the tenant-scoped permission set to Tenant Admin:
--        users.*, roles.* (incl. assign), invitations.*, systems.*,
--        settings.read/update, reports.read + reports.export.
--      Platform-scoped resources (registrations, plans, feature_flags) are
--      deliberately NOT granted to Tenant Admin.
--
-- All statements are idempotent and safe to re-run.

-- ---------------------------------------------------------------
-- 1. Permissions
-- ---------------------------------------------------------------
INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'systems.list', 'systems', 'list', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'systems' AND action = 'list');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'systems.test', 'systems', 'test', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'systems' AND action = 'test');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'roles.assign', 'roles', 'assign', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'roles' AND action = 'assign');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'invitations.read', 'invitations', 'read', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'invitations' AND action = 'read');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'invitations.create', 'invitations', 'create', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'invitations' AND action = 'create');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'invitations.update', 'invitations', 'update', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'invitations' AND action = 'update');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'invitations.revoke', 'invitations', 'revoke', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'invitations' AND action = 'revoke');

INSERT INTO platform.permissions (id, name, resource, action, is_system)
SELECT gen_random_uuid(), 'invitations.resend', 'invitations', 'resend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM platform.permissions WHERE resource = 'invitations' AND action = 'resend');

-- ---------------------------------------------------------------
-- 2. Super Admin grants (all Stage A additions)
-- ---------------------------------------------------------------
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, TRUE
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.name = 'Super Admin'
  AND (
        (p.resource = 'invitations')
        OR (p.resource = 'systems' AND p.action IN ('list', 'test'))
        OR (p.resource = 'roles' AND p.action = 'assign')
      )
ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = EXCLUDED.granted;

-- ---------------------------------------------------------------
-- 3. Tenant Admin grants (tenant-scoped set only)
-- ---------------------------------------------------------------
WITH ta AS (
    SELECT r.id AS role_id
    FROM platform.roles r
    WHERE r.name = 'Tenant Admin'
), grants(resource, action) AS (
    VALUES
        ('users', 'create'), ('users', 'read'), ('users', 'update'),
        ('users', 'delete'), ('users', 'list'),
        ('roles', 'create'), ('roles', 'read'), ('roles', 'update'),
        ('roles', 'delete'), ('roles', 'list'), ('roles', 'assign'),
        ('invitations', 'create'), ('invitations', 'read'),
        ('invitations', 'revoke'), ('invitations', 'resend'),
        ('systems', 'create'), ('systems', 'read'), ('systems', 'update'),
        ('systems', 'delete'), ('systems', 'list'), ('systems', 'test'),
        ('settings', 'read'), ('settings', 'update'),
        ('reports', 'read'), ('reports', 'export')
)
INSERT INTO platform.role_permissions (role_id, permission_id, granted)
SELECT ta.role_id, p.id, TRUE
FROM ta
CROSS JOIN grants g
JOIN platform.permissions p
  ON p.resource = g.resource AND p.action = g.action
ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = EXCLUDED.granted;