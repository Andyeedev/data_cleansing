"""Stage C tenant-context tests (Phase C, read-only).

Verifies the approved D1 rule:
  Super Admin + valid tenant_id -> may query that tenant
  Super Admin + no tenant_id   -> JWT tenant (aggregate only where supported)
  Tenant Admin + own tenant    -> allowed
  Tenant Admin + another tenant-> 403 or ignored (resolve_tenant ignores it)
  non-SA cross-tenant attempt  -> denied (JWT-bound)

D1 wiring is limited to read endpoints (users/roles/invitations lists and
object GETs). All writes stay JWT-bound (Stage A guards untouched).
No test here writes to the database.
"""

from fastapi.testclient import TestClient

from app.api.main import app
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.core.auth.dependencies import resolve_tenant
from app.db.connection import get_db_connection
from app.services.role_service import RoleService
from app.services.user_service import UserService

SA_TENANT = "tenant-a"
OTHER_TENANT = "tenant-b"
SA = {"sub": "sa", "roles": ["Super Admin"], "tenant_id": SA_TENANT}
TA = {"sub": "ta", "roles": ["Tenant Admin"], "tenant_id": SA_TENANT}
VIEWER = {"sub": "v", "roles": ["Viewer"], "tenant_id": SA_TENANT}


def _read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


class TestResolveTenantRule:
    def test_sa_override_honored(self):
        assert resolve_tenant(SA, OTHER_TENANT) == OTHER_TENANT

    def test_sa_default_is_jwt_tenant(self):
        assert resolve_tenant(SA, None) == SA_TENANT

    def test_sa_blank_override_falls_back(self):
        assert resolve_tenant(SA, "   ") == SA_TENANT

    def test_ta_override_ignored(self):
        assert resolve_tenant(TA, OTHER_TENANT) == SA_TENANT

    def test_ta_default_is_jwt_tenant(self):
        assert resolve_tenant(TA, None) == SA_TENANT

    def test_viewer_override_denied(self):
        assert resolve_tenant(VIEWER, OTHER_TENANT) == SA_TENANT


def _live_admin_tenant():
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT tenant_id FROM platform.users WHERE email = %s AND deleted_at IS NULL",
                ("admin@mapnexus.com",),
            )
            row = cur.fetchone()
            assert row and row[0], "seeded super-admin user missing"
            return str(row[0])


def _live_user_id(email):
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT id FROM platform.users WHERE email = %s AND deleted_at IS NULL",
                (email,),
            )
            row = cur.fetchone()
            assert row, f"user {email} missing"
            return str(row[0])


def _live_sa_role_id():
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute("SELECT id FROM platform.roles WHERE name = %s", ("Super Admin",))
            row = cur.fetchone()
            assert row, "Super Admin role missing"
            return str(row[0])


class TestRoleGlobalVisibilityLive:
    """The reported empty-Roles-page defect: system roles are tenant-NULL and
    were invisible to every tenant-scoped caller, including Super Admin."""

    def test_sa_list_includes_global_system_roles(self):
        tenant_id = _live_admin_tenant()
        with get_db_connection() as db:
            result = RoleService(db.conn).list_roles(tenant_id=tenant_id, include_global=True)
        names = {r["name"] for r in result["data"]["roles"]}
        assert result["data"]["total"] >= 6
        assert {"Super Admin", "Tenant Admin", "Migration Lead", "Data Analyst", "Team Member", "Viewer"} <= names

    def test_non_sa_list_excludes_global_roles(self):
        tenant_id = _live_admin_tenant()
        with get_db_connection() as db:
            result = RoleService(db.conn).list_roles(tenant_id=tenant_id, include_global=False)
        assert result["data"]["total"] == 0

    def test_sa_get_system_role(self):
        tenant_id = _live_admin_tenant()
        role_id = _live_sa_role_id()
        with get_db_connection() as db:
            result = RoleService(db.conn).get_role(role_id, tenant_id=tenant_id, include_global=True)
        assert result["success"] is True
        assert result["data"]["name"] == "Super Admin"

    def test_non_sa_get_system_role_denied(self):
        tenant_id = _live_admin_tenant()
        role_id = _live_sa_role_id()
        with get_db_connection() as db:
            result = RoleService(db.conn).get_role(role_id, tenant_id=tenant_id, include_global=False)
        assert result["success"] is False

    def test_user_list_stays_tenant_scoped(self):
        tenant_id = _live_admin_tenant()
        with get_db_connection() as db:
            result = UserService(db.conn).list_users(
                tenant_id=tenant_id, search="admin@mapnexus.com"
            )
        assert result["data"]["total"] >= 1


