from typing import Optional, List
from pydantic import BaseModel


class SystemHealth(BaseModel):
    database: bool
    api: bool
    timestamp: Optional[str] = None


class PerformanceMetrics(BaseModel):
    total_executions: int
    active_executions: int
    completed_executions: int
    failed_executions: int
    avg_execution_time: Optional[float] = None


class QueueStatus(BaseModel):
    total_items: int
    running: int
    pending: int
    items: List[dict] = []


class Alert(BaseModel):
    id: str
    severity: str
    message: str
    timestamp: Optional[str] = None


class OperationalLog(BaseModel):
    timestamp: str
    level: str
    message: str
    details: Optional[dict] = None
