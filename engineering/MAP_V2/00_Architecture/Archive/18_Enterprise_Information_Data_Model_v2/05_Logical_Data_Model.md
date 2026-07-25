# Logical Data Model

**Document ID:** 18-05  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the enterprise logical data model for MAP Nexus. It shows business entities, attributes, relationships, and cardinality without physical implementation details.

---

## 2. Core Business Entities

### 2.1 Tenant

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| tenant_id | Unique identifier | UUID | Yes |
| tenant_name | Business name | VARCHAR | Yes |
| status | Tenant status | VARCHAR | Yes |
| configuration | Tenant settings | JSONB | No |
| created_at | Creation timestamp | TIMESTAMP | Yes |
| updated_at | Last update timestamp | TIMESTAMP | Yes |

**Relationships:**
- Tenant 1:N User
- Tenant 1:N Project
- Tenant 1:N Setting

---

### 2.2 Project

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| project_id | Unique identifier | SERIAL | Yes |
| project_name | Business name | VARCHAR | Yes |
| tenant_id | Owning tenant | UUID | Yes |
| status | Project status | VARCHAR | Yes |
| configuration | Project settings | JSONB | No |
| created_at | Creation timestamp | TIMESTAMP | Yes |
| updated_at | Last update timestamp | TIMESTAMP | Yes |

**Relationships:**
- Project N:1 Tenant
- Project 1:N Dataset
- Project 1:N System
- Project 1:N Batch
- Project 1:N Mapping

**Cardinality:** One tenant has many projects; one project has many datasets.

---

### 2.3 System

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| system_id | Unique identifier | SERIAL | Yes |
| system_name | Business name | VARCHAR | Yes |
| project_id | Owning project | INTEGER | Yes |
| system_type | Source or target | VARCHAR | Yes |
| connection_details | Connection config | JSONB | Yes |
| status | System status | VARCHAR | Yes |

**Relationships:**
- System N:1 Project
- System 1:N Credential

---

### 2.4 Dataset

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| dataset_id | Unique identifier | SERIAL | Yes |
| schema_name | Database schema | VARCHAR | Yes |
| table_name | Table name | VARCHAR | Yes |
| project_id | Owning project | INTEGER | Yes |
| dataset_type | Source or target | VARCHAR | Yes |
| row_count | Estimated rows | BIGINT | No |

**Relationships:**
- Dataset N:1 Project
- Dataset 1:N DatasetColumn
- Dataset 1:N DatasetMapping

---

### 2.5 DatasetColumn

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| column_id | Unique identifier | SERIAL | Yes |
| dataset_id | Owning dataset | INTEGER | Yes |
| column_name | Column name | VARCHAR | Yes |
| data_type | Data type | VARCHAR | Yes |
| is_nullable | Nullability | BOOLEAN | Yes |
| ordinal_position | Column order | INTEGER | Yes |

**Relationships:**
- DatasetColumn N:1 Dataset
- DatasetColumn 1:N ColumnMapping

---

### 2.6 DatasetMapping

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| mapping_id | Unique identifier | SERIAL | Yes |
| source_dataset_id | Source dataset | INTEGER | Yes |
| target_dataset_id | Target dataset | INTEGER | Yes |
| project_id | Owning project | INTEGER | Yes |
| status | Mapping status | VARCHAR | Yes |

**Relationships:**
- DatasetMapping N:1 Project
- DatasetMapping N:1 Dataset (source)
- DatasetMapping N:1 Dataset (target)
- DatasetMapping 1:N ColumnMapping

---

### 2.7 ColumnMapping

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| column_mapping_id | Unique identifier | SERIAL | Yes |
| mapping_id | Parent mapping | INTEGER | Yes |
| source_column_id | Source column | INTEGER | Yes |
| target_column_id | Target column | INTEGER | Yes |
| transformation | Transformation logic | TEXT | No |

**Relationships:**
- ColumnMapping N:1 DatasetMapping
- ColumnMapping N:1 DatasetColumn (source)
- ColumnMapping N:1 DatasetColumn (target)

