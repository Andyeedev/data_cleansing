We are now moving Report Studio into its final controlled implementation stages.

The current implementation has been running for a long time, so this instruction is deliberately strict:

**Do not enter another open-ended development/debugging loop.**

We need to reconcile the remaining approved phases, implement only the agreed gaps, verify them, and produce a final handover.

---

# 1. PHASE RECONCILIATION

First, reconcile the current implementation against the original approved OC-REPORT-001 roadmap.

I believe we still have:

* Phase 4 — Hardening, audit, limits, retention/security/runtime controls
* Phase 5 — next approved Report Studio capability stage / V2 work

Do NOT assume the phase numbering from earlier working conversations.

Produce a short reconciliation showing:

| Approved Phase | Original scope | Current status | Remaining work |
| -------------- | -------------- | -------------- | -------------- |

Identify exactly what remains before implementation starts.

Do not expand the scope beyond the approved roadmap.

---------------------------------------------
## STATUS - ABOUT TO START
---------------------------------------------

# 2. SUPER ADMIN TENANT-SCOPED VISIBILITY DECISION

The current testing found:

Super Admin scoped to Tenant A:

* draft + private report → currently invisible
* published report → visible

The current `has_object_access` model has no Super Admin branch.

Implement **Option 2**:

> A Super Admin who has explicitly selected a tenant using the existing TenantScope/TenantContext must be able to see that tenant's reports, including drafts and private reports.

This is an **explicit tenant-scoped administrative view**, not a global cross-tenant bypass.

Rules:

1. No tenant selected → do not invent a tenant.
2. Explicit `tenant_id` scope → Super Admin may inspect that tenant's reports.
3. Super Admin must never obtain access to another tenant merely from possessing a report ID.
4. Cross-tenant report access must still return the existing appropriate not-found/denied behaviour.
5. Tenant Admin and all non-Super-Admin roles remain governed by existing object-access rules.
6. Do not weaken sharing, ownership or tenant isolation for normal users.
7. Do not create a second tenant-resolution mechanism.
8. Use the existing `TenantContext` / `resolve_tenant` / effective tenant patterns already established.

Add regression tests proving:

* SA + Tenant A scope → sees published, draft and private Tenant A reports
* SA + Tenant B scope → sees only Tenant B reports
* SA scoped to A cannot read B report by ID
* Tenant Admin behaviour unchanged
* Viewer behaviour unchanged
* owner behaviour unchanged

Document this explicitly as:

**Super Admin tenant oversight access is permitted only within an explicitly selected tenant scope.**

---------------------------------------------
## STATUS - COMPLETED
---------------------------------------------

# 3. PARENT / TENANT DROPDOWN

The new `TenantScopeSelect` is approved.

Keep:

* existing `setScopeTenant`
* existing TenantContext
* session persistence
* Super Admin only
* hidden for non-Super-Admins
* available even on the entitlement-denial screen

Do not create another tenant selector architecture.

Also verify the existing `/rules/tenants` issue.

You reported:

> `/rules/tenants` is require_admin-gated and therefore Tenant Admin can enumerate all 11 tenant names.

This is a pre-existing security concern.

Do NOT silently redesign it as part of Report Studio.

Instead:

* confirm whether Report Studio itself calls this endpoint
* confirm whether Tenant Admin can obtain tenant names through the Report Studio UI
* if Report Studio does not expose this data, leave it unchanged
* record it clearly as a pre-existing security item requiring separate remediation

Do not scope-creep into unrelated tenant directory work.

---

# 4. DELETE + RETENTION

The implemented behaviour is approved in principle:

### Delete

* header lifecycle action
* shared ConfirmDialog
* one user-facing delete action
* warning that sharing is removed
* accurate retention wording
* no duplicate delete control

Verify:

* owner delete
* authorised admin delete
* unauthorised delete
* cross-tenant delete
* confirmation cancel
* report disappears from normal views
* access records are no longer exposed

### Retention

Keep:

`REPORT_RETENTION_DAYS=30`
`REPORT_RETENTION_ENABLED=true`

Verify:

* recent soft-deletes are retained
* expired soft-deletes are hard-deleted
* cascaded definitions/access records are removed
* live/non-deleted reports remain untouched
* retention disabled means no purge
* purge is idempotent
* startup/daily execution cannot create duplicate workers

Do not change the retention period without approval.

---

# 5. ADMINISTRATION SUBMENU — SAME DESIGN LANGUAGE AS REPORT STUDIO

This is important.

The Administration area should NOT look like a separate application.

Apply the same approved Report Studio submenu/navigation treatment to the Administration section.

Use the same design language and Tailwind conventions already used in MAP Nexus.

Use these existing screens as the authoritative visual reference:

* Home → Dashboard
* Validation → Validation Centre
* Migration → Overview

The Administration submenu should use the same:

* page header treatment
* breadcrumb pattern
* persistent section navigation
* submenu/rail behaviour
* active-state treatment
* spacing
* typography
* cards
* buttons
* dropdowns
* tabs
* status pills
* responsive behaviour
* empty/loading/error states
* Tailwind utility conventions

Do NOT create another navigation architecture.

---

# 6. ADMINISTRATION SUBMENU CONTENT

Use the previously agreed Administration capability structure.

The submenu should reflect the same conceptual model already established for Report Studio.

