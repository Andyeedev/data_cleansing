from pydantic import BaseModel


class SystemCreateRequest(BaseModel):
    system_id: str
    system_name: str
    system_role: str
    database_type: str


class SystemResponse(BaseModel):
    system_id: str
    system_name: str
    system_role: str