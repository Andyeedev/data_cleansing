"""
Tests for EmailService abstraction and SMTP implementation.
"""
import pytest
from unittest.mock import patch, MagicMock, Mock
import os
import sys

# Ensure app is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_service import EmailService, EmailMessage, EmailResult, EmailServiceFactory
from app.services.email_smtp import SMTPEmailService
from app.services.email_templates import render_invitation, render_password_reset, render_verification, load_template


class TestEmailServiceInterface:
    """Test the EmailService abstract interface."""

    def test_email_message_dataclass(self):
        msg = EmailMessage(
            to="test@example.com",
            subject="Test Subject",
            html_body="<p>HTML</p>",
            text_body="Text",
            from_email="from@example.com",
            from_name="Test Sender"
        )
        assert msg.to == "test@example.com"
        assert msg.subject == "Test Subject"
        assert msg.html_body == "<p>HTML</p>"
        assert msg.text_body == "Text"
        assert msg.from_email == "from@example.com"
        assert msg.from_name == "Test Sender"

    def test_email_result_dataclass(self):
        result = EmailResult(success=True, message_id="msg-123")
        assert result.success is True
        assert result.message_id == "msg-123"
        assert result.error is None

        result_fail = EmailResult(success=False, error="SMTP error")
        assert result_fail.success is False
        assert result_fail.error == "SMTP error"


class TestSMTPEmailService:
    """Test SMTP email service implementation."""

    @pytest.fixture(autouse=True)
    def setup_env(self, monkeypatch):
        """Set required env vars for SMTP config."""
        monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
        monkeypatch.setenv("SMTP_PORT", "587")
        monkeypatch.setenv("SMTP_USER", "user@example.com")
        monkeypatch.setenv("SMTP_PASS", "secret123")
        monkeypatch.setenv("SMTP_FROM_EMAIL", "noreply@example.com")
        monkeypatch.setenv("SMTP_FROM_NAME", "Test App")
        monkeypatch.setenv("SMTP_USE_TLS", "true")
        monkeypatch.setenv("SMTP_USE_SSL", "false")
        monkeypatch.setenv("SMTP_TIMEOUT", "30")

    def test_smtp_service_creation(self):
        service = SMTPEmailService()
        assert service.host == "smtp.example.com"
        assert service.port == 587
        assert service.username == "user@example.com"
        assert service.password == "secret123"
        assert service.from_email == "noreply@example.com"
        assert service.from_name == "Test App"
        assert service.use_tls is True
        assert service.use_ssl is False
        assert service.timeout == 30

    def test_smtp_send_success(self):
        service = SMTPEmailService()
        message = EmailMessage(
            to="recipient@example.com",
            subject="Test Subject",
            html_body="<p>Test</p>"
        )

        with patch("smtplib.SMTP") as mock_smtp:
            mock_conn = MagicMock()
            mock_smtp.return_value.__enter__.return_value = mock_conn

            result = service.send(message)

            assert result.success is True
            mock_conn.send_message.assert_called_once()
            call_args = mock_conn.send_message.call_args[0][0]
            assert call_args["To"] == "recipient@example.com"
            assert call_args["Subject"] == "Test Subject"

    def test_smtp_send_failure(self):
        service = SMTPEmailService()
        message = EmailMessage(
            to="recipient@example.com",
            subject="Test Subject",
            html_body="<p>Test</p>"
        )

        with patch("smtplib.SMTP", side_effect=Exception("Connection refused")):
            result = service.send(message)

            assert result.success is False
            assert "Connection refused" in result.error

    def test_smtp_send_batch(self):
        service = SMTPEmailService()
        messages = [
            EmailMessage(to="a@example.com", subject="Subj 1", html_body="<p>1</p>"),
            EmailMessage(to="b@example.com", subject="Subj 2", html_body="<p>2</p>"),
        ]

        with patch("smtplib.SMTP") as mock_smtp:
            mock_conn = MagicMock()
            mock_smtp.return_value.__enter__.return_value = mock_conn

            results = service.send_batch(messages)

            assert len(results) == 2
            assert all(r.success for r in results)
            assert mock_conn.send_message.call_count == 2

    def test_smtp_send_batch_partial_failure(self):
        service = SMTPEmailService()
        messages = [
            EmailMessage(to="a@example.com", subject="Subj 1", html_body="<p>1</p>"),
            EmailMessage(to="b@example.com", subject="Subj 2", html_body="<p>2</p>"),
        ]

        with patch("smtplib.SMTP") as mock_smtp:
            mock_conn = MagicMock()
            mock_conn.send_message.side_effect = [None, Exception("Failed")]
            mock_smtp.return_value.__enter__.return_value = mock_conn

            results = service.send_batch(messages)

            assert len(results) == 2
            assert results[0].success is True
            assert results[1].success is False
            assert "Failed" in results[1].error


