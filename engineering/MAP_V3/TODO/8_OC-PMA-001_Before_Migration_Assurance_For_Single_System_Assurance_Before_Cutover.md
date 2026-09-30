We are introducing a new MAP Nexus capability:

**OC-PMA-001 — Before Migration Assurance / Single-System Assurance**

### Objective

MAP Nexus should support an **Enterprise-only Before Migration Assurance** capability.

Unlike the existing Migration Assurance workflow, which validates a **source system against a target system**, Before Migration Assurance validates **one system independently**.

Examples:

* assess a source system before migration;
* assess a target system before migration/cutover;
* establish a baseline of schema, structure, integrity and data quality;
* produce evidence showing the system's readiness/issues before a migration takes place.

### Critical architecture principle

**Do NOT create a second validation engine.**

The preferred architecture is:

```text
                    MAP Nexus Validation Engine
                              |
             +----------------+----------------+
             |                                 |
     Migration Assurance              Before Migration Assurance
       Source <-> Target                    Single System
             |                                 |
       reconciliation                    independent
       mapping validation                 assurance
       migration controls                 readiness controls
```

The two capabilities should share as much existing infrastructure as safely possible, including where appropriate:

* database/system connectors;
* discovery;
* dataset/table discovery;
* column discovery;
* metadata intelligence;
* profiling;
* rule registry;
* control registry;
* rule execution;
* checkpointing;
* retry/resilience;
* governance/audit;
* reporting;
* existing reusable controls/rules.

Do not duplicate existing rules or create parallel implementations merely because the execution context is different.

### Important safety requirement

Before writing any code, perform a **read-only architecture and implementation reconciliation**.

Do not modify code, database schema, migrations or frontend.

Do not commit anything.

### Investigate and report

1. **Existing validation architecture**

   * Identify the current execution entry point.
   * Identify the existing RuleExecutor, RuleFactory, control registry and rule registry.
   * Identify which controls already work independently against one dataset/system.
   * Identify which controls currently require both source and target.
   * Identify the safest reuse boundary.

2. **Execution model**
   Determine whether the existing execution framework can safely support a concept such as:

```text
validation_scope = MIGRATION
validation_scope = SINGLE_SYSTEM
```

or an equivalent model.

Do NOT assume that a new database column or enum is required.

Determine whether this can initially be represented through an orchestration/context object without changing the existing migration execution contract.

3. **Single-system controls**

Classify existing controls into:

```text
REUSABLE_AS_IS
REQUIRES_SINGLE_SYSTEM_ADAPTER
SOURCE_TARGET_ONLY
NEW_CONTROL_REQUIRED
```

Consider controls such as:

* schema/data-type assessment;
* column count;
* null/completeness;
* duplicate detection;
* primary-key validation;
* referential integrity;
* data profiling;
* data drift/baseline profiling;
* numeric/data-quality profiling;
* other existing controls.

Do not invent new controls if an existing control can safely be reused.

4. **Before Migration Assurance orchestration**

Propose the safest architecture for:

```text
System
   |
Discovery
   |
Profiling / Metadata Intelligence
   |
Applicable Controls
   |
Rule Execution
   |
Evidence
   |
Before Migration Assurance Report
```

The single-system flow must not attempt to perform source-to-target reconciliation or mapping.

5. **Existing reporting**

Determine whether the existing reporting/governance infrastructure can support a separate report type such as:

```text
Migration Assurance Report
Before Migration Assurance Report
```

without duplicating the reporting engine.

6. **Enterprise entitlement**

Before adding anything, inspect the existing subscription/entitlement model.

Determine:

* how Enterprise-only features are currently represented;
* whether a new entitlement is required;
* where that entitlement should live;
* how the frontend and backend currently enforce entitlements;
* how to avoid scattered `if enterprise` checks.

Do not invent an entitlement key without documenting why it is required and where it should be defined.

7. **Tenant/security scope**

The capability must remain tenant-scoped.

A user must only be able to run Before Migration Assurance against systems/connections belonging to their tenant, subject to existing RBAC and subscription entitlement.

8. **Existing database model**

Inspect the existing tables related to:

* systems;
* credentials/connections;
* datasets;
* dataset columns;
* mappings;
* validation batches/executions;
* controls;
* rules;
* reports/governance;
* subscriptions/entitlements.

Determine whether the existing model can represent single-system assurance without adding new tables.

Do not create a migration at this stage.

9. **UI integration**

Determine the safest future location in the existing product.

The likely conceptual flow is:

```text
Project
  |
  +-- Migration Assurance
  |      Source + Target
  |
  +-- Before Migration Assurance
         Single System
```

However, do not implement this yet.

Determine whether this should be a new project capability, project action, system action or assurance workspace based on the existing UI architecture.

10. **Backward compatibility**

Explicitly identify anything that could affect the existing:

```text
Source → Target
Discovery → Mapping → Validation → Results
```

workflow.

The existing migration-validation journey must continue to behave exactly as before.

### Required output

Produce a read-only reconciliation/design document:

`OC-PMA-001_Before_Migration_Assurance_Reconciliation_and_Architecture.md`

It must contain:

1. Current architecture findings
2. Reusable components
3. Controls reusable as-is
4. Controls requiring adaptation
5. Controls that remain source-target-only
6. Recommended single-system execution architecture
7. Recommended data-model approach
8. Recommended entitlement approach
9. Recommended UI integration
10. Tenant/security implications
11. Backward-compatibility analysis
12. Risks
13. Proposed implementation stages
14. Exact files likely to change
15. Any genuinely required database changes
16. Verification/test strategy

### Implementation stages to propose

At minimum consider:

**Stage A — Core architecture**

* single-system execution context/orchestration;
* reuse existing engine;
* no duplicated rules.

**Stage B — Controls**

* identify/reuse/adapt applicable controls.

**Stage C — Enterprise entitlement**

* backend enforcement;
* frontend visibility;
* subscription integration.

**Stage D — Reporting**

* Before Migration Assurance report/evidence.

**Stage E — UI**

* integrate into the existing MAP Nexus workflow.

**Stage F — Verification**

* Enterprise entitlement tests;
* non-Enterprise denial tests;
* tenant isolation;
* single-system execution;
* regression testing of existing Source → Target migration validation.

These are proposed stages only. Refine them based on the reconciliation.

### Absolute constraints

* No code changes.
* No database changes.
* No migrations.
* No new tables.
* No duplicated validation engine.
* No duplicated rule implementations.
* No frontend implementation.
* No commit.

This is a **design/reconciliation exercise only**.

After producing the reconciliation, stop and wait for review and approval before implementing anything.
