# Capability to Database Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Schema Ownership

| Schema | Tables | Owner Domain |
|--------|--------|-------------|
| core | 8 | Migration Management |
| engine | 22 | Validation Management, Governance & Compliance |
| platform | 22 | Platform Services, Administration |
| reporting | 3 + 5 views | Reporting & Analytics |
| audit | 5 | Administration (Audit Trail) |

---

## 2. Capability to Table Mapping

| Capability | Schema | Tables |
|-----------|--------|--------|
| Project Management | core, engine | core.projects, engine.migration_validation_batch, engine.migration_batch_registry |
| Connection Management | core | core.system_registry, core.system_credentials |
| Dataset Discovery | core, engine | core.dataset_mappings, core.dataset_columns, core.rule_dataset_mapping |
| Dataset Mapping | core | core.dataset_mappings, core.rule_dataset_mapping |
| Column Mapping | core | core.dataset_columns, core.column_mappings |
| Rule Discovery | engine, core | engine.rule_registry, core.rule_dataset_mapping |
| Control Discovery | engine | engine.control_registry |
| Validation Execution | engine | engine.migration_validation_batch, engine.migration_batch_registry, engine.migration_control_execution, engine.migration_control_summary, engine.migration_control_exceptions, engine.migration_batch_summary |
| Checkpointing | engine | engine.batch_execution_checkpoint |
| Governance Decisions | engine | engine.migration_governance_status, engine.migration_control_decisions |
| Risk Scoring | engine | engine.migration_risk_scores |
| Release Gates | engine | engine.migration_release_decision |
| Executive Reporting | engine, reporting | engine.v_migration_executive_summary, reporting.v_fact_batch |
| Operational Reporting | engine | engine.v_migration_control_summary |
| Governance Reporting | engine | engine.v_governance_decisions |
| Technical Reporting | engine | engine.v_exception_detail, engine.v_top_failures |
| Dashboard Services | reporting | reporting.v_fact_batch, reporting.v_fact_control |
| Workflow Management | platform | platform.workflow_definitions, platform.workflow_instances, platform.workflow_step_instances, platform.workflow_history |
| Task Management | platform | platform.tasks, platform.task_comments, platform.task_dependencies |
| Notification Services | platform | platform.notifications, platform.notification_preferences |
| Calendar Services | platform | platform.calendar_events, platform.calendar_event_reminders |
| Authentication | platform | platform.users, platform.user_sessions, platform.refresh_tokens |
| User Management | platform | platform.users, platform.user_roles |
| Role Management | platform | platform.roles, platform.permissions, platform.role_permissions |
| Tenant Management | core | core.tenants |
| System Settings | platform | platform.system_settings |
| Feature Flags | platform | platform.feature_flags |
| Audit Trail | audit | audit.audit_events, audit.api_call_log, audit.data_access_log, audit.system_events |
| Security Management | audit | audit.security_events |

---

## 3. Schema Coverage

| Schema | Total Tables | Used by Capabilities | Coverage |
|--------|-------------|---------------------|----------|
| core | 8 | 5 | 63% |
| engine | 22 | 8 | 36% |
| platform | 22 | 10 | 45% |
| reporting | 3 + 5 views | 3 | 100% |
| audit | 5 | 2 | 40% |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*
