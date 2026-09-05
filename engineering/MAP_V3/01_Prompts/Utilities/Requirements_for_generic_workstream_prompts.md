My recommendation

Don't create a separate generator for every workstream.

Instead, create one reusable Enterprise Prompt Generation Framework that can generate any MAP implementation prompt simply by changing a small parameter block.

The AI version (Generate_022_025_Alt_v2.md) you built is about 90% there. I would generalise it so it can generate every future workstream, including:

Workstream 05 – Workflow & Administration
Workstream 06 – Integration
Workstream 07 – AI Provider Integration
Workstream 08 – Commercial Strategy
Future workstreams

This means you only ever maintain one prompt generator.

For Workstream 05

The only thing that changes is the parameter section.

For example:

Prompt ID

031

Prompt Name

Create User Management

Workstream

05 — Workflow & Administration

Version

5.0

Everything else should be discovered automatically.

The generator should determine

Instead of hard-coding AI-specific knowledge, it should infer the implementation from:

Architecture
00_Master_Roadmap

01_Product_Architecture

02_Portal_Architecture

03_Backend_Architecture

04_API_Architecture

07_Reporting_Architecture

11_Development_Standards
Existing Prompt Library
01_Prompts/

It should analyse

Existing portals

Existing widgets

Existing services

Existing APIs

Existing frameworks

Existing reusable components

Existing layouts

Existing themes

Existing navigation

Existing security

Existing reporting
Previous Prompt

Automatically determine

030
Next Prompt

Automatically determine

032
Workstream

Automatically determine

Workflow & Administration
Dependencies

Automatically determine

Example

Prompt 004 Authentication

Prompt 005 App Shell

Prompt 007 Widgets

Prompt 014 Security Portal

Prompt 015 Administration Portal

rather than being manually listed.

Then it generates
031_Create_User_Management.md

using the existing MAP template.

Exactly as we've been doing manually.

Then change parameters only

For Prompt 032

Prompt ID

032

Prompt Name

Create Role Management

Run again.

For Prompt 033

Prompt ID

033

Prompt Name

Create Tenant Management

Run again.

etc.

Why this is better

Your current AI generator is around 700 lines.

The Workflow generator would be another 700 lines.

Integration another 700.

Commercial another 700.

Very quickly you'll have multiple generators that are almost identical, which becomes difficult to maintain.

Instead, one generator can produce everything.

Small enhancement I'd make

I'd remove the AI-specific sections completely and replace them with a generic phase.

Instead of:

Purpose of Prompt 022

Create AI Assistant

use:

Determine Prompt Intent

Using

Prompt ID

Prompt Name

Master Roadmap

Existing Prompt Library

Architecture Documents

Determine

Purpose

Objectives

Functional Scope

Architecture

Folder Structure

Deliverables

Acceptance Criteria

Implementation Requirements

Future Integrations

This makes the framework truly generic.

Workstream 05 batch generator

Rather than creating five individual generators, I'd create one batch generator similar to your AI batch generator.

For example:

Generate_031_035_Workflow_Batch.md

with the configuration:

Prompt	Name
031	Create User Management
032	Create Role Management
033	Create Tenant Management
034	Create Subscriptions
035	Create System Settings

The framework then automatically generates all five prompts into separate output folders, performs validation, generates engineering reports, stops for your review, and only promotes them to 01_Prompts after your approval.