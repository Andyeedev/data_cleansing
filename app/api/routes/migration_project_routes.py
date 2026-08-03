from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.migration_project_service import MigrationProjectService

router = APIRouter(prefix="/api/v1/migration/projects", tags=["Migration Projects"])

migration_project_service = MigrationProjectService()


@router.get("", response_model=APIResponse)
def list_projects(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: str = Query(None),
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = migration_project_service.get_projects(limit, offset, status, tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tenants", response_model=APIResponse)
def list_tenants(current_user=Depends(get_current_user)):
    try:
        tenants = migration_project_service.get_tenants()
        return APIResponse(success=True, data=tenants)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/overview", response_model=APIResponse)
def get_overview(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = migration_project_service.get_overview(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}", response_model=APIResponse)
def get_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = migration_project_service.get_project(project_id)
        if not result:
            raise HTTPException(status_code=404, detail="Project not found")
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
