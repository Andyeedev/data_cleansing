# Phase 09 — Roadmap Numbering Recommendation

> **Generated:** 2026-07-29
> **Status:** Accepted (see ADR-009)
> **Date:** 2026-07-29
> **Type:** Governance improvement (documentation only)
> **Scope:** Naming clarification for Future Modules Track
> **Impact:** No implementation changes required

---

## 1. Current Roadmap Numbering

The phase sequence defined in `09QA_Work_Package.md` and `09Z_Implementation_Governance.md`:

```
Phase 09: Frontend Implementation (Phases 1–6)
    ↓
Phase 09QA: Quality & Governance Closure
    ↓
Phase 09: Final Compliance Report
    ↓
Phase 09: COMPLETE
    ↓
Phase 7: Future Modules
    ↓
Phase 10: (Next phase)
```

---

## 2. Why the Numbering is Valid

The numbering follows the original project architecture:

- **Phase 09** was defined as the Frontend Implementation workstream (encompassing sub-phases 1–6)
- **Phase 7** was defined separately as "Future Modules" (ReportsPage differentiation, feature flags, MappingPage) — it was designed as a后续 track that depends on Phase 09 completion
- **Phase 10** is the next major workstream after Phase 07

The sequence is technically correct because:
1. Phase 07 was always designed to begin after Phase 09 completion
2. The dependency chain is documented: Phase 07 depends on Phase 02 (feature flag infrastructure)
3. The 09Z governance document explicitly states this order

---

## 3. Why the Numbering May Confuse Future Developers and Auditors

### 3.1 Non-Sequential Expectation

Developers and auditors naturally expect phase numbers to increase monotonically:
- Phase 09 → Phase 10 → Phase 11

The actual sequence (09 → 07 → 10) violates this expectation.

### 3.2 Ambiguity in "Phase 7"

When a reader encounters "Phase 7" in a Phase 09 document, they may assume:
- Phase 7 is a prerequisite for Phase 09 (incorrect)
- Phase 7 is an earlier phase that was skipped (incorrect)
- Phase 7 is a sub-phase of Phase 09 (partially correct, but misleading)

### 3.3 Audit Trail Confusion

During compliance audits, reviewers may ask:
- "Why does Phase 09 approve work in Phase 07?"
- "Is Phase 07 a dependency or a successor?"
- "Should Phase 07 have been completed before Phase 09?"

These questions add unnecessary overhead to audit processes.

### 3.4 Documentation Cross-References

Documents that reference both phases create confusion:
- `09_Remaining_Work.md` references "Blocks Phase 7"
- `09_Final_Compliance_Report.md` states "Approved to begin Phase 7"
- `09Z_Gap_Analysis_and_Compliance_Audit.md` states "Phase 7 may begin"

A reader must consult the roadmap diagram to understand the relationship.

---

## 4. Recommendation

Rename Phase 7 to one of the following to clarify its relationship to Phase 09:

### Option A: Workstream 7

```
Phase 09: Frontend Implementation
    ↓
Workstream 7: Future Modules
    ↓
Phase 10: (Next phase)
```

**Advantage:** Clearly distinguishes "workstreams" (parallel tracks) from "phases" (sequential milestones). Signals that Workstream 7 is a separate track, not a prerequisite.

### Option B: Module Group 7

```
Phase 09: Frontend Implementation
    ↓
Module Group 7: Future Modules
    ↓
Phase 10: (Next phase)
```

**Advantage:** Emphasizes that this is a group of related modules, not a standalone phase. Aligns with the content (ReportsPage, MappingPage, feature flags).

### Option C: Future Modules Track (Recommended)

```
Phase 09: Frontend Implementation
    ↓
Future Modules Track
    ↓
Phase 10: (Next phase)
```

**Advantage:** Eliminates the number entirely. The name is self-describing. No confusion with phase numbering. Most clear for auditors and new developers.

---

## 5. Implementation Scope

This is a **documentation improvement only**.

| Action | Required? |
|--------|-----------|
| Modify implementation code | No |
| Modify test suites | No |
| Modify compliance reports | No |
| Modify governance documents | Optional (rename references) |
| Modify roadmap diagrams | Yes (if recommendation adopted) |

If adopted, the following documents would need reference updates:
- `09QA_Work_Package.md` (flow diagram)
- `09Z_Implementation_Governance.md` (implementation order)
- `09_Remaining_Work.md` (references to "Phase 7")
- `09_Final_Compliance_Report.md` (final verdict)
- `09Z_Gap_Analysis_and_Compliance_Audit.md` (remaining work table)

---

## 6. Summary

| Item | Status |
|------|--------|
| Current numbering valid? | Yes — follows original architecture |
| Confusing for readers? | Yes — non-sequential, ambiguous relationship |
| Recommendation | Rename "Phase 7" to "Future Modules Track" |
| Implementation impact | None — documentation only |
| Compliance impact | None — existing reports remain valid |

---

*This document is a recommendation only. No existing reports, compliance results, or implementation artifacts are modified.*
