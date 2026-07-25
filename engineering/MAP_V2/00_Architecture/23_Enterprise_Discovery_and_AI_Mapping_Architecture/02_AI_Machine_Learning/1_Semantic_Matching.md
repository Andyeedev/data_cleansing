# Semantic Matching

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 02_AI_Machine_Learning / Semantic_Matching

---

## Purpose

Use embedding-based similarity to propose source → target column mappings where structural matches are insufficient.

## Semantic Matching Engine

- **Inputs:**
  - `ColumnRegistry` entries (name, type, description, sample values).
  - Target schema from the migration mapping (Doc 16 object reference).
- **Process:**
  1. Generate vector embeddings for column name + enriched context.
  2. Compute cosine similarity against candidate target columns.
  3. Combine with structural signals (type compatibility, naming heuristics).
  4. Emit ranked candidate mappings with scores.

## Model Strategy

| Layer | Approach |
|-------|----------|
| Embedding | Domain-adapted sentence-transformer on column metadata |
| Reranking | Lightweight cross-encoder over top-K candidates |
| Fallback | Deterministic fuzzy/levenshtein match when model unavailable |

## Integration Points

- Consumes `ColumnRegistry` from the Discovery Engine.
- Produces proposed mappings fed into `Approval_Workflow.md`.
- Scores stored for `Confidence_Scoring.md`.
- All matching activity logged to the audit trail (Doc 21).
