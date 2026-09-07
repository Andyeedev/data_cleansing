import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

try:
    import stripe
    from app.config.stripe_config import (
        STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, TIER_MAP
    )
    stripe.api_key = STRIPE_SECRET_KEY
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False
    logger.warning("stripe package not installed — billing features disabled")


class StripeService:

    def __init__(self, conn):
        self.conn = conn

    def _check_stripe(self):
        if not STRIPE_AVAILABLE:
            raise RuntimeError("Stripe SDK not installed. Install with: pip install stripe")

    def create_customer(self, tenant_id, email, tenant_name):
        self._check_stripe()

        customer = stripe.Customer.create(
            email=email,
            name=tenant_name,
            metadata={"tenant_id": tenant_id}
        )

        with self.conn.cursor() as cur:
            cur.execute(
                "UPDATE core.tenants SET stripe_customer_id = %s, updated_at = NOW() WHERE tenant_id = %s",
                (customer.id, tenant_id)
            )
        self.conn.commit()

        return {"stripe_customer_id": customer.id}

    def create_checkout_session(self, tenant_id, tier, billing_cycle, success_url, cancel_url):
        self._check_stripe()

        price_id = TIER_MAP.get(tier, {}).get(billing_cycle)
        if not price_id:
            raise ValueError(f"No price ID for tier={tier}, cycle={billing_cycle}")

        tenant = self._get_tenant(tenant_id)
        if not tenant.get("stripe_customer_id"):
            raise ValueError("Tenant has no Stripe customer. Create customer first.")

        session = stripe.checkout.Session.create(
            customer=tenant["stripe_customer_id"],
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"tenant_id": tenant_id, "tier": tier, "billing_cycle": billing_cycle}
        )

        return {"checkout_url": session.url, "session_id": session.id}

    def create_portal_session(self, tenant_id, return_url):
        self._check_stripe()

        tenant = self._get_tenant(tenant_id)
        if not tenant.get("stripe_customer_id"):
            raise ValueError("Tenant has no Stripe customer.")

        session = stripe.billing_portal.Session.create(
            customer=tenant["stripe_customer_id"],
            return_url=return_url
        )

        return {"portal_url": session.url}

    def handle_webhook(self, payload, sig_header):
        self._check_stripe()

        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )

        handlers = {
            "checkout.session.completed": self._handle_checkout_completed,
            "invoice.paid": self._handle_invoice_paid,
            "invoice.payment_failed": self._handle_invoice_payment_failed,
            "customer.subscription.updated": self._handle_subscription_updated,
            "customer.subscription.deleted": self._handle_subscription_deleted,
        }

        handler = handlers.get(event["type"])
        if handler:
            handler(event["data"]["object"])
        else:
            logger.info(f"Unhandled Stripe event: {event['type']}")

        return {"received": True}

    def _handle_checkout_completed(self, session):
        tenant_id = session.get("metadata", {}).get("tenant_id")
        stripe_sub_id = session.get("subscription")
        if tenant_id and stripe_sub_id:
            with self.conn.cursor() as cur:
                cur.execute(
                    """UPDATE platform.subscriptions
                       SET stripe_subscription_id = %s, status = 'active', start_date = CURRENT_DATE
                       WHERE tenant_id = %s AND status IN ('pending', 'trialing')
                       ORDER BY created_at DESC LIMIT 1""",
                    (stripe_sub_id, tenant_id)
                )
                cur.execute(
                    "UPDATE core.tenants SET stripe_subscription_id = %s, updated_at = NOW() WHERE tenant_id = %s",
                    (stripe_sub_id, tenant_id)
                )
            self.conn.commit()
            logger.info(f"Checkout completed for tenant {tenant_id}")

    def _handle_invoice_paid(self, invoice):
        customer_id = invoice.get("customer")
        if customer_id:
            with self.conn.cursor() as cur:
                cur.execute(
                    "SELECT tenant_id FROM core.tenants WHERE stripe_customer_id = %s",
                    (customer_id,)
                )
                row = cur.fetchone()
                if row:
                    cur.execute(
                        "UPDATE platform.subscriptions SET status = 'active', updated_at = NOW() WHERE tenant_id = %s AND status = 'active'",
                        (row[0],)
                    )
            self.conn.commit()
            logger.info(f"Invoice paid for customer {customer_id}")

    def _handle_invoice_payment_failed(self, invoice):
        customer_id = invoice.get("customer")
        if customer_id:
            with self.conn.cursor() as cur:
                cur.execute(
                    "SELECT tenant_id FROM core.tenants WHERE stripe_customer_id = %s",
                    (customer_id,)
                )
                row = cur.fetchone()
                if row:
                    cur.execute(
                        "UPDATE platform.subscriptions SET status = 'suspended', updated_at = NOW() WHERE tenant_id = %s AND status = 'active'",
                        (row[0],)
                    )
            self.conn.commit()
            logger.warning(f"Payment failed for customer {customer_id}")

    def _handle_subscription_updated(self, subscription):
        stripe_sub_id = subscription.get("id")
        status = subscription.get("status")
        if stripe_sub_id:
            status_map = {"active": "active", "past_due": "suspended", "canceled": "cancelled", "unpaid": "suspended"}
            db_status = status_map.get(status, "active")
            with self.conn.cursor() as cur:
                cur.execute(
                    "UPDATE platform.subscriptions SET status = %s, updated_at = NOW() WHERE stripe_subscription_id = %s",
                    (db_status, stripe_sub_id)
                )
            self.conn.commit()
            logger.info(f"Subscription {stripe_sub_id} updated to {db_status}")

    def _handle_subscription_deleted(self, subscription):
        stripe_sub_id = subscription.get("id")
        if stripe_sub_id:
            with self.conn.cursor() as cur:
                cur.execute(
                    "UPDATE platform.subscriptions SET status = 'cancelled', end_date = CURRENT_DATE, updated_at = NOW() WHERE stripe_subscription_id = %s",
                    (stripe_sub_id,)
                )
            self.conn.commit()
            logger.info(f"Subscription {stripe_sub_id} deleted")

    def cancel_subscription(self, tenant_id):
        self._check_stripe()

        tenant = self._get_tenant(tenant_id)
        stripe_sub_id = tenant.get("stripe_subscription_id")
        if not stripe_sub_id:
            raise ValueError("No active Stripe subscription")

        stripe.Subscription.modify(stripe_sub_id, cancel_at_period_end=True)

        with self.conn.cursor() as cur:
            cur.execute(
                "UPDATE platform.subscriptions SET status = 'cancelled', updated_at = NOW() WHERE tenant_id = %s AND status = 'active'",
                (tenant_id,)
            )
        self.conn.commit()

        return {"message": "Subscription cancelled. Active until period end."}

    def upgrade_subscription(self, tenant_id, new_tier, billing_cycle="annual"):
        self._check_stripe()

        tenant = self._get_tenant(tenant_id)
        stripe_sub_id = tenant.get("stripe_subscription_id")
        if not stripe_sub_id:
            raise ValueError("No active Stripe subscription")

        new_price_id = TIER_MAP.get(new_tier, {}).get(billing_cycle)
        if not new_price_id:
            raise ValueError(f"No price ID for tier={new_tier}")

        subscription = stripe.Subscription.retrieve(stripe_sub_id)
        stripe.Subscription.modify(
            stripe_sub_id,
            items=[{
                "id": subscription["items"]["data"][0].id,
                "price": new_price_id,
            }],
            proration_behavior="create_prorations"
        )

        with self.conn.cursor() as cur:
            cur.execute(
                "UPDATE platform.subscriptions SET updated_at = NOW() WHERE stripe_subscription_id = %s",
                (stripe_sub_id,)
            )
        self.conn.commit()

        return {"message": f"Upgraded to {new_tier}"}

    def list_invoices(self, tenant_id):
        self._check_stripe()

        tenant = self._get_tenant(tenant_id)
        customer_id = tenant.get("stripe_customer_id")
        if not customer_id:
            return {"invoices": []}

        invoices = stripe.Invoice.list(customer=customer_id, limit=20)
        return {
            "invoices": [
                {
                    "id": inv.id,
                    "amount_paid": inv.amount_paid / 100,
                    "currency": inv.currency,
                    "status": inv.status,
                    "created": datetime.fromtimestamp(inv.created).isoformat(),
                    "invoice_pdf": inv.invoice_pdf,
                }
                for inv in invoices.data
            ]
        }

    def _get_tenant(self, tenant_id):
        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT tenant_id, stripe_customer_id, stripe_subscription_id FROM core.tenants WHERE tenant_id = %s",
                (tenant_id,)
            )
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else {}
