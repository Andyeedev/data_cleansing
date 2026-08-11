from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user, get_current_user_with_tenant
from app.api.models.responses import APIResponse
from app.api.models.validation_report_models import (
    ValidationReportResponse,
    GovernanceDecisionResponse,
    RiskScoreResponse,
    ComplianceCheckResponse
)
from app.services.validation_report_service import ValidationReportService
from app.services.execution_history_service import ExecutionHistoryService

router = APIRouter(prefix="/api/v1/execution", tags=["Validation Report"])

validation_report_service = ValidationReportService()
execution_history_service = ExecutionHistoryService()


# =========================
# DASHBOARD ENDPOINT
# =========================
@router.get("/dashboard")
@router.get("/dashboard/")
def get_validation_dashboard(
    current_user=Depends(get_current_user_with_tenant)
):
    """Aggregated validation dashboard data."""
    try:
        tenant_id = current_user.get("tenant_id")
        
        # Get data from existing services
        risk_scores = validation_report_service.get_all_risk_scores(tenant_id)
        migration_scores = validation_report_service.get_migration_score_summary(tenant_id)
        unscored = validation_report_service.get_unscored_batches(tenant_id)
        history = execution_history_service.get_execution_history(
            page=1, page_size=20, tenant_id=tenant_id
        )
        
        # Calculate summary metrics
        all_risks = risk_scores.get("risk_scores", [])
        all_scores = migration_scores.get("migration_scores", [])
        history_items = history.get("items", []) if isinstance(history, dict) else []
        
        # Count risk levels
        high_risk = sum(1 for r in all_risks if r.get("risk_level") in ("HIGH", "CRITICAL"))
        medium_risk = sum(1 for r in all_risks if r.get("risk_level") == "MEDIUM")
        low_risk = sum(1 for r in all_risks if r.get("risk_level") == "LOW")
        
        # Calculate compliance rate
        total_batches = len(all_scores)
        compliant_batches = sum(1 for s in all_scores if s.get("pass_rate", 0) >= 80)
        compliance_rate = round((compliant_batches / total_batches * 100), 1) if total_batches > 0 else 0
        
        # Count passed/failed from history
        passed = sum(1 for h in history_items if h.get("overall_status") == "PASS")
        failed = sum(1 for h in history_items if h.get("overall_status") == "FAIL")
        running = sum(1 for h in history_items if h.get("overall_status") == "RUNNING")
        
        # Build active runs (recent non-completed)
        active_runs = []
        for h in history_items[:10]:
            if h.get("overall_status") in ("RUNNING", "PENDING", "QUEUED"):
                active_runs.append({
                    "batch_id": h.get("batch_id"),
                    "status": h.get("overall_status"),
                    "started_at": h.get("batch_start_time"),
                    "project_id": h.get("project_id"),
                })
        
        # Build alerts from recent failures
        alerts = []
        for h in history_items[:5]:
            if h.get("overall_status") == "FAIL":
                alerts.append({
                    "type": "error",
                    "message": f"Batch {h.get('batch_id', '')[:8]}... failed validation",
                    "timestamp": h.get("batch_start_time"),
                    "batch_id": h.get("batch_id"),
                })
            elif h.get("overall_status") == "PASS":
                alerts.append({
                    "type": "success",
                    "message": f"Batch {h.get('batch_id', '')[:8]}... passed validation",
                    "timestamp": h.get("batch_start_time"),
                    "batch_id": h.get("batch_id"),
                })
        
        dashboard = {
            "summary": {
                "total_batches": total_batches,
                "compliance_rate": compliance_rate,
                "passed": passed,
                "failed": failed,
                "running": running,
                "high_risk": high_risk,
                "medium_risk": medium_risk,
                "low_risk": low_risk,
                "unscored_count": unscored.get("total", 0),
            },
            "risk_distribution": {
                "high": high_risk,
                "medium": medium_risk,
                "low": low_risk,
            },
            "active_runs": active_runs,
            "alerts": alerts,
            "recent_batches": history_items[:10],
        }
        
        return {"success": True, "data": dashboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/unscored-batches", response_model=APIResponse)
def get_unscored_batches(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = validation_report_service.get_unscored_batches(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orphaned-batches", response_model=APIResponse)
def get_orphaned_batches(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = validation_report_service.get_orphaned_batches(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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


@router.get("/risk-scores", response_model=APIResponse)
def get_all_risk_scores(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = validation_report_service.get_all_risk_scores(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/migration-score-summary", response_model=APIResponse)
def get_migration_score_summary(
    tenant_id: str = Query(None),
    current_user=Depends(get_current_user)
):
    try:
        result = validation_report_service.get_migration_score_summary(tenant_id)
        return APIResponse(success=True, data=result)
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
