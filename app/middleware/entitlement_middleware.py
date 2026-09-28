from functools import wraps
from fastapi import Request, HTTPException
from app.db.connection import get_db_connection


DEFAULT_ENTITLEMENTS = {
    "professional": {
        "discovery", "mapping", "validation", "basic_reporting",
        "single_project", "email_support", "post_migration_assurance",
        "core_governance", "multi_project", "api_access", "priority_support"
    },
    "enterprise": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "report_studio",
        "multi_project", "api_access", "audit_trail", "governance",
        "priority_support", "pre_migration_assurance",
        "post_migration_assurance", "pre_post_migration_assurance",
        "advanced_governance", "reconciliation"
    },
    "enterprise_plus": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "report_studio", "enterprise_reporting",
        "multi_project", "api_access", "audit_trail", "governance",
        "advanced_governance", "enterprise_governance", "ai_insights",
        "custom_integrations", "dedicated_support", "multi_region", "sla",
        "pre_migration_assurance", "post_migration_assurance",
        "pre_post_migration_assurance", "reconciliation"
    },
}

# OC-REPORT-001: the Report & Analytics Studio add-on is gated by exactly ONE new
# key. The brief's five capability groups map onto existing keys rather than new
# ones (see plan §9.3) — over-splitting the entitlement set is what produced the
# original vocabulary drift that caused the OC-E2E-001 "migration" outage.
REPORT_STUDIO_ENTITLEMENT = "report_studio"
REPORTING_ENTITLEMENTS = {
    "basic_reporting", "advanced_reporting", "enterprise_reporting",
    "report_studio", "ai_insights",
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
                       WHERE s.tenant_id = %s
                         AND s.status IN ('active', 'trialing', 'past_due', 'pending_cancellation')
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
