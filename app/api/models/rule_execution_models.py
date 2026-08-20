from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class RuleExecutionResponse(BaseModel):
    id: int
    batch_id: str
    control_id: Optional[str] = None
    rule_id: Optional[str] = None
    entity_name: Optional[str] = None
    execution_status: Optional[str] = None
    delta_value: Optional[float] = None
    execution_time_seconds: Optional[float] = None
    severity_level: Optional[str] = None
    created_at: Optional[str] = None
    detail_json: Optional[Dict[str, Any]] = None


class RuleExecutionDetailResponse(BaseModel):
    id: int
    batch_id: str
    control_id: Optional[str] = None
    rule_id: Optional[str] = None
    entity_name: Optional[str] = None
    execution_status: Optional[str] = None
    delta_value: Optional[float] = None
    execution_time_seconds: Optional[float] = None
    severity_level: Optional[str] = None
    mapping_id: Optional[str] = None
    created_at: Optional[str] = None
    detail_json: Optional[Dict[str, Any]] = None


class ExecutionResultsSummary(BaseModel):
    batch_id: str
    total_rules: int = 0
    passed_rules: int = 0
    failed_rules: int = 0
    error_rules: int = 0
    overall_status: Optional[str] = None
    controls: List[dict] = []
