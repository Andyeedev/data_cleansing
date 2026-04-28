from fastapi import APIRouter
from app.services.execution_service import ExecutionService
from app.api.models.execution_models import ExecutionResponse

router = APIRouter(prefix="/execution", tags=["Execution"])


@router.post("/run", response_model=ExecutionResponse)
def run_execution(project_id: str):
    return ExecutionService().run(project_id)