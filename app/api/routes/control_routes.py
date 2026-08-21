from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.control_service import ControlService

router = APIRouter(prefix="/api/v1/validation/controls", tags=["Controls"])

control_service = ControlService()


@router.get("/outcomes", response_model=APIResponse)
def get_execution_outcomes(
    tenant_id: Optional[str] = Query(None, description="Filter by tenant"),
    current_user=Depends(get_current_user)
):
    try:
        summary = control_service.get_execution_outcomes(tenant_id=tenant_id)
        per_control = control_service.get_per_control_outcomes(tenant_id=tenant_id)
        return APIResponse(success=True, data={"summary": summary, "controls": per_control})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=APIResponse)
def get_controls(
    search: Optional[str] = Query(None, description="Search controls"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    status: Optional[str] = Query(None, description="Filter by status: enabled, disabled, all"),
    tenant_id: Optional[str] = Query(None, description="Filter controls by tenant via project ownership"),
    current_user=Depends(get_current_user)
):
    try:
        data = control_service.get_all_controls(search=search, severity=severity, status=status, tenant_id=tenant_id)
        return APIResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{control_id}", response_model=APIResponse)
def get_control(
    control_id: str,
    current_user=Depends(get_current_user)
):
    try:
        data = control_service.get_control_by_id(control_id)
        if not data:
            raise HTTPException(status_code=404, detail="Control not found")
        return APIResponse(success=True, data=data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{control_id}", response_model=APIResponse)
def update_control(
    control_id: str,
    updates: dict,
    current_user=Depends(get_current_user)
):
    try:
        existing = control_service.get_control_by_id(control_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Control not found")
        success = control_service.update_control(control_id, updates)
        if not success:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        return APIResponse(success=True, data={"message": "Control updated successfully"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=APIResponse)
def create_control(
    control_id: str,
    control_name: str,
    description: str,
    severity_level: str,
    enabled_flag: bool = True,
    current_user=Depends(get_current_user)
):
    try:
        success = control_service.create_control(control_id, control_name, description, severity_level, enabled_flag)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to create control")
        return APIResponse(success=True, data={"message": "Control created successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{control_id}", response_model=APIResponse)
def delete_control(
    control_id: str,
    current_user=Depends(get_current_user)
):
    try:
        existing = control_service.get_control_by_id(control_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Control not found")
        control_service.delete_control(control_id)
        return APIResponse(success=True, data={"message": "Control deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
