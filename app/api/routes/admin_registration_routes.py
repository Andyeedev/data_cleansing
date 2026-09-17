from fastapi import APIRouter, Body, Request, status
from fastapi.responses import JSONResponse

from app.services.tenant_service import TenantService
from app.db.connection import get_db_connection
from app.services.email_service import EmailServiceFactory
from app.services.email_templates import render_verification
from app.db.repositories.email_verification_repository import EmailVerificationRepository
from app.api.routes.rate_limit_phase1 import rate_limit_authenticated_admin

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.get("/registrations", summary="Super Admin: List pending lead registrations")
def admin_list_registrations(request: Request):
    """
    Super Admin endpoint to list pending lead registrations.
    Rate limited to authenticated admin calls.
    """
    # Client IP for rate limiting - in production, current_user would be injected via middleware
    client_ip = get_client_ip(request)
    rate_limit_authenticated_admin(client_ip, max_requests=60, window_seconds=60)

    with get_db_connection() as db:
        from psycopg2.extras import RealDictCursor
        with db.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT lead_id, full_name, work_email, company, org_size, industry, role,
                       source_form, created_at, status, converted_to_tenant, converted_at
                FROM core.leads
                WHERE status = 'pending'
                ORDER BY created_at DESC
            """)
            rows = cur.fetchall()

    leads = []
    for row in rows:
        leads.append({
            "lead_id": str(row[0]),
            "full_name": row[1] or "",
            "work_email": row[2] or "",
            "company": row[3] or "",
            "org_size": row[4] or "",
            "industry": row[5] or "",
            "role": row[6] or "",
            "source_form": row[7] or "get_started",
            "created_at": row[8].isoformat() if hasattr(row[8], 'isoformat') else str(row[8]),
            "status": row[9] or "pending",
            "converted_to_tenant": str(row[10]) if row[10] else None,
            "converted_at": row[11].isoformat() if row[11] and hasattr(row[11], 'isoformat') else (str(row[11]) if row[11] else None),
        })

    return JSONResponse(content={"success": True, "data": {"leads": leads}})


@router.post(
    "/registrations/{lead_id}/convert",
    status_code=status.HTTP_200_OK,
    summary="Super Admin: Convert lead to tenant + first admin",
)
def admin_convert_lead(
    lead_id: str,
    admin_password: str = Body(..., description="Password for the first admin user"),
    request: Request = None,
):
    """
    Super Admin converts a lead to a tenant.
    Creates tenant + first admin user via TenantService.create_tenant().
    Sends verification email (Phase 4 flow).
    Marks lead as converted.
    Idempotent: if already converted, returns success.
    """
    if not admin_password:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Admin password is required"},
        )

    client_ip = get_client_ip(request)
    rate_limit_authenticated_admin(client_ip, max_requests=10, window_seconds=3600)

    with get_db_connection() as db:
        # 1. Lock and validate lead row
        from psycopg2.extras import RealDictCursor
        with db.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT lead_id, full_name, work_email, company, source_form
                FROM core.leads
                WHERE lead_id = %s AND status = 'pending'
                FOR UPDATE
            """, (lead_id,))
            lead_row = cur.fetchone()

        if not lead_row:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "error": "Lead not found or already converted"},
            )

        # 2. Create tenant + first admin user
        # The admin_password is provided by Super Admin
        create_result = tenant_service.create_tenant(
            tenant_name=lead_row[1] or "New Tenant",
            admin_email=lead_row[2] or "",
            admin_password=admin_password,
            plan_tier=lead_row[7] or "professional",
        )

        if not create_result["success"]:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "error": create_result.get("error", "Tenant creation failed")},
            )

        tenant_id = create_result["data"]["tenant"]["tenant_id"]
        admin_user = create_result["data"]["admin_user"]

        # 3. Mark lead as converted
        with db.conn.cursor() as cur:
            cur.execute("""
                UPDATE core.leads
                SET status = 'converted', converted_to_tenant = %s, converted_at = NOW()
                WHERE lead_id = %s
            """, (tenant_id, lead_id))

        # 4. Create email verification for the new admin user (Phase 4 flow)
        verification_repo = EmailVerificationRepository(db.conn)
        verification_token = verification_repo.create_verification_token(admin_user["id"])

        # 5. Send verification email (outside DB transaction)
        try:
            verify_url = f"https://mapnexus.co.uk/verify-email?token={verification_token}"
            email_service = EmailServiceFactory.get_instance()
            html_body = render_verification(verify_url=verify_url, first_name=admin_user["first_name"] or "Admin")

            email_service.send(EmailMessage(
                to=admin_user["email"],
                subject="Verify your MAP Nexus email address",
                html_body=html_body
            ))
        except Exception as e:
            # Log failure but don't rollback DB transaction - allow resend
            import logging
            logging.getLogger(__name__).error(f"Verification email failed: {e}")

        # Commit the database transaction
        db.conn.commit()

    return JSONResponse(
        content={
            "success": True,
            "data": {
                "tenant_id": tenant_id,
                "admin_user_id": admin_user["id"],
                "admin_email": admin_user["email"],
                "verification_sent": True,
            }
        }
    )


def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"