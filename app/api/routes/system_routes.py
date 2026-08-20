from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.services.system_service import SystemService
from app.services.health_check_service import HealthCheckService
from app.api.core.auth.dependencies import get_current_user, get_current_user_with_tenant
from app.api.core.auth.rbac import require_admin
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
def list_systems(tenant_id: str = Query(None), current_user=Depends(get_current_user_with_tenant)):
    # Support empty string or "all" to return systems across all tenants (admin only)
    if not tenant_id or tenant_id == 'all':
        effective_tenant = None
    else:
        effective_tenant = tenant_id
    db = get_db_connection()
    data = SystemService(db.conn).list_systems(tenant_id=effective_tenant)
    return {"success": True, "data": data}


# =========================
# GET ONE
# =========================
@router.get("/{system_id}")
def get_system(system_id: str, tenant_id: str = Query(None), current_user=Depends(get_current_user_with_tenant)):
    effective_tenant = tenant_id if tenant_id else current_user.get("tenant_id")
    db = get_db_connection()
    data = SystemService(db.conn).get_system(system_id, tenant_id=effective_tenant)
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
def test_connection(system_id: str, tenant_id: str = Query(None), current_user=Depends(get_current_user_with_tenant)):
    effective_tenant = tenant_id or current_user.get("tenant_id")
    db = get_db_connection()
    data = SystemService(db.conn).test_connection(system_id, tenant_id=effective_tenant)
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


# =========================
# HEALTH CHECK - MANUAL (Admin only)
# =========================
@router.post("/{system_id}/health-check")
def run_health_check(
    system_id: str,
    current_user=Depends(require_admin)
):
    """Manually trigger a health check for a single system. Admin only."""
    try:
        db = get_db_connection()
        service = SystemService(db.conn)
        system = service.get_system(system_id)
        if not system:
            raise HTTPException(status_code=404, detail="System not found")

        from app.adapters.registry import AdapterRegistry
        from app.adapters.pool import ConnectionPoolManager
        from app.config import PostgresConfig, SQLServerConfig

        db_type = system.get("database_type", "postgres")
        conn_config = system.get("connection_config", {})
        if isinstance(conn_config, str):
            import json
            conn_config = json.loads(conn_config)

        adapter_class = AdapterRegistry.get(db_type)
        adapter = adapter_class()

        if db_type == "postgres":
            config = PostgresConfig(**conn_config)
        elif db_type == "sqlserver":
            config = SQLServerConfig(**conn_config)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported db_type: {db_type}")

        adapter.connect(config)

        hc = HealthCheckService(db.conn)
        result = hc.check_single(
            system_id=system_id,
            adapter=adapter,
            label="MANUAL",
            initiated_by="ADMIN",
            user_id=current_user.get("user", "unknown")
        )

        adapter.close()
        return {"success": True, "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# HEALTH CHECK HISTORY
# =========================
@router.get("/health-check/history")
def get_health_check_history(
    system_id: str = Query(None),
    limit: int = Query(50, ge=1, le=200),
    current_user=Depends(get_current_user_with_tenant)
):
    """Get health check audit trail. Optional system_id filter."""
    try:
        db = get_db_connection()
        hc = HealthCheckService(db.conn)
        history = hc.get_history(system_id=system_id, limit=limit)
        return {"success": True, "data": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
