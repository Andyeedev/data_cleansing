from fastapi import APIRouter, Depends, HTTPException
from app.api.core.auth.dependencies import get_current_user
from app.api.models.responses import APIResponse
from app.api.models.rule_execution_models import (
    RuleExecutionResponse,
    RuleExecutionDetailResponse,
    ExecutionResultsSummary
)
from app.services.rule_execution_service import RuleExecutionService
from app.services.fix_options_service import generate_fix_options

router = APIRouter(prefix="/api/v1/execution", tags=["Rule Execution"])

rule_execution_service = RuleExecutionService()


@router.get("/{batch_id}/rules", response_model=APIResponse)
def get_batch_rules(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_execution_service.get_rules_by_batch(batch_id)
        return APIResponse(success=True, data=rules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/rules/{rule_id}", response_model=APIResponse)
def get_rule_detail(
    batch_id: str,
    rule_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rule = rule_execution_service.get_rule_detail(batch_id, rule_id)
        if not rule:
            raise HTTPException(status_code=404, detail="Rule not found")
        return APIResponse(success=True, data=rule)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/control/{control_id}/rules", response_model=APIResponse)
def get_control_rules(
    batch_id: str,
    control_id: str,
    current_user=Depends(get_current_user)
):
    try:
        rules = rule_execution_service.get_rules_by_control(batch_id, control_id)
        return APIResponse(success=True, data=rules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/results", response_model=APIResponse)
def get_execution_results(
    batch_id: str,
    current_user=Depends(get_current_user)
):
    try:
        results = rule_execution_service.get_execution_results(batch_id)
        return APIResponse(success=True, data=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{batch_id}/control/{control_id}/fix-options", response_model=APIResponse)
def get_control_fix_options(
    batch_id: str,
    control_id: str,
    current_user=Depends(get_current_user)
):
    """Get fix options for all errors in a control."""
    from app.services.rule_execution_service import RuleExecutionService
    service = RuleExecutionService()
    rules = service.get_rules_by_control(batch_id, control_id)

    all_fixes = []
    for rule in rules:
        if rule.get("execution_status") in ("ERROR", "FAIL"):
            error_msg = ""
            detail = rule.get("detail_json", {})
            if isinstance(detail, dict):
                error_msg = detail.get("error", "")
            elif isinstance(detail, str):
                error_msg = detail

            if error_msg:
                context = {
                    "mapping_id": detail.get("mapping_id"),
                    "source_schema": detail.get("source_schema"),
                    "source_table": detail.get("source_table"),
                    "target_schema": detail.get("target_schema"),
                    "target_table": detail.get("target_table"),
                    "source_system": detail.get("source_system"),
                    "target_system": detail.get("target_system"),
                    "numeric_column": "amount",
                    "source_schema": detail.get("source_schema"),
                    "target_schema": detail.get("target_schema"),
                }
                fixes = generate_fix_options(detail.get("error", ""), context)
                for fix in fixes:
                    fix["rule_id"] = rule.get("rule_id")
                    fix["entity_name"] = rule.get("entity_name")
                    all_fixes.append(fix)

    return APIResponse(success=True, data={"fix_options": all_fixes})


@router.get("/{project_id}/control/{control_id}/latest-batch", response_model=APIResponse)
def get_latest_batch_for_control(
    project_id: str,
    control_id: str,
    current_user=Depends(get_current_user)
):
    """Get the latest batch_id that executed a specific control within a project."""
    from app.db.connection import get_db_connection
    db = get_db_connection()
    try:
        query = """
            SELECT mce.batch_id
            FROM engine.migration_control_execution mce
            JOIN engine.migration_batch_registry b ON mce.batch_id = b.batch_id
            WHERE mce.control_id = %s AND b.project_id = %s
            ORDER BY mce.created_at DESC
            LIMIT 1
        """
        rows = db.execute(query, (control_id, project_id))
        if not rows:
            return APIResponse(success=True, data={"batch_id": None, "message": f"No execution found for control {control_id} in project {project_id}"})
        return APIResponse(success=True, data={"batch_id": str(rows[0][0])})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.post("/{batch_id}/apply-fix", response_model=APIResponse)
def apply_fix(
    batch_id: str,
    fix_request: dict,
    current_user=Depends(get_current_user)
):
    """Apply a selected fix option."""
    fix_id = fix_request.get("fix_id")
    context = fix_request.get("context", {})

    if not fix_id:
        raise HTTPException(status_code=400, detail="fix_id required")

    # For auto-applicable fixes, execute them
    # For now, return the SQL preview for manual execution
    return APIResponse(success=True, data={
        "message": "Fix application initiated",
        "fix_id": fix_id,
        "requires_manual_execution": True,
        "sql_preview": f"-- Fix: {fix_id}\n-- Execute this SQL manually"
    })
