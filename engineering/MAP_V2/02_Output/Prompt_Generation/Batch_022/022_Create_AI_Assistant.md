MAP Nexus™ Enterprise Platform
Prompt 022
Create AI Assistant

Version: 5.0

Prompt ID: 022

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

---

Purpose

Create the enterprise AI Assistant for MAP Nexus™.

The AI Assistant provides a provider-independent conversational interface across every MAP portal.

It shall leverage the AI Framework created in Prompt 021.

The AI Assistant shall not implement any AI provider.

No Azure OpenAI implementation.

No OpenAI implementation.

No Claude implementation.

No Gemini implementation.

No Ollama implementation.

Provider selection remains the responsibility of Prompt 021.

---

Objective

Develop a reusable AI Assistant capable of providing intelligent conversational assistance throughout the MAP platform.

The framework shall support future enterprise-scale AI capabilities while remaining completely metadata driven and provider independent.

---

Design Principles

The AI Assistant shall be

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

The AI Assistant communicates through

Portal
↓
AI Assistant UI
↓
AI Framework (Prompt 021)
↓
Provider Adapter
↓
Configured Provider

The AI Assistant never communicates directly with an LLM.

All requests must pass through the AI Framework.

---

Folder Structure

Create

src/

ai/

assistant/

AIAssistant.tsx

AIConversation.tsx

AIConversationHistory.tsx

AIContextPanel.tsx

AISuggestionPanel.tsx

AICommandPalette.tsx

AIStatusIndicator.tsx

AINotificationPanel.tsx

AICitationPanel.tsx

AIUsageDisplay.tsx

types/

hooks/

services/

components/

widgets/

config/

utils/

README.md

---

AI Assistant Components

Create the following components:

AIAssistant

Main assistant container.

Provides conversation UI, suggestion panel, command palette.

AIConversation

Chat-style conversation interface.

Supports user input, assistant responses, typing indicators.

AIConversationHistory

Maintains conversation history.

Supports search, export, clear.

AIContextPanel

Displays current context.

Portal, tenant, user, session information.

AISuggestionPanel

Shows suggested prompts and actions.

Context-aware recommendations.

AICommandPalette

Keyboard-driven command interface.

Quick actions, navigation, report generation.

AIStatusIndicator

Shows AI service status.

Connected, disconnected, error states.

AINotificationPanel

AI-generated notifications.

Insights, recommendations, alerts.

AICitationPanel

Displays source citations for AI responses.

Links to reports, data sources, audit trails.

AIUsageDisplay

Shows token usage, cost estimates.

Session statistics.

---

Conversation Framework

Support

Multi-turn conversations

Context retention

Portal awareness

Role awareness

Tenant awareness

Session management

Conversation persistence

Export conversations

Clear conversations

---

Context Management

The AI Assistant shall automatically understand

Current User

Current Tenant

Current Portal

Current Report

Selected Dataset

Current Session

Conversation History

Permissions

Preferences

Context is provided by AI Framework (Prompt 021).

---

Portal Integration

The AI Assistant shall integrate with

Executive Portal

Operations Portal

Migration Portal

Governance Portal

Reporting Portal

Security Portal

Administration Portal

The assistant shall automatically understand which portal the user is currently working within.

---

Widget Integration

Reuse Prompt 007.

Support

AI Conversation Widget

AI Suggestion Widget

AI Insight Widget

AI Recommendation Widget

AI Status Widget

AI Notification Widget

No duplicated widget logic.

---

Provider Independence

The assistant shall explicitly state that it never communicates directly with an LLM.

All requests must pass through

AI Framework (Prompt 021)

↓

Provider Adapter

↓

Configured Provider

The generated prompt shall support

Azure OpenAI

OpenAI

Claude

Gemini

Ollama

LM Studio

Future Providers

without modification.

---

Suggested Prompts

Prepare context-aware suggestions for

Executive Portal

"Summarise migration status"

"Generate CIO report"

"Explain highest risks"

Operations Portal

"Show pending validations"

"Explain queue bottlenecks"

"Recommend next actions"

Migration Portal

"Summarise migration progress"

"Explain validation failures"

"Predict completion date"

Governance Portal

"Show compliance status"

"Explain policy violations"

"Recommend remediation"

Reporting Portal

"Generate executive summary"

"Explain report trends"

"Create custom report"

Security Portal

"Show security events"

"Explain threat patterns"

"Recommend improvements"

Administration Portal

"Show platform health"

"Explain configuration impact"

"Recommend optimisations"

---

Command Framework

Support

Natural language queries

Report generation commands

Navigation commands

Search commands

Export commands

Configuration commands

Audit commands

---

Security Model

Every AI request inherits user permissions.

The AI Assistant cannot expose information unavailable to the requesting user.

Role-based access remains fully enforced.

Prepare

Prompt Sanitisation

PII Protection

Data Classification

Role Filtering

Tenant Isolation

Audit Logging

---

AI Audit

Prepare reusable audit model for

Request ID

Timestamp

User

Tenant

Portal

Model

Provider

Prompt Template

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

Session Statistics

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

AI Insights (Prompt 023)

AI Recommendations (Prompt 024)

AI Report Generator (Prompt 025)

Workflow Engine

Knowledge Base

Document Generation Engine

No implementation.

---

Deliverables

Generate

AI Assistant Framework

Conversation UI

Context Management

Portal Integration

Widget Integration

Command Framework

Security Model

Audit Framework

Usage Framework

Documentation

Produce

Create

022_Create_AI_Assistant_Report.md

Include

Pages Created

Components Created

Portal Integrations

Widget Usage

Provider Independence

Security Model

Responsive Behaviour

Accessibility

Overall Status

Ready for Prompt 023

---

Acceptance Criteria

✓ AI Assistant operational

✓ Conversation UI created

✓ Context management implemented

✓ Portal integration complete

✓ Widget framework integrated

✓ Command framework created

✓ Security model prepared

✓ Audit framework prepared

✓ Usage framework prepared

✓ No AI provider implemented

✓ Provider independence preserved

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 023

---

Next Prompt

Prompt 023 — Create AI Insights
