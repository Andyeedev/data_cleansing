# Generation Change Log — Enterprise Business Capability Model

**Date:** 14 July 2026  
**Prompt:** Generate_00_Arch_Prompt_16_Enterprise_Business_Capability_Model.md  
**Status:** Engineering Draft — Pending Review  

---

## 1. Purpose

This document tracks all changes made during the generation of the Enterprise Business Capability Model. It provides an audit trail of decisions, modifications, and rationale.

---

## 2. Generation Timeline

| Phase | Start | End | Duration | Activities |
|-------|-------|-----|----------|------------|
| Input Gathering | 14 Jul 2026 09:00 | 14 Jul 2026 09:30 | 30 min | Read architecture docs, Prompt 15 reports |
| Analysis | 14 Jul 2026 09:30 | 14 Jul 2026 10:30 | 60 min | 13-phase analysis |
| Document Generation | 14 Jul 2026 10:30 | 14 Jul 2026 12:00 | 90 min | 14 deliverables |
| Validation | 14 Jul 2026 12:00 | 14 Jul 2026 12:30 | 30 min | Criteria verification |
| **Total** | | | **3.5 hours** | |

---

## 3. Key Decisions

### 3.1 Business Capability Count

| Decision | Rationale |
|----------|-----------|
| 34 capabilities identified | Derived from analysis of Python engine, platform services, and administration functions |
| 6 domains established | Logical grouping based on business function similarity |
| Not 14 capabilities | Expanded from engine-only to include platform and administration capabilities |

### 3.2 Domain Structure

| Decision | Rationale |
|----------|-----------|
| 6 domains instead of 9 | Consolidated "Security" into "Administration", "Execution" into "Validation" |
| Platform Services as separate domain | Platform capabilities (Workflow, Tasks, Notifications) are distinct from migration engine |
| Administration as separate domain | User/role/tenant management is distinct from business operations |

### 3.3 Navigation Model

| Decision | Rationale |
|----------|-----------|
| 8 top-level menus (from 17) | Reduces cognitive load, aligns with business capabilities |
| 2-level maximum depth | Prevents deep nesting, improves discoverability |
| Role-based visibility | Different users see different menus based on responsibilities |

### 3.4 Gap Analysis

| Decision | Rationale |
|----------|-----------|
| 8 capabilities without APIs | These are engine-internal capabilities not yet exposed via REST |
| 6 capabilities without Frontend | These are backend-only capabilities not yet surfaced in UI |
| 5 platform capabilities not linked | These evolved independently from engine |

### 3.5 Capability Lifecycle

| Decision | Rationale |
|----------|-----------|
| 3 stages (Operational, Implemented, Proposed) | Simplified from 7-stage model to match current state |
| 14 Operational | These have full API + Frontend |
| 16 Implemented | These have backend but no API or Frontend |
| 4 Proposed | These have no backend implementation |

### 3.6 Capability Maturity

| Decision | Rationale |
|----------|-----------|
| 5-level scoring (Initial → Optimised) | Standard maturity model |
| No capabilities at Level 5 | No capability is optimised yet |
| 14 capabilities at Level 4 | These are managed with full CRUD |
| 12 capabilities at Level 3 | These are defined but not fully managed |
| 6 capabilities at Level 2 | These are repeatable but not standardised |
| 3 capabilities at Level 1 | These are initial/proposed |

---

## 4. Modifications During Generation

### 4.1 Capability List Adjustments

| Original | Modified | Rationale |
|----------|----------|-----------|
| "Validation" | "Validation Execution" | More specific, distinguishes from validation rules |
| "Governance" | Split into 4 capabilities | Governance Decisions, Risk Scoring, Release Gates, Approvals |
| "Reporting" | Split into 6 capabilities | Executive, Operational, Governance, Technical, Dashboard, Export |
| "Platform" | Split into 6 capabilities | Workflow, Tasks, Notifications, Calendar, AI, Authentication |
| "Administration" | Split into 8 capabilities | Users, Roles, Tenants, Settings, Feature Flags, Security, Audit, Maintenance |

### 4.2 Dependency Chain Adjustments

| Original | Modified | Rationale |
|----------|----------|-----------|
| Linear chain | 3 parallel chains | Different business processes have different dependency paths |
| Engine-only dependencies | Added platform dependencies | Platform capabilities have their own dependency chain |
| No governance dependencies | Added governance chain | Governance has distinct flow from validation |

