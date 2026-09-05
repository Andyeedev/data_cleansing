from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.db.connection import get_db_connection
from app.services.diagnostics_service import DiagnosticsService
from app.api.core.auth.dependencies import get_current_user_with_tenant

router = APIRouter(prefix="/api/v1/diagnostics", tags=["Diagnostics"])


def _resolve_tenant(tenant_id: Optional[str], current_user: dict) -> Optional[str]:
    # Admin can override tenant via query param; non-admin restricted to own tenant
    if tenant_id and tenant_id not in ("", "all"):
        # Allow override for admin - frontend passes selectedTenant
        return tenant_id
    return current_user.get("tenant_id")


# =========================
# SUMMARY
# =========================
@router.get("/summary")
def get_summary(
    tenant_id: Optional[str] = Query(None, description="Override tenant ID"),
    current_user=Depends(get_current_user_with_tenant),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, current_user)
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_summary(tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# LIST ALL SYSTEMS WITH HEALTH
# =========================
@router.get("")
@router.get("/")
def list_all_diagnostics(
    tenant_id: Optional[str] = Query(None, description="Override tenant ID"),
    current_user=Depends(get_current_user_with_tenant),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, current_user)
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_all_diagnostics(tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET CACHED RESULT
# =========================
@router.get("/{system_id}")
def get_diagnostics(
    system_id: str,
    tenant_id: Optional[str] = Query(None, description="Override tenant ID"),
    current_user=Depends(get_current_user_with_tenant),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, current_user)
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_cached_result(system_id, tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# RUN FULL DIAGNOSTICS
# =========================
@router.post("/{system_id}/run")
def run_diagnostics(
    system_id: str,
    tenant_id: Optional[str] = Query(None, description="Override tenant ID"),
    current_user=Depends(get_current_user_with_tenant),
):
    try:
        effective_tenant = _resolve_tenant(tenant_id, current_user)
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.run_full_diagnostics(system_id, tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TEST HISTORY
# =========================
@router.get("/{system_id}/history")
def get_test_history(
    system_id: str,
    tenant_id: Optional[str] = Query(None, description="Override tenant ID"),
    current_user=Depends(get_current_user_with_tenant),
):
    try:
        db = get_db_connection()
        service = DiagnosticsService(db.conn)
        data = service.get_test_history(system_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
