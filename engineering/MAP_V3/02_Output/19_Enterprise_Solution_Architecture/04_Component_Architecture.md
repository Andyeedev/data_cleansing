# 04_Component_Architecture.md

# Component Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document identifies the 8 implemented components, their responsibilities, inputs, outputs, dependencies, and evidence.

---

## 1. Connection Resolver

### Purpose
Resolves database connections for SOURCE and TARGET systems from the `core.system_registry` table, decrypts credentials, and creates appropriate database adapters.

### Responsibilities
- Load system registry from database for a project
- Resolve credentials via `EncryptionManager`
- Build database adapters via `connection_factory()`
- Support multiple SOURCE and TARGET systems per project
- Skip inactive systems

### Inputs
- `project_id` (string) — identifies the project scope

### Outputs
- `connections` dict: `{ "SOURCE": { system_id: adapter }, "TARGET": { system_id: adapter } }`

### Dependencies
- `app/db/connection_factory.py:6` — adapter factory
- `app/api/core/encryption_manager.py` — credential decryption
- `app/db/adapters/*` — 7 database adapters
- PostgreSQL: `core.system_registry`, `core.system_credentials`

### Evidence
| Component | File Path |
|-----------|-----------|
| Connection resolver | `app/db/connection_resolver.py:7` |
| Connection factory | `app/db/connection_factory.py:6` |
| Base adapter | `app/db/adapters/base_adapter.py` |
| Postgres adapter | `app/db/adapters/postgres_adapter.py` |

---

## 2. Dataset Discovery

### Purpose
Discovers source and target tables from connected databases, matches tables by naming convention, and creates dataset mappings in the `core.dataset_mappings` table.

### Responsibilities
- Fetch table lists from source and target databases
- Match tables by name pattern (`*_source` → `*_target`)
- Create dataset mappings in the database
- Discover columns and infer roles (PRIMARY_KEY, NUMERIC_METRIC, AUDIT_COLUMN)

### Inputs
- `engine_db` — database connection
- `project_id` — project scope

### Outputs
- Dataset mappings in `core.dataset_mappings`
- Column metadata in `core.dataset_columns`

### Dependencies
- `app/db_connector.py` — database connectivity
- `app/services/metadata_intelligence_service.py` — column role inference
- PostgreSQL: `core.system_registry`, `core.dataset_mappings`, `core.dataset_columns`

### Evidence
| Component | File Path |
|-----------|-----------|
| Dataset discovery service | `app/services/dataset_discovery_service.py:4` |
| Metadata intelligence | `app/services/metadata_intelligence_service.py:1` |
| CLI discover command | `app/main.py:49` |

---

## 3. Rule Executor

### Purpose
Executes validation rules for a given control_id by iterating over rule entities, resolving parameters, executing rules via `RuleFactory`, and logging results to the database.

### Responsibilities
- Fetch enabled rules from `engine.rule_registry`
- Resolve rule entities from `core.dataset_mappings`
- Build parameters (source/target schemas, primary keys, numeric columns)
- Execute rules via `RuleFactory.create()` with retry protection
- Log execution results to `engine.migration_control_execution`
- Classify slow queries (NORMAL, SLOW, VERY_SLOW)

### Inputs
- `engine_db`, `source_db`, `target_db` — database connections
- `batch_id`, `project_id`, `control_id` — execution context
- `source_connections`, `target_connections` — multi-system adapters

### Outputs
- Execution results logged to `engine.migration_control_execution`
- Control summary logged to `engine.migration_control_summary`
- Exceptions logged to `engine.migration_control_exceptions`

### Dependencies
- `app/rule_factory.py:1` — rule creation
- `app/rules/*` — 10 rule implementations
- `app/parameter_injector.py` — parameter injection
- PostgreSQL: `engine.rule_registry`, `engine.migration_control_execution`

