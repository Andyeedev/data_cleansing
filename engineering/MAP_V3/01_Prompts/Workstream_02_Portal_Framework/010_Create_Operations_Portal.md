# Prompt 010 — Create Operations Portal

Project:
MAP V2 (Migration Assurance Platform)

Workstream:
02 – Portal Framework

Prompt:
010

Prerequisites

✔ Workstream 01 – Platform Foundation (001–007)

✔ 008_Create_Portal_Framework

✔ 009_Create_Executive_Portal

Status:
Operations Workspace Development

---

# Objective

Design and implement the Operations Portal.

The Operations Portal shall provide a real-time operational workspace for migration teams responsible for executing, monitoring and managing migration validation activities.

Unlike the Executive Portal, this portal shall focus on operational execution, workload management and issue resolution.

The interface shall prioritise efficiency, visibility and rapid decision making.

---

# Target Users

Migration Manager

Migration Analyst

Data Engineer

Validation Engineer

Operations Team

Support Team

PMO

Service Desk

Delivery Manager

---

# Design Principles

Operational

Task Driven

Real-Time

Action Oriented

Responsive

Theme Aware

Role Aware

Tenant Aware

AI Ready

---

# Create Folder Structure

src/

portal/

operations/

OperationsPortal.tsx

OperationsHome.tsx

OperationsHeader.tsx

OperationsDashboard.tsx

OperationsWidgets.tsx

OperationsNavigation.tsx

OperationsQueues.tsx

OperationsExecution.tsx

OperationsSchedules.tsx

OperationsAlerts.tsx

OperationsFailures.tsx

OperationsMonitoring.tsx

OperationsHealth.tsx

hooks/

useOperationsDashboard.ts

types/

OperationsMetrics.ts

OperationsQueue.ts

---

# Operations Landing Page

Display immediately:

Execution Queue

Running Controls

Queued Executions

Recent Failures

Retry Queue

Schedules

Live System Health

Notifications

No unnecessary executive information shall appear.

---

# Dashboard Sections

---

## Execution Overview

Display

Running Executions

Queued Executions

Completed Today

Failed Today

Average Runtime

Execution Success Rate

---

## Control Execution

Widgets

Running Controls

Completed Controls

Failed Controls

Retry Controls

Paused Controls

Waiting Controls

---

## Queue Management

Display

Execution Queue

Retry Queue

Pending Queue

Scheduled Queue

Priority Queue

Support sorting and filtering.

---

## Validation Health

Widgets

Rules Executed

Controls Executed

Pass Rate

Failure Rate

Warning Count

Exception Count

Trend

---

## Dataset Monitoring

Display

Datasets Processed

Datasets Pending

Datasets Failed

Dataset Throughput

Largest Dataset

Average Processing Time

---

## Schedule Manager

Display

Upcoming Executions

Recurring Schedules

Completed Jobs

Failed Jobs

Cancelled Jobs

Support future scheduler integration.

---

## Alerts

Display

Critical Alerts

Warnings

Execution Timeouts

Dependency Failures

Validation Errors

Infrastructure Alerts

---

## Retry Centre

Widgets

Retry Queue

Automatic Retry

Manual Retry

Retry Success

Retry Failure

Retry History

---

## Recent Activity

Display

Recent Executions

Recent Reports

Recent Dataset Loads

Recent Rule Changes

Recent Notifications

---

## System Health

Display

API Status

Database Status

Queue Status

AI Status

Presentation Engine

Workflow Engine

Notification Engine

Traffic Indicators

---

## AI Operations Summary

Display

AI-generated operational recommendations.

Example

Three executions require review.

Retry queue increasing.

One dataset has repeated validation failures.

Recommended action:

Review Dataset Mapping.

Future prompts shall connect this widget to the AI Engine.

---

# Widget Integration

Every dashboard element shall be implemented using the Widget Framework.

No operational widget shall be created directly inside the portal.

Use

Portal

↓

Portal Renderer

↓

Widget Metadata

↓

Widget Renderer

↓

Widget

---

# Navigation

Support

Dashboard

Executions

Queues

Schedules

Monitoring

Alerts

Retry Centre

Reports

AI Operations

Settings

---

# Theme Integration

Support

Light Theme

Dark Theme

Client Branding

No hardcoded colours.

---

# Responsive Behaviour

Desktop

Tablet

Mobile

Widgets automatically reorganise.

---

# Permissions

Portal visible to

Migration Teams

Operations Teams

Support Teams

Delivery Managers

Administrators

Read-only mode for Auditors.

---

# Portal Metadata

Register

Portal ID

operations

Title

Operations Portal

Route

/operations

Category

Operations

Default Widgets

Execution Queue

Running Controls

Retry Queue

Schedules

Alerts

Monitoring

---

# Sample Data

Provide realistic placeholder values.

Example

Running Executions

12

Queued Jobs

18

Completed Today

147

Failed Today

3

Pass Rate

99.4%

Retry Queue

5

Critical Alerts

1

AI Recommendation

Investigate repeated failures for Customer Migration Batch 17.

---

# Deliverables

Create

Operations Portal

Operations Dashboard

Execution Overview

Queue Management

Retry Centre

Schedule Manager

Monitoring Dashboard

Alerts Dashboard

AI Operations Summary

Portal Documentation

---

# Success Criteria

✓ Operations Portal operational

✓ Uses Portal Framework

✓ Uses Widget Framework

✓ Queue Management operational

✓ Monitoring operational

✓ Responsive

✓ Theme integrated

✓ Role aware

✓ AI ready

✓ Ready for backend integration

---

# Current Workstream

Workstream 02 – Portal Framework

Progress

3 of 8

---

# Next Prompt

011_Create_Migration_Portal

The Migration Portal shall become the primary workspace for managing migration projects, datasets, mappings, discovery, validation and execution using the Portal Framework and Widget Framework.

---

# References

Programme

MAP V2

Master Roadmap

001_Workstream_Index.md

Relevant Architecture

01_Product_Architecture

02_Portal_Architecture

03_Backend_Architecture

04_API_Architecture

06_AI_Architecture

07_Reporting_Architecture

12_UI_Component_Architecture