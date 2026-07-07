# PI-01 – Repository README

**Migration Assurance Platform (MAP)**

**Sprint:** Sprint-00 – Engineering Governance Foundation

**Document ID:** PI-01

**Version:** 1.0

**Status:** Approved

**Owner:** MAP Solution Architecture

**Repository Location:**

`research/Azure_Founders_Hub_Pack/engineering/`

---

# 1. Purpose

This document defines the official repository structure for the Migration Assurance Platform (MAP).

It explains how documentation, engineering assets, implementation artefacts and sprint deliverables are organised.

The repository structure has been designed to:

* Preserve completed programme documentation.
* Separate governance from implementation.
* Support OpenCode development.
* Support Azure DevOps delivery.
* Support future team collaboration.
* Maintain traceability across the programme lifecycle.

---

# 2. Scope

This document applies to the complete MAP repository including:

* Programme documentation
* Engineering governance
* Website implementation
* Sprint delivery
* Generated outputs
* Future software development

---

# 3. Repository Principles

The repository follows these principles:

* Existing approved documentation remains unchanged.
* New engineering assets are isolated from approved business artefacts.
* Source files and generated outputs remain separate.
* Repository organisation should be intuitive.
* Every artefact has a single authoritative location.

---

# 4. High-Level Repository Structure

```text
research/
└── Azure_Founders_Hub_Pack/
    │
    ├── Packaging_our_Company/
    │
    ├── engineering/
    │
    ├── website/
    │
    ├── outputs/
    │
    └── sprints/
```

---

# 5. Packaging_our_Company

## Purpose

This directory contains the authoritative programme documentation produced throughout the MAP planning and design lifecycle.

These documents are considered controlled artefacts and shall not be reorganised without approval.

Current phases include (as applicable):

* Phase 1 – Product Foundation
* Phase 2 – Commercial & Founders Hub
* Phase 3 – MVP Delivery
* Product Design
* UX
* Azure Architecture
* Delivery Planning

Future programme documentation should continue to follow the established numbering convention.

---

# 6. Engineering Folder

## Purpose

The Engineering folder contains governance documentation used by OpenCode and future engineering contributors.

Typical contents include:

* Engineering governance
* Repository guidance
* Implementation standards
* Website specifications
* Sprint governance

Engineering documents define **how work is performed** rather than **what is being built**.

---

# 7. Website Folder

## Purpose

The Website folder contains all assets relating to the official MAP website.

### Structure

```text
website/

existing/

map/

specifications/

deployment/
```

### existing/

Contains the original HTML/CSS/JavaScript website used as the transformation baseline.

This directory is read-only.

### map/

Contains the transformed official MAP website.

This becomes the production implementation.

### specifications/

Contains website governance documents including:

* Website Transformation Specification
* Branding Guide
* Content Strategy
* Navigation Model

### deployment/

Contains deployment configuration, hosting guidance and operational documentation.

---

# 8. Outputs Folder

## Purpose

Stores generated artefacts produced during implementation.

Outputs are not considered authoritative source documentation.

Typical structure:

```text
outputs/

reports/

website/

backlogs/

reviews/

testing/
```

Examples include:

* Repository Analysis Reports
* Azure DevOps exports
* Website reports
* Architecture reviews
* Sprint reports
* Test evidence

---

# 9. Sprints Folder

## Purpose

Stores engineering execution artefacts.

Each sprint contains:

* Objectives
* Deliverables
* Reviews
* Sign-off

Recommended structure:

```text
sprints/

Sprint-00/

Sprint-01/

Sprint-02/

Sprint-03/
```

Each sprint should remain self-contained.

---

# 10. Repository Ownership

| Area                    | Owner                  |
| ----------------------- | ---------------------- |
| Programme Documentation | Solution Architecture  |
| Engineering Governance  | Solution Architecture  |
| Website                 | Engineering Team       |
| Outputs                 | OpenCode / Engineering |
| Sprint Artefacts        | Delivery Lead          |

---

# 11. Version Control

All repository changes shall be managed through Git.

Recommended practices:

* Small commits
* Meaningful commit messages
* Review before merge
* Preserve document history
* Avoid force overwrites

---

# 12. Repository Governance

Repository governance follows these principles:

* Single source of truth
* Controlled documentation
* Clear ownership
* Traceability
* Repeatability
* Enterprise standards

---

# 13. OpenCode Responsibilities

Before modifying the repository, OpenCode shall:

1. Read the OpenCode Master Delivery Playbook.
2. Read applicable engineering governance documents.
3. Identify affected repository areas.
4. Produce an implementation plan.
5. Execute approved work.
6. Generate implementation reports.

---

# 14. Future Growth

The repository has been designed to support future additions including:

* Source code
* Infrastructure as Code
* CI/CD pipelines
* Automated testing
* Azure DevOps integration
* AI services
* Production operations

The structure should evolve without requiring reorganisation of existing programme documentation.

---

# 15. Related Documents

This document should be read alongside:

* OPENCODE_MASTER_DELIVERY_PLAYBOOK.md
* PI-02 – OpenCode Master Delivery Playbook
* PI-03 – Repository Index
* PI-04 – Implementation Standards

---

# 16. Review

This document shall be reviewed whenever:

* Repository structure changes.
* New engineering areas are introduced.
* Major programme phases are added.
* Governance processes are updated.

---

# 17. Approval

**Prepared by:** MAP Solution Architecture

**Approved by:** Project Owner

**Status:** Approved

**Version:** 1.0
