# Prompt 007 — Create Widget Framework

Project:
MAP V2 (Migration Assurance Platform)

Programme:
MAP V2 Engineering Programme

Workstream:
01 – Platform Foundation

Prompt:
007

Prerequisites

✔ 001_Create_React_Solution

✔ 002_Create_Theme_System

✔ 003_Create_Navigation

✔ 004_Create_Login_Page

✔ 005_Create_Layout

✔ 006_Create_Dashboard_Framework

Status:
Platform Foundation Completion

---

# Objective

Design and implement the reusable Widget Framework that powers every dashboard, portal and reporting screen throughout MAP.

The Widget Framework shall provide a metadata-driven rendering engine capable of displaying reusable dashboard widgets without hardcoding business logic into pages.

Every future portal (Executive, Operations, Migration, Governance, Reporting, Security, Administration, AI etc.) shall be constructed using reusable widgets.

The Widget Framework shall become one of the core architectural foundations of MAP.

---

# Design Principles

The Widget Framework shall be:

• Metadata Driven

• Configuration Driven

• Theme Aware

• Responsive

• Role Aware

• Tenant Aware

• AI Ready

• Extensible

No portal shall contain duplicated dashboard code.

No page shall instantiate widgets directly.

All widgets shall be rendered through the Widget Renderer.

---

# Create Folder Structure

src/

components/

widgets/

base/

    Widget.tsx

    WidgetHeader.tsx

    WidgetBody.tsx

    WidgetFooter.tsx

    WidgetLoader.tsx

    WidgetError.tsx

cards/

    KPIWidget.tsx

    StatusWidget.tsx

    MetricWidget.tsx

charts/

    BarChartWidget.tsx

    LineChartWidget.tsx

    PieChartWidget.tsx

    AreaChartWidget.tsx

    GaugeWidget.tsx

tables/

    GridWidget.tsx

    SummaryTableWidget.tsx

reports/

    HtmlReportWidget.tsx

    AuditReportWidget.tsx

ai/

    AISummaryWidget.tsx

    AIInsightWidget.tsx

    AIRecommendationWidget.tsx

system/

    NotificationWidget.tsx

    TaskWidget.tsx

    TimelineWidget.tsx

registry/

    WidgetRegistry.ts

engine/

    WidgetRenderer.tsx

    WidgetFactory.ts

hooks/

    useWidget.ts

types/

    WidgetTypes.ts

    WidgetProps.ts

---

# Widget Categories

Support at minimum:

• KPI Cards

• Metric Cards

• Status Cards

• Charts

• Tables

• HTML Reports

• AI Widgets

• Notifications

• Activity Timeline

• Progress Indicators

• Custom Widgets

---

# Widget Base Interface

Every widget shall expose:

Widget ID

Title

Description

Icon

Role Visibility

Tenant Visibility

Refresh Interval

Data Source

Permissions

Theme

Height

Width

Actions

Configuration

---

# Widget Metadata Model

Create:

WidgetDefinition

Containing:

id

name

type

category

icon

component

description

roles

permissions

datasource

refreshInterval

defaultSize

enabled

---

# Widget Registry

Create a Widget Registry responsible for automatically registering every widget available within MAP.

Example widgets

Executive

• Executive KPI

• Migration Health

• Risk Score

• Control Success

• Audit Summary

• AI Summary

Operations

• Execution Queue

• Running Controls

• Failed Controls

• Retry Queue

• Schedules

Migration

• Projects

• Datasets

• Metadata

• Validation

• Execution

Reporting

• Executive Report

• Operational Report

• Audit Pack

Governance

• Compliance

• Policies

• Exceptions

Security

• Credentials

• Audit Logs

• Encryption

Administration

• Users

• Roles

• Subscriptions

---

# Widget Factory

Create a Widget Factory capable of instantiating widgets dynamically.

Example

Widget Metadata

↓

Widget Factory

↓

React Component

↓

Widget Renderer

↓

Portal

Dashboard pages shall never instantiate widgets directly.

---

# Widget Renderer

Create a generic Widget Renderer.

Input

Widget Metadata

↓

Widget Factory

↓

React Component

↓

Render

Every future portal shall consume widgets only through the Widget Renderer.

---

# Widget Configuration

Widgets shall support:

Title

Subtitle

Colour

Theme

Icon

Height

Width

Refresh Interval

Permissions

Datasource

Drilldown

Navigation

Configuration

---

# Theme Integration

Widgets shall inherit colours automatically from the MAP Theme System.

Support

Light Theme

Dark Theme

Future Client Branding

No hardcoded colours.

---

# Responsive Behaviour

Widgets shall automatically resize.

Desktop

Tablet

Mobile

Support configurable grid spans.

---

# Loading States

Every widget shall support:

Loading

Empty

Success

Error

Offline

Maintenance

---

# Future Integration

Design the framework to integrate seamlessly with:

Portal Framework

Presentation Engine

Reporting Engine

Workflow Engine

Notification Engine

Rule Engine

AI Engine

without requiring architectural changes.

---

# Deliverables

Create

Complete Widget Framework

Widget Registry

Widget Renderer

Widget Factory

Base Widget Components

Sample KPI Widgets

Sample Chart Widgets

Sample Table Widget

Sample AI Widget

Sample HTML Report Widget

Documentation

---

# Success Criteria

✓ Widget Framework operational

✓ Widget Registry operational

✓ Widget Renderer operational

✓ Widget Factory operational

✓ Theme integration complete

✓ Responsive layout complete

✓ Loading states implemented

✓ Ready for Portal Framework

---

# Current Workstream

Workstream 01 – Platform Foundation

Progress

7 of 7

Platform Foundation Complete

---

# Next Prompt

008_Create_Portal_Framework

The Portal Framework shall provide the reusable architecture that allows every business portal to inherit common layouts, routing, permissions, themes and widget rendering without duplicating code.

---

# References

Programme

MAP V2 Engineering Programme

Master Roadmap

00_Master_Roadmap.md

Workstream Index

001_Workstream_Index.md

Relevant Architecture

01_Product_Architecture.md

02_Portal_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

11_Development_Standards.md

12_UI_Component_Architecture.md