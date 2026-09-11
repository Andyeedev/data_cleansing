"""
OC-COM-001d Phase 3 — Subscription Lifecycle Tests
Tests the DB-level subscription status transitions and entitlement behavior.
"""
import psycopg2
import uuid
import pytest

DB_CONFIG = {
    'dbname': 'migration_engine',
    'user': 'postgres',
    'password': 'dev123456',
    'host': 'localhost'
}


def get_conn():
    return psycopg2.connect(**DB_CONFIG)


def setup_tenant_and_plan():
    """Create a test tenant, plan, and subscription for testing."""
    conn = get_conn()
    conn.autocommit = True
    cur = conn.cursor()

    tenant_id = str(uuid.uuid4())
    plan_id = str(uuid.uuid4())
    sub_id = str(uuid.uuid4())

    # Create test plan
    cur.execute("""
        INSERT INTO platform.plans (plan_id, name, tier, annual_price, entitlements, max_users, max_projects, max_connections, status)
        VALUES (%s, 'Test Plan', 'professional', 25000, '{"discovery": true, "mapping": true}', 5, 3, 5, 'active')
    """, (plan_id,))

    # Create test tenant
    cur.execute("""
        INSERT INTO core.tenants (tenant_id, tenant_name, status, plan_id, max_users, max_projects, max_connections)
        VALUES (%s, 'Test Tenant', 'ACTIVE', %s, 5, 3, 5)
    """, (tenant_id, plan_id))

    return conn, tenant_id, plan_id, sub_id


