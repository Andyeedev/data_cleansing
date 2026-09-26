"""
OC-E2E-003 Stage A — permission-management hardening tests.

Covers require_permissions (granted=TRUE filter, 403 semantics) and the
grant-time guards in RoleService: platform-scoped resources, self-scoping,
entitlement-gated permissions, and system-role protection.
"""
import pytest
from unittest.mock import MagicMock, patch

TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"


def _mock_conn():
    conn = MagicMock()
    cursor = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=cursor)
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn, cursor


def _tenant_admin_caller():
    return {"sub": "ta-1", "tenant_id": TENANT_A, "roles": ["Tenant Admin"]}


def _super_admin_caller():
    return {"sub": "sa-1", "tenant_id": None, "roles": ["Super Admin"]}


# =========================
# require_permissions semantics
# =========================
class TestRequirePermissions:
    def _perm_dep(self, required, fetched):
        from app.api.core.auth.rbac import require_permissions
        with patch("app.api.core.auth.rbac.fetch_effective_permissions", return_value=fetched):
            return require_permissions(required)({"sub": "u1", "tenant_id": TENANT_A})

    def test_denied_when_no_grant(self):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            self._perm_dep("users:read", [])
        assert exc.value.status_code == 403

    def test_allowed_when_granted(self):
        result = self._perm_dep("users:read", [("users", "read")])
        assert result["sub"] == "u1"

    def test_wildcard_grant_allows(self):
        result = self._perm_dep("users:read", [("*", "*")])
        assert result["sub"] == "u1"

    def test_missing_user_id_denied_401(self):
        from fastapi import HTTPException
        from app.api.core.auth.rbac import require_permissions
        with pytest.raises(HTTPException) as exc:
            require_permissions("users:read")({"tenant_id": TENANT_A})
        assert exc.value.status_code == 401

    def test_fetch_effective_permissions_filters_granted_true(self):
        from app.api.core.auth import rbac as rbac_module
        db = MagicMock()
        db.__enter__.return_value = db
        cur = db.conn.cursor.return_value.__enter__.return_value
        cur.fetchall.return_value = [("users", "read")]
        with patch.object(rbac_module, "get_db_connection", return_value=db):
            result = rbac_module.fetch_effective_permissions("u1", TENANT_A)
            query = cur.execute.call_args[0][0]
            assert "rp.granted = TRUE" in query
            assert "r.tenant_id = %s" in query
            assert result == [("users", "read")]


# =========================
# Grant-time guard: platform-scoped resources
# =========================
class TestPlatformScopedGuard:
    def test_systems_not_platform_scoped(self):
        # Stage A correction 1: systems are tenant/object-scoped.
        from app.api.core.auth.rbac import PLATFORM_SCOPED_RESOURCES
        assert "systems" not in PLATFORM_SCOPED_RESOURCES

    def test_platform_scoped_resources_defined(self):
        from app.api.core.auth.rbac import PLATFORM_SCOPED_RESOURCES
        assert {"registrations", "plans", "feature_flags"} <= PLATFORM_SCOPED_RESOURCES

    def test_tenant_admin_cannot_assign_platform_scoped(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-1", "name": "registrations.read", "resource": "registrations", "action": "read"}):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is False
        assert "platform-scoped" in result["error"]

    def test_super_admin_can_assign_platform_scoped(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        cursor.description = [MagicMock(name="role_id"), MagicMock(name="permission_id")]
        cursor.fetchone.return_value = ("role-1", "perm-1")
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-1", "name": "plans.read", "resource": "plans", "action": "read"}):
            result = service.assign_permission("role-1", payload, tenant_id=None, caller=_super_admin_caller())
        assert result["success"] is True


# =========================
# Grant-time guard: self-scoping
# =========================
class TestSelfScopingGuard:
    def test_cannot_grant_unheld_permission(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-1", "name": "users.delete", "resource": "users", "action": "delete"}), \
             patch.object(service, "_caller_grants", return_value={("users", "read")}):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is False
        assert "do not hold" in result["error"]

    def test_can_grant_permission_held(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        cursor.description = [MagicMock(name="role_id"), MagicMock(name="permission_id")]
        cursor.fetchone.return_value = ("role-1", "perm-1")
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-1", "name": "users.read", "resource": "users", "action": "read"}), \
             patch.object(service, "_caller_grants", return_value={("users", "read")}):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is True


# =========================
# Grant-time guard: entitlement-gated permissions
# =========================
class TestEntitlementGate:
    def test_reports_export_requires_advanced_reporting(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-9"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-9", "name": "reports.export", "resource": "reports", "action": "export"}), \
             patch.object(service, "_caller_grants", return_value={("reports", "export")}), \
             patch("app.services.role_service.check_entitlement", return_value=False):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is False
        assert "advanced_reporting" in result["error"]

    def test_reports_export_allowed_when_entitled(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        cursor.description = [MagicMock(name="role_id"), MagicMock(name="permission_id")]
        cursor.fetchone.return_value = ("role-1", "perm-9")
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-9"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": False, "type": "custom"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-9", "name": "reports.export", "resource": "reports", "action": "export"}), \
             patch.object(service, "_caller_grants", return_value={("reports", "export")}), \
             patch("app.services.role_service.check_entitlement", return_value=True):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is True


# =========================
# Grant-time guard: custom role only
# =========================
class TestCustomRoleGuard:
    def test_tenant_admin_cannot_assign_system_role(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": True, "type": "system"}), \
             patch.object(service, "_get_permission",
                          return_value={"id": "perm-1", "name": "users.read", "resource": "users", "action": "read"}):
            result = service.assign_permission("role-1", payload, tenant_id=TENANT_A, caller=_tenant_admin_caller())
        assert result["success"] is False
        assert "custom" in result["error"]


# =========================
# Invitation & permissions routes: canonical gating
# =========================
class TestRouteGating:
    def test_invitation_routes_permission_gated(self):
        from app.api.core.auth.rbac import require_permissions
        source = open("app/api/routes/invitation_routes.py", "r").read()
        assert "require_permissions(\"invitations:" in source
        assert "require_admin" not in source

    def test_permissions_writes_super_admin_only(self):
        source = open("app/api/routes/permissions_routes.py", "r").read()
        assert "require_admin" in source