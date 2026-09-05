# ADR-009: Phase Numbering and Roadmap Naming Clarification

> **Status:** Accepted
> **Date:** 2026-07-29
> **Deciders:** Architecture Team
> **Relates to:** Phase 09 — Frontend Implementation

---

## Context

The project roadmap defines the following phase sequence:

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

The sequence 09 → 07 → 10 is technically correct per the original architecture, but creates confusion for future developers and auditors.

---

## Decision

Rename "Phase 7" to **Future Modules Track** throughout all governance documentation.

### Updated Roadmap

```
Phase 09 — Frontend Restoration & Compliance
        ↓
Future Modules Track — Deferred Capabilities
        ↓
Phase 10 — Next Major Workstream
```

### Reference Mapping

| Current | Replace With |
|---------|--------------|
| Phase 7: Future Modules | Future Modules Track |
| Blocks Phase 7 | Blocks Future Modules Track |
| Approved to begin Phase 7 | Approved to begin Future Modules Track |

---

## Rationale

### Why the Original Numbering Was Valid

- Phase 07 was designed as a separate workstream dependent on Phase 09 completion
- The dependency chain is documented: Phase 07 depends on Phase 02 (feature flag infrastructure)
- The 09Z governance document explicitly states this order

### Why the Rename Is Necessary

1. **Non-sequential expectation:** Developers expect phase numbers to increase monotonically (09 → 10 → 11). The sequence 09 → 07 → 10 violates this.

2. **Ambiguity:** "Phase 7" in a Phase 09 document may be interpreted as a prerequisite, a skipped phase, or a sub-phase.

3. **Audit confusion:** Reviewers may ask why Phase 09 approves work in Phase 07, or whether Phase 07 should have been completed first.

4. **Cognitive overhead:** The numbering requires explanation. "Future Modules Track" is self-describing.

### Why Option C Was Chosen

| Option | Name | Verdict |
|--------|------|---------|
| A | Workstream 7 | Partially improves clarity but retains confusing number |
| B | Module Group 7 | Emphasizes module grouping but retains confusing number |
| **C** | **Future Modules Track** | **Eliminates number entirely. Self-describing.** |

---

## Consequences

### Positive

- Removes false impression of going backwards (09 → 07)
- Separates delivery phases from capability tracks
- Aligns with architecture approach (MAP CLI core → platform → future enhancements)
- Avoids renumbering historical documents and breaking audit references
- Improves future audit clarity

### Negative

- Requires reference updates in existing governance documents
- Team must adopt new terminology

### Neutral

- No implementation code changes
- No test suite changes
- No compliance report invalidation
- Existing Phase 09 compliance remains valid

---

## Scope of Changes

### Documents Requiring Reference Updates

| Document | Change |
|----------|--------|
| `09QA_Work_Package.md` | Flow diagram: "Phase 7: Future Modules" → "Future Modules Track" |
| `09Z_Implementation_Governance.md` | Implementation order reference |
| `09_Remaining_Work.md` | "Blocks Phase 7" → "Blocks Future Modules Track" |
| `09_Final_Compliance_Report.md` | "Approved to begin Phase 7" → "Approved to begin Future Modules Track" |
| `09Z_Gap_Analysis_and_Compliance_Audit.md` | Remaining work table |

### Documents NOT Modified

- Implementation code
- Test suites
- Existing compliance results
- Historical audit references

---

## Compliance

- Existing Phase 09 compliance reports remain valid
- No re-execution of governance gates required
- This ADR serves as the permanent record of the naming decision

---

## References

- `09QA_Work_Package.md` — Original roadmap definition
- `09Z_Implementation_Governance.md` — Implementation order
- `09_Roadmap_Numbering_Recommendation.md` — Initial analysis

---

*This ADR makes the naming decision permanent and prevents future "fixes" that would revert to the confusing Phase 7 numbering.*
