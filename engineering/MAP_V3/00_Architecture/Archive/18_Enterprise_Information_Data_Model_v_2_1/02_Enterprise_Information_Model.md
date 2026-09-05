# Enterprise Information Model

**Document ID:** 18-02  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the enterprise information architecture for MAP Nexus. It identifies all business information objects, their relationships, ownership, and supporting systems.

---

## 2. Migration Domain Objects

### 2.1 Tenant

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Multi-tenant isolation boundary |
| **Business Definition** | Logical container for customer data and configuration |
| **Domain** | Migration Management |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | Administrator |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | Active + 5 years |
| **Business Rules** | Must be isolated; Must have configuration |
| **Relationships** | Contains Users, Projects, Settings |
| **Current Evidence** | core.tenants table; tenant_id in JWT tokens |
| **Target State** | Full tenant lifecycle management with automated provisioning |

### 2.2 Project

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Track migration projects |
| **Business Definition** | Container for all migration activities, datasets, and validations |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Programme Manager |
| **Producers** | Migration Lead |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must have source and target systems; Must have assigned team |
| **Relationships** | Belongs to Tenant; Contains Datasets, Mappings, Batches |
| **Current Evidence** | core.projects table |
| **Target State** | Automated project templates and workflow |

### 2.3 System

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Register database connections |
| **Business Definition** | Metadata about source/target database systems |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Migration Engineers |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must have connection details; Must be tested |
| **Relationships** | Belongs to Project; Has Credentials |
| **Current Evidence** | core.system_registry table |
| **Target State** | Automated connection pooling and health monitoring |

### 2.4 Connection

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Database connection configuration |
| **Business Definition** | Connection parameters for source/target databases |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Discovery Engine |
| **Producers** | Migration Engineers |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 7 years |
| **Business Rules** | Credentials must be encrypted; Must be tested before use |
| **Relationships** | Belongs to System; Has Credentials |
| **Current Evidence** | core.system_registry, core.system_credentials |
| **Target State** | Automated credential rotation |

### 2.5 Credential

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Securely store database credentials |
| **Business Definition** | Encrypted authentication credentials |
| **Domain** | Migration Management |
| **Owner** | Security Officer |
| **Consumers** | Migration Engineers, Discovery Engine |
| **Producers** | Migration Engineers |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 7 years |
| **Business Rules** | Must be encrypted at rest; Must be rotated per policy |
| **Relationships** | Belongs to System |
| **Current Evidence** | core.system_credentials table; Fernet encryption |
| **Target State** | Automated key rotation and escrow |

### 2.6 Dataset

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Represent discovered tables |
| **Business Definition** | Metadata about source/target tables discovered during migration |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Discovery Engine |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must belong to a project; Must have schema and table name |
| **Relationships** | Belongs to Project; Has Columns; Has Mappings |
| **Current Evidence** | core.datasets table |
| **Target State** | Automated schema change detection |

### 2.7 Dataset Column

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Represent discovered columns |
| **Business Definition** | Column-level metadata including data types and constraints |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Discovery Engine |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must capture data type, nullability, and constraints |
| **Relationships** | Belongs to Dataset; Has Column Mappings |
| **Current Evidence** | core.dataset_columns table |
| **Target State** | Automated data profiling and classification |

### 2.8 Dataset Mapping

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define source-to-target table mappings |
| **Business Definition** | Maps source tables to target tables for validation |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Migration Engineers, Discovery Engine |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must have source and target; Must be approved before execution |
| **Relationships** | Belongs to Project; Has Column Mappings |
| **Current Evidence** | core.dataset_mappings table |
| **Target State** | AI-assisted mapping recommendations |

### 2.9 Column Mapping

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define source-to-target column mappings |
| **Business Definition** | Maps source columns to target columns with transformation logic |
| **Domain** | Migration Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Migration Engineers, Discovery Engine |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must reference valid table mappings; May include transformation |
| **Relationships** | Belongs to Dataset Mapping |
| **Current Evidence** | core.column_mappings table |
| **Target State** | Automated transformation inference |

