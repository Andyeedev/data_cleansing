# Master Reference Data Model

**Document ID:** 18-04  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document separates Master Data, Reference Data, Transactional Data, Configuration Data, and Metadata for the MAP Nexus platform. Each entity is documented with evidence.

---

## 2. Master Data Entities

### 2.1 Tenant

| Field | Value |
|-------|-------|
| **Purpose** | Multi-tenant isolation boundary |
| **Primary Key** | tenant_id (UUID) |
| **Natural Key** | tenant_name |
| **Relationships** | Has Users, Projects, Settings |
| **Owner** | Administrator |
| **Lifecycle** | Create → Configure → Activate → Deactivate → Archive |
| **Quality Rules** | Must be unique; Must have name; Must have status |
| **Evidence** | core.tenants table; tenant_id in JWT tokens |

### 2.2 Project

| Field | Value |
|-------|-------|
| **Purpose** | Track migration projects |
| **Primary Key** | project_id (SERIAL) |
| **Natural Key** | project_name + tenant_id |
| **Relationships** | Belongs to Tenant; Has Datasets, Mappings, Batches |
| **Owner** | Migration Lead |
| **Lifecycle** | Create → Configure → Execute → Complete → Archive |
| **Quality Rules** | Must have source/target systems; Must have assigned team |
| **Evidence** | core.projects table |

### 2.3 System

| Field | Value |
|-------|-------|
| **Purpose** | Register database connections |
| **Primary Key** | system_id (SERIAL) |
| **Natural Key** | system_name + project_id |
| **Relationships** | Belongs to Project; Has Credentials |
| **Owner** | Migration Lead |
| **Lifecycle** | Register → Test → Activate → Deactivate |
| **Quality Rules** | Must have connection details; Must be tested |
| **Evidence** | core.system_registry table |

### 2.4 Dataset

| Field | Value |
|-------|-------|
| **Purpose** | Represent discovered tables |
| **Primary Key** | dataset_id (SERIAL) |
| **Natural Key** | schema_name + table_name + project_id |
| **Relationships** | Belongs to Project; Has Columns, Mappings |
| **Owner** | Migration Lead |
| **Lifecycle** | Discover → Validate → Map → Approve |
| **Quality Rules** | Must have schema and table name; Must belong to project |
| **Evidence** | core.datasets table |

### 2.5 User

| Field | Value |
|-------|-------|
| **Purpose** | Platform user accounts |
| **Primary Key** | user_id (UUID) |
| **Natural Key** | username |
| **Relationships** | Has Roles, Sessions, Notifications |
| **Owner** | Administrator |
| **Lifecycle** | Create → Activate → Deactivate → Archive |
| **Quality Rules** | Must have unique username; Must have role assignment |
| **Evidence** | platform.users table |

### 2.6 Role

| Field | Value |
|-------|-------|
| **Purpose** | RBAC role definitions |
| **Primary Key** | role_id (UUID) |
| **Natural Key** | role_name |
| **Relationships** | Has Permissions; Assigned to Users |
| **Owner** | Administrator |
| **Lifecycle** | Create → Assign Permissions → Assign Users → Retire |
| **Quality Rules** | Must have unique name; Must have permissions |
| **Evidence** | platform.roles table; 47 permissions |

### 2.7 Rule

| Field | Value |
|-------|-------|
| **Purpose** | Validation rule definitions |
| **Primary Key** | rule_id (SERIAL) |
| **Natural Key** | rule_name + mapping_id |
| **Relationships** | Belongs to Mapping; Has Execution Results |
| **Owner** | Migration Lead |
| **Lifecycle** | Create → Approve → Execute → Archive |
| **Quality Rules** | Must follow naming convention; Must be approved |
| **Evidence** | engine.rule_registry table; 10 rule types |

### 2.8 Control

| Field | Value |
|-------|-------|
| **Purpose** | Validation control definitions |
| **Primary Key** | control_id (SERIAL) |
| **Natural Key** | control_name |
| **Relationships** | Has Rules; Has Execution Results |
| **Owner** | Migration Lead |
| **Lifecycle** | Register → Configure → Execute → Retire |
| **Quality Rules** | Must be registered; Must be enabled |
| **Evidence** | engine.control_registry table |

### 2.9 Batch

| Field | Value |
|-------|-------|
| **Purpose** | Validation execution runs |
| **Primary Key** | batch_id (SERIAL) |
| **Natural Key** | batch_id + project_id |
| **Relationships** | Belongs to Project; Has Control Results, Exceptions |
| **Owner** | Migration Lead |
| **Lifecycle** | Start → Execute → Complete → Archive |
| **Quality Rules** | Must have start/end timestamps; Must belong to project |
| **Evidence** | engine.migration_validation_batch table |

