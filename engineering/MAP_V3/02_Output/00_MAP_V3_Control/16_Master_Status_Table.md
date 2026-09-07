# 16. Master Status Table — MAP_V3
**Source:** Section 16 of MAP_V3 Control Document | **Location:** `engineering/MAP_V3/02_output/00_MAP_V3_Control/` | **MAP_V2 Preserved:** `engineering/MAP_V2` untouched
**Version:** MAP_V3 | **Date:** 2026-09-05

> This table is the single source of truth for MAP_V3 work package status. OpenCode must update it when a work package changes status, is approved/rejected, or is completed.

---

| ID | Priority | Work Package | Status | OpenCode Report | ChatGPT Decision | Implementation | Validation |
|---|---|---|---|---|---|---|---|
| OC-GIT-001 | P0 | Review Git release process | COMPLETE | 2026-09-05: Investigated v5_05/v5_06/v5_07, recommended v5.08 | APPROVED (proceed with v5.08 + MAP_V2 alias) | N/A (report only) | Verified |
| OC-GIT-002 | P0 | Publish MAP_V2 baseline | COMPLETE | Committed 11 files (8 docs+3 dumps) as b01b7f12, pushed | APPROVED | b01b7f12 | Pushed to origin |
| OC-GIT-003 | P0 | Mark MAP_V2 final baseline | COMPLETE | Recommended MAP_V2_FINAL (dual tag v5.08+MAP_V2) | APPROVED (proceed with v5.08 and MAP_V2 alias) | Tags v5.08, MAP_V2 on d5f42b86, pushed | Verified |
| OC-GIT-004 | P0 | Create MAP_V3 | COMPLETE | Copied engineering/MAP_V2 → engineering/MAP_V3, preserved MAP_V2, tested vite build | APPROVED (local only) | feature/MAP_V3 7c4a3e1d, engineering/MAP_V3 (1212 files) | vite build ✓ |
| OC-CTRL-001 | P0 | Determine TODO_LIST location | COMPLETE | Recommended engineering/MAP_V3/02_output/00_MAP_V3_Control/ (folder with MAP_V3_TODO_LIST.md) | APPROVED (proceed, preserve MAP_V2) | Created 00_MAP_V3_Control/ with MAP_V3_TODO_LIST.md + 00_Non_Negotiable_OpenCode_Rules.md | Verified — MAP_V2 untouched |
| OC-GIT-003-FINAL | P0 | Mark MAP_V2 as Final Baseline (MAP_V2_FINAL_BASELINE) | COMPLETE | Recommended MAP_V2_FINAL_BASELINE on d5f42b86 | APPROVED | Tag MAP_V2_FINAL_BASELINE on d5f42b86, pushed | Verified |
| OC-SEC-001 | P0 | Website Security Assessment | IMPLEMENTED | 2026-09-06: Revised implementation proposal — 10 items, P0/P1/P2, 13 files, test plan, rollback plan, deferred items, 4 architectural decisions | APPROVED | 4 commits: `4a0803e4` (auth), `3dbb7973` (hardening), `28339d72` (rate limit) | 19+6 tests pass |
| OC-SEC-002 | P0 | Product Security Assessment | REVISED REPORT | 2026-09-07: Revised — 3/6 findings remediated by OC-SEC-001 (rate limit, work_email_hash, CSP). WAF reclassified as cloud/production. Created OC-SEC-005/006/007. | PENDING (awaiting approval of OC-SEC-005/006/007) | — | — |
| OC-SEC-003 | P0 | Privacy & Data Collection Assessment | ASSESSMENT | 2026-09-06: 13 gaps — no Privacy Policy, no lawful basis, no consent, no retention, no deletion, no SAR, GET /leads unauthenticated | PENDING | — | — |
| OC-SEC-004 | P0 | Domain & Email Security Assessment | ASSESSMENT | 2026-09-06: No SPF/DKIM/DMARC, Porkbun forwarding breaks SPF, no email sending configured, DMARC monitor recommended | PENDING | — | — |
| OC-COM-001 | P1 | Subscription, Charges & Tenant Assessment | SPLIT | 2026-09-06: 16 files, 9 gaps — split into 001a (model) + 001b (billing) | SPLIT | — | — |
| OC-COM-001a | P1 | Tenant Model, Subscription, Plans & Middleware | REPORT | 2026-09-06: 8 changes — align tenant_id UUID, create plans+subscriptions tables, tenant middleware, tenant routes, enforce tenant_id required | PENDING | — | — |
| OC-COM-001b | P1 | Stripe, Billing & Entitlements | REPORT | 2026-009-006: 8 changes — Stripe service, billing routes, entitlement middleware, subscription UI, Stripe columns | PENDING (blocked on 001a) | — | — |
| OC-PROD-001 | P1 | Pre-Migration Validation & Assurance Product Assessment | REPORT | 2026-09-06: 7 modules fully implemented, 10 controls, DAG engine, AI matching, 80+ endpoints, 8-section Board Pack. Gaps: C07-C010 registration, no tier gating, no comparison report. | PENDING | — | — |
| OC-GOV-001 | P1 | Policy vs Implementation Gap Audit | NOT STARTED | — | — | — | — |
| OC-CLOUD-001 | P1 | Secure Cloud Architecture & Environment Assessment | NOT STARTED | — | — | — | — |
| OC-DEMO-001 | P1/P2 | Customer Demo Security Assessment | NOT STARTED | — | — | — | — |
| OC-READY-001 | P2 | Additional Commercial / Operational Readiness Gap Assessment | NOT STARTED | — | — | — | — |
| OC-SEC-005 | P1 | Authentication & Session Architecture | NOT STARTED | 2026-09-07: Created from OC-SEC-002 — httpOnly cookies, account lockout, encryption key rotation, session audit, token refresh | PENDING (awaiting approval) | — | — |
| OC-SEC-006 | P1 | Multi-Tenant Isolation Deep Audit | STAGED IMPLEMENTATION | 2026-09-07: 34 routes inspected. 27+ routes use get_current_user with NO tenant enforcement. Staged: 006A (credentials), 006B (users/RBAC), 006C (operational), 006D (edge cases). | APPROVED | 006A: `5040e0a8` (20 tests). 006B: user/role/rbac (19 tests). 006C: operational routes (13 tests) | 006A+006B+006C: 52/52 tests pass |
| OC-SEC-007 | P1 | Dependency & Supply-Chain Security | NOT STARTED | 2026-09-07: Created from OC-SEC-002 — npm audit fix, SAST/DAST pipeline, dependency pinning, SBOM | PENDING (awaiting approval) | — | — |

