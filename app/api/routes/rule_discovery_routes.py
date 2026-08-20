from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.services.rule_discovery_service import RuleDiscoveryService

router = APIRouter(prefix="/api/v1/rules/discovery", tags=["Rule Discovery"])

rule_discovery_service = RuleDiscoveryService()


# =========================
# GET DISCOVERED RULES FOR PROJECT
# =========================
@router.get("/{project_id}", response_model=APIResponse)
def get_discovered_rules(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        data = rule_discovery_service.get_discovered_rules(project_id)
        return APIResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# TRIGGER RULE DISCOVERY
# =========================
@router.post("/{project_id}/trigger", response_model=APIResponse)
def trigger_rule_discovery(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        result = rule_discovery_service.trigger_discovery(project_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CHECK DISCOVERY STATUS
# =========================
@router.get("/{project_id}/status", response_model=APIResponse)
def get_discovery_status(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        status = rule_discovery_service.get_discovery_status(project_id)
        return APIResponse(success=True, data=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# VIEW RULE-TO-DATASET MAPPINGS
# =========================
@router.get("/{project_id}/mappings", response_model=APIResponse)
def get_discovery_mappings(
    project_id: str,
    current_user=Depends(get_current_user)
):
    try:
        data = rule_discovery_service.get_discovery_mappings(project_id)
        return APIResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET LATEST BATCH FOR RULE/MAPPING
# =========================
@router.get("/{project_id}/rules/{rule_id}/mappings/{mapping_id}/latest-batch", response_model=APIResponse)
def get_latest_batch_for_rule_mapping(
    project_id: str,
    rule_id: str,
    mapping_id: str,
    current_user=Depends(get_current_user)
):
    """Get the latest batch execution for a specific rule/mapping combination.
    
    Note: mapping_id parameter is the rule_dataset_mapping.id (UUID),
    but execution table stores dataset_mappings.mapping_id.
    We need to resolve the mapping through rule_dataset_mapping table.
    """
    from app.db.connection import get_db_connection
    from app.api.models.responses import APIResponse
    
    db = get_db_connection()
    try:
        # First, get the actual dataset_mappings.mapping_id from rule_dataset_mapping.id
        mapping_query = """
            SELECT rdm.mapping_id
            FROM core.rule_dataset_mapping rdm
            WHERE rdm.id = %s AND rdm.rule_id = %s
        """
        mapping_rows = db.execute(mapping_query, (mapping_id, rule_id))
        
        if not mapping_rows:
            return APIResponse(success=True, data={"batch_id": None, "message": "Rule/mapping combination not found"})
        
        dataset_mapping_id = mapping_rows[0][0]
        
        # Now find the latest batch using the actual dataset_mappings.mapping_id
        query = """
            SELECT 
                mce.batch_id,
                mce.created_at,
                mce.execution_status,
                mce.entity_name,
                b.batch_name,
                b.project_id,
                b.tenant_id
            FROM engine.migration_control_execution mce
            JOIN engine.migration_batch_registry b ON mce.batch_id = b.batch_id
            WHERE mce.rule_id = %s
            AND mce.mapping_id = %s
            AND b.project_id = %s
            ORDER BY mce.created_at DESC
            LIMIT 1
        """
        rows = db.execute(query, (rule_id, dataset_mapping_id, project_id))
        
        if not rows:
            return APIResponse(success=True, data={"batch_id": None, "message": "No execution found for this rule/mapping"})
        
        row = rows[0]
        return APIResponse(success=True, data={
            "batch_id": str(row[0]),
            "executed_at": str(row[1]),
            "status": row[2],
            "entity_name": row[3],
            "batch_name": row[4],
            "project_id": str(row[5]),
            "tenant_id": str(row[6]),
            "results_url": f"/validation/results/{row[0]}?from_rules=true&rule_id={rule_id}&mapping_id={mapping_id}"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
