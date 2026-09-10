"""
OC-SEC-006C — Operational Routes Tenant Isolation Tests

Tests for:
1. All 6 route files use get_current_user_with_tenant
2. mapping_routes.py legacy routes have auth
3. governance_routes.py uses rbac.require_admin
4. operations_execution_routes.py enforces body.tenant_id == JWT tenant_id
5. operations_execution_routes.py defaults tenant_id from JWT
"""
import pytest


class TestRouteAuthDependencies:
    """Verify all operational route files use get_current_user_with_tenant."""

    def test_mapping_routes_use_tenant_auth(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        # Ensure no bare get_current_user remains (excluding get_current_user_with_tenant)
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining

    def test_control_routes_use_tenant_auth(self):
        source = open("app/api/routes/control_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining

    def test_execution_control_routes_use_tenant_auth(self):
        source = open("app/api/routes/execution_control_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining

    def test_governance_routes_use_rbac_admin(self):
        source = open("app/api/routes/governance_routes.py", "r").read()
        assert "require_admin" in source
        assert "from app.api.core.auth.rbac import require_admin" in source

    def test_export_routes_use_tenant_auth(self):
        source = open("app/api/routes/export_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining

    def test_operations_routes_use_tenant_auth(self):
        source = open("app/api/routes/operations_execution_routes.py", "r").read()
        assert "get_current_user_with_tenant" in source
        remaining = source.replace("get_current_user_with_tenant", "")
        assert "get_current_user" not in remaining


class TestMappingLegacyRoutesAuth:
    """Verify the 9 legacy mapping routes now have auth."""

    def test_get_mappings_has_auth(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        # Find the get_mappings function and check it has current_user
        assert "async def get_mappings(\n    project_id: str," in source
        assert "current_user=Depends(get_current_user_with_tenant)" in source

    def test_all_legacy_routes_have_auth(self):
        source = open("app/api/routes/mapping_routes.py", "r").read()
        # Count route handlers without auth
        lines = source.split("\n")
        route_defs = []
        for i, line in enumerate(lines):
            if line.startswith("@router.") and ("def " in lines[i+1] if i+1 < len(lines) else False):
                route_defs.append((i, lines[i+1]))

        # All route handlers should have current_user=Depends(get_current_user_with_tenant)
        for line_num, route_def in route_defs:
            # Check the next few lines for auth dependency
            block = "\n".join(lines[line_num:line_num+10])
            assert "get_current_user_with_tenant" in block or "get_current_user" in block, \
                f"Line {line_num+1}: {route_def.strip()} missing auth"


class TestGovernanceRoutesAdminOnly:
    """Verify governance routes use rbac.require_admin instead of local copy."""

    def test_no_local_require_admin(self):
        source = open("app/api/routes/governance_routes.py", "r").read()
        # Should not have the old local _require_admin definition
        assert "def _require_admin(" not in source

    def test_all_governance_routes_use_require_admin(self):
        source = open("app/api/routes/governance_routes.py", "r").read()
        assert source.count("Depends(require_admin)") == 4


class TestOperationsExecutionTenantEnforcement:
    """Verify operations routes enforce tenant_id from JWT."""

    def test_start_run_enforces_tenant_id(self):
        source = open("app/api/routes/operations_execution_routes.py", "r").read()
        assert "body.tenant_id != jwt_tenant_id" in source
        assert "cannot start run for another tenant" in source

    def test_get_run_history_defaults_tenant(self):
        # DEV-003: JWT tenant only — the ?tenant_id= override is removed.
        source = open("app/api/routes/operations_execution_routes.py", "r").read()
        assert "effective_tenant = tenant_id or current_user.get(\"tenant_id\")" not in source
        assert "tenant_id=current_user.get(\"tenant_id\")" in source

    def test_status_breakdown_defaults_tenant(self):
        # DEV-003: JWT tenant only — the ?tenant_id= override is removed.
        source = open("app/api/routes/operations_execution_routes.py", "r").read()
        assert "effective_tenant = tenant_id or current_user.get(\"tenant_id\")" not in source
        assert "current_user.get(\"tenant_id\")" in source
