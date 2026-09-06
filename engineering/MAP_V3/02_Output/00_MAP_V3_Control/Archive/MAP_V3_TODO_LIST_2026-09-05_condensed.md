# MAP_V3 TODO List — Master Control Document
**Version:** MAP_V3 | **Baseline:** MAP_V2_FINAL_BASELINE (d5f42b86, v5.08) | **Branch:** feature/MAP_V3 (local only)
**Created:** 2026-09-05 | **Status:** Living Document — Updated per Document Maintenance Rules

> This is the master workstream control for MAP_V3. All OC-* work packages are tracked here. See `00_Non_Negotiable_OpenCode_Rules.md` for mandatory OpenCode behaviour.

---

## Master Status Table
| ID | Priority | Work Package | Status | OpenCode Report | ChatGPT Decision | Implementation | Validation |
|---|---|---|---|---|---|---|---|
| OC-GIT-001 | P0 | Review Git release process | COMPLETE | 2026-09-05: Investigated v5_05/v5_06/v5_07, recommended v5.08 | APPROVED (proceed with v5.08 + MAP_V2 alias) | N/A (report only) | Verified |
| OC-GIT-002 | P0 | Publish MAP_V2 baseline | COMPLETE | Committed 11 files (8 docs+3 dumps) as b01b7f12, pushed | APPROVED | b01b7f12 | Pushed to origin |
| OC-GIT-003 | P0 | Mark MAP_V2 final baseline | COMPLETE | Recommended MAP_V2_FINAL (dual tag v5.08+MAP_V2) | APPROVED (proceed with v5.08 and MAP_V2 alias) | Tags v5.08, MAP_V2 on d5f42b86, pushed | Verified |
| OC-GIT-004 | P0 | Create MAP_V3 | COMPLETE | Copied engineering/MAP_V2 → engineering/MAP_V3, preserved MAP_V2, tested vite build | APPROVED (local only) | feature/MAP_V3 7c4a3e1d, engineering/MAP_V3 (1212 files) | vite build ✓ |
| OC-CTRL-001 | P0 | Determine TODO_LIST location | COMPLETE | Recommended engineering/MAP_V3/02_output/00_MAP_V3_Control/ (folder with MAP_V3_TODO_LIST.md) | APPROVED (proceed, preserve MAP_V2) | Created 00_MAP_V3_Control/ with MAP_V3_TODO_LIST.md + 00_Non_Negotiable_OpenCode_Rules.md | Verified — MAP_V2 untouched |
| OC-GIT-003-FINAL | P0 | Mark MAP_V2 as Final Baseline (MAP_V2_FINAL_BASELINE) | COMPLETE | Recommended MAP_V2_FINAL_BASELINE on d5f42b86 | APPROVED | Tag MAP_V2_FINAL_BASELINE on d5f42b86, pushed | Verified |
| OC-SEC-001 | P0 | Website Security Assessment | NOT STARTED | — | — | — | — |
| OC-SEC-002 | P0 | Product Security Assessment | NOT STARTED | — | — | — | — |
| OC-COM-001 | P1 | Subscription, Charges & Tenant Assessment | NOT STARTED | — | — | — | — |
| OC-PROD-001 | P1 | Pre-Migration Validation & Assurance Product Assessment | NOT STARTED | — | — | — | — |
| OC-GOV-001 | P1 | Policy vs Implementation Gap Audit | NOT STARTED | — | — | — | — |
| OC-CLOUD-001 | P1 | Secure Cloud Architecture & Environment Assessment | NOT STARTED | — | — | — | — |
| OC-DEMO-001 | P1/P2 | Customer Demo Security Assessment | NOT STARTED | — | — | — | — |
| OC-READY-001 | P2 | Additional Commercial / Operational Readiness Gap Assessment | NOT STARTED | — | — | — | — |

---

## Work Packages Detail

### OC-GIT-001 — Review Existing Release Process
*See report: Existing release process summary, comparison v5_05/v5_06/v5_07, recommended MAP_V2 Git strategy (v5.08), risks, exact commands, baseline tag v5.08/MAP_V2, untouched confirmation.*

### OC-GIT-002 — Publish Final MAP_V2 Baseline
*Commit b01b7f12, 11 files, 3 dumps, pushed. Security checks: no .env, no keys, no terraform.tfvars in commit.*

### OC-GIT-003 — Mark MAP_V2 as Final Baseline
*Mechanism: Annotated Git Tag (immutable) + optional GitHub Release. Proposed: MAP_V2_FINAL (or MAP_V2_FINAL_BASELINE) on d5f42b86. Future dev: checkout MAP_V2_FINAL or v5.08.*

### OC-GIT-004 — Create MAP_V3 From Final MAP_V2
*MAP_V2_FINAL_BASELINE (d5f42b86) → MAP_V3 (engineering/MAP_V3 copy), preserve MAP_V2, no retrospective alter, test frontend-mvp vite build.*

### OC-CTRL-001 — Determine TODO_LIST Location
*Location: engineering/MAP_V3/02_output/00_MAP_V3_Control/ — folder with MAP_V3_TODO_LIST.md + 00_Non_Negotiable_OpenCode_Rules.md — why: 02_output is MAP_V3 deliverable root, 00_ sorts first, clearly identifiable as MAP_V3 TODO / Workstream Control, not root, not MAP_V2.*

---

## Document Maintenance
This document is living. OpenCode must update it when:
- A work package changes status
- A decision is approved/rejected
- A material implementation is completed
- A new dependency is identified
- A policy/implementation gap is resolved
- A new work package is approved
- MAP_V3 architecture materially changes

Do not remove completed tasks. Completed tasks retain Status, Decision, Commit/reference, Evidence, Completion date, Relevant notes. This preserves MAP_V3 audit trail. MAP_V2 remains recoverable at MAP_V2_FINAL_BASELINE (d5f42b86).
