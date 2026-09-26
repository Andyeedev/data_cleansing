"""
OC-E2E-003 Stage A — role normalization tests.

Covers: system roles are protected from tenant-admin mutation; Tenant Admin can
only create custom roles; user_service.assign_role rejects system-role
assignment by non-Super-Admins; caller-aware signatures are forwarded from routes.
"""
from unittest.mock import MagicMock, patch

TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"


def _mock_conn():
    conn = MagicMock()
    cursor = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=cursor)
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn, cursor


def _ta_caller():
    return {"sub": "ta-1", "tenant_id": TENANT_A, "roles": ["Tenant Admin"]}


class TestCreateRoleNormalization:
    def test_tenant_admin_forced_to_custom(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.type = "system"
        payload.name = "X"
        payload.description = None
        payload.parent_id = None
        result = service.create_role(payload, tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False
        assert "Only Super Admin" in result["error"]

    def test_super_admin_may_create_system(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        cursor.description = [MagicMock(name=n) for n in ("id", "name", "description", "type", "created_at")]
        cursor.fetchone.return_value = ("role-1", "X", None, "system", "2026-01-01")
        service = RoleService(conn)
        payload = MagicMock()
        payload.type = "system"
        payload.name = "X"
        payload.description = None
        payload.parent_id = None
        result = service.create_role(payload, tenant_id=None, caller={"sub": "sa", "roles": ["Super Admin"]})
        assert result["success"] is True


class TestUpdateDeleteProtection:
    def test_update_system_role_denied(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        payload = MagicMock()
        payload.name = "Hacked"
        payload.status = None
        payload.description = None
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": True}):
            result = service.update_role("role-1", payload, tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False
        assert "protected" in result["error"]

    def test_delete_system_role_denied(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        with patch.object(service, "_get_role", return_value={"id": "role-1", "is_system": True}):
            result = service.delete_role("role-1", tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False
        assert "protected" in result["error"]

    def test_delete_missing_role_access_denied(self):
        from app.services.role_service import RoleService
        conn, cursor = _mock_conn()
        service = RoleService(conn)
        with patch.object(service, "_get_role", return_value=None):
            result = service.delete_role("role-1", tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False


class TestAssignRoleSystemRoleGuard:
    def test_tenant_admin_cannot_assign_system_role(self):
        from app.services.user_service import UserService
        conn, cursor = _mock_conn()
        cursor.fetchone.side_effect = [("user-1",), ("role-1", True)]
        service = UserService(conn)
        payload = MagicMock()
        payload.role_id = "role-1"
        payload.expires_at = None
        payload.is_temporary = False
        result = service.assign_role("user-1", payload, tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False
        assert "System roles" in result["error"]

    def test_tenant_admin_cannot_assign_foreign_role(self):
        from app.services.user_service import UserService
        conn, cursor = _mock_conn()
        cursor.fetchone.side_effect = [("user-1",), None]
        service = UserService(conn)
        payload = MagicMock()
        payload.role_id = "role-9"
        payload.expires_at = None
        payload.is_temporary = False
        result = service.assign_role("user-1", payload, tenant_id=TENANT_A, caller=_ta_caller())
        assert result["success"] is False

    def test_super_admin_assign_system_role_allowed(self):
        from app.services.user_service import UserService
        conn, cursor = _mock_conn()
        cursor.fetchone.side_effect = [("user-1",), ("role-1",), ("user-1", "role-1")]
        cursor.description = [MagicMock(name="x")]
        service = UserService(conn)
        payload = MagicMock()
        payload.role_id = "role-1"
        payload.expires_at = None
        payload.is_temporary = False
        result = service.assign_role(
            "user-1", payload, tenant_id=None,
            caller={"sub": "sa-1", "roles": ["Super Admin"]})
        assert result["success"] is True


class TestRoutesForwardCaller:
    def test_role_routes_pass_caller_to_service(self):
        source = open("app/api/routes/role_routes.py", "r").read()
        assert "caller=current_user" in source

    def test_user_routes_pass_caller_to_assign_role(self):
        source = open("app/api/routes/user_routes.py", "r").read()
        assert "caller=current_user" in source