from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.governance_service import GovernanceService

router = APIRouter(prefix="/api/v1/governance", tags=["Governance"])

governance_service = GovernanceService()


def _require_admin(current_user=Depends(get_current_user)):
    roles = current_user.get("roles", [])
    if not any("admin" in r.lower() for r in roles):
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    return current_user


@router.get("/audit", response_model=APIResponse)
def get_audit_log(
    limit: int = Query(50, ge=1, le=200),
    entity_type: str = Query(None),
    current_user=Depends(_require_admin)
):
    try:
        result = governance_service.get_audit_log(limit, entity_type)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/approvals", response_model=APIResponse)
def get_approvals(
    current_user=Depends(_require_admin)
):
    try:
        result = governance_service.get_approvals()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exceptions", response_model=APIResponse)
def get_exceptions(
    current_user=Depends(_require_admin)
):
    try:
        result = governance_service.get_exceptions()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compliance", response_model=APIResponse)
def get_compliance_status(
    current_user=Depends(_require_admin)
):
    try:
        result = governance_service.get_compliance_status()
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