### 4.3 Event Model Adjustments

| Original | Modified | Rationale |
|----------|----------|-----------|
| Engine events only | Added platform events | Platform generates 10 additional business events |
| Producer-only view | Added consumer view | Events have multiple consumers across domains |

### 4.4 Lifecycle Adjustments

| Original | Modified | Rationale |
|----------|----------|-----------|
| 7-stage model | 3-stage model | Simplified to match current state |
| Proposed, Planned, Under Dev, Implemented, Operational, Deprecated, Retired | Operational, Implemented, Proposed | Current state only has these 3 stages |

### 4.5 Maturity Adjustments

| Original | Modified | Rationale |
|----------|----------|-----------|
| 5-level scoring | 5-level scoring | Kept standard model |
| No reasoning | Added reasoning | Each capability has maturity reasoning |

---

## 5. Assumptions Made

| # | Assumption | Impact | Validation Required |
|---|------------|--------|---------------------|
| 1 | AI / MAP Copilot is frontend-local | Low priority for backend integration | Confirm with product owner |
| 2 | Export Services can remain CLI-only | No frontend page needed | Confirm with users |
| 3 | Tenant Management can remain mock | Multi-tenancy not yet required | Confirm with architecture |
| 4 | Security Management can remain mock | Basic security sufficient for now | Confirm with compliance |
| 5 | Checkpointing and Retry are internal | No frontend exposure needed | Confirm with engineers |

---

## 6. Exclusions

| # | Item | Reason for Exclusion |
|---|------|---------------------|
| 1 | Implementation details | Out of scope for business architecture |
| 2 | Technology selection | Out of scope for business architecture |
| 3 | API design details | Covered in API Architecture document |
| 4 | Database schema details | Covered in Database Architecture document |
| 5 | Frontend component details | Covered in Frontend Architecture document |

---

## 7. Risks Identified

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | 83% of frontend uses mock data | Users see fake data | Prioritize API creation for reporting capabilities |
| 2 | Platform capabilities not linked to engine | Siloed operation | Implement event subscription model |
| 3 | Navigation has 17 top-level menus | Poor usability | Consolidate to 8 menus |
| 4 | 8 capabilities have no API | Cannot wire frontend | Create REST endpoints |
| 5 | 6 capabilities have no frontend | Users cannot access | Create frontend pages |

---

## 8. Next Steps

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| 1 | Present deliverables for review | Engineering | IMMEDIATE |
| 2 | Await user approval | User | IMMEDIATE |
| 3 | Promote master doc to 00_Architecture/ | Engineering | POST-APPROVAL |
| 4 | Begin Phase 1 API creation | Backend Team | HIGH |
| 5 | Begin Phase 2 frontend pages | Frontend Team | HIGH |

---

## 9. File Change Log

| # | File | Action | Status |
|---|------|--------|--------|
| 1 | 16_Enterprise_Business_Capability_Model.md | CREATED | PENDING REVIEW |
| 2 | 01_Executive_Summary.md | CREATED | PENDING REVIEW |
| 3 | 02_Business_Capability_Catalogue.md | CREATED | PENDING REVIEW |
| 4 | 03_Business_Capability_Hierarchy.md | CREATED | PENDING REVIEW |
| 5 | 04_Business_Capability_Dependencies.md | CREATED | PENDING REVIEW |
| 6 | 05_Business_Event_Model.md | CREATED | PENDING REVIEW |
| 7 | 06_Capability_to_API_Mapping.md | CREATED | PENDING REVIEW |
| 8 | 07_Capability_to_Database_Mapping.md | CREATED | PENDING REVIEW |
| 9 | 08_Capability_to_Python_Mapping.md | CREATED | PENDING REVIEW |
| 10 | 09_Capability_to_Frontend_Mapping.md | CREATED | PENDING REVIEW |
| 11 | 10_Recommended_Enterprise_Navigation.md | CREATED | PENDING REVIEW |
| 12 | 11_Business_Capability_Gap_Report.md | CREATED | PENDING REVIEW |
| 13 | 12_Generation_Report.md | CREATED | PENDING REVIEW |
| 14 | 13_Generation_Change_Log.md | CREATED | PENDING REVIEW |

---

*This change log is part of the Enterprise Business Capability Model (Prompt 16).*