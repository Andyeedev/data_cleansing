# Cross-Reference: Doc 21, Doc 16, Doc 22

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** Cross-Reference_Doc21_Doc16_Doc22

---

## Relationship Map

Doc 24 is the **validation layer** that consumes metadata produced by Doc 23 and governed by Docs 21, 16, and 22.

### Doc 21 — Enterprise Runtime Metadata Contract
- Validation run and result schemas conform to Doc 21 shapes.
- Every validation event writes an **audit record** per Doc 21's audit schema.
- Certification records are persisted using Doc 21's contract as the storage contract.

### Doc 16 — Enterprise Object Reference
- Doc 16 defines the **canonical object model** that validation rules operate against.
- Type conversion matrices (02_Target_Validation/2_Schema_Validation.md) reference Doc 16 type definitions.
- Quality dimensions (01_Source_Validation/2_Data_Quality_Analysis.md) reference Doc 16 column semantics.

### Doc 22 — Enterprise Navigation Contract
- Doc 22 governs **validation sequencing** (which objects to validate and in what dependency order).
- Reference data validation order (02_Target_Validation/3_Reference_Data_Validation.md) follows Doc 22's dependency graph.
- Certification status is surfaced in Doc 22's lineage views.

### Doc 23 — Enterprise Discovery and AI Mapping Architecture
- Doc 24 **consumes** the metadata that Doc 23 produces (schema, table, column, constraint registries).
- Source validation uses Doc 23's source-side metadata.
- Target validation uses Doc 23's target-side metadata.
- Migration validation uses Doc 23's mapping output to define reconciliation pairs.

## Dependency Summary

| Doc 24 Component | Depends On |
|------------------|-----------|
| All validation services | Doc 21 (contract), Doc 22 (sequencing) |
| Schema validation | Doc 16 (type matrix), Doc 23 (target schema) |
| Migration validation | Doc 23 (mapping pairs) |
| Reporting / Governance | Doc 21 (audit), Doc 22 (lineage) |

## Promotion Note

Once approved, this folder promotes to `00_Architecture/24_Enterprise_Pre_Migration_Validation_Architecture/` with the same structure.
