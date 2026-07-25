from typing import Optional, List
from pydantic import BaseModel


class DatasetMappingResponse(BaseModel):
    mapping_id: str
    project_id: str
    source_system_id: str
    target_system_id: Optional[str] = None
    source_schema: Optional[str] = None
    source_table: Optional[str] = None
    source_columns: Optional[List[str]] = None
    target_schema: Optional[str] = None
    target_table: Optional[str] = None
    target_columns: Optional[List[str]] = None
    is_active: bool = True
    created_at: Optional[str] = None


class DiscoveryStatusResponse(BaseModel):
    batch_id: str
    project_id: Optional[str] = None
    discovery_status: str
    datasets_found: int = 0
    mappings_created: int = 0
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class DiscoveryTriggerRequest(BaseModel):
    project_id: str


class DiscoveryTriggerResponse(BaseModel):
    message: str
    project_id: str
    status: str
