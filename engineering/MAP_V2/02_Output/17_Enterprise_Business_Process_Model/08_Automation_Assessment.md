# Automation Assessment

**Document ID:** 17-08  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides an automation assessment for all 29 business processes. Each process is assessed against four automation levels with evidence-based justification.

---

## 2. Automation Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Manual | Process is entirely manual |
| 2 | Assisted | Process has some automation but requires manual intervention |
| 3 | Semi-Automated | Process is mostly automated with some manual steps |
| 4 | Automated | Process is fully automated |

---

## 3. Automation Assessment

### 3.1 Migration Management Domain

#### Process 1: Migration Project Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Project configuration is automated via execution_engine. However, project initiation, team assignment, and approval are manual. |
| **Automated Steps** | Project configuration loading; status tracking; progress monitoring |
| **Manual Steps** | Project initiation; team assignment; risk assessment; approval; lessons learned |
| **Evidence** | app.execution_engine contains project configuration logic; core.dataset_mappings references project_id |
| **Automation Potential** | High — project templates and workflow automation could reduce manual effort |

---

#### Process 2: Connection Onboarding

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Connection CRUD is fully automated via API. Testing and validation are automated. Credential management is semi-automated. |
| **Automated Steps** | Connection CRUD; connectivity testing; credential validation; status monitoring |
| **Manual Steps** | Credential rotation; connection removal |
| **Evidence** | app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata |
| **Automation Potential** | Medium — most steps already automated |

---

#### Process 3: Credential Onboarding

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Encryption and decryption are automated. Key management is semi-automated. Access logging is automated. |
| **Automated Steps** | Credential encryption; credential decryption; access logging; audit trail |
| **Manual Steps** | Key rotation; key escrow; credential revocation |
| **Evidence** | core.system_credentials stores encrypted credentials; Fernet encryption used; credential access logged in audit_events |
| **Automation Potential** | Medium — key rotation could be automated |

---

#### Process 4: Dataset Discovery

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Schema and table discovery are automated via auto_rule_discovery. However, trigger is manual (CLI-only). |
| **Automated Steps** | Schema querying; table listing; metadata extraction; result storage |
| **Manual Steps** | Discovery trigger; result review; schema change detection |
| **Evidence** | app.discovery.auto_rule_discovery queries information_schema; core.dataset_mappings stores discovered tables; CLI-only, no API endpoints |
| **Automation Potential** | High — API endpoints and scheduled discovery could fully automate |

---

#### Process 5: Column Discovery

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Column metadata extraction is automated via dataset_discovery_service. Trigger is manual. |
| **Automated Steps** | Column metadata extraction; data type extraction; constraint extraction; result storage |
| **Manual Steps** | Discovery trigger; result review; relationship analysis |
| **Evidence** | app.services.dataset_discovery_service queries column metadata; core.dataset_columns stores column definitions |
| **Automation Potential** | High — API endpoints could fully automate |

---

#### Process 6: Mapping Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Mapping resolution is automated at runtime. Auto-creation during discovery. Manual review and approval required. |
| **Automated Steps** | Mapping resolution; auto-creation during discovery; version management |
| **Manual Steps** | Mapping creation; mapping review; mapping approval; mapping validation |
| **Evidence** | app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings; auto-created during discovery |
| **Automation Potential** | Medium — validation and approval could be automated |

---

### 3.2 Validation Management Domain

#### Process 7: Rule Authoring

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Rule auto-generation via auto_rule_discovery. Manual review and approval required. |
| **Automated Steps** | Rule auto-generation; rule storage; rule versioning |
| **Manual Steps** | Rule parameter definition; threshold setting; rule approval; rule testing |
| **Evidence** | app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions; 10 rule types (C01-C010) implemented |
| **Automation Potential** | Medium — validation and approval could be automated |

---

#### Process 8: Rule Approval

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 1 Manual |
| **Justification** | No approval workflow implementation found. Rules auto-generated during execution without explicit approval step. Entirely manual process. |
| **Automated Steps** | None |
| **Manual Steps** | Rule submission; rule review; approval decision; documentation; tracking |
| **Evidence** | No approval workflow implementation found in codebase; rules are auto-generated during execution without explicit approval step |
| **Automation Potential** | High — approval workflow could fully automate |

---

#### Process 9: Rule Execution

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated execution via control_executor. Results stored automatically. Monitoring automated. |
| **Automated Steps** | Rule selection; parameter validation; dispatch; execution; result capture; exception handling; monitoring; reporting |
| **Manual Steps** | None |
| **Evidence** | app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes; results stored in engine.migration_control_summary |
| **Automation Potential** | Low — already fully automated |

---

