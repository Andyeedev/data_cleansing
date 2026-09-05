# MAP Nexus™ Enterprise Platform

# Enterprise Functional Traceability Audit

## Objective

Perform a complete architectural discovery and traceability audit of the current MAP platform.

This is an analysis and documentation exercise only.

**Do NOT modify any source code.**

**Do NOT rename files.**

**Do NOT move folders.**

**Do NOT refactor.**

**Do NOT create new APIs.**

**Do NOT create new database tables.**

Your task is to discover, document and map the current implementation so we can determine whether the frontend correctly represents the existing Python Migration Validation Engine.

---

# Background

MAP currently consists of three independently developed systems.

## System 1

Python Migration Validation Engine

Current location

```
Financial_services_Migration_product/
ver1.4/
fs-migration-validation-engine/
```

Entry point

```
python -m app.main run --config config.yaml
```

This is the original MAP product and is considered the primary business engine.

It contains the migration intelligence including:

* Project execution
* Connection management
* Dataset discovery
* Dataset mappings
* Column mappings
* Rule discovery
* Control discovery
* Validation execution
* Governance decisions
* Reporting
* Audit
* Checkpointing
* Retry
* Scheduling

This engine already communicates with PostgreSQL.

---

## System 2

MAP V2 React Frontend

Current location

```
MAP_V2
```

This provides the user interface.

It contains multiple portals including:

* Executive
* Migration
* Operations
* Reporting
* Governance
* Administration

Workstream 05 has already added

* Tasks
* Workflow
* Approvals
* Calendar
* Notifications

These pages currently exist but their relationship to the Python engine has not been formally documented.

---

## System 3

PostgreSQL

Database

```
migration_engine
```

Schemas

```
core
engine
platform
```

Current ownership

core

Migration metadata

engine

Execution and governance

platform

Application features

---

# Problem Statement

There is concern that the React frontend has evolved independently from the Python Migration Engine.

The objective is to determine whether every frontend capability can be traced back to existing business functionality.

The migration engine must remain the primary business system.

The frontend must become a presentation layer for the existing engine rather than becoming an independent application.

---

# Existing Architecture Standards

Review and use

```
00_Architecture/
```

Especially

* 11_Development_Standards.md
* 12_Platform_Integration_Architecture.md
* 13_Enterprise_Application_Architecture.md (if present)
* 13_Architecture_Compliance_Audit.md (if present)

These documents define the architectural standards.

---

# Required Analysis

Perform a complete discovery.

---

## Phase 1

Analyse the Python Migration Validation Engine.

Document every major business capability.

Examples include

* Project Management
* Connections
* Discovery
* Dataset Mapping
* Column Mapping
* Rule Discovery
* Control Discovery
* Validation
* Governance
* Reporting
* Audit
* Scheduling
* Retry
* Checkpointing

For each capability identify

* Python module
* Service
* Entry point
* Database schema
* Tables
* APIs (if already implemented)

---

## Phase 2

Analyse the React frontend.

Identify

Every menu

Every submenu

Every page

Every dashboard

Every widget

Every service

Every API call

Every navigation entry

---

## Phase 3

Analyse FastAPI.

Document

Every endpoint

Associated service

Associated Python module

Associated repository

Associated schema

Associated tables

---

## Phase 4

Analyse PostgreSQL.

Document every table within

core

engine

platform

Determine

Table ownership

Relationships

Business purpose

Whether it belongs to

Migration

Execution

Platform

Reporting

AI

Workflow

---

## Phase 5

Create an Enterprise Functional Traceability Matrix.

For every frontend page produce

| Frontend Menu | React Component | API Endpoint | Service | Python Module | Schema | Tables | Business Capability | Status |

Status must be

Aligned

Partial

Missing

Duplicate

Unknown

---

## Phase 6

Identify all frontend pages that currently have no corresponding backend capability.

Examples may include

Tasks

Workflow

Notifications

Calendar

Approvals

Determine whether

* They already exist in Python
* They should be implemented through APIs
* They are platform-only capabilities
* They should instead consume events from the migration engine

---

## Phase 7

Identify all backend capabilities that currently have no frontend representation.

Examples may include

Dataset Discovery

Column Mapping

Rule Discovery

Governance

Execution Monitoring

Checkpoint Recovery

Retry Engine

These should become candidates for future frontend implementation.

---

## Phase 8

Produce an End-to-End Functional Flow.

For every core business capability document

```
Frontend

↓

API

↓

Application Service

↓

Python Engine

↓

Repository

↓

Database

↓

Response DTO

↓

Frontend
```

Do this for every major migration function.

---

## Phase 9

Architecture Assessment

Determine whether the current frontend is

Migration-first

or

Platform-first

Provide evidence.

Recommend how to realign the frontend with the migration engine if required.










---

# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 15_Enterprise_Functional_Traceability_Architecture/

Generate the following files:

15_Enterprise_Functional_Traceability_Architecture.md

Enterprise_Functional_Traceability_Report.md

Frontend_Backend_Mapping.md

Database_Ownership_Report.md

Business_Capability_Catalogue.md

API_Service_Mapping.md

Frontend_Gap_Analysis.md

Backend_Gap_Analysis.md

Enterprise_Functional_Traceability_Matrix.md

Recommended_Frontend_Reorganisation.md

Executive_Summary.md


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

15_Enterprise_Functional_Traceability_Architecture.md

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














---

# Deliverables

Generate

```
engineering\MAP_V2\02_Output\15_Enterprise_Functional_Traceability_Architecture\


Enterprise_Functional_Traceability_Report.md

Frontend_Backend_Mapping.md

Database_Ownership_Report.md

Business_Capability_Catalogue.md

API_Service_Mapping.md

Frontend_Gap_Analysis.md

Backend_Gap_Analysis.md

Enterprise_Functional_Traceability_Matrix.md

Recommended_Frontend_Reorganisation.md

Executive_Summary.md
```

---

# Rules

This exercise is documentation only.

Do not change code.

Do not modify APIs.

Do not modify database schemas.

Do not refactor.

Do not generate implementation.

Your objective is to produce an accurate picture of the current platform so that future implementation work can proceed with complete confidence.

The final reports shall become the authoritative basis for future MAP development.
