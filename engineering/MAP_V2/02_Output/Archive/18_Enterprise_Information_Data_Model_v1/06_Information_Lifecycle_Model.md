# Information Lifecycle Model

**Document ID:** 18-06  
**Version:** 1.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the information lifecycle for all major business objects in the MAP Nexus platform. Each lifecycle stage is documented with creation, modification, approval, usage, archiving, deletion, retention, and evidence.

---

## 2. Lifecycle Stages

| Stage | Description |
|-------|-------------|
| Create | Initial creation of the object |
| Update | Modification of the object |
| Validate | Validation of the object |
| Approve | Approval of the object |
| Execute | Usage of the object |
| Archive | Archival of the object |
| Delete | Deletion of the object |
| Retention | Retention period |

---

## 3. Information Lifecycle Definitions

### 3.1 Project Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Project created via API | Migration Lead | core.projects INSERT |
| Update | Project configuration updated | Migration Lead | core.projects UPDATE |
| Validate | Project configuration validated | System | app.execution_engine validation |
| Approve | Project approved for execution | Programme Manager | Manual approval |
| Execute | Project executed (batches run) | Migration Engineer | engine.migration_validation_batch |
| Archive | Project archived | Administrator | Not implemented |
| Delete | Project deleted | Administrator | Not implemented |
| Retention | 7 years | — | Policy |

**Lifecycle Diagram:**
```
Create ──► Update ──► Validate ──► Approve ──► Execute ──► Archive ──► Delete
                                                              │
                                                              └── Retain 7 years
```

---

### 3.2 Dataset Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Dataset discovered | Discovery Engine | core.datasets INSERT |
| Update | Dataset metadata updated | Migration Engineer | core.datasets UPDATE |
| Validate | Dataset validated | System | Validation checks |
| Approve | Dataset mapping approved | Migration Lead | Manual approval |
| Execute | Dataset used in validation | System | engine.migration_validation_batch |
| Archive | Dataset archived | Administrator | Not implemented |
| Delete | Dataset deleted | Administrator | Not implemented |
| Retention | 7 years | — | Policy |

---

### 3.3 Rule Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Rule created (auto or manual) | Migration Engineer | engine.rule_registry INSERT |
| Update | Rule parameters updated | Migration Engineer | engine.rule_registry UPDATE |
| Validate | Rule syntax validated | System | app.discovery.auto_rule_discovery |
| Approve | Rule approved for execution | Migration Lead | Manual approval |
| Execute | Rule executed in batch | System | engine.migration_control_execution |
| Archive | Rule retired | Migration Lead | engine.rule_registry UPDATE |
| Delete | Rule deleted | Administrator | Not implemented |
| Retention | 7 years | — | Policy |

---

### 3.4 Batch Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Batch created | Validation Engine | engine.migration_validation_batch INSERT |
| Update | Batch status updated | Validation Engine | engine.migration_validation_batch UPDATE |
| Validate | Batch results validated | System | engine.migration_control_summary |
| Approve | Batch governance decision | Governance Officer | engine.migration_governance_status |
| Execute | Batch controls executed | System | engine.migration_control_execution |
| Archive | Batch archived | Administrator | Not implemented |
| Delete | Batch deleted | Administrator | Not implemented |
| Retention | 7 years | — | Policy |

**Lifecycle Diagram:**
```
Create ──► Execute ──► Validate ──► Approve ──► Archive ──► Delete
    │         │           │            │
    │         │           │            └── Governance Decision
    │         │           └── Control Summary
    │         └── Control Execution
    └── Status: running, completed, failed
```

---

### 3.5 User Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | User account created | Administrator | platform.users INSERT |
| Update | User details updated | Administrator | platform.users UPDATE |
| Validate | User credentials validated | System | app.services.auth_service |
| Approve | User access approved | Security Officer | Manual approval |
| Execute | User logs in | User | platform.user_sessions INSERT |
| Archive | User deactivated | Administrator | platform.users UPDATE |
| Delete | User deleted | Administrator | Not implemented |
| Retention | Active + 3 years | — | Policy |

**Lifecycle Diagram:**
```
Create ──► Activate ──► Login ──► Session ──► Deactivate ──► Archive
    │                      │                      │
    │                      │                      └── Revoke Access
    │                      └── Validate Credentials
    └── Assign Roles
```

---

### 3.6 Task Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Task created | System/User | platform.tasks INSERT |
| Update | Task status updated | Assignee | platform.tasks UPDATE |
| Validate | Task dependencies validated | System | platform.task_dependencies |
| Approve | Task approved | Programme Manager | Manual approval |
| Execute | Task executed | Assignee | platform.tasks UPDATE |
| Archive | Task completed | System | platform.tasks UPDATE |
| Delete | Task deleted | Administrator | Not implemented |
| Retention | 3 years | — | Policy |

---

### 3.7 Workflow Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Workflow definition created | Administrator | platform.workflow_definitions INSERT |
| Update | Workflow definition updated | Administrator | platform.workflow_definitions UPDATE |
| Validate | Workflow logic validated | System | Validation checks |
| Approve | Workflow approved | Administrator | Manual approval |
| Execute | Workflow instance executed | System | platform.workflow_instances INSERT |
| Archive | Workflow retired | Administrator | platform.workflow_definitions UPDATE |
| Delete | Workflow deleted | Administrator | Not implemented |
| Retention | 3 years | — | Policy |

---

### 3.8 Audit Event Lifecycle

| Stage | Event | Actor | Evidence |
|-------|-------|-------|----------|
| Create | Audit event logged | System | audit.audit_events INSERT |
| Update | Not applicable (immutable) | — | — |
| Validate | Audit event validated | System | Validation checks |
| Approve | Not applicable | — | — |
| Execute | Audit event queried | Auditor | SQL queries |
| Archive | Audit event archived | System | Not implemented |
| Delete | Audit event purged | System | Not implemented |
| Retention | 3 years | — | Policy |

---

## 4. Lifecycle Summary

| Object | Create | Modify | Approve | Execute | Archive | Delete | Retention |
|--------|--------|--------|---------|---------|---------|--------|-----------|
| Project | API | API | Manual | Engine | Not implemented | Not implemented | 7 years |
| Dataset | Discovery | API | Manual | Engine | Not implemented | Not implemented | 7 years |
| Rule | Auto/Manual | API | Manual | Engine | Not implemented | Not implemented | 7 years |
| Batch | Engine | Engine | Governance | Engine | Not implemented | Not implemented | 7 years |
| User | Admin | Admin | Manual | Auth | Admin | Not implemented | Active+3yr |
| Task | System | API | Manual | User | System | Not implemented | 3 years |
| Workflow | Admin | Admin | Manual | System | Admin | Not implemented | 3 years |
| Audit | Middleware | — | — | Queries | Not implemented | Not implemented | 3 years |

---

## 5. Lifecycle Gaps

| # | Gap | Object | Impact | Recommendation |
|---|-----|--------|--------|----------------|
| 1 | No archival process | All | High | Implement archival workflow |
| 2 | No deletion process | All | Medium | Implement soft delete |
| 3 | No retention automation | All | Medium | Implement retention policies |
| 4 | Manual approval for rules | Rule | Medium | Implement automated approval |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This information lifecycle model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*
