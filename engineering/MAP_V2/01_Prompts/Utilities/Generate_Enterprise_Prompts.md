# MAP Nexus™ Enterprise Platform

# Enterprise Prompt Generation Framework

## Generate Enterprise Implementation Prompts (Any Workstream)

**Version:** 1.0

**Status:** Production

**Category:** Prompt Engineering Utility

---

# Purpose

Generate complete batches of MAP Nexus™ enterprise implementation prompts that conform to MAP Prompt Engineering Standards.

This framework is **workstream-agnostic** — it can generate prompts for ANY workstream by changing only the parameter block.

The generated prompts shall become production-ready engineering specifications suitable for direct implementation.

The generated prompts shall not be abbreviated, summarised or simplified.

---

# Objective

Generate complete implementation prompts that are fully aligned with the MAP Enterprise Architecture, existing implementation prompts and engineering standards.

The generated prompts shall:

* Reuse existing frameworks wherever possible.
* Avoid duplication.
* Preserve architectural consistency.
* Remain metadata-driven.
* Produce production-ready implementation specifications.

---

# Framework Configuration

## User-Provided Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| Workstream | Target workstream with ID and name | 05 — Workflow & Administration |
| Version | Prompt version | 5.0 |
| Batch | Array of Prompt ID + Prompt Name pairs | See batch table below |

## Batch Configuration Template

```
| Prompt ID | Prompt Name | Workstream | Version |
|-----------|-------------|------------|---------|
| <ID>      | <Name>      | <Workstream> | <Version> |
```

---

# Auto-Determination Rules

The framework automatically determines the following from the user-provided parameters and existing engineering sources.

## Previous Prompt

**Rule:** Scan the prompt library and find the highest Prompt ID that is less than the first Prompt ID in the batch.

**Example:**
- Batch starts at 031
- Scan library: 000, 001, 002, ... 030
- Previous Prompt = 030

## Next Prompt

**Rule:** Last Prompt ID in batch + 1

**Example:**
- Batch ends at 035
- Next Prompt = 036

## Workstream Name

**Rule:** Extract from user-provided Workstream parameter.

**Example:**
- Input: "05 — Workflow & Administration"
- Output: "Workflow & Administration"

## Dependencies

**Rule:** Read Master Roadmap and existing prompt library. Determine which completed prompts are required for the new prompts to function.

**Process:**
1. Read 00_Master_Roadmap.md
2. Map Prompt IDs to workstreams
3. For each prompt in batch, identify:
   - Frameworks it depends on (e.g., Widget Framework, Auth Framework)
   - Portals it integrates with
   - Services it requires
   - Previous prompts it builds upon

**Example:**
- Prompt 031 (User Management) depends on:
  - Prompt 005 (Application Shell)
  - Prompt 015 (Administration Portal)
  - Prompt 004 (Authentication Module)

## Architecture Layer

**Rule:** Map workstream to primary architecture document.

| Workstream | Primary Architecture |
|------------|---------------------|
| 01 — Platform Foundation | 01_Product_Architecture.md |
| 02 — Portal Development | 02_Portal_Architecture.md |
| 03 — Presentation Engine | 07_Reporting_Architecture.md |
| 04 — AI Platform | 01_Product_Architecture.md |
| 05 — Workflow & Administration | 03_Backend_Architecture.md |
| 06 — Integration | 04_API_Architecture.md |
| 07 — AI Provider Integration | 01_Product_Architecture.md |
| 08 — Commercial Strategy | 01_Product_Architecture.md |

## Portal Integration

**Rule:** Read 02_Portal_Architecture.md. List all portals that the workstream's prompts will integrate with.

**Process:**
1. Read portal architecture
2. For each prompt, determine which portals need UI components
3. List applicable portals

**Example:**
- Workstream 05 (Administration) → Administration Portal
- Workstream 06 (Integration) → All portals (cross-cutting)

## Widget Integration

**Rule:** Read existing widget framework (Prompt 007). Identify reusable widgets and any new widgets required.

**Process:**
1. Read Prompt 007 (Widget Framework)
2. List existing widgets that can be reused
3. Identify if new widgets are needed
4. Reference Prompt 007 for widget integration

## Functional Scope

**Rule:** Determine functional scope by analysing:

1. Prompt Name — infer primary function
2. Master Roadmap — identify related features
3. Existing prompts — identify gaps to fill
4. Architecture documents — identify technical requirements

**Process:**
1. Read 00_Master_Roadmap.md
2. Read 01_Product_Architecture.md
3. Read relevant architecture document (based on workstream)
4. Analyse existing prompts in the workstream
5. Determine what functionality the new prompts should implement

## Folder Structure

**Rule:** Follow MAP naming conventions.

```
src/
├── <portal>/
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
```

