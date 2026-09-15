"""
Tests for Invitation System (Phase 2).
"""
import pytest
import uuid
from unittest.mock import patch, MagicMock, Mock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.invitation_service import InvitationService
from app.db.repositories.invitation_repository import InvitationRepository
from app.services.email_service import EmailServiceFactory
from app.services.email_templates import render_invitation


class TestInvitationRepository:
    """Test invitation repository."""

    @pytest.fixture(autouse=True)
    def setup_db(self, monkeypatch):
        """Mock database connection."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.repo = InvitationRepository(self.mock_conn)

    def test_create_invitation(self):
        """Test creating an invitation."""
        self.mock_cur.fetchone.return_value = ('test-uuid', 'test@example.com', 'pending', '2026-09-21T10:00:00', '2026-09-14T10:00:00')
        self.mock_cur.description = [
            ('invitation_id',), ('email',), ('status',), ('expires_at',), ('created_at',)
        ]

        result = self.repo.create_invitation('tenant-1', 'test@example.com', 'user-1', 'Welcome!')

        assert result["success"] is True
        assert result["data"]["email"] == 'test@example.com'
        assert result["data"]["status"] == 'pending'
        self.mock_cur.execute.assert_called()

    def test_get_pending_invitation_for_update(self):
        """Test getting and locking invitation for acceptance."""
        self.mock_cur.fetchone.return_value = ('test-uuid', 'tenant-1', 'test@example.com', 'pending', '2026-09-21T10:00:00')
        self.mock_cur.description = [
            ('invitation_id',), ('tenant_id',), ('email',), ('status',), ('expires_at',)
        ]

        invite = self.repo.get_pending_invitation_for_update('valid-token')

        assert invite is not None
        assert invite['invitation_id'] == 'test-uuid'
        # Check FOR UPDATE was used
        call_args = self.mock_cur.execute.call_args[0][0]
        assert 'FOR UPDATE' in call_args

    def test_get_pending_invitation_not_found(self):
        """Test getting non-existent/expired invitation."""
        self.mock_cur.fetchone.return_value = None

        invite = self.repo.get_pending_invitation_for_update('invalid-token')
        assert invite is None

    def test_accept_invitation(self):
        """Test marking invitation as accepted."""
        self.mock_cur.fetchone.return_value = {'invitation_id': 'test-uuid'}

        result = self.repo.accept_invitation('test-uuid')
        assert result is True

    def test_update_user_invitation_id(self):
        """Test linking invitation to user."""
        self.mock_cur.fetchone.return_value = {'id': 'user-1'}

        result = self.repo.update_user_invitation_id('user-1', 'inv-1')
        assert result is True

    def test_revoke_invitation(self):
        """Test revoking an invitation."""
        self.mock_cur.fetchone.return_value = {'invitation_id': 'test-uuid'}

        result = self.repo.revoke_invitation('test-uuid', 'tenant-1')
        assert result is True

    def test_revoke_invitation_not_found(self):
        """Test revoking non-existent invitation."""
        self.mock_cur.fetchone.return_value = None

        result = self.repo.revoke_invitation('test-uuid', 'tenant-1')
        assert result is False

    def test_resend_invitation(self):
        """Test resending invitation with new token."""
        self.mock_cur.fetchone.return_value = ('test-uuid', 'test@example.com', 'pending', '2026-09-21T10:00:00', '2026-09-14T10:00:00')
        self.mock_cur.description = [
            ('invitation_id',), ('email',), ('status',), ('expires_at',), ('created_at',)
        ]

        result = self.repo.resend_invitation('test-uuid', 'tenant-1', 'user-1')
        assert result is not None
        assert result['invitation_id'] == 'test-uuid'


class TestInvitationService:
    """Test invitation service business logic."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Setup mock connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = InvitationService(self.mock_conn)

    def test_create_invitation(self):
        """Test creating invitation through service."""
        self.mock_cur.fetchone.return_value = ('test-uuid', 'test@example.com', 'pending', '2026-09-21T10:00:00', '2026-09-14T10:00:00')
        self.mock_cur.description = [
            ('invitation_id',), ('email',), ('status',), ('expires_at',), ('created_at',)
        ]

        result = self.service.create_invitation('tenant-1', 'test@example.com', 'user-1')

        assert result["success"] is True
        assert result["data"]["email"] == 'test@example.com'

    def test_list_invitations(self):
        """Test listing invitations."""
        self.mock_cur.fetchall.return_value = [
            {'invitation_id': 'uuid-1', 'email': 'a@b.com', 'status': 'pending', 'invited_by': 'user-1', 'created_at': '2026-09-14', 'expires_at': '2026-09-21'},
        ]
        self.mock_cur.fetchone.return_value = (1,)

        result = self.service.list_invitations('tenant-1')

        assert result["success"] is True
        assert len(result["data"]["invitations"]) == 1
        assert result["data"]["total"] == 1

    def test_revoke_invitation(self):
        """Test revoking invitation through service."""
        self.mock_cur.fetchone.return_value = {'invitation_id': 'test-uuid'}

        result = self.service.revoke_invitation('test-uuid', 'tenant-1')

        assert result["success"] is True

    def test_resend_invitation(self):
        """Test resending invitation through service."""
        self.mock_cur.fetchone.return_value = ('test-uuid', 'test@example.com', 'pending', '2026-09-21T10:00:00', '2026-09-14T10:00:00')
        self.mock_cur.description = [
            ('invitation_id',), ('email',), ('status',), ('expires_at',), ('created_at',)
        ]

        result = self.service.resend_invitation('test-uuid', 'tenant-1', 'user-1')

        assert result["success"] is True
        assert result["data"]["invitation_id"] == 'test-uuid'


