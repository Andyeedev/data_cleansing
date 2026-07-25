# Validation Reporting

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 05_Governance_and_Reporting / 1_Validation_Reporting

---

## Purpose

Provide visibility into validation status, quality, and certification across the migration lifecycle.

## Report Types

| Report | Audience | Content |
|--------|----------|---------|
| **Readiness Dashboard** | Migration Architect | Source + target readiness status per object |
| **Quality Scorecard** | Data Owner | Source quality dimensions with drill-down |
| **Migration Status** | Project Manager | Batch progress, reconciliation pass rates |
| **Certification Report** | Compliance Officer | Certification verdicts, evidence, exceptions |
| **Drill-Down Detail** | Analyst | Per-object, per-rule results with evidence |

## Report Triggers

- On-demand: user-initiated from the portal.
- On-event: readiness gate, quality run, reconciliation, certification.
- Scheduled: daily/weekly summary digests.

## Integration

- Consumes `ValidationResult` and `CertificationRecord` from 04_Shared_Rule_Engine/3_Shared_Metadata.md.
- Surfaces in Doc 22 (navigation contract) lineage views.
- Report generation events logged to the audit trail (Doc 21).
