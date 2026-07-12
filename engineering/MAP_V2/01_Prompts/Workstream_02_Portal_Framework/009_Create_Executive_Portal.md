# Prompt 009 — Create Executive Portal

Project:
MAP V2 (Migration Assurance Platform)

Workstream:
02 – Portal Framework

Prompt:
009

Prerequisites

✔ Workstream 01 – Platform Foundation (001–007)

✔ 008_Create_Portal_Framework

Status:
Executive Experience Development

---

# Objective

Design and implement the Executive Portal.

The Executive Portal is the primary landing experience for senior stakeholders including:

• CEO

• CIO

• CTO

• Programme Director

• Executive Sponsor

• Steering Committee

It shall provide a real-time executive overview of migration health, delivery status, risks, compliance, AI insights and reporting.

No operational complexity shall be exposed.

The experience must remain clean, modern and executive-focused.

---

# Design Principles

The Executive Portal shall be:

Executive Focused

Minimal

Visual

Insight Driven

AI Assisted

Role Aware

Tenant Aware

Responsive

Theme Aware

---

# Create Folder Structure

src/

portal/

executive/

ExecutivePortal.tsx

ExecutiveHome.tsx

ExecutiveHeader.tsx

ExecutiveSummary.tsx

ExecutiveWidgets.tsx

ExecutiveNavigation.tsx

ExecutiveActions.tsx

ExecutiveReports.tsx

ExecutiveInsights.tsx

ExecutiveHealth.tsx

ExecutiveRisk.tsx

ExecutiveKPI.tsx

ExecutiveNotifications.tsx

hooks/

useExecutiveDashboard.ts

types/

ExecutiveDashboard.ts

ExecutiveMetrics.ts

---

# Executive Landing Page

Upon login the Executive shall immediately see:

Migration Health Score

Programme Status

Overall Risk

Validation Success

Critical Issues

Recent Activity

AI Executive Summary

Quick Actions

No scrolling required to view key KPIs.

---

# Dashboard Sections

Create the following sections.

---

## Executive Summary

Display:

Migration Programme

Current Phase

Overall Status

Completion Percentage

Last Execution

Overall Confidence Score

---

## KPI Cards

Display widgets for:

Migration Health

Control Success Rate

Projects

Datasets

Rules Executed

Controls Executed

Failures

Warnings

Exceptions

Audit Findings

---

## Programme Status

Visual indicators for:

Discovery

Mapping

Validation

Execution

Reporting

Governance

Completed

Running

Pending

Blocked

---

## Risk Overview

Widgets:

Overall Risk

Critical Risks

High Risks

Medium Risks

Low Risks

Trend

Risk Heat Map

---

## AI Executive Summary

Display an AI-generated executive narrative.

Example

Migration health remains excellent.

Validation success is above target.

No critical issues detected.

One project requires attention due to increased warning volume.

Future prompts will connect this widget to the AI Engine.

---

## Recent Activity

Display:

Recent Validations

Recent Reports

Recent Executions

Recent Exceptions

Recent Notifications

---

## Executive Reports

Quick access to:

Executive Dashboard

Operational Dashboard

Audit Pack

Migration Health

Compliance Summary

Risk Report

Clicking a report shall launch the Presentation Engine when integrated.

---

## Executive Notifications

Display:

Critical Alerts

System Messages

Approvals

Pending Reviews

Escalations

---

## Quick Actions

Provide action cards.

View Reports

Run Validation

Open AI Assistant

Review Risks

Programme Status

Audit Centre

---

# Widget Integration

Every dashboard element shall be implemented using the Widget Framework.

No widgets shall be instantiated directly.

Use:

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

Support:

Dashboard

Reports

AI Insights

Programme Status

Risk

Governance

Notifications

Settings

---

# Theme Integration

Support:

Light Theme

Dark Theme

Future White Labelling

No hardcoded colours.

---

# Responsive Behaviour

Desktop

Tablet

Mobile

Widgets shall automatically rearrange.

---

# Permissions

Portal visible only to:

Executive

Programme Director

CIO

CTO

Executive Sponsor

Read-only mode for Auditors.

---

# Dashboard Metadata

Register the portal inside the Portal Registry.

Example

Portal ID

executive

Title

Executive Portal

Default Route

/executive

Default Dashboard

Executive Home

Default Widgets

Executive KPI

Migration Health

AI Summary

Reports

Risk

Notifications

---

# Sample Data

Until backend integration exists use realistic placeholder data.

Example

Migration Health

96%

Programme Status

On Track

Projects

12

Rules Executed

1,842

Controls Passed

99.6%

Critical Risks

1

AI Summary

Migration progressing normally.

---

# Deliverables

Create:

Executive Portal

Executive Landing Page

Executive Navigation

Executive Widget Configuration

Executive KPI Dashboard

Executive AI Summary

Executive Report Centre

Executive Notifications

Documentation

---

# Success Criteria

✓ Executive Portal operational

✓ Uses Portal Framework

✓ Uses Widget Framework

✓ Responsive

✓ Theme integrated

✓ Metadata registered

✓ Role-aware

✓ AI-ready

✓ Ready for backend integration

---

# Current Workstream

Workstream 02 – Portal Framework

Progress

2 of 8

---

# Next Prompt

010_Create_Operations_Portal

The Operations Portal shall provide the operational workspace for migration teams, exposing execution queues, running controls, failures, schedules, retries and live system activity using the Portal Framework and Widget Framework.

---

# References

Programme

MAP V2

Master Roadmap

001_Workstream_Index.md

Relevant Architecture

01_Product_Architecture

02_Portal_Architecture

06_AI_Architecture

07_Reporting_Architecture

12_UI_Component_Architecture