from typing import Optional, List
from pydantic import BaseModel


class ControlSummaryResponse(BaseModel):
    control_id: str
    overall_status: Optional[str] = None
    total_rules: int = 0
    passed_rules: int = 0
    failed_rules: int = 0
    error_rules: int = 0


class ValidationReportResponse(BaseModel):
    batch_id: str
    project_id: Optional[str] = None
    overall_status: Optional[str] = None
    overall_score: Optional[float] = None
    total_controls: int = 0
    completed_controls: int = 0
    failed_controls: int = 0
    control_summaries: List[ControlSummaryResponse] = []
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class GovernanceDecisionResponse(BaseModel):
    batch_id: str
    project_id: Optional[str] = None
    migration_status: Optional[str] = None
    blocking_controls: Optional[str] = None
    total_failed_rules: Optional[int] = None
    decision_time: Optional[str] = None


class RiskScoreResponse(BaseModel):
    batch_id: str
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    calculated_at: Optional[str] = None


class ComplianceCheckResponse(BaseModel):
    batch_id: str
    total_exceptions: int = 0
    critical_exceptions: int = 0
    high_exceptions: int = 0
    medium_exceptions: int = 0
    low_exceptions: int = 0
    exceptions: List[dict] = []
