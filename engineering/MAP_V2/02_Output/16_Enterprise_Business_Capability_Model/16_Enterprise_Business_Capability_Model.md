# MAP Nexus Enterprise Platform — Enterprise Business Capability Model

**Document ID:** 16  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the **Enterprise Business Capability Model** for the MAP Nexus™ platform. It establishes what MAP does as a business, independent of implementation, technology, or current frontend menus.

This is the **master business architecture** for MAP. It becomes the authoritative blueprint for all future development.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| All business capabilities of MAP | Implementation details |
| Capability hierarchy and domains | Technology selection |
| Capability dependencies | API design |
| Business events | Database schema |
| Platform service consumers | Frontend components |
| Enterprise navigation model | Code structure |
| Capability ownership | |
| Capability lifecycle | |
| Capability maturity | |
| Capability roadmap | |
| Cross-validation | |

---

## 3. Business Capability Domains

MAP organises its capabilities into **6 logical domains**:

| # | Domain | Purpose | Capabilities |
|---|--------|---------|-------------|
| 1 | **Migration Management** | Define and manage migration projects | Projects, Connections, Discovery, Dataset Mapping, Column Mapping |
| 2 | **Validation Management** | Execute and monitor data validation | Rules, Controls, Execution, Checkpointing, Retry |
| 3 | **Governance & Compliance** | Ensure regulatory and quality compliance | Governance Decisions, Risk Scoring, Release Gates, Approvals |
| 4 | **Reporting & Analytics** | Transform data into business intelligence | Executive Reports, Operational Reports, Dashboards, Export |
| 5 | **Platform Services** | Provide foundational application capabilities | Workflow, Tasks, Notifications, Calendar, AI, Authentication |
| 6 | **Administration** | Manage platform configuration and users | Users, Roles, Tenants, Settings, Feature Flags, Security |

---

## 4. Complete Business Capability Inventory

### 4.1 Migration Management Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 1.1 | **Project Management** | Define and track migration projects | Migration Lead | Migration Engineers |
| 1.2 | **Connection Management** | Manage source/target database connections | Migration Lead | Migration Engineers |
| 1.3 | **Dataset Discovery** | Automatically discover schemas, tables, columns | Migration Lead | Migration Engineers |
| 1.4 | **Dataset Mapping** | Define source-to-target table mappings | Migration Lead | Migration Engineers |
| 1.5 | **Column Mapping** | Map individual columns between source/target | Migration Lead | Migration Engineers |

### 4.2 Validation Management Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 2.1 | **Rule Discovery** | Auto-infer validation rules from column roles | Migration Lead | Migration Engineers |
| 2.2 | **Control Discovery** | Fetch and configure validation controls | Migration Lead | Migration Engineers |
| 2.3 | **Validation Execution** | Execute the 6-step validation pipeline | Migration Lead | Migration Engineers |
| 2.4 | **Checkpointing** | Save execution state for resume | Migration Lead | Migration Engineers |
| 2.5 | **Retry Engine** | Automatically retry failed validations | Migration Lead | Migration Engineers |

### 4.3 Governance & Compliance Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 3.1 | **Governance Decisions** | Compute governance outcomes post-execution | Governance Officer | Compliance Officers |
| 3.2 | **Risk Scoring** | Calculate risk scores using weighted algorithms | Governance Officer | Compliance Officers |
| 3.3 | **Release Gates** | Approve/reject batch releases | Governance Officer | Programme Managers |
| 3.4 | **Approvals** | Manage approval workflows | Governance Officer | Compliance Officers |

### 4.4 Reporting & Analytics Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 4.1 | **Executive Reporting** | High-level programme health summaries | Programme Sponsor | Executives |
| 4.2 | **Operational Reporting** | Detailed migration progress reports | Programme Manager | Migration Leads |
| 4.3 | **Governance Reporting** | Compliance and audit trail reports | Governance Officer | Auditors |
| 4.4 | **Technical Reporting** | Validation details, exceptions, rule results | Migration Lead | Migration Engineers |
| 4.5 | **Dashboard Services** | Real-time KPI dashboards | Programme Sponsor | All Users |
| 4.6 | **Export Services** | PDF, Excel, CSV, PNG export | Programme Manager | All Users |

