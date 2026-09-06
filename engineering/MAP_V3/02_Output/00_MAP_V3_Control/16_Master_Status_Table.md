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
| OC-SEC-001 | P0 | Website Security Assessment | REVISED | 2026-09-06: Revised per APPROVED WITH CHANGES — CSP refined (Tailwind/Chart.js/Fonts audited), rate-limit 10/min, work_email_hash drop, Azure hostname redirect, robots.txt→SEO, OC-SEC-003 (privacy) + OC-SEC-004 (SPF/DKIM/DMARC) proposed, rollback tested=NO | PENDING (revised proposal) | — | — |
| OC-SEC-002 | P0 | Product Security Assessment | REPORT | 2026-09-06: 6 findings (POST /leads no rate limit, JWT localStorage, no WAF, 6 npm vulns) | PENDING | — | — |
| OC-COM-001 | P1 | Subscription, Charges & Tenant Assessment | SPLIT | 2026-09-06: 16 files, 9 gaps — split into 001a (model) + 001b (billing) | SPLIT | — | — |
| OC-COM-001a | P1 | Tenant Model, Subscription, Plans & Middleware | REPORT | 2026-09-06: 8 changes — align tenant_id UUID, create plans+subscriptions tables, tenant middleware, tenant routes, enforce tenant_id required | PENDING | — | — |
| OC-COM-001b | P1 | Stripe, Billing & Entitlements | REPORT | 2026-009-006: 8 changes — Stripe service, billing routes, entitlement middleware, subscription UI, Stripe columns | PENDING (blocked on 001a) | — | — |
| OC-PROD-001 | P1 | Pre-Migration Validation & Assurance Product Assessment | REPORT | 2026-09-06: 7 modules fully implemented, 10 controls, DAG engine, AI matching, 80+ endpoints, 8-section Board Pack. Gaps: C07-C010 registration, no tier gating, no comparison report. | PENDING | — | — |
| OC-GOV-001 | P1 | Policy vs Implementation Gap Audit | NOT STARTED | — | — | — | — |
| OC-CLOUD-001 | P1 | Secure Cloud Architecture & Environment Assessment | NOT STARTED | — | — | — | — |
| OC-DEMO-001 | P1/P2 | Customer Demo Security Assessment | NOT STARTED | — | — | — | — |
| OC-READY-001 | P2 | Additional Commercial / Operational Readiness Gap Assessment | NOT STARTED | — | — | — | — |

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
* **OC-SEC-001:** Report 2026-09-06, `Website_Prepared` + `lead_routes.py` + `frontend-mvp` 209 `.tsx` inspected. Findings: no CSP/X-Frame-Options, no rate limit on `/leads`, plain email hash, no `robots.txt`, no WAF Free SKU.
* **OC-SEC-002:** Report 2026-09-06, `jwt_config` + `rbac` + `tenant_middleware` + `core.leads` + Snowflake JWT inspected. Findings: High POST /leads no rate limit, Medium JWT localStorage, Medium no WAF, 6 npm vulns.
* **OC-COM-001:** Report 2026-09-06, 16 files inspected. Findings: core.tenants VARCHAR(100) vs platform UUID mismatch, no subscriptions/plans tables, no tenant middleware, no billing, no entitlements. Split into 001a + 001b.
* **OC-COM-001a:** Report 2026-09-06, 8 proposed changes — align tenant_id UUID, create `platform.plans` (3 tiers seeded), `platform.subscriptions`, tenant middleware, tenant routes, enforce tenant_id required on repositories.
* **OC-COM-001b:** Report 2026-09-06, 8 proposed changes — Stripe service (checkout, portal, webhooks), billing routes, entitlement middleware, SubscriptionPage + BillingPage frontend, Stripe columns on core.tenants. Blocked on 001a.
* **OC-PROD-001:** Report 2026-09-06, 40+ files inspected. 7 modules fully implemented: Engine Controls (C01-C010), Discovery, Mapping, Validation, Execution (1201-line DAG engine), Governance, Reporting (919-line Board Pack). 80+ API endpoints, 7 database adapters, 33+ architecture docs. Gaps: C07-C010 registration, apply-fix SQL-only, no tier gating (blocked on 001a).

---

## Status

**Current Overall:** `OC-GIT-001` through `OC-CTRL-001` and `MAP_V2_FINAL_BASELINE` are **COMPLETE** — Stage 0 Baseline Protection is complete. `OC-SEC-001`, `OC-SEC-002`, `OC-COM-001a`, `OC-COM-001b`, `OC-PROD-001` are **REPORT** stage — awaiting CHATGPT REVIEW → APPROVAL. OC-PROD-001 confirms product is production-ready; commercial launch blocked on OC-COM-001a (subscription) + OC-SEC-001/002 (security).

