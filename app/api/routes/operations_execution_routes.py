"""
Operations Execution Routes

API endpoints for end-to-end validation run orchestration.
Reuses System 1 service classes for all step implementations.
"""

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Body, Query
from typing import List, Optional
from pydantic import BaseModel
from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.models.responses import APIResponse
from app.services.run_orchestrator_service import orchestrator_service
from app.services.migration_project_service import MigrationProjectService
from app.middleware.entitlement_middleware import require_entitlement

router = APIRouter(prefix="/api/v1/operations", tags=["Operations Execution"])


class RunRequest(BaseModel):
    tenant_id: str
    project_id: Optional[str] = None
    controls: Optional[List[str]] = None
    steps: Optional[List[str]] = None


@router.post("/run")
def start_run(
    body: RunRequest = Body(...),
    background_tasks: BackgroundTasks = None,
    current_user=Depends(get_current_user_with_tenant),
    _entitled=Depends(require_entitlement("migration")),
):
    """
    Start an end-to-end validation run.

    Executes connection health check, auto-discovery, mapping verification,
    rule execution, and governance check in sequence.
    Uses background tasks for long-running execution.
    DEV-003: body tenant must equal JWT tenant. DEV-001: project (if given)
    must belong to the JWT tenant. DEV-009: 'migration' entitlement required.
    """
    jwt_tenant_id = current_user.get("tenant_id")
    if body.tenant_id != jwt_tenant_id:
        raise HTTPException(status_code=403, detail="tenant_id mismatch: cannot start run for another tenant")
    if body.project_id:
        project = MigrationProjectService().get_project_for_tenant(body.project_id, jwt_tenant_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

    user_id = current_user.get("sub", "ANONYMOUS")

    # Register the run immediately (service generates run_id internally)
    run_info = orchestrator_service.start_run(
        tenant_id=body.tenant_id,
        project_id=body.project_id,
        controls=body.controls,
        steps=body.steps,
        user_id=user_id,
    )
    run_id = run_info["run_id"]

    # Execute the full run in background
    background_tasks.add_task(
        orchestrator_service.execute_run,
        run_id=run_id,
        tenant_id=body.tenant_id,
        project_id=body.project_id,
        controls=body.controls,
        steps=body.steps,
        user_id=user_id,
    )

    default_steps = ["health_check", "auto_discovery", "mapping_verification", "rule_execution", "full_map_validation"]

    return APIResponse(success=True, data={
        "run_id": run_id,
        "status": "RUNNING",
        "tenant_id": body.tenant_id,
        "project_id": body.project_id,
        "steps": body.steps or default_steps,
        "status_url": f"/api/v1/operations/run/{run_id}",
    })


def _require_run_tenant(run_id: str, tenant_id: str):
    # DEV-001: unknown/foreign runs 404 without leaking existence.
    from app.services.migration_project_service import MigrationProjectService
    result = orchestrator_service.get_run_status(run_id)
    if result["status"] == "NOT_FOUND":
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    if result.get("tenant_id") != tenant_id:
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    if result.get("project_id"):
        project = MigrationProjectService().get_project_for_tenant(
            str(result["project_id"]), tenant_id)
        if not project:
            raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    return result


@router.get("/run/{run_id}")
def get_run_status(
    run_id: str,
    current_user=Depends(get_current_user_with_tenant),
):
    """Get detailed status of a specific end-to-end run."""
    result = _require_run_tenant(run_id, current_user.get("tenant_id"))
    return APIResponse(success=True, data=result)


@router.get("/runs")
def get_run_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("started_at"),
    sort_dir: str = Query("desc"),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    """Get paginated end-to-end run history with filtering and sorting."""
    result = orchestrator_service.get_history(
        tenant_id=tenant_id,
        page=page,
        page_size=page_size,
        status=status,
        search=search,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )
    return APIResponse(success=True, data=result)


@router.get("/runs/status-breakdown")
def get_run_status_breakdown(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
):
    """Get status breakdown for KPI cards."""
    result = orchestrator_service.get_status_breakdown(tenant_id)
    return APIResponse(success=True, data=result)


@router.post("/run/{run_id}/re-execute")
def re_execute_run(
    run_id: str,
    current_user=Depends(get_current_user_with_tenant),
):
    """Re-execute a completed or failed run."""
    # DEV-001: the original run must belong to the JWT tenant.
    original = _require_run_tenant(run_id, current_user.get("tenant_id"))
    
    # Create new run with original tenant/project
    run_info = orchestrator_service.start_run(
        tenant_id=original["tenant_id"],
        project_id=original["project_id"],
        user_id=current_user.get("sub", "ANONYMOUS"),
    )
    orchestrator_service.execute_run(
        run_id=run_info["run_id"],
        tenant_id=original["tenant_id"],
        project_id=original["project_id"],
        user_id=current_user.get("sub", "ANONYMOUS"),
    )
    return APIResponse(success=True, data={"run_id": run_info["run_id"], "status": "RUNNING"})


@router.post("/run/{run_id}/cancel")
def cancel_run(
    run_id: str,
    current_user=Depends(get_current_user_with_tenant),
):
    """Cancel a running or pending run."""
    if not orchestrator_service.cancel_run(run_id):
        raise HTTPException(status_code=404, detail="Run not found or cannot be cancelled")
    return APIResponse(success=True, data={"run_id": run_id, "status": "CANCELLED"})
