# MAP Nexus™ Enterprise Platform

# Prompt Engineering Framework

## Generate Enterprise Implementation Prompt

**Version:** 3.0

**Status:** Approved

**Category:** Prompt Engineering Utility

---

# Purpose

Create a reusable MAP Nexus™ Enterprise Prompt Generation Framework.

This framework generates production-ready implementation prompts that conform to MAP Prompt Engineering Standards.

The generated prompts shall become engineering specifications suitable for direct implementation.

The framework shall be reusable for all future MAP implementation prompts.

Examples:

Prompt 022 — Create AI Assistant

Prompt 023 — Create AI Insights

Prompt 024 — Create AI Recommendations

Prompt 025 — Create AI Report Generator

Future MAP prompts.

---

# Objective

Generate complete enterprise implementation prompts using:

- Prompt metadata
- MAP architecture documentation
- Existing MAP prompt library
- Existing frameworks
- Existing implementation patterns

The generated prompt shall:

- Reuse existing MAP frameworks.
- Avoid duplicated functionality.
- Preserve architecture consistency.
- Maintain metadata-driven design.
- Follow MAP engineering standards.
- Produce implementation-ready specifications.

The generated prompt must not be abbreviated, summarised or simplified.

---

# Input Parameters

The framework shall generate prompts using the following parameters.

## Prompt ID

Example:

022

---

## Prompt Name

Example:

Create AI Assistant

---

## Workstream

Example:

04 — AI Platform

---

## Version

Example:

5.0

---

# File Lifecycle Policy

MAP prompts follow a controlled engineering workflow.

No production prompt shall be overwritten without explicit approval.

---

# Architecture Source

The framework shall read architecture documents only from:


engineering/
└── MAP_V2/
└── 00_Architecture/


This is the authoritative architecture source.

Read:


00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

07_Reporting_Architecture.md

11_Development_Standards.md


Architecture documentation takes precedence over assumptions.

---

# Prompt Library Source

The framework shall read existing implementation prompts only from:


engineering/
└── MAP_V2/
└── 01_Prompts/


This is the authoritative implementation source.

Review existing prompts to determine:

- Completed functionality
- Existing dependencies
- Reusable frameworks
- Existing widgets
- Existing portals
- Existing services
- Existing folder structures
- Existing implementation patterns

Do not duplicate completed functionality.

---

# Working Output Location

All generated engineering artefacts shall be created in:


engineering/
└── MAP_V2/
└── 02_Output/
└── Prompt_Generation/
└── Batch_<PromptID>/


Example:


Batch_022/


---

# Production Destination

Generated prompts shall not directly replace production prompts.

After:

- engineering review
- validation completion
- explicit user approval

the generated prompt may be promoted.

Promotion destination:


engineering/
└── MAP_V2/
└── 01_Prompts/


There shall only be one approved production version of each MAP prompt.

---

# Prompt Generation Process

The framework shall execute the following phases.

---

# Phase 1 — Load Architecture

Read:


00_Architecture


Analyse:

- Enterprise roadmap
- Product architecture
- Portal architecture
- Backend architecture
- API architecture
- Reporting architecture
- Development standards

Determine architectural constraints.

---

# Phase 2 — Load Prompt Library

Read:


01_Prompts


Analyse:

- Completed prompts
- Prompt dependencies
- Existing frameworks
- Existing widgets
- Existing portals
- Existing services
- Existing reusable components

Identify functionality that already exists.

---

# Phase 3 — Analyse Prompt Position

Determine:

- Previous Prompt
- Next Prompt
- Workstream
- Architecture Layer
- Required Frameworks
- Portal Dependencies
- Shared Components
- Required Deliverables

Do not hard-code dependencies.

Determine them from architecture and prompt library analysis.

---

# Phase 4 — Determine Functional Scope

Using:

- Prompt ID
- Prompt Name
- Workstream
- Master Roadmap
- Existing prompts
- Architecture documents

Determine:

- Purpose
- Objectives
- Functional scope
- Architecture requirements
- Components
- Folder Structure
- UI requirements
- Backend dependencies
- Framework reuse
- Deliverables
- Acceptance Criteria

Do not invent functionality that conflicts with MAP architecture.

---

# Phase 5 — Generate Prompt

Only after completing analysis.

Generate the complete MAP implementation prompt.

The generated prompt must include:

- Metadata
- Prerequisites
- Purpose
- Objective
- Architecture
- Functional Requirements
- Folder Structure
- Components
- Configuration
- Integration Requirements
- Responsive Behaviour
- Accessibility
- Deliverables
- Implementation Report
- Acceptance Criteria
- Next Prompt

The generated prompt must:

- Follow MAP prompt structure.
- Match existing production prompt quality.
- Be implementation ready.
- Contain all required sections.

Do not:

- Summarise.
- Remove requirements.
- Skip sections.
- Produce partial prompts.

---

# Phase 6 — Engineering Validation

Validate:

✓ Prompt numbering correct

✓ Prompt metadata correct

✓ Workstream correct

✓ Dependencies correct

✓ Folder references correct

✓ Existing functionality reused

✓ Duplicate functionality removed

✓ Missing requirements identified

✓ Obsolete references removed

✓ Roadmap consistency maintained

✓ Architecture consistency maintained

✓ Development standards followed

✓ Implementation readiness achieved

---

# Phase 7 — Generate Engineering Reports

Generate:


Generation_Report.md

Generation_Change_Log.md

Dependency_Report.md

Framework_Reuse_Report.md


---

## Generation_Report.md

Include:

- Architecture reviewed
- Prompt dependencies
- Existing functionality reused
- New functionality introduced
- Validation results
- Overall readiness

---

## Generation_Change_Log.md

Include:

- Generated sections
- Architectural decisions
- New requirements introduced
- References added
- Corrections made

---

## Dependency_Report.md

Include:

- Previous prompts reviewed
- Required dependencies
- Shared frameworks reused
- Portal dependencies

---

## Framework_Reuse_Report.md

Include:

- Existing components reused
- Existing widgets reused
- Existing services reused
- Existing patterns followed

---

# Phase 8 — Engineering Review

After generation:

STOP.

Do not promote automatically.

Present:

- Generated prompt
- Validation results
- Reports

Await explicit user approval.

No production changes shall occur before approval.

---

# Phase 9 — Promotion

After approval:

Promote:


02_Output

↓

01_Prompts


Generate:


Promotion_Report.md


Include:

- Source location
- Destination location
- Approval confirmation
- Final production status

---

# Quality Requirements

The generated prompt shall:

✓ Follow MAP Prompt Engineering Standards

✓ Preserve enterprise architecture

✓ Reuse existing frameworks

✓ Avoid duplication

✓ Remain metadata driven

✓ Maintain prompt numbering

✓ Maintain workstream structure

✓ Support future expansion

✓ Be suitable for direct implementation

---

# Success Criteria

The framework execution is complete when:

✓ Architecture has been analysed

✓ Existing prompts have been reviewed

✓ Dependencies have been determined

✓ Functional scope has been identified

✓ Production prompt has been generated

✓ Validation has completed

✓ Engineering reports have been produced

✓ User review has been completed

✓ Approval has been received before promotion

✓ One authoritative production prompt exists

---

# Example Usage

Input:


Prompt ID

022

Prompt Name

Create AI Assistant

Workstream

04 — AI Platform

Version

5.0


Output:


engineering/
└── MAP_V2/
└── 02_Output/
└── Prompt_Generation/
└── Batch_022/

            022_Create_AI_Assistant.md

            Generation_Report.md

            Generation_Change_Log.md

            Dependency_Report.md

            Framework_Reuse_Report.md

After approval:


engineering/
└── MAP_V2/
└── 01_Prompts/
└── Workstream_04_AI_Platform/

        022_Create_AI_Assistant.md

---

# End of Framework