
File locations: 

1) prompt 18 - research\Packaging_our_Company\ver2\00_prompts\batch_prompt_18_MAP_Demonstration_Dashboard_Generation.md

2) output  - research\Packaging_our_Company\ver2\02_output


Objective

Execute the existing MAP solution end-to-end using representative demonstration data and automatically generate executive-quality outputs suitable for:

Microsoft Founders Hub
Investor presentations
Website
Product screenshots
Future MAP UI
Sales demonstrations

The objective is NOT to build the production UI.

The objective is to generate realistic executive dashboards from the existing processing engine.

Source

Use the existing MAP solution exactly as implemented.

Do not modify validation logic.

Do not modify business rules.

Do not modify reconciliation logic.

Do not create synthetic calculations.

Use actual outputs produced by the current MAP processing pipeline.

Execution

Run MAP using representative demonstration migration data.

Capture all outputs produced during execution.

Where multiple executions exist, choose the dataset that produces the richest demonstration.

Produce Executive Dashboard Dataset

From execution results automatically generate executive-level dashboard datasets.

Dashboard 1 — Executive Overview

Include

Migration Name

Migration Status

Overall Readiness %

Validation Score

Data Quality Score

Critical Issues

High Issues

Medium Issues

Low Issues

Records Processed

Records Passed

Records Failed

Recommendation

Example

Migration

Customer Core Banking

Status

READY FOR PILOT

Readiness

94%

Validation Score

97%

Critical Issues

0

High

2

Medium

6

Low

18

Recommendation

Proceed after resolving High priority findings
Dashboard 2 — Migration Overview

Include

Source Systems

Target Systems

Entities

Tables

Files

Validation Rules Executed

Execution Duration

Pipeline Status

Completion %

Dashboard 3 — Validation Results

Produce

Validation Summary

| Validation | Status |

Completeness

Integrity

Referential Integrity

Duplicates

Null Values

Business Rules

Transformation

Reconciliation

Audit

Each

PASS

WARNING

FAIL

Also generate

Validation distribution

PASS

WARNING

FAIL

Dashboard 4 — Executive Risk Dashboard

Generate

Overall Risk

Low

Medium

High

Critical

Top Risks

Mitigation Status

Go / No-Go Recommendation

Dashboard 5 — Migration Progress

Show

Planning

Discovery

Profiling

Mapping

Validation

Testing

Pilot

Production

Completed %

Dashboard 6 — Data Quality

Generate

Accuracy

Completeness

Consistency

Validity

Uniqueness

Integrity

Displayed as KPI cards.

Dashboard 7 — Issue Summary

Produce

Issue Type

Count

Severity

Owner

Status

Resolution %

Dashboard 8 — Executive KPIs

Generate

Total Records

Records Validated

Validation Coverage

Audit Coverage

Evidence Generated

Compliance Status

Migration Confidence Score

Visual Output

Generate outputs suitable for

PowerPoint

Figma

Canva

Microsoft Founders Hub

Investor Deck

Website

Each dashboard should be produced as

dashboard_dataset.json

dashboard.md

dashboard_description.md
Design Guidance

Use MAP Brand Kit.

Azure colours.

Professional enterprise appearance.

Microsoft Fluent style.

No dark theme.

White background.

Blue accent colours.

Large KPI cards.

Simple executive charts.

No developer terminology.

Charts

Generate data suitable for

Bar charts

Donut charts

Line charts

Risk matrix

Status cards

Progress bars

Executive KPIs

Intellectual Property

Never expose

Validation algorithms

Business rules

SQL

Internal logic

Source code

Decision trees

Prompt engineering

Only expose

Results

KPIs

Business outcomes

Executive metrics

Output Structure
18_MAP_Demo_Dashboard_Generation/

01_Execution_Output/

02_Dashboard_Data/

03_Executive_Dashboards/

04_Screenshot_Content/

05_Figma_Data/

06_PowerPoint_Data/

07_Canva_Data/

analysis/
Final Review

Confirm that:

Dashboard values originate from actual MAP execution.
No proprietary logic is disclosed.
Outputs are suitable for executive audiences.
All dashboards can be recreated later in the production UI.
Screens are suitable for Microsoft Founders Hub, investor presentations, website marketing, and product demonstrations.