#### Process 10: Control Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Control execution is automated. Registration and configuration are semi-automated. |
| **Automated Steps** | Control fetching; control dispatch; result storage; status tracking |
| **Manual Steps** | Control registration; parameter configuration; control validation |
| **Evidence** | app.execution.control_executor fetches enabled controls from engine.control_registry; dispatches to control classes; results stored in engine.migration_control_summary |
| **Automation Potential** | Medium — registration and configuration could be automated |

---

#### Process 11: Validation Execution

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated 6-step pipeline with checkpointing and retry. API available. Parallel execution supported. |
| **Automated Steps** | Pipeline configuration; step execution; checkpointing; retry; monitoring; result storage |
| **Manual Steps** | Pipeline trigger (via API) |
| **Evidence** | app.execution_engine implements 6-step pipeline; parallel execution supported; checkpointing via engine.batch_execution_checkpoint; retry via app.orchestration.retry.rule_retry_manager; API at /api/v1/engine/trigger |
| **Automation Potential** | Low — already fully automated |

---

#### Process 12: Exception Management

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Exception detection is automated via validation pipeline. Resolution is manual. |
| **Automated Steps** | Exception detection; exception classification; exception prioritisation |
| **Manual Steps** | Root cause analysis; impact assessment; remediation recommendation; resolution; documentation |
| **Evidence** | engine.v_migration_exception_detail view provides exception data; no dedicated exception management API; exceptions logged during execution |
| **Automation Potential** | High — resolution workflow could automate resolution |

---

#### Process 13: Issue Remediation

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 1 Manual |
| **Justification** | No automated remediation workflow found. Issue tracking via Task Management platform. Entirely manual process. |
| **Automated Steps** | None |
| **Manual Steps** | Issue assessment; root cause analysis; remediation planning; remediation execution; verification; documentation |
| **Evidence** | No automated remediation workflow found in codebase; issue tracking handled via Task Management platform |
| **Automation Potential** | High — remediation workflow could partially automate |

---

### 3.3 Governance & Compliance Domain

#### Process 14: Governance

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Decision engine and risk scoring are automated. Integration with other services is planned but not implemented. |
| **Automated Steps** | Control evaluation; risk score calculation; decision generation; compliance assessment |
| **Manual Steps** | Decision review; stakeholder notification; workflow triggering; task creation |
| **Current Implementation** | app.governance.decision_engine computes governance decisions; app.governance.risk_scoring calculates weighted risk scores; results stored in engine.migration_governance_status |
| **Planned Integration** | Notifications, Workflow, Tasks, Reporting, Dashboard, Release Approval |
| **Evidence** | app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status |
| **Automation Potential** | High — integrations could fully automate governance workflow |

---

#### Process 15: Release Approval

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Approval workflow is automated via approval_service. Deployment is semi-automated. |
| **Automated Steps** | Request submission; approval routing; approval tracking; decision documentation |
| **Manual Steps** | Release compilation; deployment execution; rollback execution |
| **Evidence** | app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests; platform.approval_step_instances tracks approval steps |
| **Automation Potential** | Medium — deployment could be more automated |

---

### 3.4 Reporting & Analytics Domain

