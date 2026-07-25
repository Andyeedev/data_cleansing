# Generate_00_Arch_Prompt_16_Enterprise_Business_Capability_Model.md

## Purpose

Produce the definitive Enterprise Business Capability Model for the MAP Nexus Platform.

This prompt is **architecture-first**, not implementation-first.

The objective is to identify **what the business does**, **why it exists**, **who owns it**, **how it interacts with other capabilities**, and **how it is realised across the platform**.

The output becomes a permanent architecture artefact that future prompts will reference.

---

# Primary Objectives

The model must:

1. Identify all business capabilities.
2. Organise them into business domains.
3. Produce a capability hierarchy.
4. Produce business capability relationships.
5. Produce business event model.
6. Produce capability ownership.
7. Map capabilities to:

   * Database
   * APIs
   * Python modules
   * Services
   * Frontend
8. Produce capability lifecycle.
9. Produce capability maturity.
10. Produce capability roadmap.
11. Produce implementation gaps.
12. Produce enterprise navigation recommendations.

---

# IMPORTANT

This prompt is **NOT** documenting screens.

It is **NOT** documenting APIs.

It is **NOT** documenting database tables.

Those are implementation views.

This prompt documents the BUSINESS.

---

# Phase 1 — Discover Business Domains

Identify the major business domains.

Examples only:

* Migration Management
* Validation Management
* Governance
* Reporting
* Platform Services
* Administration

Do NOT assume these are correct.

Derive them.

---

# Phase 2 — Identify Business Capabilities

Within each domain identify:

Business Capability

Description

Purpose

Primary Business Owner

Primary Users

Inputs

Outputs

Success Measures

Consumers

Suppliers

Business Events

Lifecycle Stage

Dependencies

---

# Phase 3 — Build Capability Hierarchy

Produce:

Level 0

Enterprise Platform

↓

Level 1

Business Domains

↓

Level 2

Business Capabilities

↓

Level 3

Business Services

↓

Level 4

Implementation Components

---

# Phase 4 — Capability Relationships

Identify:

Depends On

Produces

Consumes

Triggers

Reads

Writes

Owns

Supports

Blocks

Enables

---

# Phase 5 — Business Event Model

Identify business events.

Examples:

Migration Created

Dataset Discovered

Mapping Approved

Validation Started

Validation Completed

Control Failed

Governance Decision Made

Risk Calculated

Release Approved

Report Generated

Task Assigned

Notification Sent

Do not invent events.

Discover them.

---

# Phase 6 — Capability Ownership

For every capability identify:

Business Owner

Technical Owner

Database Owner

API Owner

Frontend Owner

Support Team

---

# Phase 7 — Capability Realisation Mapping

Map every capability to:

## Database

Schema

Tables

Views

Procedures

Functions

---

## Backend

Python Modules

Services

Engines

Orchestrators

Workers

Schedulers

---

## APIs

REST endpoints

Background jobs

Events

WebSockets

---

## Frontend

Pages

Components

Dashboards

Widgets

Navigation

---

# Phase 8 — Capability Lifecycle

Classify every capability as:

Proposed

Planned

Under Development

Implemented

Operational

Deprecated

Retired

---

# Phase 9 — Capability Maturity

Score each capability.

Example:

1 Initial

2 Repeatable

3 Defined

4 Managed

5 Optimised

Explain reasoning.

---

# Phase 10 — Gap Analysis

Identify:

Missing capabilities

Duplicate capabilities

Weak capabilities

Disconnected capabilities

Platform-only capabilities

Engine-only capabilities

Frontend-only capabilities

Backend-only capabilities

Capabilities with no APIs

Capabilities with no UI

Capabilities with no ownership

Capabilities with no reporting

---

# Phase 11 — Roadmap

Recommend implementation order.

Include:

Business Value

Technical Dependency

Risk

Complexity

Estimated Phase

---

# Phase 12 — Enterprise Navigation

Recommend enterprise navigation driven by business capabilities.

Not by technology.

Not by code.

Not by folders.

Navigation must reflect business.

---

# Phase 13 — Cross Validation

Cross-check every capability against:

Architecture

Database

Backend

Frontend

API

Reporting

Security

Navigation

If inconsistencies exist:

Document them.

Do NOT silently correct them.


---

# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 16_Enterprise_Business_Capability_Model/
        
---

# Required Deliverables

Produce the following files.

---

16_Enterprise_Business_Capability_Model.md

---

## 16Enterprise_Business_Capability_Model.md

Master document.

---

## 01_Executive_Summary.md

High-level overview.

---

## 02_Business_Capability_Catalogue.md

One section per capability.

---

## 03_Business_Capability_Hierarchy.md

Hierarchy diagrams.

---

## 04_Business_Capability_Dependencies.md

Dependency analysis.

---

## 05_Business_Event_Model.md

Business events.

---

## 06_Capability_to_API_Mapping.md

Capability → API.

---

## 07_Capability_to_Database_Mapping.md

Capability → Database.

---

## 08_Capability_to_Python_Mapping.md

Capability → Python.

---

## 09_Capability_to_Frontend_Mapping.md

Capability → Frontend.

---

## 10_Recommended_Enterprise_Navigation.md

Navigation model.

---

## 11_Business_Capability_Gap_Report.md

Gap analysis.

---

## 12_Generation_Report.md

Generation metrics.

---

## 13_Generation_Change_Log.md

Changes made during generation.

---

# Quality Rules

The model must be:

Business-first

Technology-neutral

Vendor-neutral

Implementation-independent

Complete

Consistent

Non-duplicated

Fully traceable

Architecture-aligned

Every capability must have:

Purpose

Owner

Consumers

Dependencies

Lifecycle

Mappings

Maturity

Roadmap

Gap assessment

No capability may exist without business value.

No implementation detail may be treated as a business capability.

---

# Expected Outcome

The resulting Enterprise Business Capability Model becomes the authoritative business architecture for MAP Nexus and serves as the foundation for subsequent architecture, process, data, API, UI, security, governance, and implementation prompts.





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
