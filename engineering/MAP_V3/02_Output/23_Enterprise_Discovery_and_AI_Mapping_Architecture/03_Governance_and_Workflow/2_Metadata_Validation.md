# Metadata Validation

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 03_Governance_and_Workflow / Metadata_Validation

---

## Purpose

Validate discovered and AI-enriched metadata against the enterprise metadata contract before it becomes authoritative.

## Validation Layers

1. **Schema conformance** — Discovered metadata matches the `SchemaRegistry` / `ColumnRegistry` contract shapes defined in Doc 21.
2. **Referential integrity** — `RelationshipRegistry` edges resolve to existing tables/columns.
3. **Type compatibility** — Source → target type mappings are within the allowed conversion matrix.
4. **Confidence integrity** — Score breakdowns present and within bounds (`Confidence_Scoring.md`).
5. **Governance compliance** — PII/financial tags trigger required reviews (`Approval_Workflow.md`).

## Validation Report

Each run produces a report containing:

| Field | Description |
|-------|-------------|
| `validate_at` | Timestamp |
| `entity_id` | Registry ID |
| `status` | PASS / WARN / FAIL |
| `failures` | List of rule violations |
| `remediation` | Suggested fix |

## Error Handling

- **FAIL** blocks promotion to approved state.
- **WARN** allows promotion but flags for review.
- All validation results persisted and audited (Doc 21).
- Re-runs triggered automatically on metadata change.
