from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.rule_execution_models import (
    RuleExecutionResponse,
    RuleExecutionDetailResponse,
    ExecutionResultsSummary
)
from app.services.rule_execution_service import RuleExecutionService

router = APIRouter(prefix="/api/v1/execution", tags=["Rule Execution"])

rule_execution_service = RuleExecutionService()


@router.get("/{batch_id}/rules", response_model=APIResponse)
def get_batch_rules(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_execution_service.get_rules_by_batch(batch_id)
        return APIResponse(success=True, data=rules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/rules/{rule_id}", response_model=APIResponse)
def get_rule_detail(
    batch_id: str,
    rule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rule = rule_execution_service.get_rule_detail(batch_id, rule_id)
        if not rule:
            raise HTTPException(status_code=404, detail="Rule not found")
        return APIResponse(success=True, data=rule)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/control/{control_id}/rules", response_model=APIResponse)
def get_control_rules(
    batch_id: str,
    control_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_execution_service.get_rules_by_control(batch_id, control_id)
        return APIResponse(success=True, data=rules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/results", response_model=APIResponse)
def get_execution_results(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        results = rule_execution_service.get_execution_results(batch_id)
        return APIResponse(success=True, data=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
