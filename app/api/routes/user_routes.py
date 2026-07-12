from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.services.user_service import UserService

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


# =========================
# REQUEST MODELS
# =========================
class UserCreateRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    display_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    tenant_id: Optional[str] = None


class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None


class UserRoleAssignRequest(BaseModel):
    role_id: str
    expires_at: Optional[datetime] = None
    is_temporary: bool = False


# =========================
# LIST USERS
# =========================
@router.get("/")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.list_users(
        page=page,
        page_size=page_size,
        status=status,
        search=search
    )


# =========================
# GET USER
# =========================
@router.get("/{user_id}")
def get_user(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.get_user(user_id)


# =========================
# CREATE USER
# =========================
@router.post("/")
def create_user(
    payload: UserCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.create_user(payload)


# =========================
# UPDATE USER
# =========================
@router.put("/{user_id}")
def update_user(
    user_id: str,
    payload: UserUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.update_user(user_id, payload)


# =========================
# DELETE USER
# =========================
@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.delete_user(user_id)


# =========================
# ASSIGN ROLE
# =========================
@router.post("/{user_id}/roles")
def assign_role(
    user_id: str,
    payload: UserRoleAssignRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.assign_role(user_id, payload)


# =========================
# REMOVE ROLE
# =========================
@router.delete("/{user_id}/roles/{role_id}")
def remove_role(
    user_id: str,
    role_id: str,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.remove_role(user_id, role_id)


# =========================
# GET USER ROLES
# =========================
@router.get("/{user_id}/roles")
def get_user_roles(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return service.get_user_roles(user_id)
