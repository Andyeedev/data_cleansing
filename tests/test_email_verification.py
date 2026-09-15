"""
Tests for Email Verification Flow (Phase 4).
"""
import pytest
from unittest.mock import patch, MagicMock, Mock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.auth_service import AuthService
from app.db.repositories.email_verification_repository import EmailVerificationRepository
from app.services.email_service import EmailServiceFactory
from app.services.email_templates import render_verification


class MockDB:
    def __init__(self, conn):
        self.conn = conn
    def __enter__(self):
        return self
    def __exit__(self, *args):
        pass


class TestEmailVerificationRepository:
    """Test email verification repository."""

    @pytest.fixture(autouse=True)
    def setup_db(self, monkeypatch):
        """Mock database connection."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.repo = EmailVerificationRepository(self.mock_conn)

    def test_create_verification_token(self):
        """Test creating a verification token."""
        self.mock_cur.fetchone.return_value = ("generated-token-" + "x" * 16,)

        token = self.repo.create_verification_token("user-123")

        assert token is not None
        assert len(token) == 32  # uuid4().hex
        # Should have called UPDATE to invalidate old tokens
        calls = self.mock_cur.execute.call_args_list
        assert any("UPDATE" in str(call) and "verified = TRUE" in str(call) for call in calls)

    def test_get_pending_verification_for_update(self):
        """Test getting and locking verification record for consumption."""
        self.mock_cur.fetchone.return_value = ("reset-uuid", "user-123", "abc123", "2026-09-15T10:00:00", False)
        self.mock_cur.description = [
            ("verification_id",), ("user_id",), ("token",), ("expires_at",), ("verified",)
        ]

        verification = self.repo.get_pending_verification_for_update("abc123")

        assert verification is not None
        assert verification["verification_id"] == "reset-uuid"
        assert verification["verified"] is False
        # Check FOR UPDATE was used
        call_args = self.mock_cur.execute.call_args[0][0]
        assert "FOR UPDATE" in call_args

    def test_mark_verified(self):
        """Test marking verification as verified."""
        self.mock_cur.fetchone.return_value = ("reset-uuid",)

        result = self.repo.mark_verified("reset-uuid")
        assert result is True

    def test_get_verification_by_token(self):
        """Test getting verification record by token (without locking)."""
        self.mock_cur.fetchone.return_value = ("reset-uuid", "user-123", "abc123", "2026-09-15T10:00:00", False, "2026-09-15T09:00:00")
        self.mock_cur.description = [
            ("verification_id",), ("user_id",), ("token",), ("expires_at",), ("verified",), ("created_at",)
        ]

        verification = self.repo.get_verification_by_token("abc123")

        assert verification is not None
        assert verification["token"] == "abc123"

    def test_has_valid_verification_token(self):
        """Test checking if user has valid unused verification token."""
        self.mock_cur.fetchone.return_value = (1,)

        result = self.repo.has_valid_verification_token("user-123")
        assert result is True

    def test_has_no_valid_verification_token(self):
        """Test checking when no valid verification token exists."""
        self.mock_cur.fetchone.return_value = None

        result = self.repo.has_valid_verification_token("user-123")
        assert result is False


class TestAuthServiceEmailVerification:
    """Test AuthService email verification methods."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Mock database connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

        def mock_get_db_connection():
            return MockDB(self.mock_conn)

        import app.services.auth_service as auth_module
        monkeypatch.setattr(auth_module, "get_db_connection", mock_get_db_connection)

    def test_create_verification_token_eligible_user(self, monkeypatch):
        """Test creating verification token for active user with active tenant."""
        # Need 3 fetchone calls: user lookup, tenant status, repo.create_verification_token RETURNING
        self.mock_cur.fetchone.side_effect = [
            ("user-123", "active", "tenant-1", False),  # user lookup with email_verified=False
            ("ACTIVE",),  # tenant status
            ("generated-token-" + "x" * 16,),  # repo.create_verification_token RETURNING token
        ]

        token = self.service.create_verification_token("user@example.com")

        assert token is not None
        assert len(token) == 32

    def test_create_verification_token_nonexistent_user(self, monkeypatch):
        """Test creating verification token for non-existent user (enumeration-safe)."""
        self.mock_cur.fetchone.return_value = None

        token = self.service.create_verification_token("nonexistent@example.com")

        assert token is None

    def test_create_verification_token_already_verified(self, monkeypatch):
        """Test creating verification token for already verified user."""
        self.mock_cur.fetchone.return_value = ("user-123", "active", "tenant-1", True)

        token = self.service.create_verification_token("verified@example.com")

        assert token is None

    def test_create_verification_token_inactive_user(self, monkeypatch):
        """Test creating verification token for inactive user (enumeration-safe)."""
        self.mock_cur.fetchone.return_value = ("user-123", "inactive", "tenant-1", False)

        token = self.service.create_verification_token("user@example.com")

        assert token is None

    def test_create_verification_token_suspended_tenant(self, monkeypatch):
        """Test creating verification token for user with suspended tenant (enumeration-safe)."""
        self.mock_cur.fetchone.side_effect = [
            ("user-123", "active", "tenant-1", False),  # user lookup
            ("SUSPENDED",),  # tenant status
        ]

        token = self.service.create_verification_token("user@example.com")

        assert token is None

    def test_create_verification_token_deleted_user(self, monkeypatch):
        """Test creating verification token for deleted user (enumeration-safe)."""
        self.mock_cur.fetchone.return_value = None

        token = self.service.create_verification_token("deleted@example.com")

        assert token is None


