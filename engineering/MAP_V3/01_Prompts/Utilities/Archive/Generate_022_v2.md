# MAP Nexus™ Enterprise Platform

# Prompt Generation Framework

## Generate Enterprise Implementation Prompt

**Version:** 2.0

**Status:** Approved

**Category:** Prompt Engineering Utility

---

# Purpose

Generate a complete MAP Nexus™ enterprise implementation prompt that conforms to the MAP Prompt Engineering Standards.

The generated prompt shall become a production-ready engineering specification suitable for direct implementation.

The generated prompt shall not be abbreviated, summarised or simplified.

---

# Objective

Generate a complete implementation prompt that is fully aligned with the MAP Enterprise Architecture, existing implementation prompts and engineering standards.

The generated prompt shall:

* Reuse existing frameworks wherever possible.
* Avoid duplication.
* Preserve architectural consistency.
* Remain metadata-driven.
* Produce a production-ready implementation specification.

---

# Input Parameters

Generate the prompt using the following parameters.

**Prompt ID**

022

**Prompt Name**

Create AI Assistant

**Workstream**

04 — AI Platform

**Version**

5.0

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

            └── Batch_022/

---

## Promotion

Do NOT overwrite production prompts.

Await explicit user approval.

Only after approval shall the generated prompt replace the corresponding production prompt located within

engineering/

└── MAP_V2/

    └── 01_Prompts/

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

Mandatory

Prompt 007 — Create Widget Framework

Prompt 021 — Create AI Framework

Treat Prompt 021 as completed.

Prompt 022 shall build directly upon Prompt 021.

It shall not duplicate Prompt 021 functionality.

---

# Purpose of Prompt 022

Create the enterprise AI Assistant for MAP Nexus™.

The AI Assistant provides a provider-independent conversational interface across every MAP portal.

It shall leverage the AI Framework created in Prompt 021.

The AI Assistant shall not implement any AI provider.

No Azure OpenAI implementation.

No OpenAI implementation.

No Claude implementation.

No Gemini implementation.

No Ollama implementation.

Provider selection remains the responsibility of Prompt 021.

---

# Functional Scope

Generate a complete implementation prompt covering, at minimum,

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

---

# Portal Integration

The AI Assistant shall integrate with

* Executive Portal
* Operations Portal
* Migration Portal
* Governance Portal
* Reporting Portal
* Security Portal
* Administration Portal

The assistant shall automatically understand which portal the user is currently working within.

---

# Widget Integration

Reuse Prompt 007.

Support

* AI Conversation Widget
* AI Suggestion Widget
* AI Insight Widget
* AI Recommendation Widget
* AI Status Widget
* AI Notification Widget

No duplicated widget logic.

---

# Provider Independence

The prompt shall explicitly state that the assistant never communicates directly with an LLM.

All requests must pass through

AI Framework

↓

Provider Adapter

↓

Configured Provider

The generated prompt shall support

* Azure OpenAI
* OpenAI
* Claude
* Gemini
* Ollama
* LM Studio
* Future Providers

without modification.

---

# Folder Structure

Generate a complete folder structure consistent with MAP standards.

Include

* components
* hooks
* services
* types
* config
* widgets
* conversation
* history
* context
* audit
* security
* README

---

# Deliverables

Generate all sections normally used by MAP implementation prompts.

Include

* Metadata
* Prerequisites
* Purpose
* Objective
* Folder Structure
* Architecture
* Components
* Configuration
* Responsive Behaviour
* Accessibility
* Deliverables
* Report
* Acceptance Criteria
* Next Prompt

---

# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/

└── MAP_V2/

    └── 02_Output/

        └── Prompt_Generation/

            └── Batch_022/

Generate

* 022_Create_AI_Assistant.md
* Generation_Report.md
* Generation_Change_Log.md

Do not overwrite the production prompt.

---

# Production Destination

After engineering review and explicit user approval,

022_Create_AI_Assistant.md

shall replace the production prompt located at

engineering/

└── MAP_V2/

    └── 01_Prompts/

        └── Workstream_04_AI_Platform/

There shall only ever be one approved production version of the prompt.

---

# Output Requirements

Produce

022_Create_AI_Assistant.md

Generate the prompt in full.

Do not summarise.

Do not truncate.

Do not omit sections.

Produce one complete production-ready implementation prompt.

Also generate

Generation_Report.md

containing

* Architecture reviewed
* Prompt dependencies
* Existing functionality reused
* New functionality introduced
* Validation results
* Overall readiness

Generate

Generation_Change_Log.md

listing every modification introduced while generating the prompt.

---

# Validation

Validate

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

The prompt is complete when

✓ A complete production-ready implementation prompt has been generated

✓ Existing MAP architecture has been reused

✓ Existing prompt functionality has not been duplicated

✓ Enterprise standards have been followed

✓ Provider independence has been preserved

✓ Working artefacts have been generated into the engineering output location

✓ The prompt is ready for engineering review

✓ The prompt is ready for approval before promotion to the production prompt library
