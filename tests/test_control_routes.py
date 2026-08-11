import pytest
from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user

client = TestClient(app)


def mock_get_current_user():
    return {"user_id": "test-user", "tenant_id": "test-tenant", "roles": ["admin"]}


app.dependency_overrides[get_current_user] = mock_get_current_user


class TestControlRoutes:

    def test_get_controls(self):
        response = client.get("/api/v1/validation/controls")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "controls" in data["data"]

    def test_get_control_by_id(self):
        response = client.get("/api/v1/validation/controls/C01")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_control_not_found(self):
        response = client.get("/api/v1/validation/controls/NONEXISTENT")
        assert response.status_code == 404

    def test_update_control(self):
        response = client.put("/api/v1/validation/controls/C01", json={"enabled_flag": False})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_controls_with_search(self):
        response = client.get("/api/v1/validation/controls?search=Data")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_controls_with_severity_filter(self):
        response = client.get("/api/v1/validation/controls?severity=HIGH")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_controls_with_status_filter(self):
        response = client.get("/api/v1/validation/controls?status=enabled")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
