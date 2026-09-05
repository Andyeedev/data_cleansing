# Rule Applicability

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 04_Shared_Rule_Engine / 4_Rule_Applicability

---

## Purpose

Map each rule to the validation modes and object types where it applies, avoiding duplication of rule logic.

## Applicability Model

Each rule declares:

| Field | Description |
|-------|-------------|
| `validation_modes` | `["source"]`, `["target"]`, `["migration"]`, or any combination |
| `object_types` | `["table"]`, `["column"]`, `["view"]`, `["schema"]`, or `"all"` |
| `source_type_filter` | Optional: restrict to specific source types (e.g., relational only) |
| `condition` | Optional: expression to dynamically include/exclude objects |

## Example

```yaml
rule_id: null_rate_check
validation_modes: [source, target, migration]
object_types: [column]
condition: "column.nullable = true"
```

This single rule definition runs against source columns, target columns, and source-vs-target null rate comparison — without three separate rule definitions.

## Deduplication Benefit

| Pattern | Without shared registry | With shared registry |
|---------|------------------------|---------------------|
| null_rate check × 3 modes | 3 rule definitions | 1 rule definition |
| row_count check × 3 modes | 3 rule definitions | 1 rule definition |
| FK integrity × 2 modes | 2 rule definitions | 1 rule definition |

## Integration

- Applicability metadata stored in the Rule Registry (04_Shared_Rule_Engine/2_Rule_Registry.md).
- Rule Engine (04_Shared_Rule_Engine/1_Rule_Engine_Architecture.md) resolves applicable rules per invocation.
- Applicability changes logged to the audit trail (Doc 21).
