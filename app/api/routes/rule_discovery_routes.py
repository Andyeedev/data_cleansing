from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.rule_discovery_service import RuleDiscoveryService

router = APIRouter(prefix="/api/v1/rules/discovery", tags=["Rule Discovery"])

rule_discovery_service = RuleDiscoveryService()


# =========================
# GET DISCOVERED RULES FOR PROJECT
# =========================
@router.get("/{project_id}", response_model=APIResponse)
def get_discovered_rules(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        data = rule_discovery_service.get_discovered_rules(project_id)
        return APIResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TRIGGER RULE DISCOVERY
# =========================
@router.post("/{project_id}/trigger", response_model=APIResponse)
def trigger_rule_discovery(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = rule_discovery_service.trigger_discovery(project_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CHECK DISCOVERY STATUS
# =========================
@router.get("/{project_id}/status", response_model=APIResponse)
def get_discovery_status(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        status = rule_discovery_service.get_discovery_status(project_id)
        return APIResponse(success=True, data=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# VIEW RULE-TO-DATASET MAPPINGS
# =========================
@router.get("/{project_id}/mappings", response_model=APIResponse)
def get_discovery_mappings(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        data = rule_discovery_service.get_discovery_mappings(project_id)
        return APIResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
