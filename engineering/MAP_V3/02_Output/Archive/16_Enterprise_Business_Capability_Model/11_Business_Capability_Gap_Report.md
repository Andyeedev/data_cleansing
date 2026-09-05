# Business Capability Gap Report

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Capability Gap Analysis  

---

## 1. Purpose

This document provides a detailed gap analysis between the target business capability model and the current implementation state. It identifies what needs to be built to achieve full enterprise capability coverage.

---

## 2. Gap Analysis Summary

### 2.1 Overall Implementation Status

| Status | Capabilities | Percentage |
|--------|--------------|------------|
| Fully Implemented (API + Frontend) | 2 | 6% |
| Partially Implemented | 8 | 24% |
| Backend Only (No API) | 12 | 35% |
| Frontend Only (Mock Data) | 8 | 24% |
| Not Implemented | 4 | 12% |

### 2.2 Domain Implementation Status

| Domain | Fully | Partial | Backend | Frontend | None | Score |
|--------|-------|---------|---------|----------|------|-------|
| Migration Management | 1 | 2 | 1 | 0 | 1 | 40% |
| Validation Management | 1 | 1 | 2 | 0 | 1 | 30% |
| Governance & Compliance | 1 | 0 | 2 | 1 | 0 | 40% |
| Reporting & Analytics | 0 | 0 | 4 | 2 | 0 | 17% |
| Platform Services | 4 | 0 | 0 | 2 | 0 | 67% |
| Administration | 4 | 0 | 1 | 3 | 0 | 50% |

---

## 3. Detailed Gap Analysis by Domain

### 3.1 Migration Management Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| Project Management | IMPLEMENTED | PARTIAL | IMPLEMENTED | Need full CRUD API | HIGH |
| Connection Management | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Dataset Discovery | IMPLEMENTED | NONE | NONE | Need API + Frontend | HIGH |
| Dataset Mapping | IMPLEMENTED | AUTO | IMPLEMENTED | Need manual API | MEDIUM |
| Column Mapping | IMPLEMENTED | NONE | NONE | Need API + Frontend | MEDIUM |

### 3.2 Validation Management Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| Rule Discovery | IMPLEMENTED | AUTO | MOCK | Need API + Real Frontend | HIGH |
| Control Discovery | IMPLEMENTED | NONE | NONE | Need API + Frontend | MEDIUM |
| Validation Execution | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Checkpointing | IMPLEMENTED | NONE | NONE | Need API + Frontend | LOW |
| Retry Engine | IMPLEMENTED | NONE | NONE | Need API + Frontend | LOW |

### 3.3 Governance & Compliance Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| Governance Decisions | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Risk Scoring | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Release Gates | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Approvals | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |

### 3.4 Reporting & Analytics Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| Executive Reporting | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Operational Reporting | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Governance Reporting | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Technical Reporting | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | HIGH |
| Dashboard Services | IMPLEMENTED | NONE | REAL | Need API | HIGH |
| Export Services | IMPLEMENTED | NONE | NONE | Need API + Frontend | MEDIUM |

### 3.5 Platform Services Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| Workflow Management | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Task Management | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Notification Services | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Calendar Services | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| AI / MAP Copilot | MOCK | NONE | MOCK | Need Backend + API + Frontend | LOW |
| Authentication | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |

### 3.6 Administration Domain

| Capability | Backend | API | Frontend | Gap | Priority |
|------------|---------|-----|----------|-----|----------|
| User Management | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Role & Permission Management | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Tenant Management | NONE | NONE | MOCK | Need Backend + API + Frontend | MEDIUM |
| System Settings | IMPLEMENTED | IMPLEMENTED | IMPLEMENTED | NONE | COMPLETE |
| Feature Flags | IMPLEMENTED | IMPLEMENTED | MOCK | Need Real Frontend | LOW |
| Security Management | NONE | NONE | MOCK | Need Backend + API + Frontend | MEDIUM |
| Audit Trail | IMPLEMENTED | NONE | MOCK | Need API + Real Frontend | MEDIUM |
| Maintenance & Health | IMPLEMENTED | IMPLEMENTED | MOCK | Need Real Frontend | LOW |

---

## 4. Critical Gap Analysis

### 4.1 Capabilities Without API Endpoints

