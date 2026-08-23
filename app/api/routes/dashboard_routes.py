from fastapi import APIRouter, Depends, HTTPException
from app.db.connection import get_db_connection
from app.services.report_suite_service import ReportSuiteService
from app.api.core.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/dashboards", tags=["Dashboards"])


def _get_svc():
    db = get_db_connection()
    return ReportSuiteService(db)


@router.get("/risk-assessment")
def get_risk_assessment(tenant_id: str = None, user=Depends(get_current_user)):
    try:
        svc = _get_svc()
        data = svc.get_risk_dashboard(tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/data-quality")
def get_data_quality(tenant_id: str = None, user=Depends(get_current_user)):
    try:
        svc = _get_svc()
        data = svc.get_quality_dashboard(tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/governance-centre")
def get_governance_centre(tenant_id: str = None, user=Depends(get_current_user)):
    try:
        svc = _get_svc()
        data = svc.get_governance_dashboard(tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
