"""
OC-COM-001d Phase 1 — acceptance tests for the authorized P0 corrections.

Covers (per the security acceptance criteria + required evidence):
1. Tenant A cannot access Tenant B resources (override ignored).
2. Project A cannot access Project B resources (same tenant).
3. Client tenant_id cannot override JWT tenancy.
4. Systems are project-scoped (create requires owned project).
5. Credentials transitively scoped (repo JOIN derivation).
6. Suspended tenants cannot establish sessions.
7. No hardcoded roles (/me is authoritative).
8. (RoleSwitcher removal is a frontend change — verified by absence.)
9. No passwords in audit/application logs.
10. Entitlement + max_* enforced on creation paths.
11. Project selection cannot exceed backend-authorised projects.
"""
import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI

TENANT_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
TENANT_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
PROJECT_A = "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1"
PROJECT_B = "b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2"


def _tenant_user(tenant_id=TENANT_A):
    return {"sub": "user-1", "tenant_id": tenant_id, "roles": ["admin"]}


def _mock_conn():
    conn = MagicMock()
    cursor = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=cursor)
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn, cursor


# =========================
# 1–4. Systems: JWT wins, projects enforced
# =========================
class TestSystemTenantProjectEnforcement:
    def _client(self):
        from app.api.routes.system_routes import router
        from app.api.core.auth.dependencies import get_current_user
        from app.api.core.auth.dependencies import get_current_user_with_tenant
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user] = lambda: _tenant_user()
        app.dependency_overrides[get_current_user_with_tenant] = lambda: _tenant_user()
        return TestClient(app)

    def _granted(self):
        from app.api.core.auth import rbac as rbac_module
        return patch.object(
            rbac_module,
            "fetch_effective_permissions",
            return_value=[
                ("systems", "list"), ("systems", "read"),
                ("systems", "create"), ("systems", "update"),
                ("systems", "delete"), ("systems", "test"),
            ],
        )

    def test_list_ignores_query_tenant_override(self):
        from app.api.routes import system_routes
        client = self._client()
        with self._granted(), \
             patch.object(system_routes, "SystemService") as mock_svc_cls, \
             patch.object(system_routes, "get_db_connection") as mock_dbc:
            mock_svc_cls.return_value.list_systems.return_value = []
            response = client.get("/api/v1/systems", params={"tenant_id": TENANT_B})
            assert response.status_code == 200
            _, kwargs = mock_svc_cls.return_value.list_systems.call_args
            assert kwargs.get("tenant_id") == TENANT_A

    def test_create_requires_project_id(self):
        client = self._client()
        with self._granted():
            response = client.post("/api/v1/systems", json={
                "system_name": "LEGACY", "system_role": "SOURCE",
                "database_type": "POSTGRES",
                "connection_config": {"host": "h", "port": 5432, "database": "d"},
            })
        assert response.status_code == 422

    def test_create_foreign_project_rejected(self):
        from app.services.system_service import SystemService
        conn, cursor = _mock_conn()
        cursor.fetchone.return_value = (TENANT_B,)  # project owned by B
        service = SystemService(conn)
        payload = MagicMock()
        payload.project_id = PROJECT_B
        with pytest.raises(ValueError, match="access denied"):
            service.create_system(payload, tenant_id=TENANT_A)

    def test_list_foreign_project_rejected(self):
        from app.services.system_service import SystemService
        conn, cursor = _mock_conn()
        cursor.fetchone.return_value = (TENANT_B,)
        service = SystemService(conn)
        with pytest.raises(ValueError, match="access denied"):
            service.list_systems(tenant_id=TENANT_A, project_id=PROJECT_B)

    def test_get_unknown_system_404(self):
        from app.api.routes import system_routes
        client = self._client()
        with self._granted(), \
             patch.object(system_routes, "SystemService") as mock_svc_cls, \
             patch.object(system_routes, "get_db_connection"):
            mock_svc_cls.return_value.get_system.side_effect = Exception("System not found")
            response = client.get("/api/v1/systems/some-id")
            assert response.status_code == 404

    def test_repo_scopes_via_project_join(self):
        from app.db.repositories.system_repository import SystemRepository
        conn, cursor = _mock_conn()
        cursor.fetchall.return_value = []
        repo = SystemRepository(conn)
        repo.get_all(tenant_id=TENANT_A)
        query = cursor.execute.call_args[0][0]
        assert "JOIN core.projects p ON p.project_id = sr.project_id" in query
        assert "p.tenant_id = %s" in query
        code = open("app/db/repositories/system_repository.py").read()
        code_nocomments = "\n".join(
            line for line in code.splitlines() if not line.strip().startswith("#"))
        assert "sr.tenant_id" not in code_nocomments


# =========================
# 5. Credentials transitively scoped
# =========================
class TestCredentialTransitiveScope:
    def test_joins_derive_tenant_via_project(self):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = _mock_conn()
        cursor.fetchone.return_value = None
        repo = CredentialRepository(conn)
        repo.get_by_system_id("sys-1", tenant_id=TENANT_A)
        query = cursor.execute.call_args[0][0]
        assert "JOIN core.projects p ON p.project_id = sr.project_id" in query
        assert "p.tenant_id = %s" in query
        code = open("app/db/repositories/credential_repository.py").read()
        code_nocomments = "\n".join(
            line for line in code.splitlines() if not line.strip().startswith("#"))
        assert "sr.tenant_id" not in code_nocomments


