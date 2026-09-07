from fastapi import APIRouter, Request, Response, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.auth_service import AuthService
from app.api.core.auth.dependencies import get_current_user, COOKIE_NAME

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])
limiter = Limiter(key_func=get_remote_address)

COOKIE_MAX_AGE = 2 * 60 * 60  # 2 hours in seconds


class LoginRequest(BaseModel):
    username: str
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest, response: Response):
    result = AuthService().login(
        username=payload.username,
        password=payload.password
    )

    response.set_cookie(
        key=COOKIE_NAME,
        value=result["access_token"],
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=True,
        samesite="strict",
        path="/"
    )

    return {"message": "Login successful"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=True,
        samesite="strict",
        path="/"
    )
    return {"message": "Logged out"}


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    result = AuthService().change_password(
        user_id=user_id,
        current_password=payload.current_password,
        new_password=payload.new_password
    )
    return result
