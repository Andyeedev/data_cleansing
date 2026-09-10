# OC-COM-001c — SaaS Product & Tenant Lifecycle Architecture (Revised)

**DATE:** 2026-09-07

**STATUS:** PROPOSAL (no code changes)

**PURPOSE:** Define the complete customer journey from first visit to running their first migration, and establish the definitive entity hierarchy with tenant-level vs project-level boundaries.

---

## 1. THE COMPLETE CUSTOMER LIFECYCLE

### Stage 0 — Awareness & Landing

**What the customer experiences:**

- Visits `mapnexus.co.uk` — sees landing page with product overview, case studies, pricing

- Can submit a lead via the website form (`POST /api/v1/leads`)

**What is created in the database:**

- `core.leads` — one row (name, email, company, source_form)

**What is NOT created:**

- No tenant

- No user

- No subscription

- No plan

- No project

**Current status:** ✅ EXISTS (OC-SEC-001, OC-SEC-001A)

**Gap:** Lead → Tenant conversion is manual (no automated provisioning)

---

### Stage 1 — Signup & Tenant Provisioning

**What the customer experiences:**

- Super Admin creates a new tenant via internal admin panel (`POST /api/v1/tenants`)

- OR (future): Self-service signup with credit card via Stripe Checkout

- Receives welcome email with login credentials

- Admin user can log in with the provided password

**What is created in the database:**

| Entity | Table | Scope |

|--------|-------|-------|

| Tenant | `core.tenants` | System-wide |

| Admin User | `platform.users` | Tenant-scoped (`tenant_id`) |

| Subscription | `platform.subscriptions` | Tenant-scoped (status=`trialing`) |

| Plan | `platform.plans` | Global (seed data, already exists) |

**What is NOT created:**

- No project

- No system

- No credential

- No mapping

- No validation run

- No report

**Current status:** ✅ IMPLEMENTED (OC-COM-001a)

---

### Stage 2 — Trial & Plan Assignment

**What the customer experiences:**

- Admin user sees their current plan and trial countdown

- Can view available plans and their features / pricing

- Can upgrade from trial to paid via Stripe Checkout

- Trial is 30 days by default

**What changes in the database:**

- Subscription status transitions: `trialing` → `active` (on checkout.completed webhook)

- `core.tenants.stripe_customer_id` populated

- `core.tenants.stripe_subscription_id` populated

**What is NOT created:**

- No project yet

- No systems yet

**Current status:** ✅ PARTIALLY IMPLEMENTED (OC-COM-001b — Stripe config + routes exist, but require actual Stripe account + env vars)

---

### Stage 3 — User Onboarding & Role Assignment

**What the customer experiences:**

- Tenant Admin logs in → lands on empty Dashboard

- Can invite additional users (`POST /api/v1/users`)

- Assigns roles to users (Migration Lead, Data Analyst, Team Member, etc.)

- Users receive invitations, log in, see their authorized views

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Users | `platform.users` | Tenant-scoped |

| User-Role assignments | `platform.user_roles` | Tenant-scoped (via role.tenant_id) |

| Roles | `platform.roles` | Tenant-scoped or system-wide |

**Current status:** ✅ EXISTS (pre-MAP_V3 + OC-SEC-006B)

---

### Stage 4 — Create a Migration Project

**What the customer experiences:**

- Admin creates a Migration Project (`POST /api/v1/projects`)

- Gives it a name, description, target date

- Now has a container to organize migration work

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Project | `core.projects` | Tenant-scoped (`tenant_id`) |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 5 — Register Systems & Credentials

**What the customer experiences:**

- Registers source systems (databases, applications) they want to migrate

- Configures connection credentials for each system

- Tests the connection (health check)

- Systems are organized under the project

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Systems | `core.system_registry` | Tenant-scoped (`tenant_id`) |

| Credentials | `core.system_credentials` | Tenant-scoped (via system → tenant JOIN) |

**Current status:** ✅ EXISTS (pre-MAP_V3 + OC-SEC-006A)

---

### Stage 6 — Dataset Discovery

**What the customer experiences:**

- Runs discovery against registered systems

- Discovers tables, columns, data types, dependencies

- Reviews discovered inventory

