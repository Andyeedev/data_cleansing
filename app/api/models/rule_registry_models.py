from typing import Optional, List
from pydantic import BaseModel


class RuleRegistryResponse(BaseModel):
    rule_id: str
    control_id: Optional[str] = None
    rule_name: Optional[str] = None
    sql_template_file: Optional[str] = None
    severity_level: Optional[str] = None
    enabled_flag: Optional[bool] = True
    created_at: Optional[str] = None


class RuleRegistryCreateRequest(BaseModel):
    rule_id: str
    control_id: str
    rule_name: str
    sql_template_file: Optional[str] = None
    severity_level: str = "MEDIUM"
    enabled_flag: bool = True


class RuleRegistryUpdateRequest(BaseModel):
    rule_id: Optional[str] = None
    control_id: Optional[str] = None
    rule_name: Optional[str] = None
    sql_template_file: Optional[str] = None
    severity_level: Optional[str] = None
    enabled_flag: Optional[bool] = None


class RuleDatasetMappingResponse(BaseModel):
    mapping_id: str
    rule_id: Optional[str] = None
    enabled_flag: Optional[bool] = True
    created_at: Optional[str] = None


class RuleRegistryListResponse(BaseModel):
    rules: List[RuleRegistryResponse]
    total: int


class RuleDatasetMappingListResponse(BaseModel):
    mappings: List[RuleDatasetMappingResponse]
    total: int