---

### 2.8 Rule

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| rule_id | Unique identifier | SERIAL | Yes |
| rule_name | Business name | VARCHAR | Yes |
| rule_type | Rule type (C01-C010) | VARCHAR | Yes |
| mapping_id | Associated mapping | INTEGER | Yes |
| parameters | Rule parameters | JSONB | Yes |
| status | Rule status | VARCHAR | Yes |

**Relationships:**
- Rule N:1 DatasetMapping
- Rule 1:N BatchRuleScore

---

### 2.9 Control

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| control_id | Unique identifier | SERIAL | Yes |
| control_name | Business name | VARCHAR | Yes |
| control_type | Control type | VARCHAR | Yes |
| parameters | Control parameters | JSONB | Yes |
| enabled | Active flag | BOOLEAN | Yes |

**Relationships:**
- Control 1:N ControlExecution

---

### 2.10 Batch

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| batch_id | Unique identifier | SERIAL | Yes |
| project_id | Owning project | INTEGER | Yes |
| status | Batch status | VARCHAR | Yes |
| started_at | Start timestamp | TIMESTAMP | Yes |
| completed_at | End timestamp | TIMESTAMP | No |
| summary | Batch summary | JSONB | No |

**Relationships:**
- Batch N:1 Project
- Batch 1:N ControlExecution
- Batch 1:N Exception
- Batch 1:N GovernanceDecision

---

### 2.11 User

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| user_id | Unique identifier | UUID | Yes |
| username | Login name | VARCHAR | Yes |
| email | Email address | VARCHAR | Yes |
| password_hash | Hashed password | VARCHAR | Yes |
| status | User status | VARCHAR | Yes |
| tenant_id | Owning tenant | UUID | Yes |

**Relationships:**
- User N:1 Tenant
- User N:N Role (via user_roles)
- User 1:N Session
- User 1:N Notification

---

### 2.12 Role

| Attribute | Description | Type | Required |
|-----------|-------------|------|----------|
| role_id | Unique identifier | UUID | Yes |
| role_name | Role name | VARCHAR | Yes |
| description | Role description | TEXT | No |

**Relationships:**
- Role N:N Permission (via role_permissions)
- Role N:N User (via user_roles)

---

## 3. Logical Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Logical Data Model                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Tenant ───────────────────────────────────────────────────────┐        │
│    │                                                           │        │
│    ├──── User ────┬──── User Roles ──── Role ──── Permissions  │        │
│    │              │                                            │        │
│    │              ├── Sessions                                │        │
│    │              └── Notifications                           │        │
│    │                                                          │        │
│    └──── Project ────┬──── System ──── Credential              │        │
│                     │                                         │        │
│                     ├── Dataset ──── DatasetColumn            │        │
│                     │       │                                  │        │
│                     │       └── ColumnMapping                  │        │
│                     │                                          │        │
│                     ├── DatasetMapping ──── ColumnMapping      │        │
│                     │                                          │        │
│                     ├── Rule ──── BatchRuleScore               │        │
│                     │                                          │        │
│                     └── Batch ────┬── ControlExecution         │        │
│                                  ├── Exception                 │        │
│                                  └── GovernanceDecision        │        │
│                                                                 │        │
│  Control ──── ControlExecution                                 │        │
│                                                                 │        │
│  Workflow ──── WorkflowInstance ──── WorkflowStepInstance       │        │
│                                                                 │        │
│  Approval ──── ApprovalStep                                    │        │
│                                                                 │        │
│  Task ──── TaskComment, TaskDependency                         │        │
│                                                                 │        │
│  Calendar ──── CalendarReminder                                │        │
│                                                                 │        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Entity Count Summary

| Category | Count |
|----------|-------|
| Core Business Entities | 12 |
| Platform Entities | 10 |
| Governance Entities | 3 |
| Audit Entities | 4 |
| Reporting Entities | 3 |
| **Total Logical Entities** | **32** |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This logical data model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*