class TestAuthServiceVerifyEmail:
    """Test verify_email method."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Mock database connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

        # Mock the internal methods
        self.service._update_password = Mock()
        self.service._get_token_version = Mock(return_value=5)

    def test_verify_email_success(self, monkeypatch):
        """Test successful email verification."""
        import app.services.auth_service as auth_module

        # Mock the EmailVerificationRepository at module level
        mock_repo = MagicMock()
        mock_repo.get_pending_verification_for_update.return_value = {
            "verification_id": "ver-uuid",
            "user_id": "user-123",
        }
        mock_repo.mark_verified.return_value = True

        monkeypatch.setattr(auth_module, "EmailVerificationRepository", lambda conn: mock_repo)
        monkeypatch.setattr("app.services.auth_service.get_db_connection", lambda: MockDB(self.mock_conn))

        result = self.service.verify_email("valid-token")

        assert result["success"] is True
        assert "Email verified successfully" in result["message"]
        # Should have updated user email_verified = TRUE
        calls = self.mock_cur.execute.call_args_list
        update_calls = [c for c in calls if "UPDATE platform.users" in str(c) and "email_verified" in str(c)]
        assert len(update_calls) >= 1

    def test_verify_email_invalid_token(self, monkeypatch):
        """Test verification with invalid/expired/used token."""
        import app.services.auth_service as auth_module

        mock_repo = MagicMock()
        mock_repo.get_pending_verification_for_update.return_value = None
        monkeypatch.setattr(auth_module, "EmailVerificationRepository", lambda conn: mock_repo)
        monkeypatch.setattr("app.services.auth_service.get_db_connection", lambda: MockDB(self.mock_conn))

        with pytest.raises(Exception) as exc:
            self.service.verify_email("invalid-token")
        assert "Invalid or expired verification token" in str(exc.value)

    def test_verify_email_already_verified(self, monkeypatch):
        """Test verification with already verified token."""
        import app.services.auth_service as auth_module

        mock_repo = MagicMock()
        mock_repo.get_pending_verification_for_update.return_value = None
        monkeypatch.setattr(auth_module, "EmailVerificationRepository", lambda conn: mock_repo)
        monkeypatch.setattr("app.services.auth_service.get_db_connection", lambda: MockDB(self.mock_conn))

        with pytest.raises(Exception) as exc:
            self.service.verify_email("already-used-token")
        assert "Invalid or expired" in str(exc.value)


class TestAuthServiceResendVerification:
    """Test resend_verification method."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Mock database connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

    def test_resend_verification_eligible_user(self, monkeypatch):
        """Test resend for eligible user."""
        # Mock create_verification_token to return a token
        self.service.create_verification_token = Mock(return_value="test-token-xyz")

        # Mock email service - patch where it's defined
        mock_email_service = MagicMock()
        mock_email_service.send.return_value = MagicMock(success=True)
        monkeypatch.setattr("app.services.email_service.EmailServiceFactory", MagicMock(get_instance=MagicMock(return_value=mock_email_service)))

        # Mock get_db_connection for create_verification_token
        monkeypatch.setattr("app.services.auth_service.get_db_connection", lambda: MockDB(self.mock_conn))

        result = self.service.resend_verification("user@example.com")

        assert result["success"] is True
        assert "If the email exists and is eligible" in result["message"]

    def test_resend_verification_ineligible_user(self, monkeypatch):
        """Test resend for ineligible user (enumeration-safe)."""
        self.service.create_verification_token = Mock(return_value=None)

        result = self.service.resend_verification("ineligible@example.com")

        assert result["success"] is True
        assert "If the email exists and is eligible" in result["message"]


