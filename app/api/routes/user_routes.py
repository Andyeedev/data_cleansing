from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.helpers import standardize_response
from app.services.user_service import UserService

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


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
    return standardize_response(service.list_users(
        page=page, page_size=page_size,
        status=status, search=search
    ))


@router.get("/{user_id}")
def get_user(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.get_user(user_id))


@router.post("/")
def create_user(
    payload: UserCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.create_user(payload))


@router.put("/{user_id}")
def update_user(
    user_id: str,
    payload: UserUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.update_user(user_id, payload))


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.delete_user(user_id))


@router.post("/{user_id}/roles")
def assign_role(
    user_id: str,
    payload: UserRoleAssignRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.assign_role(user_id, payload))


@router.delete("/{user_id}/roles/{role_id}")
def remove_role(
    user_id: str,
    role_id: str,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.remove_role(user_id, role_id))


@router.get("/{user_id}/roles")
def get_user_roles(user_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.get_user_roles(user_id))
