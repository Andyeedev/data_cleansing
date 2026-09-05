# Confidence Scoring

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 02_AI_Machine_Learning / Confidence_Scoring

---

## Purpose

Produce a transparent, explainable confidence score for every AI-generated mapping and classification so humans can triage efficiently.

## Scoring Model

Final confidence = weighted blend of:

| Signal | Weight | Notes |
|--------|--------|-------|
| Structural match | 0.35 | Type compatibility, naming exact match |
| Semantic similarity | 0.30 | Embedding cosine score |
| Constraint alignment | 0.15 | PK/FK/unique alignment |
| Sample-value overlap | 0.10 | Distributions / domains |
| Historical acceptance | 0.10 | Learned from prior approvals |

## Thresholds & Routing

| Score | Disposition |
|-------|-------------|
| ≥ 0.90 | Auto-suggest, light review |
| 0.70 – 0.89 | Standard human review |
| 0.50 – 0.69 | Required review + justification |
| < 0.50 | Rejected / manual-only |

## Explainability

- Each score stores its component breakdown in `Metadata_Validation.md` record.
- Users can inspect *why* a score was assigned (no black box).
- Scores decay if underlying metadata changes (re-validation trigger).

## Storage

- Persisted alongside mapping proposals in the registry.
- Every score change logged to the audit trail (Doc 21).
