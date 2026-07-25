# MAP CLI MVP Phase 07.7–07.10 Backend Dependencies Summary

## Overview
This document summarizes all missing backend APIs required by Phases 07.7–07.10. Frontend implementation cannot begin until these APIs are available.

---

## 07.7 — Migration Execution UI (Missing APIs)

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/api/v1/execution/start` | POST | Start migration execution | High |
| `/api/v1/execution/{batch_id}/cancel` | POST | Cancel running execution | High |
| `/api/v1/execution/{batch_id}/pause` | POST | Pause execution | Medium |
| `/api/v1/execution/{batch_id}/resume` | POST | Resume execution | Medium |
| `/api/v1/execution/{batch_id}/retry` | POST | Retry failed execution | Medium |

---

## 07.8 — Monitoring & Operations (Missing APIs)

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/api/v1/monitoring/health` | GET | Detailed system health | High |
| `/api/v1/monitoring/metrics` | GET | Performance metrics | High |
| `/api/v1/monitoring/queue` | GET | Job queue status | Medium |
| `/api/v1/monitoring/alerts` | GET | Active alerts | Medium |
| `/api/v1/monitoring/logs` | GET | Operational logs | Low |

---

## 07.9 — Audit & Governance (Missing APIs)

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/api/v1/governance/approvals` | GET | Approval history | High |
| `/api/v1/governance/approvals/{id}` | GET | Approval detail | High |
| `/api/v1/governance/exceptions` | GET | Exception list | High |
| `/api/v1/governance/exceptions/{id}` | GET | Exception detail | Medium |
| `/api/v1/governance/audit/search` | GET | Search audit trail | Medium |

---

## 07.10 — Enterprise Dashboard (Missing APIs)

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/api/v1/dashboard/portfolio` | GET | Aggregated portfolio summary | High |
| `/api/v1/dashboard/kpis` | GET | KPI calculations | High |
| `/api/v1/dashboard/summary` | GET | Aggregated dashboard summary | Medium |

---

## Existing APIs Available for Consumption

| Phase | API | Source |
|-------|-----|--------|
| 07.5.1 | `/api/v1/execution/{id}/report` | validation_report_routes.py |
| 07.5.1 | `/api/v1/execution/{id}/governance` | validation_report_routes.py |
| 07.5.1 | `/api/v1/execution/{id}/compliance` | validation_report_routes.py |
| 07.5.1 | `/api/v1/execution/{id}/risk-score` | validation_report_routes.py |
| 07.5.1 | `/api/v1/rules` | rule_execution_routes.py |
| 07.5.1 | `/api/v1/execution/{id}/results` | rule_execution_routes.py |
| 07.6.1 | `/api/v1/execution/history` | execution_history_routes.py |
| 07.6.1 | `/api/v1/execution/{id}/audit` | execution_history_routes.py |
| 07.6.1 | `/api/v1/export/csv` | export_routes.py |
| 07.6.1 | `/api/v1/export/pdf` | export_routes.py |
| 07 | `/api/v1/execution/run` | execution_routes.py |
| 07 | `/api/v1/execution/status/{batch_id}` | execution_routes.py |
| 07.3 | `/api/v1/connections` | connections_routes.py |
| 07.3 | `/api/v1/connections/{id}/test` | connections_routes.py |
| 07.3 | `/api/v1/connections/{id}/schemas` | connections_routes.py |
| 07.3 | `/api/v1/connections/{id}/tables` | connections_routes.py |
| 07.3 | `/api/v1/systems` | systems_routes.py |
| 07.3 | `/api/v1/projects` | projects_routes.py |
| 07.3 | `/api/v1/applications` | applications_routes.py |

---

## Total Missing APIs

| Phase | Count | Priority |
|-------|-------|----------|
| 07.7 | 5 | 2 High, 3 Medium |
| 07.8 | 5 | 2 High, 2 Medium, 1 Low |
| 07.9 | 5 | 3 High, 2 Medium |
| 07.10 | 3 | 2 High, 1 Medium |
| **Total** | **18** | **9 High, 7 Medium, 1 Low** |

---

## Recommended Implementation Order

| Order | Phase | Reason |
|-------|-------|--------|
| 1 | 07.7.1 | Migration execution UI needs start/cancel/pause/resume |
| 2 | 07.8.1 | Monitoring needs health and metrics APIs |
| 3 | 07.9.1 | Audit needs approval and exception APIs |
| 4 | 07.10.1 | Dashboard needs aggregation APIs (depends on 07.7-07.9 data) |

---

## Summary

| Metric | Value |
|--------|-------|
| Total Phases with Missing APIs | 4 (07.7–07.10) |
| Total Missing APIs | 18 |
| High Priority APIs | 9 |
| Medium Priority APIs | 7 |
| Low Priority APIs | 1 |
| Estimated Backend Effort | ~4-5 backend phases (07.7.1–07.10.1) |

---

## Gate
➡ **Awaiting architectural review and approval before implementation.**

**Summary:** All 4 frontend prompts (07.7–07.10) have been rewritten with full specifications. Each prompt documents missing backend APIs. 18 new APIs are required across 4 new backend phases (07.7.1–07.10.1). Frontend implementation is blocked until these APIs are available.
