from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.monitoring_service import MonitoringService

router = APIRouter(prefix="/api/v1/monitoring", tags=["Monitoring"])

monitoring_service = MonitoringService()


def _require_admin(current_user=Depends(get_current_user)):
    roles = current_user.get("roles", [])
    if not any("admin" in r.lower() for r in roles):
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    return current_user


@router.get("/health", response_model=APIResponse)
def get_health(
    current_user=Depends(_require_admin)
):
    try:
        result = monitoring_service.get_system_health()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/metrics", response_model=APIResponse)
def get_metrics(
    current_user=Depends(_require_admin)
):
    try:
        result = monitoring_service.get_performance_metrics()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/queue", response_model=APIResponse)
def get_queue(
    current_user=Depends(_require_admin)
):
    try:
        result = monitoring_service.get_queue_status()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts", response_model=APIResponse)
def get_alerts(
    current_user=Depends(_require_admin)
):
    try:
        result = monitoring_service.get_alerts()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs", response_model=APIResponse)
def get_logs(
    limit: int = Query(50, ge=1, le=200),
    current_user=Depends(_require_admin)
):
    try:
        result = monitoring_service.get_operational_logs(limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
