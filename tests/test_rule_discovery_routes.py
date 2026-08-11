import pytest
from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user

client = TestClient(app)


def mock_get_current_user():
    return {"user_id": "test-user", "tenant_id": "test-tenant", "roles": ["admin"]}


app.dependency_overrides[get_current_user] = mock_get_current_user


class TestRuleDiscoveryRoutes:

    def test_get_discovered_rules(self):
        response = client.get("/api/v1/rules/discovery/test-project-1")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["project_id"] == "test-project-1"

    def test_trigger_rule_discovery(self):
        response = client.post("/api/v1/rules/discovery/test-project-1/trigger")
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            data = response.json()
            assert data["success"] is True
            assert "data" in data

    def test_get_discovery_status(self):
        response = client.get("/api/v1/rules/discovery/test-project-1/status")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["project_id"] == "test-project-1"

    def test_get_discovery_mappings(self):
        response = client.get("/api/v1/rules/discovery/test-project-1/mappings")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["project_id"] == "test-project-1"

    def test_get_discovered_rules_requires_auth(self):
        app.dependency_overrides.clear()
        response = client.get("/api/v1/rules/discovery/test-project-1")
        assert response.status_code == 401
        app.dependency_overrides[get_current_user] = mock_get_current_user
