from fastapi import APIRouter, Depends, BackgroundTasks
import uuid
from app.services.execution_service import ExecutionService
from app.api.core.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/execution", tags=["Execution"])


@router.post("/run")
def run_execution(
    project_id: str,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user)
):
    # Generate batch_id immediately so we can return it to the user
    batch_id = str(uuid.uuid4())

    # Run engine in background
    background_tasks.add_task(ExecutionService().run, project_id, batch_id)

    return {
        "message": "Migration execution triggered successfully in background",
        "batch_id": batch_id,
        "project_id": project_id,
        "status_url": f"/execution/status/{batch_id}"
    }


@router.get("/status/{batch_id}")
def get_execution_status(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    return ExecutionService().get_status(batch_id)
