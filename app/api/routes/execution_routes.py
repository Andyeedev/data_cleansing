from fastapi import APIRouter, Depends
from app.services.execution_service import ExecutionService
from app.api.core.auth.dependencies import get_current_user

router = APIRouter(prefix="/execution", tags=["Execution"])


@router.post("/run")
def run_execution(
    project_id: str,
    current_user=Depends(get_current_user)
):
    return ExecutionService().run(project_id)