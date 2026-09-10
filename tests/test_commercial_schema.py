import pytest
from unittest.mock import MagicMock, patch, PropertyMock
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class TestTenantRoutesExist:
    """Verify tenant_routes.py exists and has required endpoints."""

    def test_tenant_routes_file_exists(self):
        assert os.path.exists("app/api/routes/tenant_routes.py")

    def test_tenant_routes_has_router(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "router = APIRouter" in content
        assert '/tenants"' in content

    def test_post_tenants_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert '@router.post("")' in content or '@router.post("/")' in content

    def test_get_tenants_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert '@router.get("")' in content or '@router.get("/")' in content

    def test_get_tenant_by_id_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "@router.get(\"/{tenant_id}\")" in content

    def test_put_tenant_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "@router.put(\"/{tenant_id}\")" in content

    def test_get_subscription_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "@router.get(\"/{tenant_id}/subscription\")" in content

    def test_post_subscription_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "@router.post(\"/{tenant_id}/subscription\")" in content

    def test_get_plans_exists(self):
        with open("app/api/routes/tenant_routes.py") as f:
            content = f.read()
        assert "@router.get(\"/plans\")" in content


class TestTenantServiceExists:
    """Verify tenant_service.py exists and has required methods."""

    def test_tenant_service_file_exists(self):
        assert os.path.exists("app/services/tenant_service.py")

    def test_has_create_tenant(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def create_tenant" in content

    def test_has_get_tenant(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def get_tenant" in content

    def test_has_list_tenants(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def list_tenants" in content

    def test_has_update_tenant(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def update_tenant" in content

    def test_has_get_subscription(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def get_subscription" in content

    def test_has_change_subscription(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def change_subscription" in content

    def test_has_list_plans(self):
        with open("app/services/tenant_service.py") as f:
            content = f.read()
        assert "def list_plans" in content


class TestTenantRepositoryExists:
    """Verify tenant_repository.py exists and has required methods."""

    def test_tenant_repository_file_exists(self):
        assert os.path.exists("app/db/repositories/tenant_repository.py")

    def test_has_create_tenant(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def create_tenant" in content

    def test_has_get_tenant(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def get_tenant" in content

    def test_has_list_tenants(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def list_tenants" in content

    def test_has_update_tenant(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def update_tenant" in content

    def test_has_get_plan(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def get_plan" in content

    def test_has_get_plan_by_tier(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def get_plan_by_tier" in content

    def test_has_list_plans(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def list_plans" in content

    def test_has_create_subscription(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def create_subscription" in content

    def test_has_create_trial_subscription(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def create_trial_subscription" in content

    def test_has_get_active_subscription(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def get_active_subscription" in content

    def test_has_cancel_subscription(self):
        with open("app/db/repositories/tenant_repository.py") as f:
            content = f.read()
        assert "def cancel_subscription" in content


class TestSQLMigrationExists:
    """Verify SQL migration file exists with required tables."""

    def test_migration_file_exists(self):
        assert os.path.exists(
            "engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql"
        )

    def test_creates_plans_table(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "CREATE TABLE IF NOT EXISTS platform.plans" in content

    def test_creates_subscriptions_table(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "CREATE TABLE IF NOT EXISTS platform.subscriptions" in content

    def test_seeds_three_plans(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "'Professional'" in content
        assert "'Enterprise'" in content
        assert "'Enterprise Plus'" in content

    def test_extends_tenants(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS plan_id" in content
        assert "ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS billing_email" in content
        assert "ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS max_users" in content

    def test_subscriptions_references_tenants(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "REFERENCES core.tenants(tenant_id)" in content

    def test_subscriptions_references_plans(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql") as f:
            content = f.read()
        assert "REFERENCES platform.plans(plan_id)" in content


class TestTenantMiddlewareEnhanced:
    """Verify tenant middleware validates tenant exists and is active."""

    def test_middleware_file_exists(self):
        assert os.path.exists("app/api/core/middleware/tenant_middleware.py")

    def test_middleware_validates_tenant_exists(self):
        with open("app/api/core/middleware/tenant_middleware.py") as f:
            content = f.read()
        assert "Tenant not found" in content

    def test_middleware_validates_tenant_active(self):
        with open("app/api/core/middleware/tenant_middleware.py") as f:
            content = f.read()
        assert "Tenant is" in content

    def test_middleware_rejects_x_tenant_header_as_authority(self):
        # DEV-003: client headers MUST NEVER establish tenancy.
        with open("app/api/core/middleware/tenant_middleware.py") as f:
            content = f.read()
        assert 'request.headers.get("X-Tenant-ID")' not in content

    def test_middleware_rejects_query_param_as_authority(self):
        # DEV-003: client query params MUST NEVER establish tenancy.
        with open("app/api/core/middleware/tenant_middleware.py") as f:
            content = f.read()
        assert "request.query_params.get" not in content
        assert "_extract_jwt_tenant" in content


class TestSystemRepositoryTenantOptional:
    """DEV-001: tenancy derived via project join; sr.tenant_id never authoritative."""

    def test_get_all_accepts_optional_tenant_id(self):
        with open("app/db/repositories/system_repository.py") as f:
            content = f.read()
        assert "def get_all(self, tenant_id=None, project_id=None):" in content
        assert "JOIN core.projects p ON p.project_id = sr.project_id" in content
        assert "p.tenant_id = %s" in content

    def test_get_by_id_accepts_optional_tenant_id(self):
        with open("app/db/repositories/system_repository.py") as f:
            content = f.read()
        assert "def get_by_id(self, system_id, tenant_id=None, project_id=None):" in content
        assert "tenant_id is required" not in content

    def test_get_all_returns_all_when_none(self):
        with open("app/db/repositories/system_repository.py") as f:
            content = f.read()
        # No direct sr.tenant_id filtering remains (comment mentions excepted).
        code = "\n".join(
            line for line in content.splitlines()
            if not line.strip().startswith("#")
        )
        assert "sr.tenant_id" not in code


class TestMainPyRegistered:
    """Verify tenant_routes registered in main.py."""

    def test_tenant_routes_imported(self):
        with open("app/api/main.py") as f:
            content = f.read()
        assert "tenant_routes" in content

    def test_tenant_routes_included(self):
        with open("app/api/main.py") as f:
            content = f.read()
        assert "app.include_router(tenant_routes.router)" in content