At minimum reconcile these areas:

### Administration

**Overview**

* Mission Control

**Identity & Access**

* Users
* Roles
* Permissions
* Invitations

**Organisation**

* Tenant / Organisation settings
* Systems
* Connections where applicable

**Commercial**

* Subscription / Plan information
* Usage / Limits where applicable

**Platform / Security**

* Security
* Audit
* Maintenance

Only show items allowed by the existing:

Identity → Role → Permission → Entitlement → Tenant/Object Scope

model.

Do NOT create frontend-only permissions.

Do NOT introduce a new RBAC model.

Do NOT change backend permissions unless a genuine defect is discovered.

---

# 7. REPORT STUDIO SUBMENU

Ensure Report Studio uses the same visual/navigation conventions as Administration.

The intent is that a user moving between:

Administration → Report Studio → Validation → Migration

feels that they are still inside the same MAP Nexus application.

Do not duplicate components if existing shared components can be reused.

---

# 8. TAILWIND REVIEW

Perform a concrete review of the current Report Studio and Administration implementation against the existing MAP Nexus Tailwind patterns.

Check:

* container widths
* page padding
* vertical spacing
* heading hierarchy
* text sizes
* font weights
* button sizes
* button variants
* border radius
* borders
* shadows
* cards
* dropdowns
* tabs
* tables
* status badges
* colours
* hover/focus states
* responsive breakpoints
* dark/light behaviour if already supported
* loading states
* empty states
* error states

Do not introduce a new design system.

Do not rewrite working components merely for code style.

Where existing MAP Nexus components already establish the pattern, reuse them.

---

# 9. REPORT STUDIO FUNCTIONAL CHECK

Verify the complete current Report Studio journey:

Tenant scope
→ Saved Reports
→ All / Mine / Shared
→ New Report
→ Template Gallery
→ Blank Report
→ Report Assistant
→ Editor
→ Preview
→ Save
→ Version
→ Publish
→ Template update
→ Duplicate
→ Share
→ CSV
→ XLSX
→ Delete
→ Retention

Verify that the parent tenant selector correctly changes the entire data context.

---

# 10. 54 SAVED REPORTS

Explain the current report count before declaring completion.

Break the records down by:

* tenant
* owner
* report name
* template
* status
* visibility
* created date
* source/origin if available

Identify:

* legitimate reports
* template-generated reports
* test/demo data
* duplicates
* stale development records

Do NOT delete anything automatically.

Confirm:

* All
* Mine
* Shared

filters behave correctly within the selected tenant.

---

# 11. SECURITY REGRESSION

Prove all of the following:

### Tenant isolation

* Tenant A cannot access Tenant B report
* report ID enumeration does not bypass tenant scope
* export is tenant isolated
* query/preview is tenant isolated
* duplicate is tenant isolated
* delete is tenant isolated

### Super Admin

* SA can select tenant
* SA can see all reports within explicitly selected tenant
* SA cannot use tenant A scope to access tenant B
* switching tenant refreshes report data correctly

### Other roles

* Tenant Admin unchanged
* Migration Lead unchanged
* Data Analyst unchanged
* Team Member unchanged
* Viewer unchanged

### Entitlement

* report_studio entitlement enforced
* entitlement rechecked at runtime
* removing entitlement causes appropriate denial
* no frontend-only entitlement bypass

### Sharing

* share does not grant export capability
* recipient without reports:export receives 403
* recipient cannot edit unless explicitly permitted
* recipient cannot delete another user's report unless authorised

---

# 12. FINAL TESTING

Run the complete relevant evidence set:

* Phase 0
* Report Studio backend
* API verifier
* frontend unit
* browser E2E
* TypeScript
* production build

Also add the new Administration submenu tests and Super Admin scoped visibility tests.

If a test fails:

Classify it first:

A. genuine product defect
B. test defect
C. environment/stale server issue
D. pre-existing unrelated failure

Only fix A.

Maximum one controlled remediation cycle.

Do not keep iterating indefinitely.

---

# 13. NO UNAUTHORISED SCOPE

Do NOT implement:

* external AI/LLM
* scheduling unless explicitly confirmed as this phase's approved scope
* report distribution unless explicitly confirmed
* PDF
* arbitrary SQL
* cross-source joins
* scatter/matrix/pivot unless already approved for this phase
* new analytics engine
* new RBAC model
* new tenant model
* new navigation framework
* unrelated Administration refactoring

If Phase 5 requires any of these, stop and report the requirement rather than implementing it.

---

# 14. FINAL HANDOVER

When the work is complete, STOP.

Do not commit, push, merge or deploy.

Return one final evidence report containing:

1. Phase reconciliation
2. Phase 4 status
3. Phase 5 status
4. Implemented changes
5. Super Admin tenant-scope decision
6. Report Studio UI status
7. Administration UI/submenu status
8. Tailwind/MAP Nexus consistency status
9. 54-report analysis
10. Security results
11. Test results
12. Known pre-existing issues
13. Files changed
14. Git status
15. Anything genuinely blocking final acceptance

Use this final status:

**READY FOR FINAL REVIEW**

or

**READY WITH NON-BLOCKERS**

or

**BLOCKED**

Do not use "almost done", "mostly complete", or similar vague statuses.

The objective is to reach a controlled end state, not continue development indefinitely.
