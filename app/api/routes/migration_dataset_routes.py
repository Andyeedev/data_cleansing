from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.models.responses import APIResponse
from app.services.migration_dataset_service import MigrationDatasetService
from app.services.migration_project_service import MigrationProjectService

router = APIRouter(prefix="/api/v1/migration/datasets", tags=["Migration Datasets"])

migration_dataset_service = MigrationDatasetService()
project_service = MigrationProjectService()


@router.get("", response_model=APIResponse)
def list_datasets(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    project_id: str = Query(None),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant)
):
    # DEV-001/DEV-003: JWT tenant; a requested project must belong to it.
    try:
        if project_id and not project_service.get_project_for_tenant(project_id, tenant_id):
            raise HTTPException(status_code=404, detail="Project not found")
        result = migration_dataset_service.get_datasets(limit, offset, project_id, tenant_id)
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