class TestD1Wiring:
    """D1 is limited to read endpoints; writes stay JWT-bound."""

    def test_read_endpoints_use_resolve_tenant(self):
        users = _read("app/api/routes/user_routes.py")
        roles = _read("app/api/routes/role_routes.py")
        invitations = _read("app/api/routes/invitation_routes.py")
        assert users.count("tenant_id: str = Depends(resolve_tenant)") == 3  # list + get + user-roles
        assert roles.count("tenant_id: str = Depends(resolve_tenant)") == 3  # list + get + role-permissions
        assert invitations.count("tenant_id: str = Depends(resolve_tenant)") == 1  # list
        assert roles.count("include_global=is_super_admin(current_user)") == 3

    def test_writes_stay_jwt_bound(self):
        users = _read("app/api/routes/user_routes.py")
        roles = _read("app/api/routes/role_routes.py")
        invitations = _read("app/api/routes/invitation_routes.py")
        jwt = 'tenant_id = current_user.get("tenant_id")'
        assert users.count(jwt) == 5  # create/update/delete/assign/remove (reads use resolve_tenant)
        assert roles.count(jwt) == 5  # create/update/delete/assign/remove
        assert invitations.count(jwt) == 3  # create/revoke/resend

    def test_c4_no_change_surfaces_untouched(self):
        systems = _read("app/api/routes/system_routes.py")
        governance = _read("app/api/routes/governance_routes.py")
        reports = _read("app/api/routes/report_suite_routes.py")
        registrations = _read("app/api/routes/admin_registration_routes.py")
        tenants = _read("app/api/routes/tenant_routes.py")
        settings = _read("app/api/routes/settings_routes.py")
        # Already SA-override-capable via resolve_tenant (Stage A / existing).
        assert "Depends(resolve_tenant)" in systems
        assert "Depends(resolve_tenant)" in governance
        assert "Depends(resolve_tenant)" in reports
        # SA-only globals: no tenant override needed.
        assert "require_admin" in registrations
        assert "require_admin" in tenants
        # Tenant-free globals: no tenant dimension at all.
        assert "tenant_id" not in settings


def _scoped_client(user, grants):
    """TestClient with a synthetic identity.

    Route guards resolve through the real require_permissions dependency
    with fetch_effective_permissions stubbed to the given grant set, while
    resolve_tenant reads roles/tenant straight from the identity — exactly
    the split the live JWT path produces.
    """
    import contextlib
    from unittest.mock import patch

    from app.api.core.auth.dependencies import get_current_user
    from app.api.core.auth.rbac import require_admin

    grant_tuples = [tuple(g.split(":")) for g in grants]

    @contextlib.contextmanager
    def _ctx():
        app.dependency_overrides = {
            get_current_user: lambda: user,
            get_current_user_with_tenant: lambda: user,
            require_admin: lambda: user,
        }
        patcher = patch(
            "app.api.core.auth.rbac.fetch_effective_permissions",
            return_value=grant_tuples,
        )
        patcher.start()
        try:
            yield TestClient(app)
        finally:
            patcher.stop()
            app.dependency_overrides = {}

    return _ctx()


SA_GRANTS = {"users:list", "users:read", "roles:list", "roles:read"}


class TestScopedObjectReads:
    """Regression tests for scoped detail views: an SA scoped to tenant X
    must resolve objects of tenant X (previously JWT-bound -> 404), while
    a TA override attempt must stay locked to its own tenant."""

    E2E_TENANT = "74dff1e4-7684-4fe7-8e38-915627120c8a"
    ADMIN_TENANT = "aaf73536-2fd0-461e-87be-aa980cc1a8f1"

    def test_sa_scoped_user_detail(self):
        e2e_user = _live_user_id("e2e-admin@e2e-validation.com")
        sa = {"sub": "sa", "user": "sa@t.t", "tenant_id": self.ADMIN_TENANT, "roles": ["Super Admin"]}
        with _scoped_client(sa, SA_GRANTS) as client:
            resp = client.get(f"/api/v1/users/{e2e_user}?tenant_id={self.E2E_TENANT}")
            assert resp.status_code == 200, resp.text[:300]
            assert resp.json()["data"]["email"] == "e2e-admin@e2e-validation.com"

    def test_ta_override_attempt_stays_locked(self):
        ta = {"sub": "ta", "user": "ta@t.t", "tenant_id": self.ADMIN_TENANT, "roles": ["Tenant Admin"]}
        e2e_user = _live_user_id("e2e-admin@e2e-validation.com")
        with _scoped_client(ta, SA_GRANTS) as client:
            resp = client.get(f"/api/v1/users/{e2e_user}?tenant_id={self.E2E_TENANT}")
            assert resp.status_code in (403, 404), resp.text[:300]

    def test_sa_scoped_user_roles(self):
        sa = {"sub": "sa", "user": "sa@t.t", "tenant_id": self.ADMIN_TENANT, "roles": ["Super Admin"]}
        e2e_user = _live_user_id("e2e-admin@e2e-validation.com")
        with _scoped_client(sa, SA_GRANTS) as client:
            resp = client.get(f"/api/v1/users/{e2e_user}/roles?tenant_id={self.E2E_TENANT}")
            assert resp.status_code == 200, resp.text[:300]

    def test_sa_scoped_role_detail(self):
        sa = {"sub": "sa", "user": "sa@t.t", "tenant_id": self.ADMIN_TENANT, "roles": ["Super Admin"]}
        role_id = _live_sa_role_id()
        with _scoped_client(sa, SA_GRANTS) as client:
            resp = client.get(f"/api/v1/roles/{role_id}?tenant_id={self.E2E_TENANT}")
            assert resp.status_code == 200, resp.text[:300]
            assert resp.json()["data"]["name"] == "Super Admin"