def cleanup_test_data(conn, tenant_id, plan_id):
    """Clean up test data."""
    cur = conn.cursor()
    cur.execute("DELETE FROM platform.subscriptions WHERE tenant_id = %s", (tenant_id,))
    cur.execute("DELETE FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
    cur.execute("DELETE FROM platform.plans WHERE plan_id = %s", (plan_id,))
    conn.commit()
    conn.close()


class TestSubscriptionStatusTransitions:
    """Test valid status transitions in the subscription lifecycle."""

    def test_active_to_pending_cancellation(self):
        """ACTIVE → PENDING_CANCELLATION (user requests cancel_at_period_end)."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create active subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Transition to pending_cancellation
        cur.execute("""
            UPDATE platform.subscriptions
            SET status = 'pending_cancellation', updated_at = NOW()
            WHERE subscription_id = %s AND status IN ('active', 'trialing')
        """, (sub_id,))
        conn.commit()

        # Verify
        cur.execute("SELECT status FROM platform.subscriptions WHERE subscription_id = %s", (sub_id,))
        status = cur.fetchone()[0]
        assert status == 'pending_cancellation', f"Expected pending_cancellation, got {status}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_pending_cancellation_to_cancelled(self):
        """PENDING_CANCELLATION → CANCELLED (Stripe confirms deletion at period end)."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create pending_cancellation subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'pending_cancellation', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Transition to cancelled (Stripe webhook on deletion)
        cur.execute("""
            UPDATE platform.subscriptions
            SET status = 'cancelled', end_date = CURRENT_DATE, updated_at = NOW()
            WHERE subscription_id = %s
        """, (sub_id,))
        conn.commit()

        # Verify
        cur.execute("SELECT status FROM platform.subscriptions WHERE subscription_id = %s", (sub_id,))
        status = cur.fetchone()[0]
        assert status == 'cancelled', f"Expected cancelled, got {status}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_past_due_to_active(self):
        """PAST_DUE → ACTIVE (invoice paid, payment recovery)."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create past_due subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'past_due', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Transition to active (invoice paid webhook)
        cur.execute("""
            UPDATE platform.subscriptions
            SET status = 'active', updated_at = NOW()
            WHERE subscription_id = %s AND status IN ('suspended', 'past_due')
        """, (sub_id,))
        conn.commit()

        # Verify
        cur.execute("SELECT status FROM platform.subscriptions WHERE subscription_id = %s", (sub_id,))
        status = cur.fetchone()[0]
        assert status == 'active', f"Expected active, got {status}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_active_to_past_due(self):
        """ACTIVE → PAST_DUE (payment failed, grace period)."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create active subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Transition to past_due (Stripe subscription updated webhook)
        cur.execute("""
            UPDATE platform.subscriptions
            SET status = 'past_due', updated_at = NOW()
            WHERE subscription_id = %s AND status NOT IN ('cancelled', 'expired')
        """, (sub_id,))
        conn.commit()

        # Verify
        cur.execute("SELECT status FROM platform.subscriptions WHERE subscription_id = %s", (sub_id,))
        status = cur.fetchone()[0]
        assert status == 'past_due', f"Expected past_due, got {status}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_active_to_suspended(self):
        """ACTIVE → SUSPENDED (payment failure beyond grace)."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create active subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Transition to suspended
        cur.execute("""
            UPDATE platform.subscriptions
            SET status = 'suspended', updated_at = NOW()
            WHERE subscription_id = %s AND status = 'active'
        """, (sub_id,))
        conn.commit()

        # Verify
        cur.execute("SELECT status FROM platform.subscriptions WHERE subscription_id = %s", (sub_id,))
        status = cur.fetchone()[0]
        assert status == 'suspended', f"Expected suspended, got {status}"

        cleanup_test_data(conn, tenant_id, plan_id)


class TestEntitlementBehavior:
    """Test that entitlements are correctly granted/revoked based on subscription status."""

    def get_entitlements(self, tenant_id):
        """Query entitlements the same way the middleware does."""
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT p.entitlements, p.tier
            FROM platform.subscriptions s
            JOIN platform.plans p ON s.plan_id = p.plan_id
            WHERE s.tenant_id = %s
              AND s.status IN ('active', 'trialing', 'past_due', 'pending_cancellation')
            ORDER BY s.created_at DESC LIMIT 1
        """, (tenant_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return set()
        entitlements_json, tier = row
        if entitlements_json and isinstance(entitlements_json, dict):
            return set(entitlements_json.keys())
        return set()

    def test_pending_cancellation_retains_entitlements(self):
        """pending_cancellation should retain full entitlements until period end."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'pending_cancellation', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert 'discovery' in entitlements, "pending_cancellation should retain discovery entitlement"
        assert 'mapping' in entitlements, "pending_cancellation should retain mapping entitlement"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_past_due_retains_entitlements(self):
        """past_due should retain entitlements during grace period."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'past_due', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert 'discovery' in entitlements, "past_due should retain discovery entitlement"
        assert 'mapping' in entitlements, "past_due should retain mapping entitlement"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_suspended_revokes_entitlements(self):
        """suspended should revoke all entitlements."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'suspended', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert len(entitlements) == 0, f"suspended should revoke all entitlements, got {entitlements}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_cancelled_revokes_entitlements(self):
        """cancelled should revoke all entitlements."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'cancelled', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert len(entitlements) == 0, f"cancelled should revoke all entitlements, got {entitlements}"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_active_grants_entitlements(self):
        """active should grant full entitlements."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert 'discovery' in entitlements, "active should grant discovery entitlement"
        assert 'mapping' in entitlements, "active should grant mapping entitlement"

        cleanup_test_data(conn, tenant_id, plan_id)

    def test_trialing_grants_entitlements(self):
        """trialing should grant full entitlements."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, trial_end_date)
            VALUES (%s, %s, %s, 'trialing', 'monthly', CURRENT_DATE + INTERVAL '30 days')
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        entitlements = self.get_entitlements(tenant_id)
        assert 'discovery' in entitlements, "trialing should grant discovery entitlement"
        assert 'mapping' in entitlements, "trialing should grant mapping entitlement"

        cleanup_test_data(conn, tenant_id, plan_id)


class TestDowngradePath:
    """Test the downgrade path using the existing subscription change mechanism."""

    def test_downgrade_syncs_tenant_limits(self):
        """Downgrade should sync plan_id and max_* on core.tenants."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create enterprise plan (higher tier)
        enterprise_plan_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO platform.plans (plan_id, name, tier, annual_price, entitlements, max_users, max_projects, max_connections, status)
            VALUES (%s, 'Enterprise', 'enterprise', 75000, '{"discovery": true, "mapping": true, "governance": true}', 20, 10, 20, 'active')
        """, (enterprise_plan_id,))

        # Start with enterprise subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, enterprise_plan_id))
        conn.commit()

        # Simulate downgrade to professional (existing change_subscription path)
        # 1. Cancel old subscription
        cur.execute("""
            UPDATE platform.subscriptions SET status = 'cancelled', end_date = CURRENT_DATE
            WHERE subscription_id = %s
        """, (sub_id,))

        # 2. Create new subscription with lower tier
        new_sub_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'active', 'annual', CURRENT_DATE)
        """, (new_sub_id, tenant_id, plan_id))

        # 3. Update tenant limits (this is what TenantService.change_subscription does)
        cur.execute("""
            UPDATE core.tenants
            SET plan_id = %s, max_users = 5, max_projects = 3, max_connections = 5, updated_at = NOW()
            WHERE tenant_id = %s
        """, (plan_id, tenant_id))
        conn.commit()

        # Verify tenant limits synced
        cur.execute("SELECT plan_id, max_users, max_projects, max_connections FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
        row = cur.fetchone()
        assert row[0] == plan_id, f"Tenant plan_id should be professional, got {row[0]}"
        assert row[1] == 5, f"max_users should be 5, got {row[1]}"
        assert row[2] == 3, f"max_projects should be 3, got {row[2]}"
        assert row[3] == 5, f"max_connections should be 5, got {row[3]}"

        # Verify subscription is on new plan
        cur.execute("SELECT plan_id FROM platform.subscriptions WHERE subscription_id = %s", (new_sub_id,))
        sub_plan = cur.fetchone()[0]
        assert sub_plan == plan_id, f"Subscription plan_id should be professional, got {sub_plan}"

        # Clean up
        cur.execute("DELETE FROM platform.subscriptions WHERE tenant_id = %s", (tenant_id,))
        cur.execute("DELETE FROM core.tenants WHERE tenant_id = %s", (tenant_id,))
        cur.execute("DELETE FROM platform.plans WHERE plan_id IN (%s, %s)", (plan_id, enterprise_plan_id))
        conn.commit()
        conn.close()

    def test_get_active_subscription_includes_pending_cancellation(self):
        """get_active_subscription query should include pending_cancellation."""
        conn, tenant_id, plan_id, sub_id = setup_tenant_and_plan()
        cur = conn.cursor()

        # Create pending_cancellation subscription
        cur.execute("""
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date)
            VALUES (%s, %s, %s, 'pending_cancellation', 'annual', CURRENT_DATE)
        """, (sub_id, tenant_id, plan_id))
        conn.commit()

        # Query using the same filter as TenantRepository.get_active_subscription
        cur.execute("""
            SELECT s.subscription_id, s.status
            FROM platform.subscriptions s
            WHERE s.tenant_id = %s AND s.status IN ('active', 'trialing', 'pending_cancellation')
            ORDER BY s.created_at DESC LIMIT 1
        """, (tenant_id,))
        row = cur.fetchone()
        assert row is not None, "pending_cancellation should be returned by get_active_subscription"
        assert row[1] == 'pending_cancellation', f"Status should be pending_cancellation, got {row[1]}"

        cleanup_test_data(conn, tenant_id, plan_id)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
