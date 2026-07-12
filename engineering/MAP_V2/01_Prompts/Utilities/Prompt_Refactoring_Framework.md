# MAP Nexus™ Enterprise Platform

# Prompt Refactoring Framework

## Merge & Modernise Existing Prompt

**Version:** 1.0

**Framework ID:** PRF-001

**Category:** Engineering Utilities

**Status:** Approved

---

# Purpose

This framework provides a controlled engineering process for modernising existing MAP prompts without introducing regressions.

It shall be used whenever an existing prompt requires:

- Metadata updates
- Workstream updates
- Folder structure updates
- Architecture alignment
- New enterprise capabilities
- Cross-prompt reference updates

while preserving all approved engineering functionality.

This framework produces a single new canonical version of the prompt.

---

# Framework Objectives

This framework shall:

- Preserve all approved engineering requirements
- Prevent prompt drift
- Prevent accidental feature removal
- Prevent architecture regression
- Maintain prompt numbering
- Maintain workstream consistency
- Produce one authoritative version of the prompt

---

# Execution Parameters

Populate these values before execution.

## Source Prompt

Example

engineering/

└── MAP_V2/

&nbsp;&nbsp;&nbsp;&nbsp;└── 00_Prompts/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Workstream_03_Presentation_Engine/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;020_Create_Report_Distribution.md

---

## Output Folder

engineering/

└── MAP_V2/

&nbsp;&nbsp;&nbsp;&nbsp;└── 01_Output/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Prompt_Refactoring/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Batch_020/

---

## Output Prompt

Example

020_Create_Report_Distribution_v5.md

---

## Workstream

Example

Workstream_03_Presentation_Engine

---

## New Version

Example

Version 5.0

---

# Phase 1 — Read

Read the source prompt in its entirety.

Treat it as the only authoritative source.

Do not infer missing requirements.

Do not recreate the prompt from memory.

---

# Phase 2 — Analyse

Determine:

- Existing functionality
- Existing architecture
- Existing folder structure
- Existing deliverables
- Existing dependencies
- Existing future integrations
- Existing acceptance criteria
- Existing engineering standards
- Existing cross-prompt references

Document findings.

---

# Phase 3 — Preserve

Preserve all approved engineering behaviour.

The following MUST NOT be removed unless explicitly superseded.

- Functional requirements
- Deliverables
- Acceptance Criteria
- Architecture
- Engineering standards
- Examples
- Folder structures
- Dependencies
- Future integrations

---

# Phase 4 — Modernise Metadata

Update where required:

- Prompt Version
- Workstream Name
- Folder References
- Prompt References
- Architecture References
- Documentation References
- Output Locations
- Naming Conventions

Do not alter engineering behaviour.

---

# Phase 5 — Expand

Integrate newly approved enterprise capabilities.

Examples include:

## Download Formats

Add support for:

- HTML
- PDF
- Excel
- CSV
- JSON
- XML
- DOCX
- PPTX
- PNG
- ZIP
- Print

---

## Distribution Channels

Expand support for:

- Download Centre
- Email
- Microsoft Teams
- SharePoint
- OneDrive
- Azure Blob Storage
- Azure Data Lake
- REST API
- Webhooks
- FTP
- SFTP
- Secure Portal
- Azure Service Bus
- Event Grid
---

## Export Engine

Integrate support for:

- Export Profiles
- Output Profiles
- Packaging
- Compression
- Encryption
- Digital Signing
- Watermarking
- Versioning
- Download Tokens
- Secure Links
- Expiry Policies
- Delivery Policies
- Retention Policies
---

## Statistics

Expand reporting metrics.

Examples

- Downloads by Format
- Downloads by Channel
- Most Downloaded Reports
- Most Used Export Format
- Distribution Success Rate
- Delivery Performance
- Top Distribution Channels
- Top Delivery Profiles
- Average Download Time
- Average Package Size

---

## Future Integration

Replace obsolete references where applicable.

Example

Replace

- Presentation Engine
- Export Engine
- Document Generation Engine
- Microsoft Graph
- SharePoint
- OneDrive
- Azure Storage
- Notification Engine

---

# Phase 6 — Review

Review the merged prompt against:

Prompt 007 — Widget Framework

Prompt 016

Prompt 017

Prompt 018

Prompt 019

Prompt 021

Development Standards

Product Architecture

Portal Architecture

Workstream Architecture

Ensure complete consistency.

---

# Phase 7 — Validation

Validate:

✓ Prompt numbering correct

✓ Version updated

✓ Folder references correct

✓ Workstream references correct

✓ Metadata updated

✓ Existing functionality preserved

✓ Existing architecture preserved

✓ Deliverables preserved

✓ Acceptance Criteria preserved

✓ New capabilities integrated

✓ No duplicate requirements introduced

✓ No obsolete references remain

✓ Markdown formatting correct

---

# Phase 8 — Change Classification

For every modification classify as one of:

- Metadata Update
- Architecture Update
- Requirement Expansion
- Reference Update
- Correction
- Removal
- No Functional Change

---

# Phase 9 — Output

Produce:

Merged Prompt

Merge Report

Change Log

Validation Report

---

## Output Files

Generate

- <PromptName>_vX.md
- Merge_Report.md
- Change_Log.md
- Validation_Report.md

inside the configured Output Folder.

---

# Single Source of Truth

The merged prompt becomes the new authoritative version.

After successful review:

<PromptName>_vX.md

shall replace

<PromptName>.md

There shall only ever be one production version of the prompt.

---

# Do NOT

Do NOT:

- Rewrite the prompt from scratch
- Reorder sections unnecessarily
- Remove approved requirements
- Rename prompts
- Invent new workstreams
- Change prompt numbering
- Change functional intent
- Reduce engineering scope
- Remove examples unless superseded
- Simplify acceptance criteria
- Introduce unapproved functionality
- Change architecture terminology

---

# Success Criteria

The refactoring is complete when:

✓ Existing prompt fully analysed

✓ Existing requirements preserved

✓ Existing architecture preserved

✓ Metadata modernised

✓ New capabilities integrated

✓ Cross-prompt references updated

✓ Merge report generated

✓ Change log generated

✓ Validation report generated

✓ New canonical prompt produced

✓ No engineering regressions introduced

---

# Deliverables

Generate

- Updated Prompt
- Merge Report
- Change Log
- Validation Report
- Distribution Documentation
- Export Documentation
- Channel Documentation
---

# Overall Result

Display:

Prompt Successfully Modernised

Ready to replace production prompt.

---


Phase 10 — Human Approval
The refactored prompt SHALL NOT replace the production prompt automatically.

The engineer shall review:

✓ Merge_Report.md

✓ Change_Log.md

✓ Validation_Report.md

✓ 020_Create_Report_Distribution_v5.md

Only after approval shall

020_Create_Report_Distribution_v5.md

replace

020_Create_Report_Distribution.md

The superseded version may then be archived or deleted according to repository standards.


**End of Prompt Refactoring Framework**