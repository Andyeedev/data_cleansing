from pydantic import BaseModel


class CredentialResponse(BaseModel):
    credential_id: str
    username: str
