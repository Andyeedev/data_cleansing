from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/permissions", tags=["Permissions"])


class PermissionToggle(BaseModel):
    role_name: str
    pack_key: str
    enabled: bool


class PermissionUpdate(BaseModel):
    permissions: List[PermissionToggle]


def _get_db():
    return get_db_connection()


@router.get("")
def get_permissions(user=Depends(get_current_user)):
    try:
        db = _get_db()
        rows = db.execute(
            "SELECT role_name, pack_key, enabled FROM core.role_permissions ORDER BY role_name, pack_key"
        )
        matrix: Dict[str, Dict[str, bool]] = {}
        for role_name, pack_key, enabled in rows:
            if role_name not in matrix:
                matrix[role_name] = {}
            matrix[role_name][pack_key] = enabled
        return {"success": True, "data": matrix}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/roles")
def get_roles(user=Depends(get_current_user)):
    try:
        db = _get_db()
        rows = db.execute(
            "SELECT DISTINCT role_name FROM core.role_permissions ORDER BY role_name"
        )
        return {"success": True, "data": [r[0] for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/packs")
def get_packs(user=Depends(get_current_user)):
    try:
        db = _get_db()
        rows = db.execute(
            "SELECT DISTINCT pack_key FROM core.role_permissions ORDER BY pack_key"
        )
        return {"success": True, "data": [r[0] for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("")
def update_permissions(body: PermissionUpdate, user=Depends(get_current_user)):
    try:
        db = _get_db()
        for p in body.permissions:
            db.execute(
                """INSERT INTO core.role_permissions (role_name, pack_key, enabled, updated_at)
                   VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                   ON CONFLICT (role_name, pack_key)
                   DO UPDATE SET enabled = %s, updated_at = CURRENT_TIMESTAMP""",
                (p.role_name, p.pack_key, p.enabled, p.enabled),
            )
        db.conn.commit()
        return {"success": True, "message": f"Updated {len(body.permissions)} permission(s)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reset")
def reset_permissions(user=Depends(get_current_user)):
    try:
        db = _get_db()
        packs = ['operational', 'executive', 'validation_pack', 'governance_pack', 'audit_pack']
        defaults = {
            'admin':     ['operational', 'executive', 'validation_pack', 'governance_pack', 'audit_pack'],
            'manager':   ['executive', 'validation_pack', 'governance_pack'],
            'operator':  ['executive', 'validation_pack'],
            'viewer':    [],
        }
        db.execute("DELETE FROM core.role_permissions")
        for role, allowed_packs in defaults.items():
            for pack in packs:
                enabled = pack in allowed_packs
                db.execute(
                    "INSERT INTO core.role_permissions (role_name, pack_key, enabled) VALUES (%s, %s, %s)",
                    (role, pack, enabled),
                )
        db.conn.commit()
        return {"success": True, "message": "Permissions reset to defaults"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
