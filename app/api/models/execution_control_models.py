from typing import Optional
from pydantic import BaseModel


class ExecutionStartRequest(BaseModel):
    project_id: str
    batch_name: Optional[str] = None


class ExecutionStartResponse(BaseModel):
    message: str
    batch_id: str
    batch_name: Optional[str] = None
    project_id: str
    status: str


class ExecutionControlResponse(BaseModel):
    message: str
    batch_id: str
    status: str


class ExecutionLifecycleResponse(BaseModel):
    batch_id: str
    last_completed_control: Optional[str] = None


class ExecutionProgressResponse(BaseModel):
    batch_id: str
    status: str
    total_controls: int
    completed_controls: int
    failed_controls: int
    progress: str
    percentage: int
