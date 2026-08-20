import json
from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user

# Override auth dependency
def mock_get_current_user(request=None, authorization=None):
    return {"sub": "test-user", "roles": ["Super Admin"], "tenant_id": "20cbc0a3-1320-40d9-b1be-cc8b83fd332e"}

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

# Test with exact body from frontend
body = json.dumps({
    "tenant_id": "20cbc0a3-1320-40d9-b1be-cc8b83fd332e",
    "project_id": "4cd2320d-9a90-4e1e-bc3b-43a800e1605b",
    "steps": ["health_check", "auto_discovery", "mapping_verification", "rule_execution", "governance_check"]
})

r = client.post('/api/v1/operations/run', 
    content=body,
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer test'})
print(f"Status: {r.status_code}")
print(f"Body: {r.text[:800]}")