### 4.5 Platform Services Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 5.1 | **Workflow Management** | Define and execute business workflows | Administrator | All Users |
| 5.2 | **Task Management** | Track and assign migration tasks | Programme Manager | All Users |
| 5.3 | **Notification Services** | Alert users of events and actions | Administrator | All Users |
| 5.4 | **Calendar Services** | Schedule and track events | Administrator | All Users |
| 5.5 | **AI / MAP Copilot** | Natural language assistance and insights | Administrator | All Users |
| 5.6 | **Authentication** | Identity management and SSO | Security Officer | All Users |

### 4.6 Administration Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 6.1 | **User Management** | Create, update, deactivate users | Administrator | Administrators |
| 6.2 | **Role & Permission Management** | Define RBAC roles and permissions | Administrator | Administrators |
| 6.3 | **Tenant Management** | Multi-tenant configuration | Administrator | Administrators |
| 6.4 | **System Settings** | Platform configuration | Administrator | Administrators |
| 6.5 | **Feature Flags** | Toggle features by tenant/user | Administrator | Administrators |
| 6.6 | **Security Management** | Encryption, keys, certificates | Security Officer | Security Analysts |
| 6.7 | **Audit Trail** | Immutable audit log | Security Officer | Auditors |
| 6.8 | **Maintenance & Health** | System health monitoring | Administrator | Administrators |

---

## 5. Capability Hierarchy

```text
MAP Nexus Enterprise Platform
├── Migration Management
│   ├── Project Management
│   ├── Connection Management
│   ├── Dataset Discovery
│   ├── Dataset Mapping
│   └── Column Mapping
├── Validation Management
│   ├── Rule Discovery
│   ├── Control Discovery
│   ├── Validation Execution
│   ├── Checkpointing
│   └── Retry Engine
├── Governance & Compliance
│   ├── Governance Decisions
│   ├── Risk Scoring
│   ├── Release Gates
│   └── Approvals
├── Reporting & Analytics
│   ├── Executive Reporting
│   ├── Operational Reporting
│   ├── Governance Reporting
│   ├── Technical Reporting
│   ├── Dashboard Services
│   └── Export Services
├── Platform Services
│   ├── Workflow Management
│   ├── Task Management
│   ├── Notification Services
│   ├── Calendar Services
│   ├── AI / MAP Copilot
│   └── Authentication
└── Administration
    ├── User Management
    ├── Role & Permission Management
    ├── Tenant Management
    ├── System Settings
    ├── Feature Flags
    ├── Security Management
    ├── Audit Trail
    └── Maintenance & Health
```

---

## 6. Capability Dependencies

### 6.1 Core Dependency Chain (Validation Pipeline)

```text
Project Management
    ↓
Connection Management
    ↓
Dataset Discovery
    ↓
Dataset Mapping
    ↓
Column Mapping
    ↓
Rule Discovery
    ↓
Control Discovery
    ↓
Validation Execution
    ↓
Governance Decisions
    ↓
Reporting & Analytics
```

### 6.2 Platform Dependency Chain

```text
Authentication
    ↓
User Management
    ↓
Role & Permission Management
    ↓
Task Management
    ↓
Workflow Management
    ↓
Notification Services
```

### 6.3 Governance Dependency Chain

```text
Validation Execution
    ↓
Risk Scoring
    ↓
Governance Decisions
    ↓
Release Gates
    ↓
Approvals
    ↓
Audit Trail
```

---

## 7. Business Events

### 7.1 Engine Business Events

