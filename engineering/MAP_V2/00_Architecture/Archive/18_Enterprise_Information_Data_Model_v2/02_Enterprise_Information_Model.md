# Enterprise Information Model

**Document ID:** 18-02  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the enterprise information architecture for MAP Nexus. It identifies all business information objects, their relationships, ownership, and supporting systems.

---

## 2. Business Information Objects

### 2.1 Migration Domain

#### Project

| Field | Value |
|-------|-------|
| **Business Purpose** | Track migration projects from initiation to completion |
| **Business Description** | Container for all migration activities, datasets, and validations |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers, Programme Manager |
| **Primary Producers** | Migration Lead |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must have source and target systems; Must have assigned team; Status must progress through defined states |
| **Relationships** | Contains Datasets, Mappings, Validations |
| **Supporting Systems** | core.projects, app.execution_engine |
| **Evidence** | core.projects table; app.execution_engine project configuration |

```
Project
├── Datasets
│   ├── Dataset Mappings
│   │   └── Column Mappings
│   └── Dataset Columns
├── Connections
│   └── System Credentials
└── Validations
    ├── Batches
    ├── Controls
    └── Exceptions
```

---

#### Dataset

| Field | Value |
|-------|-------|
| **Business Purpose** | Represent discovered database tables |
| **Business Description** | Metadata about source/target tables discovered during migration |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers |
| **Primary Producers** | Discovery Engine |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must belong to a project; Must have schema and table name |
| **Relationships** | Belongs to Project; Has Columns; Has Mappings |
| **Supporting Systems** | core.datasets, core.dataset_columns |
| **Evidence** | core.datasets table; core.dataset_columns table |

---

#### Dataset Mapping

| Field | Value |
|-------|-------|
| **Business Purpose** | Define source-to-target table mappings |
| **Business Description** | Maps source tables to target tables for validation |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers |
| **Primary Producers** | Migration Engineers, Discovery Engine |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must have source and target; Must be approved before execution |
| **Relationships** | Belongs to Project; Has Column Mappings |
| **Supporting Systems** | core.dataset_mappings, core.column_mappings |
| **Evidence** | core.dataset_mappings table; core.column_mappings table |

---

### 2.2 Validation Domain

#### Rule

| Field | Value |
|-------|-------|
| **Business Purpose** | Define validation rules for data quality checks |
| **Business Description** | Specific validation logic applied to data during migration |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers |
| **Primary Producers** | Migration Engineers, Rule Discovery |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must follow naming convention; Must be approved before execution |
| **Relationships** | Belongs to Mapping; Has Execution Results |
| **Supporting Systems** | engine.rule_registry, engine.rule_weights |
| **Evidence** | engine.rule_registry table; 10 rule types (C01-C010) |

---

#### Control

| Field | Value |
|-------|-------|
| **Business Purpose** | Define validation controls for data quality checks |
| **Business Description** | Higher-level validation logic that may contain multiple rules |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers |
| **Primary Producers** | Migration Engineers |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must be registered before execution; Must be enabled to run |
| **Relationships** | Has Rules; Has Execution Results |
| **Supporting Systems** | engine.control_registry |
| **Evidence** | engine.control_registry table |

---

#### Batch

| Field | Value |
|-------|-------|
| **Business Purpose** | Track validation execution runs |
| **Business Description** | A single execution of the validation pipeline |
| **Business Owner** | Migration Lead |
| **Primary Consumers** | Migration Engineers, Programme Manager |
| **Primary Producers** | Validation Engine |
| **Business Criticality** | High |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | 7 years |
| **Business Rules** | Must belong to a project; Must have start/end timestamps |
| **Relationships** | Belongs to Project; Has Control Results; Has Exceptions |
| **Supporting Systems** | engine.migration_validation_batch, engine.migration_batch_summary |
| **Evidence** | engine.migration_validation_batch table; engine.migration_batch_summary table |

---

### 2.3 Governance Domain

#### Governance Decision

| Field | Value |
|-------|-------|
| **Business Purpose** | Record governance decisions on validation results |
| **Business Description** | Formal decision to approve, reject, or block a batch |
| **Business Owner** | Governance Officer |
| **Primary Consumers** | Governance Officers, Programme Manager |
| **Primary Producers** | Governance Engine |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Confidential |
| **Retention Requirement** | 10 years |
| **Business Rules** | Must have batch reference; Must have decision and rationale |
| **Relationships** | Belongs to Batch; Has Risk Scores |
| **Supporting Systems** | engine.migration_governance_status, engine.migration_risk_scores |
| **Evidence** | engine.migration_governance_status table; engine.migration_risk_scores table |

---

#### Release Decision

| Field | Value |
|-------|-------|
| **Business Purpose** | Record release approval decisions |
| **Business Description** | Formal decision to approve or reject a release |
| **Business Owner** | Governance Officer |
| **Primary Consumers** | Programme Manager, Governance Officers |
| **Primary Producers** | Approval Service |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Confidential |
| **Retention Requirement** | 10 years |
| **Business Rules** | Must have governance decision; Must have authorised approver |
| **Relationships** | Belongs to Governance Decision |
| **Supporting Systems** | engine.migration_release_decision, platform.approval_requests |
| **Evidence** | engine.migration_release_decision table; platform.approval_requests table |

---

