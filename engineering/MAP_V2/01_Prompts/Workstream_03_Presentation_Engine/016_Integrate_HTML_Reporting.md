MAP Nexus™ Enterprise Platform
Prompt 016
Create HTML Reporting Framework

Version: 4.1

Prompt ID: 016

Workstream: 03 — Reporting & Presentation Engine

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
Prompt 015 — Create Administration Portal
Purpose

Create the enterprise HTML Reporting Framework for MAP Nexus™.

This framework becomes the foundation for every HTML report produced by MAP.

It replaces individual report implementations with a reusable reporting architecture.

This prompt creates only the presentation framework.

No backend integration.

No database integration.

No report execution.

No business logic.

Objective

Develop a reusable HTML reporting framework capable of producing professional enterprise reports for every MAP module.

The framework shall support:

Executive Reports
Migration Reports
Validation Reports
Governance Reports
Risk Reports
Audit Reports
Security Reports
Administration Reports
AI Reports

Every report shall inherit the same layout, styling and rendering engine.

Folder Structure

Create

src/

reporting/

html/

framework/

HtmlReport.tsx

ReportLayout.tsx

ReportHeader.tsx

ReportFooter.tsx

ReportSection.tsx

ReportNavigation.tsx

ReportRenderer.tsx

ReportFactory.ts

ReportRegistry.ts

ReportContext.tsx

components/

CoverPage.tsx

ExecutiveSummary.tsx

TableOfContents.tsx

KPISection.tsx

ChartSection.tsx

TableSection.tsx

RiskSection.tsx

RecommendationSection.tsx

AppendixSection.tsx

AuditTrailSection.tsx

EvidenceSection.tsx

templates/

ExecutiveTemplate.tsx

MigrationTemplate.tsx

ValidationTemplate.tsx

GovernanceTemplate.tsx

RiskTemplate.tsx

SecurityTemplate.tsx

AdministrationTemplate.tsx

shared/

ReportTypes.ts

ReportModels.ts

ReportTheme.ts

README.md
HTML Report Architecture

Design the framework around

Report Definition

↓

Template

↓

Sections

↓

Widgets

↓

Renderer

↓

HTML Output

Every report shall be metadata driven.

Report Types

Support

Executive Report

Migration Report

Validation Report

Governance Report

Risk Report

Security Report

Administration Report

Audit Report

AI Report

Only templates are created.

Standard Report Structure

Every report shall support

Cover Page

Executive Summary

Table of Contents

Overview

Key Metrics

Charts

Tables

Risk Analysis

Recommendations

Evidence

Audit Trail

Appendix

Footer
Report Templates

Create reusable templates.

Each template inherits from

ReportLayout

No duplicated layouts.

Report Registry

Create a registry responsible for registering report templates.

Example

Executive

↓

Migration

↓

Validation

↓

Governance

↓

Risk

↓

Security

↓

Administration

↓

Audit

↓

AI
Report Factory

Create

ReportFactory.ts

The factory dynamically creates report instances from metadata.

Avoid switch statements.

Report Renderer

Create

ReportRenderer.tsx

Responsibilities

Assemble templates
Render sections
Apply theme
Produce HTML

No export functionality.

Report Sections

Develop reusable report components.

Support

Cover Page
Executive Summary
KPI Section
Chart Section
Table Section
Risk Section
Recommendation Section
Evidence Section
Audit Trail
Appendix
Widget Integration

Reuse Widget Framework components.

Supported widgets

KPI Widget
Status Widget
Metric Widget
Chart Widget
Grid Widget
Timeline Widget
AI Summary Widget

Reports shall never duplicate widget implementations.

Theme Integration

Reuse Prompt 002 Theme System.

Reports automatically inherit

Fonts
Colours
Icons
Logos
Branding
Layout

Support future customer branding.

Responsive Behaviour

Support

Desktop
Tablet

Mobile rendering optional.

Accessibility

Support

WCAG AA
Semantic HTML
Keyboard Navigation
Screen Readers
High Contrast
Future Integration

Prepare integration with

PDF Reporting Engine
Excel Reporting Engine
Presentation Engine
Audit Pack Generator
AI Engine
Backend Reporting APIs

No implementation.

Deliverables

Generate

HTML Reporting Framework
Report Templates
Report Factory
Report Registry
Report Renderer
Shared Report Components
Documentation
Produce

Create

016_Create_HTML_Reporting_Framework_Report.md

Include

Templates Created
Components Created
Report Types
Theme Integration
Widget Integration
Accessibility
Overall Status
Ready for Prompt 017
Acceptance Criteria

✓ HTML Reporting Framework operational

✓ Report Registry operational

✓ Report Factory operational

✓ Report Renderer created

✓ Report templates reusable

✓ Widget Framework integrated

✓ Theme System integrated

✓ Responsive layouts implemented

✓ Accessibility implemented

✓ Ready for Prompt 017

Next Prompt

Prompt 017 — Create Report Centre

