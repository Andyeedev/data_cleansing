from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.discovery_models import (
    DatasetMappingResponse,
    DiscoveryStatusResponse,
    DiscoveryTriggerRequest,
    DiscoveryTriggerResponse
)
from app.services.discovery_service_api import DiscoveryService

router = APIRouter(prefix="/api/v1/discovery", tags=["Discovery"])

discovery_service = DiscoveryService()


@router.get("/{batch_id}/datasets", response_model=APIResponse)
def get_discovery_datasets(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        datasets = discovery_service.get_datasets_by_batch(batch_id)
        return APIResponse(success=True, data=datasets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/datasets/{dataset_id}", response_model=APIResponse)
def get_discovery_dataset_detail(
    batch_id: str,
    dataset_id: str,
    current_user=Depends(get_current_user)
):
    try:
        dataset = discovery_service.get_dataset_by_id(dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset mapping not found")
        return APIResponse(success=True, data=dataset)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/current", response_model=APIResponse)
def trigger_discovery(
    request: DiscoveryTriggerRequest,
    current_user=Depends(get_current_user)
):
    try:
        result = discovery_service.trigger_discovery(request.project_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/status", response_model=APIResponse)
def get_discovery_status(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        status = discovery_service.get_discovery_status(batch_id)
        if not status:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=status)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
