from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.core.auth.rbac import require_permissions
from app.api.helpers import standardize_response
from app.services.approval_service import ApprovalService

router = APIRouter(prefix="/api/v1/approvals", tags=["Approvals"])


class ApprovalCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    type: str = "approval"
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None


class ApprovalDecisionRequest(BaseModel):
    notes: Optional[str] = None


@router.get("")
def list_approvals(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    current_user=Depends(require_permissions("approvals:read"))
):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.list_approvals(
        page=page, page_size=page_size,
        status=status, assigned_to=assigned_to
    ))


@router.get("/pending/count")
def get_pending_count(current_user=Depends(require_permissions("approvals:read"))):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.get_pending_count(current_user.get("sub")))


@router.get("/{approval_id}")
def get_approval(approval_id: str, current_user=Depends(require_permissions("approvals:read"))):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.get_approval(approval_id))


@router.post("")
def create_approval(
    payload: ApprovalCreateRequest,
    current_user=Depends(require_permissions("approvals:create"))
):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.create_approval(payload, current_user.get("sub")))


@router.put("/{approval_id}/approve")
def approve_request(
    approval_id: str,
    payload: ApprovalDecisionRequest,
    current_user=Depends(require_permissions("approvals:approve"))
):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.approve_request(
        approval_id, current_user.get("sub"), payload.notes
    ))


@router.put("/{approval_id}/reject")
def reject_request(
    approval_id: str,
    payload: ApprovalDecisionRequest,
    current_user=Depends(require_permissions("approvals:reject"))
):
    db = get_db_connection()
    service = ApprovalService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.reject_request(
        approval_id, current_user.get("sub"), payload.notes
    ))
