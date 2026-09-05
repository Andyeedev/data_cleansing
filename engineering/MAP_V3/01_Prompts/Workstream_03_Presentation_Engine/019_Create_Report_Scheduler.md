MAP Nexus™ Enterprise Platform
Prompt 019
Create Report Scheduler

Version: 4.1

Prompt ID: 019

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
Prompt 017 — Create Report Centre
Prompt 018 — Create Report Viewer
Purpose

Create the enterprise Report Scheduler for MAP Nexus™.

The Report Scheduler provides a reusable scheduling framework allowing reports to execute automatically according to configurable schedules.

This prompt creates only the presentation framework.

No scheduling engine.

No backend implementation.

No APIs.

No execution logic.

Objective

Develop a reusable Report Scheduler capable of managing every scheduled report throughout MAP.

The scheduler shall support enterprise automation while remaining completely metadata driven.

Folder Structure

Create

src/

reporting/

scheduler/

ReportScheduler.tsx

SchedulerDashboard.tsx

ScheduleExplorer.tsx

ScheduleDetails.tsx

ScheduleEditor.tsx

ScheduleCalendar.tsx

ScheduleTimeline.tsx

ScheduleHistory.tsx

ScheduleQueue.tsx

ScheduleTemplates.tsx

ScheduleNotifications.tsx

ScheduleLogs.tsx

ScheduleStatistics.tsx

SchedulerSettings.tsx

SchedulerWorkspace.tsx

components/

widgets/

README.md
Scheduler Navigation

Support

Scheduler Dashboard

Schedules

Calendar

Timeline

Queue

History

Templates

Notifications

Logs

Statistics

Settings
Scheduler Dashboard

Display placeholder widgets for

Scheduled Reports
Running Jobs
Next Executions
Failed Schedules
Queue Size
Scheduler Health
AI Recommendations
Schedule Explorer

Support browsing

Daily Reports
Weekly Reports
Monthly Reports
Quarterly Reports
Annual Reports
Event Driven Reports
On Demand Reports
Schedule Editor

Prepare placeholder configuration for

Report
Frequency
Start Date
End Date
Time
Time Zone
Priority
Owner
Notifications
Calendar View

Create reusable calendar placeholders supporting

Day
Week
Month
Agenda
Timeline View

Prepare timeline display for

Past Executions
Current Jobs
Future Schedules
Queue Management

Prepare placeholders for

Pending Reports
Running Reports
Completed Reports
Failed Reports
Cancelled Reports
Schedule History

Support placeholder viewing of

Execution History
Runtime
Status
Errors
Audit Trail
Schedule Templates

Prepare reusable schedule templates

Examples

Daily Executive Report
Weekly Governance Report
Monthly Audit Pack
Quarterly Migration Review
Annual Compliance Report
Notifications

Prepare placeholders for

Email Notifications
Teams Notifications
SMS Notifications
Web Notifications
Statistics

Display placeholder widgets for

Success Rate
Failure Rate
Average Runtime
Queue Length
Peak Hours
Widget Usage

Construct every page using Prompt 007 reusable widgets.

Examples

KPI Widget
Timeline Widget
Status Widget
Notification Widget
Grid Widget
AI Summary Widget
Theme Integration

Reuse Prompt 002 Theme System.

Automatically inherit

Colours
Typography
Icons
Layout
Branding
Future Integration

Prepare integration with

HTML Reporting Framework
Report Centre
Report Viewer
Distribution Engine
PDF Reporting
Excel Reporting
Presentation Engine
Backend Scheduler
Notification Engine

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

Report Scheduler
Scheduler Dashboard
Schedule Explorer
Queue Manager
Calendar
Timeline
Documentation
Produce

Create

019_Create_Report_Scheduler_Report.md

Include

Pages Created
Scheduler Modules
Widgets Used
Navigation Structure
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 020
Acceptance Criteria

✓ Report Scheduler operational

✓ Schedule Explorer created

✓ Calendar created

✓ Timeline created

✓ Queue Manager created

✓ Widget Framework integrated

✓ Report Centre integrated

✓ Report Viewer integrated

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 020

Next Prompt

Prompt 020 — Create Report Distribution Centre

The Report Distribution Centre will manage the secure delivery of reports through email, Microsoft Teams, SharePoint, OneDrive, Azure Blob Storage, downloadable links and future enterprise integrations, completing the end-to-end report lifecycle before export engines such as PDF, Excel and Presentation are introduced.