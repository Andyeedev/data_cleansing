from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user


def _mock_admin():
    return {"sub": "test@test.com", "roles": ["Super Admin"], "email": "test@test.com"}


def _mock_viewer():
    return {"sub": "viewer@test.com", "roles": ["Viewer"], "email": "viewer@test.com"}


def _get_client(user_override):
    app.dependency_overrides[get_current_user] = user_override
    return TestClient(app)


class TestGovernanceAuditEndpoint:

    def test_get_audit_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/audit")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_audit_has_entries(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/audit")
        data = response.json()
        assert "entries" in data["data"]
        assert isinstance(data["data"]["entries"], list)

    def test_get_audit_limit_parameter(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/audit?limit=10")
        assert response.status_code == 200

    def test_get_audit_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/governance/audit")
        assert response.status_code == 403


class TestGovernanceApprovalsEndpoint:

    def test_get_approvals_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/approvals")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_approvals_has_pending(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/approvals")
        data = response.json()
        assert "pending" in data["data"]
        assert isinstance(data["data"]["pending"], list)

    def test_get_approvals_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/governance/approvals")
        assert response.status_code == 403


class TestGovernanceExceptionsEndpoint:

    def test_get_exceptions_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/exceptions")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_exceptions_has_data(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/exceptions")
        data = response.json()
        assert "exceptions" in data["data"]

    def test_get_exceptions_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/governance/exceptions")
        assert response.status_code == 403


class TestGovernanceComplianceEndpoint:

    def test_get_compliance_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/governance/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_compliance_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/governance/compliance")
        assert response.status_code == 403