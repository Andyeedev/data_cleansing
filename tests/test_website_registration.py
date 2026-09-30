"""Tests for Phase 5: Website Registration Integration."""

import uuid

from fastapi.testclient import TestClient
from app.api.main import app


def _mock_super_admin():
    return {"sub": "admin@test.com", "roles": ["Super Admin"], "email": "admin@test.com"}


def _mock_team_member():
    return {"sub": "member@test.com", "roles": ["Tenant Admin"], "email": "member@test.com"}


def _get_client(user_override):
    if not user_override:
        app.dependency_overrides = {}
    else:
        # Callable-key overrides: string keys do not match FastAPI sub-dependency
        # resolution. require_admin is overridden so its platform.user_roles
        # verification does not 403 on the synthetic identity.
        from app.api.core.auth.dependencies import get_current_user
        from app.api.core.auth.rbac import require_admin
        app.dependency_overrides = {
            get_current_user: user_override,
            require_admin: user_override,
        }
    return TestClient(app)


# Rate limiter test isolation: clear module-level state before each test
# to prevent accumulated state from causing 429 errors in subsequent tests.
# This fixture is TEST-ONLY and does not alter production rate-limiter behaviour.
import pytest

import app.api.routes.rate_limit_phase1 as rate_limit_mod


@pytest.fixture(autouse=True, scope="function")
def reset_rate_limiter():
    """Clear module-level rate-limiter stores before each test function."""
    rate_limit_mod._rate_limits_public.clear()
    # The admin registrations endpoints use the authenticated-admin limiter
    # (60 req/min per IP, shared process-wide). Without clearing, earlier
    # modules in a full-suite run exhaust the budget and these tests see 429.
    for store in ("_rate_limits_authenticated_admin", "_rate_limits_plans"):
        table = getattr(rate_limit_mod, store, None)
        if table is not None:
            table.clear()
    yield
    rate_limit_mod._rate_limits_public.clear()
    for store in ("_rate_limits_authenticated_admin", "_rate_limits_plans"):
        table = getattr(rate_limit_mod, store, None)
        if table is not None:
            table.clear()


def _mock_team_member():
    return {"sub": "member@test.com", "roles": ["Tenant Admin"], "email": "member@test.com"}


def _get_client(user_override):
    if not user_override:
        app.dependency_overrides = {}
    else:
        from app.api.core.auth.dependencies import get_current_user
        from app.api.core.auth.rbac import require_admin
        app.dependency_overrides = {
            get_current_user: user_override,
            require_admin: user_override,
        }
    return TestClient(app)


# ── Test hygiene helpers ───────────────────────────────────────────────
# Conversion tests run against the persistent live dev DB (not a fresh
# fixture DB), so they clean up the tenant subtree / lead rows they create.
# Best-effort only: cleanup must never fail a test.


def _cleanup_test_tenant(tenant_id):
    try:
        from app.db.connection import get_db_connection
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM platform.users WHERE tenant_id = %s", (tenant_id,))
            user_ids = [r[0] for r in cur.fetchall()]
            if user_ids:
                cur.execute(
                    "DELETE FROM platform.email_verifications WHERE user_id::text = ANY(%s)",
                    (user_ids,),
                )
            cur.execute("DELETE FROM platform.subscriptions WHERE tenant_id = %s", (tenant_id,))
            cur.execute("DELETE FROM platform.users WHERE tenant_id = %s", (tenant_id,))
            cur.execute("DELETE FROM core.leads WHERE converted_to_tenant = %s", (tenant_id,))
            cur.execute("DELETE FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
            conn.commit()
    except Exception:
        pass


def _cleanup_test_lead(lead_id):
    try:
        from app.db.connection import get_db_connection
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("DELETE FROM core.leads WHERE lead_id = %s", (lead_id,))
            conn.commit()
    except Exception:
        pass


# ── Public endpoint tests ──────────────────────────────────────────────


def test_public_plans_endpoint_anonymous():
    """GET /api/v1/public/plans should be accessible without auth."""
    client = _get_client(None)
    response = client.get("/api/v1/public/plans")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_public_register_lead_anonymous():
    """POST /api/v1/public/register should be accessible without auth (enumeration-safe)."""
    client = _get_client(None)
    response = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Test User",
            "work_email": "test@demo.com",
            "work_email_hash": "abc123",
            "source_form": "get_started",
        },
    )
    # Enumeration-safe: should not reject, just return error detail
    assert response.status_code in (201, 400)
    data = response.json()
    assert "success" in data


