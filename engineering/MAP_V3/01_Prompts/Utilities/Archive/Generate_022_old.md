MAP Nexus™ Enterprise Platform
Prompt Generation Framework
Generate Enterprise Prompt

Version: 1.0

Status: Approved

Purpose: Prompt Generation Framework

Objective

Generate a complete MAP Nexus™ enterprise implementation prompt that conforms to the MAP Prompt Engineering Standards.

The generated prompt shall become a production-ready engineering specification suitable for direct implementation.

The generated prompt shall not be abbreviated, summarised or simplified.

Input Parameters

Generate the prompt using the following parameters.

Prompt ID

022

Prompt Name

Create AI Assistant

Workstream

04 — AI Platform

Version

5.0

Reference Documents

Read and use as engineering references.

Architecture

engineering/

└── MAP_V2/

    └── 00_Architecture/

00_Master_Roadmap.md
01_Product_Architecture.md
02_Portal_Architecture.md
03_Backend_Architecture.md
04_API_Architecture.md
07_Reporting_Architecture.md
11_Development_Standards.md
Existing Prompt Library

Read

engineering/

└── MAP_V2/

    └── 00_Prompts/

Use all completed prompts as architectural references.

Mandatory

Prompt 007

Prompt 021

Existing AI Framework

Treat

Prompt 021 — Create AI Framework

as completed.

Prompt 022 shall build upon Prompt 021.

It shall not duplicate Prompt 021 functionality.

Purpose of Prompt 022

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

Functional Scope

Generate a complete implementation prompt covering, at minimum:

Enterprise AI Assistant architecture
Conversation framework
Conversation UI
Conversation history
Context management
Prompt routing
Suggested prompts
Portal awareness
Role awareness
Tenant awareness
Session management
Widget integration
AI Assistant panels
Command execution framework
Future workflow invocation
Citation framework
Conversation audit
AI usage statistics
Security model
Accessibility
Responsive behaviour
Future integrations
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

Provider Independence

The prompt shall explicitly state that the assistant never communicates directly with an LLM.

All requests must pass through

AI Framework

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

Folder Structure

Generate a complete folder structure consistent with MAP standards.

Include

components

hooks

services

types

config

widgets

conversation

history

context

audit

security

README

Deliverables

Generate all sections normally used by MAP prompts.

Include

Metadata

Prerequisites

Purpose

Objective

Folder Structure

Architecture

Components

Configuration

Responsive Behaviour

Accessibility

Deliverables

Report

Acceptance Criteria

Next Prompt

Quality Requirements

The generated prompt shall

Follow the MAP Prompt template exactly
Match the quality of Prompts 016–021
Be implementation-ready
Be metadata driven
Avoid duplication
Reuse existing frameworks
Remain provider independent
Preserve enterprise architecture
Output Requirements

Produce

022_Create_AI_Assistant.md

Generate the prompt in full.

Do not summarise.

Do not truncate.

Do not omit sections.

Produce one complete production-ready prompt.

Validation

Validate

✓ Prompt numbering correct

✓ Workstream correct

✓ Folder references correct

✓ Architecture consistent

✓ Prompt 021 reused

✓ Prompt 007 reused

✓ No provider lock-in

✓ No duplicated functionality

✓ Enterprise standards followed

✓ Ready for implementation

Success Criteria

The prompt is complete when

✓ A full production-ready Prompt 022 has been generated

✓ The AI Assistant builds upon Prompt 021

✓ No functionality is duplicated

✓ Enterprise architecture is preserved

✓ Provider independence is maintained

✓ The generated prompt matches the quality and structure of the existing MAP prompt library