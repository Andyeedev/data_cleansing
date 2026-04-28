from fastapi import APIRouter, Depends, HTTPException
from app.db.connection import get_db_connection
from app.services.credential_service import CredentialService
from app.api.core.auth.dependencies import get_current_user


router = APIRouter(prefix="/credentials", tags=["Credentials"])


@router.get("/")
def list_credentials(current_user=Depends(get_current_user)):

    print("🔐 AUTH OK:", current_user)

    try:
        db = get_db_connection()
        service = CredentialService(db.conn)

        return service.list_credentials()

    except Exception as e:
        print("❌ ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))