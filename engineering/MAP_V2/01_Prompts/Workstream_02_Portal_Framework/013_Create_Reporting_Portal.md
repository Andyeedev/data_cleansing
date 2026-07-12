MAP Nexus™ Enterprise Platform
Prompt 013
Create Reporting Portal

Version: 4.1

Prompt ID: 013

Workstream: 02 — Portal Development

Status: Approved

Prerequisites

Complete:

Workstream 01 – Platform Foundation
Prompt 000 — Prepare Development Environment
Prompt 001 — Create React Enterprise Solution
Prompt 002 — Create Enterprise Theme System
Prompt 003 — Create Enterprise Navigation System
Prompt 004 — Create Authentication Module
Prompt 005 — Create Enterprise Application Shell
Prompt 006 — Create Analytics & Dashboard Framework
Prompt 007 — Create Widget Framework
Workstream 02 – Portal Development
Prompt 008 — Create Portal Framework
Prompt 009 — Create Executive Portal
Prompt 010 — Create Operations Portal
Prompt 011 — Create Migration Portal
Prompt 012 — Create Governance Portal
Purpose

Create the Reporting Portal for MAP Nexus™.

The Reporting Portal provides a single enterprise location for viewing, generating, scheduling, exporting and distributing all reports produced by MAP.

This prompt creates the reporting presentation framework only.

No backend implementation.

No report generation logic.

No APIs.

No database integration.

Objective

Create a reusable Reporting Portal capable of supporting:

Executive Reports
Operational Reports
Migration Reports
Validation Reports
Governance Reports
Audit Reports
Regulatory Reports
AI Reports

The portal shall leverage the Widget Framework created in Prompt 007.

Folder Structure

Create

src/

portals/

reporting/

ReportingPortal.tsx

ReportingOverview.tsx

ExecutiveReports.tsx

OperationalReports.tsx

MigrationReports.tsx

ValidationReports.tsx

GovernanceReports.tsx

AuditReports.tsx

RegulatoryReports.tsx

ScheduledReports.tsx

ReportTemplates.tsx

ReportDistribution.tsx

ReportingWorkspace.tsx

components/

widgets/
Navigation

Extend the Portal Framework.

Reporting navigation shall include

Reporting Overview

Executive Reports

Operational Reports

Migration Reports

Validation Reports

Governance Reports

Audit Reports

Regulatory Reports

Scheduled Reports

Templates

Distribution

Workspace

Each page initially displays placeholder widgets.

Reporting Overview

Create a dashboard displaying placeholder widgets for

Reports Generated
Scheduled Reports
Failed Reports
Pending Reports
Report Usage
Export Activity
AI Report Summary
Executive Reports

Create placeholder pages supporting

Executive Dashboard Report
Migration Health Report
Portfolio Summary
KPI Report
Board Pack
Operational Reports

Create placeholder pages supporting

Daily Operations
Validation Status
Execution Summary
Exception Summary
Operational Dashboard Report
Migration Reports

Create placeholder pages supporting

Migration Progress
Dataset Status
Completion Report
Migration Summary
Migration Metrics
Validation Reports

Create placeholder pages supporting

Rule Execution
Validation Summary
Failed Controls
Passed Controls
Validation Trends
Governance Reports

Create placeholder pages supporting

Compliance Report
Governance Summary
Policy Compliance
Control Effectiveness
Governance KPI
Audit Reports

Create placeholder pages supporting

Audit Pack
Audit Evidence
Audit Timeline
Audit Findings
Audit History
Regulatory Reports

Create placeholder pages supporting

Regulatory Submission
Compliance Filing
Data Governance Report
Risk Report
Regulatory Dashboard
Scheduled Reports

Create placeholder pages supporting

Scheduled Jobs
Upcoming Reports
Completed Reports
Failed Reports
Schedule Calendar
Report Templates

Create placeholder pages supporting

Standard Templates
Executive Templates
Audit Templates
Governance Templates
Custom Templates
Report Distribution

Create placeholder pages supporting

Email Distribution
Download Centre
Secure Sharing
Distribution History
Recipient Management
Reporting Workspace

Create the operational reporting workspace containing placeholder panels for

Report Explorer
Template Library
Recent Reports
Scheduled Reports
AI Recommendations
Notifications
Widget Usage

Construct every page using reusable widgets from Prompt 007.

Examples include

KPI Widget
Report Widget
Grid Widget
Timeline Widget
Notification Widget
Status Widget
AI Summary Widget

No page shall contain duplicated reporting code.

AI Integration

Prepare placeholder widgets for

AI Report Summary
Report Recommendations
Report Insights
Report Quality Analysis
Suggested Reports

No AI implementation.

Export Framework

Prepare placeholders supporting future export formats

PDF
HTML
Excel
CSV
JSON
PowerPoint
Word

No export implementation.

Responsive Behaviour

Support

Desktop
Tablet
Mobile

Layouts shall adapt using the Dashboard Framework.

Accessibility

Support

Keyboard Navigation
Screen Readers
WCAG AA
ARIA Labels
High Contrast
Deliverables

Generate

Reporting Portal
Reporting Navigation
Reporting Workspace
Report Library
Report Placeholder Pages
Documentation
Produce

Create

013_Create_Reporting_Portal_Report.md

Include

Pages Created
Widgets Used
Navigation Structure
Report Categories
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 014
Acceptance Criteria

✓ Reporting Portal operational

✓ Navigation complete

✓ Report Workspace created

✓ Widget Framework fully utilised

✓ Placeholder pages created

✓ Report categories established

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 014

Next Prompt

Prompt 014 — Create Administration Portal

The Administration Portal will become the operational control centre for MAP administrators, providing user management, tenant administration, security configuration, licensing, platform settings and system administration, while leveraging the Portal Framework, Dashboard Framework and Widget Framework established throughout Workstreams 01 and 02.