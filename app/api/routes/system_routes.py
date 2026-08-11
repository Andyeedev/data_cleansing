from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.services.system_service import SystemService
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.models.system_models import SystemCreateRequest

router = APIRouter(prefix="/api/v1/systems", tags=["Systems"])


# =========================
# REQUEST MODELS
# =========================
class ConnectionConfig(BaseModel):
    host: str
    port: int
    database: str


class CreateSystemRequest(BaseModel):
    system_name: str
    system_role: str
    database_type: str
    connection_config: ConnectionConfig


class UpdateSystemRequest(BaseModel):
    system_name: Optional[str] = None
    system_role: Optional[str] = None
    database_type: Optional[str] = None
    connection_config: Optional[ConnectionConfig] = None


# =========================
# LIST
# =========================
@router.get("")
@router.get("/")
def list_systems(current_user=Depends(get_current_user_with_tenant)):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    data = SystemService(db.conn).list_systems(tenant_id=tenant_id)
    return {"success": True, "data": data}


# =========================
# GET ONE
# =========================
@router.get("/{system_id}")
def get_system(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    data = SystemService(db.conn).get_system(system_id, tenant_id=tenant_id)
    return {"success": True, "data": data}


# =========================
# CREATE
# =========================
@router.post("")
@router.post("/")
def create_system(
    payload: SystemCreateRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = SystemService(db.conn)
        result = service.create_system(payload, tenant_id=tenant_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TEST CONNECTION
# =========================
@router.get("/{system_id}/test")
def test_connection(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    tenant_id = current_user.get("tenant_id")
    db = get_db_connection()
    data = SystemService(db.conn).test_connection(system_id, tenant_id=tenant_id)
    return {"success": True, "data": data}


# =========================
# UPDATE
# =========================
@router.put("/{system_id}")
def update_system(
    system_id: str,
    payload: UpdateSystemRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = SystemService(db.conn)
        result = service.update_system(system_id, payload, tenant_id=tenant_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DELETE
# =========================
@router.delete("/{system_id}")
def delete_system(system_id: str, current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        service = SystemService(db.conn)
        result = service.delete_system(system_id, tenant_id=tenant_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
