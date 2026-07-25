from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.validation_report_models import (
    ValidationReportResponse,
    GovernanceDecisionResponse,
    RiskScoreResponse,
    ComplianceCheckResponse
)
from app.services.validation_report_service import ValidationReportService

router = APIRouter(prefix="/api/v1/execution", tags=["Validation Report"])

validation_report_service = ValidationReportService()


@router.get("/{batch_id}/report", response_model=APIResponse)
def get_validation_report(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        report = validation_report_service.get_validation_report(batch_id)
        if not report:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=report)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/governance", response_model=APIResponse)
def get_governance_decision(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        decision = validation_report_service.get_governance_decision(batch_id)
        if not decision:
            raise HTTPException(status_code=404, detail="Governance decision not found")
        return APIResponse(success=True, data=decision)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/risk-score", response_model=APIResponse)
def get_risk_score(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        risk = validation_report_service.get_risk_score(batch_id)
        return APIResponse(success=True, data=risk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/compliance", response_model=APIResponse)
def get_compliance_checks(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        compliance = validation_report_service.get_compliance_checks(batch_id)
        return APIResponse(success=True, data=compliance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
