MAP Nexus™ Enterprise Platform
Prompt 011
Create Migration Portal

Version: 4.1

Prompt ID: 011

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
Purpose

Create the Migration Portal for MAP Nexus™.

The Migration Portal provides migration engineers, project managers and delivery teams with a complete operational workspace for managing migration projects.

This prompt creates the portal framework, layout and presentation layer only.

No backend integration.

No APIs.

No business logic.

No database connectivity.

Objective

Create a reusable Migration Portal capable of supporting:

Migration Projects
Execution Monitoring
Dataset Management
Mapping Management
Validation Execution
Migration Scheduling
Run History
Migration Reporting
AI Migration Assistance

The portal shall be entirely constructed using the Widget Framework created in Prompt 007.

Folder Structure

Create

src/

portals/

migration/

MigrationPortal.tsx

MigrationOverview.tsx

MigrationProjects.tsx

MigrationExecution.tsx

MigrationMappings.tsx

MigrationDatasets.tsx

MigrationSchedules.tsx

MigrationHistory.tsx

MigrationReports.tsx

MigrationWorkspace.tsx

components/

widgets/

Navigation

Add Migration Portal to the Portal Framework.

Navigation shall include

Migration Overview

Projects

Execution

Datasets

Mappings

Schedules

History

Reports

Workspace

Each page shall initially display placeholder content.

Migration Overview

Create an executive overview page displaying placeholder widgets for

Active Projects
Running Executions
Completed Migrations
Failed Executions
Success Rate
Migration Health
AI Migration Summary
Projects

Create placeholder pages supporting

Project List
Project Summary
Project Status
Project Timeline
Assigned Team
Progress
Migration Execution

Create placeholder workspace for

Start Migration
Stop Migration
Resume Migration
Retry Migration
Queue Monitoring
Execution Timeline
Dataset Management

Create placeholder pages supporting

Source Systems
Target Systems
Dataset Inventory
Dataset Health
Dataset Statistics
Mapping Management

Create placeholder pages for

Dataset Mapping
Column Mapping
Transformation Rules
Mapping Validation
Mapping Health
Scheduling

Create scheduling dashboard placeholders supporting

Scheduled Jobs
Recurring Jobs
Job Calendar
Upcoming Executions
Migration History

Create placeholder pages displaying

Previous Runs
Execution History
Migration Timeline
Execution Statistics
Reporting

Create report placeholders for

Migration Summary
Project Status
Dataset Statistics
Execution Reports
Validation Reports
Migration Workspace

Create the primary operational workspace containing placeholder panels for

Project Explorer
Dataset Explorer
Execution Queue
Active Sessions
AI Recommendations
Notifications
Widget Usage

Construct every page using reusable widgets from Prompt 007.

Examples include

KPI Widget
Status Widget
Grid Widget
Timeline Widget
Report Widget
AI Summary Widget
Notification Widget

No page shall contain duplicated dashboard code.

AI Integration

Prepare placeholder widgets for

Migration Recommendations
Migration Risk Analysis
Dataset Optimisation
Suggested Actions

No AI implementation.

Responsive Behaviour

Support

Desktop
Tablet
Mobile

Layouts shall automatically adapt using the Dashboard Framework.

Accessibility

Support

Keyboard Navigation
Screen Readers
WCAG AA
ARIA Labels
High Contrast
Deliverables

Generate

Migration Portal
Migration Navigation
Migration Workspace
Migration Widgets
Placeholder Pages
Documentation
Produce

Create

011_Create_Migration_Portal_Report.md

Include

Pages Created
Widgets Used
Navigation Structure
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 012
Acceptance Criteria

✓ Migration Portal operational

✓ Navigation complete

✓ Workspace created

✓ Widget Framework fully utilised

✓ Placeholder pages created

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 012