### 2.4 Platform Domain

#### User

| Field | Value |
|-------|-------|
| **Business Purpose** | Represent platform users |
| **Business Description** | Individual users who access the platform |
| **Business Owner** | Administrator |
| **Primary Consumers** | All Users |
| **Primary Producers** | Administrator |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Confidential |
| **Retention Requirement** | Active + 3 years |
| **Business Rules** | Must have unique username; Must have role assignment |
| **Relationships** | Has Roles; Has Sessions; Has Notifications |
| **Supporting Systems** | platform.users, platform.user_roles |
| **Evidence** | platform.users table; platform.user_roles table |

---

#### Role

| Field | Value |
|-------|-------|
| **Business Purpose** | Define RBAC roles |
| **Business Description** | Collections of permissions assigned to users |
| **Business Owner** | Administrator |
| **Primary Consumers** | All Users |
| **Primary Producers** | Administrator |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Internal |
| **Retention Requirement** | Active + 3 years |
| **Business Rules** | Must have unique name; Must have permissions assigned |
| **Relationships** | Has Permissions; Assigned to Users |
| **Supporting Systems** | platform.roles, platform.permissions, platform.role_permissions |
| **Evidence** | platform.roles table; 47 permissions defined |

---

#### Tenant

| Field | Value |
|-------|-------|
| **Business Purpose** | Support multi-tenant deployment |
| **Business Description** | Logical isolation boundary for customer data |
| **Business Owner** | Administrator |
| **Primary Consumers** | All Users |
| **Primary Producers** | Administrator |
| **Business Criticality** | Critical |
| **Sensitivity Classification** | Confidential |
| **Retention Requirement** | Active + 5 years |
| **Business Rules** | Must be isolated; Must have configuration |
| **Relationships** | Contains Users; Contains Projects |
| **Supporting Systems** | core.tenants, tenant_id in JWT |
| **Evidence** | core.tenants table; tenant_id in JWT tokens |

---

## 3. Information Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enterprise Information Model                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tenant ──┬── User ──┬── Roles ── Permissions                  │
│           │          ├── Sessions                               │
│           │          └── Notifications                          │
│           │                                                     │
│           └── Project ──┬── Datasets ── Columns                 │
│                         ├── Mappings ── Column Mappings         │
│                         ├── Connections ── Credentials           │
│                         ├── Batches ──┬── Control Results        │
│                         │             ├── Exceptions             │
│                         │             └── Governance Decisions   │
│                         └── Rules ── Control Registry            │
│                                                                 │
│  Governance ──┬── Risk Scores                                   │
│               └── Release Decisions                             │
│                                                                 │
│  Platform ──┬── Workflows ── Workflow Steps                     │
│             ├── Approvals ── Approval Steps                     │
│             ├── Tasks ── Comments, Dependencies                  │
│             ├── Calendar ── Reminders                            │
│             └── Settings ── Feature Flags                        │
│                                                                 │
│  Audit ──┬── Audit Events                                       │
│          ├── Security Events                                    │
│          ├── Login History                                      │
│          ├── API Logs                                           │
│          └── Configuration History                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Business Information Object Summary

| # | Object | Domain | Criticality | Owner | Evidence |
|---|--------|--------|-------------|-------|----------|
| 1 | Project | Migration | Critical | Migration Lead | core.projects |
| 2 | Dataset | Migration | Critical | Migration Lead | core.datasets |
| 3 | Dataset Mapping | Migration | Critical | Migration Lead | core.dataset_mappings |
| 4 | Column Mapping | Migration | Critical | Migration Lead | core.column_mappings |
| 5 | System | Migration | Critical | Migration Lead | core.system_registry |
| 6 | Credential | Migration | Critical | Security Officer | core.system_credentials |
| 7 | Rule | Validation | Critical | Migration Lead | engine.rule_registry |
| 8 | Control | Validation | Critical | Migration Lead | engine.control_registry |
| 9 | Batch | Validation | High | Migration Lead | engine.migration_validation_batch |
| 10 | Control Result | Validation | High | Migration Lead | engine.migration_control_summary |
| 11 | Exception | Validation | High | Migration Lead | engine.migration_exception_register |
| 12 | Governance Decision | Governance | Critical | Governance Officer | engine.migration_governance_status |
| 13 | Risk Score | Governance | Critical | Governance Officer | engine.migration_risk_scores |
| 14 | Release Decision | Governance | Critical | Governance Officer | engine.migration_release_decision |
| 15 | User | Platform | Critical | Administrator | platform.users |
| 16 | Role | Platform | Critical | Administrator | platform.roles |
| 17 | Permission | Platform | Critical | Administrator | platform.permissions |
| 18 | Tenant | Platform | Critical | Administrator | core.tenants |
| 19 | Workflow | Platform | High | Administrator | platform.workflow_definitions |
| 20 | Approval | Platform | High | Administrator | platform.approval_requests |
| 21 | Task | Platform | High | Programme Manager | platform.tasks |
| 22 | Notification | Platform | Medium | Administrator | platform.notifications |
| 23 | Calendar Event | Platform | Medium | Administrator | platform.calendar_events |
| 24 | Setting | Platform | Medium | Administrator | platform.system_settings |
| 25 | Feature Flag | Platform | Medium | Administrator | platform.feature_flags |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This information model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*
