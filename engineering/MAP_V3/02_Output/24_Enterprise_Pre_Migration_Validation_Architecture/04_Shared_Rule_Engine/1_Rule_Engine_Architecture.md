# Rule Engine Architecture

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 04_Shared_Rule_Engine / 1_Rule_Engine_Architecture

---

## Purpose

Define the shared engine that parses, compiles, and executes validation rules across all three validation modes.

## Architecture

```
Rule Registry → Rule Parser → Rule Compiler → Execution Context → Results Store
                                   ↓
                          Per-mode runners
                         (Source / Target / Migration)
```

## Engine Capabilities

| Capability | Description |
|------------|-------------|
| **Rule parsing** | Parse rule definitions from the registry into an AST |
| **Rule compilation** | Compile AST into executable validation plans |
| **Execution context** | Manage connections, sampling, thresholds per run |
| **Parallel execution** | Run independent rules concurrently |
| **Dependency resolution** | Order dependent rules sequentially |
| **Result collection** | Aggregate results into the standard result schema |
| **Audit** | Emit audit events per rule execution (Doc 21) |

## Rule Expression Language

Rules are defined declaratively in a structured format (YAML/JSON) and compiled into execution plans. The engine supports:

- Column-level predicates (null_rate, range, pattern)
- Table-level predicates (row_count, checksum, aggregate)
- Cross-table predicates (FK integrity, aggregate comparison)
- Business logic predicates (expression evaluation)
