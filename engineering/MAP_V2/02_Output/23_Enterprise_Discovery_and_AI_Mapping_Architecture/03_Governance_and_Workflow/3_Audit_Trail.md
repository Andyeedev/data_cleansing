# Audit Trail

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 03_Governance_and_Workflow / Audit_Trail

---

## Purpose

Provide an immutable, queryable record of every discovery and mapping action for compliance and traceability.

## Events Captured

| Event | Source |
|-------|--------|
| `schema_discovered` | Schema Discovery |
| `table_discovered` | Table Discovery |
| `constraint_discovered` | Constraint Analysis |
| `column_classified` | Column Classification |
| `semantic_match_proposed` | Semantic Matching |
| `confidence_scored` | Confidence Scoring |
| `mapping_reviewed` | Approval Workflow |
| `metadata_validated` | Metadata Validation |

## Record Schema

Each audit entry conforms to the metadata contract (Doc 21):

```json
{
  "event_id": "uuid",
  "event_type": "string",
  "actor": "system|user_id",
  "entity_id": "registry_id",
  "timestamp": "iso8601",
  "payload": { },
  "outcome": "success|fail|review"
}
```

## Storage & Access

- Append-only store; no in-place updates.
- Queryable by `entity_id`, `event_type`, `actor`, time range.
- Retention governed by enterprise compliance policy.
- Surfaces in the navigation contract (Doc 22) lineage views.