---

## 3. Validation Domain Objects

### 3.1 Rule

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define validation rules for data quality checks |
| **Business Definition** | Specific validation logic applied to data during migration |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Migration Engineers, Rule Discovery |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must follow naming convention; Must be approved before execution |
| **Relationships** | Belongs to Mapping; Has Execution Results |
| **Current Evidence** | engine.rule_registry table; 10 rule types (C01-C010) |
| **Target State** | AI-assisted rule generation |

### 3.2 Control

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define validation controls |
| **Business Definition** | Higher-level validation logic that may contain multiple rules |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Migration Engineers |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must be registered before execution; Must be enabled to run |
| **Relationships** | Has Rules; Has Execution Results |
| **Current Evidence** | engine.control_registry table |
| **Target State** | Dynamic control composition |

### 3.3 Validation Batch

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Track validation execution runs |
| **Business Definition** | A single execution of the validation pipeline |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Programme Manager |
| **Producers** | Validation Engine |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must belong to a project; Must have start/end timestamps |
| **Relationships** | Belongs to Project; Has Control Results; Has Exceptions |
| **Current Evidence** | engine.migration_validation_batch table |
| **Target State** | Parallel batch execution |

### 3.4 Control Result

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record control execution results |
| **Business Definition** | Outcome of executing a validation control |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Governance Officers |
| **Producers** | Validation Engine |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must have pass/fail status; Must be immutable |
| **Relationships** | Belongs to Batch; Belongs to Control |
| **Current Evidence** | engine.migration_control_summary table |
| **Target State** | Real-time result streaming |

### 3.5 Exception

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record validation exceptions |
| **Business Definition** | Data quality issues identified during validation |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Validation Engine |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must be categorised; Must be resolved before release |
| **Relationships** | Belongs to Batch |
| **Current Evidence** | engine.migration_exception_register table |
| **Target State** | Automated exception classification |

### 3.6 Execution Result

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record rule execution results |
| **Business Definition** | Outcome of executing a validation rule |
| **Domain** | Validation Management |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers |
| **Producers** | Validation Engine |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 7 years |
| **Business Rules** | Must have pass/fail status; Must include row counts |
| **Relationships** | Belongs to Batch; Belongs to Rule |
| **Current Evidence** | engine.migration_control_execution table |
| **Target State** | Performance analytics |

---

## 4. Governance Domain Objects

### 4.1 Governance Decision

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record governance decisions |
| **Business Definition** | Formal decision to approve, reject, or block a batch |
| **Domain** | Governance & Compliance |
| **Owner** | Governance Officer |
| **Consumers** | Governance Officers, Programme Manager |
| **Producers** | Governance Engine |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 10 years |
| **Business Rules** | Must have batch reference; Must have decision and rationale |
| **Relationships** | Belongs to Batch; Has Risk Assessment |
| **Current Evidence** | engine.migration_governance_status table |
| **Target State** | Automated governance workflows |

### 4.2 Risk Assessment

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record risk assessments |
| **Business Definition** | Weighted risk score for validation results |
| **Domain** | Governance & Compliance |
| **Owner** | Governance Officer |
| **Consumers** | Governance Officers |
| **Producers** | Risk Scoring Engine |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 10 years |
| **Business Rules** | Must be calculated; Must be documented |
| **Relationships** | Belongs to Governance Decision |
| **Current Evidence** | engine.migration_risk_scores table |
| **Target State** | Predictive risk analytics |

### 4.3 Release Decision

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Record release approval decisions |
| **Business Definition** | Formal decision to approve or reject a release |
| **Domain** | Governance & Compliance |
| **Owner** | Governance Officer |
| **Consumers** | Programme Manager, Governance Officers |
| **Producers** | Approval Service |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 10 years |
| **Business Rules** | Must have governance decision; Must have authorised approver |
| **Relationships** | Belongs to Governance Decision |
| **Current Evidence** | engine.migration_release_decision table |
| **Target State** | Automated release gates |

