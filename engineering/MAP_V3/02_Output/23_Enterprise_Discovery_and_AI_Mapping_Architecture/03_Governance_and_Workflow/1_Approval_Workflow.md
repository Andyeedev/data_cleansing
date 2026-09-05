# Approval Workflow

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 03_Governance_and_Workflow / Approval_Workflow

---

## Purpose

Define the human-in-the-loop governance that converts AI proposals into approved, authoritative mappings.

## Workflow States

```
PROPOSED → REVIEW → APPROVED | REJECTED → (REVISED) → REVIEW
```

| State | Owner | Exit Condition |
|-------|-------|----------------|
| PROPOSED | System | AI emits mapping + confidence |
| REVIEW | Human (role-based) | Reviewer acts based on threshold |
| APPROVED | Human | Sign-off recorded |
| REJECTED | Human | Reason captured, returns to revise |

## Role-Based Access

- **Discovery Analyst:** Reviews low-risk (≥0.90) mappings.
- **Migration Architect:** Reviews medium-risk (0.70–0.89).
- **Data Owner:** Mandatory for PII / financial classifications.
- **Admin:** Override authority with full audit record.

## Integration

- Consumes proposals + confidence from `Confidence_Scoring.md`.
- Enforces PII review via `Column_Classification.md`.
- Approved mappings persisted per the metadata contract (Doc 21).
- Navigation contract (Doc 22) governs sequencing of review batches.
- Every transition logged to the audit trail (Doc 21).
