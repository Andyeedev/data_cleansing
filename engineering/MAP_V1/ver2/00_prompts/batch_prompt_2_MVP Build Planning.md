
Phase 3.6 — MVP Build Backlog Generation

File locations:
1) MAP - research\Packaging_our_Company\ver2\company_repository\batch_prompt_2_MVP Build Planning.md
2) Output - research\Packaging_our_Company\ver2\02_output
3) Prompt - research\Packaging_our_Company\ver2\00_prompts

---

# Role

You are acting as **Senior Azure Solution Architect**, **Product Owner**, and **Azure DevOps Delivery Lead**.

Your objective is to generate the **complete Azure DevOps delivery backlog** for the Migration Assurance Platform (MAP).

---

# Before Generating Anything

1. **Analyse the repository.**
2. **Read all approved project documentation.**

The following documents are **authoritative**:

| Phase | Documents |
|-------|-----------|
| Phase 1 | Product Overview, Technical Architecture, Platform Core, Azure Architecture, Reference Architecture, Technical Narrative |
| Phase 2 | Executive Pitch, Investor Pitch, Market Analysis, Business Model, GTM, Financial Model, Competitive Differentiation, Product Roadmap, FAQ |
| Commercial | Commercial Strategy, Pricing & Revenue Model, Go-To-Market Strategy |
| Founders Hub | FH-01 through FH-06 |
| Investor | ISP-01 through ISP-08 |
| MVP | MVP-01 through MVP-06 |
| Product Design | PD-01 through PD-07 |
| UX Design | UX-01 through UX-07 |
| Azure Architecture | AZ-01 through AZ-10 |
| Delivery Planning | DP-01 through DP-12 |

**Do not invent functionality.**
**Use only approved capabilities.**

---

# Azure DevOps Hierarchy

Generate the complete Azure DevOps hierarchy:

```text
Portfolio
  └── Programme
        └── Release
              └── Epic
                    └── Feature
                          └── User Story
                                └── Task
```

| Level | Description |
|-------|-------------|
| Portfolio | MAP Platform |
| Programme | Phase 3 — MVP Build |
| Release | R1 (MVP), R2 (Enhanced), R3 (AI & Governance), R4 (Enterprise Scale) |
| Epic | One per platform domain |
| Feature | MVP features from MVP-02 Capability Matrix |
| User Story | Implementation stories per feature |
| Task | Technical tasks per story |

---

# User Story Fields

For **every** User Story, include:

| # | Field | Description |
|---|-------|-------------|
| 1 | Title | Clear, concise story title |
| 2 | Description | Full story narrative |
| 3 | Business Value | Why this story matters |
| 4 | Acceptance Criteria | Given/When/Then format |
| 5 | Definition of Done | Checklist of completion criteria |
| 6 | Dependencies | Blocked by / blocks |
| 7 | Priority | P1-Critical, P2-High, P3-Medium, P4-Low |
| 8 | Story Points | Fibonacci-like: 1, 2, 3, 5, 8, 13 |
| 9 | Estimated Sprint | Which sprint this lands in |
| 10 | Tags | Domain, release, persona |

---

# Story Point Scale

| Points | Description |
|--------|-------------|
| 1 | Trivial — few hours |
| 2 | Small — half day |
| 3 | Medium — 1 day |
| 5 | Large — 2-3 days |
| 8 | Very Large — 4-5 days |
| 13 | Epic-sized — needs further breakdown |

---

# Domain Separation

Separate backlog into the following domains:

| # | Domain | Description |
|---|--------|-------------|
| 1 | Platform | Core platform orchestration |
| 2 | Identity | Authentication, authorisation, SSO |
| 3 | Security | Encryption, secrets, audit logging |
| 4 | Azure Infrastructure | IaC, networking, resource provisioning |
| 5 | Database | Schema, migrations, data layer |
| 6 | API | REST endpoints, API management |
| 7 | Frontend | Web dashboard, UI components |
| 8 | Administration | User management, RBAC, configuration |
| 9 | Reporting | Dashboards, exports, analytics |
| 10 | AI | Azure OpenAI, mapping copilot, intelligence |
| 11 | Monitoring | Azure Monitor, logging, alerting |
| 12 | Testing | Unit, integration, E2E, security testing |
| 13 | Deployment | CI/CD, containerisation, release pipeline |
| 14 | Website | Marketing site, documentation |

---

# Sprint Structure

Organise work into **Release 1 (MVP)** with the following sprints:

