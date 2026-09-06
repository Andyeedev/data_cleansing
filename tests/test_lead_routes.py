from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user


def _mock_super_admin():
    return {"sub": "admin@test.com", "roles": ["Super Admin"], "email": "admin@test.com"}


def _mock_tenant_admin():
    return {"sub": "tenant@test.com", "roles": ["Tenant Admin"], "email": "tenant@test.com"}


def _mock_team_member():
    return {"sub": "member@test.com", "roles": ["Team Member"], "email": "member@test.com"}


def _mock_viewer():
    return {"sub": "viewer@test.com", "roles": ["Viewer"], "email": "viewer@test.com"}


def _get_client(user_override):
    app.dependency_overrides[get_current_user] = user_override
    return TestClient(app)


class TestListLeadsAuthentication:

    def test_anonymous_access_returns_401(self):
        app.dependency_overrides.pop(get_current_user, None)
        client = TestClient(app)
        response = client.get("/api/v1/leads")
        assert response.status_code == 401

    def test_super_admin_access_returns_200(self):
        client = _get_client(_mock_super_admin)
        response = client.get("/api/v1/leads")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)

    def test_tenant_admin_access_returns_200(self):
        client = _get_client(_mock_tenant_admin)
        response = client.get("/api/v1/leads")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_team_member_returns_403(self):
        client = _get_client(_mock_team_member)
        response = client.get("/api/v1/leads")
        assert response.status_code == 403
        data = response.json()
        assert "Admin access required" in data["detail"]

    def test_viewer_returns_403(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/leads")
        assert response.status_code == 403


class TestListLeadsResponse:

    def test_response_has_correct_structure(self):
        client = _get_client(_mock_super_admin)
        response = client.get("/api/v1/leads")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert "data" in data
        assert isinstance(data["data"], list)

    def test_lead_record_has_expected_fields(self):
        client = _get_client(_mock_super_admin)
        response = client.get("/api/v1/leads")
        data = response.json()
        if len(data["data"]) > 0:
            lead = data["data"][0]
            assert "lead_id" in lead
            assert "full_name" in lead
            assert "work_email" in lead
            assert "company" in lead
            assert "industry" in lead
            assert "role" in lead
            assert "challenge" in lead
            assert "source_form" in lead
            assert "created_at" in lead


class TestCreateLeadUnchanged:

    def test_post_lead_still_works_without_auth(self):
        app.dependency_overrides.pop(get_current_user, None)
        client = TestClient(app)
        response = client.post("/api/v1/leads", json={
            "full_name": "Test User",
            "work_email": "test@example.com",
            "company": "Test Corp",
            "industry": "Technology",
            "role": "Engineer",
            "challenge": "Data quality",
            "source_form": "get_started"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_post_lead_with_optional_fields(self):
        app.dependency_overrides.pop(get_current_user, None)
        client = TestClient(app)
        response = client.post("/api/v1/leads", json={
            "full_name": "Test User 2",
            "work_email": "test2@example.com"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
