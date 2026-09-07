"""
OC-SEC-006D — Edge Cases Tenant Isolation Tests

Tests for:
1. all_tenants bypass restricted to Super Admin
2. Query param tenant_id validated against JWT
3. leads GET uses get_current_user_with_tenant
4. permissions_routes uses get_current_user_with_tenant
5. dashboard_routes uses rbac.require_admin
6. validation_report_routes uses get_current_user_with_tenant
"""
import pytest


class TestAllTenantsBypass:
    """Verify all_tenants=True requires Super Admin."""

    def test_mapping_resolve_tenant_restricts_all_tenants(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        assert "all_tenants requires Super Admin role" in source

    def test_discovery_resolve_tenant_restricts_all_tenants(self):
        source = open("app/api/routes/discovery_routes.py", "r").read()
        assert "all_tenants requires Super Admin role" in source

    def test_mapping_resolve_tenant_validates_tenant_override(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        assert "Cannot query tenant you do not belong to" in source

    def test_discovery_resolve_tenant_validates_tenant_override(self):
        source = open("app/api/routes/discovery_routes.py", "r").read()
        assert "Cannot query tenant you do not belong to" in source


class TestTenantIdQueryOverride:
    """Verify query param tenant_id is validated against JWT."""

    def test_mapping_resolve_tenant_checks_ownership(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        # Should check tenant_id != jwt_tenant_id
        assert "tenant_id != jwt_tenant_id" in source

    def test_discovery_resolve_tenant_checks_ownership(self):
        source = open("app/api/routes/discovery_routes.py", "r").read()
        assert "tenant_id != jwt_tenant_id" in source


class TestLeadRoutesTenantAuth:
    """Verify leads routes use get_current_user_with_tenant."""

    def test_lead_routes_use_tenant_auth(self):
        source = open("app/api/routes/lead_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining


class TestPermissionsRoutesTenantAuth:
    """Verify permissions routes use get_current_user_with_tenant."""

    def test_permissions_routes_use_tenant_auth(self):
        source = open("app/api/routes/permissions_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining


class TestDashboardRoutesRbacAdmin:
    """Verify dashboard routes use rbac.require_admin."""

    def test_dashboard_routes_use_rbac_admin(self):
        source = open("app/api/routes/dashboard_routes.py", "r").read()
        assert "require_admin" in source
        assert "from app.api.core.auth.rbac import require_admin" in source

    def test_no_local_require_admin(self):
        source = open("app/api/routes/dashboard_routes.py", "r").read()
        assert "def _require_admin(" not in source


class TestValidationReportRoutesTenantAuth:
    """Verify validation report routes use get_current_user_with_tenant."""

    def test_validation_report_routes_use_tenant_auth(self):
        source = open("app/api/routes/validation_report_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining
