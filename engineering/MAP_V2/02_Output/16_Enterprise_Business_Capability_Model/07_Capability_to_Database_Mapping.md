# Capability to Database Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Database Table Mapping  

---

## 1. Purpose

This document maps each business capability to its corresponding database schemas, tables, and views.

---

## 2. Schema Overview

| Schema | Tables | Views | Owner |
|--------|--------|-------|-------|
| core | 8 | 0 | Shared |
| engine | 22 | 10 | Python Engine |
| platform | 23 | 0 | Platform |
| reporting | 3 | 5 | Reporting/BI |
| audit | 5 | 0 | Audit/Compliance |
| **Total** | **61** | **15** | |

---

## 3. Capability to Schema Mapping

### 3.1 Migration Management Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| Project Management | core, engine | projects, migration_validation_batch, dataset_mappings | — |
| Connection Management | core | system_registry, system_credentials | — |
| Dataset Discovery | core, engine | dataset_mappings, dataset_columns, rule_dataset_mapping, rule_registry | — |
| Dataset Mapping | core | dataset_mappings, rule_dataset_mapping | — |
| Column Mapping | core | dataset_columns, column_mappings | — |

### 3.2 Validation Management Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| Rule Discovery | engine, core | rule_registry, rule_dataset_mapping, dataset_columns | — |
| Control Discovery | engine | control_registry | — |
| Validation Execution | engine | migration_validation_batch, migration_batch_registry, migration_control_summary, migration_control_execution, migration_control_exceptions | — |
| Checkpointing | engine | batch_execution_checkpoint, migration_batch_registry | — |
| Retry Engine | — | — | — |

### 3.3 Governance & Compliance Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| Governance Decisions | engine | migration_governance_status, migration_control_decisions | — |
| Risk Scoring | engine | migration_risk_scores | — |
| Release Gates | engine | migration_release_decision | — |
| Approvals | platform | approval_requests, approval_step_instances | — |

### 3.4 Reporting & Analytics Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| Executive Reporting | engine, reporting | — | v_migration_executive_summary, v_fact_batch |
| Operational Reporting | engine | — | v_migration_control_summary |
| Governance Reporting | engine | — | v_migration_governance_report |
| Technical Reporting | engine | — | v_migration_exception_detail |
| Dashboard Services | reporting | dim_date, dim_severity, dim_status | v_fact_batch, v_fact_control |
| Export Services | — | — | — |

### 3.5 Platform Services Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| Workflow Management | platform | workflow_definitions, workflow_instances, workflow_step_instances, workflow_history | — |
| Task Management | platform | tasks, task_comments, task_dependencies | — |
| Notification Services | platform | notifications, notification_preferences | — |
| Calendar Services | platform | calendar_events, calendar_event_reminders | — |
| AI / MAP Copilot | — | — | — |
| Authentication | platform | users, refresh_tokens, user_sessions | — |

### 3.6 Administration Domain

| Capability | Schema | Tables | Views |
|-----------|--------|--------|-------|
| User Management | platform | users, user_roles | — |
| Role & Permission Management | platform | roles, permissions, role_permissions | — |
| Tenant Management | core | tenants | — |
| System Settings | platform | system_settings | — |
| Feature Flags | platform | feature_flags | — |
| Security Management | audit | security_events | — |
| Audit Trail | audit | audit_events, api_call_log, data_access_log, system_events | — |
| Maintenance & Health | — | — | — |

---

## 4. Schema to Capability Mapping

### 4.1 Core Schema (8 Tables)

| Table | Capability | Purpose |
|-------|-----------|---------|
| tenants | Tenant Management | Multi-tenant isolation |
| projects | Project Management | Migration projects |
| system_registry | Connection Management | Source/target systems |
| datasets | Dataset Discovery | Discovered tables |
| dataset_mappings | Dataset Mapping | Table mappings |
| dataset_columns | Column Mapping | Column metadata |
| column_mappings | Column Mapping | Column pairs |
| rule_dataset_mapping | Rule Discovery | Rule-to-mapping binding |

### 4.2 Engine Schema (22 Tables + 10 Views)

