MAP Nexus™ Enterprise Platform
Prompt 015
Create Administration Portal

Version: 4.1

Prompt ID: 015

Workstream: 02 — Portal Development

Status: Approved

Prerequisites

Complete:

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
Purpose

Create the enterprise Administration Portal for MAP Nexus™.

The Administration Portal provides the operational control centre for managing tenants, users, roles, platform configuration, licensing, scheduling and system administration.

This prompt creates only the presentation framework.

No backend implementation.

No APIs.

No database connectivity.

No administration logic.

Objective

Create a reusable Administration Portal capable of supporting enterprise platform administration.

The Administration Portal shall become the central operational console for platform administrators.

All pages shall leverage the Widget Framework created in Prompt 007.

Folder Structure

Create

src/

portals/

administration/

AdministrationPortal.tsx

AdministrationOverview.tsx

TenantManagement.tsx

OrganisationManagement.tsx

UserManagement.tsx

RoleManagement.tsx

PermissionManagement.tsx

SubscriptionManagement.tsx

Licensing.tsx

PlatformConfiguration.tsx

FeatureFlags.tsx

SystemSettings.tsx

JobScheduler.tsx

NotificationManagement.tsx

EnvironmentManagement.tsx

MaintenanceCentre.tsx

HealthMonitoring.tsx

AdministrationDashboard.tsx

components/

widgets/
Navigation

Extend the Portal Framework.

Administration navigation shall include

Administration Overview

Tenants

Organisations

Users

Roles

Permissions

Subscriptions

Licensing

Platform Configuration

Feature Flags

System Settings

Scheduler

Notifications

Environment

Maintenance

Platform Health

Administration Dashboard

Each page initially displays placeholder widgets.

Administration Overview

Create a dashboard displaying placeholder widgets for

Active Users
Active Tenants
Organisations
Active Sessions
Scheduled Jobs
Platform Health
Licence Usage
Feature Status
System Alerts
Tenant Management

Create placeholder pages supporting

Tenant Directory
Tenant Status
Tenant Provisioning
Tenant Configuration
Tenant Usage
Organisation Management

Create placeholder pages supporting

Organisations
Business Units
Departments
Projects
Organisation Health
User Management

Create placeholder pages supporting

User Directory
Active Users
User Activity
User Lifecycle
Account Status
Role Management

Create placeholder pages supporting

Roles
Role Templates
Role Assignment
Role Hierarchy
Role Usage
Permission Management

Create placeholder pages supporting

Permission Matrix
Access Policies
Security Groups
Permission Audit
Access Requests
Subscription Management

Create placeholder pages supporting

Subscription Plans
Subscription Status
Tenant Plans
Usage
Billing Overview
Licensing

Create placeholder pages supporting

Licence Allocation
Licence Usage
Available Licences
Expiring Licences
Consumption Dashboard
Platform Configuration

Create placeholder pages supporting

Global Configuration
Regional Settings
Branding
Default Preferences
Platform Options
Feature Flags

Create placeholder pages supporting

Enabled Features
Preview Features
Experimental Features
Tenant Overrides
Rollout Status
System Settings

Create placeholder pages supporting

General Settings
Security Settings
Email Settings
Logging Settings
Integration Settings
Job Scheduler

Create placeholder pages supporting

Scheduled Jobs
Running Jobs
Failed Jobs
Retry Queue
Job History
Notification Management

Create placeholder pages supporting

Notification Templates
Delivery Channels
Email
Teams
SMS
Notification History
Environment Management

Create placeholder pages supporting

Development
Test
UAT
Production
Environment Configuration
Maintenance Centre

Create placeholder pages supporting

Maintenance Windows
Scheduled Downtime
Backup Status
Upgrade Planning
Maintenance History
Health Monitoring

Create placeholder pages supporting

Platform Health
Service Availability
API Status
Database Status
Infrastructure Overview
Administration Dashboard

Create the operational administration workspace containing placeholder panels for

Platform KPIs
Tenant Overview
User Activity
Job Scheduler
Platform Alerts
AI Recommendations
Widget Usage

Construct every page using reusable widgets from Prompt 007.

Examples include

KPI Widget
Grid Widget
Status Widget
Notification Widget
Timeline Widget
Metric Widget
AI Summary Widget
Report Widget

No duplicated dashboard code.

AI Integration

Prepare placeholder widgets for

AI Operational Summary
Platform Optimisation
Capacity Recommendations
User Behaviour Insights
Licence Optimisation

No AI implementation.

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

Administration Portal
Administration Navigation
Administration Dashboard
Administration Workspace
Administration Placeholder Pages
Documentation
Produce

Create

015_Create_Administration_Portal_Report.md

Include

Pages Created
Widgets Used
Navigation Structure
Administration Modules
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 016
Acceptance Criteria

✓ Administration Portal operational

✓ Administration navigation complete

✓ Administration Dashboard created

✓ Widget Framework fully utilised

✓ Placeholder pages created

✓ Administration modules established

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 016

Next Prompt

Prompt 016 — Create AI Portal

The AI Portal will become the intelligent command centre for MAP Nexus™, consolidating AI Insights, Predictive Analytics, Natural Language Querying, Recommendations, Root Cause Analysis, Executive Briefings and Autonomous Assistance into a single enterprise experience while leveraging the Portal Framework, Dashboard Framework and Widget Framework established throughout Workstreams 01 and 02.