class TestAuthServiceLoginWithEmailVerified:
    """Test login with email_verified check."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Setup mock connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

    def test_login_rejects_unverified_email(self):
        """Test that login rejects unverified email."""
        import bcrypt
        password_hash = bcrypt.hashpw("password".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        self.mock_cur.fetchone.side_effect = [
            ("user-123", "test@example.com", password_hash, "tenant-1", "active", False, 0, None, 0),
            ("ACTIVE",),
        ]
        self.mock_cur.fetchall.return_value = [("admin",)]

        with pytest.raises(Exception) as exc:
            self.service.login("test@example.com", "password")
        assert "Email not verified" in str(exc.value)

    def test_login_allows_verified_email(self):
        """Test that login allows verified email."""
        import bcrypt
        password_hash = bcrypt.hashpw("password".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        self.mock_cur.fetchone.side_effect = [
            ("user-123", "test@example.com", password_hash, "tenant-1", "active", True, 0, None, 0),
            ("ACTIVE",),
        ]
        self.mock_cur.fetchall.return_value = [("admin",)]

        result = self.service.login("test@example.com", "password")

        assert "access_token" in result
        assert result["token_type"] == "bearer"


class TestEmailVerificationTemplates:
    """Test email verification template rendering."""

    def test_render_verification(self):
        """Test verification template rendering."""
        from app.services.email_templates import render_verification

        html = render_verification(
            verify_url="https://example.com/verify/abc123",
            first_name="John"
        )

        assert "https://example.com/verify/abc123" in html
        assert "John" in html
        assert "Verify your email address" in html

    def test_render_verification_empty_first_name(self):
        """Test verification with empty first name uses fallback."""
        from app.services.email_templates import render_verification

        html = render_verification(
            verify_url="https://example.com/verify/abc123",
            first_name=""
        )
        assert "there" in html.lower()


class TestEmailVerificationRateLimiting:
    """Test rate limiting for email verification endpoints."""

    def test_verify_email_rate_limiter_exists(self):
        """Verify rate limit function exists for public endpoints."""
        from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint

        # Should allow 5 requests
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.200", max_requests=5, window_seconds=3600)

        # 6th should raise 429
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            rate_limit_public_endpoint("192.168.1.200", max_requests=5, window_seconds=3600)
        assert exc.value.status_code == 429

    def test_resend_verification_rate_limiter_exists(self):
        """Same rate limiter used for resend-verification."""
        from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.201", max_requests=5, window_seconds=3600)

        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            rate_limit_public_endpoint("192.168.1.201", max_requests=5, window_seconds=3600)
        assert exc.value.status_code == 429


class TestEmailVerificationIntegration:
    """Integration-style tests."""

    def test_verification_flow_invalidates_old_tokens(self):
        """Test that creating new verification token invalidates old ones."""
        mock_conn = MagicMock()
        mock_cur = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cur
        mock_cur.fetchone.return_value = ("new-token",)

        repo = EmailVerificationRepository(mock_conn)
        token = repo.create_verification_token("user-123")

        # Should have called UPDATE to invalidate old tokens
        calls = mock_cur.execute.call_args_list
        invalidate_calls = [c for c in calls if "UPDATE platform.email_verifications" in str(c) and "verified = TRUE" in str(c)]
        assert len(invalidate_calls) >= 1

    def test_concurrent_verification(self):
        """Test concurrent verification uses FOR UPDATE."""
        from app.db.repositories.email_verification_repository import EmailVerificationRepository

        mock_conn = MagicMock()
        mock_cur = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cur
        repo = EmailVerificationRepository(mock_conn)

        # Verify FOR UPDATE is used in the query
        mock_cur.fetchone.return_value = None
        repo.get_pending_verification_for_update("token")

        call_args = mock_cur.execute.call_args[0][0]
        assert "FOR UPDATE" in call_args


class TestEmailVerificationAlreadyVerifiedResend:
    """Test resend for already verified users."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

    def test_resend_verification_already_verified(self, monkeypatch):
        """Test resend for already verified user returns 200 but sends no email."""
        # Mock create_verification_token to return None (already verified)
        self.service.create_verification_token = Mock(return_value=None)

        result = self.service.resend_verification("verified@example.com")

        assert result["success"] is True
        assert "If the email exists and is eligible" in result["message"]


