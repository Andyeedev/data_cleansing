# Cross-Reference: Doc 21, Doc 16, Doc 22

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** Cross-Reference_Doc21_Doc16_Doc22

---

## Relationship Map

This architecture (Doc 23) is the **operational layer** that produces the metadata consumed and governed by three existing documents.

### Doc 21 — Enterprise Runtime Metadata Contract
- Doc 23's registries (`SchemaRegistry`, `TableRegistry`, `ColumnRegistry`, `ConstraintRegistry`, `RelationshipRegistry`) **conform to** the shapes defined in Doc 21.
- Every discovery and mapping event writes an **audit record** per Doc 21's audit schema.
- Approved mappings are persisted using Doc 21's contract as the storage contract.

### Doc 16 — Enterprise Object Reference
- Doc 16 defines the **canonical object model** (databases, schemas, tables, columns) that Doc 23 discovers and enriches.
- Semantic matching (02_AI_Machine_Learning) targets the Doc 16 target objects during migration mapping.
- Doc 23 extends Doc 16 with AI-derived roles, tags, and confidence — never redefining the base model.

### Doc 22 — Enterprise Navigation Contract
- Doc 22 governs **discovery sequencing and traversal order** (which schemas/tables to process and in what dependency order).
- Approval workflow batches (03_Governance) are sequenced per Doc 22 navigation paths.
- Audit lineage views in Doc 22 surface Doc 23's `Audit_Trail.md` events.

## Dependency Summary

| Doc 23 Component | Depends On |
|------------------|-----------|
| All Discovery Engine services | Doc 21 (contract), Doc 22 (scope/order) |
| Semantic Matching / Classification | Doc 16 (target objects) |
| Approval / Validation / Audit | Doc 21 (contract), Doc 22 (lineage) |

## Promotion Note

Once approved, this folder promotes to `00_Architecture/23_Enterprise_Discovery_and_AI_Mapping_Architecture/` with the same structure.
