# Shared Metadata

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 04_Shared_Rule_Engine / 3_Shared_Metadata

---

## Purpose

Define the shared metadata model used by rules, thresholds, and validation results across all three modes.

## Metadata Entities

| Entity | Description | Consumed By |
|--------|-------------|-------------|
| **RuleParameter** | Configurable thresholds per rule invocation | Rule Engine |
| **ThresholdProfile** | Per-object threshold overrides (e.g., different null tolerance per table) | Rule Engine, Source Validation |
| **EscalationRule** | Threshold escalation when source quality is degraded | Migration Validation |
| **ValidationRun** | Execution metadata: run ID, mode, timestamp, object scope | All modes |
| **ValidationResult** | Per-rule result: pass/fail/warn, evidence, timestamps | All modes |
| **CertificationRecord** | Formal verdict and evidence bundle | Certification |

## Threshold Hierarchy

Defaults flow down; overrides at finer granularity win:

```
Global defaults → Per-mode defaults → Per-object overrides → Per-column overrides
```

## Integration

- Metadata shapes conform to Doc 21 (Enterprise Runtime Metadata Contract).
- Object references use Doc 16 (Enterprise Object Reference) identifiers.
- Navigation ordering uses Doc 22 (Enterprise Navigation Contract).
