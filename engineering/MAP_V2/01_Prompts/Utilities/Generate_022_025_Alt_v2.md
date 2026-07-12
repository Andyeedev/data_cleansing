# MAP Nexus™ Enterprise Platform

# Prompt Generation Framework

## Generate Enterprise Implementation Prompts (Batch 022-025)

**Version:** 2.0

**Status:** Draft — Pending Review

**Category:** Prompt Engineering Utility

---

# Purpose

Generate a complete batch of MAP Nexus™ enterprise implementation prompts (022-025) that conform to MAP Prompt Engineering Standards.

The generated prompts shall become production-ready engineering specifications suitable for direct implementation.

The generated prompts shall not be abbreviated, summarised or simplified.

---

# Objective

Generate four complete implementation prompts that are fully aligned with the MAP Enterprise Architecture, existing implementation prompts and engineering standards.

The generated prompts shall:

* Reuse existing frameworks wherever possible.
* Avoid duplication.
* Preserve architectural consistency.
* Remain metadata-driven.
* Produce production-ready implementation specifications.

---

# Batch Configuration

## Prompt 022

| Field | Value |
|-------|-------|
| Prompt ID | 022 |
| Prompt Name | Create AI Assistant |
| Workstream | 04 — AI Platform |
| Version | 5.0 |

---

## Prompt 023

| Field | Value |
|-------|-------|
| Prompt ID | 023 |
| Prompt Name | Create AI Insights |
| Workstream | 04 — AI Platform |
| Version | 5.0 |

---

## Prompt 024

| Field | Value |
|-------|-------|
| Prompt ID | 024 |
| Prompt Name | Create AI Recommendations |
| Workstream | 04 — AI Platform |
| Version | 5.0 |

---

## Prompt 025

| Field | Value |
|-------|-------|
| Prompt ID | 025 |
| Prompt Name | Create AI Report Generator |
| Workstream | 04 — AI Platform |
| Version | 5.0 |

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

            ├── Batch_022/

            ├── Batch_023/

            ├── Batch_024/

            └── Batch_025/

---

## Promotion

Do NOT overwrite production prompts.

Await explicit user approval.

Only after approval shall the generated prompts replace the corresponding production prompts located within

engineering/

└── MAP_V2/

    └── 01_Prompts/

        └── Workstream_04_AI_Platform/

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

# Mandatory Prompt Dependencies

Review and reuse where appropriate.

## Mandatory

| Prompt | Name | Status |
|--------|------|--------|
| Prompt 007 | Create Widget Framework | Completed |
| Prompt 021 | Create AI Framework | Treat as completed |

Prompt 022 shall build directly upon Prompt 021.

It shall not duplicate Prompt 021 functionality.

---

# Prompt-Specific Configuration

## Prompt 022 — Create AI Assistant

### Purpose

Create the enterprise AI Assistant for MAP Nexus™.

The AI Assistant provides a provider-independent conversational interface across every MAP portal.

It shall leverage the AI Framework created in Prompt 021.

### Constraints

The AI Assistant shall not implement any AI provider.

* No Azure OpenAI implementation.
* No OpenAI implementation.
* No Claude implementation.
* No Gemini implementation.
* No Ollama implementation.

Provider selection remains the responsibility of Prompt 021.

### Functional Scope

* Enterprise AI Assistant architecture
* Conversation framework
* Conversation UI
* Conversation history
* Context management
* Prompt routing
* Suggested prompts
* Portal awareness
* Role awareness
* Tenant awareness
* Session management
* Widget integration
* AI Assistant panels
* Command execution framework
* Future workflow invocation
* Citation framework
* Conversation audit
* AI usage statistics
* Security model
* Accessibility
* Responsive behaviour
* Future integrations

### Portal Integration

* Executive Portal
* Operations Portal
* Migration Portal
* Governance Portal
* Reporting Portal
* Security Portal
* Administration Portal