| # | Event | Producer | Consumers |
|---|-------|----------|-----------|
| 1 | Batch Started | Validation Execution | Notifications, Tasks, Calendar |
| 2 | Batch Completed | Validation Execution | Governance, Reporting, Notifications |
| 3 | Batch Failed | Validation Execution | Governance, Notifications, Tasks |
| 4 | Control Executed | Validation Execution | Reporting, Governance |
| 5 | Validation Failed | Validation Execution | Tasks, Notifications, Governance |
| 6 | Governance Blocked | Governance Decisions | Tasks, Notifications, Approvals |
| 7 | Release Approved | Release Gates | Notifications, Tasks |
| 8 | Release Rejected | Release Gates | Tasks, Notifications |
| 9 | Checkpoint Created | Checkpointing | Validation Execution |
| 10 | Retry Triggered | Retry Engine | Notifications, Tasks |
| 11 | Dataset Discovered | Dataset Discovery | Notifications |
| 12 | Rule Discovered | Rule Discovery | Notifications |
| 13 | Connection Tested | Connection Management | Notifications |
| 14 | Anomaly Detected | Risk Scoring | Governance, Notifications |

### 7.2 Platform Business Events

| # | Event | Producer | Consumers |
|---|-------|----------|-----------|
| 15 | User Created | User Management | Notifications |
| 16 | Role Assigned | Role Management | Notifications |
| 17 | Task Created | Task Management | Notifications, Calendar |
| 18 | Task Completed | Task Management | Notifications, Workflow |
| 19 | Workflow Completed | Workflow Management | Tasks, Notifications |
| 20 | Approval Requested | Approvals | Tasks, Notifications |
| 21 | Approval Decided | Approvals | Tasks, Notifications, Workflow |
| 22 | Login Successful | Authentication | Audit Trail |
| 23 | Login Failed | Authentication | Audit Trail, Security Events |
| 24 | Settings Changed | System Settings | Audit Trail |

---

## 8. Capability Ownership

### 8.1 Ownership Matrix

| # | Capability | Business Owner | Technical Owner | Database Owner | API Owner | Frontend Owner | Support Team |
|---|-----------|---------------|-----------------|----------------|-----------|----------------|--------------|
| 1.1 | Project Management | Migration Lead | Backend Team | core schema | Backend Team | Frontend Team | DevOps |
| 1.2 | Connection Management | Migration Lead | Backend Team | core schema | Backend Team | Frontend Team | DevOps |
| 1.3 | Dataset Discovery | Migration Lead | Backend Team | core, engine schemas | Backend Team | Frontend Team | DevOps |
| 1.4 | Dataset Mapping | Migration Lead | Backend Team | core schema | Backend Team | Frontend Team | DevOps |
| 1.5 | Column Mapping | Migration Lead | Backend Team | core schema | Backend Team | Frontend Team | DevOps |
| 2.1 | Rule Discovery | Migration Lead | Backend Team | engine, core schemas | Backend Team | Frontend Team | DevOps |
| 2.2 | Control Discovery | Migration Lead | Backend Team | engine schema | Backend Team | Frontend Team | DevOps |
| 2.3 | Validation Execution | Migration Lead | Backend Team | engine schema | Backend Team | Frontend Team | DevOps |
| 2.4 | Checkpointing | Migration Lead | Backend Team | engine schema | Backend Team | — | DevOps |
| 2.5 | Retry Engine | Migration Lead | Backend Team | — | Backend Team | — | DevOps |
| 3.1 | Governance Decisions | Governance Officer | Backend Team | engine schema | Backend Team | Frontend Team | DevOps |
| 3.2 | Risk Scoring | Governance Officer | Backend Team | engine schema | Backend Team | Frontend Team | DevOps |
| 3.3 | Release Gates | Governance Officer | Backend Team | engine schema | Backend Team | Frontend Team | DevOps |
| 3.4 | Approvals | Governance Officer | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 4.1 | Executive Reporting | Programme Sponsor | Backend Team | reporting schema | Backend Team | Frontend Team | BI Team |
| 4.2 | Operational Reporting | Programme Manager | Backend Team | engine schema | Backend Team | Frontend Team | BI Team |
| 4.3 | Governance Reporting | Governance Officer | Backend Team | engine schema | Backend Team | Frontend Team | BI Team |
| 4.4 | Technical Reporting | Migration Lead | Backend Team | engine schema | Backend Team | Frontend Team | BI Team |
| 4.5 | Dashboard Services | Programme Sponsor | Backend Team | reporting schema | Backend Team | Frontend Team | BI Team |
| 4.6 | Export Services | Programme Manager | Backend Team | — | Backend Team | Frontend Team | BI Team |
| 5.1 | Workflow Management | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 5.2 | Task Management | Programme Manager | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 5.3 | Notification Services | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 5.4 | Calendar Services | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 5.5 | AI / MAP Copilot | Administrator | Frontend Team | — | — | Frontend Team | AI Team |
| 5.6 | Authentication | Security Officer | Platform Team | platform schema | Platform Team | Frontend Team | Security Team |
| 6.1 | User Management | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | Security Team |
| 6.2 | Role & Permission Management | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | Security Team |
| 6.3 | Tenant Management | Administrator | Platform Team | core schema | — | Frontend Team | DevOps |
| 6.4 | System Settings | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 6.5 | Feature Flags | Administrator | Platform Team | platform schema | Platform Team | Frontend Team | DevOps |
| 6.6 | Security Management | Security Officer | Security Team | audit schema | — | Frontend Team | Security Team |
| 6.7 | Audit Trail | Security Officer | Backend Team | audit schema | Backend Team | Frontend Team | Security Team |
| 6.8 | Maintenance & Health | Administrator | DevOps Team | — | Backend Team | Frontend Team | DevOps |

