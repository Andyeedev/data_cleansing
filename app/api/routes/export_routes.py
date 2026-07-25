from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.core.auth.dependencies import get_current_user
from app.services.export_service import ExportService
import io

router = APIRouter(prefix="/api/v1/execution/export", tags=["Export"])

export_service = ExportService()


@router.get("/{batch_id}/csv")
def export_csv(
    batch_id: str,
    current_user=Depends(get_current_user)
):
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/pdf")
def export_pdf(
    batch_id: str,
    current_user=Depends(get_current_user)
):
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
