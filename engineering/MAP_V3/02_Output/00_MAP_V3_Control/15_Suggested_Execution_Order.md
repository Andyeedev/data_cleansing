# 15. Suggested Execution Order — MAP_V3
**Source:** Section 15 of MAP_V3 Control Document | **Location:** `engineering/MAP_V3/02_output/00_MAP_V3_Control/` | **MAP_V2 Preserved:** `engineering/MAP_V2` untouched
**Version:** MAP_V3 | **Date:** 2026-09-05

> The exact sequence may change if a dependency is identified and approved.

---

## Stage 0 — Baseline Protection
* **OC-GIT-001** Review existing release process — `COMPLETE` (v5_05/v5_06/v5_07, recommended v5.08)
* **OC-GIT-002** Publish MAP_V2 baseline — `COMPLETE` (b01b7f12, 11 files, pushed)
* **OC-GIT-003** Mark final MAP_V2 baseline — `COMPLETE` (tags v5.08, MAP_V2, MAP_V2_FINAL_BASELINE on d5f42b86)
* **OC-GIT-004** Create MAP_V3 — `COMPLETE` (feature/MAP_V3, engineering/MAP_V3 copy, local only)
* **OC-CTRL-001** Determine TODO_LIST location — `COMPLETE` (00_MAP_V3_Control folder)

## Stage 1 — P0 Security
* **OC-SEC-001** Website Security Assessment — `NOT STARTED` — assessment, not remediation (DNS, HTTPS, headers, secrets, forms, etc.)
* **OC-SEC-002** Product Security Assessment — `NOT STARTED` — assessment (auth, RBAC, tenant isolation, API, secrets, etc.)

## Stage 2 — P1 Commercial / Product
* **OC-COM-001** Subscription, Charges & Tenant Assessment — `NOT STARTED` — Requirement → Policy → Implementation → Evidence → Status → Gap → Recommendation
* **OC-PROD-001** Pre-Migration Validation & Assurance Product Assessment — `NOT STARTED` — pre/post-migration product type, tenant, charging
* **OC-GOV-001** Policy vs Implementation Gap Audit — `NOT STARTED` — formal gap register

## Stage 3 — P1 Cloud
* **OC-CLOUD-001** Secure Cloud Architecture & Environment Assessment — `NOT STARTED` — DEV/TEST/PROD, Azure, Key Vault, CI/CD

## Stage 4 — Demo
* **OC-DEMO-001** Customer Demo Security Assessment — `NOT STARTED` — demo tenant isolation, expiry, etc. — `P1/P2`

## Stage 5 — Additional Readiness
* **OC-READY-001** Additional Commercial / Operational Readiness Gap Assessment — `NOT STARTED` — privacy, terms, onboarding, etc. — `P2`

---

## Dependency Notes
* `OC-SEC-001`/`OC-SEC-002` are P0 and should precede P1 commercial work.
* `OC-COM-001` is a dependency for `OC-PROD-001` (product type affects charging).
* `OC-GOV-001` depends on `OC-COM-001`/`OC-PROD-001` findings.
* `OC-CLOUD-001` can run in parallel with `OC-COM-001` after Stage 0.

---

## Status
This is a living execution order. OpenCode must update it when a work package changes status or a dependency is identified and approved. Do not remove completed tasks.

**Next:** `OC-SEC-001` is the next P0 work package per this order, pending approval.
