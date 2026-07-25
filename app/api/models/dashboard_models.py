from typing import Optional, List
from pydantic import BaseModel


class PortfolioSummary(BaseModel):
    total_systems: int
    total_batches: int
    total_controls: int
    active_batches: int


class KPIMetric(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None


class DashboardKPIs(BaseModel):
    kpis: List[KPIMetric]


class ActivityEntry(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: str
    user_email: str
    timestamp: str


class DashboardActivity(BaseModel):
    entries: List[ActivityEntry]
    total: int
