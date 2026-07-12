# OpenCode Master Delivery Playbook

**Migration Assurance Platform (MAP)**

**Document ID:** OPENCODE-MDP-001

**Version:** 1.0

**Status:** Approved

**Owner:** MAP Solution Architecture

**Location:**

`research/Azure_Founders_Hub_Pack/engineering/`

---

# 1. Purpose

This document defines the operational rules for OpenCode when contributing to the Migration Assurance Platform (MAP).

It is the primary engineering governance document and must be read before any implementation activity is undertaken.

The playbook ensures that every contribution is:

* Consistent
* Traceable
* Secure
* Aligned with the approved MAP architecture
* Suitable for enterprise delivery

---

# 2. Scope

This playbook applies to every engineering activity including:

* Documentation
* Website transformation
* Azure architecture
* Azure DevOps backlog generation
* Sprint delivery
* Software implementation
* Testing
* Deployment
* Refactoring
* Repository maintenance

---

# 3. Primary Objectives

OpenCode shall:

* Understand the repository before modifying it.
* Reuse existing work wherever possible.
* Preserve approved architecture.
* Minimise technical debt.
* Produce implementation reports.
* Never overwrite approved work without justification.

---

# 4. Repository Overview

The authoritative MAP repository is organised around programme phases.

The primary project documentation is located under:

```text
research/
└── Azure_Founders_Hub_Pack/
    └── Packaging_our_Company/
```

Engineering governance is located under:

```text
engineering/
```

Website implementation is located under:

```text
website/
```

Generated artefacts are stored under:

```text
outputs/
```

Sprint execution artefacts are stored under:

```text
sprints/
```

---

# 5. Repository Rules

OpenCode shall:

* Never move existing documents.
* Never rename approved documents.
* Never duplicate documentation unnecessarily.
* Treat approved documents as authoritative.
* Produce new artefacts in the correct repository location.

---

# 6. Authoritative Documentation

Before beginning any task, OpenCode shall identify and review all relevant approved documentation.

This includes, where applicable:

* Product Canon
* Blueprint Library
* Template & Reference Library
* Commercial Strategy
* Microsoft Founders Hub Pack
* Investor & Partnership Pack
* MVP
* Product Design
* UX
* Azure Architecture
* Delivery Planning
* Engineering Governance

Only approved documents shall be treated as the source of truth.

---

# 7. Standard Task Workflow

Every task follows the same lifecycle.

## Step 1

Understand the request.

## Step 2

Identify affected repository areas.

## Step 3

Read applicable governance documents.

## Step 4

Read applicable phase documentation.

## Step 5

Produce an implementation plan.

## Step 6

Execute approved work.

## Step 7

Validate output.

## Step 8

Produce an implementation summary.

---

# 8. Engineering Principles

All engineering work shall follow these principles:

* Azure First
* Cloud Native
* Security by Design
* Enterprise Architecture
* API First
* Modular Components
* Reusability
* Maintainability
* Documentation First
* Evidence-Based Delivery

---

# 9. Coding Standards

OpenCode shall:

* Reuse existing components where possible.
* Avoid unnecessary frameworks.
* Write maintainable code.
* Prefer clarity over cleverness.
* Preserve working implementations unless replacement has been approved.

---

# 10. Azure Standards

Only approved Azure services shall be used.

Preferred services include:

* Azure App Service
* Azure Static Web Apps
* Azure SQL
* Azure Storage
* Azure Functions
* Azure Key Vault
* Azure Monitor
* Azure AI
* Microsoft Entra ID

Alternative cloud providers shall not be introduced without approval.

---

# 11. Security Standards

All work shall comply with the approved security architecture.

Security requirements include:

* Zero Trust
* RBAC
* Encryption
* Secure Secrets
* Audit Logging
* Identity Management
* Secure APIs

Credentials shall never be hardcoded.

---

# 12. Website Standards

The MAP website shall be transformed from the approved existing HTML implementation.

OpenCode shall:

* Preserve the existing layout where appropriate.
* Reuse working components.
* Replace branding, content and imagery.
* Improve accessibility.
* Improve performance.
* Maintain responsive behaviour.

The original website stored in:

`website/existing/`

shall remain unchanged.

The transformed website shall be created in:

`website/map/`

---

# 13. Documentation Standards

Every document produced by OpenCode shall include:

* Title
* Purpose
* Scope
* Objectives
* Dependencies
* Version
* Status
* Owner
* Review
* Approval

Documents shall be written in professional business English.

---

# 14. Azure DevOps Standards

When generating backlog items, OpenCode shall produce:

* Epics
* Features
* User Stories
* Tasks

Every User Story shall include:

* Description
* Acceptance Criteria
* Definition of Done
* Story Points
* Dependencies
* Priority
* Sprint Allocation

Outputs should be suitable for Azure DevOps import.

---

# 15. Output Standards

Every implementation activity shall produce:

* Summary
* Files Modified
* Files Added
* Dependencies
* Validation Results
* Recommendations
* Next Steps

Generated artefacts shall be stored within the `outputs/` directory unless instructed otherwise.

---

# 16. Review Process

Before completion, OpenCode shall verify that:

* Repository standards have been followed.
* Approved documentation has been respected.
* Existing work has not been unintentionally modified.
* Outputs are complete.
* Deliverables satisfy the requested objective.

---

# 17. Change Control

OpenCode shall not:

* Introduce undocumented functionality.
* Replace approved architecture.
* Modify governance documents without approval.
* Delete existing project artefacts.

Where uncertainty exists, OpenCode shall stop and request clarification.

---

# 18. Working Principles

OpenCode should act as:

* Senior Solution Architect
* Enterprise Software Engineer
* Azure Architect
* Technical Delivery Lead
* Product Engineer

It should prioritise long-term maintainability over short-term convenience.

---

# 19. Relationship to Engineering Governance

This playbook acts as the entry point for all engineering governance.

Detailed standards are defined within:

* PI-01 Repository README
* PI-02 OpenCode Master Delivery Playbook
* PI-03 Repository Index
* PI-04 Implementation Standards
* PI-05 Website Transformation Specification
* PI-06 Branding Guide
* PI-07 Content Strategy
* PI-08 Navigation Model
* PI-09 Sprint Delivery Framework

OpenCode shall consult these documents whenever they are relevant to the requested task.

---

# 20. Approval

**Prepared by:** MAP Solution Architecture

**Approved by:** Project Owner

**Status:** Approved

**Version:** 1.0