- Tags and categorizes assets

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Discovery results | `core.discovery_*` | Tenant-scoped (`tenant_id`) |

| Discovered tables | `core.discovered_tables` | Project-scoped (via project_id) |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 7 — Mapping

**What the customer experiences:**

- Creates source → target mappings for discovered tables/columns

- Defines transformation rules

- Reviews mapping coverage and completeness

- Version-controlled mapping snapshots

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Mappings | `engine.mapping_config` / `engine.mapping_rules` | Project-scoped (via project_id) |

| Mapping versions | `engine.mapping_versions` | Project-scoped |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 8 — Validation Rules & Execution

**What the customer experiences:**

- Configures validation rules (or inherits from project template)

- Runs validation batch against mapped data

- Views results (pass/fail/warning counts)

- Drills into specific failures

- Re-runs after fixes

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Validation runs | `engine.validation_runs` | Project-scoped |

| Validation results | `engine.validation_results` | Run-scoped |

| Defects | `engine.validation_defects` | Result-scoped |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 9 — Reports & Evidence

**What the customer experiences:**

- Generates reports (executive summary, detail reports, compliance packs)

- Views dashboards with KPIs

- Exports evidence for audit

- Shares reports with stakeholders

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Reports | `engine.report_*` | Tenant-scoped or Project-scoped |

| Report suites | `engine.report_suites` | Tenant-scoped |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 10 — Governance & Approvals

**What the customer experiences:**

- Workflows to approve mappings, validation results, migration checkpoints

- Audit trail of all decisions

- Governance controls for compliance

**What is created:**

| Entity | Table | Scope |

|--------|-------|-------|

| Workflows | `platform.workflow_definitions` / `platform.workflow_instances` | Tenant-scoped |

| Approvals | `platform.approval_requests` | Tenant-scoped |

| Audit records | (various audit tables) | Tenant-scoped |

**Current status:** ✅ EXISTS (pre-MAP_V3)

---

### Stage 11 — Subscription Renewal / Upgrade / Downgrade

**What the customer experiences:**

- Receives renewal notification

- Upgrades from Professional to Enterprise (more features, more capacity)

- Downgrades at next billing cycle

- Cancels subscription (services until period end)

- Views invoice history

**What changes in the database:**

- Subscription status: `active` → `cancelled` (at period end)

- New subscription created on upgrade

- Invoice records from Stripe

**Current status:** ✅ PARTIALLY IMPLEMENTED (OC-COM-001b routes exist, Stripe integration needs account + env vars)

---

### Stage 12 — Suspension / Offboarding / Data Retention

**What the customer experiences:**

- Tenant Admin cannot log in (suspended)

- All API requests return 403 (Tenant is suspended)

- Data retained per retention policy (7 years by default)

- After retention period, data is purged

- Tenant can be reactivated if within retention window

**What changes in the database:**

- `core.tenants.status` = `SUSPENDED` (not deleted — data preserved)

- `platform.users.status` = `inactive` (users cannot log in)

- After retention period: CASCADE delete of all tenant-scoped data

**Current status:** ❌ NOT IMPLEMENTED — no suspension/offboarding logic exists

---

## 2. ENTITY HIERARCHY — DEFINITIVE BOUNDARY MODEL

### The Hierarchy

```

Subscription (tenant-level)

    │

    └── Tenant (core.tenants)

         │

         ├── Users (platform.users) — tenant-level

         ├── Roles (platform.roles) — tenant-level

         ├── Feature Flags (per-tenant) — tenant-level

         │

         ├── Project (core.projects) — tenant-level, CONTAINS:

         │    ├── Systems (core.system_registry) — project-level

         │    │    └── Credentials (core.system_credentials) — system-level

         │    ├── Mappings (engine.mapping_rules) — project-level

         │    ├── Validation Runs (engine.validation_runs) — project-level

         │    │    └── Validation Results — run-level

         │    │         └── Defects — result-level

         │    └── Reports (engine.report_*) — project-level OR tenant-level

         │

         ├── Subscription History (platform.subscriptions) — tenant-level

         ├── Billing / Invoices (Stripe) — tenant-level

         └── Audit Logs — tenant-level (for tenant-admin actions)

              └── System-wide audit — system-level (for super-admin)

```

