# MAP Nexus™ Enterprise Platform

# Generate_16_Enterprise_Business_Capability_Model.md

## Purpose

Generate the authoritative Enterprise Business Capability Model for the MAP Nexus™ Enterprise Platform.

This document will become the master business architecture for MAP.

It defines **what MAP does**, independent of implementation, technology or current frontend menus.

This is an architecture and analysis exercise.

**Do NOT modify source code.**

**Do NOT generate implementation.**

**Do NOT create APIs.**

**Do NOT modify the database.**

---

# Background

The Enterprise Functional Traceability Audit (Prompt 15) has been completed.

It identified that:

* the Python Migration Validation Engine represents the true business engine.
* the React frontend evolved independently.
* many frontend pages are not yet connected to backend capabilities.
* several platform features (Workflow, Tasks, Calendar, Notifications, AI) currently exist without being formally connected to the business engine.

This document defines the correct enterprise business capability model before any further implementation proceeds.

---

# Input Sources

## Architecture

Read and analyse

```text
engineering/
└── MAP_V2/
    └── 00_Architecture/
```

Use all architecture documents, including

* Master Roadmap
* Product Architecture
* Backend Architecture
* Database Architecture
* API Architecture
* Reporting Architecture
* Development Standards
* Platform Integration Architecture
* Enterprise Application Architecture
* Enterprise Functional Traceability Architecture

---

## Existing Source Code

Analyse

React Frontend

Python Migration Validation Engine

FastAPI

Database

Existing APIs

Existing SQL Views

---

## Previous Audit

Read every document produced by Prompt 15.

Especially

* Executive Summary
* Functional Traceability Matrix
* Frontend Gap Analysis
* Backend Gap Analysis
* Business Capability Catalogue
* Frontend Backend Mapping
* Database Ownership Report
* Recommended Frontend Reorganisation

Treat these as authoritative discovery documents.

---

# Objective

Determine the complete Enterprise Business Capability Model for MAP.

Do not analyse menus.

Do not analyse screens.

Do not analyse components.

Instead determine the actual business capabilities of the platform.

---

# Required Analysis

## Phase 1

Identify every business capability currently implemented within the Python Engine.

Examples include

* Project Management
* Connection Management
* Dataset Discovery
* Dataset Mapping
* Column Mapping
* Rule Discovery
* Control Discovery
* Validation
* Governance
* Reporting
* Scheduling
* Retry
* Checkpointing
* Audit

Expand this list where appropriate.

---

## Phase 2

Determine logical capability domains.

Possible examples

Migration Management

Validation Management

Governance

Execution Management

Reporting

Platform Services

Administration

Security

AI

These domains shall be derived from analysis rather than assumptions.

---

## Phase 3

For every capability identify

Purpose

Business owner

Primary users

Inputs

Outputs

Dependent capabilities

Supporting services

Supporting schemas

Supporting APIs

Supporting Python modules

Supporting frontend pages

---

## Phase 4

Determine capability hierarchy.

Example only

```text
Migration Management

    Projects

    Connections

    Discovery

    Dataset Mapping

    Column Mapping

Validation

    Rules

    Controls

    Execution

Governance

    Decisions

    Approvals

Reporting

    Reports

    Distribution

Platform

    Workflow

    Tasks

    Notifications

    Calendar

    AI

Administration

    Users

    Roles

    Settings

Security

    Authentication

    Authorisation

    Audit
```

Do not copy this hierarchy.

Derive the hierarchy from analysis.

---

## Phase 5

Determine capability dependencies.

Example

```text
Projects

↓

Connections

↓

Discovery

↓

Mappings

↓

Rules

↓

Validation

↓

Governance

↓

Reporting
```

Determine every dependency.

---

## Phase 6

Determine which capabilities produce business events.

Examples

Validation Failed

Batch Started

Batch Completed

Governance Blocked

Checkpoint Created

Retry Triggered

Dataset Imported

Rule Discovered

Determine every business event.

---

## Phase 7

Determine which platform capabilities consume those events.

Examples

Workflow

Tasks

Notifications

Calendar

AI

Dashboards

Reports

These are consumers.

Determine every relationship.

---

## Phase 8

Produce an Enterprise Capability Map.

Illustrate

```text
Business Capability

↓

Application Service

↓

Python Engine

↓

Database

↓

Business Events

↓

Platform Services

↓

Frontend

↓

User
```

Do this for every major capability.

---

## Phase 9

Determine the correct frontend navigation hierarchy based upon the Business Capability Model.

Do not use the current menus.

Recommend the correct enterprise navigation.

---

# Deliverables

Generate

```text
16_Enterprise_Business_Capability_Model.md

Business_Capability_Catalogue.md

Business_Capability_Hierarchy.md

Business_Capability_Dependencies.md

Business_Event_Model.md

Capability_to_API_Mapping.md

Capability_to_Database_Mapping.md

Capability_to_Python_Mapping.md

Capability_to_Frontend_Mapping.md

Recommended_Enterprise_Navigation.md

Business_Capability_Gap_Report.md

Executive_Summary.md
```

---

# Validation

Validate

✓ Every business capability identified

✓ Every capability mapped to backend

✓ Every capability mapped to database

✓ Every capability mapped to frontend

✓ Capability hierarchy complete

✓ Dependencies complete

✓ Business events identified

✓ Platform consumers identified

✓ No duplicated capabilities

✓ Navigation derived from business capabilities

✓ Architecture consistent

✓ Enterprise standards followed

---

# Success Criteria

The document is complete when:

* MAP is defined in terms of business capabilities rather than pages or technology.
* Every capability has a clear owner, purpose and dependency.
* Every capability is traceable to the Python engine, APIs, database and frontend.
* Every platform feature (Workflow, Tasks, Notifications, Calendar, AI) is shown as supporting the business engine rather than replacing it.
* The document becomes the authoritative business blueprint for all future MAP development.


---

# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 16_Enterprise_Business_Capability_Model/

Generate the following files:

16_Enterprise_Business_Capability_Model.md

Executive_Summary.md

Business_Capability_Catalogue.md

Business_Capability_Hierarchy.md

Business_Capability_Dependencies.md

Business_Event_Model.md

Capability_to_API_Mapping.md

Capability_to_Database_Mapping.md

Capability_to_Python_Mapping.md

Capability_to_Frontend_Mapping.md

Recommended_Enterprise_Navigation.md

Business_Capability_Gap_Report.md

Generation_Report.md

Generation_Change_Log.md

Do not overwrite any production architecture documents.



---

# Engineering Review

Present all generated artefacts for review.

Stop after generation.

Await explicit user approval.

Nothing shall be promoted automatically.


---

# Production Promotion

After engineering review and explicit user approval, promote only:

16_Enterprise_Business_Capability_Model.md

to

engineering/
└── MAP_V2/
    └── 00_Architecture/

The remaining reports remain permanently within

02_Output/

as supporting engineering documentation.


---

# Promotion Rule

Only one approved architecture document shall exist for each architectural subject.

Working reports shall never overwrite architecture standards.