---

## 9. Capability Lifecycle

### 9.1 Lifecycle Classifications

| # | Capability | Lifecycle Stage | Evidence |
|---|-----------|----------------|----------|
| 1.1 | Project Management | Implemented | Config-level, not first-class CRUD |
| 1.2 | Connection Management | Operational | Full CRUD API + Frontend |
| 1.3 | Dataset Discovery | Implemented | CLI-only, no API |
| 1.4 | Dataset Mapping | Implemented | Auto-created, no manual API |
| 1.5 | Column Mapping | Implemented | Auto-created, no manual API |
| 2.1 | Rule Discovery | Implemented | Auto during execution |
| 2.2 | Control Discovery | Implemented | Auto during execution |
| 2.3 | Validation Execution | Operational | Trigger API + Frontend |
| 2.4 | Checkpointing | Implemented | Automatic, no user-facing |
| 2.5 | Retry Engine | Implemented | Automatic, no user-facing |
| 3.1 | Governance Decisions | Implemented | Auto post-execution |
| 3.2 | Risk Scoring | Implemented | Auto post-execution |
| 3.3 | Release Gates | Implemented | Auto post-execution |
| 3.4 | Approvals | Operational | Full CRUD API + Frontend |
| 4.1 | Executive Reporting | Implemented | SQL views only |
| 4.2 | Operational Reporting | Implemented | SQL views only |
| 4.3 | Governance Reporting | Implemented | SQL views only |
| 4.4 | Technical Reporting | Implemented | SQL views only |
| 4.5 | Dashboard Services | Implemented | SQL views only |
| 4.6 | Export Services | Implemented | CLI only |
| 5.1 | Workflow Management | Operational | Full CRUD API + Frontend |
| 5.2 | Task Management | Operational | Full CRUD API + Frontend |
| 5.3 | Notification Services | Operational | Full CRUD API + Frontend |
| 5.4 | Calendar Services | Operational | Full CRUD API + Frontend |
| 5.5 | AI / MAP Copilot | Proposed | Frontend-local mock |
| 5.6 | Authentication | Operational | Full CRUD API + Frontend |
| 6.1 | User Management | Operational | Full CRUD API + Frontend |
| 6.2 | Role & Permission Management | Operational | Full CRUD API + Frontend |
| 6.3 | Tenant Management | Proposed | No API, mock frontend |
| 6.4 | System Settings | Operational | Full CRUD API + Frontend |
| 6.5 | Feature Flags | Implemented | API + mock frontend |
| 6.6 | Security Management | Proposed | No API, mock frontend |
| 6.7 | Audit Trail | Implemented | Middleware only |
| 6.8 | Maintenance & Health | Operational | Health check APIs |

