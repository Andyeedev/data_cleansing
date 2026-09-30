from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.api.core.auth.rbac import require_permissions
from app.api.core.auth.dependencies import resolve_tenant
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
def create_invitation(payload: InvitationCreateRequest, request: Request, current_user: dict = Depends(require_permissions("invitations:create"))):
    """Tenant-scoped admin sends invitation email to new user."""
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
    current_user: dict = Depends(require_permissions("invitations:read")),
    tenant_id: str = Depends(resolve_tenant)
):
    """Lists pending invitations for tenant."""
    # Phase C (D1): resolve_tenant encodes the approved rule (SA-only
    # override, else JWT-bound). The tenant-context guard below is preserved.
    if not tenant_id:
        raise HTTPException(status_code=403, detail="Admin tenant context required")

    with get_db_connection() as db:
        service = InvitationService(db.conn)
        result = service.list_invitations(tenant_id, status, page, page_size)
        return result


@router.delete("/{invitation_id}")
def revoke_invitation(invitation_id: str, current_user: dict = Depends(require_permissions("invitations:revoke"))):
    """Revokes/cancels invitation within tenant."""
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
def resend_invitation(invitation_id: str, request: Request, current_user: dict = Depends(require_permissions("invitations:resend"))):
    """Resends invitation with new token within tenant."""
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

    # Send verification email (outside transaction)
    email_sent = True
    warning = None
    try:
        # Get the user email to send verification
        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                cur.execute("""
                    SELECT u.email, ev.token 
                    FROM platform.users u
                    JOIN platform.email_verifications ev ON ev.user_id = u.id
                    WHERE u.invitation_id = (
                        SELECT i.invitation_id FROM platform.invitations i WHERE i.token = %s
                    )
                    AND ev.verified = FALSE
                """, (payload.token,))
                row = cur.fetchone()
                if row:
                    email, token = row
                    verify_url = f"https://mapnexus.co.uk/verify-email?token={token}"
                    from app.services.email_service import EmailServiceFactory, EmailMessage
                    from app.services.email_templates import render_verification
                    email_service = EmailServiceFactory.get_instance()
                    html_body = render_verification(verify_url=verify_url, first_name=payload.first_name)
                    email_result = email_service.send(EmailMessage(
                        to=email,
                        subject="Verify your MAP Nexus email address",
                        html_body=html_body
                    ))
                    if not email_result.success:
                        email_sent = False
    except Exception as e:
        email_sent = False
        import logging
        logging.getLogger(__name__).error(f"Verification email failed: {e}")

    warning = None
    if not email_sent:
        warning = "Account created but verification email delivery failed. Use resend verification."

    return {
        "success": True,
        "message": "Account created. Please verify your email address.",
        "data": {"user_id": result["data"]["user_id"], "email_sent": email_sent, "warning": warning}
    }