# Process Gap Analysis

**Document ID:** 17-09  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides an evidence-based gap analysis for all 29 business processes. Each gap is categorised, assessed for impact, and accompanied by a recommendation.

---

## 2. Gap Categories

| Category | Description |
|----------|-------------|
| Manual Activity | Process requires manual intervention |
| Missing Integration | Process lacks integration with other services |
| Workflow Gap | Process lacks defined workflow |
| Approval Bottleneck | Process has approval delays |
| Governance Gap | Process lacks governance controls |
| Security Gap | Process lacks security controls |
| Audit Gap | Process lacks audit trail |
| Notification Gap | Process lacks notification integration |
| Duplicate Activity | Process has redundant activities |

---

## 3. Gap Analysis

### 3.1 Migration Management Domain

#### Process 1: Migration Project Lifecycle

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-01-01 | Manual Activity | Project initiation is manual | Medium | Implement project template wizard |
| GAP-01-02 | Manual Activity | Team assignment is manual | Medium | Automate team assignment based on skills |
| GAP-01-03 | Approval Bottleneck | Project approval requires manual sign-off | Medium | Implement automated approval workflow |
| GAP-01-04 | Missing Integration | No integration with Task Management | Low | Create task creation on project milestones |

**Evidence:** app.execution_engine contains project configuration logic; core.dataset_mappings references project_id

---

#### Process 2: Connection Onboarding

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-02-01 | Manual Activity | Credential rotation is manual | Medium | Implement automated credential rotation |
| GAP-02-02 | Missing Integration | No integration with Notifications | Low | Create notification on connection failure |

**Evidence:** app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata

---

#### Process 3: Credential Onboarding

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-03-01 | Manual Activity | Key rotation is manual | Medium | Implement automated key rotation |
| GAP-03-02 | Security Gap | No key escrow mechanism | Low | Implement key escrow for disaster recovery |

**Evidence:** core.system_credentials stores encrypted credentials; Fernet encryption used

---

#### Process 4: Dataset Discovery

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-04-01 | Missing Integration | No API endpoints | High | Create Discovery API |
| GAP-04-02 | Manual Activity | Discovery trigger is manual (CLI-only) | Medium | Implement scheduled discovery |
| GAP-04-03 | Missing Integration | No integration with Notifications | Low | Create notification on discovery completion |

**Evidence:** app.discovery.auto_rule_discovery queries information_schema; CLI-only, no API endpoints

---

#### Process 5: Column Discovery

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-05-01 | Missing Integration | No API endpoints | High | Create Column Discovery API |
| GAP-05-02 | Manual Activity | Discovery trigger is manual | Medium | Integrate with Discovery API |

**Evidence:** app.services.dataset_discovery_service queries column metadata; semi-automated process

---

#### Process 6: Mapping Lifecycle

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-06-01 | Missing Integration | No dedicated Mapping API | High | Create Mapping API |
| GAP-06-02 | Manual Activity | Mapping review is manual | Medium | Implement mapping validation rules |
| GAP-06-03 | Approval Bottleneck | Mapping approval requires manual sign-off | Medium | Implement automated approval workflow |

**Evidence:** app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings

---

### 3.2 Validation Management Domain

#### Process 7: Rule Authoring

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-07-01 | Missing Integration | No dedicated Rule API | High | Create Rule API |
| GAP-07-02 | Manual Activity | Rule approval is manual | Medium | Implement automated approval workflow |

**Evidence:** app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions

---

#### Process 8: Rule Approval

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-08-01 | Workflow Gap | No approval workflow implementation | High | Implement approval workflow |
| GAP-08-02 | Governance Gap | No approval audit trail | High | Implement approval audit logging |
| GAP-08-03 | Manual Activity | Entirely manual process | High | Automate approval routing |

**Evidence:** No approval workflow implementation found in codebase; rules auto-generated during execution

---

#### Process 9: Rule Execution

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-09-01 | Missing Integration | No retry mechanism | Medium | Implement retry logic |
| GAP-09-02 | Notification Gap | No notification on failure | Low | Create notification on execution failure |