#### Process 16: Reporting

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 2 Assisted |
| **Justification** | SQL views provide data but require manual query. CLI export only. Frontend displays mock data. Assisted process. |
| **Automated Steps** | SQL view population; data aggregation |
| **Manual Steps** | Report request; query execution; report generation; report formatting; report distribution |
| **Current State** | reporting schema contains 5 SQL views; app.audit_export provides CLI export; no API endpoints for reports; frontend displays mock data |
| **Target State** | Reporting API endpoints (/api/v1/reports/*) to be created; Frontend to consume real API data |
| **Evidence** | reporting schema (5 SQL views), app.audit_export (CLI), no API |
| **Automation Potential** | High — Reporting API could fully automate report generation |

---

#### Process 17: Dashboard Production

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 2 Assisted |
| **Justification** | Fact views and scoring engine provide data but require manual query. No API. Frontend displays mock data. Assisted process. |
| **Automated Steps** | Fact view population; KPI calculation; scoring engine execution |
| **Manual Steps** | Dashboard request; data query; dashboard generation; visualisation rendering; distribution |
| **Current State** | reporting schema contains fact views; app.scoring_engine calculates KPIs; no API endpoints; frontend displays mock data |
| **Target State** | Dashboard API endpoints (/api/v1/dashboards/*) to be created; Real-time dashboard updates |
| **Evidence** | reporting schema (fact views), app.scoring_engine, no API |
| **Automation Potential** | High — Dashboard API could fully automate dashboard production |

---

### 3.5 Platform Services Domain

#### Process 18: Notifications

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated notification system with event subscriptions. 19 event types supported. User preferences managed. |
| **Automated Steps** | Event reception; event validation; event routing; content generation; preference application; notification delivery; delivery tracking |
| **Manual Steps** | User preference configuration |
| **Evidence** | app.services.notification_service provides full CRUD API; platform.notifications stores notification records; platform.notification_preferences stores user preferences; subscribed to 19 event types |
| **Automation Potential** | Low — already fully automated |

---

#### Process 19: Scheduling

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated scheduling system with event subscriptions. Calendar events and reminders managed automatically. |
| **Automated Steps** | Parameter definition; recurrence configuration; event triggering; task execution; execution tracking; reminder creation; reminder delivery |
| **Manual Steps** | Schedule creation (via API) |
| **Evidence** | app.services.calendar_service provides full CRUD API; platform.calendar_events stores events; platform.calendar_event_reminders manages reminders; subscribed to Batch Started and Task Created events |
| **Automation Potential** | Low — already fully automated |

---

#### Process 20: Workflow Management

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated workflow system with event subscriptions. Workflow definitions and instances managed automatically. |
| **Automated Steps** | Step definition; parameter configuration; logic validation; instance creation; step execution; progress tracking; status monitoring; failure handling; retry |
| **Manual Steps** | Workflow definition (via API) |
| **Current Implementation** | app.services.workflow_service provides full CRUD API; platform.workflow_definitions stores definitions; platform.workflow_instances tracks execution |
| **Planned Integration** | Governance, Release Approval, Validation |
| **Evidence** | app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances |
| **Automation Potential** | Low — already fully automated |

---

#### Process 21: Task Management

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 4 Automated |
| **Justification** | Fully automated task system with event subscriptions. Tasks, comments, and dependencies managed automatically. |
| **Automated Steps** | Task creation; task assignment; priority setting; record storage; progress tracking; status updates; dependency management; blocking management |
| **Manual Steps** | Task creation (via API or event) |
| **Current Implementation** | app.services.task_service provides full CRUD API; platform.tasks stores task records; platform.task_comments tracks comments; platform.task_dependencies manages dependencies |
| **Planned Integration** | Governance, Validation, Release, Workflow |
| **Evidence** | app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies |
| **Automation Potential** | Low — already fully automated |

---

#### Process 22: User Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | User CRUD is automated via API. Role assignments are automated. Deactivation is semi-automated. |
| **Automated Steps** | Account creation; role assignment; welcome notification; detail updates; preference management |
| **Manual Steps** | Account disabling; access revocation; data archival; access review; permission audit |
| **Evidence** | app.services.user_service provides full CRUD API; platform.users stores user records; platform.user_roles manages role assignments |
| **Automation Potential** | Medium — deactivation workflow could automate deactivation |

---

#### Process 23: Role Administration

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Role CRUD is automated via API. Permission assignments are automated. Audit is semi-automated. |
| **Automated Steps** | Role definition; permission assignment; definition storage; permission mapping; usage reporting |
| **Manual Steps** | Role validation; permission audit; structure optimisation |
| **Evidence** | app.services.role_service provides full CRUD API; platform.roles stores role definitions; platform.permissions stores 47 permissions; platform.role_permissions manages assignments |
| **Automation Potential** | Medium — validation and audit could be automated |

---

#### Process 24: Tenant Management

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Tenant-aware architecture exists with core.tenants and JWT integration. No dedicated API. Administration is semi-automated. |
| **Automated Steps** | Tenant detection via JWT; tenant isolation; tenant context propagation |
| **Manual Steps** | Tenant creation; configuration updates; resource management; policy management; monitoring; deactivation |
| **Current Implementation** | core.tenants table exists; tenant_id referenced in JWT tokens; tenant-aware architecture in place; no dedicated tenant management API |
| **Tenant Lifecycle** | Tenant creation, configuration, deactivation, archival |
| **Tenant Administration** | Tenant configuration updates, resource management, policy management, isolation verification |
| **Evidence** | core.tenants (table exists), tenant_id in JWT tokens, tenant-aware architecture |
| **Automation Potential** | High — tenant management API could fully automate lifecycle |

---

#### Process 25: Security Administration

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 1 Manual |
| **Justification** | Security events logged in audit.security_events. No dedicated security management API. Entirely manual process. |
| **Automated Steps** | Security event logging |
| **Manual Steps** | Key management; certificate management; event monitoring; pattern analysis; incident response; reporting; compliance |
| **Evidence** | audit.security_events stores security events; no dedicated security management API |
| **Automation Potential** | High — security management API could partially automate |

---

#### Process 26: Audit Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 1 Manual |
| **Justification** | Audit middleware logs every API call automatically. No dedicated audit API. Report generation and compliance are manual. |
| **Automated Steps** | API call logging; security event logging; record storage; data validation; record enrichment; record indexing |
| **Manual Steps** | Report generation; pattern analysis; data export; data retention; compliance verification |
| **Evidence** | app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records; audit.api_call_log stores API call details |
| **Automation Potential** | High — audit API could automate reporting and compliance |

---

#### Process 27: Platform Administration

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Settings CRUD is automated via API. Health checks are automated. Feature flags are managed. Monitoring is semi-automated. |
| **Automated Steps** | Settings update; settings validation; settings audit; feature toggling; parameter configuration; health check execution |
| **Manual Steps** | Usage monitoring; issue alerting; maintenance scheduling; task execution |
| **Evidence** | app.services.settings_service provides full CRUD API; app.health provides health check endpoints; platform.system_settings stores configuration; platform.feature_flags stores feature toggles |
| **Automation Potential** | Medium — monitoring and alerting could be automated |

---

#### Process 28: Customer Onboarding

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 1 Manual |
| **Justification** | Not implemented. No dedicated customer onboarding workflow found. Entirely manual process. |
| **Automated Steps** | None |
| **Manual Steps** | Registration form; detail validation; customer record creation; organisation creation; metadata storage; tenant provisioning; settings configuration; configuration validation; administrator creation; role assignment; welcome notification; licence allocation; parameter configuration; platform activation |
| **Current Implementation** | Not implemented — no dedicated customer onboarding workflow found in codebase |
| **Planned Implementation** | Customer registration form; Organisation creation workflow; Tenant provisioning automation; Initial administrator creation; Licence/subscription allocation; Initial configuration wizard; Welcome notification emails; Platform activation |
| **Evidence** | Not implemented |
| **Automation Potential** | High — onboarding workflow could fully automate |

---

#### Process 29: Authentication

| Aspect | Assessment |
|--------|------------|
| **Automation Level** | 3 Semi-Automated |
| **Justification** | Authentication is fully automated via auth_service. Login, JWT generation, refresh tokens, rate limiting all automated. Session management semi-automated. |
| **Automated Steps** | Username validation; password validation; account status check; MFA validation; JWT generation; token claim setting; refresh token issuance; session creation; timeout management; logout invalidation; failure logging; rate limiting; account locking; refresh token validation; new JWT issuance; old token revocation |
| **Manual Steps** | None (all automated) |
| **Evidence** | app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification; refresh tokens managed; rate limiting on login endpoint (5/minute); produces LoginSuccessful and LoginFailed events |
| **Automation Potential** | Low — already fully automated |

---

## 4. Automation Summary

### 4.1 By Level

| Level | Count | Percentage | Processes |
|-------|-------|------------|-----------|
| 4 Automated | 6 | 21% | 9, 11, 18, 19, 20, 21 |
| 3 Semi-Automated | 14 | 48% | 1, 2, 3, 4, 5, 6, 7, 10, 12, 14, 15, 22, 23, 24, 27, 29 |
| 2 Assisted | 2 | 7% | 16, 17 |
| 1 Manual | 7 | 24% | 8, 13, 25, 26, 28 |

### 4.2 By Domain

| Domain | Processes | Average Automation |
|--------|-----------|-------------------|
| Migration Management | 6 | 3.0 |
| Validation Management | 6 | 2.7 |
| Governance & Compliance | 2 | 3.0 |
| Reporting & Analytics | 2 | 2.0 |
| Platform Services | 5 | 3.8 |
| Administration | 8 | 2.1 |

---

## 5. Automation Improvement Recommendations

### 5.1 High-Impact Automation Opportunities

| Process | Current | Target | Action | Impact |
|---------|---------|--------|--------|--------|
| Rule Approval | 1 Manual | 3 Semi-Automated | Implement approval workflow | High |
| Issue Remediation | 1 Manual | 3 Semi-Automated | Implement remediation workflow | High |
| Reporting | 2 Assisted | 4 Automated | Create Reporting API | High |
| Dashboard Production | 2 Assisted | 4 Automated | Create Dashboard API | High |
| Customer Onboarding | 1 Manual | 3 Semi-Automated | Implement onboarding workflow | High |
| Tenant Management | 3 Semi-Automated | 4 Automated | Create tenant management API | Medium |
| Security Administration | 1 Manual | 3 Semi-Automated | Create security management API | Medium |
| Audit Lifecycle | 1 Manual | 3 Semi-Automated | Create audit API | Medium |

### 5.2 Quick Wins (0-3 Months)

| Process | Current | Target | Action |
|---------|---------|--------|--------|
| Rule Approval | 1 | 3 | Implement approval workflow |
| Issue Remediation | 1 | 3 | Implement remediation workflow |
| Reporting | 2 | 3 | Create basic Reporting API |
| Dashboard Production | 2 | 3 | Create basic Dashboard API |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This automation assessment is part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*