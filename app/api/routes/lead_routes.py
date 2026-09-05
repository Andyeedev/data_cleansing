from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional
from app.services.lead_service import LeadService

router = APIRouter(prefix="/api/v1/leads", tags=["Leads"])

class LeadCreateRequest(BaseModel):
    full_name: str
    work_email: str
    company: Optional[str] = None
    org_size: Optional[str] = None
    industry: Optional[str] = None
    role: Optional[str] = None
    challenge: Optional[str] = None
    message: Optional[str] = None
    source_form: Optional[str] = "get_started"
    utm_source: Optional[str] = None
    referrer: Optional[str] = None

@router.post("")
@router.post("/")
def create_lead(payload: LeadCreateRequest, request: Request):
    svc = LeadService()
    data = svc.create_lead(payload.dict())
    return {"success": True, "data": data}

@router.get("")
@router.get("/")
def list_leads():
    from app.db.connection import get_db_connection
    db = get_db_connection()
    rows = db.execute("SELECT lead_id, full_name, work_email, company, industry, role, challenge, source_form, created_at FROM core.leads ORDER BY created_at DESC LIMIT 50")
    return {"success": True, "data": [{"lead_id": str(r[0]), "full_name": r[1], "work_email": r[2], "company": r[3], "industry": r[4], "role": r[5], "challenge": r[6], "source_form": r[7], "created_at": str(r[8])} for r in rows]}