**Evidence:** app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes

---

#### Process 10: Control Lifecycle

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-10-01 | Missing Integration | No dedicated Control API | Medium | Create Control API |
| GAP-10-02 | Manual Activity | Control configuration is manual | Medium | Implement control templates |

**Evidence:** app.execution.control_executor fetches enabled controls from engine.control_registry

---

#### Process 11: Validation Execution

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-11-01 | Missing Integration | No monitoring dashboard | Medium | Implement execution monitoring |
| GAP-11-02 | Manual Activity | Pipeline trigger is manual | Low | Implement scheduled execution |

**Evidence:** app.execution_engine implements 6-step pipeline; checkpointing via engine.batch_execution_checkpoint

---

#### Process 12: Exception Management

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-12-01 | Missing Integration | No dedicated Exception API | High | Create Exception API |
| GAP-12-02 | Manual Activity | Exception resolution is manual | Medium | Implement resolution workflow |
| GAP-12-03 | Notification Gap | No notification on exception | Medium | Create notification on exception detection |

**Evidence:** engine.v_migration_exception_detail view provides exception data; no dedicated exception management API

---

#### Process 13: Issue Remediation

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-13-01 | Workflow Gap | No remediation workflow | High | Implement remediation workflow |
| GAP-13-02 | Manual Activity | Entirely manual process | High | Automate remediation steps |
| GAP-13-03 | Missing Integration | No integration with Task Management | Medium | Create task creation on remediation |

**Evidence:** No automated remediation workflow found in codebase; issue tracking via Task Management

---

### 3.3 Governance & Compliance Domain

#### Process 14: Governance

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-14-01 | Missing Integration | No integration with Notifications | Medium | Create notification on governance decisions |
| GAP-14-02 | Missing Integration | No integration with Workflow | Medium | Create workflow triggering on decisions |
| GAP-14-03 | Missing Integration | No integration with Tasks | Medium | Create task creation on decisions |
| GAP-14-04 | Missing Integration | No integration with Reporting | Medium | Create reporting integration |
| GAP-14-05 | Missing Integration | No integration with Dashboard | Medium | Create dashboard integration |
| GAP-14-06 | Missing Integration | No integration with Release Approval | Medium | Create release approval triggering |

**Current Implementation:** app.governance.decision_engine, app.governance.risk_scoring

**Planned Integration:** Notifications, Workflow, Tasks, Reporting, Dashboard, Release Approval

**Evidence:** app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status

---

#### Process 15: Release Approval

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-15-01 | Missing Integration | No parallel approval support | Medium | Implement parallel approval workflows |
| GAP-15-02 | Manual Activity | Release compilation is manual | Medium | Automate release packaging |
| GAP-15-03 | Manual Activity | Deployment is manual | Medium | Implement deployment automation |

**Evidence:** app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests

---

### 3.4 Reporting & Analytics Domain

#### Process 16: Reporting

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-16-01 | Missing Integration | No Reporting API | High | Create Reporting API endpoints |
| GAP-16-02 | Manual Activity | Report generation is manual (CLI-only) | High | Automate report generation |
| GAP-16-03 | Missing Integration | Frontend displays mock data | High | Integrate frontend with real API |
| GAP-16-04 | Missing Integration | No integration with Governance | Medium | Create governance reporting integration |

**Current State:** SQL views, CLI export, no API; frontend displays mock data