### Which Are Tenant-Level vs Project-Level?

| Entity | Level | Rationale |

|--------|-------|-----------|

| Subscription | **Tenant** | A tenant has one active subscription. Subscription determines what's possible across ALL projects. |

| Plan definition | **Global** | Plans are defined once by the platform provider, shared across all tenants. |

| Tenant | **System** | The top-level organizational unit. One tenant = one customer organization. |

| User | **Tenant** | Users belong to a tenant. A user in Tenant A cannot access Tenant B's data. |

| Role | **Tenant** (or system) | Roles can be tenant-specific or system-wide (e.g., Super Admin). |

| Project | **Tenant** | A tenant can have multiple projects. Projects do not cross tenant boundaries. |

| System | **Project** | A system belongs to a single project. Systems are not shared across projects. |

| Credential | **System** (project by JOIN) | Stored per-system. Tenant isolation enforced via system → tenant JOIN. |

| Discovery | **Project** | Discovery results belong to a project. Re-discovering for another project creates new records. |

| Mapping | **Project** | Mappings are project-specific. Source→Target relationships are project-scoped. |

| Validation Run | **Project** | A run executes against a specific project's data. |

| Validation Result | **Run** (project by ancestry) | Results are child of a run, scoped to the project through run ancestry. |

| Defect | **Result** (project by ancestry) | Same chain of scoping. |

| Report | **Tenant** (dashboards/KPIs) or **Project** (execution reports) | Report suites and templates are tenant-level. Generated reports are project-level. |

| Workflow/Approval | **Tenant** | Governance workflows span across projects within a tenant. |

| Audit Record | **Tenant** (tenant-scoped actions) / **System** (super admin actions) | Tenant admin actions audited per-tenant. Super admin actions audited system-wide. |

| Billing / Invoice | **Tenant** | One billing relationship per tenant. |

| Entitlements | **Tenant** (via subscription plan) | What features this tenant's plan includes. Checked at route level via entitlement middleware. |

### Key Design Rules

1. **A request MUST carry a `tenant_id`** — whether from JWT, header, or query param

2. **A tenant_id can NEVER be overwritten by user-supplied data** — the JWT tenant_id is authoritative

3. **Project IDs are unique within a tenant** — UUID guarantees global uniqueness anyway

4. **Foreign keys enforce the hierarchy** — `system.tenant_id` FK → `core.tenants.tenant_id`, `credential.system_id` FK → `core.system_registry.system_id`

5. **Cross-tenant access is blocked at the route level** — `get_current_user_with_tenant` dependency validates JWT tenant_id matches the resource's tenant_id

6. **Super Admin bypasses tenant isolation** — `tenant_id=NULL` roles grant system-wide access, gated by `require_admin`

---

## 3. FRONTEND ROUTE MAP (Tenant Lifecycle)

Based on existing `AppRoutes.tsx`:

| Route | Lifecycle Stage | Current Status |

|-------|----------------|----------------|

| `/login` | Stage 1 — Auth | ✅ EXISTS |

| `/session-expired` | Stage 1 — Auth | ✅ EXISTS |

| `/dashboard` | Stage 2+ — Landing | ✅ EXISTS |

| `/administration/tenants` | Stage 1 — Tenant Mgmt | ✅ EXISTS (placeholder) |

| `/administration/users` | Stage 3 — User Mgmt | ✅ EXISTS |

| `/administration/roles` | Stage 3 — Role Mgmt | ✅ EXISTS |

| `/migration/projects` | Stage 4 — Project | ✅ EXISTS |

| `/migration/connections` | Stage 5 — Systems | ✅ EXISTS |

| `/migration/connections/diagnostics` | Stage 5 — Credentials | ✅ EXISTS |

| `/migration/discovery` | Stage 6 — Discovery | ✅ EXISTS |

| `/migration/mappings` | Stage 7 — Mapping | ✅ EXISTS |

| `/validation` | Stage 8 — Validation | ✅ EXISTS |

| `/validation/results` | Stage 8 — Results | ✅ EXISTS |

| `/reports` | Stage 9 — Reports | ✅ EXISTS |

