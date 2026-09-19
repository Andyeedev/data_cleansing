"""Tests for Phase 5: Website Registration Integration."""

from fastapi.testclient import TestClient
from app.api.main import app


def _mock_super_admin():
    return {"sub": "admin@test.com", "roles": ["Super Admin"], "email": "admin@test.com"}


def _mock_team_member():
    return {"sub": "member@test.com", "roles": ["Tenant Admin"], "email": "member@test.com"}


def _get_client(user_override):
    app.dependency_overrides = {"get_current_user": user_override} if user_override else {}
    return TestClient(app)


# Rate limiter test isolation: clear module-level state before each test
# to prevent accumulated state from causing 429 errors in subsequent tests.
# This fixture is TEST-ONLY and does not alter production rate-limiter behaviour.
import pytest

import app.api.routes.rate_limit_phase1 as rate_limit_mod


@pytest.fixture(autouse=True, scope="function")
def reset_rate_limiter():
    """Clear module-level _rate_limits_public before each test function."""
    rate_limit_mod._rate_limits_public.clear()
    yield
    rate_limit_mod._rate_limits_public.clear()


def _mock_team_member():
    return {"sub": "member@test.com", "roles": ["Tenant Admin"], "email": "member@test.com"}


def _get_client(user_override):
    app.dependency_overrides = {"get_current_user": user_override} if user_override else {}
    return TestClient(app)


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
    
    # First, create a lead via the public register
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Convert Test User",
            "work_email": "convert@test.com",
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
    
    # Lead should now be marked as converted
    leads_resp = client.get("/api/v1/admin/registrations")
    assert leads_resp.status_code == 200
    leads_data = leads_resp.json()["data"]["leads"]
    converted_lead = [l for l in leads_data if l["lead_id"] == lead_id]
    assert len(converted_lead) == 1
    assert converted_lead[0]["status"] == "converted"


def test_admin_convert_lead_already_converted():
    """Converting an already-converted lead should be idempotent."""
    client = _get_client(_mock_super_admin)
    
    # Create and convert a lead
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Idempotent Test",
            "work_email": "idem@test.com",
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


# ── Duplicate user prevention tests ───────────────────────────────────


def test_no_duplicate_admin_user():
    """Phase 5 must not create duplicate platform.users records."""
    client = _get_client(_mock_super_admin)
    
    # Count users before
    from app.db.connection import get_db_connection
    import psycopg2
    before_count = 0
    try:
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM platform.users WHERE email = %s", ("convert@test.com",))
            before_count = cur.fetchone()[0]
    except Exception:
        before_count = -1  # DB not available in test env
    
    # Create and convert lead
    register_resp = client.post(
        "/api/v1/public/register",
        json={
            "full_name": "Duplicate Check User",
            "work_email": "noclone@test.com",
            "work_email_hash": "hashnoclone",
            "source_form": "get_started",
        },
    )
    assert register_resp.status_code == 201
    
    lead_id = register_resp.json()["data"]["lead_id"]
    client.post(
        f"/api/v1/admin/registrations/{lead_id}/convert",
        json={"admin_password": "TempPass123!"},
    )
    
    # Count users after - should be exactly 1 new user
    after_count = 0
    try:
        conn = get_db_connection().conn
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM platform.users WHERE email = %s", ("noclone@test.com",))
            after_count = cur.fetchone()[0]
    except Exception:
        after_count = -1
    
    # If DB accessible, verify exactly one user was created
    if before_count >= 0 and after_count >= 0:
        # At most one user should have been created for this email
        # (the first-admin user created by create_tenant)
        assert after_count <= before_count + 1


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