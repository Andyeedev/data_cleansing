# MAP Nexus™ Enterprise Platform

# Prompt 006

## Create Analytics & Dashboard Framework

**Version:** 2.0

**Prompt ID:** 006

**Workstream:** A — Portal & User Experience

**Status:** Approved

---

# Purpose

Create the reusable Analytics & Dashboard Framework used throughout MAP Nexus™.

This framework provides the foundation for all future dashboards, reporting, KPI pages, executive summaries, operational monitoring, and analytics.

This prompt creates reusable presentation components only.

No business logic.

No database integration.

No APIs.

No reports.

No charts connected to data.

---

# Mandatory Standards

Follow

11_Development_Standards.md

Follow

001_Create_React_Solution.md

Follow

002_Create_Theme_System.md

Follow

003_Create_Navigation.md

Follow

004_Create_Authentication_Module.md

Follow

005_Create_Application_Shell.md

Follow

07_Reporting_Architecture.md

---

# Objective

Create reusable dashboard infrastructure that every MAP module can inherit.

The framework must support

Executive Dashboards

Operational Dashboards

Validation Dashboards

Risk Dashboards

Governance Dashboards

Migration Dashboards

Reporting

AI Insights

Administration

---

# Folder Structure

Create

```
src/

dashboard/

framework/

DashboardLayout.tsx

DashboardPage.tsx

DashboardGrid.tsx

DashboardSection.tsx

WidgetContainer.tsx

WidgetHeader.tsx

WidgetFooter.tsx

DashboardToolbar.tsx

DashboardFilters.tsx

DashboardActions.tsx

DashboardContext.tsx

dashboard.types.ts

```

---

# Widget Library

Create reusable widgets.

```
KPI Card

Summary Card

Status Card

Trend Card

Risk Card

Validation Card

Migration Card

Information Card

Chart Panel

Table Panel

Report Panel

Activity Panel

AI Insight Panel

Progress Panel

```

Initially

Placeholder data only.

---

# Dashboard Grid

Support

```
12-column responsive grid

Resizable widgets

Fixed widgets

Future drag/drop

Responsive breakpoints
```

---

# KPI Components

Create reusable KPI cards.

Include

Title

Value

Delta

Trend

Status

Icon

Footer

Support

Positive

Negative

Neutral

Warning

Critical

---

# Dashboard Toolbar

Support

Refresh

Export

Print

Filter

Date Range

Search

AI Assistant

Help

No implementation.

---

# Filters

Create reusable filter components.

Support

Dropdown

Search

Checkbox

Toggle

Date Picker Placeholder

Multi-select Placeholder

---

# Widget Containers

Every widget must support

Header

Body

Footer

Loading

Empty State

Error State

Refresh Placeholder

---

# Dashboard Context

Create

```
DashboardContext.tsx
```

Support

Current Dashboard

Filters

Selected Widgets

Refresh State

User Preferences

Future persistence only.

---

# Chart Placeholders

Create reusable chart containers.

Support

Bar Chart

Line Chart

Area Chart

Pie Chart

Donut Chart

Heat Map

Gauge

Timeline

No data integration.

---

# Tables

Create reusable table container.

Support

Sorting Placeholder

Filtering Placeholder

Pagination Placeholder

Export Placeholder

Responsive layout

---

# Dashboard Types

Prepare framework for

Executive Dashboard

Migration Dashboard

Validation Dashboard

Governance Dashboard

Risk Dashboard

Reporting Dashboard

Administration Dashboard

AI Dashboard

Only placeholders.

---

# AI Insight Panel

Create reusable AI panel.

Support

Recommendations

Observations

Warnings

Suggested Actions

No AI integration.

---

# Empty States

Professional empty dashboard.

Display

"No data available"

"Awaiting execution"

"Dashboard loading"

---

# Responsive Behaviour

Desktop

Tablet

Mobile

Widgets automatically reflow.

---

# Accessibility

Keyboard navigation

Screen readers

ARIA labels

High contrast

Semantic HTML

---

# Deliverables

Generate

Analytics Framework

Dashboard Framework

Widget Library

Grid System

Toolbar

Filters

Chart Containers

Table Containers

README

---

# Produce

Create

006_Create_Analytics_Framework_Report.md

Include

Widgets Created

Layouts Created

Dashboard Types

Accessibility

Responsive Behaviour

Overall Status

Ready for Prompt 007

---

# Acceptance Criteria

✓ Dashboard framework operational

✓ Widget library created

✓ KPI cards reusable

✓ Dashboard layouts reusable

✓ Toolbar created

✓ Filter framework created

✓ Chart placeholders created

✓ Table placeholders created

✓ Responsive behaviour implemented

✓ Ready for Prompt 007