class TestEmailServiceFactory:
    """Test the EmailServiceFactory."""

    def setup_method(self):
        EmailServiceFactory.reset()

    def test_factory_creates_smtp(self, monkeypatch):
        monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
        monkeypatch.setenv("SMTP_PORT", "587")
        monkeypatch.setenv("SMTP_USER", "user")
        monkeypatch.setenv("SMTP_PASS", "pass")

        service = EmailServiceFactory.create("smtp")
        assert isinstance(service, SMTPEmailService)

    def test_factory_singleton(self, monkeypatch):
        monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
        monkeypatch.setenv("SMTP_PORT", "587")
        monkeypatch.setenv("SMTP_USER", "user")
        monkeypatch.setenv("SMTP_PASS", "pass")

        service1 = EmailServiceFactory.get_instance("smtp")
        service2 = EmailServiceFactory.get_instance("smtp")
        assert service1 is service2

    def test_factory_reset(self, monkeypatch):
        monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
        monkeypatch.setenv("SMTP_PORT", "587")
        monkeypatch.setenv("SMTP_USER", "user")
        monkeypatch.setenv("SMTP_PASS", "pass")

        service1 = EmailServiceFactory.get_instance("smtp")
        EmailServiceFactory.reset()
        service2 = EmailServiceFactory.get_instance("smtp")
        assert service1 is not service2

    def test_factory_unknown_provider(self):
        with pytest.raises(ValueError):
            EmailServiceFactory.create("unknown")

    def test_factory_sendgrid_not_implemented(self):
        with pytest.raises(NotImplementedError):
            EmailServiceFactory.create("sendgrid")

    def test_factory_ses_not_implemented(self):
        with pytest.raises(NotImplementedError):
            EmailServiceFactory.create("ses")


class TestEmailTemplates:
    """Test email template loading and rendering."""

    def test_load_template_exists(self):
        content = load_template("invitation")
        assert "MAP Nexus" in content
        assert "{{accept_url}}" in content
        assert "{{first_name}}" in content
        assert "{{tenant_name}}" in content

    def test_load_template_missing_raises(self):
        with pytest.raises(FileNotFoundError):
            load_template("nonexistent")

    def test_render_invitation(self):
        html = render_invitation(
            accept_url="https://example.com/invite/abc123",
            first_name="John",
            tenant_name="Acme Corp"
        )
        assert "https://example.com/invite/abc123" in html
        assert "John" in html
        assert "Acme Corp" in html
        assert "MAP Nexus" in html

    def test_render_password_reset(self):
        html = render_password_reset(
            reset_url="https://example.com/reset/xyz789",
            first_name="Jane"
        )
        assert "https://example.com/reset/xyz789" in html
        assert "Jane" in html
        assert "Reset your password" in html

    def test_render_verification(self):
        html = render_verification(
            verify_url="https://example.com/verify/def456",
            first_name="Bob"
        )
        assert "https://example.com/verify/def456" in html
        assert "Bob" in html
        assert "Verify your email address" in html

    def test_render_with_empty_first_name(self):
        html = render_invitation(
            accept_url="https://example.com/invite/abc123",
            first_name="",
            tenant_name="Test"
        )
        assert "there" in html  # fallback


class TestSMTPEmailServiceConfigValidation:
    """Test SMTP configuration handling."""

    def test_missing_required_env_raises(self, monkeypatch):
        # Remove required env vars
        for var in ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]:
            monkeypatch.delenv(var, raising=False)

        with pytest.raises(RuntimeError):
            SMTPEmailService()

    def test_optional_env_defaults(self, monkeypatch):
        monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
        monkeypatch.setenv("SMTP_USER", "user")
        monkeypatch.setenv("SMTP_PASS", "pass")
        monkeypatch.delenv("SMTP_PORT", raising=False)
        monkeypatch.delenv("SMTP_FROM_EMAIL", raising=False)
        monkeypatch.delenv("SMTP_FROM_NAME", raising=False)
        monkeypatch.delenv("SMTP_USE_TLS", raising=False)
        monkeypatch.delenv("SMTP_USE_SSL", raising=False)
        monkeypatch.delenv("SMTP_TIMEOUT", raising=False)

        service = SMTPEmailService()
        assert service.port == 587
        assert service.from_email == "user"
        assert service.from_name == "MAP Nexus"
        assert service.use_tls is True
        assert service.use_ssl is False
        assert service.timeout == 30