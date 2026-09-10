from fastapi import Request
from fastapi.responses import JSONResponse
from app.api.core.auth.jwt_handler import decode_token
from app.db.connection import get_db_connection

SKIP_TENANT_VALIDATION_PATHS = {
    "/health", "/api/v1/health", "/api/v1/ready",
    "/docs", "/openapi.json", "/redoc",
    "/api/v1/auth/login", "/api/v1/auth/logout",
    "/api/v1/leads", "/api/v1/billing/webhook",
}


def _extract_jwt_tenant(request: Request):
    """DEV-003: tenant comes from the authenticated JWT ONLY (cookie first,
    then Authorization header). X-Tenant-ID header and ?tenant_id= query
    MUST NEVER establish tenancy and are ignored here."""
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization")
        if auth:
            token = auth.replace("Bearer ", "")
    if not token:
        return None
    try:
        payload = decode_token(token)
        return payload.get("tenant_id")
    except Exception:
        return None


async def tenant_middleware(request: Request, call_next):
    if request.url.path in SKIP_TENANT_VALIDATION_PATHS:
        return await call_next(request)

    tenant_id = _extract_jwt_tenant(request)

    request.state.tenant_id = tenant_id

    if tenant_id:
        try:
            with get_db_connection() as db:
                with db.conn.cursor() as cur:
                    cur.execute(
                        "SELECT status FROM core.tenants WHERE tenant_id = %s",
                        (tenant_id,)
                    )
                    row = cur.fetchone()
                    if not row:
                        return JSONResponse(
                            status_code=404,
                            content={"success": False, "error": "Tenant not found"}
                        )
                    if row[0] != "ACTIVE":
                        return JSONResponse(
                            status_code=403,
                            content={"success": False, "error": f"Tenant is {row[0].lower()}"}
                        )
        except Exception:
            pass

    response = await call_next(request)
    return response
