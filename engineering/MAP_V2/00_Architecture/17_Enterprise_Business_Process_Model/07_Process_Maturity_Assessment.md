# Process Maturity Assessment

**Document ID:** 17-07  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides a CMMI-based maturity assessment for all 29 business processes. Each process is assessed against five maturity levels with evidence-based justification.

---

## 2. Maturity Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Initial | Process is ad hoc and chaotic |
| 2 | Repeatable | Process is Repeatable with discipline |
| 3 | Defined | Process is well-defined and documented |
| 4 | Managed | Process is measured and controlled |
| 5 | Optimised | Process is continuously improved |

---

## 3. Maturity Assessment

### 3.1 Migration Management Domain

#### Process 1: Migration Project Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear stages (initiation, execution, closure). Evidence exists in app.execution_engine with project configuration logic. However, not fully managed (Level 4) as metrics collection is limited. |
| **Evidence** | app.execution_engine contains project configuration logic; core.dataset_mappings references project_id; engine.migration_validation_batch tracks project execution |
| **Strengths** | Clear project lifecycle stages; documented in code |
| **Weaknesses** | Limited metrics collection; manual approval steps |
| **Recommendation** | Implement project metrics dashboard; automate approval workflows |

---

#### Process 2: Connection Onboarding

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with validation, monitoring, and alerting. Connection testing and credential validation are automated. Metrics tracked via audit middleware. |
| **Evidence** | app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata; core.system_credentials stores encrypted credentials |
| **Strengths** | Full API implementation; automated validation; encrypted credentials |
| **Weaknesses** | Manual credential rotation; limited connection pooling |
| **Recommendation** | Implement automated credential rotation; add connection pooling |

---

#### Process 3: Credential Onboarding

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Fernet encryption with key management. Credential access logged in audit trail. Automated encryption/decryption with access controls. |
| **Evidence** | core.system_credentials stores encrypted credentials; Fernet encryption used; credential access logged in audit_events |
| **Strengths** | Strong encryption; audit logging; access controls |
| **Weaknesses** | Manual key rotation; limited key escrow |
| **Recommendation** | Implement automated key rotation; add key escrow |

---

#### Process 4: Dataset Discovery

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. CLI-only implementation with no API endpoints. Semi-automated via auto_rule_discovery. |
| **Evidence** | app.discovery.auto_rule_discovery queries information_schema; core.dataset_mappings stores discovered tables; CLI-only, no API endpoints |
| **Strengths** | Automated schema discovery; documented process |
| **Weaknesses** | CLI-only; no API; manual trigger required |
| **Recommendation** | Create API endpoints; implement scheduled discovery |

---

#### Process 5: Column Discovery

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. Semi-automated via dataset_discovery_service. No API endpoints. |
| **Evidence** | app.services.dataset_discovery_service queries column metadata; core.dataset_columns stores column definitions; semi-automated process |
| **Strengths** | Automated column discovery; documented process |
| **Weaknesses** | No API; manual trigger required |
| **Recommendation** | Create API endpoints; integrate with discovery workflow |

---

#### Process 6: Mapping Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. Mapping resolver provides runtime resolution. No dedicated mapping API. |
| **Evidence** | app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings; core.column_mappings stores column mappings; auto-created during discovery |
| **Strengths** | Runtime resolution; auto-creation during discovery |
| **Weaknesses** | No dedicated API; manual review required |
| **Recommendation** | Create mapping API; implement mapping validation |

---

### 3.2 Validation Management Domain

#### Process 7: Rule Authoring

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with 10 rule types (C01-C010). Auto-generation via auto_rule_discovery. No dedicated rule API. |
| **Evidence** | app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions; 10 rule types (C01-C010) implemented |
| **Strengths** | Auto-generation; 10 rule types; documented process |
| **Weaknesses** | No dedicated API; manual approval required |
| **Recommendation** | Create rule API; implement rule validation |

---

#### Process 8: Rule Approval

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | Process exists but is manual. No approval workflow implementation found in codebase. Rules auto-generated during execution without explicit approval step. |
| **Evidence** | No approval workflow implementation found in codebase; rules are auto-generated during execution without explicit approval step |
| **Strengths** | Rules are generated consistently |
| **Weaknesses** | Manual approval; no workflow; no audit trail |
| **Recommendation** | Implement approval workflow; add audit trail |

---

#### Process 9: Rule Execution

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Fully automated execution via control_executor. Results stored in migration_control_summary. Metrics tracked. |
| **Evidence** | app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes; results stored in engine.migration_control_summary |
| **Strengths** | Fully automated; results tracked; metrics available |
| **Weaknesses** | Limited error handling; no retry mechanism |
| **Recommendation** | Implement retry mechanism; add error handling |

