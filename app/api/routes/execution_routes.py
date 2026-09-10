from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
import uuid
from app.services.execution_service import ExecutionService
from app.services.migration_project_service import MigrationProjectService
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.middleware.entitlement_middleware import require_entitlement

router = APIRouter(prefix="/api/v1/execution", tags=["Execution"])

# NOTE: MigrationProjectService is instantiated per-request (never module-level)
# so pooled DB connections are not held for the process lifetime.


@router.post("/run")
def run_execution(
    project_id: str,
    background_tasks: BackgroundTasks,
    batch_name: str = None,
    current_user=Depends(get_current_user_with_tenant),
    _entitled=Depends(require_entitlement("migration"))
):
    # DEV-003: tenancy from JWT only — the ?tenant_id= parameter is removed.
    # DEV-001: the project must belong to the JWT tenant.
    # DEV-009: 'migration' entitlement required (all current plans include it).
    jwt_tenant = current_user.get("tenant_id")
    project = MigrationProjectService().get_project_for_tenant(project_id, jwt_tenant)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate batch_id immediately so we can return it to the user
    batch_id = str(uuid.uuid4())

    # Run engine in background
    background_tasks.add_task(ExecutionService().run, project_id, batch_id, batch_name, jwt_tenant)

    return {
        "message": "Migration execution triggered successfully in background",
        "batch_id": batch_id,
        "batch_name": batch_name,
        "project_id": project_id,
        "tenant_id": jwt_tenant,
        "status_url": f"/execution/status/{batch_id}"
    }


@router.get("/status/{batch_id}")
def get_execution_status(
    batch_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    # DEV-001: batch status scoped to JWT tenant (unknown/foreign → NOT_FOUND).
    return ExecutionService().get_status(batch_id, tenant_id=current_user.get("tenant_id"))
