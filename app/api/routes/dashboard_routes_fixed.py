from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.models.responses import APIResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

dashboard_service = DashboardService()

@router.get("/portfolio", response_model=APIResponse)
def get_portfolio(current_user: dict = Depends(get_current_user_with_tenant)):
    try:
        result = dashboard_service.get_portfolio_summary(current_user.get("tenant_id"))
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/kpis", response_model=APIResponse)
def get_kpis(current_user: dict = Depends(get_current_user_with_tenant)):
    try:
        result = dashboard_service.get_kpis(current_user.get("tenant_id"))
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activity", response_model=APIResponse)
def get_activity(
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user_with_tenant)
):
    try:
        result = dashboard_service.get_activity(tenant_id=current_user.get("tenant_id"), limit=limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/control-results", response_model=APIResponse)
def get_control_results(
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user_with_tenant)
):
    try:
        result = dashboard_service.get_control_results(tenant_id=current_user.get("tenant_id"), limit=limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent-executions", response_model=APIResponse)
def get_recent_executions(
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user_with_tenant)
):
    try:
        result = dashboard_service.get_recent_executions(tenant_user.get("tenant_id"), limit=limit)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
