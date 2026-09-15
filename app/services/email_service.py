from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
import logging

logger = logging.getLogger(__name__)


@dataclass
class EmailMessage:
    to: str
    subject: str
    html_body: str
    text_body: Optional[str] = None
    from_email: Optional[str] = None
    from_name: Optional[str] = None


@dataclass
class EmailResult:
    success: bool
    message_id: Optional[str] = None
    error: Optional[str] = None


class EmailService(ABC):
    @abstractmethod
    def send(self, message: EmailMessage) -> EmailResult:
        pass

    @abstractmethod
    def send_batch(self, messages: list[EmailMessage]) -> list[EmailResult]:
        pass


class EmailServiceFactory:
    _instance: Optional[EmailService] = None

    @classmethod
    def create(cls, provider: str = "smtp") -> EmailService:
        if provider == "smtp":
            from app.services.email_smtp import SMTPEmailService
            return SMTPEmailService()
        elif provider == "sendgrid":
            raise NotImplementedError("SendGrid provider not yet implemented")
        elif provider == "ses":
            raise NotImplementedError("SES provider not yet implemented")
        else:
            raise ValueError(f"Unknown email provider: {provider}")

    @classmethod
    def get_instance(cls, provider: str = "smtp") -> EmailService:
        if cls._instance is None:
            cls._instance = cls.create(provider)
        return cls._instance

    @classmethod
    def reset(cls) -> None:
        cls._instance = None