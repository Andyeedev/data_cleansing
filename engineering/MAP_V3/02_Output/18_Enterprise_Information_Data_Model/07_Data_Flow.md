# 07_Data_Flow.md

## Overview

This document describes the implemented data movement paths in the MAP Nexus platform, from discovery through reporting and audit.

---

## Discovery Flow

### Dataset Discovery

```mermaid
graph LR
    A[User] --> B[API Request]
    B --> C[system_service.py]
    C --> D[connection_config]
    D --> E[Target Database]
    E --> F[Schema Query]
    F --> G[core.datasets]
    F --> H[core.dataset_columns]
```

**Code Path:**
- `app/services/system_service.py` → `core.system_registry` (connection config)
- `app/services/dataset_discovery_service.py` → `core.datasets` + `core.dataset_columns`

**Tables Involved:**
- `core.system_registry` (source of connection details)
- `core.datasets` (discovered tables)
- `core.dataset_columns` (discovered columns)

**Evidence:** `app/services/dataset_discovery_service.py`

---

## Mapping Flow

### Dataset Mapping Creation

```mermaid
graph LR
    A[User] --> B[API Request]
    B --> C[mapping_validator.py]
    C --> D[core.dataset_mappings]
    D --> E[core.dataset_columns]
    D --> F[core.column_mappings]
    D --> G[core.rule_dataset_mapping]
```

**Code Path:**
- `app/services/mapping_validator.py` → `core.dataset_mappings` (validation)
- `app/services/mapping_resolver.py` → `core.dataset_mappings` (resolution)

**Tables Involved:**
- `core.dataset_mappings` (source-to-target table mappings)
- `core.dataset_columns` (column metadata)
- `core.column_mappings` (source-to-target column mappings)
- `core.rule_dataset_mapping` (rule-to-mapping links)

**Evidence:** `app/services/mapping_validator.py:33-47`

---

## Execution Flow

### Validation Execution

```mermaid
graph TD
    A[User] --> B[API Request]
    B --> C[execution_service.py]
    C --> D[ExecutionEngine]
    D --> E[engine.control_registry]
    D --> F[engine.rule_registry]
    D --> G[core.dataset_mappings]
    D --> H[Source Database]
    D --> I[Target Database]
    H --> J[SQL Execution]
    I --> J
    J --> K[engine.migration_validation_batch]
    J --> L[engine.migration_control_execution]
    J --> M[engine.migration_control_exceptions]
    J --> N[engine.migration_exception_register]
    J --> O[engine.migration_control_summary]
    J --> P[engine.migration_batch_summary]
```

**Code Path:**
- `app/services/execution_service.py` → `app/execution_engine.py`
- `ExecutionEngine.run()` → validates batch execution
- Results written to `engine.migration_validation_batch` and child tables

**Tables Involved:**
- `engine.migration_validation_batch` (batch record)
- `engine.migration_control_execution` (control results)
- `engine.migration_control_summary` (control summaries)
- `engine.migration_control_exceptions` (exception details)
- `engine.migration_exception_register` (exception register)

**Evidence:** `app/services/execution_service.py:64-82`

---

## Governance Intelligence Flow

### Anomaly Detection

```mermaid
graph TD
    A[migration_validation_batch] --> B[run_governance_intelligence]
    C[governance_config] --> B
    B --> D[Rolling Statistics]
    B --> E[Risk Heat Index]
    B --> F[Repeat Failure Index]
    B --> G[Execution Duration Z-Score]
    D --> H[Combined Anomaly Score]
    E --> H
    F --> H
    G --> H
    H --> I{Score > Threshold?}
    I -->|Yes| J[Auto-Block]
    I -->|No| K[Certified]
    J --> L[migration_batch_intelligence]
    K --> L
```

**Code Path:**
- `engine.run_governance_intelligence(batch_id)` (PostgreSQL function)
- Reads `engine.governance_config` for parameters
- Calculates rolling statistics from `engine.migration_validation_batch`
- Writes to `engine.migration_batch_intelligence`

**Tables Involved:**
- `engine.governance_config` (input parameters)
- `engine.migration_validation_batch` (input data)
- `engine.migration_batch_intelligence` (output scores)

**Evidence:** `engine_backup.sql:60-263`

---

## Reporting Flow

### Dashboard Views

```mermaid
graph TD
    A[engine.migration_validation_batch] --> B[v_fact_batch]
    C[engine.migration_release_decision] --> B
    D[engine.migration_control_summary] --> E[v_fact_control]
    F[engine.migration_batch_intelligence_OLD] --> G[v_batch_governance_intelligence]
    A --> G
    H[engine.migration_control_execution] --> I[v_migration_executive_summary]
    J[engine.migration_batch_summary] --> I
    A --> I
```