**Example:**
- Prompt 031 (User Management) → `src/admin/users/`
- Prompt 032 (Role Management) → `src/admin/roles/`

## Constraints

**Rule:** Apply generic constraints from Development Standards (11_Development_Standards.md).

**Standard Constraints:**
1. Do not duplicate functionality from existing prompts
2. Reuse existing frameworks (Widget, Auth, Navigation, Theme)
3. Follow MAP coding standards
4. Maintain provider independence (for AI workstreams)
5. Follow security best practices
6. Support responsive design
7. Implement accessibility (WCAG AA)

---

# File Lifecycle Policy

The MAP prompt library follows a controlled engineering workflow.

## Input

Read only from

Architecture

engineering/

└── MAP_V2/

    └── 00_Architecture/

Implementation Prompts

engineering/

└── MAP_V2/

    └── 01_Prompts/

These folders are the only authoritative engineering sources.

---

## Working Files

Generate all intermediate artefacts into

engineering/

└── MAP_V2/

    └── 02_Output/

        └── Prompt_Generation/

            └── Batch_<ID>/

                (one folder per prompt)

---

## Promotion

Do NOT overwrite production prompts.

Await explicit user approval.

Only after approval shall the generated prompts replace the corresponding production prompts located within

engineering/

└── MAP_V2/

    └── 01_Prompts/

        └── Workstream_<ID>_<Name>/

---

## Single Source of Truth

At any time there shall be only one approved production version of each MAP implementation prompt.

---

# Architecture References

Read and use as engineering references.

engineering/

└── MAP_V2/

    └── 00_Architecture/

Read

* 00_Master_Roadmap.md
* 01_Product_Architecture.md
* 02_Portal_Architecture.md
* 03_Backend_Architecture.md
* 04_API_Architecture.md
* 07_Reporting_Architecture.md
* 11_Development_Standards.md

These documents define the enterprise architecture and shall take precedence over assumptions.

---

# Existing Prompt Library

Read and use the existing MAP production prompt library as the authoritative engineering source.

engineering/

└── MAP_V2/

    └── 01_Prompts/

Review all completed prompts within the relevant workstreams.

Reuse existing engineering patterns.

Do not duplicate functionality already implemented by earlier prompts.

The production prompt library is the single source of truth.

---

# Generation Process

## Phase 1 — Load Architecture

Read all 7 architecture documents.

Analyse:

* Enterprise roadmap
* Product architecture
* Portal architecture
* Backend architecture
* API architecture
* Reporting architecture
* Development standards

Determine architectural constraints.

---

## Phase 2 — Load Prompt Library

Read all existing prompts.

Analyse:

* Completed prompts
* Prompt dependencies
* Existing frameworks
* Existing widgets
* Existing portals
* Existing services
* Existing reusable components

Identify functionality that already exists.

---

## Phase 3 — Parse User Parameters

Read the user-provided batch configuration.

For each prompt in the batch:

* Extract Prompt ID
* Extract Prompt Name
* Extract Workstream
* Extract Version

Validate:

* Prompt ID is numeric
* Prompt ID does not conflict with existing prompts
* Prompt Name is descriptive
* Workstream is valid

---

## Phase 4 — Auto-Determine Dependencies

For each prompt in the batch, using:

* Prompt ID
* Prompt Name
* Workstream
* Master Roadmap
* Existing prompts
* Architecture documents

Determine automatically:

* Previous Prompt (highest ID below batch start)
* Next Prompt (last ID in batch + 1)
* Required Frameworks (from architecture analysis)
* Portal Dependencies (from portal architecture)
* Shared Components (from existing prompts)
* Backend Dependencies (from backend architecture)

Do not hard-code dependencies.

Determine them from architecture and prompt library analysis.

---

## Phase 5 — Determine Functional Scope

For each prompt, using:

* Prompt ID
* Prompt Name
* Workstream
* Master Roadmap
* Existing prompts
* Architecture documents

Determine:

* Purpose
* Objectives
* Functional scope
* Architecture requirements
* Components
* Folder Structure
* UI requirements
* Backend dependencies
* Framework reuse
* Deliverables
* Acceptance Criteria

Do not invent functionality that conflicts with MAP architecture.

---

## Phase 6 — Generate Prompts

Only after completing analysis.

Generate all prompts in the batch.

Each generated prompt must include:

* Metadata
* Prerequisites
* Purpose
* Objective
* Architecture
* Functional Requirements
* Folder Structure
* Components
* Configuration
* Integration Requirements
* Responsive Behaviour
* Accessibility
* Deliverables
* Implementation Report
* Acceptance Criteria
* Next Prompt

Each generated prompt must:

* Follow MAP prompt structure.
* Match existing production prompt quality.
* Be implementation ready.
* Contain all required sections.

Do not:

