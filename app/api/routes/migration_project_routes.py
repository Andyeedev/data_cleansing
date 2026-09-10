from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.core.auth.rbac import require_admin
from app.api.models.responses import APIResponse
from app.services.migration_project_service import MigrationProjectService

router = APIRouter(prefix="/api/v1/migration/projects", tags=["Migration Projects"])

migration_project_service = MigrationProjectService()


class ProjectCreateRequest(BaseModel):
    project_name: str
    project_type: str = "MIGRATION"


class ProjectUpdateRequest(BaseModel):
    project_name: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[str] = None


@router.get("", response_model=APIResponse)
def list_projects(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: str = Query(None),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = migration_project_service.get_projects(
            limit, offset, status, tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tenants", response_model=APIResponse)
def list_tenants(current_user=Depends(require_admin)):
    try:
        tenants = migration_project_service.get_tenants()
        return APIResponse(success=True, data=tenants)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/overview", response_model=APIResponse)
def get_overview(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = migration_project_service.get_overview(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=APIResponse)
def create_project(
    payload: ProjectCreateRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        result = migration_project_service.create_project(
            current_user.get("tenant_id"), payload.project_name, payload.project_type)
        return APIResponse(success=True, data=result)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}", response_model=APIResponse)
def get_project(
    project_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        result = migration_project_service.get_project_for_tenant(
            project_id, current_user.get("tenant_id"))
        if not result:
            raise HTTPException(status_code=404, detail="Project not found")
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{project_id}", response_model=APIResponse)
def update_project(
    project_id: str,
    payload: ProjectUpdateRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        result = migration_project_service.update_project(
            project_id, current_user.get("tenant_id"),
            payload.project_name, payload.project_type, payload.status)
        return APIResponse(success=True, data=result)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{project_id}", response_model=APIResponse)
def delete_project(
    project_id: str,
    mode: str = Query("archive", pattern="^(archive|hard)$"),
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        result = migration_project_service.delete_project(
            project_id, current_user.get("tenant_id"), mode)
        return APIResponse(success=True, data=result)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
