from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

dashboard_service = DashboardService()


def _require_admin(current_user=Depends(get_current_user)):
    roles = current_user.get("roles", [])
    if not any("admin" in r.lower() for r in roles):
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    return current_user


@router.get("/portfolio", response_model=APIResponse)
def get_portfolio(
    tenant_id: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = dashboard_service.get_portfolio_summary(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/kpis", response_model=APIResponse)
def get_kpis(
    tenant_id: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = dashboard_service.get_kpis(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/activity", response_model=APIResponse)
def get_activity(
    limit: int = Query(10, ge=1, le=50),
    tenant_id: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = dashboard_service.get_activity(limit, tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/control-results", response_model=APIResponse)
def get_control_results(
    limit: int = Query(20, ge=1, le=100),
    tenant_id: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = dashboard_service.get_control_results(tenant_id, limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent-executions", response_model=APIResponse)
def get_recent_executions(
    limit: int = Query(10, ge=1, le=50),
    tenant_id: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = dashboard_service.get_recent_executions(tenant_id, limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
