# Executive Summary — Enterprise Functional Traceability Audit

**Date:** 14 July 2026  
**Audit Type:** Architectural Discovery & Traceability  
**Scope:** MAP Nexus Enterprise Platform — Full Stack  

---

## 1. Platform Overview

MAP consists of **3 independently developed systems** that must function as one cohesive platform:

| System | Location | Purpose |
|--------|----------|---------|
| Python Migration Validation Engine | `fs-migration-validation-engine/` | Primary business engine — migration intelligence, validation, governance |
| React Frontend | `MAP_V2/` | User interface — portals, dashboards, task management |
| PostgreSQL | `migration_engine` database | Data persistence — 6 schemas, 69+ tables |

**Entry Point:** `python -m app.main run --config config.yaml`

---

## 2. Key Metrics

| Metric | Value |
|--------|-------|
| Database Schemas | 6 (core, engine, platform, reporting, audit, engine_v14) |
| Database Tables | 69 active + 10 deprecated |
| SQL Views | 5 (reporting layer) |
| API Endpoints | 72+ across 12 route groups |
| Frontend Menus | 17 top-level |
| Frontend Submenus | 103+ |
| Frontend Portals | 9 |
| Python Engine Capabilities | 14 |
| Capabilities with Full CRUD API | 2 (Connection Management, Execution) |
| Frontend Pages with Backend | ~30% |
| Frontend Pages with Mock Data | ~70% |

---

## 3. Architecture Verdict

### The Frontend is PLATFORM-FIRST, Not Migration-First

**Evidence:**

1. **111 of 134 frontend pages have no Python engine backend** — they display mock/placeholder data
2. **Task Management, Workflow, Approvals, Calendar, Notifications** are platform-only features with no equivalent in the Python engine
3. **Reports, Governance, Operations portals** exist in the frontend but have zero integration with the engine's SQL views or execution tables
4. **AI system** is entirely frontend-local (client-side AIEngine class, no backend service)
5. Only **2 of 14** engine capabilities (Connection Management, Validation Execution) have working API endpoints

---

## 4. Traceability Summary

| Status | Count | Description |
|--------|-------|-------------|
| **Aligned** | 9 | Frontend correctly traces to Python engine backend |
| **Partial** | 10 | Frontend has some backend but incomplete integration |
| **Missing** | 111 | Frontend displays mock data, no backend connection |
| **Duplicate** | 2 | Multiple pages for same capability |
| **Unknown** | 2 | Landing pages with no business logic |

---

## 5. Critical Gaps

### Frontend Gaps (98 pages need backend)
- Operations Portal: 7 pages — all mock
- Governance Portal: 9 pages — all mock
- Reports Portal: 12 pages — all mock
- Risk Portal: 4 pages — all mock
- AI Portal: 4 pages — local engine only
- Security Portal: 15 pages — all mock
- Administration Portal: 17 pages — all mock
- Report Centre/Scheduler/Distribution: 31 pages — all mock

### Backend Gaps (10 capabilities need frontend)
- Dataset Discovery — no API, no frontend
- Column Mappings — no API, no frontend
- Rule Discovery — no API, no frontend
- Control Discovery — no API, no frontend
- Governance Decisions — no API, frontend is mock
- Reporting (SQL Views) — views exist, no API, frontend is mock
- Audit Trail — file-based, no API, frontend is mock
- Scheduling — config-driven, no API
- Retry Engine — automatic, no API
- Checkpointing — automatic, no API

---

## 6. Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| **P1** | Wire Reports portal to existing SQL views | Immediate value — 12 pages get real data |
| **P1** | Create /api/v1/governance endpoints | Unlocks Governance portal (9 pages) |
| **P1** | Create /api/v1/discovery endpoints | Enables Dataset Discovery frontend |
| **P2** | Add Dataset Discovery page to Migration portal | New capability |
| **P2** | Add Column Mapping editor | New capability |
| **P2** | Consolidate duplicate portals (Reports + Report Centre) | Reduces navigation complexity |
| **P3** | Replace all mock data hooks with real API calls | Platform maturity |
| **P3** | Reduce 17 menus to 8 focused menus | Improved UX |

---

## 7. Conclusion

The MAP platform has a **robust Python engine** with 14 business capabilities and a **feature-rich React frontend** with 134 pages. However, these two systems have evolved independently. The frontend currently operates as a standalone platform rather than a presentation layer for the migration engine.

**Immediate action is required** to wire the frontend to the existing backend capabilities. The 10 deliverables in this audit provide the complete map needed to execute this realignment with confidence.

---

*This report is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
