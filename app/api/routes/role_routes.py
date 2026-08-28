from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.helpers import standardize_response
from app.services.role_service import RoleService

router = APIRouter(prefix="/api/v1/roles", tags=["Roles"])


class RoleCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "custom"
    parent_id: Optional[str] = None


class RoleUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class PermissionAssignRequest(BaseModel):
    permission_id: str
    granted: bool = True


@router.get("")
def list_roles(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.list_roles(page=page, page_size=page_size, status=status))


@router.get("/{role_id}")
def get_role(role_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.get_role(role_id))


@router.post("")
def create_role(
    payload: RoleCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.create_role(payload))


@router.put("/{role_id}")
def update_role(
    role_id: str,
    payload: RoleUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.update_role(role_id, payload))


@router.delete("/{role_id}")
def delete_role(role_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.delete_role(role_id))


@router.post("/{role_id}/permissions")
def assign_permission(
    role_id: str,
    payload: PermissionAssignRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.assign_permission(role_id, payload))


@router.delete("/{role_id}/permissions/{permission_id}")
def remove_permission(
    role_id: str,
    permission_id: str,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.remove_permission(role_id, permission_id))


@router.get("/{role_id}/permissions")
def get_role_permissions(role_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.get_role_permissions(role_id))


@router.get("/permissions/list")
def list_all_permissions(current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = RoleService(db.conn)
    return standardize_response(service.list_all_permissions())
