OC-COM-001d Phase 3 is APPROVED WITH REQUIRED FINAL CHECKS.

Do NOT add new architecture or duplicate models.

Complete ONLY these checks/fixes:

1. Apply and verify:
   OC-COM-001d_Phase3_subscription_status.sql
   Confirm live DB CHECK supports:

   * past_due
   * pending_cancellation

2. Inspect the existing RBAC/permission model and determine the correct existing permission/role for billing operations:

   * upgrade/change plan
   * cancel subscription
   * access billing management
     Do NOT create a second RBAC mechanism.
     If existing RBAC already provides the appropriate control, wire it rather than creating new permissions unnecessarily.

3. Add/execute tests for:
   ACTIVE → PENDING_CANCELLATION → CANCELLED
   PAST_DUE → ACTIVE
   pending_cancellation retains entitlements
   past_due retains entitlements during grace
   suspended/cancelled revoke entitlements

4. Specifically verify downgrade using the existing subscription change path:

   * Stripe plan changes correctly
   * platform.subscriptions.plan_id changes
   * core.tenants.plan_id and max_* compatibility fields synchronise
   * entitlements resolve from the resulting subscription/plan
     Do NOT create a separate downgrade service unless the existing implementation genuinely cannot support it.

5. Return concise evidence:

   * migration applied/verified
   * RBAC finding and exact existing mechanism reused
   * tests/results
   * downgrade evidence
   * git status

Do NOT implement OC-COM-001e.
Do NOT push/release.
MAP_V2 must remain untouched.
