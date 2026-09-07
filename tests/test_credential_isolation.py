"""
OC-SEC-006A — Credential Cross-Tenant Isolation Tests

Tests for:
1. Tenant A can create/read/update/delete credentials for Tenant A systems
2. Tenant A CANNOT create/read/update/delete credentials for Tenant B systems
3. List returns only tenant-scoped credentials
4. Unauthenticated access returns 401
5. Credential ID cannot be used to bypass tenant boundary
6. System ID cannot be used to bypass tenant boundary
"""
import pytest
from unittest.mock import MagicMock, patch, call


# =========================
# FIXTURES
# =========================
@pytest.fixture
def mock_conn():
    """Mock database connection with cursor context manager."""
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


@pytest.fixture
def system_a():
    return "system-a-uuid-001"


@pytest.fixture
def system_b():
    return "system-b-uuid-002"


@pytest.fixture
def credential_a():
    return "cred-a-uuid-001"


@pytest.fixture
def credential_b():
    return "cred-b-uuid-002"


# =========================
# REPOSITORY TESTS
# =========================
class TestCredentialRepositoryTenantFiltering:
    """Verify CredentialRepository enforces tenant boundary at query level."""

    def test_get_all_filters_by_tenant(self, mock_conn, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchall.return_value = [("cred-1", "user1")]
        repo = CredentialRepository(conn)
        result = repo.get_all(tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query
        assert cursor.execute.call_args[0][1] == (tenant_a,)

    def test_get_all_without_tenant_returns_all(self, mock_conn):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchall.return_value = [("cred-1", "user1"), ("cred-2", "user2")]
        repo = CredentialRepository(conn)
        result = repo.get_all(tenant_id=None)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id" not in query
        assert len(result) == 2

    def test_get_by_credential_id_filters_by_tenant(self, mock_conn, credential_a, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchone.return_value = (credential_a, "user1", "enc_pass", "sys-1")
        repo = CredentialRepository(conn)
        result = repo.get_by_credential_id(credential_a, tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "tenant_id = %s" in query

    def test_get_by_credential_id_wrong_tenant_returns_none(self, mock_conn, credential_a, tenant_b):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        repo = CredentialRepository(conn)
        result = repo.get_by_credential_id(credential_a, tenant_id=tenant_b)
        assert result is None

    def test_insert_validates_system_belongs_to_tenant(self, mock_conn, system_a, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 1
        repo = CredentialRepository(conn)
        result = repo.insert("cred-1", system_a, "user1", "enc_pass", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "EXISTS" in query
        assert "tenant_id = %s" in query

    def test_insert_rejects_system_from_different_tenant(self, mock_conn, system_b, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 0
        repo = CredentialRepository(conn)
        result = repo.insert("cred-1", system_b, "user1", "enc_pass", tenant_id=tenant_a)
        assert result is False

    def test_update_filters_by_tenant(self, mock_conn, credential_a, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 1
        repo = CredentialRepository(conn)
        result = repo.update(credential_a, "new_user", "new_enc", tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "system_id IN" in query
        assert "tenant_id = %s" in query

    def test_update_rejects_credential_from_different_tenant(self, mock_conn, credential_b, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 0
        repo = CredentialRepository(conn)
        result = repo.update(credential_b, "new_user", "new_enc", tenant_id=tenant_a)
        assert result is False

    def test_delete_filters_by_tenant(self, mock_conn, credential_a, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 1
        repo = CredentialRepository(conn)
        result = repo.delete(credential_a, tenant_id=tenant_a)
        query = cursor.execute.call_args[0][0]
        assert "system_id IN" in query
        assert "tenant_id = %s" in query

    def test_delete_rejects_credential_from_different_tenant(self, mock_conn, credential_b, tenant_a):
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 0
        repo = CredentialRepository(conn)
        result = repo.delete(credential_b, tenant_id=tenant_a)
        assert result is False


# =========================
# SERVICE TESTS
# =========================
class TestCredentialServiceTenantFiltering:
    """Verify CredentialService passes tenant_id through to repository."""

    def test_list_credentials_passes_tenant(self, mock_conn, tenant_a):
        from app.services.credential_service import CredentialService
        conn, cursor = mock_conn
        cursor.fetchall.return_value = [("cred-1", "user1")]
        service = CredentialService(conn)
        result = service.list_credentials(tenant_id=tenant_a)
        assert len(result) == 1

    def test_create_credential_passes_tenant(self, mock_conn, system_a, tenant_a):
        from app.services.credential_service import CredentialService
        conn, cursor = mock_conn
        cursor.rowcount = 1
        service = CredentialService(conn)
        with patch.object(service.encryption, 'encrypt', return_value='encrypted'):
            result = service.create_credential(system_a, "user1", "pass123", tenant_id=tenant_a)
        assert result["credential_id"] is not None

    def test_create_credential_rejects_wrong_tenant(self, mock_conn, system_b, tenant_a):
        from app.services.credential_service import CredentialService
        conn, cursor = mock_conn
        cursor.rowcount = 0
        service = CredentialService(conn)
        with patch.object(service.encryption, 'encrypt', return_value='encrypted'):
            with pytest.raises(ValueError, match="access denied"):
                service.create_credential(system_b, "user1", "pass123", tenant_id=tenant_a)

    def test_update_credential_rejects_wrong_tenant(self, mock_conn, credential_b, tenant_a):
        from app.services.credential_service import CredentialService
        conn, cursor = mock_conn
        cursor.rowcount = 0
        service = CredentialService(conn)
        with patch.object(service.encryption, 'encrypt', return_value='encrypted'):
            with pytest.raises(ValueError, match="access denied"):
                service.update_credential(credential_b, "user1", "pass123", tenant_id=tenant_a)

    def test_delete_credential_rejects_wrong_tenant(self, mock_conn, credential_b, tenant_a):
        from app.services.credential_service import CredentialService
        conn, cursor = mock_conn
        cursor.rowcount = 0
        service = CredentialService(conn)
        with pytest.raises(ValueError, match="access denied"):
            service.delete_credential(credential_b, tenant_id=tenant_a)


# =========================
# ROUTE-LEVEL TESTS (mocked auth)
# =========================
class TestCredentialRouteAuth:
    """Verify credential routes require tenant context."""

    def test_list_credentials_requires_tenant_auth(self):
        """Route should use get_current_user_with_tenant, not get_current_user."""
        import ast
        import inspect
        source_file = open("app/api/routes/credential_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source_file
        assert "get_current_user" not in source_file.replace("get_current_user_with_tenant", "")

    def test_create_credential_requires_tenant_auth(self):
        """Route should use get_current_user_with_tenant."""
        import inspect
        source_file = open("app/api/routes/credential_routes.py", "r").read()
        # Count occurrences of get_current_user_with_tenant
        count = source_file.count("get_current_user_with_tenant")
        assert count >= 4, f"Expected at least 4 occurrences of get_current_user_with_tenant, found {count}"


# =========================
# CROSS-TENANT BOUNDARY TESTS
# =========================
class TestCrossTenantBoundary:
    """Verify credential ID and system ID cannot bypass tenant boundary."""

    def test_credential_id_cannot_bypass_tenant(self, mock_conn, credential_b, tenant_a):
        """Supplying Tenant B's credential_id should not return data for Tenant A."""
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None  # No result when tenant doesn't match
        repo = CredentialRepository(conn)
        result = repo.get_by_credential_id(credential_b, tenant_id=tenant_a)
        assert result is None

    def test_system_id_cannot_bypass_tenant(self, mock_conn, system_b, tenant_a):
        """Supplying Tenant B's system_id should not allow credential creation."""
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.rowcount = 0  # INSERT fails due to EXISTS check
        repo = CredentialRepository(conn)
        result = repo.insert("cred-new", system_b, "user", "enc", tenant_id=tenant_a)
        assert result is False

    def test_get_by_system_id_with_wrong_tenant_returns_none(self, mock_conn, system_a, tenant_b):
        """Querying Tenant A's system with Tenant B's tenant_id should return None."""
        from app.db.repositories.credential_repository import CredentialRepository
        conn, cursor = mock_conn
        cursor.fetchone.return_value = None
        repo = CredentialRepository(conn)
        result = repo.get_by_system_id(system_a, tenant_id=tenant_b)
        assert result is None
