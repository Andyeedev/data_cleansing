from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.models.responses import APIResponse
from app.services.migration_timeline_service import MigrationTimelineService

router = APIRouter(prefix="/api/v1/migration/timeline", tags=["Migration Timeline"])


def get_timeline_service():
    return MigrationTimelineService()


@router.get("/summary", response_model=APIResponse)
def get_timeline_summary(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        service = get_timeline_service()
        result = service.get_timeline_summary(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=APIResponse)
def get_timeline(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        service = get_timeline_service()
        result = service.get_timeline(tenant_id, limit, offset)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