### 9.2 Lifecycle Summary

| Stage | Count | Capabilities |
|-------|-------|--------------|
| Operational | 14 | Connection Mgmt, Validation Execution, Approvals, Workflow, Tasks, Notifications, Calendar, Auth, Users, Roles, Settings, Health |
| Implemented | 16 | Project Mgmt, Discovery, Mappings, Rules, Controls, Checkpointing, Retry, Governance, Risk, Release, Reporting, Export, Feature Flags, Audit |
| Proposed | 4 | AI Copilot, Tenant Mgmt, Security Mgmt |

---

## 10. Capability Maturity

### 10.1 Maturity Scoring

| Score | Level | Definition |
|-------|-------|------------|
| 1 | Initial | Ad-hoc, no process |
| 2 | Repeatable | Some processes exist, not standardised |
| 3 | Defined | Standard processes documented |
| 4 | Managed | Measured and controlled |
| 5 | Optimised | Continuous improvement |

### 10.2 Capability Maturity Scores

| # | Capability | Score | Level | Reasoning |
|---|-----------|-------|-------|-----------|
| 1.1 | Project Management | 2 | Repeatable | Config-level, not CRUD |
| 1.2 | Connection Management | 4 | Managed | Full CRUD, encrypted, tested |
| 1.3 | Dataset Discovery | 3 | Defined | Working but CLI-only |
| 1.4 | Dataset Mapping | 3 | Defined | Working but auto-created |
| 1.5 | Column Mapping | 3 | Defined | Working but auto-created |
| 2.1 | Rule Discovery | 3 | Defined | 10 rule types, auto-inference |
| 2.2 | Control Discovery | 3 | Defined | Working but auto during execution |
| 2.3 | Validation Execution | 4 | Managed | 6-step pipeline, parallel, checkpointing |
| 2.4 | Checkpointing | 3 | Defined | Working, automatic |
| 2.5 | Retry Engine | 3 | Defined | 3-level retry, automatic |
| 3.1 | Governance Decisions | 3 | Defined | Working but auto post-execution |
| 3.2 | Risk Scoring | 3 | Defined | Weighted algorithms working |
| 3.3 | Release Gates | 3 | Defined | Configurable gates working |
| 3.4 | Approvals | 4 | Managed | Full CRUD, multi-step, RBAC |
| 4.1 | Executive Reporting | 2 | Repeatable | SQL views exist, no API |
| 4.2 | Operational Reporting | 2 | Repeatable | SQL views exist, no API |
| 4.3 | Governance Reporting | 2 | Repeatable | SQL views exist, no API |
| 4.4 | Technical Reporting | 2 | Repeatable | SQL views exist, no API |
| 4.5 | Dashboard Services | 2 | Repeatable | SQL views exist, no API |
| 4.6 | Export Services | 2 | Repeatable | CLI only |
| 5.1 | Workflow Management | 4 | Managed | Full CRUD, step execution |
| 5.2 | Task Management | 4 | Managed | Full CRUD, comments, dependencies |
| 5.3 | Notification Services | 4 | Managed | Full CRUD, preferences |
| 5.4 | Calendar Services | 4 | Managed | Full CRUD, reminders |
| 5.5 | AI / MAP Copilot | 1 | Initial | Frontend-local mock only |
| 5.6 | Authentication | 4 | Managed | JWT, bcrypt, refresh tokens |
| 6.1 | User Management | 4 | Managed | Full CRUD, role assignment |
| 6.2 | Role & Permission Management | 4 | Managed | Full CRUD, 47 permissions |
| 6.3 | Tenant Management | 1 | Initial | No API, mock frontend |
| 6.4 | System Settings | 4 | Managed | Full CRUD, category-based |
| 6.5 | Feature Flags | 3 | Defined | API exists, mock frontend |
| 6.6 | Security Management | 1 | Initial | No API, mock frontend |
| 6.7 | Audit Trail | 2 | Repeatable | Middleware logging only |
| 6.8 | Maintenance & Health | 4 | Managed | Health check endpoints |

