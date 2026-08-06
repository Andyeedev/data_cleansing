from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.rule_registry_models import (
    RuleRegistryResponse,
    RuleRegistryCreateRequest,
    RuleRegistryUpdateRequest,
    RuleRegistryListResponse
)
from app.services.rule_registry_service import RuleRegistryService

router = APIRouter(prefix="/api/v1/rules", tags=["Rule Registry"])

rule_registry_service = RuleRegistryService()


# =========================
# LIST ALL RULES
# =========================
@router.get("", response_model=APIResponse)
@router.get("/", response_model=APIResponse)
def list_rules(
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_registry_service.get_all_rules()
        return APIResponse(success=True, data={"rules": rules, "total": len(rules)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET RULE BY ID
# =========================
@router.get("/{rule_id}", response_model=APIResponse)
def get_rule(
    rule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rule = rule_registry_service.get_rule_by_id(rule_id)
        if not rule:
            raise HTTPException(status_code=404, detail="Rule not found")
        return APIResponse(success=True, data=rule)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET RULES BY CONTROL
# =========================
@router.get("/control/{control_id}", response_model=APIResponse)
def get_rules_by_control(
    control_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_registry_service.get_rules_by_control(control_id)
        return APIResponse(success=True, data={"rules": rules, "total": len(rules)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CREATE RULE
# =========================
@router.post("", response_model=APIResponse)
@router.post("/", response_model=APIResponse)
def create_rule(
    request: RuleRegistryCreateRequest,
    current_user=Depends(get_current_user)
):
    try:
        rule_data = request.model_dump()
        rule = rule_registry_service.create_rule(rule_data)
        return APIResponse(success=True, data=rule)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# UPDATE RULE
# =========================
@router.put("/{rule_id}", response_model=APIResponse)
def update_rule(
    rule_id: str,
    request: RuleRegistryUpdateRequest,
    current_user=Depends(get_current_user)
):
    try:
        rule_data = request.model_dump(exclude_unset=True)
        rule = rule_registry_service.update_rule(rule_id, rule_data)
        if not rule:
            raise HTTPException(status_code=404, detail="Rule not found")
        return APIResponse(success=True, data=rule)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DELETE RULE
# =========================
@router.delete("/{rule_id}", response_model=APIResponse)
def delete_rule(
    rule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        success = rule_registry_service.delete_rule(rule_id)
        if not success:
            raise HTTPException(status_code=404, detail="Rule not found")
        return APIResponse(success=True, data={"message": "Rule deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