class TestAcceptInvitation:
    """Test invitation acceptance flow."""

    @pytest.fixture(autouse=True)
    def setup_service(self, monkeypatch):
        """Setup mock connection and service."""
        self.mock_conn = MagicMock()
        self.mock_cur = MagicMock()
        self.mock_conn.cursor.return_value.__enter__.return_value = self.mock_cur
        self.service = InvitationService(self.mock_conn)

        # Mock the repository's get_pending_invitation_for_update
        self.service.repo.get_pending_invitation_for_update = Mock(return_value={
            'invitation_id': 'inv-uuid',
            'tenant_id': 'tenant-1',
            'email': 'test@example.com',
            'status': 'pending',
            'expires_at': '2026-09-21T10:00:00',
        })

        # Mock user_service.create_user
        self.service.user_service.create_user = Mock(return_value={
            "success": True,
            "data": {"id": "user-uuid", "email": "test@example.com"}
        })

        # Mock repo methods
        self.service.repo.update_user_invitation_id = Mock(return_value=True)
        self.service.repo.accept_invitation = Mock(return_value=True)

    def test_accept_invitation_success(self):
        """Test successful invitation acceptance."""
        result = self.service.accept_invitation(
            token='valid-token',
            password='SecureP@ss1',
            first_name='John',
            last_name='Doe'
        )

        assert result["success"] is True
        assert result["data"]["user_id"] == "user-uuid"

        # Verify user_service.create_user was called with correct params
        self.service.user_service.create_user.assert_called_once()
        call_args = self.service.user_service.create_user.call_args
        payload = call_args[0][0]
        assert payload.email == 'test@example.com'
        assert payload.password == 'SecureP@ss1'
        assert payload.first_name == 'John'
        assert payload.last_name == 'Doe'
        assert call_args[1]['tenant_id'] == 'tenant-1'

        # Verify user was linked to invitation
        self.service.repo.update_user_invitation_id.assert_called_with('user-uuid', 'inv-uuid')

        # Verify invitation marked accepted
        self.service.repo.accept_invitation.assert_called_with('inv-uuid')

    def test_accept_invitation_invalid_token(self):
        """Test acceptance with invalid/expired token."""
        self.service.repo.get_pending_invitation_for_update = Mock(return_value=None)

        result = self.service.accept_invitation(
            token='invalid-token',
            password='SecureP@ss1',
            first_name='John',
            last_name='Doe'
        )

        assert result["success"] is False
        assert "Invalid or expired invitation" in result["error"]

    def test_accept_invitation_password_policy_failure(self):
        """Test acceptance with weak password."""
        try:
            self.service.accept_invitation(
                token='valid-token',
                password='weak',  # Fails policy
                first_name='John',
                last_name='Doe'
            )
        except Exception as e:
            # The service validates password policy upfront and raises
            assert "Password must be at least 8 characters" in str(e)
            return
        pytest.fail("Expected password policy exception")

    def test_accept_invitation_user_creation_failure(self):
        """Test acceptance when user creation fails (e.g., tenant limit)."""
        self.service.user_service.create_user = Mock(return_value={
            "success": False,
            "error": "User limit reached"
        })

        result = self.service.accept_invitation(
            token='valid-token',
            password='SecureP@ss1',
            first_name='John',
            last_name='Doe'
        )

        assert result["success"] is False
        assert "User limit reached" in result["error"]

    def test_accept_invitation_link_user_failure(self):
        """Test acceptance when linking user to invitation fails."""
        self.service.repo.update_user_invitation_id = Mock(return_value=False)

        result = self.service.accept_invitation(
            token='valid-token',
            password='SecureP@ss1',
            first_name='John',
            last_name='Doe'
        )

        assert result["success"] is False
        assert "Failed to link invitation" in result["error"]


