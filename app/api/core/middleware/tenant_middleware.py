from fastapi import Request
from fastapi.responses import JSONResponse
from app.api.core.auth.jwt_handler import decode_token
from app.db.connection import get_db_connection

SKIP_TENANT_VALIDATION_PATHS = {
    "/health", "/api/v1/health", "/api/v1/ready",
    "/docs", "/openapi.json", "/redoc",
}


async def tenant_middleware(request: Request, call_next):
    if request.url.path in SKIP_TENANT_VALIDATION_PATHS:
        return await call_next(request)

    tenant_id = None

    auth = request.headers.get("Authorization")
    if auth:
        try:
            token = auth.replace("Bearer ", "")
            payload = decode_token(token)
            tenant_id = payload.get("tenant_id")
        except Exception:
            pass

    if not tenant_id:
        tenant_id = request.headers.get("X-Tenant-ID")

    if not tenant_id:
        tenant_id = request.query_params.get("tenant_id")

    request.state.tenant_id = tenant_id

    if tenant_id:
        try:
            db = get_db_connection()
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
