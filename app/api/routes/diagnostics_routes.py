from fastapi import APIRouter, Depends, HTTPException

from app.db.connection import get_db_connection
from app.services.diagnostics_service import DiagnosticsService
from app.api.core.auth.dependencies import get_current_user_with_tenant

router = APIRouter(prefix="/api/v1/diagnostics", tags=["Diagnostics"])


# =========================
# SUMMARY
# =========================
@router.get("/summary")
def get_summary(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_summary(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# LIST ALL SYSTEMS WITH HEALTH
# =========================
@router.get("")
@router.get("/")
def list_all_diagnostics(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_all_diagnostics(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET CACHED RESULT
# =========================
@router.get("/{system_id}")
def get_diagnostics(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_cached_result(system_id, tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# RUN FULL DIAGNOSTICS
# =========================
@router.post("/{system_id}/run")
def run_diagnostics(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.run_full_diagnostics(system_id, tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TEST HISTORY
# =========================
@router.get("/{system_id}/history")
def get_test_history(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_test_history(system_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
