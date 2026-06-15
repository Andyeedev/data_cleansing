You are performing a codebase architecture review.

I have a migration validation engine with these folders:

app/
├── execution/
├── controls/
├── rules/

The rules folder contains the actual validation implementations:

C01_row_count_rule.py
C02_sum_compare_rule.py
C03_referential_rule.py
C04_column_count_rule.py
C05_column_null_compare_rule.py
C06_data_type_match_rule.py
C07_duplicate_detection_rule.py
C08_data_drift_detection_rule.py
C09_referential_coverage_rule.py
C010_schema_drift_rule.py

Runtime failures currently include:

ModuleNotFoundError:
app.controls.c02_balance_recon

ModuleNotFoundError:
app.controls.c03_referential

ImportError:
cannot import name 'ControlExecutor'
from app.execution.control_executor

I suspect execution/ and controls/ were introduced during a refactor to provide:

* structured logging
* control lifecycle management
* DAG execution
* retries
* execution tracking

but the migration from rules/ to controls/ was never completed.

Please analyse:

1. The intended architecture.
2. Whether controls/ is a wrapper layer around rules/.
3. Whether execution/control_registry.py is referencing modules that do not physically exist.
4. Whether the codebase should:
   a) continue using controls/ as an abstraction layer, or
   b) simplify and execute rules directly.
5. Identify all broken imports.
6. Identify all orphaned controls.
7. Identify all orphaned rules.
8. Determine why ControlExecutor import failures occur.
9. Produce a remediation plan with lowest risk and minimal regression.
10. Do not make assumptions. Base conclusions only on actual code relationships and imports.

Return:

* Architecture diagram
* Root cause analysis
* Risk assessment
* Recommended fix strategy
* Exact files requiring modification
* Any dead code that should be removed


*****************************************************
Analysis & Reviews
*****************************************************
✦ I have completed a comprehensive architectural review of the migration validation
  engine. Based on the code analysis, here is the full report.

  1. Architecture Diagram (Current vs. Intended)

  The system is currently in a "half-migrated" state between a mature rule-based engine
  and a newer, incomplete control-based orchestration layer.

  Current (Broken) Flow:

    1 graph TD
    2     EE[ExecutionEngine] -->|Try Import| CE[ControlExecutor]
    3     CE -->|Lookup| CR[ControlRegistry]
    4     CR -->|Broken Import| C02[c02_balance_recon.py - MISSING]
    5     CR -->|Broken Import| C03[c03_referential.py - MISSING]
    6     CR -->|Import| C01[c01_rowcount.py - Prototype]
    7     C01 -->|Hardcoded SQL| TargetDB[(Target DB)]
    8     
    9     subgraph "Orphaned Layer (Mature)"
   10         RE[RuleExecutor] -->|Factory| RF[RuleFactory]
   11         RF -->|Create| Rules[C01..C010 Rules]
   12         Rules -->|Generic SQL| SourceDB[(Source DB)]
   13     end

  Intended Architecture (Clean Layering):
   1. Orchestration Layer (app/execution/): Manages DAGs, retries, and batch context.
   2. Abstraction Layer (app/controls/): Logical grouping of validations. Should act as
      a wrapper around one or many rules.
   3. Logic Layer (app/rules/): Reusable, parameterized SQL validation units.

  ---

  2. Root Cause Analysis

   * Incomplete Refactor: The controls/ layer was intended to wrap rules/, but only a
     hardcoded prototype (c01_rowcount.py) was created.
   * Broken Registry: app/execution/control_registry.py references files
     (c02_balance_recon, c03_referential) that do not exist on disk.
   * Path Mismatches: Files like app/controls/control_runtime.py attempt to import from
     app.execution.loader.control_loader, which does not exist.
   * Namespace Collisions: There are multiple __init__ methods (e.g., __init___legacy in
     ExecutionEngine) and conflicting loader implementations (control_loader.py vs
     control_registry.py), indicating multiple developers or AI agents worked on the
     refactor without a unified plan.

  ---

  3. Risk Assessment

   * High Risk: The current ExecutionEngine is failing at runtime due to
     ModuleNotFoundError during control lookup.
   * Medium Risk: The rules/ logic is healthy but currently "unreachable" through the
     new ControlExecutor path.
   * Low Risk: Data integrity is not currently at risk because the engine fails before
     performing any write operations.

  ---

  4. Recommended Fix Strategy

  Strategy: "The Adapter Pattern"
  Instead of rewriting all rules as controls, we should implement a RuleAdapterControl.
  This allows the new ExecutionEngine to use its advanced orchestration features (DAGs,
  retries) while delegating the actual validation logic to the existing, proven
  RuleExecutor and rules/ classes.

  ---

  5. Exact Files Requiring Modification/Action

  ┌──────────────────────────────────────┬──────────┬───────────────────────────────┐
  │ File                                 │ Status   │ Action Required               │
  ├──────────────────────────────────────┼──────────┼───────────────────────────────┤
  │ app/execution/control_registry.py    │ CRITICAL │ Remove broken imports (C02,   │
  │                                      │          │ C03).                         │
  │ app/execution/control_executor.py    │ CRITICAL │ Add fallback to               │
  │                                      │          │ RuleAdapterControl for all    │
  │                                      │          │ IDs not in registry.          │
  │ app/controls/rule_adapter_control.py │ NEW      │ Create this to bridge         │
  │                                      │          │ BaseControl context to        │
  │                                      │          │ RuleExecutor.                 │
  │ app/controls/c01_rowcount.py         │ DEAD     │ Remove (it is hardcoded and   │
  │                                      │ CODE     │ redundant with                │
  │                                      │          │ C01_row_count_rule.py).       │
  │ app/controls/control_loader.py       │ DEAD     │ Remove (conflicts with        │
  │                                      │ CODE     │ control_registry.py pattern). │
  │ app/controls/control_runtime.py      │ DEAD     │ Remove (redundant with        │
  │                                      │ CODE     │ ControlExecutor).             │
  └──────────────────────────────────────┴──────────┴───────────────────────────────┘
  ---

  6. Summary of Dead/Orphaned Code

   1. Orphaned Rules: All rules in app/rules/ (C02-C010) are currently orphaned because
      the ControlRegistry only successfully "knows" about C01.
   2. Orphaned Controls: app/controls/base_control.py is orphaned as nothing
      successfully inherits from it in a functional way.
   3. Broken Loaders: app/controls/control_loader.py is entirely non-functional due to
      incorrect internal paths.

  Would you like me to proceed with creating the RuleAdapterControl and cleaning up the
  registry,