# Rule Execution

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 03_Migration_Validation / 2_Rule_Execution

---

## Purpose

Execute validation rules against migration pairs and produce pass/fail/warn results.

## Execution Model

```
Rule Registry → Select applicable rules → Execute against pairs → Collect results → Feed Certification
```

| Step | Description |
|------|-------------|
| **Selection** | Filter rules by `validation_mode = migration` + object applicability |
| **Execution** | Parallel per-table, serial per-rule (order matters for dependencies) |
| **Result collection** | Per-rule pass/fail/warn with evidence and timestamps |
| **Error handling** | Rule failure logged; execution continues for remaining rules |

## Rule Types

| Type | Example | Disposition |
|------|---------|-------------|
| **Row count match** | source_count = target_count | Exact match required |
| **Checksum match** | source_hash = target_hash | Exact match required |
| **Aggregate match** | source_SUM ≈ target_SUM | Tolerance-based |
| **FK integrity** | all source FKs resolve on target | Exact match required |
| **Business rule** | target.balance ≥ 0 | Pass/fail per rule |
| **Null rate** | target.null_pct ≤ source.null_pct × 1.05 | Tolerance-based |

## Integration

- Rule definitions from 04_Shared_Rule_Engine.
- Pairs derived from Doc 22 (navigation contract) mapping.
- All execution results feed Certification (03_Migration_Validation/3_Certification.md).
- Execution events logged to the audit trail (Doc 21).
