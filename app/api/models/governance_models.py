from typing import Optional, List
from pydantic import BaseModel


class AuditEntry(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: str
    user_email: str
    timestamp: str
    details: dict = {}


class AuditLogResponse(BaseModel):
    entries: List[AuditEntry]
    total: int
    page: int = 1
    page_size: int = 50


class ApprovalRequest(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    status: str
    requested_by: str
    created_at: str


class ApprovalsResponse(BaseModel):
    pending: List[ApprovalRequest]
    total: int


class ExceptionRequest(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    reason: str
    status: str
    requested_by: str
    created_at: str


class ComplianceStatus(BaseModel):
    score: Optional[float] = None
    total_controls: int = 0
    passed_controls: int = 0
    failed_controls: int = 0
