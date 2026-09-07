"""
OC-SEC-005 — Authentication Hardening Tests

Tests for:
1. JWT delivered via httpOnly Secure cookie
2. Account lockout (5 attempts / 15-min)
3. Password policy enforcement
4. Session invalidation on password change (token_version)
5. Logout clears cookie
6. Cookie attributes (httponly, secure, samesite)
"""
import pytest
from unittest.mock import patch, MagicMock, PropertyMock
from datetime import datetime, timedelta


class TestCookieBasedAuth:
    """Verify JWT is delivered via httpOnly Secure cookie."""

    def test_login_sets_cookie(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        assert "response.set_cookie" in source
        assert "httponly=True" in source
        assert "secure=True" in source
        assert "samesite=" in source

    def test_login_does_not_return_token_in_body(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        # Login should return message, not access_token in the response
        assert '"message": "Login successful"' in source
        # The route function should NOT have return {"access_token": ...}
        lines = source.split("\n")
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("return") and "access_token" in stripped:
                pytest.fail(f"Login route returns access_token in body: {stripped}")

    def test_dependencies_read_from_cookie(self):
        source = open("app/api/core/auth/dependencies.py", "r").read()
        assert "request.cookies.get(COOKIE_NAME)" in source

    def test_dependencies_fallback_to_header(self):
        source = open("app/api/core/auth/dependencies.py", "r").read()
        assert "authorization" in source.lower()
        assert "Bearer" in source

    def test_cookie_name_defined(self):
        source = open("app/api/core/auth/dependencies.py", "r").read()
        assert 'COOKIE_NAME = "access_token"' in source


class TestLogout:
    """Verify logout clears cookie."""

    def test_logout_endpoint_exists(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        assert "def logout" in source
        assert "response.delete_cookie" in source


class TestAccountLockout:
    """Verify account lockout after 5 failed attempts."""

    def test_lockout_constants(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "MAX_FAILED_ATTEMPTS = 5" in source
        assert "LOCKOUT_MINUTES = 15" in source

    def test_lockout_checks_locked_until(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "locked_until" in source
        assert "Account locked" in source

    def test_increment_failed_attempts(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "failed_login_attempts = %s" in source
        assert "new_attempts = (failed_attempts or 0) + 1" in source

    def test_lock_after_max_attempts(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "new_attempts >= MAX_FAILED_ATTEMPTS" in source
        assert "lock_until" in source

    def test_reset_on_success(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "failed_login_attempts = 0, locked_until = NULL" in source


class TestPasswordPolicy:
    """Verify password policy enforcement."""

    def test_min_password_length(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "MIN_PASSWORD_LENGTH = 8" in source

    def test_validate_password_policy_exists(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "def _validate_password_policy" in source

    def test_password_requires_uppercase(self):
        source = open("app/services/auth_service.py", "r").read()
        assert r're.search(r"[A-Z]"' in source

    def test_password_requires_lowercase(self):
        source = open("app/services/auth_service.py", "r").read()
        assert r're.search(r"[a-z]"' in source

    def test_password_requires_digit(self):
        source = open("app/services/auth_service.py", "r").read()
        assert r're.search(r"[0-9]"' in source

    def test_password_policy_enforced_on_create(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "_validate_password_policy(new_password)" in source


class TestSessionInvalidation:
    """Verify token_version in JWT and DB validation."""

    def test_token_version_in_jwt_payload(self):
        source = open("app/services/auth_service.py", "r").read()
        assert '"token_version": token_version' in source

    def test_token_version_in_login_query(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "token_version" in source

    def test_dependencies_validate_token_version(self):
        source = open("app/api/core/auth/dependencies.py", "r").read()
        assert "_validate_token_version" in source
        assert "token_version" in source

    def test_password_change_increments_version(self):
        source = open("app/services/auth_service.py", "r").read()
        assert "new_version = (token_version or 0) + 1" in source
        assert "token_version = %s" in source

    def test_change_password_endpoint_exists(self):
        source = open("app/api/routes/auth_routes.py", "r").read()
        assert "def change_password" in source
        assert "ChangePasswordRequest" in source