class TestInvitationEmailTemplates:
    """Test invitation email template rendering."""

    def test_render_invitation(self):
        """Test invitation template rendering."""
        html = render_invitation(
            accept_url='https://example.com/invite/abc123',
            first_name='John',
            tenant_name='Acme Corp'
        )

        assert 'https://example.com/invite/abc123' in html
        assert 'John' in html
        assert 'Acme Corp' in html
        assert 'MAP Nexus' in html
        assert 'Accept Invitation' in html

    def test_render_invitation_empty_first_name(self):
        """Test invitation with empty first name uses fallback."""
        html = render_invitation(
            accept_url='https://example.com/invite/abc123',
            first_name='',
            tenant_name='Test'
        )
        assert 'there' in html.lower()


class TestInvitationRateLimiting:
    """Test invitation acceptance rate limiting."""

    def test_invite_accept_rate_limiter_exists(self):
        """Verify rate limit function exists for public endpoints."""
        from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint

        # Should allow 5 requests
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.50", max_requests=5, window_seconds=3600)

        # 6th should raise 429
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc:
            rate_limit_public_endpoint("192.168.1.50", max_requests=5, window_seconds=3600)
        assert exc.value.status_code == 429


class TestInvitationIntegration:
    """Integration-style tests using mocked services."""

    def test_full_invitation_flow(self):
        """Test complete flow: create -> accept -> user created."""
        from app.services.invitation_service import InvitationService
        from app.db.repositories.invitation_repository import InvitationRepository

        mock_conn = MagicMock()
        mock_cur = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cur

        # Setup mock responses for the full flow
        # 1. Create invitation
        mock_cur.fetchone.return_value = {
            'invitation_id': 'inv-uuid',
            'email': 'test@example.com',
            'status': 'pending',
            'expires_at': '2026-09-21T10:00:00',
            'created_at': '2026-09-14T10:00:00',
        }

        repo = InvitationRepository(mock_conn)
        create_result = repo.create_invitation('tenant-1', 'test@example.com', 'user-1')
        assert create_result["success"] is True

        # 2. Accept invitation
        service = InvitationService(mock_conn)

        # Mock acceptance flow
        service.repo.get_pending_invitation_for_update = Mock(return_value={
            'invitation_id': 'inv-uuid',
            'tenant_id': 'tenant-1',
            'email': 'test@example.com',
            'status': 'pending',
            'expires_at': '2026-09-21T10:00:00',
        })
        service.user_service.create_user = Mock(return_value={
            "success": True,
            "data": {"id": "user-uuid"}
        })
        service.repo.update_user_invitation_id = Mock(return_value=True)
        service.repo.accept_invitation = Mock(return_value=True)

        # Mock EmailVerificationRepository
        with patch('app.services.invitation_service.EmailVerificationRepository') as mock_ver_repo:
            mock_ver_instance = MagicMock()
            mock_ver_instance.create_verification_token.return_value = 'verification-token-xyz'
            mock_ver_repo.return_value = mock_ver_instance

            accept_result = service.accept_invitation('valid-token', 'SecureP@ss1', 'John', 'Doe')
            assert accept_result["success"] is True
            assert accept_result["data"]["user_id"] == "user-uuid"


# Pytest fixtures
@pytest.fixture
def mock_conn():
    return MagicMock()


@pytest.fixture
def mock_cur():
    return MagicMock()