| `/governance` | Stage 10 — Governance | ✅ EXISTS |

| `/profile` | Stage 3 — User Profile | ✅ EXISTS |

| `/settings` | Stage 3 — User Settings | ✅ EXISTS |

| ❌ `/billing/portal` | Stage 2+11 | NOT EXISTS |

| ❌ `/billing/checkout` | Stage 2 | NOT EXISTS |

| ❌ `/billing/subscription` | Stage 11 | NOT EXISTS |

| ❌ `/billing/invoices` | Stage 11 | NOT EXISTS |

| ❌ `/subscription/plans` | Stage 2 | NOT EXISTS |

| ❌ `/onboarding/welcome` | Stage 1 | NOT EXISTS |

| ❌ `/onboarding/setup` | Stage 3 | NOT EXISTS |

---

## 4. GAPS IDENTIFIED — What OC-COM-001c Should Address

| Gap | Priority | Description |

|-----|----------|-------------|

| Tenant suspension/offboarding | **HIGH** | No `core.tenants.status = SUSPENDED` handling. No data retention/deletion logic. No offboarding flow. |

| Subscription management UI | **HIGH** | No frontend pages for viewing plans, subscription status, trial countdown. Routes exist but no pages. |

| Welcome / onboarding flow | **MEDIUM** | First-login has no guided setup wizard. User lands on empty dashboard with no direction on next steps. |

| Usage metering | **MEDIUM** | No tracking of tenant usage against plan limits (systems connected, users created, projects started). |

| System ownership | **HIGH** | Currently systems exist at tenant-level. Need audit of whether system belongs to project or tenant. |

---

## 5. EXISTING ASSETS (Already Documented Elsewhere)

These are already covered by other work packages and should NOT be re-created by OC-COM-001c:

| Asset | Location |

|-------|----------|

| `platform.plans` table + 3 seed tiers | OC-COM-001a migration |

| `platform.subscriptions` table | OC-COM-001a migration |

| `core.tenants` extended columns | OC-COM-001a migration |

| Tenant middleware | OC-COM-001a (`app/api/core/middleware/tenant_middleware.py`) |

| Tenant routes (POST/GET/PUT) | OC-COM-001a (`app/api/routes/tenant_routes.py`) |

| Tenant service + repository | OC-COM-001a |

| Stripe config + service + routes | OC-COM-001b |

| Entitlement middleware | OC-COM-001b (`app/middleware/entitlement_middleware.py`) |

| Stripe columns on `core.tenants` | OC-COM-001b migration |

| Cookie-based auth + lockout + policy | OC-SEC-005 |

| RBAC (require_admin, require_role, require_permissions) | OC-SEC-006B + bug fix |

| Multi-tenant isolation (63 tests) | OC-SEC-006A through 006D |

| Final isolation model | OC-SEC-006_Final_Isolation_Model.md |

| System repository tenant enforcement | OC-COM-001a (reverted to optional for admin view-all) |

---

## 6. STATUS

**PROPOSAL — Ready for review.**

No code changes accompany this document. It answers "from first visit to paying customer to running their first migration, exactly what does a MAP customer experience and what database entities/assets are created at each stage?"

The definitive entity hierarchy is defined above in Section 2: Subscription → Tenant → Project → System → Connection/Credential → Dataset → Mapping → Validation Run → Report, with clear tenant-level vs project-level boundaries.

**Key Changes from Previous Version:**

1. **System ownership is now HIGH priority** (was LOW) — explicitly defined as tenant-level vs project-level

2. **Subscription-based checkout** — no shopping cart, only subscription checkout

3. **Subscription vs Billing vs Usage vs Entitlements** — clearly defined as separate UI concepts

4. **Onboarding journey** — explicitly defined with step-by-step process

5. **Workspace architecture** — clear distinction between user/tenant/project/system levels

6. **Asset lifecycle states** — defined with trial → active → suspended → purge

7. **Plan enforcement** — entitlements + usage + limits + feature gating

---

## 7. FRONTEND ROUTE MAP (Tenant Lifecycle)

Based on existing `AppRoutes.tsx`:

| Route | Lifecycle Stage | Current Status |

|-------|----------------|----------------|