### 10.3 Maturity Summary

| Level | Count | Capabilities |
|-------|-------|--------------|
| 5 Optimised | 0 | — |
| 4 Managed | 14 | Connection, Execution, Approvals, Workflow, Tasks, Notifications, Calendar, Auth, Users, Roles, Settings, Health |
| 3 Defined | 12 | Discovery, Mappings, Rules, Controls, Checkpointing, Retry, Governance, Risk, Release, Feature Flags |
| 2 Repeatable | 6 | Project Mgmt, Reporting (×5), Export, Audit |
| 1 Initial | 3 | AI Copilot, Tenant Mgmt, Security Mgmt |

---

## 11. Gap Analysis Summary

### 11.1 Capabilities Without APIs

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Dataset Discovery | CLI only | Create /api/v1/discovery endpoints |
| 2 | Column Mapping | Auto-created | Create /api/v1/column-mappings endpoints |
| 3 | Control Discovery | Auto during execution | Create /api/v1/controls endpoints |
| 4 | Governance Decisions | Auto post-execution | Create /api/v1/governance endpoints |
| 5 | Risk Scoring | Auto post-execution | Create /api/v1/risk endpoints |
| 6 | Release Gates | Auto post-execution | Create /api/v1/release endpoints |
| 7 | Reporting (SQL Views) | BI tools only | Create /api/v1/reports endpoints |
| 8 | Audit Trail | File-based | Create /api/v1/audit endpoints |

### 11.2 Capabilities Without Frontend

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Dataset Discovery | None | Create Migration > Discovery page |
| 2 | Column Mapping | None | Create Migration > Column Mappings page |
| 3 | Control Discovery | None | Create Governance > Controls page |
| 4 | Checkpointing | None | Expose via Operations > Monitoring |
| 5 | Retry Engine | None | Expose via Operations > Retry |

### 11.3 Platform Capabilities Without Engine Link

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Task Management | Platform-only | Link to engine events |
| 2 | Workflow Management | Platform-only | Link to engine events |
| 3 | Notifications | Platform-only | Subscribe to engine events |
| 4 | Calendar | Platform-only | Link to engine milestones |
| 5 | AI / MAP Copilot | Frontend-local | Connect to engine APIs |

---

## 12. Capability Roadmap

### 12.1 Roadmap Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Business Value | 40% | Impact on migration quality and compliance |
| Technical Dependency | 25% | Number of capabilities blocked |
| Risk | 20% | Regulatory and data quality risk |
| Complexity | 15% | Implementation effort |

### 12.2 Implementation Roadmap

| Phase | Capability | Business Value | Tech Dependency | Risk | Complexity | Score | Priority |
|-------|------------|----------------|-----------------|------|------------|-------|----------|
| P1 | Governance Decisions | HIGH | HIGH | HIGH | MEDIUM | 9.5 | CRITICAL |
| P1 | Risk Scoring | HIGH | HIGH | HIGH | LOW | 9.0 | CRITICAL |
| P1 | Release Gates | HIGH | HIGH | HIGH | LOW | 9.0 | CRITICAL |
| P1 | Reporting (SQL Views) | HIGH | MEDIUM | HIGH | LOW | 8.5 | CRITICAL |
| P2 | Dataset Discovery | HIGH | HIGH | MEDIUM | MEDIUM | 8.0 | HIGH |
| P2 | Column Mapping | MEDIUM | HIGH | MEDIUM | LOW | 7.0 | HIGH |
| P2 | Control Discovery | MEDIUM | MEDIUM | MEDIUM | LOW | 6.5 | HIGH |
| P2 | Audit Trail | MEDIUM | LOW | HIGH | LOW | 6.5 | HIGH |
| P3 | Project Management | HIGH | LOW | LOW | MEDIUM | 6.0 | MEDIUM |
| P3 | Rule Discovery | MEDIUM | LOW | LOW | LOW | 5.0 | MEDIUM |
| P3 | Checkpointing | LOW | LOW | LOW | LOW | 3.0 | LOW |
| P3 | Retry Engine | LOW | LOW | LOW | LOW | 3.0 | LOW |
| P4 | AI / MAP Copilot | LOW | LOW | LOW | HIGH | 3.5 | LOW |
| P4 | Tenant Management | LOW | LOW | LOW | MEDIUM | 3.0 | LOW |
| P4 | Security Management | LOW | LOW | MEDIUM | MEDIUM | 4.0 | LOW |

