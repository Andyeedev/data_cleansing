from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.rbac import require_permissions
from app.api.core.auth.dependencies import resolve_tenant
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


class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None


class UserRoleAssignRequest(BaseModel):
    role_id: str


@router.get("")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user=Depends(require_permissions("users:list")),
    tenant_id: str = Depends(resolve_tenant)
):
    # Phase C (D1): tenant scope resolved by resolve_tenant — Super Admin may
    # pass ?tenant_id= to view another tenant; everyone else is JWT-bound.
    # Writes below intentionally stay JWT-bound (Stage A guards).
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.list_users(
        tenant_id=tenant_id,
        page=page, page_size=page_size,
        status=status, search=search
    ))


@router.get("/{user_id}")
def get_user(
    user_id: str,
    current_user=Depends(require_permissions("users:read")),
    tenant_id: str = Depends(resolve_tenant)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.get_user(user_id, tenant_id=tenant_id))


@router.post("")
def create_user(
    payload: UserCreateRequest,
    current_user=Depends(require_permissions("users:create"))
):
    # DEV-009/DEV-011: plan-limit and password-policy violations surface as 403/422.
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = UserService(db.conn)
        return standardize_response(service.create_user(payload, tenant_id=tenant_id))
    except ValueError as e:
        msg = str(e)
        if "Password" in msg:
            raise HTTPException(status_code=422, detail=msg)
        raise HTTPException(status_code=403, detail=msg)


@router.put("/{user_id}")
def update_user(
    user_id: str,
    payload: UserUpdateRequest,
    current_user=Depends(require_permissions("users:update"))
):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.update_user(user_id, payload, tenant_id=tenant_id))


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(require_permissions("users:delete"))):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.delete_user(user_id, tenant_id=tenant_id))


@router.post("/{user_id}/roles")
def assign_role(
    user_id: str,
    payload: UserRoleAssignRequest,
    current_user=Depends(require_permissions("users:update"))
):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.assign_role(
        user_id, payload, tenant_id=tenant_id, caller=current_user
    ))


@router.delete("/{user_id}/roles/{role_id}")
def remove_role(
    user_id: str,
    role_id: str,
    current_user=Depends(require_permissions("users:update"))
):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.remove_role(user_id, role_id, tenant_id=tenant_id))


@router.get("/{user_id}/roles")
def get_user_roles(
    user_id: str,
    current_user=Depends(require_permissions("users:read")),
    tenant_id: str = Depends(resolve_tenant)
):
    db = get_db_connection()
    service = UserService(db.conn)
    return standardize_response(service.get_user_roles(user_id, tenant_id=tenant_id))