### Widget Integration

Reuse Prompt 007.

* AI Conversation Widget
* AI Suggestion Widget
* AI Insight Widget
* AI Recommendation Widget
* AI Status Widget
* AI Notification Widget

### Provider Independence

All requests must pass through

AI Framework → Provider Adapter → Configured Provider

Support without modification:

* Azure OpenAI
* OpenAI
* Claude
* Gemini
* Ollama
* LM Studio
* Future Providers

---

## Prompt 023 — Create AI Insights

### Purpose

Create the enterprise AI Insights engine for MAP Nexus™.

AI Insights provides intelligent analysis, pattern detection, and actionable insights across all MAP data sources.

It shall leverage the AI Framework created in Prompt 021.

### Constraints

The AI Insights engine shall not implement any AI provider.

Provider selection remains the responsibility of Prompt 021.

### Functional Scope

* AI Insights architecture
* Pattern detection framework
* Anomaly detection
* Trend analysis
* Predictive analytics
* Data correlation engine
* Insight generation framework
* Insight categorisation
* Insight prioritisation
* Insight delivery
* Dashboard integration
* Widget integration
* Historical insights
* Real-time insights
* Custom insight rules
* Insight audit
* AI usage statistics
* Security model
* Accessibility
* Responsive behaviour
* Future integrations

### Portal Integration

* Executive Portal
* Operations Portal
* Migration Portal
* Governance Portal
* Reporting Portal
* Security Portal
* Administration Portal

### Widget Integration

Reuse Prompt 007.

* AI Insight Widget
* AI Trend Widget
* AI Anomaly Widget
* AI Prediction Widget
* AI Summary Widget
* AI Notification Widget

---

## Prompt 024 — Create AI Recommendations

### Purpose

Create the enterprise AI Recommendations engine for MAP Nexus™.

AI Recommendations provides intelligent suggestions, best practices, and optimisation recommendations across all MAP workflows.

It shall leverage the AI Framework created in Prompt 021.

### Constraints

The AI Recommendations engine shall not implement any AI provider.

Provider selection remains the responsibility of Prompt 021.

### Functional Scope

* AI Recommendations architecture
* Recommendation engine framework
* Context-aware suggestions
* Best practice recommendations
* Workflow optimisation
* Resource optimisation
* Cost optimisation
* Performance recommendations
* Security recommendations
* Compliance recommendations
* Recommendation scoring
* Recommendation prioritisation
* Recommendation delivery
* Dashboard integration
* Widget integration
* Recommendation history
* Custom recommendation rules
* Recommendation audit
* AI usage statistics
* Security model
* Accessibility
* Responsive behaviour
* Future integrations

### Portal Integration

* Executive Portal
* Operations Portal
* Migration Portal
* Governance Portal
* Reporting Portal
* Security Portal
* Administration Portal

### Widget Integration

Reuse Prompt 007.

* AI Recommendation Widget
* AI Suggestion Widget
* AI Optimisation Widget
* AI Best Practice Widget
* AI Score Widget
* AI Notification Widget

---

## Prompt 025 — Create AI Report Generator

### Purpose

Create the enterprise AI Report Generator for MAP Nexus™.

AI Report Generator provides intelligent report creation, data summarisation, and automated narrative generation across all MAP data sources.

It shall leverage the AI Framework created in Prompt 021.

### Constraints

The AI Report Generator shall not implement any AI provider.

Provider selection remains the responsibility of Prompt 021.

### Functional Scope

* AI Report Generator architecture
* Report generation framework
* Data summarisation engine
* Narrative generation
* Chart and visualisation generation
* Template-based reports
* Custom report builder
* Report scheduling
* Report distribution
* Multi-format export
* Dashboard integration
* Widget integration
* Report history
* Report templates
* Custom report rules
* Report audit
* AI usage statistics
* Security model
* Accessibility
* Responsive behaviour
* Future integrations