### 12.3 Phase Summary

| Phase | Duration | Capabilities | Impact |
|-------|----------|--------------|--------|
| P1 | Weeks 1-2 | 4 | Governance portal live, Reports portal live |
| P2 | Weeks 3-4 | 4 | Discovery, Column Mapping, Controls, Audit |
| P3 | Weeks 5-6 | 4 | Project Management, Rules, Checkpointing, Retry |
| P4 | Weeks 7-8 | 3 | AI, Tenant, Security |

---

## 13. Enterprise Navigation

### 13.1 Navigation Model

```text
MAP Nexus
├── Home
│   └── Dashboard
├── Migration
│   ├── Projects
│   ├── Discovery
│   ├── Mappings
│   ├── Column Mappings
│   ├── Execution
│   ├── History
│   ├── Reports
│   └── Workspace
├── Validation
│   ├── Rules
│   ├── Rule Discovery
│   ├── Results
│   ├── Queue
│   └── Controls
├── Governance
│   ├── Overview
│   ├── Compliance
│   ├── Controls
│   ├── Exceptions
│   ├── Risk
│   ├── Audit
│   └── Approvals
├── Reports
│   ├── Executive
│   ├── Operational
│   ├── Migration
│   ├── Validation
│   ├── Governance
│   ├── Audit
│   ├── Templates
│   └── Distribution
├── Operations
│   ├── Monitoring
│   ├── Alerts
│   ├── Schedules
│   ├── Retry
│   └── Health
├── Administration
│   ├── Users
│   ├── Roles
│   ├── Tenants
│   ├── Settings
│   ├── Feature Flags
│   ├── Security
│   ├── Notifications
│   └── Maintenance
└── Tasks
    ├── Dashboard
    ├── My Tasks
    ├── Workflows
    ├── Calendar
    └── Notifications
```

### 13.2 Navigation Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Top-Level Menus | 17 | 8 |
| Submenus | 103+ | ~60 |
| Pages | 134 | ~70 |
| Max Depth | 3 levels | 2 levels |

---

## 14. Cross Validation

### 14.1 Architecture Alignment

| Capability | Architecture | Database | Backend | Frontend | API | Reporting | Security | Navigation | Status |
|-----------|-------------|----------|---------|----------|-----|-----------|----------|------------|--------|
| Project Management | ✓ | ✓ | ✓ | ⚠ Partial | ⚠ Partial | ✓ | ✓ | ✓ | ALIGNED |
| Connection Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Dataset Discovery | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Dataset Mapping | ✓ | ✓ | ✓ | ⚠ Partial | ✗ | ✓ | ✓ | ✓ | GAP |
| Column Mapping | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Rule Discovery | ✓ | ✓ | ✓ | ⚠ Partial | ✗ | ✓ | ✓ | ✓ | GAP |
| Control Discovery | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Validation Execution | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Checkpointing | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Retry Engine | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Governance Decisions | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Risk Scoring | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Release Gates | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Approvals | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Executive Reporting | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Operational Reporting | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Governance Reporting | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Technical Reporting | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Dashboard Services | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | PARTIAL |
| Export Services | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | GAP |
| Workflow Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Task Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Notification Services | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Calendar Services | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| AI / MAP Copilot | ✓ | ✗ | ✗ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Authentication | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| User Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Role & Permission Mgmt | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Tenant Management | ✓ | ✓ | ✗ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| System Settings | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ALIGNED |
| Feature Flags | ✓ | ✓ | ✓ | ⚠ Mock | ✓ | ✓ | ✓ | ✓ | PARTIAL |
| Security Management | ✓ | ✓ | ✗ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Audit Trail | ✓ | ✓ | ✓ | ⚠ Mock | ✗ | ✓ | ✓ | ✓ | GAP |
| Maintenance & Health | ✓ | ✓ | ✓ | ⚠ Mock | ✓ | ✓ | ✓ | ✓ | PARTIAL |

