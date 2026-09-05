# Enterprise Process Improvement Roadmap

**Document ID:** 17-10  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides a prioritised roadmap for improving enterprise processes based on gap analysis and maturity assessment findings.

---

## 2. Roadmap Phases

### Phase 1: Quick Wins (0-3 Months)

**Focus:** Address high-impact manual processes and missing APIs

| # | Process | Current State | Target State | Actions | Evidence | Effort |
|---|---------|---------------|--------------|---------|----------|--------|
| 1 | Rule Approval | Manual (Level 0) | Semi-Automated (Level 2) | Implement approval workflow | No approval workflow in codebase | 10-15 days |
| 2 | Governance | Semi-Automated (Level 2), No API | Automated (Level 3), Full API | Create /api/v1/governance endpoints; wire to frontend | app.governance.decision_engine exists, no API | 15-20 days |
| 3 | Reporting | Assisted (Level 1), SQL views only | Semi-Automated (Level 2), Full API | Create /api/v1/reports endpoints; wire to frontend | reporting schema (5 SQL views), no API | 15-20 days |
| 4 | Dashboard Production | Assisted (Level 1), SQL views only | Semi-Automated (Level 2), Full API | Create /api/v1/dashboards endpoints; wire to frontend | reporting schema (fact views), no API | 10-15 days |
| 5 | Audit Lifecycle | Assisted (Level 1), Middleware only | Semi-Automated (Level 2), Full API | Create /api/v1/audit endpoints; wire to frontend | audit_middleware exists, no API | 10-15 days |

**Phase 1 Total:** 5 processes, estimated effort: 60-85 person-days

---

### Phase 2: Short-Term (3-6 Months)

**Focus:** Address medium-impact gaps and missing integrations

| # | Process | Current State | Target State | Actions | Evidence | Effort |
|---|---------|---------------|--------------|---------|----------|--------|
| 1 | Tenant Management | Manual (Level 0), No API | Semi-Automated (Level 2), Full API | Create /api/v1/tenants endpoints; implement tenant service | core.tenants (table exists), no API | 15-20 days |
| 2 | Security Administration | Manual (Level 0), No API | Semi-Automated (Level 2), Full API | Create /api/v1/security endpoints; implement security service | audit.security_events (events exist), no API | 15-20 days |
| 3 | Issue Remediation | Manual (Level 0) | Semi-Automated (Level 2) | Implement remediation workflow; integrate with Task Management | No automation in codebase | 10-15 days |
| 4 | User Lifecycle | Semi-Automated (Level 2) | Automated (Level 3) | Automate lifecycle workflow; integrate with Notifications | app.services.user_service (CRUD), manual lifecycle | 10-15 days |
| 5 | Role Administration | Semi-Automated (Level 2) | Automated (Level 3) | Automate role assignment; integrate with Notifications | app.services.role_service (CRUD), manual assignment | 10-15 days |
| 6 | Exception Management | Semi-Automated (Level 2) | Automated (Level 3) | Implement exception workflow; integrate with Task Management | engine.v_migration_exception_detail (view), no workflow | 10-15 days |

**Phase 2 Total:** 6 processes, estimated effort: 70-100 person-days

---

### Phase 3: Medium-Term (6-12 Months)

**Focus:** Address platform-engine integration gaps

| # | Process | Current State | Target State | Actions | Evidence | Effort |
|---|---------|---------------|--------------|---------|----------|--------|
| 1 | Notifications | Automated (Level 3), Platform-only | Automated (Level 3), Engine-integrated | Subscribe to engine events; wire to governance | Platform-only, no engine subscription | 10-15 days |
| 2 | Task Management | Automated (Level 3), Platform-only | Automated (Level 3), Engine-integrated | Subscribe to engine events; wire to governance | Platform-only, no engine subscription | 10-15 days |
| 3 | Workflow Management | Automated (Level 3), Platform-only | Automated (Level 3), Engine-integrated | Link to engine milestones; wire to governance | Platform-only, no engine subscription | 10-15 days |
| 4 | Scheduling | Automated (Level 3), Platform-only | Automated (Level 3), Engine-integrated | Link to engine milestones; wire to governance | Platform-only, no engine subscription | 5-10 days |
| 5 | Reporting Integration | Semi-Automated (Level 2), Disconnected | Automated (Level 3), Integrated | Integrate reporting with governance decisions | SQL views exist, no integration | 10-15 days |