* Summarise.
* Remove requirements.
* Skip sections.
* Produce partial prompts.

---

## Phase 7 — Engineering Validation

For each prompt, validate:

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

✓ Prompt 007 widgets reused

✓ No conflicts with existing prompts

---

## Phase 8 — Generate Engineering Reports

For each prompt, generate:

* Generation_Report.md
* Generation_Change_Log.md
* Dependency_Report.md
* Framework_Reuse_Report.md

Total: 4 reports × number of prompts in batch

---

## Phase 9 — Engineering Review

After generation:

STOP.

Do not promote automatically.

Present:

* Generated prompts
* Validation results
* Reports

Await explicit user approval.

No production changes shall occur before approval.

---

## Phase 10 — Promotion

After approval:

Promote each prompt from

02_Output/Prompt_Generation/Batch_<ID>/

↓

01_Prompts/Workstream_<WS_ID>_<WS_Name>/

Generate:

Promotion_Report.md

Include:

* Source location
* Destination location
* Approval confirmation
* Final production status

---

# Output Structure

## Per Prompt

```
engineering/MAP_V2/02_Output/Prompt_Generation/Batch_<ID>/
├── <ID>_<Prompt_Name>.md
├── Generation_Report.md
├── Generation_Change_Log.md
├── Dependency_Report.md
└── Framework_Reuse_Report.md
```

## After Promotion

```
engineering/MAP_V2/01_Prompts/Workstream_<WS_ID>_<WS_Name>/
├── <ID>_<Prompt_Name>.md
├── <ID+1>_<Prompt_Name>.md
├── ...
```

---

# Prompt Structure Template

Each generated prompt shall follow this structure:

```markdown
MAP Nexus™ Enterprise Platform
Prompt <ID>
<Prompt Name>

Version: <Version>

Prompt ID: <ID>

Workstream: <WS_ID> — <WS_Name>

Status: Draft — Pending Review

---

Prerequisites

Complete

<list of required prompts from dependency analysis>

---

Purpose

<Determined from Prompt Name + Architecture analysis>

---

Objective

<Determined from functional scope analysis>

---

Design Principles

<From Development Standards>

---

Architecture

<From architecture analysis>

---

Folder Structure

Create

<From folder structure rules>

---

Components

Create the following components:

<list from functional scope analysis>

---

Configuration

<From architecture analysis>

---

Integration Requirements

<From portal and widget analysis>

---

Responsive Behaviour

Support

Desktop

Tablet

Mobile

---

Accessibility

Support

WCAG AA

Keyboard Navigation

Screen Readers

ARIA Labels

High Contrast

---

Deliverables

Generate

<list of deliverables>

---

Acceptance Criteria

✓ <from functional scope>

✓ <from architecture>

✓ <from development standards>

---

Next Prompt

Prompt <Next_ID> — <Next_Name>
```

---

# Validation Checklist

For each prompt, validate:

✓ Prompt numbering correct

✓ Prompt metadata correct

✓ Workstream correct

✓ Folder references correct

✓ Input locations correct

✓ Output locations correct

✓ Architecture consistent

✓ Existing frameworks reused

✓ No duplication

✓ No provider lock-in (for applicable workstreams)

✓ Enterprise standards followed

✓ Ready for implementation

---

# Success Criteria

The framework execution is complete when:

✓ Architecture has been analysed

✓ Existing prompts have been reviewed

✓ Dependencies have been determined

✓ Functional scope has been identified for all prompts

✓ All prompts in batch have been generated

✓ Validation has completed for all prompts

✓ Engineering reports have been produced

✓ User review has been completed

✓ Approval has been received before promotion

✓ One authoritative production prompt exists for each ID

---

# Example Usage

## Workstream 05 — Workflow & Administration

### User Provides

```
| Parameter | Value |
|-----------|-------|
| Workstream | 05 — Workflow & Administration |
| Version | 5.0 |

| Prompt ID | Prompt Name |
|-----------|-------------|
| 031 | Create User Management |
| 032 | Create Role Management |
| 033 | Create Tenant Management |
| 034 | Create Subscriptions |
| 035 | Create System Settings |
```

### Framework Auto-Determines

- Previous Prompt: 030
- Next Prompt: 036
- Dependencies: Prompt 005, Prompt 015
- Architecture: Backend Architecture
- Portals: Administration Portal
- Widgets: Reuse Prompt 007

### Output

```
Batch_031/ → 031_Create_User_Management.md + 4 reports
Batch_032/ → 032_Create_Role_Management.md + 4 reports
Batch_033/ → 033_Create_Tenant_Management.md + 4 reports
Batch_034/ → 034_Create_Subscriptions.md + 4 reports
Batch_035/ → 035_Create_System_Settings.md + 4 reports
```

---

# End of Framework
