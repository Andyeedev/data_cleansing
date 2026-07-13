from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.helpers import standardize_response
from app.services.task_service import TaskService

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])


class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    type: str = "task"
    assigned_to: Optional[str] = None
    project_id: Optional[str] = None
    parent_task_id: Optional[str] = None
    due_date: Optional[date] = None
    estimated_hours: Optional[float] = None
    tags: list = []


class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[date] = None
    completion_percentage: Optional[int] = None


class TaskCommentRequest(BaseModel):
    content: str


@router.get("/")
def list_tasks(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.list_tasks(
        page=page, page_size=page_size,
        status=status, priority=priority,
        assigned_to=assigned_to
    ))


@router.get("/{task_id}")
def get_task(task_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.get_task(task_id))


@router.post("/")
def create_task(
    payload: TaskCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.create_task(payload, current_user.get("sub")))


@router.put("/{task_id}")
def update_task(
    task_id: str,
    payload: TaskUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.update_task(task_id, payload))


@router.delete("/{task_id}")
def delete_task(task_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.delete_task(task_id))


@router.post("/{task_id}/comments")
def add_comment(
    task_id: str,
    payload: TaskCommentRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.add_comment(task_id, payload, current_user.get("sub")))


@router.get("/{task_id}/comments")
def get_comments(task_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.get_comments(task_id))


@router.get("/my/list")
def get_my_tasks(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = TaskService(db.conn)
    return standardize_response(service.list_tasks(
        page=page, page_size=page_size,
        assigned_to=current_user.get("sub")
    ))
