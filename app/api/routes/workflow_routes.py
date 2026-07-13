from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.helpers import standardize_response
from app.services.workflow_service import WorkflowService

router = APIRouter(prefix="/api/v1/workflows", tags=["Workflows"])


class WorkflowCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "custom"
    steps: list = []
    triggers: list = []


class WorkflowUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    steps: Optional[list] = None


class WorkflowExecuteRequest(BaseModel):
    context: dict = {}
    variables: dict = {}
    assigned_to: Optional[str] = None


@router.get("/")
def list_workflows(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    type: Optional[str] = None,
    status: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.list_workflows(
        page=page, page_size=page_size,
        type=type, status=status
    ))


@router.get("/{workflow_id}")
def get_workflow(workflow_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.get_workflow(workflow_id))


@router.post("/")
def create_workflow(
    payload: WorkflowCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.create_workflow(payload))


@router.put("/{workflow_id}")
def update_workflow(
    workflow_id: str,
    payload: WorkflowUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.update_workflow(workflow_id, payload))


@router.delete("/{workflow_id}")
def delete_workflow(workflow_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.delete_workflow(workflow_id))


@router.post("/{workflow_id}/execute")
def execute_workflow(
    workflow_id: str,
    payload: WorkflowExecuteRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.execute_workflow(workflow_id, payload))


@router.get("/{workflow_id}/instances")
def get_workflow_instances(
    workflow_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.get_workflow_instances(workflow_id, page, page_size))


@router.get("/instances/{instance_id}")
def get_workflow_instance(instance_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = WorkflowService(db.conn)
    return standardize_response(service.get_workflow_instance(instance_id))