### Evidence
| Component | File Path |
|-----------|-----------|
| Rule executor | `app/rule_executor.py:14` |
| Rule factory | `app/rule_factory.py:1` |
| Base rule | `app/rules/base_rule.py:1` |
| C01 row count rule | `app/rules/C01_row_count_rule.py` |
| C02 sum compare rule | `app/rules/C02_sum_compare_rule.py` |
| C03 referential rule | `app/rules/C03_referential_rule.py` |
| C04 column count rule | `app/rules/C04_column_count_rule.py` |
| C05 column null compare | `app/rules/C05_column_null_compare_rule.py` |
| C06 data type match | `app/rules/C06_data_type_match_rule.py` |
| C07 duplicate detection | `app/rules/C07_duplicate_detection_rule.py` |
| C08 data drift detection | `app/rules/C08_data_drift_detection_rule.py` |
| C09 referential coverage | `app/rules/C09_referential_coverage_rule.py` |
| C010 schema drift | `app/rules/C010_schema_drift_rule.py` |

---

## 4. Control Executor

### Purpose
Executes a control by looking up the control class in `CONTROL_REGISTRY`, falling back to `RuleAdapterControl` for standard controls. Provides safe execution with timing, audit logging, and error handling.

### Responsibilities
- Look up control class in `CONTROL_REGISTRY`
- Fall back to `RuleAdapterControl` for unmapped controls
- Execute control with timing
- Log audit events
- Return `ExecutionResult` with status and timing

### Inputs
- `context` — `ExecutionContext` (batch_id, project_id, engine_db, source_db, target_db, config)
- `control_id` — identifier of the control to execute

### Outputs
- `ExecutionResult` with status (PASS/FAIL/ERROR), message, execution_time_ms

### Dependencies
- `app/execution/execution_context.py:1` — context object
- `app/execution/execution_result.py` — result object
- `app/execution/control_registry.py:4` — control class registry
- `app/controls/base_control.py:9` — abstract base class
- `app/controls/rule_adapter_control.py:5` — default control adapter

### Evidence
| Component | File Path |
|-----------|-----------|
| Control executor | `app/execution/control_executor.py:11` |
| Control registry | `app/execution/control_registry.py:4` |
| Execution context | `app/execution/execution_context.py:1` |
| Execution result | `app/execution/execution_result.py` |
| Base control | `app/controls/base_control.py:9` |
| Rule adapter control | `app/controls/rule_adapter_control.py:5` |

---

## 5. Governance Engine

### Purpose
Evaluates migration governance decisions based on control execution results, calculates risk scores, records decisions, and enforces release gates.

### Responsibilities
- Calculate risk scores from execution failures/errors
- Classify risk level (LOW < 5%, MEDIUM < 15%, HIGH ≥ 15%)
- Record governance decisions to `engine.migration_control_decisions`
- Enforce release gate (APPROVED/REJECTED) based on status and score thresholds
- Block releases when CRITICAL failures detected

### Inputs
- `batch_id` — execution batch identifier
- Execution results from `engine.migration_control_execution`

### Outputs
- Risk scores in `engine.migration_risk_scores`
- Governance decisions in `engine.migration_control_decisions`
- Release decisions in `engine.migration_release_decision`
- Governance status in `engine.migration_governance_status`

### Dependencies
- `app/governance/decision_engine.py:3` — decision recording
- `app/governance/risk_scoring.py:1` — risk calculation
- PostgreSQL: `engine.migration_control_execution`, `engine.migration_governance_status`

### Evidence
| Component | File Path |
|-----------|-----------|
| Decision engine | `app/governance/decision_engine.py:3` |
| Risk scoring | `app/governance/risk_scoring.py:1` |
| Governance evaluation | `app/execution_engine.py:841` |
| Release gate | `app/execution_engine.py:736` |

---

## 6. Workflow Engine

### Purpose
Manages workflow definitions, instances, and execution. Supports workflow creation, update, execution, and instance tracking.

### Responsibilities
- List, create, update, delete workflow definitions
- Execute workflows and create instances
- Track workflow instance status
- Support workflow versioning

