from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.db.connection import get_db_connection
from app.services.credential_service import CredentialService
from app.api.core.auth.dependencies import get_current_user_with_tenant

router = APIRouter(prefix="/api/v1/credentials", tags=["Credentials"])


# =========================
# REQUEST MODELS
# =========================
class CreateCredentialRequest(BaseModel):
    system_id: str
    username: str
    password: str


class UpdateCredentialRequest(BaseModel):
    username: str
    password: str


# =========================
# LIST
# =========================
@router.get("")
@router.get("/")
def list_credentials(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        with get_db_connection() as db:
            service = CredentialService(db.conn)
            data = service.list_credentials(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CREATE
# =========================
@router.post("/")
def create_credential(
    payload: CreateCredentialRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        tenant_id = current_user.get("tenant_id")
        with get_db_connection() as db:
            service = CredentialService(db.conn)
            result = service.create_credential(
                system_id=payload.system_id,
                username=payload.username,
                password=payload.password,
                tenant_id=tenant_id
            )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# UPDATE
# =========================
@router.put("/{credential_id}")
def update_credential(
    credential_id: str,
    payload: UpdateCredentialRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        tenant_id = current_user.get("tenant_id")
        with get_db_connection() as db:
            service = CredentialService(db.conn)
            result = service.update_credential(
                credential_id=credential_id,
                username=payload.username,
                password=payload.password,
                tenant_id=tenant_id
            )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DELETE
# =========================
@router.delete("/{credential_id}")
def delete_credential(
    credential_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        tenant_id = current_user.get("tenant_id")
        with get_db_connection() as db:
            service = CredentialService(db.conn)
            result = service.delete_credential(credential_id, tenant_id=tenant_id)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
