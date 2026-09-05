# Certification

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 03_Migration_Validation / 3_Certification

---

## Purpose

Produce a formal certification verdict for each migration batch based on validation results.

## Certification Levels

| Level | Condition | Meaning |
|-------|-----------|---------|
| **CERTIFIED** | All rules pass | Migration batch approved for go-live |
| **CONDITIONAL** | Non-critical rules fail; critical pass | Approved with documented exceptions |
| **NOT CERTIFIED** | Any critical rule fails | Migration batch blocked; remediation required |

## Rule Criticality

| Criticality | Failure Impact |
|-------------|----------------|
| **Critical** | Blocks go-live (data loss, FK violation, checksum mismatch) |
| **Warning** | Flags for review (tolerance exceedance, null rate increase) |
| **Info** | Recorded only (distribution shift, format change) |

## Certification Record

```json
{
  "batch_id": "uuid",
  "level": "CERTIFIED | CONDITIONAL | NOT_CERTIFIED",
  "critical_pass": true,
  "critical_fail": 0,
  "warning_count": 0,
  "info_count": 0,
  "certified_by": "user_id",
  "certified_at": "iso8601",
  "evidence_refs": []
}
```

## Integration

- Consumes results from Rule Execution (03_Migration_Validation/2_Rule_Execution.md).
- Consumes reconciliation results (03_Migration_Validation/1_Source_Target_Reconciliation.md).
- Certification record stored per Doc 21 (metadata contract).
- Certification status surfaced in Doc 22 (navigation contract) lineage views.
- Governance: approval workflow mirrors Doc 23's 03_Governance_and_Workflow/1_Approval_Workflow.md pattern.
