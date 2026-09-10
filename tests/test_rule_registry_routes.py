import pytest
from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user, get_current_user_with_tenant

client = TestClient(app)

# Mock authentication (tenant user, NOT Super Admin). Both dependencies
# overridden so require_admin sees the non-admin JWT roles (→ 403).
def mock_tenant_user():
    return {"sub": "test-user", "tenant_id": "11111111-1111-1111-1111-111111111111", "roles": ["admin"]}


@pytest.fixture(autouse=True)
def _hermetic_auth():
    # DEV-003: auth overrides are security-relevant — set per-test so file
    # execution order cannot leak or clear them.
    app.dependency_overrides[get_current_user] = mock_tenant_user
    app.dependency_overrides[get_current_user_with_tenant] = mock_tenant_user
    yield
    app.dependency_overrides.clear()


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
        # DEV-010: global template mutation requires Super Admin — tenant admin gets 403.
        rule_data = {
            "rule_id": "TEST-RULE-001",
            "control_id": "C01",
            "rule_name": "Test Rule",
            "severity_level": "MEDIUM",
            "enabled_flag": True
        }
        response = client.post("/api/v1/rules", json=rule_data)
        assert response.status_code == 403

    def test_update_rule(self):
        # DEV-010: global template mutation requires Super Admin — tenant admin gets 403.
        update_data = {
            "rule_name": "Updated Rule Name"
        }
        response = client.put("/api/v1/rules/TEST-RULE-001", json=update_data)
        assert response.status_code == 403

    def test_delete_rule(self):
        # DEV-010: global template mutation requires Super Admin — tenant admin gets 403.
        response = client.delete("/api/v1/rules/TEST-RULE-001")
        assert response.status_code == 403
