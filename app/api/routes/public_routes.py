from fastapi import APIRouter, Body, Request, status
from fastapi.responses import JSONResponse
from decimal import Decimal

from app.services.lead_service import LeadService
from app.services.tenant_service import TenantService
from app.db.connection import get_db_connection
from app.api.routes.rate_limit_phase1 import rate_limit_public_endpoint

router = APIRouter(prefix="/api/v1/public", tags=["Public"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register website lead (public, rate-limited)",
)
def public_register_lead(
    request: Request,
    full_name: str = Body(..., description="Lead's full name"),
    work_email: str = Body(..., description="Lead's work email"),
    work_email_hash: str = Body(
        ..., description="Hashed work email for deduplication"
    ),
    company: str = Body(None, description="Lead's company"),
    org_size: str = Body(None, description="Organization size"),
    industry: str = Body(None, description="Industry sector"),
    role: str = Body(None, description="Lead's role"),
    challenge: str = Body(None, description="Lead's stated challenge"),
    message: str = Body(None, description="Optional lead message"),
    source_form: str = Body(
        ..., description="Form source: 'get_started' or 'request_demo'"
    ),
    utm_source: str = Body(None, description="UTM source parameter"),
    referrer: str = Body(None, description="Referrer URL"),
    plan_interest: str = Body(
        None, description="Lead's plan interest (e.g., 'professional')"
    ),
):
    """
    Public endpoint to register a website lead.
    Inserts into core.leads table using existing schema.
    Rate limited to 5 requests per hour per IP (enumeration-safe).
    """
    client_ip = get_client_ip(request)
    rate_limit_public_endpoint(client_ip, max_requests=5, window_seconds=3600)

    # Validate source_form
    if source_form not in ("get_started", "request_demo"):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Invalid source_form. Must be 'get_started' or 'request_demo'."},
        )

    service = LeadService()
    result = service.create_lead(
        {
            "full_name": full_name,
            "work_email": work_email,
            "work_email_hash": work_email_hash,
            "company": company,
            "org_size": org_size,
            "industry": industry,
            "role": role,
            "challenge": challenge,
            "message": message,
            "source_form": source_form,
            "utm_source": utm_source,
            "referrer": referrer,
            "plan_interest": plan_interest,
        }
    )

    # Service returns domain data: {"lead_id": "...", "source_form": "..."}
    # Transform into API contract: {"success": True, "data": {"lead_id": "..."}}
    lead_id = result["lead_id"]
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"success": True, "data": {"lead_id": lead_id}},
    )


@router.get(
    "/plans",
    summary="Get available plans (public, no auth)",
)
def public_list_plans():
    """Public endpoint to list available plans."""
    with get_db_connection() as db:
        service = TenantService(db.conn)
        raw_plans = service.list_plans()
        # Convert Decimal values to float for JSON serialization
        plans = {"success": True, "data": []}
        for plan in raw_plans["data"]:
            converted = {}
            for k, v in plan.items():
                if isinstance(v, Decimal):
                    converted[k] = float(v)
                elif isinstance(v, dict):
                    converted[k] = {kk: (float(vv) if isinstance(vv, Decimal) else vv) for kk, vv in v.items()}
                else:
                    converted[k] = v
            plans["data"].append(converted)
    # plans is {"success": True, "data": [...]} from TenantService
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=plans,
    )


def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"