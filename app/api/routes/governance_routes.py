from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.models.responses import APIResponse
from app.services.governance_service import GovernanceService

router = APIRouter(prefix="/api/v1/governance", tags=["Governance"])

governance_service = GovernanceService()


def require_tenant_admin(current_user=Depends(get_current_user_with_tenant)):
    """Require Tenant Admin or Super Admin role."""
    roles = current_user.get("roles", [])
    is_super_admin = any("super admin" in r.lower() for r in roles)
    is_tenant_admin = any("tenant admin" in r.lower() for r in roles)
    if not (is_super_admin or is_tenant_admin):
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/overview", response_model=APIResponse)
def get_overview(
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_overview(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audit", response_model=APIResponse)
def get_audit_log(
    limit: int = Query(50, ge=1, le=200),
    entity_type: str = Query(None),
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_audit_log(limit, entity_type, tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/approvals", response_model=APIResponse)
def get_approvals(
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_approvals(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exceptions", response_model=APIResponse)
def get_exceptions(
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_exceptions(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compliance", response_model=APIResponse)
def get_compliance_status(
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_compliance_status(tenant_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reconciliation", response_model=APIResponse)
def get_reconciliation(
    batch_id: str = Query(None),
    current_user=Depends(require_tenant_admin),
    tenant_id: str = Depends(resolve_tenant),
):
    try:
        result = governance_service.get_reconciliation(tenant_id, batch_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