| `/login` | Stage 1 — Auth | ✅ EXISTS |

| `/session-expired` | Stage 1 — Auth | ✅ EXISTS |

| `/dashboard` | Stage 2+ — Landing | ✅ EXISTS |

| `/administration/tenants` | Stage 1 — Tenant Mgmt | ✅ EXISTS (placeholder) |

| `/administration/users` | Stage 3 — User Mgmt | ✅ EXISTS |

| `/administration/roles` | Stage 3 — Role Mgmt | ✅ EXISTS |

| `/migration/projects` | Stage 4 — Project | ✅ EXISTS |

| `/migration/connections` | Stage 5 — Systems | ✅ EXISTS |

| `/migration/connections/diagnostics` | Stage 5 — Credentials | ✅ EXISTS |

| `/migration/discovery` | Stage 6 — Discovery | ✅ EXISTS |

| `/migration/mappings` | Stage 7 — Mapping | ✅ EXISTS |

| `/validation` | Stage 8 — Validation | ✅ EXISTS |

| `/validation/results` | Stage 8 — Results | ✅ EXISTS |

| `/reports` | Stage 9 — Reports | ✅ EXISTS |

| `/governance` | Stage 10 — Governance | ✅ EXISTS |

| `/profile` | Stage 3 — User Profile | ✅ EXISTS |

| `/settings` | Stage 3 — User Settings | ✅ EXISTS |

| ❌ `/billing/portal` | Stage 2+11 | NOT EXISTS |

| ❌ `/billing/checkout` | Stage 2 | NOT EXISTS |

| ❌ `/billing/subscription` | Stage 11 | NOT EXISTS |

| ❌ `/billing/invoices` | Stage 11 | NOT EXISTS |

| ❌ `/subscription/plans` | Stage 2 | NOT EXISTS |

| ❌ `/onboarding/welcome` | Stage 1 | NOT EXISTS |

| ❌ `/onboarding/setup` | Stage 3 | NOT EXISTS |

---

## 8. GAPS IDENTIFIED — What OC-COM-001c Should Address

| Gap | Priority | Description |

|-----|----------|-------------|

| Tenant suspension/offboarding | **HIGH** | No `core.tenants.status = SUSPENDED` handling. No data retention/deletion logic. No offboarding flow. |

| Subscription management UI | **HIGH** | No frontend pages for viewing plans, subscription status, trial countdown. Routes exist but no pages. |

| Welcome / onboarding flow | **MEDIUM** | First-login has no guided setup wizard. User lands on empty dashboard with no direction on next steps. |

| Usage needs to be first-class | **MEDIUM** | No tracking of tenant usage against plan limits (systems connected, users created, projects started). |

| System ownership hierarchy | **HIGH** | Currently systems exist at tenant-level, not project-level. Need audit of whether system belongs to project or tenant. |

| Dataset needs explicit placement | **MEDIUM** | Dataset discovery is the bridge between connection and mapping. |

---

## 8. STATUS

**PROPOSAL — Ready for review.**

No code changes accompany this document. It answers "from first visit to paying customer to running their first migration, exactly what does a MAP customer experience and what database entities/assets are created at each stage?"

The definitive entity hierarchy is defined above in Section 2: Subscription → Tenant → Project → System → Connection/Credential → Dataset → Mapping → Validation Run → Report, with clear tenant-level vs project-level boundaries.

**Key Decisions to Resolve Before Implementation:**

1. **System ownership**: Resolve whether systems belong to tenant or project level (HIGH priority)

2. **Onboarding journey**: Define the step-by-step user experience from signup to first migration

3. **Subscription vs Billing vs Usage vs Entitlements**: Explicitly define these as separate UI concepts

4. **Plan enforcement**: Define how limits are tracked and enforced (e.g., "18/20 users" → "⚠ Approaching plan limit")

5. **Offboarding lifecycle**: Define suspension, retention, and purge states

6. **First-login onboarding**: Define the welcome flow and first project creation process

Once these decisions are resolved, OC-COM-001d should implement the frontend/customer experience based on this specification.

**Next Move**: Please review this updated document and confirm if it meets your requirements. If approved, I will proceed to create OC-COM-001d (frontend/customer-experience implementation).