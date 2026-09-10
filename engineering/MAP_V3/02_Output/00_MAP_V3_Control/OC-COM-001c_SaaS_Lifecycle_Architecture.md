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

| Systems | `core.system_registry` | Project-scoped (`project_id`) — DECISION: Project-level |

| Credentials | `core.system_credentials` | System-scoped (`system_id`, Project by ancestry → Tenant) |

**Architectural decision (binding for 001d):** System = Project-level. Credential = System-level. Tenant isolation inherited via credential → system → project → tenant. Current implementation is tenant-scoped and must be migrated to `project_id` FK; 001d must assume Project-owned Systems (affects navigation, project selector, connection screens, discovery workflow, API calls, DB relationships).

**Current status:** ✅ EXISTS (pre-MAP_V3 + OC-SEC-006A) — implementation migration to Project-level pending

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

| Discovery Runs (execution — "what did this scan find?") | `core.discovery_*` | Project-scoped execution, linked to Project/System |

| Datasets — first-class Project inventory ("what datasets exist?") | `core.discovered_tables` (+ columns/dependencies) | Project-scoped (via project_id) |

**Architectural decision:** Discovery execution is distinct from Dataset inventory. Runs provide historical evidence; Datasets (+ Dataset Columns) are the current usable Project inventory feeding Mapping → Validation.

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

- Subscription status: `active` → `cancelled` (at period end). Tenant has ONE current subscription; changes recorded as subscription history/events (Stripe internals may create/replace — implementation detail, not domain model)

- Invoice records from Stripe (Billing lifecycle separate from Tenant access status)

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

- `core.tenants.status` = `SUSPENDED` (not deleted — data preserved). Distinct from `subscription.status`: suspension reasons = cancellation / payment failure / administrative / policy-security

- `platform.users.status` = `inactive` (users cannot log in) — user status distinct from tenant and subscription status

- Retention/purge state distinct: after retention period CASCADE delete of all tenant-scoped data

**Lifecycles (distinct):** Subscription (`TRIALING→ACTIVE→PAST_DUE→CANCELLED→EXPIRED`) vs Tenant access (`ACTIVE→SUSPENDED→OFFBOARDING→PURGED`) vs Billing (Stripe customer/invoices/period) vs Users/retention.

**Current status:** ❌ NOT IMPLEMENTED — no suspension/offboarding logic exists

---

## 2. ENTITY HIERARCHY — DEFINITIVE BOUNDARY MODEL

### The Hierarchy

```
PLATFORM
│
├── Plans (global) + System-wide Roles + Super Admin (explicit system context)
│
└── TENANT (core.tenants)
    │
    ├── Subscription (platform.subscriptions) — Tenant billing lifecycle
    ├── Billing / Invoices (Stripe) — Tenant payment relationship
    ├── Entitlements (via Plan) + Usage (tenant metering) — Tenant
    ├── Users (platform.users) — tenant-level
    ├── Roles (platform.roles) — tenant-level
    ├── Feature Flags (per-tenant) — tenant-level
    ├── Workflows / Approvals / Audit — tenant-level
    │
    └── PROJECT (core.projects) — tenant-level
         │
         ├── Systems (core.system_registry) — Project-level
         │    └── Credentials (core.system_credentials) — System-level
         │
         ├── Discovery Runs (core.discovery_*) — Project/System execution
         │
         ├── Datasets (core.discovered_tables) — Project-level
         │    └── Dataset Columns — Dataset-level
         │
         ├── Mappings (engine.mapping_rules) — project-level
         │    └── Mapping Versions — project-level
         │
         ├── Validation Runs (engine.validation_runs) — project-level
         │    └── Validation Results — run-level
         │         └── Defects — result-level
         │
         └── Generated Reports — project-level (Report Suites/Templates = tenant-level)
```

**Decision:** Tenant owns Subscription (not Subscription contains Tenant). System = Project-level. Dataset = first-class Project-level. Discovery Runs ≠ Dataset inventory.

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

| Credential | **System** (Project by ancestry: credential → system → project → tenant) | Stored per-system. Tenant isolation inherited via full chain. |

| Discovery Run | **Project/System** (execution) | Historical scan evidence. Re-discovery creates new runs; does not overwrite inventory. |

| Dataset | **Project** (first-class) | Current usable inventory (`core.discovered_tables`). Feeds Mapping → Validation. |

| Dataset Column | **Dataset** (Project by ancestry) | Columns/dependencies of a Dataset. |

| Mapping | **Project** | Mappings are project-specific. Source→Target relationships are project-scoped. |

| Validation Run | **Project** | A run executes against a specific project's data. |

| Validation Result | **Run** (project by ancestry) | Results are child of a run, scoped to the project through run ancestry. |

| Defect | **Result** (project by ancestry) | Same chain of scoping. |

| Report Template / Suite | **Tenant** | Executive dashboards, tenant KPIs, usage/billing reports. |

| Generated Report | **Project** | Validation / Migration / Defect / Mapping-coverage / Evidence packs. |

| Workflow/Approval | **Tenant** (Approval may be Tenant or Project per workflow) | Governance workflows span projects within a tenant. |

| Audit Record | **Tenant** (tenant actions) / **System** (Super Admin system context) | Tenant actions per-tenant; Super Admin actions system-wide under explicit authorisation. OC-SEC-006 remains authoritative. |

