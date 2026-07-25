# Rule Registry

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 04_Shared_Rule_Engine / 2_Rule_Registry

---

## Purpose

Centralised, versioned repository for all validation rule definitions.

## Registry Schema

| Field | Description |
|-------|-------------|
| `rule_id` | Unique identifier |
| `rule_name` | Human-readable name |
| `description` | What the rule validates |
| `category` | Quality / Integrity / Completeness / Performance |
| `validation_modes` | Array: `source`, `target`, `migration` |
| `criticality` | `critical`, `warning`, `info` |
| `expression` | Rule expression (YAML/JSON) |
| `threshold` | Pass/fail threshold (configurable) |
| `version` | Semantic version |
| `status` | `active`, `deprecated`, `draft` |
| `created_by` | Author |
| `created_at` | Timestamp |

## Rule Lifecycle

```
draft → active → (deprecated) → retired
```

- Rules in `draft` are not executed in production.
- Rules in `deprecated` execute but produce a warning.
- Rules in `retired` are excluded from execution.

## Integration

- Consumed by Rule Engine (04_Shared_Rule_Engine/1_Rule_Engine_Architecture.md).
- Consumed by Rule Applicability (04_Shared_Rule_Engine/4_Rule_Applicability.md).
- Registry changes logged to the audit trail (Doc 21).
