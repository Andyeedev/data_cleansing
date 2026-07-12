MAP Nexus™ Enterprise Platform
Prompt 025
Create AI Report Generator

Version: 5.0

Prompt ID: 025

Workstream: 04 — AI Platform

Status: Draft — Pending Review

---

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

Workstream 03 — Presentation Engine
Prompt 016 — Create HTML Reporting Framework
Prompt 017 — Create Report Centre
Prompt 018 — Create Report Viewer
Prompt 019 — Create Report Scheduler
Prompt 020 — Create Report Distribution

Workstream 04 — AI Platform
Prompt 021 — Create AI Framework
Prompt 022 — Create AI Assistant
Prompt 023 — Create AI Insights
Prompt 024 — Create AI Recommendations

---

Purpose

Create the enterprise AI Report Generator for MAP Nexus™.

AI Report Generator provides intelligent report creation, narrative generation, and data storytelling across all MAP reporting.

It shall leverage the AI Framework created in Prompt 021 and integrate with the Reporting Framework created in Prompts 016-020.

The AI Report Generator shall not implement any AI provider.

Provider selection remains the responsibility of Prompt 021.

---

Objective

Develop a reusable AI Report Generator capable of creating intelligent reports, generating narratives, and providing data storytelling throughout the MAP platform.

The framework shall support future enterprise-scale report generation while remaining completely metadata driven and provider independent.

---

Design Principles

The AI Report Generator shall be

Provider Agnostic
Secure
Explainable
Metadata Driven
Tenant Aware
Role Aware
Extensible
Auditable
Stateless
API Driven

---

Architecture

The AI Report Generator communicates through

Portal
↓
AI Report Generator UI
↓
AI Framework (Prompt 021)
↓
Provider Adapter
↓
Configured Provider

The AI Report Generator never communicates directly with an LLM.

All requests must pass through the AI Framework.

---

Folder Structure

Create

src/

ai/

report-generator/

AIReportGenerator.tsx

ReportGeneratorDashboard.tsx

ReportGeneratorExplorer.tsx

NarrativeGenerator.tsx

DataStoryTeller.tsx

ChartGenerator.tsx

SummaryGenerator.tsx

ExecutiveSummary.tsx

TechnicalReport.tsx

ComplianceReport.tsx

CustomReportBuilder.tsx

ReportTemplateEngine.tsx

types/

hooks/

services/

components/

widgets/

config/

utils/

README.md

---

AI Report Generator Components

Create the following components:

AIReportGenerator

Main report generator container.

Provides dashboard, explorer, builders.

ReportGeneratorDashboard

Overview of generated reports.

KPI widgets, generation stats, quality metrics.

ReportGeneratorExplorer

Browse and search generated reports.

Filter by type, date, source, status.

NarrativeGenerator

Generates natural language narratives.

Data descriptions, trend explanations, insight summaries.

DataStoryTeller

Creates data stories.

Context-aware, audience-appropriate, visual.

ChartGenerator

Generates chart configurations.

Data-driven, interactive, exportable.

SummaryGenerator

Generates summaries.

Executive, technical, compliance summaries.

ExecutiveSummary

Executive-level summaries.

High-level insights, KPIs, recommendations.

TechnicalReport

Technical documentation.

Detailed analysis, methodology, findings.

ComplianceReport

Compliance documentation.

Regulatory requirements, audit trails.

CustomReportBuilder

Custom report creation.

Drag-and-drop, template-based, data-driven.

ReportTemplateEngine

Template management.

Reusable templates, customisation, versioning.

---

Report Types

Support

Executive Reports

Operational Reports

Migration Reports

Governance Reports

Security Reports

Compliance Reports

Technical Reports

Custom Reports

---

Narrative Generation

Support

Data Descriptions

Trend Explanations

Insight Summaries

Recommendation Narratives

Risk Narratives

Compliance Narratives

---

Data Storytelling

Support

Executive Stories

Operational Stories

Migration Stories

Governance Stories

Security Stories

Technical Stories

---

Chart Generation

Support

Bar Charts

Line Charts

Pie Charts

Scatter Plots

Heat Maps

Tree Maps

Funnel Charts

---

Summary Generation

Support

Executive Summaries

Technical Summaries

Compliance Summaries

Risk Summaries

Performance Summaries

---

Context Management

The AI Report Generator shall automatically understand

Current User

Current Tenant

Current Portal

Current Report

Selected Dataset

Historical Context

Permission Context

Audience Context

---

Portal Integration

The AI Report Generator shall integrate with

Executive Portal

Operations Portal

Migration Portal

Governance Portal

Reporting Portal

Security Portal

Administration Portal

---

Widget Integration

Reuse Prompt 007.

Support

AI Report Widget

AI Narrative Widget

AI Summary Widget

AI Chart Widget

AI Story Widget

AI Notification Widget

---

Provider Independence

All requests must pass through

AI Framework (Prompt 021)

↓

Provider Adapter

↓

Configured Provider

Support without modification

Azure OpenAI

OpenAI

Claude

Gemini

Ollama

LM Studio

Future Providers

---

Security Model

Every AI Report Generator request inherits user permissions.

The AI Report Generator cannot expose information unavailable to the requesting user.

Role-based access remains fully enforced.

---

AI Audit

Prepare reusable audit model for

Request ID

Timestamp

User

Tenant

Portal

Report Type

Model

Provider

Execution Time

Token Usage

Status

---

AI Usage

Prepare placeholders for

Token Consumption

Cost Tracking

Model Usage

Provider Usage

Report Generation Statistics

Quota Monitoring

---

Responsive Behaviour

Support

Desktop

Tablet

Mobile

---

Accessibility

Support

WCAG AA

Keyboard Navigation

Screen Readers

ARIA Labels

High Contrast

---

Future Integration

Prepare integration with

AI Assistant (Prompt 022)

AI Insights (Prompt 023)

AI Recommendations (Prompt 024)

Workflow Engine

Knowledge Base

No implementation.

---

Deliverables

Generate

AI Report Generator Framework

Narrative Generator

Data Story Teller

Chart Generator

Summary Generator

Executive Summary

Technical Report

Compliance Report

Custom Report Builder

Report Template Engine

Dashboard Integration

Widget Integration

Security Model

Audit Framework

Usage Framework

Documentation

Produce

Create

025_Create_AI_Report_Generator_Report.md

Include

Pages Created

Components Created

Report Types

Narrative Generation

Data Storytelling

Chart Generation

Summary Generation

Widget Usage

Responsive Behaviour

Accessibility

Overall Status

Workstream 04 Complete

---

Acceptance Criteria

✓ AI Report Generator operational

✓ Narrative generation created

✓ Data storytelling created

✓ Chart generation created

✓ Summary generation created

✓ Executive summary created

✓ Technical report created

✓ Compliance report created

✓ Custom report builder created

✓ Report template engine created

✓ Dashboard integration complete

✓ Widget framework integrated

✓ Security model prepared

✓ Audit framework prepared

✓ Usage framework prepared

✓ No AI provider implemented

✓ Provider independence preserved

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Workstream 04 complete

---

Next Prompt

None — Workstream 04 Complete