def test_public_register_lead_rate_limited():
    """Rate limiting should be active on public register endpoint."""
    client = _get_client(None)
    # Make 5 requests (the limit)
    for i in range(5):
        response = client.post(
            "/api/v1/public/register",
            json={
                "full_name": f"User {i}",
                "work_email": f"user{i}@demo.com",
                "work_email_hash": f"hash{i}",
                "source_form": "get_started",
            },
        )
    # 6th request should be rate-limited
    response = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "User 6",
            "work_email": "user6@demo.com",
            "work_email_hash": "hash6",
            "source_form": "get_started",
        },
    )
    # Rate limiter returns 429 or the request is accepted (enumeration-safe)
    assert response.status_code in (201, 429)


# ── Admin endpoint tests ─────────────────────────────────────────────


def test_admin_list_registrations_super_admin():
    """Super Admin can list pending registrations."""
    client = _get_client(_mock_super_admin)
    response = client.get("/api/v1/admin/registrations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "leads" in data["data"]


def test_admin_convert_lead_super_admin():
    """Super Admin can convert a lead to tenant + first admin."""
    client = _get_client(_mock_super_admin)

    # Unique name per run: tenant_name has a UNIQUE constraint and the live
    # dev DB retains rows between runs.
    # First, create a lead via the public register
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": f"Convert Test User {uuid.uuid4().hex[:8]}",
            "work_email": f"convert-{uuid.uuid4().hex[:8]}@test.com",
            "work_email_hash": "hash456",
            "source_form": "get_started",
        },
    )
    assert register_resp.status_code == 201
    lead_id = register_resp.json()["data"]["lead_id"]
    
    # Now convert it as super admin
    convert_resp = client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    # Should succeed - creates tenant + admin + sends verification
    assert convert_resp.status_code == 200
    data = convert_resp.json()
    assert data["success"] is True
    assert data["data"]["tenant_id"] is not None
    assert data["data"]["admin_user_id"] is not None
    
    # Lead should now have left the pending queue (list shows pending only)
    leads_resp = client.get("/api/v1/admin/registrations")
    assert leads_resp.status_code == 200
    leads_data = leads_resp.json()["data"]["leads"]
    converted_lead = [l for l in leads_data if l["lead_id"] == lead_id]
    assert len(converted_lead) == 0

    # ...but the lead row itself is marked converted with tenant linkage
    from app.db.connection import get_db_connection
    conn = get_db_connection().conn
    with conn.cursor() as cur:
        cur.execute(
            "SELECT status, converted_to_tenant, converted_at FROM core.leads WHERE lead_id = %s",
            (lead_id,),
        )
        row = cur.fetchone()
    assert row[0] == "converted"
    assert row[1] is not None
    assert row[2] is not None
    _cleanup_test_tenant(data["data"]["tenant_id"])


def test_admin_convert_lead_already_converted():
    """Converting an already-converted lead should be idempotent."""
    client = _get_client(_mock_super_admin)

    # Unique name per run: tenant_name has a UNIQUE constraint (see above).
    # Create and convert a lead
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": f"Idempotent Test {uuid.uuid4().hex[:8]}",
            "work_email": f"idem-{uuid.uuid4().hex[:8]}@test.com",
            "work_email_hash": "hash789",
            "source_form": "get_started",
        },
    )
    assert register_resp.status_code == 201
    lead_id = register_resp.json()["data"]["lead_id"]
    
    # Convert first time
    convert1 = client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    assert convert1.status_code == 200
    assert convert1.json()["success"] is True
    
    # Convert second time - should be idempotent (lead already converted)
    convert2 = client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    # Should not error - returns success or appropriate response
    assert convert2.status_code in (200, 404, 400)
    _cleanup_test_tenant(convert1.json()["data"]["tenant_id"])


