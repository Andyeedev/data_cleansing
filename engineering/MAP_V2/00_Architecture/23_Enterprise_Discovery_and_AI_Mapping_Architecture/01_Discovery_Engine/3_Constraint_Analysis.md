# Constraint Analysis

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 01_Discovery_Engine / Constraint_Analysis

---

## Purpose

Extract primary keys, foreign keys, unique constraints, and check constraints to build the relationship graph that powers validation and mapping.

## Constraint Discovery Service

- **Input:** `TableRegistry` entries.
- **Output:** `ConstraintRegistry` and `RelationshipRegistry` entries.

| Constraint Type | Source |
|-----------------|--------|
| PRIMARY KEY | `information_schema.table_constraints` + `key_column_usage` |
| FOREIGN KEY | `information_schema.referential_constraints` |
| UNIQUE | `table_constraints` where `constraint_type = 'UNIQUE'` |
| CHECK | Provider-specific (e.g. `check_constraints`) |
| NOT NULL | `columns.is_nullable` |

## Relationship Graph

- Each FK produces a directed edge `source_table.col -> target_table.col`.
- The graph is stored in `RelationshipRegistry` and consumed by:
  - Validation engine (referential integrity checks).
  - Navigation contract (Doc 22) for ordered traversal.
  - AI matching (to bias column matches by relationship context).

## Edge Cases

- **Composite keys:** Stored as ordered column sets.
- **Unnamed constraints:** Auto-named using `<table>_<type>_<cols>` convention.
- **Cross-schema FKs:** Must resolve to a single `RelationshipRegistry` entry referencing both `SchemaRegistry` IDs.
- **Disabled / deferred constraints:** Flagged with `is_enforced = false` for risk scoring.