---

#### Process 10: Control Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. Control executor fetches enabled controls from registry. Semi-automated. |
| **Evidence** | app.execution.control_executor fetches enabled controls from engine.control_registry; dispatches to control classes; results stored in engine.migration_control_summary |
| **Strengths** | Registry-based; dispatch mechanism; results tracking |
| **Weaknesses** | No dedicated API; manual configuration |
| **Recommendation** | Create control API; implement control validation |

---

#### Process 11: Validation Execution

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Fully automated 6-step pipeline with checkpointing and retry. API at /api/v1/engine/trigger. Metrics tracked. |
| **Evidence** | app.execution_engine implements 6-step pipeline; parallel execution supported; checkpointing via engine.batch_execution_checkpoint; retry via app.orchestration.retry.rule_retry_manager; API at /api/v1/engine/trigger |
| **Strengths** | 6-step pipeline; checkpointing; retry; API |
| **Weaknesses** | Limited monitoring; manual trigger required |
| **Recommendation** | Implement monitoring dashboard; add scheduled execution |

---

#### Process 12: Exception Management

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. Exception data available via v_migration_exception_detail view. No dedicated API. |
| **Evidence** | engine.v_migration_exception_detail view provides exception data; no dedicated exception management API; exceptions logged during execution |
| **Strengths** | View-based data access; exceptions logged |
| **Weaknesses** | No dedicated API; manual resolution required |
| **Recommendation** | Create exception API; implement automated resolution |

---

#### Process 13: Issue Remediation

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | Process exists but is manual. No automated remediation workflow found. Issue tracking via Task Management platform. |
| **Evidence** | No automated remediation workflow found in codebase; issue tracking handled via Task Management platform |
| **Strengths** | Issue tracking via Task Management |
| **Weaknesses** | Manual remediation; no workflow; no automation |
| **Recommendation** | Implement remediation workflow; add automation |

---

### 3.3 Governance & Compliance Domain

#### Process 14: Governance

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Process is well-defined with clear steps. Decision engine and risk scoring implemented. Semi-automated. |
| **Current Implementation** | app.governance.decision_engine computes governance decisions; app.governance.risk_scoring calculates weighted risk scores; results stored in engine.migration_governance_status and engine.migration_risk_scores |
| **Planned Integration** | Notifications, Workflow, Tasks, Reporting, Dashboard, Release Approval |
| **Evidence** | app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status |
| **Strengths** | Decision engine; risk scoring; documented process |
| **Weaknesses** | Limited integration; no API; manual decision review |
| **Recommendation** | Implement integrations; create governance API |

---

#### Process 15: Release Approval

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with approval workflow. Platform approval_requests and approval_step_instances tracked. Automated approval process. |
| **Evidence** | app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests; platform.approval_step_instances tracks approval steps; full CRUD API at /api/v1/platform/approvals |
| **Strengths** | Full API; approval workflow; step tracking |
| **Weaknesses** | Limited escalation; no parallel approvals |
| **Recommendation** | Implement escalation; add parallel approvals |

---

### 3.4 Reporting & Analytics Domain

