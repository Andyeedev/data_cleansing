What I recommend OpenCode does next

Rather than immediately coding 001c, I would make the next task:

OC-COM-001c PRE-FLIGHT — SaaS Product & Tenant Lifecycle Architecture

Ask OpenCode to investigate the existing policy/docs/code first, specifically looking for whether these concepts are already documented:

Tenant lifecycle
Signup
Trial
Subscription
Stripe checkout
Billing
Plans
Entitlements
User onboarding
User profiles
Tenant administration
Projects
Systems/connections
Credentials
Dataset discovery
Mapping
Validation
Reports
Project/user permissions
Tenant suspension/cancellation
Subscription expiry
Tenant deletion/offboarding
Data retention
Super Admin vs Tenant Admin
Frontend routes/pages/components
Existing MAP_V3 frontend architecture

Then have it produce a lifecycle/architecture proposal only — no code changes.

That proposal should answer:

"From first visit to paying customer to running their first migration, exactly what does a MAP customer experience and what database entities/assets are created at each stage?"

That is the missing piece.

One particularly important thing to resolve

We should explicitly define the relationship:

Subscription → Tenant → Project → System → Connection/Credential → Dataset → Mapping → Validation Run → Report

and determine which are tenant-level and which are project-level.

That will prevent us repeatedly discovering tenant-boundary issues later.