| # | Capability | Current State | Required Endpoints | Effort |
|---|------------|---------------|-------------------|--------|
| 1 | Dataset Discovery | CLI only | /api/v1/discovery/run, /api/v1/discovery/results/{project_id} | HIGH |
| 2 | Column Mapping | Auto-created | /api/v1/column-mappings/{mapping_id} GET/PUT | MEDIUM |
| 3 | Control Discovery | Auto during execution | /api/v1/controls/, /api/v1/controls/{id}, /api/v1/controls/{id}/toggle | MEDIUM |
| 4 | Governance Decisions | Auto post-execution | /api/v1/governance/decisions/{batch_id}, /api/v1/governance/config GET/PUT | HIGH |
| 5 | Risk Scoring | Auto post-execution | /api/v1/governance/risk/{batch_id} | HIGH |
| 6 | Release Gates | Auto post-execution | /api/v1/governance/release/{batch_id}/approve, /api/v1/governance/release/{batch_id}/reject | HIGH |
| 7 | Reporting (SQL Views) | BI tools only | /api/v1/reports/executive/{batch_id}, /api/v1/reports/controls/{batch_id}, /api/v1/reports/governance/{batch_id}, /api/v1/reports/exceptions/{batch_id} | HIGH |
| 8 | Audit Trail | File-based | /api/v1/audit/events, /api/v1/audit/events/{id} | MEDIUM |

### 4.2 Capabilities Without Frontend Pages

| # | Capability | Current State | Required Pages | Effort |
|---|------------|---------------|----------------|--------|
| 1 | Dataset Discovery | None | Migration > Discovery | HIGH |
| 2 | Column Mapping | None | Migration > Column Mappings | MEDIUM |
| 3 | Control Discovery | None | Governance > Controls | MEDIUM |
| 4 | Checkpointing | None | Operations > Monitoring | LOW |
| 5 | Retry Engine | None | Operations > Retry | LOW |

### 4.3 Platform Capabilities Not Linked to Engine

| # | Capability | Current State | Required Integration | Effort |
|---|------------|---------------|---------------------|--------|
| 1 | Task Management | Platform-only | Subscribe to engine events (batch started/completed/failed) | MEDIUM |
| 2 | Workflow Management | Platform-only | Link to engine milestones (validation complete, governance blocked) | MEDIUM |
| 3 | Notifications | Platform-only | Subscribe to engine events (14 business events) | LOW |
| 4 | Calendar | Platform-only | Link to engine milestones (batch schedules, deadlines) | LOW |
| 5 | AI / MAP Copilot | Frontend-local | Connect to engine APIs for data access | HIGH |

---

## 5. Implementation Roadmap

### 5.1 Phase 1: API Foundation (Weeks 1-2)

| # | Capability | API Endpoints | Priority |
|---|------------|---------------|----------|
| 1 | Dataset Discovery | /api/v1/discovery/* | P1 |
| 2 | Governance Decisions | /api/v1/governance/* | P1 |
| 3 | Risk Scoring | /api/v1/governance/risk/* | P1 |
| 4 | Release Gates | /api/v1/governance/release/* | P1 |
| 5 | Reporting | /api/v1/reports/* | P1 |

### 5.2 Phase 2: Frontend Pages (Weeks 3-4)

| # | Capability | Pages | Priority |
|---|------------|-------|----------|
| 1 | Dataset Discovery | Migration > Discovery | P1 |
| 2 | Column Mapping | Migration > Column Mappings | P2 |
| 3 | Control Discovery | Governance > Controls | P2 |
| 4 | Reporting | Reports > Executive, Operational, Governance, Technical | P1 |

### 5.3 Phase 3: Platform Integration (Weeks 5-6)

| # | Capability | Integration | Priority |
|---|------------|-------------|----------|
| 1 | Task Management | Subscribe to engine events | P2 |
| 2 | Workflow Management | Link to engine milestones | P2 |
| 3 | Notifications | Subscribe to engine events | P2 |
| 4 | Calendar | Link to engine milestones | P3 |

### 5.4 Phase 4: Polish & Optimization (Weeks 7-8)

| # | Capability | Work | Priority |
|---|------------|------|----------|
| 1 | Checkpointing | API + Frontend | P3 |
| 2 | Retry Engine | API + Frontend | P3 |
| 3 | Export Services | API + Frontend | P3 |
| 4 | AI / MAP Copilot | Backend + API + Frontend | P3 |

---

## 6. Effort Estimation

| Phase | Capabilities | API Endpoints | Frontend Pages | Effort (Weeks) |
|-------|--------------|---------------|----------------|----------------|
| Phase 1 | 5 | 20 | 0 | 2 |
| Phase 2 | 4 | 0 | 10 | 2 |
| Phase 3 | 4 | 0 | 0 | 2 |
| Phase 4 | 4 | 10 | 5 | 2 |
| **Total** | **17** | **30** | **15** | **8** |

---

## 7. Success Criteria

| Criterion | Target |
|-----------|--------|
| Capabilities with APIs | 34/34 (100%) |
| Capabilities with Frontend | 34/34 (100%) |
| Platform-Engine Linked | 5/5 (100%) |
| Mock Data Pages | 0 (0%) |
| Navigation Depth | ≤2 levels |

---

*This gap report is part of the Enterprise Business Capability Model (Prompt 16).*