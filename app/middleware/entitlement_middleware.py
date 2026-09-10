from functools import wraps
from fastapi import Request, HTTPException
from app.db.connection import get_db_connection


DEFAULT_ENTITLEMENTS = {
    "professional": {
        "discovery", "mapping", "validation", "basic_reporting",
        "single_project", "email_support"
    },
    "enterprise": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "multi_project", "api_access", "audit_trail", "governance",
        "priority_support"
    },
    "enterprise_plus": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "multi_project", "api_access", "audit_trail", "governance",
        "ai_insights", "custom_integrations", "dedicated_support",
        "multi_region", "sla"
    },
}


def get_tenant_entitlements(tenant_id):
    if not tenant_id:
        return set()

    try:
        with get_db_connection() as db:
            with db.conn.cursor() as cur:
                cur.execute(
                    """SELECT p.entitlements, p.tier
                       FROM platform.subscriptions s
                       JOIN platform.plans p ON s.plan_id = p.plan_id
                       WHERE s.tenant_id = %s AND s.status IN ('active', 'trialing')
                       ORDER BY s.created_at DESC LIMIT 1""",
                    (tenant_id,)
                )
                row = cur.fetchone()
                if not row:
                    return set()

                entitlements_json, tier = row
                if entitlements_json and isinstance(entitlements_json, dict):
                    return set(entitlements_json.keys())
                return DEFAULT_ENTITLEMENTS.get(tier, set())
    except Exception:
        return set()


def require_entitlement(feature_name):
    # DEV-009: tenant derived from the authenticated JWT (never request.state,
    # which was previously set by unwired/dead middleware). Declared as a
    # proper FastAPI sub-dependency so auth applies uniformly (incl. overrides).
    from fastapi import Depends
    from app.api.core.auth.dependencies import get_current_user_with_tenant

    def dependency(current_user=Depends(get_current_user_with_tenant)):
        tenant_id = current_user.get("tenant_id")
        if not tenant_id:
            raise HTTPException(status_code=400, detail="Tenant context required")

        entitlements = get_tenant_entitlements(tenant_id)
        if feature_name not in entitlements:
            raise HTTPException(
                status_code=403,
                detail=f"Feature '{feature_name}' not available on your plan. Upgrade required."
            )
        return tenant_id

    return dependency


def check_entitlement(tenant_id, feature_name):
    entitlements = get_tenant_entitlements(tenant_id)
    return feature_name in entitlements
