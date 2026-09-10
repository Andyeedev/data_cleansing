from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel
from typing import Optional
import os
from app.api.core.auth.dependencies import get_current_user, get_current_user_with_tenant
from app.api.core.auth.rbac import require_admin
from app.api.models.responses import APIResponse
from app.services.auth_service import AuthService
from app.db.connection import get_db_connection

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
    return APIResponse(success=True, data={
        "user_id": user_id,
        "email": current_user.get("user"),
        "roles": roles,
        "tenant_id": tenant_id
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
