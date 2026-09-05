# Process Maturity Assessment

**Date:** 14 July 2026  
**Audit:** Enterprise Business Process Model (Prompt 17)  
**Scope:** MAP Nexus Enterprise Platform — CMMI Maturity Assessment  

---

## 1. Purpose

This document assesses every business process using CMMI-style maturity levels.

---

## 2. Maturity Levels

| Level | Level Name | Definition |
|-------|------------|------------|
| 1 | Initial | Ad-hoc, no process |
| 2 | Repeatable | Some processes exist, not standardised |
| 3 | Defined | Standard processes documented |
| 4 | Managed | Measured and controlled |
| 5 | Optimised | Continuous improvement |

---

## 3. Maturity Assessment

### 3.1 Migration Management Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Migration Project Lifecycle | 3 Defined | Config-driven, semi-automated | 4 Managed | Add metrics, automate more steps |
| Connection Onboarding | 4 Managed | Full CRUD, encrypted, tested | 4 Managed | Maintain |
| Credential Onboarding | 4 Managed | Full CRUD, encrypted | 4 Managed | Maintain |
| Dataset Discovery | 3 Defined | Working but CLI-only | 4 Managed | Add API, add frontend |
| Column Discovery | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |
| Mapping Lifecycle | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |

### 3.2 Validation Management Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Rule Authoring | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |
| Rule Approval | 2 Repeatable | Manual process | 4 Managed | Add workflow integration |
| Rule Execution | 4 Managed | Automated execution | 5 Optimised | Add self-healing |
| Control Lifecycle | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |
| Validation Execution | 4 Managed | 6-step pipeline, parallel, checkpointing | 5 Optimised | Add self-healing, predictive analytics |
| Exception Management | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |

### 3.3 Governance & Compliance Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Governance | 3 Defined | Working but auto post-execution | 4 Managed | Add API, add frontend |
| Release Approval | 4 Managed | Full CRUD, multi-step, RBAC | 4 Managed | Maintain |

### 3.4 Reporting & Analytics Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Reporting | 3 Defined | SQL views exist, no API | 4 Managed | Add API, add frontend |
| Dashboard Production | 3 Defined | SQL views exist, no API | 4 Managed | Add API, add frontend |

### 3.5 Platform Service Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Notifications | 4 Managed | Full CRUD, preferences | 4 Managed | Maintain |
| Scheduling | 4 Managed | Full CRUD, reminders | 4 Managed | Maintain |
| Workflow Management | 4 Managed | Full CRUD, step execution | 4 Managed | Maintain |
| Task Management | 4 Managed | Full CRUD, comments, dependencies | 4 Managed | Maintain |
| Customer Onboarding | 3 Defined | Working but semi-automated | 4 Managed | Automate more steps |

### 3.6 Administration Processes

| Process | Current Level | Evidence | Recommended Level | Improvement Actions |
|---------|---------------|----------|-------------------|---------------------|
| Tenant Onboarding | 2 Repeatable | Manual process | 4 Managed | Add API, add frontend |
| User Lifecycle | 3 Defined | Working but semi-automated | 4 Managed | Automate more steps |
| Role Administration | 3 Defined | Working but semi-automated | 4 Managed | Automate more steps |
| Security Administration | 2 Repeatable | Manual process | 4 Managed | Add API, add frontend |
| Audit Lifecycle | 2 Repeatable | Middleware logging only | 4 Managed | Add API, add frontend |
| Platform Administration | 3 Defined | Working but semi-automated | 4 Managed | Automate more steps |
| Issue Remediation | 2 Repeatable | Manual process | 4 Managed | Add workflow integration |
| Metadata Discovery | 3 Defined | Working but semi-automated | 4 Managed | Add API, add frontend |

---

## 4. Maturity Summary

| Level | Count | Processes |
|-------|-------|-----------|
| 5 Optimised | 0 | — |
| 4 Managed | 8 | Connection Onboarding, Credential Onboarding, Rule Execution, Validation Execution, Release Approval, Notifications, Scheduling, Workflow Management, Task Management |
| 3 Defined | 12 | Migration Project Lifecycle, Dataset Discovery, Column Discovery, Mapping Lifecycle, Rule Authoring, Control Lifecycle, Exception Management, Governance, Reporting, Dashboard Production, Customer Onboarding, User Lifecycle, Role Administration, Platform Administration, Metadata Discovery |
| 2 Repeatable | 9 | Rule Approval, Tenant Onboarding, Security Administration, Audit Lifecycle, Issue Remediation |
| 1 Initial | 0 | — |

---

## 5. Maturity Statistics

| Metric | Value |
|--------|-------|
| Average Current Maturity | 3.2 |
| Average Recommended Maturity | 4.1 |
| Maturity Gap | 0.9 |
| Processes at Level 4+ | 8 (28%) |
| Processes below Level 3 | 5 (17%) |

---

*This maturity assessment is part of the Enterprise Business Process Model (Prompt 17).*