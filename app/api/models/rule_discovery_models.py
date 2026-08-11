from typing import Optional, List
from pydantic import BaseModel


class RuleDiscoveryItem(BaseModel):
    mapping_id: str
    rule_id: str
    rule_name: Optional[str] = None
    enabled_flag: bool = True
    dataset_name: Optional[str] = None


class RuleDiscoveryResponse(BaseModel):
    project_id: str
    rules: List[RuleDiscoveryItem]
    count: int


class RuleDiscoveryTriggerResponse(BaseModel):
    status: str
    message: str
    project_id: str


class RuleDiscoveryStatusResponse(BaseModel):
    project_id: str
    total_mappings: int
    rules_discovered: int
    last_discovery_at: Optional[str] = None


class RuleDatasetMappingInfo(BaseModel):
    mapping_id: str
    dataset_name: Optional[str] = None
    rule_id: str
    rule_name: Optional[str] = None
    sql_template: Optional[str] = None


class RuleDiscoveryMappingsResponse(BaseModel):
    project_id: str
    mappings: List[RuleDatasetMappingInfo]