# =========================
# 2/11. Project boundary
# =========================
class TestProjectBoundary:
    def test_foreign_project_resolves_none(self):
        from app.services.migration_project_service import MigrationProjectService
        with patch("app.services.migration_project_service.MigrationProjectRepository") as mock_repo_cls:
            mock_repo_cls.return_value.get_project_tenant.return_value = TENANT_B
            service = MigrationProjectService()
            assert service.get_project_for_tenant(PROJECT_B, TENANT_A) is None

    def test_create_project_enforces_max_projects(self):
        from app.services.migration_project_service import MigrationProjectService
        with patch("app.services.migration_project_service.MigrationProjectRepository") as mock_repo_cls, \
             patch("app.services.tenant_service.TenantService.check_limit") as mock_check:
            mock_check.side_effect = ValueError("Projects limit reached (3/3). Upgrade your plan to add more.")
            service = MigrationProjectService()
            with pytest.raises(ValueError, match="limit reached"):
                service.create_project(TENANT_A, "P1")


# =========================
# 6. Suspended tenants cannot authenticate
# =========================
class TestSuspendedTenantLogin:
    def test_suspended_tenant_rejected(self):
        from app.services.auth_service import AuthService
        with patch("app.services.auth_service.get_db_connection") as mock_dbc:
            conn, cursor = _mock_conn()
            mock_dbc.return_value.conn = conn
            user_row = ("u1", "a@b.c", "xhash", TENANT_A, "active", 0, None, 0)
            cursor.fetchone.side_effect = [user_row, ("SUSPENDED",)]
            with pytest.raises(Exception, match="suspended"):
                AuthService().login("a@b.c", "Whatever1")

    def test_active_tenant_login_succeeds(self):
        import bcrypt
        from app.services.auth_service import AuthService
        password = "Pass1234"
        digest = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        with patch("app.services.auth_service.get_db_connection") as mock_dbc:
            conn, cursor = _mock_conn()
            mock_dbc.return_value.conn = conn
            user_row = ("u1", "a@b.c", digest, TENANT_A, "active", 0, None, 0)
            cursor.fetchone.side_effect = [user_row, ("ACTIVE",)]
            cursor.fetchall.return_value = [("admin",)]
            result = AuthService().login("a@b.c", password)
            assert result["access_token"]
            assert result["token_type"] == "bearer"


# =========================
# 7. /me authoritative, 10. entitlements, 11. hardening, 9. redaction
# =========================
class TestMeEndpoint:
    def test_me_unauthenticated_401(self):
        from app.api.routes.auth_routes import router
        from fastapi import FastAPI as _F
        app = _F()
        app.include_router(router)
        client = TestClient(app)
        assert client.get("/api/v1/auth/me").status_code == 401

    def test_me_returns_structure(self):
        from app.api.routes import auth_routes
        from app.api.core.auth.dependencies import get_current_user_with_tenant
        from fastapi import FastAPI as _F
        app = _F()
        app.include_router(auth_routes.router)
        app.dependency_overrides[get_current_user_with_tenant] = lambda: {
            "sub": "u1", "user": "a@b.c", "tenant_id": TENANT_A, "roles": ["admin"]}
        with patch.object(auth_routes, "get_db_connection") as mock_dbc:
            conn, cursor = _mock_conn()
            conn.__enter__.return_value = conn
            conn.conn = conn
            mock_dbc.return_value = conn
            sub_row = ("professional", "Pro", 5, 3, 5, "ACTIVE", None, "monthly", None)
            cursor.fetchone.side_effect = [sub_row, (5,), (2,), (3,)]
            cursor.fetchall.side_effect = [[("admin",)], [("users:read", "reports:read")]]
            client = TestClient(app)
            response = client.get("/api/v1/auth/me")
            assert response.status_code == 200
            body = response.json()
            data = body["data"]
            assert data["tenant_id"] == TENANT_A
            assert data["roles"] == ["admin"]
            assert "users:read" in data["permissions"]
            assert data["subscription"]["status"] == "ACTIVE"


class TestEntitlementEnforcement:
    def test_unknown_feature_denied(self):
        from app.middleware.entitlement_middleware import require_entitlement
        from fastapi import HTTPException
        dep = require_entitlement("no_such_feature")
        with patch("app.middleware.entitlement_middleware.get_tenant_entitlements",
                   return_value={"migration"}):
            with pytest.raises(HTTPException) as exc:
                dep(current_user={"tenant_id": TENANT_A})
            assert exc.value.status_code == 403

    def test_allowed_feature_passes(self):
        from app.middleware.entitlement_middleware import require_entitlement
        dep = require_entitlement("migration")
        with patch("app.middleware.entitlement_middleware.get_tenant_entitlements",
                   return_value={"migration"}):
            assert dep(current_user={"tenant_id": TENANT_A}) == TENANT_A

    def test_connection_limit_enforced(self):
        from app.services.tenant_service import TenantService
        conn, cursor = _mock_conn()
        cursor.fetchone.side_effect = [(5,), (5,)]
        with pytest.raises(ValueError, match="limit reached"):
            TenantService(conn).check_limit(TENANT_A, "connections")


class TestHardening:
    def test_token_without_version_rejected(self):
        from app.api.core.auth.dependencies import _validate_token_version
        from fastapi import HTTPException
        with pytest.raises(HTTPException):
            _validate_token_version({"sub": "u1"})
        with pytest.raises(HTTPException):
            _validate_token_version({})

    def test_no_password_body_logging(self):
        # DEV-008: audit middleware must never read or log request bodies.
        code = open("app/api/core/middleware/audit_middleware.py").read()
        assert "request.body" not in code
        assert "password" not in code.lower()
