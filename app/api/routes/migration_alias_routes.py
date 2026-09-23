from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.models.responses import APIResponse
from app.services.mapping.mapping_service import MappingService
from app.services.discovery_service_api import DiscoveryService
from app.services.migration_project_service import MigrationProjectService
from app.db.connection import get_db_connection

router = APIRouter(prefix="/api/v1/migration", tags=["Migration"])

mapping_service = MappingService(get_db_connection())
discovery_service = DiscoveryService()
project_service = MigrationProjectService()


def _resolve_tenant(tenant_id, all_tenants, current_user):
    """Resolve which tenant to query. all_tenants=True requires Super Admin role."""
    jwt_tenant_id = current_user.get("tenant_id")
    roles = current_user.get("roles", [])
    is_super_admin = any("super admin" in r.lower() for r in roles)
    is_tenant_admin = any("tenant admin" in r.lower() for r in roles)

    if all_tenants:
        if not is_super_admin:
            raise HTTPException(status_code=403, detail="all_tenants requires Super Admin role")
        return None

    if tenant_id and tenant_id != jwt_tenant_id and not (is_super_admin or is_tenant_admin):
        raise HTTPException(status_code=403, detail="Cannot query tenant you do not belong to")

    return tenant_id or jwt_tenant_id


# =========================
# MAPPINGS
# =========================
@router.get("/mappings/summary", response_model=APIResponse)
def get_mapping_summary(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None),
    all_tenants: bool = Query(False),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, all_tenants, current_user)
        result = mapping_service.get_summary(effective_tenant)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mappings/schema", response_model=APIResponse)
def get_mapping_schema(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None),
    all_tenants: bool = Query(False),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, all_tenants, current_user)
        result = mapping_service.get_schema(effective_tenant)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DISCOVERY
# =========================
@router.get("/discovery/summary", response_model=APIResponse)
def get_discovery_summary(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None),
    all_tenants: bool = Query(False),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, all_tenants, current_user)
        result = discovery_service.get_summary(effective_tenant)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/discovery/tree", response_model=APIResponse)
def get_discovery_tree(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None),
    all_tenants: bool = Query(False),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, all_tenants, current_user)
        result = discovery_service.get_tree(effective_tenant)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))