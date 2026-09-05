# Logical Data Model

**Document ID:** 18-05  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the enterprise logical data model for MAP Nexus. It shows entity relationships, cardinality, and business meaning without physical implementation details.

---

## 2. Entity Relationships

### Current State

```
Tenant
  contains
Projects
  contain
Systems
  contain
Credentials
  contain
Connections

Projects
  contain
Datasets
  contain
Columns

Projects
  contain
Dataset Mappings
  contain
Column Mappings

Dataset Mappings
  contain
Rules
  produce
Execution Results

Projects
  contain
Batches
  contain
Control Results
  produce
Governance Decisions
  produce
Release Decisions

Governance Decisions
  include
Risk Assessments

Users
  have
Roles
  have
Permissions

Users
  have
Sessions

Users
  have
Notifications

Workflows
  contain
Workflow Instances
  contain
Step Instances

Tasks
  have
Comments
  have
Dependencies

Calendar Events
  have
Reminders

Audit Middleware
  produces
Audit Events
  produce
Security Events
  produce
Login History
```

### Target State

```
Tenant
  contains
Organisation (Target State Capability — Not Currently Implemented)
  contain
Projects

Projects
  contain
Systems
  with
Connection Pooling (Target State Capability — Not Currently Implemented)

Datasets
  with
Schema Change Detection (Target State Capability — Not Currently Implemented)

Rules
  with
AI-Assisted Generation (Target State Capability — Not Currently Implemented)

Batches
  with
Parallel Execution (Target State Capability — Not Currently Implemented)

Governance Decisions
  with
Automated Workflows (Target State Capability — Not Currently Implemented)

Reporting
  with
API Endpoints (Target State Capability — Not Currently Implemented)

Dashboards
  with
Real-Time Updates (Target State Capability — Not Currently Implemented)
```

---

## 3. Cardinality

| Relationship | Cardinality | Business Meaning |
|--------------|-------------|------------------|
| Tenant → Project | 1:N | One tenant has many projects |
| Project → Dataset | 1:N | One project has many datasets |
| Dataset → Column | 1:N | One dataset has many columns |
| Project → Mapping | 1:N | One project has many mappings |
| Mapping → Column Mapping | 1:N | One mapping has many column mappings |
| Mapping → Rule | 1:N | One mapping has many rules |
| Project → Batch | 1:N | One project has many batches |
| Batch → Control Result | 1:N | One batch has many control results |
| Batch → Exception | 1:N | One batch has many exceptions |
| Batch → Governance Decision | 1:1 | One batch has one governance decision |
| Governance Decision → Risk Assessment | 1:1 | One decision has one risk assessment |
| Governance Decision → Release Decision | 1:1 | One decision has one release decision |
| Tenant → User | 1:N | One tenant has many users |
| User → Role | N:N | Users have many roles (via user_roles) |
| Role → Permission | N:N | Roles have many permissions (via role_permissions) |
| User → Session | 1:N | One user has many sessions |
| User → Notification | 1:N | One user has many notifications |
| Workflow → Instance | 1:N | One workflow has many instances |
| Task → Comment | 1:N | One task has many comments |
| Task → Dependency | 1:N | One task has many dependencies |

---

## 4. Entity Count Summary

| Category | Count |
|----------|-------|
| Migration Entities | 9 |
| Validation Entities | 6 |
| Governance Entities | 4 |
| Platform Entities | 6 |
| Administration Entities | 3 |
| Audit Entities | 3 |
| **Total Logical Entities** | **31** |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This logical data model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*