| Sprint | Weeks | Focus |
|--------|-------|-------|
| Sprint 1 | 1-2 | Infrastructure, Identity, Platform Core |
| Sprint 2 | 3-4 | Discovery Engine, Database, API Foundation |
| Sprint 3 | 5-6 | Discovery Engine (continued), Security |
| Sprint 4 | 7-8 | Mapping Engine, Frontend Foundation |
| Sprint 5 | 9-10 | Mapping Engine (continued), Validation Engine |
| Sprint 6 | 11-12 | Validation Engine (continued), Governance Engine |
| Sprint 7 | 13-14 | Governance Engine (continued), Reporting |
| Sprint 8 | 15-16 | Reporting (continued), Administration |
| Sprint 9 | 17-18 | AI Integration, Monitoring |
| Sprint 10 | 19-20 | Testing, Bug Fixes, Regression |
| Sprint 11 | 21-22 | Integration Testing, Performance |
| Sprint 12 | 23-24 | Hardening, UAT, Go-Live Preparation |

---

# Non-Functional Requirements

Handle NFRs as dedicated user stories distributed across sprints:

| NFR Category | Sprint(s) | Stories |
|--------------|-----------|---------|
| Authentication (Entra ID) | Sprint 1 | US-NFR-001 |
| Encryption (at rest/in transit) | Sprint 1 | US-NFR-002 |
| RBAC | Sprint 2 | US-NFR-003 |
| Audit Logging | Sprint 3 | US-NFR-004 |
| Performance | Sprint 4 | US-NFR-005 |
| Scalability | Sprint 6 | US-NFR-006 |
| Accessibility (WCAG 2.2 AA) | Sprint 8 | US-NFR-007 |
| API Documentation | Sprint 9 | US-NFR-008 |

---

# Release Mapping

| Release | Scope | Sprints | Features |
|---------|-------|---------|----------|
| R1 (MVP) | Core platform, all 6 domains | 1-12 | 24 features |
| R2 (Enhanced) | Advanced validation, expanded reporting | Post-R1 | 4 features |
| R3 (AI & Governance) | AI Copilot, advanced governance | Post-R2 | 1+ features |
| R4 (Enterprise Scale) | Multi-tenant, marketplace, SSO federation | Post-R3 | 1+ features |

---

# Acceptance Criteria Format

All acceptance criteria use Given/When/Then:

```text
Given <precondition>
When <action>
Then <expected outcome>
```

---

# Definition of Done

Every user story must meet:

| # | Criterion |
|---|-----------|
| 1 | Code complete and peer reviewed |
| 2 | Unit tests written and passing |
| 3 | Integration tests written and passing |
| 4 | No P1/P2 defects open |
| 5 | Acceptance criteria verified |
| 6 | Documentation updated |
| 7 | Security scan passed |
| 8 | Deployed to test environment |
| 9 | Product Owner accepted |

---

# Dependency Rules

| Rule | Description |
|------|-------------|
| Linear flow | Discovery → Mapping → Validation → Governance → Reporting |
| No circular deps | A story cannot depend on a story that depends on it |
| Infrastructure first | Platform, Identity, Security before domain engines |
| API before Frontend | API endpoints before UI consumption |
| Database before API | Schema before API endpoints |

---

# Generate the Following Outputs

| # | Output | Format |
|---|--------|--------|
| 1 | **Azure DevOps CSV** | CSV — ready for bulk import |
| 2 | **Markdown Backlog** | Full backlog with all fields |
| 3 | **Sprint Plan** | Per-sprint story allocation with points |
| 4 | **Release Plan** | Feature-to-release mapping |
| 5 | **Epic Dependency Diagram** | ASCII or table showing epic dependencies |
| 6 | **Feature Dependency Matrix** | Feature-level dependency table |
| 7 | **Sprint Capacity Estimate** | Velocity forecast with planned/cumulative points |

Ensure all outputs can be imported into Azure DevOps with **minimal modification**.

---

# Quality Constraints

| Constraint | Requirement |
|------------|-------------|
| Traceability | Every story maps to an approved artefact (MVP-01–06, PD-01–07, UX-01–07, AZ-01–10) |
| No scope creep | Only approved capabilities — no invented functionality |
| Consistent sizing | Most stories 3-5 points; no 13-point stories without breakdown |
| Balanced velocity | Target 15-18 points per sprint; no sprint exceeds 22 |
| NFR distribution | NFRs spread across early sprints, not front-loaded or back-loaded |
| Domain coverage | All 14 domains represented in R1 |
