from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.db.connection import get_db_connection
from app.services.system_service import SystemService
from app.api.core.auth.dependencies import get_current_user
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


# =========================
# LIST
# =========================
@router.get("/")
def list_systems(current_user=Depends(get_current_user)):

    db = get_db_connection()
    return SystemService(db.conn).list_systems()


# =========================
# GET ONE
# =========================
@router.get("/{system_id}")
def get_system(system_id: str, current_user=Depends(get_current_user)):

    db = get_db_connection()
    return SystemService(db.conn).get_system(system_id)


# =========================
# CREATE
# =========================
# @router.post("/")
# def create_system_legacy(
#    payload: CreateSystemRequest,
#    current_user=Depends(get_current_user)
# ):

#    db = get_db_connection()
#    return SystemService(db.conn).create_system(payload)

# @router.post("/")
# def create_system_legacy_1(
#    payload: SystemCreateRequest,
#    current_user=Depends(get_current_user)
# ):
#    try:
#        db = get_db_connection()
#        service = SystemService(db.conn)

#        return service.create_system(payload)

#    except Exception as e:
#        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_system(
    payload: SystemCreateRequest,
    current_user=Depends(get_current_user)
):
    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.create_system(payload)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# =========================
# TEST CONNECTION
# =========================


@router.get("/{system_id}/test")
def test_connection(system_id: str, current_user=Depends(get_current_user)):

    db = get_db_connection()
    return SystemService(db.conn).test_connection(system_id)
