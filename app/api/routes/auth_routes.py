from fastapi import APIRouter
from pydantic import BaseModel
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# REQUEST MODEL
# =========================
class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# ROUTE
# =========================
@router.post("/login")
def login(payload: LoginRequest):
    return AuthService().login(
        username=payload.username,
        password=payload.password
    )