---

## Approval States (Per Section 18)

* **APPROVED** — Proceed with the proposed implementation.
* **APPROVED WITH CHANGES** — Proceed only after incorporating the specified changes.
* **REJECTED** — Do not implement the proposal.
* **MORE INFORMATION REQUIRED** — Continue investigation; no implementation yet.
* **DEFERRED** — The work package is valid but intentionally postponed because of priority/dependency.

---

## Document Maintenance

This table is living. OpenCode must update it when:
* A work package changes status
* A decision is approved/rejected
* A material implementation is completed
* A new dependency is identified
* A policy/implementation gap is resolved
* A new work package is approved
* MAP_V3 architecture materially changes

Do not remove completed tasks. Completed tasks retain Status, Decision, Commit/reference, Evidence, Completion date, Relevant notes. This preserves the MAP_V3 audit trail. MAP_V2 remains recoverable at MAP_V2_FINAL_BASELINE (d5f42b86).

---

## Evidence

* **OC-GIT-001:** Report produced 2026-09-05, `release/v5_07` inspected, `v5.08` recommended.
* **OC-GIT-002:** Commit `b01b7f12`, `release/MAP_V2_baseline` 11 files, pushed.
* **OC-GIT-003:** Tags `v5.08`/`MAP_V2` on `d5f42b86`, pushed.
* **OC-GIT-004:** Branch `feature/MAP_V3` `7c4a3e1d`, `engineering/MAP_V3` 1212 files, `npm install` + `vite build` verified.
* **OC-CTRL-001:** Folder `00_MAP_V3_Control` with 2 files, `MAP_V2` untouched (`git diff` empty).
* **OC-GIT-003-FINAL:** Tag `MAP_V2_FINAL_BASELINE` on `d5f42b86`, pushed.
* **OC-SEC-001:** Report 2026-09-06, implemented 2026-09-07. 4 commits: `4a0803e4` (auth GET /leads), `3dbb7973` (Tailwind self-host, CSP report-only, security headers, robots.txt, work_email_hash removal), `28339d72` (POST /leads rate limiting 10/min). 19+6 tests pass.
* **OC-SEC-002:** Report 2026-09-06, revised 2026-09-07. 3/6 findings remediated by OC-SEC-001 (rate limit, work_email_hash, CSP). WAF reclassified as cloud/production. Created OC-SEC-005/006/007.
* **OC-SEC-005:** Created 2026-09-07 from OC-SEC-002 — Authentication & Session Architecture (httpOnly cookies, lockout, key rotation, session audit).
* **OC-SEC-006:** Created 2026-09-07 from OC-SEC-002 — Multi-Tenant Isolation Deep Audit (object-level access, cross-tenant testing). 006A COMPLETE: credential cross-tenant isolation (`5040e0a8`, 20 tests). 006B COMPLETE: user/RBAC cross-tenant isolation (19 tests). 006C COMPLETE: operational routes (13 tests — 9 unauthenticated mapping routes fixed, 33 routes total). 006D NOT STARTED.
* **OC-SEC-007:** Created 2026-09-07 from OC-SEC-002 — Dependency & Supply-Chain Security (npm audit, SAST/DAST, SBOM).
* **OC-COM-001:** Report 2026-09-06, 16 files inspected. Findings: core.tenants VARCHAR(100) vs platform UUID mismatch, no subscriptions/plans tables, no tenant middleware, no billing, no entitlements. Split into 001a + 001b.
* **OC-COM-001a:** Report 2026-09-06, 8 proposed changes — align tenant_id UUID, create `platform.plans` (3 tiers seeded), `platform.subscriptions`, tenant middleware, tenant routes, enforce tenant_id required on repositories.
* **OC-COM-001b:** Report 2026-09-06, 8 proposed changes — Stripe service (checkout, portal, webhooks), billing routes, entitlement middleware, SubscriptionPage + BillingPage frontend, Stripe columns on core.tenants. Blocked on 001a.
* **OC-PROD-001:** Report 2026-09-06, 40+ files inspected. 7 modules fully implemented: Engine Controls (C01-C010), Discovery, Mapping, Validation, Execution (1201-line DAG engine), Governance, Reporting (919-line Board Pack). 80+ API endpoints, 7 database adapters, 33+ architecture docs. Gaps: C07-C010 registration, apply-fix SQL-only, no tier gating (blocked on 001a).

---

## Status

**Current Overall:** `OC-GIT-001` through `OC-CTRL-001` and `MAP_V2_FINAL_BASELINE` are **COMPLETE** — Stage 0 Baseline Protection is complete. `OC-SEC-001` is **IMPLEMENTED** (4 commits, 25 tests). `OC-SEC-002` is **REVISED REPORT** — 3/6 findings remediated, awaiting approval of OC-SEC-005/007. `OC-SEC-003`, `OC-SEC-004` are **ASSESSMENT** stage. `OC-COM-001a`, `OC-COM-001b`, `OC-PROD-001` are **REPORT** stage. `OC-SEC-005`, `OC-SEC-007` are **NOT STARTED** — awaiting approval. `OC-SEC-006` is **STAGED IMPLEMENTATION** — 006A COMPLETE (20 tests), 006B COMPLETE (19 tests), 006C COMPLETE (13 tests), 006D NOT STARTED.

