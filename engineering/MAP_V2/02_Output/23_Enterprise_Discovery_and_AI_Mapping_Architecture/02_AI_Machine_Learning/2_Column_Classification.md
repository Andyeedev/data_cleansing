# Column Classification

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 02_AI_Machine_Learning / Column_Classification

---

## Purpose

Automatically classify each discovered column into semantic roles to drive mapping rules, validation, and governance.

## Classification Taxonomy

| Role | Examples | Drives |
|------|----------|--------|
| `identifier` | id, pk, uuid | Key mapping, joins |
| `foreign_key` | *_id, fk_* | Relationship graph |
| `pii` | email, ssn, phone | Masking / compliance |
| `financial` | amount, balance, price | Numeric validation |
| `temporal` | created_at, updated_at | Temporal checks |
| `categorical` | status, type, flag | Domain validation |
| `descriptive` | name, description, notes | Free-text handling |
| `system` | created_by, version | Audit metadata |

## Classification Service

- **Inputs:** `ColumnRegistry` entries (name, type, sample values, constraints).
- **Process:**
  1. Rule-based pre-classification (naming patterns, type, constraints).
  2. Model-based refinement using sample values + context.
  3. PII detection via pattern + dictionary + model ensemble.
- **Output:** `ColumnRegistry.role`, `ColumnRegistry.tags`, `ColumnRegistry.pii_detected`.

## Governance

- PII classifications trigger mandatory review in `Approval_Workflow.md`.
- Classification confidence feeds `Confidence_Scoring.md`.
- All classifications recorded in the audit trail (Doc 21).
