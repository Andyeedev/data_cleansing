from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse, PaginatedData
from app.api.models.execution_history_models import (
    ExecutionHistoryItem,
    ExecutionHistoryDetail,
    ReExecuteResponse,
    AuditTrailResponse
)
from app.services.execution_history_service import ExecutionHistoryService

router = APIRouter(prefix="/api/v1/execution", tags=["Execution History"])

execution_history_service = ExecutionHistoryService()


@router.get("/history", response_model=APIResponse)
def get_execution_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_user)
):
    try:
        result = execution_history_service.get_execution_history(page, page_size)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{batch_id}", response_model=APIResponse)
def get_execution_detail(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        detail = execution_history_service.get_execution_detail(batch_id)
        if not detail:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=detail)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/history/{batch_id}/re-execute", response_model=APIResponse)
def re_execute_batch(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_history_service.re_execute(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/audit", response_model=APIResponse)
def get_audit_trail(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        audit = execution_history_service.get_audit_trail(batch_id)
        return APIResponse(success=True, data=audit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