### 2.10 Workflow Definition

| Field | Value |
|-------|-------|
| **Purpose** | Workflow templates |
| **Primary Key** | workflow_id (UUID) |
| **Natural Key** | workflow_name |
| **Relationships** | Has Workflow Instances |
| **Owner** | Administrator |
| **Lifecycle** | Create → Validate → Activate → Retire |
| **Quality Rules** | Must have unique name; Must have steps |
| **Evidence** | platform.workflow_definitions table |

### 2.11 Task

| Field | Value |
|-------|-------|
| **Purpose** | Track migration tasks |
| **Primary Key** | task_id (UUID) |
| **Natural Key** | task_id |
| **Relationships** | Has Comments, Dependencies |
| **Owner** | Programme Manager |
| **Lifecycle** | Create → Assign → Execute → Complete |
| **Quality Rules** | Must be assigned; Must have status |
| **Evidence** | platform.tasks table |

### 2.12 Approval Request

| Field | Value |
|-------|-------|
| **Purpose** | Approval workflow requests |
| **Primary Key** | request_id (UUID) |
| **Natural Key** | request_id |
| **Relationships** | Has Approval Steps |
| **Owner** | Governance Officer |
| **Lifecycle** | Create → Route → Decide → Close |
| **Quality Rules** | Must have requester; Must have decision |
| **Evidence** | platform.approval_requests table |

---

## 3. Reference Data Sets

### 3.1 Status Reference Data

| Table | Values | Evidence |
|-------|--------|----------|
| Rule Types | C01-C010 | engine.rule_registry |
| Execution States | pending, running, completed, failed | engine.migration_validation_batch |
| Batch Status | created, running, completed, failed | engine.migration_validation_batch |
| Task Status | pending, in_progress, completed, blocked | platform.tasks |
| Approval Status | pending, approved, rejected | platform.approval_requests |
| Workflow Status | active, inactive, completed | platform.workflow_definitions |

### 3.2 Severity Reference Data

| Table | Values | Evidence |
|-------|--------|----------|
| Risk Levels | low, medium, high, critical | engine.migration_risk_scores |
| Exception Severity | low, medium, high, critical | engine.migration_exception_register |
| Control Results | pass, fail, warning, error | engine.migration_control_summary |

### 3.3 Permission Reference Data

| Table | Values | Evidence |
|-------|--------|----------|
| Permission Types | 47 permissions across 6 domains | platform.permissions |
| Role Types | admin, migration_lead, engineer, governance, viewer | platform.roles |

### 3.4 Event Type Reference Data

| Table | Values | Evidence |
|-------|--------|----------|
| Notification Events | 19 event types | platform.notification_preferences |
| Audit Event Types | api_call, security, login, configuration | audit.audit_events |

### 3.5 Date Reference Data

| Table | Values | Evidence |
|-------|--------|----------|
| Dim Date | Calendar dates for reporting | reporting.dim_date |
| Dim Severity | Severity levels for reporting | reporting.dim_severity |
| Dim Status | Status values for reporting | reporting.dim_status |

---

## 4. Transactional Data

| Entity | Table | Volume | Retention | Evidence |
|--------|-------|--------|-----------|----------|
| Batch Execution | engine.migration_validation_batch | High | 7 years | engine.migration_validation_batch |
| Control Execution | engine.migration_control_execution | High | 7 years | engine.migration_control_execution |
| Control Summary | engine.migration_control_summary | High | 7 years | engine.migration_control_summary |
| Exception Register | engine.migration_exception_register | High | 7 years | engine.migration_exception_register |
| Audit Events | audit.audit_events | Very High | 3 years | audit.audit_events |
| API Logs | audit.api_logs | Very High | 1 year | audit.api_logs |
| Login History | audit.login_history | High | 1 year | audit.login_history |

---

## 5. Configuration Data

| Entity | Table | Purpose | Evidence |
|--------|-------|---------|----------|
| System Settings | platform.system_settings | Platform configuration | platform.system_settings |
| Feature Flags | platform.feature_flags | Feature toggles | platform.feature_flags |
| Governance Config | engine.governance_config | Governance rules | engine.governance_config |
| Rule Weights | engine.rule_weights | Rule scoring weights | engine.rule_weights |
| Rule Weight Config | engine.rule_weight_config | Weight configuration | engine.rule_weight_config |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This master reference data model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*