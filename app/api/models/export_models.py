from typing import Optional
from pydantic import BaseModel


class ExportResponse(BaseModel):
    batch_id: str
    export_type: str
    filename: str
    content_type: str
    data: Optional[str] = None
