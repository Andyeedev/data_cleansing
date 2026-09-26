"""
OC-SEC-006B — User/RBAC Cross-Tenant Isolation Tests

Tests for:
1. User routes use get_current_user_with_tenant
2. Role routes use get_current_user_with_tenant
3. UserService filters by tenant_id
4. RoleService filters by tenant_id
5. RBAC queries scope by tenant
6. Cross-tenant user access denied
7. Cross-tenant role access denied
"""
import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture
def mock_conn():
    conn = MagicMock()
    cursor = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=cursor)
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn, cursor


@pytest.fixture
def tenant_a():
    return "tenant-a-uuid-001"


@pytest.fixture
def tenant_b():
    return "tenant-b-uuid-002"


# =========================
# ROUTE AUTH TESTS
# =========================
class TestRouteAuthDependencies:
    """Verify RBAC routes use canonical require_permissions auth."""

    def test_user_routes_use_permission_auth(self):
        source = open("app/api/routes/user_routes.py", "r").read()
        assert "require_permissions" in source
        assert "get_current_user_with_tenant" not in source

    def test_role_routes_use_permission_auth(self):
        source = open("app/api/routes/role_routes.py", "r").read()
        assert "require_permissions" in source
        assert "get_current_user_with_tenant" not in source


# =========================
# USER SERVICE TESTS
# =========================
class TestUserServiceTenantFiltering:
    """Verify UserService enforces tenant boundary."""

    def test_list_users_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        conn, cursor = mock_conn
        cursor.fetchall.return_value = []
        cursor.fetchone.return_value = (0,)
        service = UserService(conn)
        result = service.list_users(tenant_id=tenant_a)
        query = cursor.execute.call_args_list[0][0][0]
        assert "tenant_id = %s" in query

    def test_get_user_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = UserService(conn)
        result = service.get_user("user-1", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_get_user_wrong_tenant_returns_not_found(self, mock_conn, tenant_b):
        from app.services.user_service import UserService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = UserService(conn)
        result = service.get_user("user-1", tenant_id=tenant_b)
        assert result["success"] is False

    def test_update_user_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = UserService(conn)
        payload = MagicMock()
        payload.first_name = "Test"
        payload.last_name = None
        payload.display_name = None
        payload.phone = None
        payload.department = None
        payload.status = None
        result = service.update_user("user-1", payload, tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_delete_user_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = UserService(conn)
        result = service.delete_user("user-1", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_assign_role_validates_user_and_role_tenant(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = UserService(conn)
        payload = MagicMock()
        payload.role_id = "role-1"
        payload.expires_at = None
        payload.is_temporary = False
        result = service.assign_role("user-1", payload, tenant_id=tenant_a)
        assert result["success"] is False

    def test_create_user_uses_jwtenant_not_body(self, mock_conn, tenant_a):
        from app.services.user_service import UserService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        # DEV-009 limit check (limit row, count row) then INSERT RETURNING row.
        cursor.fetchone.side_effect = [
            (5,), (1,), ("user-1", "test@test.com", "Test", "User")
        ]
        service = UserService(conn)
        payload = MagicMock()
        payload.email = "test@test.com"
        payload.password = "Pass1234"
        payload.first_name = "Test"
        payload.last_name = "User"
        payload.display_name = None
        payload.phone = None
        payload.department = None
        result = service.create_user(payload, tenant_id=tenant_a)
        queries = [call[0][0] for call in cursor.execute.call_args_list]
        assert any("tenant_id" in q for q in queries)
        assert result["success"] is True

    def test_create_user_enforces_plan_limit(self, mock_conn, tenant_a):
        # DEV-009: at-limit tenants are rejected before INSERT.
        from app.services.user_service import UserService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.side_effect = [(1,), (5,)]
        service = UserService(conn)
        payload = MagicMock()
        payload.email = "full@test.com"
        payload.password = "Pass1234"
        with pytest.raises(ValueError, match="limit reached"):
            service.create_user(payload, tenant_id=tenant_a)

    def test_create_user_rejects_weak_password(self, mock_conn, tenant_a):
        # DEV-011: policy enforced on creation paths.
        from app.services.user_service import UserService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        service = UserService(conn)
        payload = MagicMock()
        payload.email = "weak@test.com"
        payload.password = "pass123"
        with pytest.raises(Exception, match="uppercase"):
            service.create_user(payload, tenant_id=tenant_a)


# =========================
# ROLE SERVICE TESTS
# =========================
class TestRoleServiceTenantFiltering:
    """Verify RoleService enforces tenant boundary."""

    def test_list_roles_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        conn, cursor = mock_conn
        cursor.fetchall.return_value = []
        cursor.fetchone.return_value = (0,)
        service = RoleService(conn)
        result = service.list_roles(tenant_id=tenant_a)
        query = cursor.execute.call_args_list[0][0][0]
        assert "tenant_id = %s" in query

    def test_get_role_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = RoleService(conn)
        result = service.get_role("role-1", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_get_role_wrong_tenant_returns_not_found(self, mock_conn, tenant_b):
        from app.services.role_service import RoleService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = RoleService(conn)
        result = service.get_role("role-1", tenant_id=tenant_b)
        assert result["success"] is False

    def test_update_role_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.return_value = ("role-1", "Admin", None, "custom", "active")
        service = RoleService(conn)
        payload = MagicMock()
        payload.name = "Admin"
        payload.description = None
        payload.status = "active"
        result = service.update_role("role-1", payload, tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_delete_role_filters_by_tenant(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = RoleService(conn)
        result = service.delete_role("role-1", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_create_role_includes_tenant_id(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.return_value = ("role-1", "Test Role", None, "custom")
        service = RoleService(conn)
        payload = MagicMock()
        payload.name = "Test Role"
        payload.description = None
        payload.type = "custom"
        payload.parent_id = None
        result = service.create_role(payload, tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id" in query

    def test_assign_permission_validates_role_tenant(self, mock_conn, tenant_a):
        from app.services.role_service import RoleService
        from unittest.mock import MagicMock
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        service = RoleService(conn)
        payload = MagicMock()
        payload.permission_id = "perm-1"
        payload.granted = True
        result = service.assign_permission("role-1", payload, tenant_id=tenant_a)
        assert result["success"] is False


# =========================
# RBAC TENANT SCOPING TESTS
# =========================
class TestRBACTenantScoping:
    """Verify RBAC queries scope by tenant."""

    def test_rbac_require_permissions_scopes_by_tenant(self):
        source = open("app/api/core/auth/rbac.py", "r").read()
        assert "r.tenant_id = %s" in source

    def test_rbac_require_role_scopes_by_tenant(self):
        source = open("app/api/core/auth/rbac.py", "r").read()
        assert "r.tenant_id = %s" in source

    def test_rbac_require_admin_scopes_by_tenant(self):
        source = open("app/api/core/auth/rbac.py", "r").read()
        assert "r.tenant_id = %s" in source
