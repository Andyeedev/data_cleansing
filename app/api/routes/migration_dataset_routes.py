from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.migration_dataset_service import MigrationDatasetService

router = APIRouter(prefix="/api/v1/migration/datasets", tags=["Migration Datasets"])

migration_dataset_service = MigrationDatasetService()


@router.get("", response_model=APIResponse)
def list_datasets(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    project_id: str = Query(None),
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = migration_dataset_service.get_datasets(limit, offset, project_id, tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
