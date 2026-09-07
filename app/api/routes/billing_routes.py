from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user_with_tenant
from app.api.helpers import standardize_response
from app.services.stripe_service import StripeService

router = APIRouter(prefix="/api/v1/billing", tags=["Billing"])


class CheckoutRequest(BaseModel):
    tier: str
    billing_cycle: Optional[str] = "annual"
    success_url: str = "http://localhost:5173/billing/success"
    cancel_url: str = "http://localhost:5173/billing/cancel"


class PortalRequest(BaseModel):
    return_url: Optional[str] = "http://localhost:5173/billing"


class UpgradeRequest(BaseModel):
    new_tier: str
    billing_cycle: Optional[str] = "annual"


@router.post("/checkout")
def create_checkout(
    request: CheckoutRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        return standardize_response({"success": False, "error": "Tenant context required"})

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.create_checkout_session(
            tenant_id=tenant_id,
            tier=request.tier,
            billing_cycle=request.billing_cycle,
            success_url=request.success_url,
            cancel_url=request.cancel_url
        )
        return standardize_response({"success": True, "data": result})
    except Exception as e:
        return standardize_response({"success": False, "error": str(e)})


@router.post("/portal")
def create_portal(
    request: PortalRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        return standardize_response({"success": False, "error": "Tenant context required"})

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.create_portal_session(
            tenant_id=tenant_id,
            return_url=request.return_url
        )
        return standardize_response({"success": True, "data": result})
    except Exception as e:
        return standardize_response({"success": False, "error": str(e)})


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.handle_webhook(payload, sig_header)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")


@router.get("/invoices")
def list_invoices(
    current_user=Depends(get_current_user_with_tenant)
):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        return standardize_response({"success": False, "error": "Tenant context required"})

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.list_invoices(tenant_id)
        return standardize_response({"success": True, "data": result})
    except Exception as e:
        return standardize_response({"success": False, "error": str(e)})


@router.post("/upgrade")
def upgrade_subscription(
    request: UpgradeRequest,
    current_user=Depends(get_current_user_with_tenant)
):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        return standardize_response({"success": False, "error": "Tenant context required"})

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.upgrade_subscription(
            tenant_id=tenant_id,
            new_tier=request.new_tier,
            billing_cycle=request.billing_cycle
        )
        return standardize_response({"success": True, "data": result})
    except Exception as e:
        return standardize_response({"success": False, "error": str(e)})


@router.post("/cancel")
def cancel_subscription(
    current_user=Depends(get_current_user_with_tenant)
):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        return standardize_response({"success": False, "error": "Tenant context required"})

    db = get_db_connection()
    service = StripeService(db.conn)
    try:
        result = service.cancel_subscription(tenant_id)
        return standardize_response({"success": True, "data": result})
    except Exception as e:
        return standardize_response({"success": False, "error": str(e)})
