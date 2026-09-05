# MAP Nexus™ Enterprise Platform

# Prompt Refactoring Final Review

## Engineering QA Verification & Approval Gate

**Version:** 1.0

**Framework ID:** PRF-002

**Status:** Approved

---

# Purpose

Perform a final engineering quality review of a refactored MAP prompt before it is promoted to production.

This framework performs a targeted verification only.

It shall preserve all approved engineering work while correcting any remaining omissions, duplicate content or outdated references.

No prompt shall be promoted until this review has completed successfully and explicit human approval has been granted.

---

# Inputs

## Prompt Refactoring Framework

engineering/

└── MAP_V2/

    └── 00_Prompts/

        └── Utilities/

            Prompt_Refactoring_Framework.md

---

## Refactored Prompt

Example

engineering/

└── MAP_V2/

    └── 00_Prompts/

        └── Workstream_03_Presentation_Engine/

            020_Create_Report_Distribution_v5.md

---

# Objective

Review both files.

Cross-reference them.

Correct only approved engineering improvements.

Do not introduce new functionality.

Do not rewrite the prompt.

Do not change the engineering intent.

---

# Mandatory Rules

The review SHALL

✓ Preserve all approved requirements

✓ Preserve all architecture

✓ Preserve prompt numbering

✓ Preserve workstream numbering

✓ Preserve section ordering

✓ Preserve engineering intent

✓ Preserve existing functionality

---

# Do NOT

Do NOT

• Rewrite the prompt

• Reorganise sections

• Simplify engineering requirements

• Rename prompts

• Renumber prompts

• Invent new workstreams

• Remove approved requirements

• Reduce engineering scope

• Modify functional intent

• Change wording unnecessarily

---

# Phase 1 — Cross Reference

Compare the refactored prompt against the Refactoring Framework.

Confirm all approved improvements have been applied.

---

# Phase 2 — Verify Required Improvements

Confirm the following exist.

## Future Integration

Remove obsolete references

• PDF Reporting Framework

• Excel Reporting Framework

Verify replacement references exist

• Presentation Engine

• Document Generation Engine

• Export Engine

• Microsoft Graph

• SharePoint

• Azure Storage

• Notification Engine

---

## Export Engine

Verify support for

• Export Profiles

• Output Profiles

• Packaging

• Compression

• Encryption

• Digital Signing

• Watermarking

• Versioning

• Download Tokens

• Secure Links

• Expiry Policies

• Delivery Policies

• Retention Policies

---

## Statistics

Verify

• Downloads by Format

• Downloads by Channel

• Most Downloaded Reports

• Most Used Export Format

• Delivery Success Rate

• Delivery Performance

• Top Distribution Channels

• Top Delivery Profiles

• Average Download Time

• Average Package Size

---

## Folder Structure

Verify

services/

config/

utils/

exist where appropriate.

---

## Distribution Channels

Verify

• Email

• Microsoft Teams

• SharePoint

• OneDrive

• Azure Blob Storage

• Azure Data Lake

• REST API

• Webhook

• FTP

• SFTP

• Azure Service Bus

• Event Grid

---

## Distribution Profiles

Verify

• Executive Distribution

• Governance Distribution

• Audit Distribution

• Customer Distribution

• Internal Distribution

• Scheduled Distribution

• Ad-hoc Distribution

• Subscription Distribution

---

## Deliverables

Verify documentation includes

• Distribution Documentation

• Export Documentation

• Channel Documentation

---

## Acceptance Criteria

Verify the following exist

✓ Download formats integrated

✓ Export profiles created

✓ Distribution statistics expanded

✓ Future Presentation Engine ready

---

# Phase 3 — Duplicate Detection

Identify

Duplicate headings

Duplicate requirements

Duplicate deliverables

Duplicate acceptance criteria

Duplicate future integrations

Remove duplicates only.

Do not remove valid requirements.

---

# Phase 4 — Consistency Review

Verify consistency with

Prompt 007

Prompt 016

Prompt 017

Prompt 018

Prompt 019

Prompt 021

Development Standards

Portal Architecture

Presentation Engine Architecture

---

# Phase 5 — Validation

Validate

✓ Prompt numbering correct

✓ Metadata correct

✓ Folder references correct

✓ Workstream references correct

✓ Existing functionality preserved

✓ Existing architecture preserved

✓ Approved improvements integrated

✓ No duplicate requirements remain

✓ No obsolete references remain

✓ Markdown formatting correct

---

# Phase 6 — Produce

Generate

Final_Review_Report.md

Merge_Validation_Report.md

Change_Log.md

Engineering_Summary.md

inside

engineering/

└── MAP_V2/

    └── 01_Output/

        └── Prompt_Refactoring/

            └── Final_Review/

---

# Phase 7 — Executive Summary

Display

Summary of improvements verified

Corrections applied

Duplicates removed

Outstanding issues

Overall engineering assessment

---

# Phase 8 — Approval Gate

DO NOT replace the production prompt automatically.

Display

FINAL REVIEW COMPLETE

Awaiting engineering approval.

Prompt ready for promotion.

Wait for explicit instruction before replacing

020_Create_Report_Distribution.md

with

020_Create_Report_Distribution_v5.md

No further actions shall be performed until approval is received.

---

# Success Criteria

✓ Refactoring verified

✓ Improvements confirmed

✓ Duplicates removed

✓ No engineering regressions

✓ Architecture preserved

✓ Validation completed

✓ Reports generated

✓ Awaiting engineering approval

---

**End of Prompt Refactoring Final Review**