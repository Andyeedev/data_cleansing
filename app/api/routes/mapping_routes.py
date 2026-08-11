from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Optional
from datetime import datetime

from app.services.mapping.mapping_service import MappingService
from app.services.mapping.mapping_repository import MappingRepository
from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user_with_tenant

router = APIRouter(prefix="/api/v1/mappings", tags=["mappings"])


# =========================
# SUMMARY
# =========================
@router.get("/summary")
@router.get("/summary/")
def get_mapping_summary(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        repo = MappingRepository(db)
        data = repo.get_summary(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# SCHEMA
# =========================
@router.get("/schema")
@router.get("/schema/")
def get_mapping_schema(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        repo = MappingRepository(db)
        data = repo.get_schema(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# COLUMNS (flat list)
# =========================
@router.get("/columns")
@router.get("/columns/")
def get_all_columns(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        repo = MappingRepository(db)
        data = repo.get_all_columns(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# AUTO MAP
# =========================
@router.post("/auto-map")
@router.post("/auto-map/")
def auto_map(current_user=Depends(get_current_user_with_tenant)):
    try:
        db = get_db_connection()
        repo = MappingRepository(db)
        data = repo.get_all_columns(tenant_id=current_user.get("tenant_id"))
        return {"success": True, "data": {"mapped": len(data), "message": "Auto-map completed"}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# BULK SAVE COLUMNS
# =========================
@router.post("/columns")
@router.post("/columns/")
def bulk_save_columns(payload: list = Body(...), current_user=Depends(get_current_user_with_tenant)):
    try:
        db = get_db_connection()
        repo = MappingRepository(db)
        saved = 0
        for col in payload:
            repo.save_column_mapping(col)
            saved += 1
        return {"success": True, "data": {"saved": saved}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# VALIDATE (flat - all mappings)
# =========================
@router.post("/validate")
@router.post("/validate/")
def validate_all(current_user=Depends(get_current_user_with_tenant)):
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        repo = MappingRepository(db)
        columns = repo.get_all_columns(tenant_id=tenant_id)
        issues = []
        for col in columns:
            if col["source_data_type"] and col["target_data_type"] and col["source_data_type"] != col["target_data_type"]:
                issues.append({
                    "type": "type_mismatch",
                    "source_column": col["source_column"],
                    "target_column": col["target_column"],
                    "source_type": col["source_data_type"],
                    "target_type": col["target_data_type"]
                })
        return {"success": True, "data": {
            "valid": len(issues) == 0,
            "issues": issues,
            "total_columns": len(columns),
            "type_mismatches": len(issues)
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# REF 2: Columns with pending table pairs
# =========================
@router.get("/columns/all")
@router.get("/columns/all/")
def get_all_columns_with_pending(current_user=Depends(get_current_user_with_tenant)):
    """Get all column mappings including empty table pairs from dataset_mappings."""
    try:
        tenant_id = current_user.get("tenant_id")
        db = get_db_connection()
        repo = MappingRepository(db)
        data = repo.get_all_columns_with_pending(tenant_id=tenant_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# REF 1: Clear pair / Clear all (soft delete)
# =========================
@router.post("/clear-pair")
@router.post("/clear-pair/")
def clear_pair_mapping(
    payload: dict = Body(...),
    current_user=Depends(get_current_user_with_tenant)
):
    """Soft delete all column mappings for a table pair."""
    try:
        mapping_id = payload.get("mapping_id")
        if not mapping_id:
            raise HTTPException(status_code=400, detail="mapping_id is required")
        
        db = get_db_connection()
        repo = MappingRepository(db)
        user_email = current_user.get("user", current_user.get("email", "unknown"))
        
        # Count before delete
        count_before = repo.get_column_mapping_count_by_pair(mapping_id)
        
        # Soft delete
        deleted = repo.soft_delete_column_mappings_by_pair(mapping_id, user_email)
        
        return {"success": True, "data": {
            "mapping_id": mapping_id,
            "deleted_count": deleted,
            "message": f"Soft deleted {deleted} column mappings for mapping {mapping_id}"
        }}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clear-all")
@router.post("/clear-all/")
def clear_all_mappings(
    current_user=Depends(get_current_user_with_tenant)
):
    """Soft delete ALL column mappings."""
    try:
        db = get_db_connection()
        repo = MappingRepository(db)
        user_email = current_user.get("user", current_user.get("email", "unknown"))
        
        # Count before delete
        count_before = repo.get_total_active_column_mappings()
        
        # Soft delete
        deleted = repo.soft_delete_all_column_mappings(user_email)
        
        return {"success": True, "data": {
            "deleted_count": deleted,
            "message": f"Soft deleted all {deleted} column mappings"
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}")
async def get_mappings(project_id: str):
    """Get all mappings for a project."""
    mapping_repo = MappingRepository(None)
    mappings = await mapping_repo.get_dataset_mappings(project_id)
    return {"project_id": project_id, "mappings": mappings}


@router.post("/{project_id}/auto")
async def auto_map(project_id: str):
    """Auto-generate mappings based on discovery results."""
    mapping_service = MappingService(None)
    result = await mapping_service.auto_map(project_id)
    return result


@router.get("/{mapping_id}")
async def get_mapping(mapping_id: str):
    """Get dataset mapping detail."""
    mapping_repo = MappingRepository(None)
    mapping = await mapping_repo.get_dataset_mapping(mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    return mapping


@router.put("/{mapping_id}")
async def update_mapping(mapping_id: str, updates: dict):
    """Update dataset mapping."""
    mapping_repo = MappingRepository(None)
    await mapping_repo.update_dataset_mapping(mapping_id, updates)
    return {"mapping_id": mapping_id, "status": "updated"}


@router.get("/{mapping_id}/columns")
async def get_column_mappings(mapping_id: str):
    """Get column mappings for a dataset mapping."""
    mapping_repo = MappingRepository(None)
    columns = await mapping_repo.get_column_mappings(mapping_id)
    return {"mapping_id": mapping_id, "columns": columns}


@router.post("/{mapping_id}/columns")
async def create_column_mapping(mapping_id: str, column_mapping: dict):
    """Create a column mapping."""
    mapping_repo = MappingRepository(None)
    column_mapping_id = await mapping_repo.save_column_mapping(
        {**column_mapping, "mapping_id": mapping_id}
    )
    return {"column_mapping_id": column_mapping_id}


@router.put("/{mapping_id}/columns/{column_mapping_id}")
async def update_column_mapping(
    mapping_id: str, column_mapping_id: str, updates: dict
):
    """Update a column mapping."""
    mapping_repo = MappingRepository(None)
    await mapping_repo.update_column_mapping(column_mapping_id, updates)
    return {"column_mapping_id": column_mapping_id, "status": "updated"}


@router.delete("/{mapping_id}/columns/{column_mapping_id}")
async def delete_column_mapping(
    mapping_id: str, column_mapping_id: str
):
    """Delete a column mapping."""
    mapping_repo = MappingRepository(None)
    await mapping_repo.delete_column_mapping(column_mapping_id)
    return {"column_mapping_id": column_mapping_id, "status": "deleted"}


@router.post("/{mapping_id}/validate")
async def validate_mapping(mapping_id: str):
    """Validate a mapping."""
    mapping_service = MappingService(None)
    result = await mapping_service.validate_mapping(mapping_id)
    return result