**Phase 3 Total:** 5 processes, estimated effort: 45-70 person-days

---

### Phase 4: Long-Term (12-18 Months)

**Focus:** Optimise maturity and automation

| # | Process | Current State | Target State | Actions | Evidence | Effort |
|---|---------|---------------|--------------|---------|----------|--------|
| 1 | Validation Execution | Automated (Level 3) | Optimised (Level 4) | Add self-healing; predictive analytics | app.execution_engine (pipeline), already automated | 15-20 days |
| 2 | Connection Onboarding | Semi-Automated (Level 2) | Automated (Level 3) | Automate credential entry; automated testing | app/api/v1/core/connections.py (CRUD), manual entry | 10-15 days |
| 3 | Dataset Discovery | Semi-Automated (Level 2) | Automated (Level 3) | Add API; add frontend; automate trigger | app.discovery.auto_rule_discovery (CLI), no API | 15-20 days |
| 4 | Mapping Lifecycle | Semi-Automated (Level 2) | Automated (Level 3) | Add API; add frontend; automate approval | app.services.mapping_resolver (runtime), no API | 10-15 days |
| 5 | Platform Administration | Semi-Automated (Level 2) | Automated (Level 3) | Automate health monitoring; automated alerts | app.health (endpoints), manual monitoring | 5-10 days |

**Phase 4 Total:** 5 processes, estimated effort: 55-80 person-days

---

## 3. Implementation Sequence

```text
Phase 1 (0-3 Months): Quick Wins
├── Implement Rule Approval Workflow
├── Create Governance API + Frontend
├── Create Reporting API + Frontend
├── Create Dashboard API + Frontend
└── Create Audit API + Frontend
    ↓
Phase 2 (3-6 Months): Short-Term
├── Create Tenant Management API + Frontend
├── Create Security Administration API + Frontend
├── Implement Issue Remediation Workflow
├── Automate User Lifecycle
├── Automate Role Administration
└── Implement Exception Workflow
    ↓
Phase 3 (6-12 Months): Medium-Term
├── Integrate Notifications with Engine
├── Integrate Tasks with Engine
├── Integrate Workflows with Engine
├── Integrate Scheduling with Engine
└── Integrate Reporting with Governance
    ↓
Phase 4 (12-18 Months): Long-Term
├── Optimise Validation Execution
├── Automate Connection Onboarding
├── Automate Dataset Discovery
├── Automate Mapping Lifecycle
└── Automate Platform Administration
```

---

## 4. Resource Requirements

| Phase | Estimated Effort | Required Skills | Dependencies |
|-------|------------------|-----------------|--------------|
| Phase 1 | 60-85 person-days | Full-Stack Development | None |
| Phase 2 | 70-100 person-days | Full-Stack Development | Phase 1 |
| Phase 3 | 45-70 person-days | Full-Stack Development | Phase 2 |
| Phase 4 | 55-80 person-days | Full-Stack Development | Phase 3 |
| **Total** | **230-335 person-days** | — | — |

---

## 5. Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Process Maturity | 3.2 average | 4.0 average | Maturity assessment |
| Automation Level | 1.9 average | 2.8 average | Automation assessment |
| Total Processes | 29 | 29 | Process catalogue |
| Gaps Identified | 29 | 0 | Gap analysis |
| Processes at Level 4+ | 8 (28%) | 20 (69%) | Maturity assessment |
| Processes Automated (Level 3) | 6 (21%) | 15 (52%) | Automation assessment |

---

## 6. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Resource constraints | High | High | Prioritise Phase 1; defer Phase 4 if needed |
| Technical complexity | Medium | High | Start with simplest processes; iterate |
| Scope creep | Medium | Medium | Stick to roadmap; defer new requirements |
| Integration challenges | Medium | Medium | Start with Phase 3 early; prototype integrations |
| User resistance | Low | Medium | Communicate benefits; provide training |

---

## 7. Roadmap Statistics

| Metric | Value |
|--------|-------|
| Total Phases | 4 |
| Total Processes | 21 |
| Total Estimated Effort | 230-335 person-days |
| Total Gaps Addressed | 29 |
| Total Maturity Improvements | 13 |
| Total Automation Improvements | 9 |

---

## 8. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This roadmap is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*