### 14.2 Alignment Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ALIGNED | 14 | 41% |
| PARTIAL | 3 | 9% |
| GAP | 17 | 50% |

### 14.3 Inconsistencies Documented

| # | Inconsistency | Impact | Recommended Action |
|---|--------------|--------|-------------------|
| 1 | 17 capabilities have no API endpoints | Frontend cannot display real data | Create REST endpoints |
| 2 | 5 capabilities have no frontend pages | Users cannot access | Create frontend pages |
| 3 | 5 platform capabilities not linked to engine | Siloed operation | Implement event subscriptions |
| 4 | 8 frontend portals use mock data | No real data displayed | Wire to APIs |
| 5 | AI Copilot is frontend-local | No engine integration | Connect to engine APIs |
| 6 | Tenant Management has no backend | Multi-tenancy not functional | Implement tenant service |
| 7 | Security Management has no backend | Security features non-functional | Implement security service |

---

## 15. Supporting Documentation

The following reports provide detailed analysis supporting this capability model:

| # | Report | Location |
|---|--------|----------|
| 01 | Executive Summary | 02_Output/16_Enterprise_Business_Capability_Model/01_Executive_Summary.md |
| 02 | Business Capability Catalogue | 02_Output/16_Enterprise_Business_Capability_Model/02_Business_Capability_Catalogue.md |
| 03 | Business Capability Hierarchy | 02_Output/16_Enterprise_Business_Capability_Model/03_Business_Capability_Hierarchy.md |
| 04 | Business Capability Dependencies | 02_Output/16_Enterprise_Business_Capability_Model/04_Business_Capability_Dependencies.md |
| 05 | Business Event Model | 02_Output/16_Enterprise_Business_Capability_Model/05_Business_Event_Model.md |
| 06 | Capability to API Mapping | 02_Output/16_Enterprise_Business_Capability_Model/06_Capability_to_API_Mapping.md |
| 07 | Capability to Database Mapping | 02_Output/16_Enterprise_Business_Capability_Model/07_Capability_to_Database_Mapping.md |
| 08 | Capability to Python Mapping | 02_Output/16_Enterprise_Business_Capability_Model/08_Capability_to_Python_Mapping.md |
| 09 | Capability to Frontend Mapping | 02_Output/16_Enterprise_Business_Capability_Model/09_Capability_to_Frontend_Mapping.md |
| 10 | Recommended Enterprise Navigation | 02_Output/16_Enterprise_Business_Capability_Model/10_Recommended_Enterprise_Navigation.md |
| 11 | Business Capability Gap Report | 02_Output/16_Enterprise_Business_Capability_Model/11_Business_Capability_Gap_Report.md |
| 12 | Generation Report | 02_Output/16_Enterprise_Business_Capability_Model/12_Generation_Report.md |
| 13 | Generation Change Log | 02_Output/16_Enterprise_Business_Capability_Model/13_Generation_Change_Log.md |

---

## 16. Governance

### 16.1 Promotion Rules
- This document is promoted to `00_Architecture/` after engineering review and explicit user approval
- Supporting reports remain in `02_Output/` as engineering documentation
- Only one approved architecture document shall exist for each architectural subject

### 16.2 Amendment Process
- Changes to this document require engineering review
- Amendments must preserve traceability to supporting reports
- Version number increments on each approved change

---

## 17. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This document is part of the MAP Nexus Enterprise Architecture framework. It establishes the business capability model that all future MAP development must follow.*