from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.db.connection import get_db_connection
from app.services.system_service import SystemService
from app.api.core.auth.dependencies import get_current_user

router = APIRouter(prefix="/systems", tags=["Systems"])


# =========================
# REQUEST MODELS
# =========================
class CreateSystemRequest(BaseModel):
    system_name: str
    system_type: str


class UpdateSystemRequest(BaseModel):
    system_name: str
    system_type: str


# =========================
# LIST
# =========================
@router.get("/")
def list_systems(current_user=Depends(get_current_user)):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.list_systems()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET ONE
# =========================
@router.get("/{system_id}")
def get_system(system_id: str, current_user=Depends(get_current_user)):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.get_system(system_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CREATE
# =========================
@router.post("/")
def create_system(
    payload: CreateSystemRequest,
    current_user=Depends(get_current_user)
):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.create_system(
            system_name=payload.system_name,
            system_type=payload.system_type
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# UPDATE
# =========================
@router.put("/{system_id}")
def update_system(
    system_id: str,
    payload: UpdateSystemRequest,
    current_user=Depends(get_current_user)
):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.update_system(
            system_id=system_id,
            system_name=payload.system_name,
            system_type=payload.system_type
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DELETE
# =========================
@router.delete("/{system_id}")
def delete_system(
    system_id: str,
    current_user=Depends(get_current_user)
):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.delete_system(system_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


# =========================
# TEST CONNECTION
# =========================
@router.get("/{system_id}/test")
def test_connection(
    system_id: str,
    current_user=Depends(get_current_user)
):

    try:
        db = get_db_connection()
        service = SystemService(db.conn)

        return service.test_connection(system_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))