### 4.4 Approval

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Track approval workflows |
| **Business Definition** | Approval request and step tracking |
| **Domain** | Governance & Compliance |
| **Owner** | Governance Officer |
| **Consumers** | All Users |
| **Producers** | Approval Service |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 3 years |
| **Business Rules** | Must have requester; Must have decision |
| **Relationships** | Has Approval Steps |
| **Current Evidence** | platform.approval_requests, platform.approval_step_instances |
| **Target State** | Parallel approval workflows |

---

## 5. Platform Domain Objects

### 5.1 User

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Represent platform users |
| **Business Definition** | Individual users who access the platform |
| **Domain** | Administration |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | Administrator |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | Active + 3 years |
| **Business Rules** | Must have unique username; Must have role assignment |
| **Relationships** | Belongs to Tenant; Has Roles; Has Sessions |
| **Current Evidence** | platform.users table |
| **Target State** | SSO integration |

### 5.2 Role

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define RBAC roles |
| **Business Definition** | Collections of permissions assigned to users |
| **Domain** | Administration |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | Administrator |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | Active + 3 years |
| **Business Rules** | Must have unique name; Must have permissions assigned |
| **Relationships** | Has Permissions; Assigned to Users |
| **Current Evidence** | platform.roles table; 47 permissions |
| **Target State** | Dynamic role composition |

### 5.3 Permission

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define RBAC permissions |
| **Business Definition** | Granular access rights |
| **Domain** | Administration |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | Administrator |
| **Criticality** | Critical |
| **Classification** | Internal |
| **Retention** | Active + 3 years |
| **Business Rules** | Must have unique name; Must belong to domain |
| **Relationships** | Assigned to Roles |
| **Current Evidence** | platform.permissions table; 47 permissions |
| **Target State** | Attribute-based access control |

### 5.4 Workflow

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Define business workflows |
| **Business Definition** | Multi-step business process definitions |
| **Domain** | Platform Services |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | Administrator |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 3 years |
| **Business Rules** | Must have defined sequence; Must be approved |
| **Relationships** | Has Workflow Instances |
| **Current Evidence** | platform.workflow_definitions table |
| **Target State** | Visual workflow designer |

### 5.5 Task

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Track migration tasks |
| **Business Definition** | Work items assigned to users |
| **Domain** | Platform Services |
| **Owner** | Programme Manager |
| **Consumers** | All Users |
| **Producers** | All Users, System |
| **Criticality** | High |
| **Classification** | Internal |
| **Retention** | 3 years |
| **Business Rules** | Must be assigned; Must have status |
| **Relationships** | Has Comments; Has Dependencies |
| **Current Evidence** | platform.tasks table |
| **Target State** | Time tracking and resource allocation |

### 5.6 Notification

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Alert users of events |
| **Business Definition** | User notifications for platform events |
| **Domain** | Platform Services |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | All Services |
| **Criticality** | Medium |
| **Classification** | Internal |
| **Retention** | 1 year |
| **Business Rules** | Must respect user preferences; Must be logged |
| **Relationships** | Belongs to User |
| **Current Evidence** | platform.notifications table |
| **Target State** | Multi-channel delivery (email, SMS, push) |

### 5.7 Calendar Event

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Schedule events and reminders |
| **Business Definition** | Calendar entries for migration activities |
| **Domain** | Platform Services |
| **Owner** | Administrator |
| **Consumers** | All Users |
| **Producers** | All Services |
| **Criticality** | Medium |
| **Classification** | Internal |
| **Retention** | 1 year |
| **Business Rules** | Must have start/end; Must support reminders |
| **Relationships** | Has Reminders |
| **Current Evidence** | platform.calendar_events table |
| **Target State** | Calendar integration |

