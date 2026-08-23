"""Report Suite API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.services.report_suite_service import ReportSuiteService

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


@router.get("/batches")
def get_batches(
    tenant_id: Optional[str] = Query(None),
    limit: int = Query(50),
    current_user=Depends(get_current_user),
):
    """List recent validation batches."""
    db = get_db_connection()
    try:
        if tenant_id:
            rows = db.execute(
                "SELECT batch_id, batch_name, batch_status, created_at FROM engine.migration_batch_registry WHERE tenant_id = %s ORDER BY created_at DESC LIMIT %s",
                (tenant_id, limit),
            )
        else:
            rows = db.execute(
                "SELECT batch_id, batch_name, batch_status, created_at FROM engine.migration_batch_registry ORDER BY created_at DESC LIMIT %s",
                (limit,),
            )
        batches = [{"batch_id": r[0], "batch_name": r[1], "batch_status": r[2], "created_at": str(r[3]) if r[3] else None} for r in rows]
        return {"success": True, "data": batches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/suite")
def get_report_suite(
    tenant_id: Optional[str] = Query(None),
    batch_id: Optional[str] = Query(None),
    current_user=Depends(get_current_user),
):
    """Get the full report suite for a tenant and optional batch."""
    db = get_db_connection()
    try:
        service = ReportSuiteService(db)
        data = service.get_suite(tenant_id=tenant_id, batch_id=batch_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report suite generation failed: {str(e)}")
