# MAP Nexus™ Enterprise Platform

## Portal Architecture

**Version:** 2.0

**Document:** 02_Portal_Architecture.md

**Status:** Draft 1.0

**Classification:** Internal Architecture

---

# Purpose

This document defines the architecture of the MAP Nexus™ Enterprise Portal.

The Portal is the primary user interface to the MAP platform.

It provides a unified experience for executives, migration teams, governance officers, auditors, administrators and AI-assisted users through a secure, role-based web application.

This document defines navigation, user journeys, portal components, page hierarchy and interaction principles.

It does not describe implementation.

---

# Portal Vision

The MAP Portal provides a single, consistent interface through which users can access every capability of the platform.

The Portal shall present information appropriate to each user's role while maintaining a consistent enterprise user experience.

The Portal is designed to resemble modern Microsoft enterprise applications.

---

# Portal Objectives

The Portal shall provide:

• Role-based navigation

• Executive dashboards

• Migration management

• Validation monitoring

• Governance management

• Risk management

• Reporting

• Administration

• AI-assisted interaction

• Responsive user experience

---

# Design Principles

The Portal shall follow the following principles.

## Executive First

Executives should understand migration status within seconds.

Important information is surfaced immediately.

---

## Minimal Navigation

Users should never require more than three clicks to reach any major function.

---

## Consistent Layout

Every page follows a consistent structure.

Header

↓

Navigation

↓

Content

↓

Supporting Panels

↓

Footer

---

## Responsive Design

The Portal shall operate correctly on:

Desktop

Laptop

Tablet

Future mobile support.

---

## Accessibility

The Portal shall conform to recognised accessibility standards where practical.

Large typography

Clear contrast

Keyboard navigation

Screen reader compatibility

---

# Portal Layout

```
+---------------------------------------------------------+
| Header                                                  |
+---------------------------------------------------------+
| Left Navigation | Main Workspace | Right Information    |
|                 |                | Panel               |
+---------------------------------------------------------+
| Footer                                                  |
+---------------------------------------------------------+
```

---

# Primary Navigation

The Portal navigation consists of the following major sections.

## Home

Landing page.

Provides overall platform overview.

---

## Executive Dashboard

Executive KPIs

Migration Readiness

Programme Health

Business Summary

Executive Reports

---

## Migration Centre

Migration Overview

Programme Status

Progress Tracking

Milestones

Dependencies

---

## Validation Centre

Validation Results

Rule Execution

Exceptions

Failed Rules

Validation Trends

---

## Governance Centre

Issue Register

Compliance

Approvals

Audit Trail

Exception Management

---

## Risk Centre

Risk Assessment

Critical Issues

Risk Trends

Heat Maps

Mitigation Actions

---

## Data Quality Centre

Completeness

Consistency

Duplicates

Referential Integrity

Quality Score

---

## Reporting Centre

Executive Reports

Operational Reports

Technical Reports

Regulatory Reports

Saved Reports

Scheduled Reports

---

## MAP Copilot

Natural language interaction.

Executive summaries.

Report generation.

Migration insights.

Recommendations.

---

## Administration

Users

Roles

Permissions

Configuration

System Monitoring

Audit

---

# Portal Hierarchy

```
MAP Portal

├── Home
│
├── Executive Dashboard
│
├── Migration Centre
│
├── Validation Centre
│
├── Governance Centre
│
├── Risk Centre
│
├── Data Quality Centre
│
├── Reporting Centre
│
├── MAP Copilot
│
└── Administration
```

---

# Common Page Structure

Every Portal page follows the same structure.

```
Header

↓

Breadcrumb

↓

Page Title

↓

Action Toolbar

↓

Summary Cards

↓

Main Dashboard

↓

Supporting Widgets

↓

Recent Activity

↓

Footer
```

---

# Dashboard Components

Dashboards may contain:

KPI Cards

Charts

Tables

Heat Maps

Progress Indicators

Trend Analysis

Filters

Drill-down Links

Export Actions

---

# Global Components

Every Portal page includes:

Global Search

Notifications

User Profile

Help

Settings

Theme Selection (future)

---

# User Roles

The Portal adapts according to user role.

## Executive

Executive Dashboard

Reports

Risk

Readiness

MAP Copilot

---

## Programme Manager

Migration

Validation

Governance

Reporting

---

## Migration Lead

Migration

Validation

Issues

Quality

---

## Auditor

Governance

Audit

Reports

Read-only access

---

## Administrator

Complete platform administration.

---

# Navigation Behaviour

Navigation remains persistent.

The current section is highlighted.

Breadcrumbs show current location.

Recent pages are remembered.

---

# Reporting Integration

Every dashboard supports:

Export PDF

Export Excel

Print

Share (future)

Save View

Schedule Report

---

# MAP Copilot Integration

MAP Copilot is accessible globally.

Users may ask:

"Show executive summary."

"Explain validation failures."

"Generate readiness report."

"Identify highest risks."

MAP Copilot responds using platform APIs.

---

# Notifications

The Portal supports:

Critical Alerts

Warnings

Information

Task Notifications

Approval Requests

Future integration with Microsoft Teams.

---

# Authentication

The Portal never performs authentication directly.

Authentication is delegated to the Authentication Service.

Future support:

Microsoft Entra ID

Azure AD B2C

OAuth

SAML

---

# Portal Performance Targets

Portal Home:

<2 seconds

Dashboard loading:

<3 seconds

Report generation:

<10 seconds

Search:

<1 second

---

# Future Enhancements

Dark Mode

Personal Dashboards

Bookmarks

Dashboard Designer

Teams Integration

Power BI Embedding

Mobile Application

---

# Success Criteria

The Portal architecture is complete when:

• Navigation hierarchy is defined

• User journeys are documented

• Page responsibilities are defined

• Role-based navigation is established

• Dashboard framework is standardised

• Integration points are identified

---

# Related Documents

00_Master_Roadmap.md

01_Product_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

05_Database_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md