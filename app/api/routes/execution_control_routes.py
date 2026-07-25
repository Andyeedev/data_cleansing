from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.execution_control_models import (
    ExecutionControlResponse,
    ExecutionLifecycleResponse,
    ExecutionProgressResponse
)
from app.services.execution_control_service import ExecutionControlService

router = APIRouter(prefix="/api/v1/execution", tags=["Execution Control"])

execution_control_service = ExecutionControlService()


@router.post("/{batch_id}/cancel", response_model=APIResponse)
def cancel_execution(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.cancel_execution(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{batch_id}/pause", response_model=APIResponse)
def pause_execution(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.pause_execution(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{batch_id}/resume", response_model=APIResponse)
def resume_execution(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.resume_execution(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{batch_id}/retry", response_model=APIResponse)
def retry_execution(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.retry_execution(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/lifecycle", response_model=APIResponse)
def get_lifecycle(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.get_lifecycle(batch_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/progress", response_model=APIResponse)
def get_progress(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = execution_control_service.get_progress(batch_id)
        if not result:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
