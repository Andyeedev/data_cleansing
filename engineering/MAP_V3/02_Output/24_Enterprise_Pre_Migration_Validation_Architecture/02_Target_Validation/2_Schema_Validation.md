# Schema Validation

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 02_Target_Validation / 2_Schema_Validation

---

## Purpose

Confirm that target schemas are correctly provisioned and type-compatible with the source definitions.

## Validation Layers

| Layer | Check | Pass Condition |
|-------|-------|----------------|
| **Table existence** | Target tables created per DDL | All tables present |
| **Column mapping** | Source→target column types within allowed conversion matrix | No type mismatches |
| **Constraints** | PK, FK, unique, NOT NULL constraints applied | All constraints enforced |
| **Indexes** | Required indexes created per performance spec | All indexes present |
| **Partitioning** | Partition scheme matches target design | Partition key and count correct |
| **Views / materialized views** | Dependent views rebuilt | All views valid |

## Type Conversion Matrix

Defined in Doc 16 (Enterprise Object Reference). Source-to-target type compatibility is enforced per the matrix; any deviation requires explicit override.

## Integration

- Consumes target schema from Doc 23 (if target already discovered).
- Consumes DDL / schema generation output from the migration pipeline.
- Failures block migration start until resolved (hard gate).
