# Source Readiness Assessment

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 01_Source_Validation / 1_Source_Readiness_Assessment

---

## Purpose

Verify that a source endpoint is fully ready for migration before any extraction begins.

## Readiness Checks

| Check | Description | Pass Condition |
|-------|-------------|----------------|
| **Connectivity** | Endpoint reachable and credentials valid | Connection succeeds within timeout |
| **Permissions** | Required access grants present | SELECT on target objects confirmed |
| **Schema availability** | Tables/views exist and are accessible | All objects in scope discovered |
| **Data volume** | Row counts within expected thresholds | No empty or unexpectedly large tables |
| **Lock status** | No exclusive locks blocking reads | No blocking locks detected |
| **Replication lag** | If replica, lag within tolerance | Lag < configured threshold |

## Integration

- Consumes schema/table metadata from Doc 23 registries.
- Consumes endpoint definitions from Doc 22 (navigation contract).
- Results feed the readiness gate in the Validation Report.

## Output

Produces a `SourceReadinessReport` with per-object status and overall readiness verdict.
