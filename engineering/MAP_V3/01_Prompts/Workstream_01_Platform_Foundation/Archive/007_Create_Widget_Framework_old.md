# Prompt 007 — Create Widget Framework

Project:
MAP V2 (Migration Assurance Platform)

Stage:
Portal Foundation

Prerequisites:

✔ 001_Create_React_Solution

✔ 002_Create_Theme_System

✔ 003_Create_Navigation

✔ 004_Create_Login_Page

✔ 005_Create_Layout

✔ 006_Create_Dashboard_Framework

Status:
Next Development Task

---

# Objective

Design and implement the reusable Widget Framework that powers every dashboard, portal and reporting screen throughout MAP.

The Widget Framework shall provide a metadata-driven rendering engine capable of displaying reusable dashboard widgets without hardcoding business logic into pages.

Every future portal (Executive, Operations, Governance, Reporting, Security, Administration, AI etc.) will be constructed from reusable widgets.

The framework shall become one of the core foundations of MAP.

---

# Design Principles

The framework shall be:

• Metadata Driven

• Configuration Driven

• Theme Aware

• Responsive

• Role Aware

• Tenant Aware

• AI Ready

• Extensible

No portal should contain duplicated dashboard code.

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

KPI Cards

Metric Cards

Status Cards

Charts

Tables

HTML Reports

AI Widgets

Notifications

Activity Timeline

Progress Indicators

Custom Widgets

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

containing:

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

Create a registry responsible for automatically registering widgets.

Example

Executive KPI

Migration Health

Risk Score

Control Success

Audit Summary

AI Summary

Reports

Operations

Execution Queue

Running Controls

Failed Controls

Schedules

Retry Queue

Reporting

Executive Report

Operational Report

Audit Pack

Migration Health

Governance

Compliance

Policy

Exceptions

Security

Credentials

Audit Logs

Encryption

Administration

Users

Roles

Subscriptions

---

# Widget Factory

Create a Widget Factory capable of instantiating widgets dynamically.

Example

WidgetFactory

↓

KPI Widget

↓

Chart Widget

↓

Grid Widget

↓

AI Widget

↓

Report Widget

No switch statements inside dashboard pages.

---

# Widget Renderer

Create a generic renderer.

Input

Widget Metadata

↓

Widget Factory

↓

React Component

↓

Render

Pages should never instantiate widgets directly.

---

# Widget Configuration

Widgets must support configuration such as:

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

---

# Theme Integration

Widgets shall inherit colours automatically from the MAP Theme System.

Support:

Light Theme

Dark Theme

Future Client Branding

No hardcoded colours.

---

# Responsive Behaviour

Widgets shall resize automatically.

Desktop

Tablet

Mobile

Support configurable grid spans.

---

# Loading States

Every widget must provide:

Loading

Empty

Success

Error

Offline

states.

---

# Future Integration

Design the framework to support future integration with:

Presentation Engine

Reporting Engine

AI Engine

Notification Engine

Rule Engine

Workflow Engine

without modification.

---

# Deliverables

Create:

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

✓ Widgets render dynamically

✓ Widget Registry operational

✓ Widget Renderer operational

✓ Widget Factory operational

✓ Theme integration complete

✓ Responsive layout complete

✓ Loading states implemented

✓ Ready for Portal Development

---

# Next Prompt

008_Create_Executive_Portal

The Executive Portal shall become the first production portal constructed entirely using the Widget Framework.