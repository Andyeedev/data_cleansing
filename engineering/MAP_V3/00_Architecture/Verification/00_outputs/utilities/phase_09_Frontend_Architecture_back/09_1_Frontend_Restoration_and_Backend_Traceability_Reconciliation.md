Phase 09.1 — Frontend Restoration & Backend Traceability Reconciliation
Objective

Use the work already completed in Phase 08 and Phase 09 as the authoritative baseline. Do not recreate discovery work. Extend it only where required.

1. Load Existing Architecture

Read and use as the baseline:

engineering/MAP_V2/00_Architecture/Verification/Phase_08/

including:

Capability Matrix
Repository Discovery
Business Capability Mapping
Runtime Verification
Table Inventory
Evidence Package

Also load:

engineering/MAP_V2/00_Architecture/Verification/00_outputs/utilities/phase_09_Frontend_Architecture/

especially:

09A_Platform_Foundation_Output.md
09_Frontend_Restoration_Traceability_Matrix.md
09_Restoration_Plan.md
09_Final_Compliance_Report.md

Treat these as authoritative.

2. Reconcile Against the Correct Frozen Frontend

Use ONLY this frontend:

MAP_V2/03_Source/frontend/

NOT frontend-mvp.

Scan every:

page
component
widget
layout
dashboard
portal
login page
chart
navigation item

Map each one back to the existing Phase 08 capability matrix.

Classify each item as:

Already implemented
Restore
Enhanced in MVP
Deprecated
Future enhancement
3. Update Backend Traceability

Do not assume previous table mappings are still correct.

One known example:

engine.unified_scores

is no longer a valid production source.

It was replaced during Phase 08 implementation.

Unfortunately this change was never documented.

Your task is to investigate the code and determine:

the actual source view
how Risk Score is now produced
repositories
services
SQL
writers
API
runtime path

The affected area is:

Validation Reports
    → Risk Score

This uses a database view, not engine.unified_scores.

Update every document that references the old table.

Do not guess.

Trace the implementation from:

UI
→ API
→ Service
→ Repository
→ SQL
→ View
→ Source tables

4. Update Traceability Matrix

Add or verify:

Frozen UI Component
Business Capability
API
Service
Repository
SQL/View
Source Tables
MAP CLI Writer
Runtime Evidence
Decision
5. Deliverables

Update existing documents rather than creating duplicates.

Produce a summary of:

incorrect mappings found
corrected backend sources
updated views/tables
documents modified
recommendations