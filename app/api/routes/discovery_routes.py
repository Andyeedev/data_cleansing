from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.models.responses import APIResponse
from app.api.models.discovery_models import (
    DatasetMappingResponse,
    DiscoveryStatusResponse,
    DiscoveryTriggerRequest,
    DiscoveryTriggerResponse
)
from app.services.discovery_service_api import DiscoveryService
from app.db.connection import get_db_connection
from app.db.repositories.discovery_repository import DiscoveryRepository

router = APIRouter(prefix="/api/v1/discovery", tags=["Discovery"])

discovery_service = DiscoveryService()


# =========================
# SUMMARY
# =========================
@router.get("/test-summary/{tenant_id}")
def test_summary(tenant_id: str):
    """Direct test endpoint - no auth, no repository"""
    try:
        db = get_db_connection()
        rows = db.execute("""
            SELECT
                (SELECT COUNT(DISTINCT sr.system_id) FROM core.system_registry sr WHERE sr.tenant_id = %s) as total_systems,
                (SELECT COUNT(DISTINCT dm.source_schema) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_schemas,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s) as total_tables,
                (SELECT COUNT(DISTINCT dm.mapping_id) FROM core.dataset_mappings dm
                 INNER JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s
                 AND dm.target_table IS NOT NULL) as matched_tables
        """, (tenant_id, tenant_id, tenant_id, tenant_id))
        return {"success": True, "tenant_id": tenant_id, "rows": rows, "raw": str(rows)}
    except Exception as e:
        return {"success": False, "error": str(e), "type": type(e).__name__}

@router.get("/test-repo/{tenant_id}")
def test_repo(tenant_id: str):
    """Test using repository"""
    try:
        db = get_db_connection()
        repo = DiscoveryRepository(db)
        result = repo.get_summary(tenant_id=tenant_id)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e), "type": type(e).__name__}

@router.get("/test-repo2/{tenant_id}")
def test_repo2(tenant_id: str):
    """Test repository step by step"""
    try:
        db = get_db_connection()
        repo = DiscoveryRepository(db)
        import inspect
        source = inspect.getsource(repo.get_summary)
        return {"success": True, "method_source": source[:500]}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/summary")
@router.get("/summary/")
def get_summary(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None, description="Override tenant ID")
):
    try:
        effective_tenant = tenant_id or current_user.get("tenant_id")
        db = get_db_connection()
        repo = DiscoveryRepository(db)
        data = repo.get_summary(tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TREE
# =========================
@router.get("/tree")
@router.get("/tree/")
def get_tree(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None, description="Override tenant ID")
):
    try:
        effective_tenant = tenant_id or current_user.get("tenant_id")
        db = get_db_connection()
        repo = DiscoveryRepository(db)
        data = repo.get_tree(tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TABLES
# =========================
@router.get("/tables")
@router.get("/tables/")
def get_tables(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: Optional[str] = Query(None, description="Override tenant ID")
):
    try:
        effective_tenant = tenant_id or current_user.get("tenant_id")
        db = get_db_connection()
        repo = DiscoveryRepository(db)
        data = repo.get_tables(tenant_id=effective_tenant)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/datasets", response_model=APIResponse)
def get_discovery_datasets(
    batch_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        datasets = discovery_service.get_datasets_by_batch(batch_id)
        return APIResponse(success=True, data=datasets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/datasets/{dataset_id}", response_model=APIResponse)
def get_discovery_dataset_detail(
    batch_id: str,
    dataset_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        dataset = discovery_service.get_dataset_by_id(dataset_id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset mapping not found")
        return APIResponse(success=True, data=dataset)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/current", response_model=APIResponse)
def trigger_discovery(
    request: DiscoveryTriggerRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        result = discovery_service.trigger_discovery(request.project_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/status", response_model=APIResponse)
def get_discovery_status(
    batch_id: str,
    current_user=Depends(get_current_user_with_tenant)
):
    try:
        status = discovery_service.get_discovery_status(batch_id)
        if not status:
            raise HTTPException(status_code=404, detail="Batch not found")
        return APIResponse(success=True, data=status)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