### Inputs
- `conn` — database connection
- `tenant_id` — multi-tenant scope
- Workflow definition payloads

### Outputs
- Workflow records in `platform.workflow_definitions`
- Workflow instances in `platform.workflow_instances`

### Dependencies
- `app/services/workflow_service.py:10` — service implementation
- PostgreSQL: `platform.workflow_definitions`, `platform.workflow_instances`

### Evidence
| Component | File Path |
|-----------|-----------|
| Workflow service | `app/services/workflow_service.py:10` |
| Workflow routes | `app/api/routes/workflow_routes.py` |

---

## 7. Notification Service

### Purpose
Manages user notifications including creation, listing, marking as read, and preference management.

### Responsibilities
- List notifications for a user with filtering
- Create notifications with severity levels
- Mark notifications as read (single and bulk)
- Manage notification preferences
- Count unread notifications

### Inputs
- `user_id` — target user
- `tenant_id` — multi-tenant scope
- Notification payloads

### Outputs
- Notification records in `platform.notifications`
- Preference records in `platform.notification_preferences`

### Dependencies
- `app/services/notification_service.py:8` — service implementation
- PostgreSQL: `platform.notifications`, `platform.notification_preferences`

### Evidence
| Component | File Path |
|-----------|-----------|
| Notification service | `app/services/notification_service.py:8` |
| Notification routes | `app/api/routes/notification_routes.py` |

---

## 8. Task Service

### Purpose
Manages tasks including creation, assignment, status tracking, comments, and user-specific task views.

### Responsibilities
- List tasks with filtering (status, priority, assigned_to)
- Create, update, delete tasks
- Add comments to tasks
- Track task completion percentage
- Provide "My Tasks" view

### Inputs
- `conn` — database connection
- `tenant_id` — multi-tenant scope
- Task payloads

### Outputs
- Task records in `platform.tasks`
- Task comments in `platform.task_comments`

### Dependencies
- `app/services/task_service.py:10` — service implementation
- PostgreSQL: `platform.tasks`, `platform.task_comments`

### Evidence
| Component | File Path |
|-----------|-----------|
| Task service | `app/services/task_service.py:10` |
| Task routes | `app/api/routes/task_routes.py` |

---

## Component Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    ExecutionEngine                           │
│              (app/execution_engine.py:24)                    │
└─────────┬───────────────┬───────────────┬──────────────────┘
          │               │               │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ Connection│   │  Dataset  │   │   Rule    │
    │ Resolver  │   │ Discovery │   │ Executor  │
    │ (db/)     │   │ (services)│   │ (rules/)  │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │               │
    ┌─────▼───────────────▼───────────────▼─────┐
    │           Control Executor                  │
    │         (execution/)                        │
    └─────────────────────┬──────────────────────┘
                          │
    ┌─────────────────────▼──────────────────────┐
    │         Governance Engine                    │
    │       (governance/)                          │
    └─────────────────────┬──────────────────────┘
                          │
    ┌─────────────────────▼──────────────────────┐
    │         Workflow / Task / Notification       │
    │         (services/)                          │
    └─────────────────────────────────────────────┘
```

---

## Summary

| Component | File | Purpose |
|-----------|------|---------|
| Connection Resolver | `app/db/connection_resolver.py:7` | Resolve DB connections |
| Dataset Discovery | `app/services/dataset_discovery_service.py:4` | Discover tables & mappings |
| Rule Executor | `app/rule_executor.py:14` | Execute validation rules |
| Control Executor | `app/execution/control_executor.py:11` | Execute controls safely |
| Governance Engine | `app/governance/decision_engine.py:3` | Governance decisions |
| Workflow Engine | `app/services/workflow_service.py:10` | Workflow management |
| Notification Service | `app/services/notification_service.py:8` | User notifications |
| Task Service | `app/services/task_service.py:10` | Task management |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 30+*
