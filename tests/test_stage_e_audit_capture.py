"""Phase E (E13) audit-capture verification tests (read-only).

Verifies the audit middleware captures method/path/status for admin
actions, redacts sensitive fields on provisioning routes (DEV-008), and
attributes an actor for both Bearer and cookie sessions (E13 cookie fix).

No test here writes to the database: mutating requests are sent without
privileges so route guards reject them AFTER the middleware has logged.
"""

import json
import logging

from fastapi.testclient import TestClient
from jose import jwt

from app.api.main import app
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM


def _audit_records(caplog):
    records = []
    for record in caplog.records:
        if record.name != "audit":
            continue
        message = record.getMessage()
        if "AUDIT | " not in message:
            continue
        records.append(json.loads(message.split("AUDIT | ", 1)[1]))
    return records


def _signed(sub):
    return jwt.encode({"sub": sub, "user": sub, "tenant_id": None}, SECRET_KEY, algorithm=ALGORITHM)


class TestAuditCapture:
    def test_read_captured_with_fields(self, caplog):
        with caplog.at_level(logging.INFO, logger="audit"):
            TestClient(app).get("/api/v1/public/plans")
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/public/plans"]
        assert records, "expected an audit record for the request"
        record = records[-1]
        assert record["method"] == "GET"
        assert record["status"] == 200
        assert "duration_ms" in record

    def test_bearer_actor_attributed(self, caplog):
        headers = {"Authorization": "Bearer " + _signed("bearer-user")}
        with caplog.at_level(logging.INFO, logger="audit"):
            TestClient(app).get("/api/v1/public/plans", headers=headers)
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/public/plans"]
        assert records and records[-1]["user_id"] == "bearer-user"

    def test_cookie_actor_attributed(self, caplog):
        # E13: HttpOnly cookie sessions must attribute like Bearer sessions.
        with caplog.at_level(logging.INFO, logger="audit"):
            TestClient(app).get(
                "/api/v1/public/plans", cookies={"access_token": _signed("cookie-user")}
            )
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/public/plans"]
        assert records and records[-1]["user_id"] == "cookie-user"

    def test_unauthenticated_still_logged_without_actor(self, caplog):
        with caplog.at_level(logging.INFO, logger="audit"):
            TestClient(app).get("/api/v1/public/plans")
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/public/plans"]
        assert records and records[-1]["user_id"] is None

    def test_provisioning_body_redacted(self, caplog):
        # Unauthorized POST: guard rejects AFTER middleware capture, so no
        # tenant is created while redaction is still exercised end to end.
        body = {
            "tenant_name": "Redact Probe",
            "admin_email": "probe@test.com",
            "admin_password": "SuperSecret123!",
            "plan_tier": "professional",
        }
        with caplog.at_level(logging.INFO, logger="audit"):
            resp = TestClient(app).post("/api/v1/tenants", json=body)
        assert resp.status_code in (401, 403)
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/tenants"]
        assert records, "expected an audit record for the rejected POST"
        logged_body = records[-1].get("request_body") or {}
        assert logged_body.get("admin_password") == "***REDACTED***"
        assert "SuperSecret123!" not in json.dumps(records[-1])

    def test_user_provisioning_body_redacted(self, caplog):
        body = {
            "email": "probe@test.com",
            "password": "SuperSecret123!",
            "first_name": "Probe",
            "last_name": "User",
        }
        with caplog.at_level(logging.INFO, logger="audit"):
            resp = TestClient(app).post("/api/v1/users", json=body)
        assert resp.status_code in (401, 403, 422)
        records = [r for r in _audit_records(caplog) if r.get("path") == "/api/v1/users"]
        assert records, "expected an audit record for the rejected POST"
        logged_body = records[-1].get("request_body") or {}
        assert logged_body.get("password") == "***REDACTED***"
        assert "SuperSecret123!" not in json.dumps(records[-1])
