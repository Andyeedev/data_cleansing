import smtplib
import ssl
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.services.email_service import EmailService, EmailMessage, EmailResult
from app.api.core.config import get_env

logger = logging.getLogger(__name__)


class SMTPEmailService(EmailService):
    def __init__(self):
        self.host = get_env("SMTP_HOST")
        self.port = int(get_env("SMTP_PORT", required=False) or "587")
        self.username = get_env("SMTP_USER")
        self.password = get_env("SMTP_PASS")
        self.from_email = get_env("SMTP_FROM_EMAIL", required=False) or self.username
        self.from_name = get_env("SMTP_FROM_NAME", required=False) or "MAP Nexus"
        use_tls_val = get_env("SMTP_USE_TLS", required=False)
        self.use_tls = use_tls_val.lower() in ("true", "1", "yes") if use_tls_val else True
        use_ssl_val = get_env("SMTP_USE_SSL", required=False)
        self.use_ssl = use_ssl_val.lower() in ("true", "1", "yes") if use_ssl_val else False
        self.timeout = int(get_env("SMTP_TIMEOUT", required=False) or "30")

    def _create_connection(self) -> smtplib.SMTP:
        if self.use_ssl:
            context = ssl.create_default_context()
            conn = smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=self.timeout)
        else:
            conn = smtplib.SMTP(self.host, self.port, timeout=self.timeout)
            if self.use_tls:
                context = ssl.create_default_context()
                conn.starttls(context=context)

        if self.username and self.password:
            conn.login(self.username, self.password)

        return conn

    def send(self, message: EmailMessage) -> EmailResult:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = message.subject
            msg["From"] = f"{message.from_name or self.from_name} <{message.from_email or self.from_email}>"
            msg["To"] = message.to

            if message.text_body:
                msg.attach(MIMEText(message.text_body, "plain"))
            msg.attach(MIMEText(message.html_body, "html"))

            with self._create_connection() as conn:
                conn.send_message(msg)

            logger.info(f"Email sent successfully to {message.to}")
            return EmailResult(success=True)

        except Exception as e:
            logger.error(f"Failed to send email to {message.to}: {e}")
            return EmailResult(success=False, error=str(e))

    def send_batch(self, messages: list[EmailMessage]) -> list[EmailResult]:
        results = []
        try:
            with self._create_connection() as conn:
                for message in messages:
                    try:
                        msg = MIMEMultipart("alternative")
                        msg["Subject"] = message.subject
                        msg["From"] = f"{message.from_name or self.from_name} <{message.from_email or self.from_email}>"
                        msg["To"] = message.to

                        if message.text_body:
                            msg.attach(MIMEText(message.text_body, "plain"))
                        msg.attach(MIMEText(message.html_body, "html"))

                        conn.send_message(msg)
                        results.append(EmailResult(success=True))
                        logger.info(f"Email sent successfully to {message.to}")
                    except Exception as e:
                        logger.error(f"Failed to send email to {message.to}: {e}")
                        results.append(EmailResult(success=False, error=str(e)))
        except Exception as e:
            logger.error(f"Failed to establish SMTP connection for batch: {e}")
            for _ in messages:
                results.append(EmailResult(success=False, error=str(e)))

        return results