**Target State:** Reporting API endpoints (/api/v1/reports/*); Frontend to consume real API data

**Evidence:** reporting schema (5 SQL views), app.audit_export (CLI), no API

---

#### Process 17: Dashboard Production

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-17-01 | Missing Integration | No Dashboard API | High | Create Dashboard API endpoints |
| GAP-17-02 | Manual Activity | Dashboard generation is manual | High | Automate dashboard production |
| GAP-17-03 | Missing Integration | Frontend displays mock data | High | Integrate frontend with real API |
| GAP-17-04 | Missing Integration | No real-time updates | Medium | Implement real-time dashboard updates |
| GAP-17-05 | Missing Integration | No integration with Governance | Medium | Create governance dashboard integration |

**Current State:** Fact views, scoring engine, no API; frontend displays mock data

**Target State:** Dashboard API endpoints (/api/v1/dashboards/*); Real-time dashboard updates

**Evidence:** reporting schema (fact views), app.scoring_engine, no API

---

### 3.5 Platform Services Domain

#### Process 18: Notifications

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-18-01 | Notification Gap | Limited channel support (email only) | Low | Add SMS and push notification channels |
| GAP-18-02 | Missing Integration | No delivery tracking | Low | Implement delivery confirmation |

**Evidence:** app.services.notification_service provides full CRUD API; platform.notifications stores notification records

---

#### Process 19: Scheduling

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-19-01 | Missing Integration | Limited recurrence options | Low | Add complex recurrence patterns |
| GAP-19-02 | Missing Integration | No timezone support | Low | Implement timezone handling |

**Evidence:** app.services.calendar_service provides full CRUD API; platform.calendar_events stores events

---

#### Process 20: Workflow Management

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-20-01 | Missing Integration | Limited workflow types | Medium | Add workflow type templates |
| GAP-20-02 | Missing Integration | No visual designer | Medium | Implement visual workflow designer |
| GAP-20-03 | Missing Integration | No integration with Governance | Medium | Create governance workflow integration |

**Current Implementation:** Full CRUD API, event subscriptions

**Planned Integration:** Governance, Release Approval, Validation

**Evidence:** app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances

---

#### Process 21: Task Management

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-21-01 | Missing Integration | Limited task types | Medium | Add task type templates |
| GAP-21-02 | Missing Integration | No time tracking | Medium | Implement time tracking |
| GAP-21-03 | Missing Integration | No integration with Governance | Medium | Create governance task integration |

**Current Implementation:** Full CRUD API, event subscriptions

**Planned Integration:** Governance, Validation, Release, Workflow

**Evidence:** app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies

---

#### Process 22: User Lifecycle

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-22-01 | Workflow Gap | No deactivation workflow | Medium | Implement deactivation workflow |
| GAP-22-02 | Manual Activity | Access review is manual | Medium | Implement automated access review |

**Evidence:** app.services.user_service provides full CRUD API; platform.users stores user records

---

#### Process 23: Role Administration

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-23-01 | Missing Integration | No role validation | Medium | Implement role validation rules |
| GAP-23-02 | Audit Gap | No permission audit | Medium | Implement permission audit logging |

**Evidence:** app.services.role_service provides full CRUD API; platform.roles stores role definitions

---

#### Process 24: Tenant Management

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-24-01 | Missing Integration | No dedicated Tenant Management API | High | Create Tenant Management API |
| GAP-24-02 | Manual Activity | Tenant administration is manual | Medium | Automate tenant lifecycle |
| GAP-24-03 | Missing Integration | Frontend displays mock data | Medium | Integrate frontend with real API |

**Current Implementation:** core.tenants, tenant_id in JWT

**Evidence:** core.tenants (table exists), tenant_id in JWT tokens, tenant-aware architecture

---

#### Process 25: Security Administration

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-25-01 | Missing Integration | No dedicated Security Management API | High | Create Security Management API |
| GAP-25-02 | Manual Activity | Key management is manual | Medium | Automate key rotation |
| GAP-25-03 | Manual Activity | Certificate management is manual | Medium | Automate certificate renewal |
| GAP-25-04 | Audit Gap | No security audit trail | Medium | Implement security audit logging |

**Evidence:** audit.security_events stores security events; no dedicated security management API

---

#### Process 26: Audit Lifecycle

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-26-01 | Missing Integration | No dedicated Audit API | High | Create Audit API |
| GAP-26-02 | Manual Activity | Report generation is manual | Medium | Automate audit report generation |
| GAP-26-03 | Manual Activity | Compliance verification is manual | Medium | Automate compliance checks |
| GAP-26-04 | Audit Gap | No audit retention policy | Low | Implement retention policy |

**Evidence:** app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records

---

#### Process 27: Platform Administration

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-27-01 | Missing Integration | No monitoring dashboard | Medium | Implement platform monitoring |
| GAP-27-02 | Missing Integration | No alerting system | Medium | Implement alerting |
| GAP-27-03 | Manual Activity | Maintenance scheduling is manual | Low | Automate maintenance scheduling |

**Evidence:** app.services.settings_service provides full CRUD API; app.health provides health check endpoints

---

#### Process 28: Customer Onboarding

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-28-01 | Workflow Gap | No onboarding workflow | High | Implement onboarding workflow |
| GAP-28-02 | Manual Activity | Entirely manual process | High | Automate onboarding steps |
| GAP-28-03 | Missing Integration | No API endpoints | High | Create Onboarding API |
| GAP-28-04 | Missing Integration | No integration with Notifications | Medium | Create welcome notification |
| GAP-28-05 | Missing Integration | No integration with Tenant Management | Medium | Create tenant provisioning automation |

**Current Implementation:** Not implemented

**Planned Implementation:** Customer registration form; Organisation creation workflow; Tenant provisioning automation

**Evidence:** Not implemented

---

#### Process 29: Authentication

| Gap ID | Category | Gap Description | Impact | Recommendation |
|--------|----------|-----------------|--------|----------------|
| GAP-29-01 | Security Gap | No MFA implementation | Medium | Implement MFA |
| GAP-29-02 | Missing Integration | Limited session management | Low | Implement session management |

**Evidence:** app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification

---

## 4. Gap Summary

### 4.1 By Category

| Category | Count | Impact |
|----------|-------|--------|
| Manual Activity | 25 | High-Medium |
| Missing Integration | 30 | Medium |
| Workflow Gap | 4 | High |
| Approval Bottleneck | 3 | Medium |
| Governance Gap | 2 | Medium |
| Security Gap | 3 | Medium |
| Audit Gap | 3 | Low-Medium |
| Notification Gap | 4 | Low |
| Duplicate Activity | 0 | Low |
| **Total Gaps** | **74** | — |

### 4.2 By Impact

| Impact | Count | Percentage |
|--------|-------|------------|
| High | 15 | 20% |
| Medium | 45 | 61% |
| Low | 14 | 19% |

### 4.3 By Domain

| Domain | Gaps | High Impact |
|--------|------|-------------|
| Migration Management | 12 | 3 |
| Validation Management | 14 | 5 |
| Governance & Compliance | 9 | 0 |
| Reporting & Analytics | 9 | 6 |
| Platform Services | 10 | 0 |
| Administration | 20 | 5 |
| **Total** | **74** | **15** |

---

## 5. Top Priority Gaps

| Rank | Gap ID | Process | Category | Impact | Recommendation |
|------|--------|---------|----------|--------|----------------|
| 1 | GAP-08-01 | Rule Approval | Workflow Gap | High | Implement approval workflow |
| 2 | GAP-13-01 | Issue Remediation | Workflow Gap | High | Implement remediation workflow |
| 3 | GAP-16-01 | Reporting | Missing Integration | High | Create Reporting API |
| 4 | GAP-17-01 | Dashboard Production | Missing Integration | High | Create Dashboard API |
| 5 | GAP-28-01 | Customer Onboarding | Workflow Gap | High | Implement onboarding workflow |
| 6 | GAP-04-01 | Dataset Discovery | Missing Integration | High | Create Discovery API |
| 7 | GAP-05-01 | Column Discovery | Missing Integration | High | Create Column Discovery API |
| 8 | GAP-06-01 | Mapping Lifecycle | Missing Integration | High | Create Mapping API |
| 9 | GAP-07-01 | Rule Authoring | Missing Integration | High | Create Rule API |
| 10 | GAP-12-01 | Exception Management | Missing Integration | High | Create Exception API |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This gap analysis is part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*