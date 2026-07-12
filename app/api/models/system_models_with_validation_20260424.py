
from pydantic import BaseModel, validator


class ConnectionConfig(BaseModel):
    host: str
    port: int
    database: str


class SystemResponse(BaseModel):
    system_id: str
    system_name: str
    system_role: str
    database_type: str


class SystemCreateRequest(BaseModel):
    project_id: str
    system_name: str
    system_role: str
    database_type: str
    connection_config: dict

    @validator("system_role")
    def validate_role(cls, v):
        allowed = ["SOURCE", "TARGET"]
        if v.upper() not in allowed:
            raise ValueError(f"system_role must be {allowed}")
        return v.upper()

    @validator("database_type")
    def validate_db(cls, v):
        allowed = [
            "POSTGRES",
            "SQLSERVER",
            "MYSQL",
            "SNOWFLAKE",
            "BIGQUERY",
            "ORACLE",
            "DATABRICKS"
        ]
        if v.upper() not in allowed:
            raise ValueError(f"database_type must be {allowed}")
        return v.upper()
