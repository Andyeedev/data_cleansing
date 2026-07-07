from pydantic import BaseModel


class ExecutionResponse(BaseModel):
    status: str
    project_id: str
