from typing import Optional
from pydantic import BaseModel


class ExecutionStartRequest(BaseModel):
    project_id: str


class ExecutionStartResponse(BaseModel):
    message: str
    batch_id: str
    project_id: str
    status: str


class ExecutionControlResponse(BaseModel):
    message: str
    batch_id: str
    status: str


class ExecutionLifecycleEvent(BaseModel):
    event_type: str
    timestamp: Optional[str] = None
    details: Optional[dict] = None


class ExecutionLifecycleResponse(BaseModel):
    batch_id: str
    events: list[ExecutionLifecycleEvent] = []


class ExecutionProgressResponse(BaseModel):
    batch_id: str
    status: str
    total_controls: int
    completed_controls: int
    failed_controls: int
    progress: str
    percentage: int
