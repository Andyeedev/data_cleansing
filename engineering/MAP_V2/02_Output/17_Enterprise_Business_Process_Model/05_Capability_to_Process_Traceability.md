# Capability-to-Process Traceability

**Document ID:** 17-05  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides a matrix mapping all 34 business capabilities from Prompt 16 to their supporting business processes. It ensures complete traceability from capabilities to processes.

---

## 2. Traceability Matrix

### 2.1 Migration Management Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 1.1 | Project Management | Migration Project Lifecycle | Process 1 | 100% |
| 1.2 | Connection Management | Connection Onboarding, Credential Onboarding | Processes 2, 3 | 100% |
| 1.3 | Dataset Discovery | Dataset Discovery | Process 4 | 100% |
| 1.4 | Dataset Mapping | Mapping Lifecycle | Process 6 | 100% |
| 1.5 | Column Mapping | Column Discovery, Mapping Lifecycle | Processes 5, 6 | 100% |

**Domain Coverage:** 5/5 capabilities = 100%

---

### 2.2 Validation Management Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 2.1 | Rule Discovery | Rule Authoring | Process 7 | 100% |
| 2.2 | Control Discovery | Control Lifecycle | Process 10 | 100% |
| 2.3 | Validation Execution | Validation Execution, Rule Execution | Processes 11, 9 | 100% |
| 2.4 | Checkpointing | Validation Execution | Process 11 | 100% |
| 2.5 | Retry Engine | Validation Execution | Process 11 | 100% |

**Domain Coverage:** 5/5 capabilities = 100%

---

### 2.3 Governance & Compliance Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 3.1 | Governance Decisions | Governance | Process 14 | 100% |
| 3.2 | Risk Scoring | Governance | Process 14 | 100% |
| 3.3 | Release Gates | Release Approval | Process 15 | 100% |
| 3.4 | Approvals | Release Approval | Process 15 | 100% |

**Domain Coverage:** 4/4 capabilities = 100%

---

### 2.4 Reporting & Analytics Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 4.1 | Executive Reporting | Reporting | Process 16 | 100% |
| 4.2 | Operational Reporting | Reporting | Process 16 | 100% |
| 4.3 | Governance Reporting | Reporting | Process 16 | 100% |
| 4.4 | Technical Reporting | Reporting | Process 16 | 100% |
| 4.5 | Dashboard Services | Dashboard Production | Process 17 | 100% |

**Domain Coverage:** 5/5 capabilities = 100%

---

### 2.5 Platform Services Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 5.1 | Workflow Management | Workflow Management | Process 20 | 100% |
| 5.2 | Task Management | Task Management | Process 21 | 100% |
| 5.3 | Notification Services | Notifications | Process 18 | 100% |
| 5.4 | Calendar Services | Scheduling | Process 19 | 100% |
| 5.5 | Customer Onboarding | Customer Onboarding | Process 28 | 100% |
| 5.6 | Authentication | Authentication | Process 29 | 100% |

**Domain Coverage:** 6/6 capabilities = 100%

---

### 2.6 Administration Domain

| # | Capability | Capability Name | Processes | Coverage |
|---|------------|-----------------|-----------|----------|
| 6.1 | User Management | User Lifecycle | Process 22 | 100% |
| 6.2 | Role & Permission Management | Role Administration | Process 23 | 100% |
| 6.3 | Tenant Management | Tenant Management | Process 24 | 100% |
| 6.4 | System Settings | Platform Administration | Process 27 | 100% |
| 6.5 | Feature Flags | Platform Administration | Process 27 | 100% |
| 6.6 | Security Management | Security Administration | Process 25 | 100% |
| 6.7 | Audit Trail | Audit Lifecycle | Process 26 | 100% |
| 6.8 | Maintenance & Health | Platform Administration | Process 27 | 100% |

**Domain Coverage:** 8/8 capabilities = 100%

---

## 3. Coverage Summary

| Domain | Capabilities | Covered | Coverage |
|--------|--------------|---------|----------|
| Migration Management | 5 | 5 | 100% |
| Validation Management | 5 | 5 | 100% |
| Governance & Compliance | 4 | 4 | 100% |
| Reporting & Analytics | 5 | 5 | 100% |
| Platform Services | 6 | 6 | 100% |
| Administration | 8 | 8 | 100% |
| **Total** | **33** | **33** | **100%** |

---

## 4. Process-to-Capability Reverse Mapping

| # | Process | Domain | Capabilities Served |
|---|---------|--------|---------------------|
| 1 | Migration Project Lifecycle | Migration Management | 1.1 |
| 2 | Connection Onboarding | Migration Management | 1.2 |
| 3 | Credential Onboarding | Migration Management | 1.2 |
| 4 | Dataset Discovery | Migration Management | 1.3 |
| 5 | Column Discovery | Migration Management | 1.5 |
| 6 | Mapping Lifecycle | Migration Management | 1.4, 1.5 |
| 7 | Rule Authoring | Validation Management | 2.1 |
| 8 | Rule Approval | Validation Management | 2.1, 3.4 |
| 9 | Rule Execution | Validation Management | 2.3 |
| 10 | Control Lifecycle | Validation Management | 2.2 |
| 11 | Validation Execution | Validation Management | 2.3, 2.4, 2.5 |
| 12 | Exception Management | Validation Management | 2.3 |
| 13 | Issue Remediation | Validation Management | — |
| 14 | Governance | Governance & Compliance | 3.1, 3.2 |
| 15 | Release Approval | Governance & Compliance | 3.3, 3.4 |
| 16 | Reporting | Reporting & Analytics | 4.1, 4.2, 4.3, 4.4 |
| 17 | Dashboard Production | Reporting & Analytics | 4.5 |
| 18 | Notifications | Platform Services | 5.3 |
| 19 | Scheduling | Platform Services | 5.4 |
| 20 | Workflow Management | Platform Services | 5.1 |
| 21 | Task Management | Platform Services | 5.2 |
| 22 | User Lifecycle | Administration | 6.1 |
| 23 | Role Administration | Administration | 6.2 |
| 24 | Tenant Management | Administration | 6.3 |
| 25 | Security Administration | Administration | 6.6 |
| 26 | Audit Lifecycle | Administration | 6.7 |
| 27 | Platform Administration | Administration | 6.4, 6.5, 6.8 |
| 28 | Customer Onboarding | Platform Services | 5.5 |
| 29 | Authentication | Platform Services | 5.6 |

---

## 5. Orphan Analysis

### 5.1 Capabilities Without Processes

| # | Capability | Reason | Recommendation |
|---|------------|--------|----------------|
| — | None | All capabilities have processes | — |

### 5.2 Processes Without Capabilities

| # | Process | Reason | Recommendation |
|---|---------|--------|----------------|
| 13 | Issue Remediation | No direct capability mapping | Map to future remediation capability |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This traceability matrix is part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*