| Billing / Invoice | **Tenant** | One billing relationship per tenant. Distinct from Subscription lifecycle and Tenant access status. |

| Entitlements | **Tenant** (via Plan) | "What am I allowed?" Checked via entitlement middleware. |

| Usage | **Tenant** (first-class) | "How much consumed vs limit?" Measured separately, not inferred from Subscription. |

### Key Design Rules

1. **Authoritative tenant context derives from authenticated session/JWT only.** Server derives `tenant_id`; client-supplied `?tenant_id=` or `X-Tenant-ID` MUST NEVER establish tenancy (internal/admin tooling only if explicitly designed).

2. **A tenant_id can NEVER be overwritten by user-supplied data** — the JWT/session tenant_id is authoritative

3. **Project IDs are unique within a tenant** — UUID guarantees global uniqueness anyway

4. **Foreign keys enforce the hierarchy** — `project.tenant_id` → `core.tenants.tenant_id`, `system.project_id` → `core.projects.project_id`, `credential.system_id` → `core.system_registry.system_id`. Auth chain: credential → system → project → tenant

5. **Cross-tenant access is blocked at the route level** — `get_current_user_with_tenant` dependency validates JWT tenant_id matches the resource's tenant_id via project ancestry. OC-SEC-006 remains authoritative

6. **Super Admin = explicitly authorised system-wide context** (`tenant_id=NULL`), gated by `require_admin` — not "isolation disabled". May operate across tenants only where explicitly authorised

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

| Tenant suspension/offboarding | **HIGH** | No `core.tenants.status = SUSPENDED` handling. Must define Tenant vs Subscription vs User vs retention/purge states; reasons: cancellation / payment failure / admin / policy-security. |

| Subscription management UI | **HIGH** | No frontend pages for viewing plans, subscription status, trial countdown. Routes exist but no pages. Must keep Subscription ("what plan?") vs Billing ("how paying?": Stripe customer/method/invoices/period) vs Entitlements ("allowed?") vs Usage ("consumed/limit?") separate. |

| Welcome / onboarding flow | **MEDIUM** | First-login has no guided wizard. 001d backbone: Welcome → Create project → Connect source → Connect target → Run discovery → Review datasets → Mappings → Validation → Results → Report. |

| Usage metering | **MEDIUM** | No tracking against plan limits. Usage = first-class tenant capability (Entitlement vs Usage vs Limit; e.g. Users/Projects/Systems/Runs/Storage); warnings at 80%, block at 100%. |

| System ownership | **HIGH** | DECIDED: Project-level. Current implementation tenant-scoped — migrate `core.system_registry` to `project_id` FK. 001d assumes Project-owned Systems. |

| Dataset ownership | **HIGH** | DECIDED: first-class Project-level (`core.discovered_tables` + columns). Discovery Runs ≠ inventory. |

| Billing UI contract | **MEDIUM** | Routes identified but UX/API contract undefined — define Subscription UI vs Billing UI + existing 001b endpoints before 001d. |

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

## 6. STATUS — FINAL

**STATUS:** AMENDED per review — ready for approval (no code changes).

**Canonical route map:** Section 3 (single copy; former duplicate Section 7 removed).
**Canonical gaps:** Section 4 (single copy; former duplicate Section 8 removed).

The definitive hierarchy is Section 2: PLATFORM → TENANT (Subscription, Billing, Entitlements, Usage, Users, Roles, Audit) → PROJECT (Systems → Credentials, Discovery Runs, Datasets → Columns, Mappings, Validation Runs → Results → Defects, Generated Reports).

**Amendments applied (binding for 001d):**

1. System ownership → Project-level (`system.project_id` → `core.projects`; chain credential → system → project → tenant). Current tenant-scoped implementation must be migrated; 001d assumes Project-owned Systems (navigation, project selector, connections, discovery, APIs, DB).

2. Dataset → first-class Project-level (`core.discovered_tables` + columns). Discovery Runs (execution evidence) ≠ Dataset inventory (current usable state).

3. Subscription (billing: TRIALING → ACTIVE → PAST_DUE → CANCELLED → EXPIRED) vs Tenant access (ACTIVE → SUSPENDED → OFFBOARDING → PURGED; reasons: cancellation / payment failure / admin / policy-security) vs Billing (Stripe customer / method / invoices / period) vs Users / retention — four distinct states. One current Subscription per Tenant + history/events.

4. Usage → first-class tenant capability (Entitlement = allowed? / Usage = consumed? / Limit = cap?; warn 80%, block 100%).

5. Tenant identity: authoritative `tenant_id` derives from authenticated session/JWT only; client-supplied `?tenant_id` / `X-Tenant-ID` MUST NEVER establish tenancy.

6. Super Admin = explicitly authorised system-wide context (`tenant_id=NULL`, `require_admin`); OC-SEC-006 isolation model remains authoritative.

7. Onboarding backbone for 001d: Welcome → Create project → Connect source → Connect target → Run discovery → Review datasets → Mappings → Validation → Results → Report.

8. Report Templates/Suites = Tenant-level; Generated Reports = Project-level.

**OC-COM-001d implementation principle:** 001d consumes and orchestrates existing backend/security (001a/b, 005, 006, migration engine); it MUST NOT recreate or replace them. Any required schema change (e.g. `system.project_id`) is raised explicitly as a deviation, not done opportunistically.

**Next Move:** Please approve this revised OC-COM-001c as the architectural baseline for OC-COM-001d.


