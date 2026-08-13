# Phase 14 — Approval Record

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Awaiting approval
**Related:** `14_0_Scope_Document.md`, `14_1_Work_Breakdown_Structure.md`, `14_2_Assessment.md`,
`14_3_Implementation_Plan.md`, `14_4_Minimum_Change_Proposal.md`

---

## 1. Approval Gate

Per `MAP_Development_Rule_Gates.md` §2 (Approval Gate) and the Mandatory Implementation Gates,
**no implementation may begin until this record is approved.**

---

## 2. Summary of What Is Proposed

| Item | Reference |
|------|----------|
| Defect to fix | Current Clear All is a soft delete that is invisible in UI and unrecoverable via re-discovery (`14_2_Assessment.md` §1.6) |
| Approach | Hard delete of live data + auditable archive copy + restore + admin reporting console |
| Schema change | 4 new `core` archive/audit tables (`sql/schema/08_discovery_clear_archive.sql`) |
| Backend change | Extend existing Discovery + Mapping `clear-all`; add `restore` + `clear-history` |
| Frontend change | Wire new response + fix modal wording; new admin console under `/administration` |
| Reuse | Extends existing repositories, routes, auth, admin layout, shared components — no duplication |

---

## 3. Decision

| Role | Name | Decision | Date |
|------|------|----------|------|
| Reviewer / Approver | ________________ | ☐ Approved &nbsp; ☐ Rejected &nbsp; ☐ Approved with changes | ________ |
| Notes | | | |

---

## 4. Conditions / Approved Changes (if any)

> _To be completed on approval._

---

## 5. Post-Approval Authorisation

Once approved:
- Implement Steps 14.1–14.7 per `14_3_Implementation_Plan.md`.
- Follow the Phase Gate: stop after implementation, provide test summary (Testing Gate), request
  approval before closure.
- Update documentation and produce `Phase_14_Closure_Report.md`.

---

**End of Approval Record**
