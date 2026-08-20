from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.schedule_service import ScheduleService

router = APIRouter(prefix="/api/v1/migration/schedules", tags=["Migration Schedules"])

def get_schedule_service():
    return ScheduleService()


class ScheduleCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    project_id: str
    tenant_id: str
    cron_expression: str
    timezone: str = "UTC"
    enabled: bool = True


class ScheduleUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cron_expression: Optional[str] = None
    timezone: Optional[str] = None
    enabled: Optional[bool] = None


@router.get("", response_model=APIResponse)
def list_schedules(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    tenant_id: str = Query(None),
    project_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.get_schedules(limit, offset, tenant_id, project_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=APIResponse)
def get_stats(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.get_schedule_stats(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/calendar-events", response_model=APIResponse)
def list_calendar_events(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.get_calendar_events(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{schedule_id}", response_model=APIResponse)
def get_schedule(
    schedule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.get_schedule(schedule_id)
        if not result:
            raise HTTPException(status_code=404, detail="Schedule not found")
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{schedule_id}/logs", response_model=APIResponse)
def get_schedule_logs(
    schedule_id: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.get_execution_logs(schedule_id, limit, offset)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=APIResponse)
def create_schedule(
    request: ScheduleCreateRequest,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        result = service.create_schedule(request)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{schedule_id}", response_model=APIResponse)
def update_schedule(
    schedule_id: str,
    request: ScheduleUpdateRequest,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        existing = service.get_schedule(schedule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Schedule not found")
        result = service.update_schedule(schedule_id, request)
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{schedule_id}/toggle", response_model=APIResponse)
def toggle_schedule(
    schedule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        existing = service.get_schedule(schedule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Schedule not found")
        result = service.toggle_schedule(schedule_id)
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{schedule_id}", response_model=APIResponse)
def delete_schedule(
    schedule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        existing = service.get_schedule(schedule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Schedule not found")
        service.delete_schedule(schedule_id)
        return APIResponse(success=True, data={"deleted": True})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{schedule_id}/run", response_model=APIResponse)
def trigger_schedule_run(
    schedule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        service = get_schedule_service()
        existing = service.get_schedule(schedule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Schedule not found")

        project_id = existing["project_id"]
        tenant_id = existing.get("tenant_id")
        mapping_count = service.repository.db.execute(
            "SELECT COUNT(*) FROM core.dataset_mappings WHERE project_id = %s",
            (project_id,)
        )
        discovery_count = service.repository.db.execute(
            "SELECT COUNT(*) FROM core.column_mappings cm "
            "JOIN core.dataset_mappings dm ON cm.mapping_id = dm.mapping_id "
            "WHERE dm.project_id = %s",
            (project_id,)
        )
        has_mappings = (mapping_count[0][0] if mapping_count else 0) > 0
        has_discovery = (discovery_count[0][0] if discovery_count else 0) > 0

        if not has_mappings and not has_discovery:
            raise HTTPException(
                status_code=400,
                detail="Cannot run schedule: project has no dataset mappings or discovery data"
            )

        from app.services.schedule_runner import ScheduleRunner
        runner = ScheduleRunner()
        result = runner.run_schedule(schedule_id, triggered_by="manual",
                                     project_id=project_id, tenant_id=tenant_id)
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
