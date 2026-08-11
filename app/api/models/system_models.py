from pydantic import BaseModel
from typing import Optional


class ConnectionConfig(BaseModel):
    host: str
    port: Optional[int] = None
    database: str
    ssl_mode: Optional[str] = None
    encrypt: Optional[bool] = None
    trust_server_certificate: Optional[bool] = None
    additional_params: Optional[dict] = None


class SystemCreateRequest(BaseModel):
    project_id: Optional[str] = None
    system_name: str
    system_role: str   # SOURCE / TARGET
    database_type: str  # POSTGRES / SQLSERVER / AZURE_SQL / AZURE_POSTGRES / AWS_RDS_POSTGRES / SNOWFLAKE / BIGQUERY / MYSQL / ORACLE
    connection_config: ConnectionConfig


class SystemResponse(BaseModel):
    system_id: str
    system_name: str
    system_role: str
    database_type: str