**Views:**
- `reporting.v_fact_batch` — Batch facts with release decisions
- `reporting.v_fact_control` — Control execution summaries
- `reporting.v_batch_governance_intelligence` — Governance intelligence metrics
- `engine.v_migration_executive_summary` — Executive dashboard
- `engine.v_migration_control_summary` — Control summaries
- `engine.v_migration_exception_detail` — Exception drill-down
- `engine.v_migration_score_trend` — Score trend analysis

**Evidence:** `engine_backup.sql:1567-1961`

---

## Audit Flow

### API Request Logging

```mermaid
graph LR
    A[API Request] --> B[Audit Middleware]
    B --> C[audit.api_logs]
    B --> D[audit.audit_events]
    B --> E[audit.security_events]
```

**Code Path:**
- `app/api/core/middleware/audit_middleware.py` logs all API calls
- Security events logged by `app/api/core/auth/auth_service.py`

**Tables Involved:**
- `audit.api_logs` (API request/response logs)
- `audit.audit_events` (general audit events)
- `audit.security_events` (security-specific events)
- `audit.login_history` (login attempts)
- `audit.configuration_history` (config changes)

**Evidence:** `app/api/core/middleware/audit_middleware.py`

---

## Notification Flow

### User Notifications

```mermaid
graph TD
    A[Platform Event] --> B[notification_service.py]
    B --> C[platform.notifications]
    C --> D[In-App Notification]
    C --> E[Email Notification]
    C --> F[Push Notification]
    G[platform.notification_preferences] --> B
```

**Code Path:**
- `app/services/notification_service.py` → `platform.notifications`
- Respects `platform.notification_preferences` for channel selection

**Tables Involved:**
- `platform.notifications` (notification records)
- `platform.notification_preferences` (channel preferences)

**Evidence:** `app/services/notification_service.py`

---

## Workflow Flow

### Workflow Execution

```mermaid
graph TD
    A[User] --> B[API Request]
    B --> C[workflow_service.py]
    C --> D[platform.workflow_definitions]
    D --> E[platform.workflow_instances]
    E --> F[platform.workflow_step_instances]
    E --> G[platform.workflow_history]
    H[platform.approval_templates] --> I[platform.approval_requests]
    I --> J[platform.approval_step_instances]
```

**Code Path:**
- `app/services/workflow_service.py` → `platform.workflow_definitions`
- Creates `platform.workflow_instances` and `platform.workflow_step_instances`
- Tracks history in `platform.workflow_history`

**Tables Involved:**
- `platform.workflow_definitions` (workflow templates)
- `platform.workflow_instances` (running workflows)
- `platform.workflow_step_instances` (workflow steps)
- `platform.workflow_history` (audit trail)

**Evidence:** `app/services/workflow_service.py`

---

## Task Flow

### Task Management

```mermaid
graph TD
    A[User] --> B[API Request]
    B --> C[task_service.py]
    C --> D[platform.tasks]
    D --> E[platform.task_comments]
    D --> F[platform.task_dependencies]
    G[platform.users] --> D
    H[core.projects] --> D
```

**Code Path:**
- `app/services/task_service.py` → `platform.tasks`
- Comments via `platform.task_comments`
- Dependencies via `platform.task_dependencies`

**Tables Involved:**
- `platform.tasks` (task records)
- `platform.task_comments` (task discussions)
- `platform.task_dependencies` (task relationships)

**Evidence:** `app/services/task_service.py`

---

## Data Movement Summary

| Flow | Source | Destination | Trigger |
|------|--------|-------------|---------|
| Discovery | Target Database | `core.datasets`, `core.dataset_columns` | User action |
| Mapping | User input | `core.dataset_mappings`, `core.column_mappings` | User action |
| Execution | Source/Target DBs | `engine.migration_*` tables | User action |
| Governance | `engine.migration_validation_batch` | `engine.migration_batch_intelligence` | Execution complete |
| Reporting | `engine.*` tables | `reporting.*` views | Query time |
| Audit | API requests | `audit.*` tables | Every request |
| Notifications | Platform events | `platform.notifications` | Event trigger |
| Workflow | User actions | `platform.workflow_*` tables | User action |
| Tasks | User actions | `platform.tasks` tables | User action |

---

**Version:** 2.1

**Status:** Current State Documentation
