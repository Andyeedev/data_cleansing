"""
OC-E2E-003 Stage A — RBAC seed migration & entitlement wiring tests.

Verifies the new migration content, the removal of the duplicate PHASE3_SCOPE
file, the canonical 'validation' entitlement wiring for execution endpoints,
and the /auth/me + frontend permission derivation.
"""
import os

MIGRATIONS_DIR = os.path.join(
    "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")


class TestStageARbacSeed:
    def test_migration_exists(self):
        path = os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql")
        assert os.path.exists(path), "Stage A migration file is missing"

    def test_new_permissions_added(self):
        source = open(os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql"), "r").read()
        for key in ("systems.list", "systems.test", "roles.assign",
                    "invitations.read", "invitations.create"):
            assert key in source, f"migration must seed permission '{key}'"

    def test_no_platform_scoped_grants_for_tenant_admin(self):
        source = open(os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql"), "r").read()
        ta_section = source[source.index("Tenant Admin grants"):]
        assert "registrations" not in ta_section
        assert "plans" not in ta_section
        assert "feature_flags" not in ta_section

    def test_tenant_admin_tenant_scoped_grants_present(self):
        source = open(os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql"), "r").read()
        for key in ("'users'", "'roles'", "'invitations'", "'systems'",
                    "'settings'", "'reports'"):
            assert key in source

    def test_super_admin_granted_new_permissions(self):
        source = open(os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql"), "r").read()
        assert "r.name = 'Super Admin'" in source

    def test_duplicate_phase3_scope_migration_removed(self):
        path = os.path.join(
            MIGRATIONS_DIR,
            "OC-COM-001d_PHASE3_SCOPE-subscription_status_check_migration.sql")
        assert not os.path.exists(path), "duplicate subscription-status migration still present"

    def test_canonical_subscription_status_migration_kept(self):
        path = os.path.join(MIGRATIONS_DIR, "OC-COM-001d_Phase3_subscription_status.sql")
        assert os.path.exists(path)


class TestEntitlementWiring:
    def test_execution_routes_use_canonical_validation(self):
        source = open("app/api/routes/execution_routes.py", "r").read()
        assert 'require_entitlement("validation")' in source
        assert 'require_entitlement("migration")' not in source

    def test_operations_execution_routes_use_canonical_validation(self):
        source = open("app/api/routes/operations_execution_routes.py", "r").read()
        assert 'require_entitlement("validation")' in source
        assert 'require_entitlement("migration")' not in source

    def test_entitlement_key_is_canonical(self):
        # 'validation' is present in every plan tier in DEFAULT_ENTITLEMENTS.
        from app.middleware.entitlement_middleware import DEFAULT_ENTITLEMENTS
        for tier, entitlements in DEFAULT_ENTITLEMENTS.items():
            assert "validation" in entitlements, f"{tier} plan must include validation"

    def test_migration_key_is_not_canonical(self):
        # Evidence for the decision: 'migration' is absent from all plan seeds.
        from app.middleware.entitlement_middleware import DEFAULT_ENTITLEMENTS
        for entitlements in DEFAULT_ENTITLEMENTS.values():
            assert "migration" not in entitlements


class TestMePermissions:
    def test_me_returns_derived_permissions(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        assert 'permissions = [row[0] for row in cur.fetchall()]' in source
        assert '"permissions": permissions' in source

    def test_me_permissions_granted_true_only(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        assert "rp.granted = TRUE" in source


class TestFrontendNormalization:
    def test_auth_context_derives_permissions_from_me(self):
        path = os.path.join(
            "engineering", "MAP_V3", "03_Source", "frontend-mvp",
            "src", "context", "AuthContext.tsx")
        source = open(path, "r").read()
        assert "meData.permissions" in source
        assert "permissions: ['read']" not in source

    def test_app_routes_use_permissions(self):
        path = os.path.join(
            "engineering", "MAP_V3", "03_Source", "frontend-mvp",
            "src", "AppRoutes.tsx")
        source = open(path, "r").read()
        assert "requiredPermissions={['users:list']}" in source
        assert "requiredRoles={['admin']}" not in source