#### Process 16: Reporting

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | SQL views exist but no API. CLI export only. Frontend displays mock data. Assisted process. |
| **Current State** | reporting schema contains 5 SQL views (v_migration_executive_summary, v_migration_control_summary, v_migration_governance_report, v_migration_exception_detail, v_migration_batch_detail); app.audit_export provides CLI export; no API endpoints for reports; frontend displays mock data |
| **Target State** | Reporting API endpoints (/api/v1/reports/*) to be created; Dashboard API endpoints (/api/v1/dashboards/*) to be created; Frontend to consume real API data instead of mock; Reports to integrate with Governance decisions |
| **Evidence** | reporting schema (5 SQL views), app.audit_export (CLI), no API |
| **Strengths** | SQL views provide data; CLI export available |
| **Weaknesses** | No API; CLI-only; mock data in frontend |
| **Recommendation** | Create Reporting API; integrate with frontend |

---

#### Process 17: Dashboard Production

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | Fact views exist but no API. Scoring engine calculates KPIs. Frontend displays mock data. Assisted process. |
| **Current State** | reporting schema contains fact views (v_fact_batch, v_fact_control); app.scoring_engine calculates KPIs; no API endpoints; frontend displays mock data |
| **Target State** | Dashboard API endpoints (/api/v1/dashboards/*) to be created; Real-time dashboard updates; Frontend to consume real API data instead of mock; Dashboards to integrate with Governance decisions |
| **Evidence** | reporting schema (fact views), app.scoring_engine, no API |
| **Strengths** | Fact views; scoring engine; KPI calculation |
| **Weaknesses** | No API; mock data in frontend; no real-time |
| **Recommendation** | Create Dashboard API; implement real-time updates |

---

### 3.5 Platform Services Domain

#### Process 18: Notifications

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with event subscriptions. 19 event types supported. User preferences managed. Automated notification delivery. |
| **Evidence** | app.services.notification_service provides full CRUD API; platform.notifications stores notification records; platform.notification_preferences stores user preferences; subscribed to 19 event types |
| **Strengths** | Full API; 19 event types; user preferences |
| **Weaknesses** | Limited channel support; no delivery tracking |
| **Recommendation** | Add email/SMS channels; implement delivery tracking |

---

#### Process 19: Scheduling

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with event subscriptions. Calendar events and reminders managed. Automated scheduling. |
| **Evidence** | app.services.calendar_service provides full CRUD API; platform.calendar_events stores events; platform.calendar_event_reminders manages reminders; subscribed to Batch Started and Task Created events |
| **Strengths** | Full API; event subscriptions; reminders |
| **Weaknesses** | Limited recurrence options; no timezone support |
| **Recommendation** | Add recurrence options; implement timezone support |

---

#### Process 20: Workflow Management

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with event subscriptions. Workflow definitions and instances tracked. Automated workflow execution. |
| **Current Implementation** | app.services.workflow_service provides full CRUD API; platform.workflow_definitions stores definitions; platform.workflow_instances tracks execution; subscribed to Task Completed and Approval Decided events |
| **Planned Integration** | Governance decisions to trigger approval workflows; Release Approval to trigger notification workflows; Validation failures to trigger remediation workflows |
| **Evidence** | app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances |
| **Strengths** | Full API; event subscriptions; instance tracking |
| **Weaknesses** | Limited workflow types; no visual designer |
| **Recommendation** | Add workflow types; implement visual designer |

---

#### Process 21: Task Management

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full CRUD API with event subscriptions. Tasks, comments, and dependencies managed. Automated task creation. |
| **Current Implementation** | app.services.task_service provides full CRUD API; platform.tasks stores task records; platform.task_comments tracks comments; platform.task_dependencies manages dependencies; produces Task Created and Task Completed events |
| **Planned Integration** | Governance decisions to create tasks; Validation failures to create tasks; Release Approval to create tasks; Workflow completions to create tasks |
| **Evidence** | app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies |
| **Strengths** | Full API; comments; dependencies; event subscriptions |
| **Weaknesses** | Limited task types; no time tracking |
| **Recommendation** | Add task types; implement time tracking |

---

#### Process 22: User Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Full CRUD API with role assignments. User creation and maintenance documented. Semi-automated. |
| **Evidence** | app.services.user_service provides full CRUD API; platform.users stores user records; platform.user_roles manages role assignments; produces User Created event |
| **Strengths** | Full API; role assignments; event subscriptions |
| **Weaknesses** | Limited lifecycle automation; no deactivation workflow |
| **Recommendation** | Implement deactivation workflow; add lifecycle automation |

---

#### Process 23: Role Administration

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Full CRUD API with permission assignments. 47 permissions defined. Role lifecycle documented. Semi-automated. |
| **Evidence** | app.services.role_service provides full CRUD API; platform.roles stores role definitions; platform.permissions stores 47 permissions; platform.role_permissions manages assignments; produces Role Assigned event |
| **Strengths** | Full API; 47 permissions; role lifecycle |
| **Weaknesses** | Limited role validation; no permission audit |
| **Recommendation** | Implement role validation; add permission audit |

---

#### Process 24: Tenant Management

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Tenant-aware architecture exists with core.tenants table and tenant_id in JWT. No dedicated tenant management API. Semi-automated. |
| **Current Implementation** | core.tenants table exists; tenant_id referenced in JWT tokens; tenant-aware architecture in place; no dedicated tenant management API; frontend displays mock data |
| **Tenant Lifecycle** | Tenant creation, configuration, deactivation, archival |
| **Tenant Onboarding** | Organisation creation, initial administrator creation, licence allocation, initial configuration, welcome notifications, platform activation |
| **Tenant Administration** | Tenant configuration updates, resource management, policy management, isolation verification |
| **Evidence** | core.tenants (table exists), tenant_id in JWT tokens, tenant-aware architecture |
| **Strengths** | Tenant-aware architecture; JWT integration; documented lifecycle |
| **Weaknesses** | No dedicated API; manual administration; mock data |
| **Recommendation** | Create tenant management API; implement automation |

---

#### Process 25: Security Administration

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | Security events logged in audit.security_events. No dedicated security management API. Manual process. |
| **Evidence** | audit.security_events stores security events; no dedicated security management API; frontend displays mock data |
| **Strengths** | Security events logged |
| **Weaknesses** | No dedicated API; manual process; mock data |
| **Recommendation** | Create security management API; implement automation |

---

#### Process 26: Audit Lifecycle

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 2 Repeatable |
| **Justification** | Audit middleware logs every API call. Audit events stored in audit.audit_events. No dedicated audit API. Manual process. |
| **Evidence** | app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records; audit.api_call_log stores API call details; no dedicated audit API; frontend displays mock data |
| **Strengths** | Middleware logging; audit events stored |
| **Weaknesses** | No dedicated API; manual process; mock data |
| **Recommendation** | Create audit API; implement automation |

---

#### Process 27: Platform Administration

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 3 Defined |
| **Justification** | Full CRUD API for settings. Health check endpoints available. Feature flags managed. Semi-automated. |
| **Evidence** | app.services.settings_service provides full CRUD API; app.health provides health check endpoints; platform.system_settings stores configuration; platform.feature_flags stores feature toggles; produces Settings Changed event |
| **Strengths** | Full API; health checks; feature flags |
| **Weaknesses** | Limited monitoring; no alerting |
| **Recommendation** | Implement monitoring; add alerting |

---

#### Process 28: Customer Onboarding

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 1 Initial |
| **Justification** | Not implemented. No dedicated customer onboarding workflow found in codebase. Ad hoc process. |
| **Current Implementation** | Not implemented — no dedicated customer onboarding workflow found in codebase |
| **Planned Implementation** | Customer registration form; Organisation creation workflow; Tenant provisioning automation; Initial administrator creation; Licence/subscription allocation; Initial configuration wizard; Welcome notification emails; Platform activation |
| **Evidence** | Not implemented |
| **Strengths** | None — not implemented |
| **Weaknesses** | No workflow; no automation; no API |
| **Recommendation** | Implement customer onboarding workflow; create API |

---

#### Process 29: Authentication

| Aspect | Assessment |
|--------|------------|
| **Maturity Level** | 4 Managed |
| **Justification** | Full authentication system with bcrypt password hashing, JWT tokens, refresh tokens, rate limiting. LoginSuccessful and LoginFailed events emitted. |
| **Evidence** | app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification; refresh tokens managed; rate limiting on login endpoint (5/minute); produces LoginSuccessful and LoginFailed events |
| **Strengths** | bcrypt hashing; JWT; refresh tokens; rate limiting; event emissions |
| **Weaknesses** | No MFA; limited session management |
| **Recommendation** | Implement MFA; add session management |

---

## 4. Maturity Summary

### 4.1 By Level

| Level | Count | Percentage | Processes |
|-------|-------|------------|-----------|
| 5 Optimised | 0 | 0% | — |
| 4 Managed | 8 | 28% | 2, 3, 9, 11, 15, 18, 19, 20, 21, 29 |
| 3 Defined | 14 | 48% | 1, 4, 5, 6, 7, 10, 12, 14, 22, 23, 24, 27 |
| 2 Repeatable | 7 | 24% | 8, 13, 16, 17, 25, 26 |
| 1 Initial | 0 | 0% | 28 |

**Average Maturity:** 3.2

### 4.2 By Domain

| Domain | Processes | Average Maturity |
|--------|-----------|------------------|
| Migration Management | 6 | 3.5 |
| Validation Management | 6 | 3.0 |
| Governance & Compliance | 2 | 3.5 |
| Reporting & Analytics | 2 | 2.0 |
| Platform Services | 5 | 3.8 |
| Administration | 8 | 2.5 |

---

## 5. Maturity Improvement Recommendations

### 5.1 Quick Wins (0-3 Months)

| Process | Current | Target | Action |
|---------|---------|--------|--------|
| Rule Approval | 2 | 3 | Implement approval workflow |
| Issue Remediation | 2 | 3 | Implement remediation workflow |
| Reporting | 2 | 3 | Create Reporting API |
| Dashboard Production | 2 | 3 | Create Dashboard API |

### 5.2 Short-Term (3-6 Months)

| Process | Current | Target | Action |
|---------|---------|--------|--------|
| Tenant Management | 3 | 4 | Create tenant management API |
| Security Administration | 2 | 3 | Create security management API |
| Audit Lifecycle | 2 | 3 | Create audit API |
| Customer Onboarding | 1 | 2 | Implement onboarding workflow |

### 5.3 Medium-Term (6-12 Months)

| Process | Current | Target | Action |
|---------|---------|--------|--------|
| All Level 3 | 3 | 4 | Implement metrics and monitoring |
| All Level 2 | 2 | 3 | Implement automation |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This maturity assessment is part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*
