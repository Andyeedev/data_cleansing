# Capability to Frontend Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Frontend Page Mapping  

---

## 1. Purpose

This document maps each business capability to its corresponding frontend pages, identifying current status and gaps.

---

## 2. Frontend Overview

| Metric | Value |
|--------|-------|
| Total Pages | 134 |
| Top-Level Menus | 17 |
| Submenus | 103+ |
| Pages with Backend | 19 (14%) |
| Pages with Mock Data | 111 (83%) |
| Pages with No Data | 4 (3%) |

---

## 3. Capability to Frontend Mapping

### 3.1 Migration Management Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| Project Management | Migration > Projects | /migration/projects | PARTIAL |
| Connection Management | Migration > Datasets, Security > Credentials | /migration/datasets, /security/credentials | ALIGNED |
| Dataset Discovery | — | — | NONE |
| Dataset Mapping | Migration > Mappings | /migration/mappings | PARTIAL |
| Column Mapping | — | — | NONE |

### 3.2 Validation Management Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| Rule Discovery | Validation > Rules | /validation/rules | PARTIAL |
| Control Discovery | — | — | NONE |
| Validation Execution | Migration > Execution, Validation > Results | /migration/execution, /validation/results | ALIGNED |
| Checkpointing | — | — | NONE |
| Retry Engine | — | — | NONE |

### 3.3 Governance & Compliance Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| Governance Decisions | Governance > Overview | /governance/overview | MOCK |
| Risk Scoring | Risk > Overview | /risk/overview | MOCK |
| Release Gates | Governance > Compliance | /governance/compliance | MOCK |
| Approvals | Task Management > Approvals | /tasks/approvals | ALIGNED |

### 3.4 Reporting & Analytics Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| Executive Reporting | Reports > Executive | /reports/executive | MOCK |
| Operational Reporting | Reports > Operational | /reports/operational | MOCK |
| Governance Reporting | Reports > Governance | /reports/governance | MOCK |
| Technical Reporting | Reports > Migration, Reports > Validation | /reports/migration, /reports/validation | MOCK |
| Dashboard Services | Executive Dashboard | /dashboard | ALIGNED |
| Export Services | — | — | NONE |

### 3.5 Platform Services Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| Workflow Management | Task Management > Workflows | /tasks/workflows | ALIGNED |
| Task Management | Task Management > Dashboard, My Tasks, All Tasks | /tasks/dashboard, /tasks/my, /tasks/all | ALIGNED |
| Notification Services | Task Management > Notifications | /tasks/notifications | ALIGNED |
| Calendar Services | Task Management > Calendar | /tasks/calendar | ALIGNED |
| AI / MAP Copilot | AI > Chat, AI > Insights | /ai/chat, /ai/insights | MOCK |
| Authentication | Login | /login | ALIGNED |

### 3.6 Administration Domain

| Capability | Frontend Pages | Menu Path | Status |
|-----------|---------------|-----------|--------|
| User Management | Administration > Users | /admin/users | ALIGNED |
| Role & Permission Management | Administration > Roles | /admin/roles | ALIGNED |
| Tenant Management | Administration > Tenants | /admin/tenants | MOCK |
| System Settings | Settings | /settings | ALIGNED |
| Feature Flags | Administration > Feature Flags | /admin/feature-flags | MOCK |
| Security Management | Security > Overview, Security > Encryption | /security/overview, /security/encryption | MOCK |
| Audit Trail | Security > Audit Logs | /security/audit-logs | MOCK |
| Maintenance & Health | Operations > Health | /operations/health | MOCK |

---

## 4. Frontend Status Summary

| Status | Pages | Percentage |
|--------|-------|------------|
| ALIGNED | 19 | 14% |
| PARTIAL | 10 | 7% |
| MOCK | 101 | 75% |
| NONE | 4 | 3% |

---

## 5. Portal Coverage

| Portal | Pages | Aligned | Partial | Mock | None | Coverage |
|--------|-------|---------|---------|------|------|----------|
| Executive | 1 | 1 | 0 | 0 | 0 | 100% |
| Migration | 9 | 2 | 2 | 5 | 0 | 44% |
| Validation | 3 | 2 | 1 | 0 | 0 | 100% |
| Task Management | 7 | 7 | 0 | 0 | 0 | 100% |
| Operations | 8 | 0 | 0 | 8 | 0 | 0% |
| Governance | 9 | 0 | 0 | 9 | 0 | 0% |
| Reports | 12 | 0 | 0 | 12 | 0 | 0% |
| Risk | 4 | 0 | 0 | 4 | 0 | 0% |
| AI | 4 | 0 | 0 | 4 | 0 | 0% |
| Security | 15 | 1 | 0 | 14 | 0 | 7% |
| Administration | 17 | 2 | 0 | 15 | 0 | 12% |
| Report Centre | 16 | 0 | 0 | 16 | 0 | 0% |
| Report Scheduler | 12 | 0 | 0 | 12 | 0 | 0% |
| Report Distribution | 13 | 0 | 0 | 13 | 0 | 0% |

---

## 6. Frontend Gaps

### 6.1 Capabilities Without Frontend

| # | Capability | Required Pages | Priority |
|---|------------|----------------|----------|
| 1 | Dataset Discovery | Migration > Discovery | HIGH |
| 2 | Column Mapping | Migration > Column Mappings | MEDIUM |
| 3 | Control Discovery | Governance > Controls | MEDIUM |
| 4 | Checkpointing | Operations > Monitoring | LOW |
| 5 | Retry Engine | Operations > Retry | LOW |
| 6 | Export Services | Reports > Export | LOW |

### 6.2 Pages With Mock Data

| Portal | Pages | Required Backend |
|--------|-------|------------------|
| Reports | 12 | SQL views + API |
| Governance | 9 | Governance API |
| Operations | 8 | Execution status API |
| Risk | 4 | Risk scoring API |
| AI | 4 | AI service API |
| Security | 14 | Audit events API |
| Administration | 15 | Platform settings API |
| Report Centre | 16 | Report metadata API |
| Report Scheduler | 12 | Schedule management API |
| Report Distribution | 13 | Distribution channel API |

---

## 7. Frontend Statistics

| Metric | Count |
|--------|-------|
| Total Pages | 134 |
| Aligned Pages | 19 |
| Partial Pages | 10 |
| Mock Pages | 101 |
| None Pages | 4 |
| Pages Needing Backend | 115 |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*