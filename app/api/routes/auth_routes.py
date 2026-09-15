from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from app.api.core.auth.dependencies import get_current_user, get_current_user_with_tenant
from app.api.core.auth.rbac import require_admin
from app.api.models.responses import APIResponse
from app.services.auth_service import AuthService
from app.db.connection import get_db_connection
from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint, get_client_ip

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 2 * 60 * 60  # 2 hours in seconds
COOKIE_SECURE = os.environ.get("APP_COOKIE_SECURE", "false").lower() == "true"

limiter = None  # placeholder if needed

class LoginRequest(BaseModel):
    username: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/login")
def login(request: Request, payload: LoginRequest, response: Response):
    try:
        result = AuthService().login(
            username=payload.username,
            password=payload.password
        )
    except Exception as e:
        msg = str(e)
        if msg.startswith("Account locked"):
            raise HTTPException(status_code=423, detail=msg)
        if msg in ("Account is not active",) or "suspended" in msg.lower():
            raise HTTPException(status_code=403, detail=msg)
        if "connection pool" in msg.lower():
            raise HTTPException(status_code=503, detail="Service temporarily unavailable. Please try again.")
        if msg == "Invalid credentials":
            raise HTTPException(status_code=401, detail="Invalid email or password")
        raise HTTPException(status_code=500, detail="Login failed. Please try again.")
    response.set_cookie(
        key=COOKIE_NAME,
        value=result["access_token"],
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="strict",
        path="/"
    )
    return {"message": "Login successful"}

@router.get("/me", response_model=APIResponse)
def get_me(current_user: dict = Depends(get_current_user_with_tenant)):
    user_id = current_user.get("sub")
    tenant_id = current_user.get("tenant_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute("SELECT r.name FROM platform.user_roles ur JOIN platform.roles r ON ur.role_id = r.id WHERE ur.user_id = %s", (user_id,))
            roles = [row[0] for row in cur.fetchall()]

            subscription = None
            if tenant_id:
                cur.execute("""
                    SELECT p.tier, p.name, p.max_users, p.max_projects, p.max_connections,
                           s.status, s.trial_end_date, s.billing_cycle, s.end_date
                    FROM platform.subscriptions s
                    JOIN platform.plans p ON s.plan_id = p.plan_id
                    WHERE s.tenant_id = %s AND s.status IN ('active', 'trialing', 'pending_cancellation')
                    ORDER BY s.created_at DESC LIMIT 1
                """, (tenant_id,))
                sub_row = cur.fetchone()

                cur.execute("SELECT COUNT(*) FROM core.projects WHERE tenant_id = %s AND status <> 'ARCHIVED'", (tenant_id,))
                project_count = cur.fetchone()[0]

                cur.execute("""
                    SELECT COUNT(*) FROM core.system_registry sr
                    JOIN core.projects p ON p.project_id = sr.project_id
                    WHERE p.tenant_id = %s
                """, (tenant_id,))
                connection_count = cur.fetchone()[0]

                cur.execute("SELECT COUNT(*) FROM platform.users WHERE tenant_id = %s AND deleted_at IS NULL AND status = 'active'", (tenant_id,))
                user_count = cur.fetchone()[0]

                if sub_row:
                    subscription = {
                        "plan_tier": sub_row[0],
                        "plan_name": sub_row[1],
                        "status": sub_row[5],
                        "trial_end_date": str(sub_row[6]) if sub_row[6] else None,
                        "billing_cycle": sub_row[7],
                        "end_date": str(sub_row[8]) if sub_row[8] else None,
                        "limits": {
                            "projects": {"current": project_count, "max": sub_row[3] or 3},
                            "users": {"current": user_count, "max": sub_row[2] or 5},
                            "connections": {"current": connection_count, "max": sub_row[4] or 5},
                        }
                    }
                else:
                    subscription = {
                        "plan_tier": None,
                        "plan_name": None,
                        "status": "none",
                        "trial_end_date": None,
                        "billing_cycle": None,
                        "end_date": None,
                        "limits": {
                            "projects": {"current": project_count, "max": 3},
                            "users": {"current": user_count, "max": 5},
                            "connections": {"current": connection_count, "max": 5},
                        }
                    }

    return APIResponse(success=True, data={
        "user_id": user_id,
        "email": current_user.get("user"),
        "roles": roles,
        "tenant_id": tenant_id,
        "subscription": subscription
    })

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, httponly=True, secure=COOKIE_SECURE, samesite="strict", path="/")
    return {"success": True, "data": {"message": "Logged out"}}

@router.post("/change-password")
def change_password(current_user: dict = Depends(get_current_user_with_tenant), payload: ChangePasswordRequest = ...):
    user_id = current_user.get("sub")
    result = AuthService().change_password(user_id=user_id, current_password=payload.current_password, new_password=payload.new_password)
    return APIResponse(success=True, data=result)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, request: Request):
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    token = AuthService().create_reset_token(payload.email)

    # Send reset email if token was created (user eligible)
    if token:
        try:
            reset_url = f"https://mapnexus.co.uk/reset-password?token={token}"
            from app.services.email_service import EmailServiceFactory, EmailMessage
            from app.services.email_templates import render_password_reset
            email_service = EmailServiceFactory.get_instance()
            html_body = render_password_reset(reset_url=reset_url, first_name=payload.email.split("@")[0])
            email_service.send(EmailMessage(
                to=payload.email,
                subject="Reset your MAP Nexus password",
                html_body=html_body
            ))
        except Exception as e:
            # Log failure but don't expose to user (enumeration-safe)
            import logging
            logging.getLogger(__name__).error(f"Reset email failed for {payload.email}: {e}")

    # Always return same response (enumeration-safe)
    return {"success": True, "message": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, request: Request):
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    try:
        result = AuthService().reset_password(payload.token, payload.new_password)
        return APIResponse(success=True, data=result)
    except Exception as e:
        msg = str(e)
        if "Invalid or expired" in msg:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        if "policy" in msg.lower():
            raise HTTPException(status_code=422, detail=msg)
        raise HTTPException(status_code=400, detail="Password reset failed")
