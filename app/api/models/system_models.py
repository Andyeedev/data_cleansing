from pydantic import BaseModel


class ConnectionConfig(BaseModel):
    host: str
    port: int
    database: str


class SystemCreateRequest(BaseModel):
    project_id: str
    system_name: str
    system_role: str   # SOURCE / TARGET
    database_type: str  # POSTGRES / SQLSERVER
    connection_config: ConnectionConfig


class SystemResponse(BaseModel):
    system_id: str
    system_name: str
    system_role: str
    database_type: str
