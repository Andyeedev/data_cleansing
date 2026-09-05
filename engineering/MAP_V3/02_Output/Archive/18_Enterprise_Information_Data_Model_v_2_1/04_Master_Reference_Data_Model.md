# Master Reference Data Model

**Document ID:** 18-04  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document separates Master Data, Reference Data, Transactional Data, Configuration Data, and Metadata for the MAP Nexus platform.

---

## 2. Master Data

### Current State

| Entity | Purpose | Ownership | Quality Rules | Lifecycle | Evidence |
|--------|---------|-----------|---------------|-----------|----------|
| Tenant | Multi-tenant isolation boundary | Administrator | Must be unique; Must have name | Create → Activate → Deactivate → Archive | core.tenants |
| User | Platform user accounts | Administrator | Must have unique username; Must have role | Create → Activate → Deactivate → Archive | platform.users |
| Organisation | Customer organisation | Administrator | Must have unique name | Create → Configure → Activate → Deactivate | Target State Capability — Not Currently Implemented |
| Project | Track migration projects | Migration Lead | Must have source/target systems | Create → Configure → Execute → Complete → Archive | core.projects |
| System | Register database connections | Migration Lead | Must have connection details; Must be tested | Register → Test → Activate → Deactivate | core.system_registry |
| Dataset | Represent discovered tables | Migration Lead | Must have schema and table name | Discover → Validate → Map → Approve | core.datasets |
| Rule | Validation rule definitions | Migration Lead | Must follow naming convention | Create → Approve → Execute → Retire | engine.rule_registry |
| Control | Validation control definitions | Migration Lead | Must be registered; Must be enabled | Register → Configure → Execute → Retire | engine.control_registry |

### Target State

| Entity | Purpose | Enhancement |
|--------|---------|-------------|
| Tenant | Multi-tenant isolation boundary | Automated provisioning |
| User | Platform user accounts | SSO integration |
| Organisation | Customer organisation | Full lifecycle management |
| Project | Track migration projects | Automated templates |
| System | Register database connections | Connection pooling |
| Dataset | Represent discovered tables | Schema change detection |
| Rule | Validation rule definitions | AI-assisted generation |
| Control | Validation control definitions | Dynamic composition |

---

## 3. Reference Data

### Current State

| Category | Values | Evidence |
|----------|--------|----------|
| Rule Types | C01-C010 (10 types) | engine.rule_registry |
| Execution States | pending, running, completed, failed | engine.migration_validation_batch |
| Batch Status | created, running, completed, failed | engine.migration_validation_batch |
| Task Status | pending, in_progress, completed, blocked | platform.tasks |
| Approval Status | pending, approved, rejected | platform.approval_requests |
| Workflow Status | active, inactive, completed | platform.workflow_definitions |
| Risk Levels | low, medium, high, critical | engine.migration_risk_scores |
| Control Results | pass, fail, warning, error | engine.migration_control_summary |
| Permission Types | 47 permissions across 6 domains | platform.permissions |
| Role Types | admin, migration_lead, engineer, governance, viewer | platform.roles |
| Notification Events | 19 event types | platform.notification_preferences |
| Audit Event Types | api_call, security, login, configuration | audit.audit_events |

### Target State

| Category | Enhancement |
|----------|-------------|
| Rule Types | Extended rule types |
| Execution States | Parallel execution states |
| Risk Levels | Predictive risk levels |
| Permission Types | Attribute-based permissions |

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

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This master reference data model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*