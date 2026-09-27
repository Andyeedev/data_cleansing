"""Phase D entitlement endpoint tests (read-only).

Matrix for GET /api/v1/tenants/{tenant_id}/entitlements:
  SA + valid tenant (own or other) -> 200, effective truth
  SA + unknown tenant              -> 404 (never a silent aggregate)
  TA + own tenant                  -> 200
  TA + another tenant              -> 403
  Viewer (even own)                -> 403
  unauthenticated                  -> 401/403 denied

No test here writes to the database.
"""

from fastapi.testclient import TestClient

from app.api.main import app
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.db.connection import get_db_connection
from app.middleware.entitlement_middleware import get_tenant_entitlements


def _live_tenants():
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute("SELECT tenant_id FROM core.tenants ORDER BY tenant_id LIMIT 2")
            rows = cur.fetchall()
            assert len(rows) >= 2, "need two tenants for cross-tenant tests"
            return str(rows[0][0]), str(rows[1][0])


TENANT_A, TENANT_B = _live_tenants()
UNKNOWN_TENANT = "00000000-0000-0000-0000-000000000000"


def _get(user, tenant_id):
    app.dependency_overrides[get_current_user_with_tenant] = lambda: user
    try:
        return TestClient(app).get(f"/api/v1/tenants/{tenant_id}/entitlements")
    finally:
        app.dependency_overrides.pop(get_current_user_with_tenant, None)


def _sa(tenant_id=TENANT_A):
    return {"sub": "sa", "user": "sa@test.com", "tenant_id": tenant_id, "roles": ["Super Admin"]}


def _ta(tenant_id=TENANT_A):
    return {"sub": "ta", "user": "ta@test.com", "tenant_id": tenant_id, "roles": ["Tenant Admin"]}


class TestEntitlementEndpointMatrix:
    def test_sa_own_tenant_returns_effective_truth(self):
        resp = _get(_sa(TENANT_A), TENANT_A)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["tenant_id"] == TENANT_A
        assert data["entitlements"] == sorted(get_tenant_entitlements(TENANT_A))
        assert all(isinstance(key, str) for key in data["entitlements"])

    def test_sa_other_tenant_allowed(self):
        resp = _get(_sa(TENANT_A), TENANT_B)
        assert resp.status_code == 200
        assert resp.json()["data"]["tenant_id"] == TENANT_B
        assert resp.json()["data"]["entitlements"] == sorted(get_tenant_entitlements(TENANT_B))

    def test_sa_unknown_tenant_404_never_aggregate(self):
        resp = _get(_sa(TENANT_A), UNKNOWN_TENANT)
        assert resp.status_code == 404

    def test_ta_own_tenant_allowed(self):
        resp = _get(_ta(TENANT_A), TENANT_A)
        assert resp.status_code == 200
        assert resp.json()["data"]["entitlements"] == sorted(get_tenant_entitlements(TENANT_A))

    def test_ta_other_tenant_denied(self):
        resp = _get(_ta(TENANT_A), TENANT_B)
        assert resp.status_code == 403

    def test_viewer_own_tenant_denied(self):
        viewer = {"sub": "v", "user": "v@test.com", "tenant_id": TENANT_A, "roles": ["Viewer"]}
        resp = _get(viewer, TENANT_A)
        assert resp.status_code == 403

    def test_unauthenticated_denied(self):
        app.dependency_overrides.pop(get_current_user_with_tenant, None)
        resp = TestClient(app).get(f"/api/v1/tenants/{TENANT_A}/entitlements")
        assert resp.status_code in (401, 403)
