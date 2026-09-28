from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.services.execution_history_service import ExecutionHistoryService
from app.services.export_service import ExportService
import io

router = APIRouter(prefix="/api/v1/execution/export", tags=["Export"])

export_service = ExportService()
batch_tenant_service = ExecutionHistoryService()


def _require_batch_tenant(batch_id: str, tenant_id: str):
    """OC-REPORT-001 P0: batch_id arrives from the URL, so ownership must be
    proven before any rows are read. Reuses the canonical
    ExecutionHistoryService.verify_batch_tenant (batch -> project -> tenant) and
    the same 404-on-foreign convention as execution_history_routes /
    validation_report_routes, so a foreign or unknown batch is indistinguishable."""
    project = batch_tenant_service.verify_batch_tenant(batch_id, tenant_id)
    if not project:
        raise HTTPException(status_code=404, detail="Batch not found")
    return project


@router.get("/{batch_id}/csv")
def export_csv(
    batch_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    _require_batch_tenant(batch_id, tenant_id)
    try:
        csv_data = export_service.export_csv(batch_id)
        buffer = io.StringIO(csv_data)
        return StreamingResponse(
            iter([csv_data]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=execution_report_{batch_id}.csv"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/pdf")
def export_pdf(
    batch_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    _require_batch_tenant(batch_id, tenant_id)
    try:
        pdf_data = export_service.export_pdf(batch_id)
        buffer = io.BytesIO(pdf_data)
        return StreamingResponse(
            iter([pdf_data]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=execution_report_{batch_id}.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