class TestEmailVerificationAPI:
    """Integration tests for email verification API endpoints."""

    def test_verify_email_endpoint_exists(self):
        """Test that verify-email endpoint is registered."""
        from app.api.routes.auth_routes import router
        routes = [route.path for route in router.routes]
        assert "/api/v1/auth/verify-email" in routes

    def test_resend_verification_endpoint_exists(self):
        """Test that resend-verification endpoint is registered."""
        from app.api.routes.auth_routes import router
        routes = [route.path for route in router.routes]
        assert "/api/v1/auth/resend-verification" in routes

    def test_verify_email_request_model(self):
        """Test VerifyEmailRequest model."""
        from app.api.routes.auth_routes import VerifyEmailRequest
        req = VerifyEmailRequest(token="abc123")
        assert req.token == "abc123"

    def test_resend_verification_request_model(self):
        """Test ResendVerificationRequest model."""
        from app.api.routes.auth_routes import ResendVerificationRequest
        req = ResendVerificationRequest(email="test@example.com")
        assert req.email == "test@example.com"

    def test_rate_limit_applied_to_verify_email(self):
        """Test that rate limiting is applied to verify-email."""
        import inspect
        from app.api.routes.auth_routes import verify_email
        source = inspect.getsource(verify_email)
        assert "rate_limit_public_endpoint" in source

    def test_rate_limit_applied_to_resend_verification(self):
        """Test that rate limiting is applied to resend-verification."""
        import inspect
        from app.api.routes.auth_routes import resend_verification
        source = inspect.getsource(resend_verification)
        assert "rate_limit_public_endpoint" in source


class TestEmailVerificationEnumerationPrevention:
    """Test enumeration prevention in email verification flow."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = AuthService()

    def test_create_verification_token_same_response_all_cases(self):
        """Test that create_verification_token returns None for all ineligible cases."""
        cases = [
            ("nonexistent@example.com", None),
            ("inactive@example.com", ("user-1", "inactive", "tenant-1", False)),
            ("suspended@example.com", [("user-2", "active", "tenant-2", False), ("SUSPENDED",)]),
            ("already_verified@example.com", ("user-3", "active", "tenant-3", True)),
        ]

        for email, mock_return in cases:
            if isinstance(mock_return, list):
                self.mock_cur.fetchone.side_effect = mock_return
            else:
                self.mock_cur.fetchone.return_value = mock_return

            token = self.service.create_verification_token(email)
            assert token is None, f"Should return None for {email}"

    def test_create_verification_token_active_user_active_tenant(self, monkeypatch):
        """Test that active user with active tenant gets a token."""
        import app.services.auth_service as auth_module

        def mock_get_db_connection():
            return MockDB(self.mock_conn)

        monkeypatch.setattr("app.services.auth_service.get_db_connection", mock_get_db_connection)

        self.mock_cur.fetchone.side_effect = [
            ("user-1", "active", "tenant-1", False),  # user lookup
            ("ACTIVE",),  # tenant status
            ("generated-token-" + "x" * 16,),  # repo.create_verification_token RETURNING token
        ]

        token = self.service.create_verification_token("active@example.com")
        assert token is not None
        assert len(token) == 32


# Run the tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])