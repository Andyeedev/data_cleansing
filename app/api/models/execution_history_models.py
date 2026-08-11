from typing import Optional, List
from pydantic import BaseModel


class ExecutionHistoryItem(BaseModel):
    batch_id: str
    batch_name: Optional[str] = None
    project_id: Optional[str] = None
    batch_status: Optional[str] = None
    total_controls: Optional[int] = None
    completed_controls: Optional[int] = None
    failed_controls: Optional[int] = None
    batch_start_time: Optional[str] = None
    batch_end_time: Optional[str] = None


class ExecutionHistoryDetail(BaseModel):
    batch_id: str
    batch_name: Optional[str] = None
    project_id: Optional[str] = None
    batch_status: Optional[str] = None
    total_controls: Optional[int] = None
    completed_controls: Optional[int] = None
    failed_controls: Optional[int] = None
    batch_start_time: Optional[str] = None
    batch_end_time: Optional[str] = None
    control_summaries: List[dict] = []


class ReExecuteResponse(BaseModel):
    message: str
    batch_id: str
    batch_name: Optional[str] = None
    project_id: Optional[str] = None
    status: str


class AuditTrailResponse(BaseModel):
    batch_id: str
    control_executions: List[dict] = []
    exceptions: List[dict] = []
    governance: Optional[dict] = None
