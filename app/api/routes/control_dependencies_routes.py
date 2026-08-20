"""
Control Dependencies Routes

API endpoints for managing control DAG dependencies.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.api.core.auth.dependencies import get_current_user
from app.db.connection import get_db_connection
from app.services.control_dependencies_service import ControlDependenciesService

router = APIRouter(prefix="/api/v1/control-dependencies", tags=["Control Dependencies"])


class DependencyCreateRequest(BaseModel):
    control_id: str
    depends_on: str
    project_id: Optional[str] = None


class DependencyDeleteRequest(BaseModel):
    control_id: str
    depends_on: str
    project_id: Optional[str] = None


@router.get("")
def list_dependencies(
    project_id: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    """List all control dependencies, optionally filtered by project."""
    db = get_db_connection()
    service = ControlDependenciesService(db)
    deps = service.get_dependencies(project_id)
    tree = service.get_dependency_tree(project_id)
    return {
        "success": True,
        "data": {
            "dependencies": deps,
            "tree": tree,
            "total": len(deps),
        },
    }


@router.post("")
def add_dependency(
    body: DependencyCreateRequest,
    current_user=Depends(get_current_user),
):
    """Add a control dependency."""
    db = get_db_connection()
    service = ControlDependenciesService(db)
    try:
        service.add_dependency(body.control_id, body.depends_on, body.project_id)
        return {"success": True, "message": f"Dependency {body.control_id} -> {body.depends_on} added"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("")
def delete_dependency(
    control_id: str,
    depends_on: str,
    project_id: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    """Remove a control dependency."""
    db = get_db_connection()
    service = ControlDependenciesService(db)
    service.delete_dependency(control_id, depends_on, project_id)
    return {"success": True, "message": f"Dependency {control_id} -> {depends_on} removed"}
