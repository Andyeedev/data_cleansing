from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.core.auth.rbac import require_admin
from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint, get_client_ip
from app.services.invitation_service import InvitationService
from app.services.email_service import EmailServiceFactory
from app.services.email_templates import render_invitation
from app.db.connection import get_db_connection

router = APIRouter(prefix="/api/v1/invitations", tags=["Invitations"])


class InvitationCreateRequest(BaseModel):
    email: EmailStr
    message: Optional[str] = None


class InvitationAcceptRequest(BaseModel):
    token: str
    password: str
    first_name: str
    last_name: str


@router.post("")
@router.post("/")
def create_invitation(payload: InvitationCreateRequest, request: Request, current_user: dict = Depends(require_admin)):
    """Admin sends invitation email to new user."""
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        raise HTTPException(status_code=403, detail="Admin tenant context required")

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.create_invitation(
            tenant_id=tenant_id,
            email=payload.email,
            invited_by=current_user.get("sub"),
            message=payload.message
        )

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to create invitation"))

        invitation = result["data"]
        db.conn.commit()

    # Send invitation email (outside transaction)
    try:
        accept_url = f"https://mapnexus.co.uk/invites/accept?token={invitation['token']}"
        html_body = render_invitation(
            accept_url=accept_url,
            first_name=payload.email.split("@")[0],
            tenant_name="MAP Nexus"
        )
        email_service = EmailServiceFactory.get_instance()
        from app.services.email_service import EmailMessage
        email_result = email_service.send(EmailMessage(
            to=payload.email,
            subject="Invitation to join MAP Nexus",
            html_body=html_body
        ))

        email_sent = email_result.success
        warning = None
        if not email_sent:
            warning = "Invitation created but email delivery failed. Use resend."

    except Exception as e:
        email_sent = False
        warning = "Invitation created but email delivery failed. Use resend."

    return {
        "success": True,
        "data": {
            "invitation_id": invitation["invitation_id"],
            "email": invitation["email"],
            "status": invitation["status"],
            "expires_at": invitation["expires_at"],
            "email_sent": email_sent,
            "warning": warning
        }
    }


@router.get("")
@router.get("/")
def list_invitations(
    status: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    current_user: dict = Depends(require_admin)
):
    """Admin lists pending invitations for tenant."""
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        raise HTTPException(status_code=403, detail="Admin tenant context required")

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.list_invitations(tenant_id, status, page, page_size)
        return result


@router.delete("/{invitation_id}")
def revoke_invitation(invitation_id: str, current_user: dict = Depends(require_admin)):
    """Admin revokes/cancels invitation."""
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        raise HTTPException(status_code=403, detail="Admin tenant context required")

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.revoke_invitation(invitation_id, tenant_id)
        db.conn.commit()

    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.post("/{invitation_id}/resend")
def resend_invitation(invitation_id: str, request: Request, current_user: dict = Depends(require_admin)):
    """Admin resends invitation with new token."""
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        raise HTTPException(status_code=403, detail="Admin tenant context required")

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.resend_invitation(invitation_id, tenant_id, current_user.get("sub"))
        db.conn.commit()

    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])

    invitation = result["data"]

    # Send new invitation email (outside transaction)
    try:
        accept_url = f"https://mapnexus.co.uk/invites/accept?token={invitation['token']}"
        html_body = render_invitation(
            accept_url=accept_url,
            first_name=invitation['email'].split("@")[0],
            tenant_name="MAP Nexus"
        )
        email_service = EmailServiceFactory.get_instance()
        from app.services.email_service import EmailMessage
        email_result = email_service.send(EmailMessage(
            to=invitation['email'],
            subject="Invitation to join MAP Nexus (Resent)",
            html_body=html_body
        ))
        email_sent = email_result.success
        warning = None
        if not email_sent:
            warning = "Invitation updated but email delivery failed."
    except Exception:
        email_sent = False
        warning = "Invitation updated but email delivery failed."

    return {
        "success": True,
        "data": {
            "invitation_id": invitation["invitation_id"],
            "email": invitation["email"],
            "status": invitation["status"],
            "expires_at": invitation["expires_at"],
            "email_sent": email_sent,
            "warning": warning
        }
    }


@router.post("/accept")
def accept_invitation(payload: InvitationAcceptRequest, request: Request):
    """Public accepts invitation, sets password, creates account."""
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.accept_invitation(
            token=payload.token,
            password=payload.password,
            first_name=payload.first_name,
            last_name=payload.last_name
        )

        if not result["success"]:
            error = result.get("error", "Invitation acceptance failed")
            if "limit" in error.lower():
                raise HTTPException(status_code=403, detail=error)
            if "password" in error.lower() or "policy" in error.lower():
                raise HTTPException(status_code=422, detail=error)
            raise HTTPException(status_code=400, detail=error)

        db.conn.commit()
        return result