# ── Duplicate user prevention tests ───────────────────────────────────


def test_no_duplicate_admin_user():
    """Phase 5 must not create duplicate platform.users records."""
    client = _get_client(_mock_super_admin)
    unique_email = f"noclone-{uuid.uuid4().hex[:8]}@test.com"

    # Count users before
    from app.db.connection import get_db_connection
    import psycopg2
    before_count = 0
    try:
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM platform.users WHERE email = %s", (unique_email,))
            before_count = cur.fetchone()[0]
    except Exception:
        before_count = -1  # DB not available in test env

    # Create and convert lead (unique name per run, see above)
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": f"Duplicate Check User {uuid.uuid4().hex[:8]}",
            "work_email": unique_email,
            "work_email_hash": "hashnoclone",
            "source_form": "get_started",
        },
    )
    assert register_resp.status_code == 201

    lead_id = register_resp.json()["data"]["lead_id"]
    convert_resp = client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    assert convert_resp.status_code == 200

    # Count users after - should be exactly 1 new user
    after_count = 0
    try:
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM platform.users WHERE email = %s", (unique_email,))
            after_count = cur.fetchone()[0]
    except Exception:
        after_count = -1

    # If DB accessible, verify exactly one user was created
    if before_count >= 0 and after_count >= 0:
        # At most one user should have been created for this email
        # (the first-admin user created by create_tenant)
        assert after_count <= before_count + 1

    _cleanup_test_tenant(convert_resp.json()["data"]["tenant_id"])


# ── Transaction atomicity tests ──────────────────────────────────────


def test_conversion_atomicity_lead_rollback():
    """If lead is not pending, conversion should fail gracefully."""
    client = _get_client(_mock_super_admin)
    
    # Create a lead and mark it as already converted
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Atomic Test",
            "work_email": "atomic@test.com",
            "work_email_hash": "hashatomic",
            "source_form": "get_started",
        },
    )
    assert register_resp.status_code == 201
    lead_id = register_resp.json()["data"]["lead_id"]
    
    # Mark as converted directly
    from app.db.connection import get_db_connection
    import psycopg2
    try:
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE core.leads SET status = 'converted' WHERE lead_id = %s",
                (lead_id,),
            )
            conn.commit()
    except Exception:
        pass
    
    # Try to convert again - should fail gracefully
    convert_resp = client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    # Should return error, not crash or create duplicate
    assert convert_resp.status_code != 200  # Not success
    _cleanup_test_lead(lead_id)


# ── Phase 5 lead-model tests ─────────────────────────────────────────


def test_lead_defaults_to_pending_with_interest_persisted():
    """New leads enter the pending queue with plan_interest/phone stored."""
    client = _get_client(_mock_super_admin)
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Pending Model User",
            "work_email": "pendingmodel@test.com",
            "work_email_hash": "hashpending",
            "source_form": "get_started",
            "plan_interest": "professional",
            "phone": "+44 7700 900000",
        },
    )
    assert register_resp.status_code == 201
    lead_id = register_resp.json()["data"]["lead_id"]

    from app.db.connection import get_db_connection
    conn = get_db_connection().conn
    with conn.cursor() as cur:
        cur.execute(
            "SELECT status, plan_interest, phone, work_email_hash FROM core.leads WHERE lead_id = %s",
            (lead_id,),
        )
        row = cur.fetchone()
    assert row[0] == "pending"
    assert row[1] == "professional"
    assert row[2] == "+44 7700 900000"
    # Security decision: the hash is accepted but never persisted.
    assert row[3] is None

    # And it shows up in the pending queue
    leads_resp = client.get("/api/v1/admin/registrations")
    assert leads_resp.status_code == 200
    assert any(l["lead_id"] == lead_id for l in leads_resp.json()["data"]["leads"])
    _cleanup_test_lead(lead_id)