1. PostgreSQL is available: Yes. Use the live PostgreSQL database and execute the complete MAP pipeline using actual processing rather than existing logs.

2. Demo Scenario: Use Scenario 3 (MIXTURE) as the primary demonstration dataset because it provides the richest and most representative enterprise migration outcomes, including successful validations, warnings, reconciliation issues and governance events suitable for executive dashboards.

3. Output Priority: Please generate outputs in the following order of priority:

JSON (master dataset for future UI, Figma, PowerPoint, Canva and React dashboards)
Markdown (human-readable documentation)
Dashboard Description (business explanation of each dashboard and its purpose)

Treat the JSON files as the authoritative source from which all future dashboard designs and product UI can be generated.

theme.json
{
  "brand": "MAP Nexus",
  "primaryColor": "#0078D4",
  "secondaryColor": "#1F4E79",
  "successColor": "#2E7D32",
  "warningColor": "#F9A825",
  "errorColor": "#C62828",
  "background": "#FFFFFF",
  "font": "Segoe UI",
  "chartStyle": "Microsoft Fluent"
} 




Dashboard Generation Standards (Permanent)

The generated demonstration dashboards are intended to represent the future MAP Nexus™ user experience for product demonstrations, Microsoft Founders Hub submissions, investor presentations, and marketing materials.

These standards are mandatory for every execution of this batch.

1. Screenshot Generation

Do not use Node.js, Puppeteer, Playwright, Selenium, or any screenshot automation framework.

Instead:

Generate the complete HTML dashboard.
Include a document named:
capture_screenshots.md

explaining how screenshots can be captured manually using Microsoft Edge or Google Chrome.

The guide should include:

opening index.html
browser zoom recommendations
full-screen mode
suggested browser size
recommended screenshot filenames

Manual screenshots are the approved approach until the MAP web portal is available.

2. Offline Operation

The dashboard must operate entirely offline.

Do not require:

localhost
web server
Node.js
npm
Python server
Internet connectivity

Opening

index.html

via

file://

must work immediately.

3. Data Handling

Do not use:

fetch()

for the primary data source.

Instead:

embed all generated JSON directly into
dashboard.js

(or embedded JavaScript objects)

This ensures the dashboard works correctly under the browser's file:// security model.

Support for external JSON files may be included only as an optional future enhancement.

4. Chart Library

Use Chart.js.

Bundle

chart.min.js

locally inside the project.

Do not reference:

CDN
jsdelivr
unpkg
external Internet resources

The entire demonstration must be completely self-contained.

5. Landing Page

The dashboard must open to a professional landing page before displaying any reports.

The landing page should resemble a modern enterprise SaaS product.

Example layout:

MAP Nexus™

Migration Assurance Platform

Scenario
Financial Services Migration

Execution
Completed

Overall Readiness
96%

────────────────────────────

Executive Dashboard

Validation Dashboard

Migration Overview

Data Quality

Risk Assessment

Reports

Settings (optional)

About MAP

Each dashboard tile or button should open the corresponding dashboard without leaving the application.

6. Navigation

Provide consistent navigation across every page.

Include:

Home
Executive Dashboard
Migration Overview
Validation Results
Data Quality
Risk Assessment
Reports

The navigation should remain consistent throughout the demonstration.

7. Look and Feel

The interface should resemble a production enterprise SaaS application.

Use:

MAP Nexus V3 branding
Microsoft Fluent-inspired layout
responsive design
professional colour palette
modern cards
KPI panels
charts
tables
progress indicators
executive summary widgets

Avoid prototype or wireframe styling.

8. Dashboard Quality

Each dashboard should contain realistic enterprise information generated from the MAP execution results.

Generate:

KPI cards
charts
validation summaries
executive metrics
trend analysis
migration readiness indicators
risk summaries
drill-down tables

The dashboards should appear suitable for enterprise customer demonstrations.

9. Deliverables

Automatically generate:

dashboard_preview/

    index.html

    css/
        style.css

    js/
        dashboard.js
        chart.min.js

    assets/

    capture_screenshots.md

The dashboard must be immediately usable without any installation.

10. Future Compatibility

Design the dashboard architecture so that embedded JSON can later be replaced by:

REST APIs
PostgreSQL
Azure SQL
Azure App Services
Azure Static Web Apps

without requiring redesign of the interface.