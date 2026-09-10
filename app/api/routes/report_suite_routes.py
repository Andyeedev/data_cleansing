"""Report Suite API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.services.report_suite_service import ReportSuiteService
from app.services.execution_history_service import ExecutionHistoryService

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


@router.get("/batches")
def get_batches(
    limit: int = Query(50),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    """List recent validation batches."""
    with get_db_connection() as db:
        try:
            rows = db.execute(
                """SELECT r.batch_id, r.batch_name, r.batch_status, r.created_at
                   FROM engine.migration_batch_registry r
                   JOIN core.projects p ON p.project_id::text = r.project_id
                   WHERE p.tenant_id::text = %s ORDER BY r.created_at DESC LIMIT %s""",
                (str(tenant_id), limit),
            )
            batches = [{"batch_id": r[0], "batch_name": r[1], "batch_status": r[2], "created_at": str(r[3]) if r[3] else None} for r in rows]
            return {"success": True, "data": batches}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/suite")
def get_report_suite(
    batch_id: Optional[str] = Query(None),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    """Get the full report suite for the tenant and optional batch."""
    with get_db_connection() as db:
        try:
            if batch_id:
                project = ExecutionHistoryService().verify_batch_tenant(batch_id, tenant_id)
                if not project:
                    raise HTTPException(status_code=404, detail="Batch not found")
            service = ReportSuiteService(db)
            data = service.get_suite(tenant_id=tenant_id, batch_id=batch_id)
            return {"success": True, "data": data}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Report suite generation failed: {str(e)}")
