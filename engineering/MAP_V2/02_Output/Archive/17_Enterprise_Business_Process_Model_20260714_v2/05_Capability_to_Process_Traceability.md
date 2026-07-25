# Capability to Process Traceability

**Date:** 14 July 2026  
**Audit:** Enterprise Business Process Model (Prompt 17)  
**Scope:** MAP Nexus Enterprise Platform — Capability to Process Mapping  

---

## 1. Purpose

This document provides a complete matrix mapping every business capability from Prompt 16 to its corresponding business processes.

---

## 2. Traceability Matrix

### 2.1 Migration Management Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| Project Management | Migration Project Lifecycle | Project Setup | Create Project |
| Connection Management | Connection Onboarding | Configure Connection | Store Connection |
| Dataset Discovery | Dataset Discovery | Execute Discovery | Query Source Schema |
| Dataset Mapping | Mapping Lifecycle | Create Dataset Mappings | Map Source Tables |
| Column Mapping | Column Discovery | Execute Discovery | Query Columns |

### 2.2 Validation Management Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| Rule Discovery | Rule Authoring | Generate Rules | Discover Rules |
| Control Discovery | Control Lifecycle | Configure Control | Store Control |
| Validation Execution | Validation Execution | Execute Pipeline | Run Controls |
| Checkpointing | Validation Execution | Manage Execution | Save Checkpoints |
| Retry Engine | Validation Execution | Manage Execution | Retry Failed Controls |

### 2.3 Governance & Compliance Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| Governance Decisions | Governance | Evaluate Governance | Make Decision |
| Risk Scoring | Governance | Calculate Risk | Calculate Risk Scores |
| Release Gates | Release Approval | Complete Approval | Approve/Reject |
| Approvals | Release Approval | Request Approval | Create Request |

### 2.4 Reporting & Analytics Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| Executive Reporting | Reporting | Generate Report | Executive Report |
| Operational Reporting | Reporting | Generate Report | Operational Report |
| Governance Reporting | Reporting | Generate Report | Governance Report |
| Technical Reporting | Reporting | Generate Report | Technical Report |
| Dashboard Services | Dashboard Production | Update Dashboard | Update KPIs |
| Export Services | Reporting | Distribute Report | Export Report |

### 2.5 Platform Services Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| Workflow Management | Workflow Management | Execute Workflow | Execute Steps |
| Task Management | Task Management | Execute Task | Update Status |
| Notification Services | Notifications | Send Notification | Deliver Notification |
| Calendar Services | Scheduling | Schedule Event | Create Event |
| AI / MAP Copilot | — | — | — |
| Authentication | Customer Onboarding | Authenticate User | Login |

### 2.6 Administration Domain

| Capability | Business Process | Sub-Process | Activity |
|-----------|------------------|-------------|----------|
| User Management | User Lifecycle | Create User | Enter User Details |
| Role & Permission Management | Role Administration | Create Role | Assign Permissions |
| Tenant Management | Tenant Onboarding | Configure Tenant | Store Tenant |
| System Settings | Platform Administration | Update Configuration | Store Settings |
| Feature Flags | Platform Administration | Update Configuration | Toggle Feature |
| Security Management | Security Administration | Manage Security | Manage Encryption |
| Audit Trail | Audit Lifecycle | Log Audit Event | Store Event |
| Maintenance & Health | Platform Administration | Monitor Health | Check Health |

---

## 3. Capability Coverage

| Domain | Capabilities | Covered | Coverage |
|--------|--------------|---------|----------|
| Migration Management | 5 | 5 | 100% |
| Validation Management | 5 | 5 | 100% |
| Governance & Compliance | 4 | 4 | 100% |
| Reporting & Analytics | 6 | 6 | 100% |
| Platform Services | 6 | 5 | 83% |
| Administration | 8 | 8 | 100% |
| **Total** | **34** | **33** | **97%** |

---

## 4. Orphan Capabilities

| Capability | Reason | Recommendation |
|-----------|--------|----------------|
| AI / MAP Copilot | Frontend-local only | Connect to engine APIs |

---

## 5. Traceability Statistics

| Metric | Count |
|--------|-------|
| Total Capabilities | 34 |
| Covered Capabilities | 33 |
| Orphan Capabilities | 1 |
| Total Process Mappings | 33 |

---

*This traceability matrix is part of the Enterprise Business Process Model (Prompt 17).*