| Table | Capability | Purpose |
|-------|-----------|---------|
| control_registry | Control Discovery | Validation controls |
| rule_registry | Rule Discovery | Rule definitions |
| governance_config | Governance Decisions | Governance settings |
| migration_validation_batch | Validation Execution | Master batch record |
| migration_batch_summary | Validation Execution | Batch outcomes |
| migration_control_execution | Validation Execution | Rule execution results |
| migration_control_summary | Validation Execution | Control aggregation |
| migration_control_exceptions | Validation Execution | Exception records |
| migration_exception_register | Validation Execution | Row-level exceptions |
| migration_release_decision | Release Gates | Release decisions |
| migration_batch_intelligence | Risk Scoring | AI anomaly scores |
| batch_anomaly_analysis | Risk Scoring | Anomaly breakdown |
| batch_intelligence | Risk Scoring | Intelligence record |
| batch_rule_scores | Risk Scoring | Per-rule scoring |
| control_persistence_analysis | Governance Decisions | Repeat failure tracking |
| rule_anomaly_history | Risk Scoring | Historical anomalies |
| rule_execution_statistics | Risk Scoring | Performance statistics |
| rule_weight_config | Risk Scoring | Rule weights |
| rule_weights | Risk Scoring | Integer weights |
| batch_execution_checkpoint | Checkpointing | Resume state |
| migration_governance_status | Governance Decisions | Decision status |
| v_migration_control_summary | Operational Reporting | Control summary view |
| v_migration_executive_summary | Executive Reporting | Executive summary view |
| v_migration_exception_detail | Technical Reporting | Exception detail view |
| v_migration_governance_report | Governance Reporting | Governance report view |
| v_migration_summary | Operational Reporting | Migration summary view |
| v_top_failures | Technical Reporting | Top failures view |
| v_control_results | Operational Reporting | Control results view |
| v_migration_risk | Risk Scoring | Risk report view |
| v_exception_summary | Technical Reporting | Exception summary view |
| v_governance_decisions | Governance Reporting | Governance decisions view |

### 4.3 Platform Schema (23 Tables)

| Table | Capability | Purpose |
|-------|-----------|---------|
| users | User Management, Authentication | User identity |
| refresh_tokens | Authentication | JWT refresh tokens |
| user_sessions | Authentication | Session tracking |
| user_roles | User Management | User-role junction |
| roles | Role Management | RBAC roles |
| permissions | Role Management | Granular permissions |
| role_permissions | Role Management | Role-permission junction |
| workflow_definitions | Workflow Management | Workflow templates |
| workflow_instances | Workflow Management | Running instances |
| workflow_step_instances | Workflow Management | Step execution |
| workflow_history | Workflow Management | Audit trail |
| approval_templates | Approvals | Approval templates |
| approval_requests | Approvals | Pending requests |
| approval_step_instances | Approvals | Step execution |
| tasks | Task Management | Task management |
| task_comments | Task Management | Task comments |
| task_dependencies | Task Management | Dependency DAG |
| notifications | Notification Services | User notifications |
| notification_preferences | Notification Services | Channel settings |
| calendar_events | Calendar Services | Calendar events |
| calendar_event_reminders | Calendar Services | Event reminders |
| system_settings | System Settings | Platform configuration |
| feature_flags | Feature Flags | Feature toggles |

### 4.4 Reporting Schema (3 Tables + 5 Views)

| Table/View | Capability | Purpose |
|-----------|-----------|---------|
| dim_date | Dashboard Services | Date dimension |
| dim_severity | Dashboard Services | Severity dimension |
| dim_status | Dashboard Services | Status dimension |
| v_batch_governance_intelligence | Governance Reporting | Governance intelligence view |
| v_fact_batch | Dashboard Services | Batch fact table |
| v_fact_control | Dashboard Services | Control fact table |
| v_migration_executive_summary | Executive Reporting | Executive summary view |
| v_migration_control_summary | Operational Reporting | Control summary view |

### 4.5 Audit Schema (5 Tables)

| Table | Capability | Purpose |
|-------|-----------|---------|
| audit_events | Audit Trail | API call audit trail |
| security_events | Security Management | Security events |
| api_call_log | Audit Trail | API request/response logging |
| data_access_log | Audit Trail | Data access tracking |
| system_events | Audit Trail | System lifecycle events |

---

## 5. Database Statistics

| Metric | Count |
|--------|-------|
| Total Tables | 61 |
| Total Views | 15 |
| Schemas | 5 |
| Cross-Schema Dependencies | 9 |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*