from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user_with_tenant, get_current_user
from app.api.helpers import standardize_response
from app.services.tenant_service import TenantService
from app.api.core.auth.rbac import require_admin

router = APIRouter(prefix="/api/v1/tenants", tags=["Tenants"])


class TenantCreateRequest(BaseModel):
    tenant_name: str
    admin_email: str
    admin_password: str
    billing_email: Optional[str] = None
    plan_tier: Optional[str] = "professional"


class TenantUpdateRequest(BaseModel):
    tenant_name: Optional[str] = None
    billing_email: Optional[str] = None
    plan_id: Optional[str] = None
    status: Optional[str] = None
    max_users: Optional[int] = None
    max_projects: Optional[int] = None
    max_connections: Optional[int] = None


class SubscriptionChangeRequest(BaseModel):
    plan_id: str
    billing_cycle: Optional[str] = "annual"


@router.post("")
def create_tenant(
    request: TenantCreateRequest,
    current_user=Depends(require_admin)
):
    # DEV-011: weak admin passwords surface as 422 (policy enforced in service).
    try:
        db = get_db_connection()
        service = TenantService(db.conn)
        result = service.create_tenant(
            tenant_name=request.tenant_name,
            admin_email=request.admin_email,
            admin_password=request.admin_password,
            billing_email=request.billing_email,
            plan_tier=request.plan_tier
        )
        return standardize_response(result)
    except Exception as e:
        if "Password" in str(e):
            raise HTTPException(status_code=422, detail=str(e))
        raise


@router.get("")
def list_tenants(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    current_user=Depends(require_admin)
):
    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.list_tenants(page=page, page_size=page_size, status=status)
    return standardize_response(result)


@router.get("/plans")
def list_plans(
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.list_plans()
    return standardize_response(result)


@router.get("/{tenant_id}")
def get_tenant(
    tenant_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    jwt_tenant = current_user.get("tenant_id")
    if jwt_tenant and jwt_tenant != tenant_id:
        return standardize_response({"success": False, "error": "Access denied"})

    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.get_tenant(tenant_id)
    return standardize_response(result)


@router.put("/{tenant_id}")
def update_tenant(
    tenant_id: str,
    request: TenantUpdateRequest,
    current_user=Depends(require_admin)
):
    jwt_tenant = current_user.get("tenant_id")
    if jwt_tenant and jwt_tenant != tenant_id:
        return standardize_response({"success": False, "error": "Access denied"})

    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.update_tenant(
        tenant_id,
        tenant_name=request.tenant_name,
        billing_email=request.billing_email,
        plan_id=request.plan_id,
        status=request.status,
        max_users=request.max_users,
        max_projects=request.max_projects,
        max_connections=request.max_connections
    )
    return standardize_response(result)


@router.get("/{tenant_id}/subscription")
def get_subscription(
    tenant_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    jwt_tenant = current_user.get("tenant_id")
    if jwt_tenant and jwt_tenant != tenant_id:
        return standardize_response({"success": False, "error": "Access denied"})

    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.get_subscription(tenant_id)
    return standardize_response(result)


@router.post("/{tenant_id}/subscription")
def change_subscription(
    tenant_id: str,
    request: SubscriptionChangeRequest,
    current_user=Depends(require_admin)
):
    jwt_tenant = current_user.get("tenant_id")
    if jwt_tenant and jwt_tenant != tenant_id:
        return standardize_response({"success": False, "error": "Access denied"})

    db = get_db_connection()
    service = TenantService(db.conn)
    result = service.change_subscription(
        tenant_id,
        plan_id=request.plan_id,
        billing_cycle=request.billing_cycle
    )
    return standardize_response(result)