### Portal Integration

* Executive Portal
* Operations Portal
* Migration Portal
* Governance Portal
* Reporting Portal
* Security Portal
* Administration Portal

### Widget Integration

Reuse Prompt 007.

* AI Report Widget
* AI Summary Widget
* AI Chart Widget
* AI Narrative Widget
* AI Template Widget
* AI Notification Widget

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

Read all existing prompts (000-021).

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

## Phase 3 — Analyse Batch Position

For each prompt (022-025), determine:

* Previous Prompt
* Next Prompt
* Workstream
* Architecture Layer
* Required Frameworks
* Portal Dependencies
* Shared Components
* Required Deliverables

Do not hard-code dependencies.

Determine them from architecture and prompt library analysis.

---

## Phase 4 — Determine Functional Scope

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

## Phase 5 — Generate Prompts

Only after completing analysis.

Generate all four MAP implementation prompts.

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

## Phase 6 — Engineering Validation

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

✓ Provider independence preserved

✓ Prompt 021 not duplicated

✓ Prompt 007 widgets reused

---

## Phase 7 — Generate Engineering Reports

For each prompt, generate:

* Generation_Report.md
* Generation_Change_Log.md
* Dependency_Report.md
* Framework_Reuse_Report.md

Total: 16 reports (4 per prompt × 4 prompts)

---

## Phase 8 — Engineering Review

After generation:

STOP.

Do not promote automatically.

Present:

* Generated prompts (4)
* Validation results
* Reports (16)

Await explicit user approval.

No production changes shall occur before approval.

---

## Phase 9 — Promotion

After approval:

Promote each prompt from

02_Output/Batch_<ID>/

↓

01_Prompts/Workstream_04_AI_Platform/

Generate:

Promotion_Report.md

Include:

* Source location
* Destination location
* Approval confirmation
* Final production status

---

# Output Structure

## Prompt 022

```
engineering/MAP_V2/02_Output/Prompt_Generation/Batch_022/
├── 022_Create_AI_Assistant.md
├── Generation_Report.md
├── Generation_Change_Log.md
├── Dependency_Report.md
└── Framework_Reuse_Report.md
```

## Prompt 023

```
engineering/MAP_V2/02_Output/Prompt_Generation/Batch_023/
├── 023_Create_AI_Insights.md
├── Generation_Report.md
├── Generation_Change_Log.md
├── Dependency_Report.md
└── Framework_Reuse_Report.md
```

## Prompt 024

```
engineering/MAP_V2/02_Output/Prompt_Generation/Batch_024/
├── 024_Create_AI_Recommendations.md
├── Generation_Report.md
├── Generation_Change_Log.md
├── Dependency_Report.md
└── Framework_Reuse_Report.md
```

## Prompt 025

```
engineering/MAP_V2/02_Output/Prompt_Generation/Batch_025/
├── 025_Create_AI_Report_Generator.md
├── Generation_Report.md
├── Generation_Change_Log.md
├── Dependency_Report.md
└── Framework_Reuse_Report.md
```

---

# Folder Structure

Each generated prompt shall include a complete folder structure consistent with MAP standards.

Include

* components
* hooks
* services
* types
* config
* widgets
* (prompt-specific directories)
* README

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

✓ Prompt 021 reused

✓ Prompt 007 reused

✓ No provider lock-in

✓ No duplicated functionality

✓ Existing frameworks reused

✓ Enterprise standards followed

✓ Ready for implementation

---

# Success Criteria

The framework execution is complete when:

✓ Architecture has been analysed

✓ Existing prompts have been reviewed

✓ Dependencies have been determined

✓ Functional scope has been identified for all 4 prompts

✓ All 4 production prompts have been generated

✓ Validation has completed for all prompts

✓ 16 engineering reports have been produced

✓ User review has been completed

✓ Approval has been received before promotion

✓ One authoritative production prompt exists for each ID

---

# End of Framework
