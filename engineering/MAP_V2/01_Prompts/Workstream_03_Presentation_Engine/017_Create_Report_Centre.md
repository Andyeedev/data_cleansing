MAP Nexus™ Enterprise Platform
Prompt 017
Create Report Centre

Version: 4.1

Prompt ID: 017

Workstream: 03 — Reporting & Presentation Engine

Status: Approved

Prerequisites

Complete

Workstream 01 — Platform Foundation
Prompt 000 — Prepare Development Environment
Prompt 001 — Create React Enterprise Solution
Prompt 002 — Create Enterprise Theme System
Prompt 003 — Create Enterprise Navigation System
Prompt 004 — Create Authentication Module
Prompt 005 — Create Enterprise Application Shell
Prompt 006 — Create Analytics & Dashboard Framework
Prompt 007 — Create Widget Framework
Workstream 02 — Portal Development
Prompt 008 — Create Portal Framework
Prompt 009 — Create Executive Portal
Prompt 010 — Create Operations Portal
Prompt 011 — Create Migration Portal
Prompt 012 — Create Governance Portal
Prompt 013 — Create Reporting Portal
Prompt 014 — Create Security Portal
Prompt 015 — Create Administration Portal
Workstream 03
Prompt 016 — Create HTML Reporting Framework
Purpose

Create the enterprise Report Centre for MAP Nexus™.

The Report Centre provides the single location from which users browse, execute, preview, organise and export every report within MAP.

This prompt creates only the presentation framework.

No report execution.

No APIs.

No backend integration.

No export implementation.

Objective

Create a reusable Report Centre capable of managing all enterprise reports.

The Report Centre shall become the reporting hub for every MAP module.

Folder Structure

Create

src/

reporting/

centre/

ReportCentre.tsx

ReportHome.tsx

ReportExplorer.tsx

RecentReports.tsx

FavouriteReports.tsx

ScheduledReports.tsx

SharedReports.tsx

MyReports.tsx

ReportTemplates.tsx

ReportCategories.tsx

ReportPreview.tsx

ReportHistory.tsx

ReportQueue.tsx

ReportSearch.tsx

ReportFilters.tsx

ReportDetails.tsx

ReportWorkspace.tsx

components/

widgets/

README.md
Navigation

Report Centre navigation shall include

Report Home

Recent Reports

My Reports

Shared Reports

Favourite Reports

Scheduled Reports

Templates

Categories

Report History

Report Queue

Preview

Search

Filters

Workspace
Report Home

Display placeholder widgets for

Total Reports
Recently Generated
Favourite Reports
Scheduled Reports
Pending Reports
Failed Reports
AI Recommendations
Report Explorer

Support browsing

Executive Reports
Migration Reports
Validation Reports
Governance Reports
Risk Reports
Security Reports
Administration Reports
Audit Reports
AI Reports
Report Categories

Support

Executive

Migration

Validation

Governance

Risk

Security

Administration

Audit

AI
Report Search

Prepare placeholders for

Global Search
Saved Searches
Search Suggestions
Tags
Metadata
Report Filters

Support

Date
Category
Status
Owner
Project
Type
Favourite
Scheduled
Report Preview

Create reusable preview container.

Support

HTML Preview
Cover Page
Table of Contents
Report Sections
Navigation

No rendering implementation.

Report Queue

Prepare placeholders for

Running Reports
Pending Reports
Failed Reports
Completed Reports
Report History

Prepare placeholders for

Generation History
Download History
Execution Logs
Audit History
Report Workspace

Create an enterprise workspace allowing users to

Browse Reports
Preview Reports
Organise Reports
Export Reports (placeholder)
Share Reports (placeholder)
Widget Usage

Construct the Report Centre entirely using Prompt 007 widgets.

Examples

KPI Widget
Status Widget
Grid Widget
Table Widget
Timeline Widget
AI Summary Widget
Notification Widget
Theme Integration

Reuse Prompt 002 Theme System.

Automatically inherit

Typography
Colours
Icons
Branding
Layout
Future Integration

Prepare integration with

HTML Reporting Framework
PDF Reporting Engine
Excel Reporting Engine
Presentation Engine
AI Engine
Backend APIs

No implementation.

Responsive Behaviour

Support

Desktop
Tablet
Mobile
Accessibility

Support

WCAG AA
Keyboard Navigation
Screen Readers
ARIA Labels
High Contrast
Deliverables

Generate

Report Centre
Report Explorer
Report Workspace
Report Preview
Report Search
Report Queue
Documentation
Produce

Create

017_Create_Report_Centre_Report.md

Include

Pages Created
Widgets Used
Navigation Structure
Report Modules
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 018
Acceptance Criteria

✓ Report Centre operational

✓ Report Explorer created

✓ Report Workspace created

✓ Report Preview created

✓ Widget Framework integrated

✓ HTML Reporting Framework integrated

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 018

Next Prompt

Prompt 018 — Create Report Viewer
