# Reference Data Validation

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 02_Target_Validation / 3_Reference_Data_Validation

---

## Purpose

Ensure lookup tables, code tables, and master data required by the migration are present and correct on the target.

## Validation Scope

| Category | Examples | Check |
|----------|----------|-------|
| **Code tables** | status codes, country codes, currency | All source codes present on target |
| **Lookup tables** | product catalogue, organisational hierarchy | Keys and values match |
| **Master data** | customer, account, entity | Record count and key distribution within tolerance |
| **Sequences** | ID generators, auto-increment seeds | Next value ≥ max source value + buffer |

## Execution Order

Reference data must be validated **before** main data migration to prevent FK violations.

## Integration

- Consumes `ConstraintRegistry` from Doc 23 for FK dependency graph.
- Consumption order derived from Doc 22 (navigation contract).
- Results feed the migration validation gate (03_Migration_Validation).
