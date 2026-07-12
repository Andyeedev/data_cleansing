# MAP Nexus™ Enterprise Platform

## AI Architecture

**Version:** 2.0

**Document:** 06_AI_Architecture.md

**Status:** Draft 1.0

**Classification:** Internal Architecture

---

# Purpose

This document defines the Artificial Intelligence architecture of the MAP Nexus™ Enterprise Platform.

Artificial Intelligence enhances the MAP platform by providing natural language interaction, intelligent summarisation, report generation and decision support.

AI is an enhancement layer.

It never replaces deterministic validation performed by the MAP Engine.

---

# AI Vision

MAP combines deterministic validation with enterprise Artificial Intelligence.

Validation answers:

"What happened?"

AI answers:

"What does it mean?"

"What should I do next?"

The two capabilities complement one another.

---

# Core Principle

The MAP Engine remains the authoritative migration validation engine.

Artificial Intelligence never validates data directly.

AI interprets the validated information already produced by MAP.

---

# Architectural Principles

The AI platform follows these principles.

## AI as a Business Service

Artificial Intelligence is implemented as an independent business service.

The Portal communicates with the AI Service.

The AI Service communicates with the backend APIs.

---

## AI Never Accesses the Database

AI never queries PostgreSQL directly.

All information is obtained through published APIs.

---

## Provider Independence

MAP is not tied to a specific AI provider.

Supported providers may include:

Azure OpenAI

OpenAI

Anthropic Claude

Google Gemini

DeepSeek

Llama

Future enterprise models

Providers may be changed without affecting the Portal.

---

## Human Validation

AI recommendations remain advisory.

Business decisions remain under user control.

MAP never performs autonomous migration activities.

---

# AI Architecture

```
Portal

↓

MAP Copilot

↓

AI Service

↓

REST APIs

↓

Business Services

↓

PostgreSQL
```

---

# AI Components

## MAP Copilot

The user-facing assistant.

Provides:

Natural language interaction

Guided navigation

Business explanations

Report generation

Migration insights

Executive summaries

---

## AI Orchestration Service

Coordinates all AI requests.

Responsibilities include:

Prompt construction

Context retrieval

Conversation management

Response formatting

Provider routing

Usage logging

---

## Prompt Library

Stores reusable prompts.

Categories include:

Executive Reports

Validation Summaries

Risk Analysis

Governance Reports

Migration Readiness

Data Quality

Business Explanations

---

## Context Service

Builds AI context using business APIs.

Collects:

Migration status

Validation results

Risk information

Reporting data

User permissions

Only relevant information is provided.

---

## Provider Connector

Abstracts external AI providers.

Responsibilities:

Authentication

API calls

Retries

Timeouts

Error handling

Usage tracking

No business logic exists within connectors.

---

# AI Capabilities

Version 2 provides:

Executive summaries

Migration readiness analysis

Validation explanations

Risk interpretation

Governance recommendations

Natural language search

Dashboard explanation

Interactive reporting

Future capabilities may include workflow automation.

---

# Enterprise Reporting

AI generates:

Executive Reports

Programme Summaries

Risk Assessments

Readiness Reports

Governance Summaries

Data Quality Reports

Reports use validated repository data.

---

# Natural Language Queries

Users may ask:

"Show migration readiness."

"What caused validation failures?"

"Summarise today's migration."

"Generate CIO report."

"Explain highest risks."

The AI Service retrieves relevant business information before generating a response.

---

# AI Workflow

```
User Question

↓

Portal

↓

MAP Copilot

↓

AI Service

↓

Backend APIs

↓

Business Services

↓

Repository

↓

Validated Data

↓

AI Provider

↓

Response

↓

Portal
```

---

# Security

Every AI request inherits user permissions.

The AI Service cannot expose information unavailable to the requesting user.

Role-based access remains fully enforced.

---

# Conversation Management

MAP supports contextual conversations.

Conversation history is maintained separately from business data.

Business records are never modified by conversations.

---

# Prompt Governance

Prompts are treated as managed assets.

Each prompt includes:

Identifier

Version

Purpose

Owner

Review Date

Approval Status

Future Prompt Library supports lifecycle management.

---

# Usage Monitoring

AI metrics include:

Requests

Tokens

Response Time

Provider Used

Errors

Estimated Cost

Business Category

These metrics support optimisation and cost control.

---

# AI Safety

MAP prevents:

Hallucinated business facts

Unauthorised data exposure

Execution of destructive actions

Modification of migration data

All AI outputs are advisory.

---

# Cost Management

The AI Service optimises cost through:

Prompt reuse

Context filtering

Provider selection

Token reduction

Caching

Model routing

Low-cost models may handle simple requests.

Premium models reserved for executive reports.

---

# Future Enhancements

Multi-agent collaboration

Workflow assistants

Voice interaction

Document intelligence

Meeting summaries

Predictive migration analytics

Autonomous recommendations

---

# Success Criteria

The AI architecture is complete when:

• AI remains provider-independent.

• Business APIs provide all context.

• AI never bypasses security.

• MAP Engine remains authoritative.

• Prompt governance is established.

• Cost optimisation strategy is defined.

---

# Related Documents

00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

05_Database_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md