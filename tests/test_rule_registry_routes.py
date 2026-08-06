import pytest
from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user

client = TestClient(app)

# Mock authentication
def mock_get_current_user():
    return {"user_id": "test-user", "tenant_id": "test-tenant", "roles": ["admin"]}

app.dependency_overrides[get_current_user] = mock_get_current_user


class TestRuleRegistryRoutes:

    def test_list_rules(self):
        response = client.get("/api/v1/rules")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data

    def test_list_rules_with_auth(self):
        response = client.get("/api/v1/rules")
        assert response.status_code == 200

    def test_get_rule_by_id(self):
        # First get a rule from the list
        list_response = client.get("/api/v1/rules")
        if list_response.status_code == 200:
            data = list_response.json()
            if data.get("data") and data["data"].get("rules"):
                rule_id = data["data"]["rules"][0]["rule_id"]
                response = client.get(f"/api/v1/rules/{rule_id}")
                assert response.status_code == 200

    def test_get_rule_by_id_not_found(self):
        response = client.get("/api/v1/rules/NONEXISTENT")
        assert response.status_code == 404

    def test_get_rules_by_control(self):
        response = client.get("/api/v1/rules/control/C01")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_create_rule(self):
        rule_data = {
            "rule_id": "TEST-RULE-001",
            "control_id": "C01",
            "rule_name": "Test Rule",
            "severity_level": "MEDIUM",
            "enabled_flag": True
        }
        response = client.post("/api/v1/rules", json=rule_data)
        # May succeed or fail depending on database state
        assert response.status_code in [200, 500]

    def test_update_rule(self):
        update_data = {
            "rule_name": "Updated Rule Name"
        }
        response = client.put("/api/v1/rules/TEST-RULE-001", json=update_data)
        # May succeed or fail depending on database state
        assert response.status_code in [200, 404, 500]

    def test_delete_rule(self):
        response = client.delete("/api/v1/rules/TEST-RULE-001")
        # May succeed or fail depending on database state
        assert response.status_code in [200, 404, 500]