### 5.8 Feature Flag

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Control feature toggles |
| **Business Definition** | Feature enablement configuration |
| **Domain** | Platform Services |
| **Owner** | Administrator |
| **Consumers** | All Services |
| **Producers** | Administrator |
| **Criticality** | Medium |
| **Classification** | Internal |
| **Retention** | Active + 1 year |
| **Business Rules** | Must have unique name; Must have enable flag |
| **Relationships** | None |
| **Current Evidence** | platform.feature_flags table |
| **Target State** | Percentage rollouts |

### 5.9 Configuration

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Platform configuration |
| **Business Definition** | System-wide configuration settings |
| **Domain** | Platform Services |
| **Owner** | Administrator |
| **Consumers** | All Services |
| **Producers** | Administrator |
| **Criticality** | Medium |
| **Classification** | Internal |
| **Retention** | Active + 1 year |
| **Business Rules** | Must have unique key; Must be audited |
| **Relationships** | None |
| **Current Evidence** | platform.system_settings table |
| **Target State** | Environment-specific configuration |

---

## 6. Audit Domain Objects

### 6.1 Audit Event

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Log all platform activities |
| **Business Definition** | Immutable audit trail for compliance |
| **Domain** | Audit |
| **Owner** | Security Officer |
| **Consumers** | Security Officers, Auditors |
| **Producers** | Audit Middleware |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 3 years |
| **Business Rules** | Must be immutable; Must be logged for all API calls |
| **Relationships** | None |
| **Current Evidence** | audit.audit_events table |
| **Target State** | Real-time audit analytics |

### 6.2 Security Event

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Log security events |
| **Business Definition** | Security-related events and incidents |
| **Domain** | Security |
| **Owner** | Security Officer |
| **Consumers** | Security Officers |
| **Producers** | Security Services |
| **Criticality** | Critical |
| **Classification** | Confidential |
| **Retention** | 3 years |
| **Business Rules** | Must be logged; Must be investigated |
| **Relationships** | None |
| **Current Evidence** | audit.security_events table |
| **Target State** | SIEM integration |

### 6.3 Login History

| Attribute | Description |
|-----------|-------------|
| **Business Purpose** | Log authentication attempts |
| **Business Definition** | Record of all login attempts |
| **Domain** | Security |
| **Owner** | Security Officer |
| **Consumers** | Security Officers |
| **Producers** | Auth Service |
| **Criticality** | High |
| **Classification** | Confidential |
| **Retention** | 1 year |
| **Business Rules** | Must log success and failure; Must include timestamp |
| **Relationships** | None |
| **Current Evidence** | audit.login_history table |
| **Target State** | Brute force detection |

---

## 7. Information Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enterprise Information Model                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tenant ──┬── User ──┬── Roles ── Permissions                  │
│           │          ├── Sessions                               │
│           │          └── Notifications                          │
│           │                                                     │
│           └── Project ──┬── Systems ── Credentials              │
│                         ├── Datasets ── Columns                 │
│                         ├── Mappings ── Column Mappings         │
│                         ├── Batches ──┬── Control Results        │
│                         │             ├── Exceptions             │
│                         │             └── Execution Results      │
│                         └── Rules ── Control Registry            │
│                                                                 │
│  Governance ──┬── Governance Decisions                          │
│               ├── Risk Assessments                              │
│               └── Release Decisions                             │
│                                                                 │
│  Approval ──── Approval Steps                                  │
│                                                                 │
│  Workflow ──── Workflow Instances ── Step Instances              │
│                                                                 │
│  Task ──── Comments, Dependencies                               │
│                                                                 │
│  Calendar ──── Reminders                                        │
│                                                                 │
│  Audit ────┬── Audit Events                                     │
│            ├── Security Events                                  │
│            └── Login History                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Object Count Summary

| Domain | Objects | Evidence |
|--------|---------|----------|
| Migration Management | 9 | core.* tables |
| Validation Management | 6 | engine.* tables |
| Governance & Compliance | 4 | engine.*, platform.approval_* |
| Platform Services | 6 | platform.* tables |
| Administration | 3 | platform.* tables |
| Audit | 3 | audit.* tables |
| **Total** | **31** | |

---

## 9. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This information model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*