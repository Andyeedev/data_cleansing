import pytest
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class TestStripeConfigExists:
    """Verify stripe_config.py exists and has required config."""

    def test_stripe_config_file_exists(self):
        assert os.path.exists("app/config/stripe_config.py")

    def test_has_stripe_secret_key(self):
        with open("app/config/stripe_config.py") as f:
            content = f.read()
        assert "STRIPE_SECRET_KEY" in content

    def test_has_stripe_publishable_key(self):
        with open("app/config/stripe_config.py") as f:
            content = f.read()
        assert "STRIPE_PUBLISHABLE_KEY" in content

    def test_has_stripe_webhook_secret(self):
        with open("app/config/stripe_config.py") as f:
            content = f.read()
        assert "STRIPE_WEBHOOK_SECRET" in content

    def test_has_price_id_mapping(self):
        with open("app/config/stripe_config.py") as f:
            content = f.read()
        assert "STRIPE_PRICE_IDS" in content
        assert "TIER_MAP" in content

    def test_keys_from_env(self):
        with open("app/config/stripe_config.py") as f:
            content = f.read()
        assert "os.getenv" in content or "environ" in content


class TestStripeServiceExists:
    """Verify stripe_service.py exists and has required methods."""

    def test_stripe_service_file_exists(self):
        assert os.path.exists("app/services/stripe_service.py")

    def test_has_create_customer(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def create_customer" in content

    def test_has_create_checkout_session(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def create_checkout_session" in content

    def test_has_create_portal_session(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def create_portal_session" in content

    def test_has_handle_webhook(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def handle_webhook" in content

    def test_has_cancel_subscription(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def cancel_subscription" in content

    def test_has_upgrade_subscription(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def upgrade_subscription" in content

    def test_has_list_invoices(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "def list_invoices" in content

    def test_webhook_validates_signature(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "construct_event" in content

    def test_graceful_stripe_import(self):
        with open("app/services/stripe_service.py") as f:
            content = f.read()
        assert "try:" in content
        assert "ImportError" in content


class TestBillingRoutesExists:
    """Verify billing_routes.py exists and has required endpoints."""

    def test_billing_routes_file_exists(self):
        assert os.path.exists("app/api/routes/billing_routes.py")

    def test_has_router(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert "router = APIRouter" in content
        assert '/billing"' in content

    def test_post_checkout_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.post("/checkout")' in content

    def test_post_portal_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.post("/portal")' in content

    def test_post_webhook_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.post("/webhook")' in content

    def test_get_invoices_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.get("/invoices")' in content

    def test_post_upgrade_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.post("/upgrade")' in content

    def test_post_cancel_exists(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert '@router.post("/cancel")' in content

    def test_webhook_no_auth(self):
        with open("app/api/routes/billing_routes.py") as f:
            content = f.read()
        assert "Depends(get_current_user" not in content.split("@router.post(\"/webhook\")")[1].split("@router")[0]


class TestEntitlementMiddlewareExists:
    """Verify entitlement_middleware.py exists and has required functions."""

    def test_entitlement_middleware_file_exists(self):
        assert os.path.exists("app/middleware/entitlement_middleware.py")

    def test_has_require_entitlement(self):
        with open("app/middleware/entitlement_middleware.py") as f:
            content = f.read()
        assert "def require_entitlement" in content

    def test_has_check_entitlement(self):
        with open("app/middleware/entitlement_middleware.py") as f:
            content = f.read()
        assert "def check_entitlement" in content

    def test_has_get_tenant_entitlements(self):
        with open("app/middleware/entitlement_middleware.py") as f:
            content = f.read()
        assert "def get_tenant_entitlements" in content

    def test_has_default_entitlements(self):
        with open("app/middleware/entitlement_middleware.py") as f:
            content = f.read()
        assert "DEFAULT_ENTITLEMENTS" in content
        assert "professional" in content
        assert "enterprise" in content
        assert "enterprise_plus" in content

    def test_blocks_unauthorized_feature(self):
        with open("app/middleware/entitlement_middleware.py") as f:
            content = f.read()
        assert "403" in content
        assert "Upgrade required" in content


class TestSQLMigrationStripe:
    """Verify SQL migration for stripe columns."""

    def test_migration_file_exists(self):
        assert os.path.exists(
            "engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql"
        )

    def test_adds_stripe_customer_id(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql") as f:
            content = f.read()
        assert "stripe_customer_id" in content

    def test_adds_stripe_subscription_id(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql") as f:
            content = f.read()
        assert "stripe_subscription_id" in content

    def test_creates_index(self):
        with open("engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql") as f:
            content = f.read()
        assert "CREATE INDEX" in content
        assert "idx_tenants_stripe_customer_id" in content


class TestMainPyBillingRegistered:
    """Verify billing_routes registered in main.py."""

    def test_billing_routes_imported(self):
        with open("app/api/main.py") as f:
            content = f.read()
        assert "billing_routes" in content

    def test_billing_routes_included(self):
        with open("app/api/main.py") as f:
            content = f.read()
        assert "app.include_router(billing_routes.router)" in content


class TestStripeInRequirements:
    """Verify stripe is in requirements.txt."""

    def test_stripe_in_requirements(self):
        with open("requirements.txt") as f:
            content = f.read()
        assert "stripe" in content
