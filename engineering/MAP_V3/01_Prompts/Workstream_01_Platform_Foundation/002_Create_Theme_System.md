# MAP Nexus™ Enterprise Platform

# Prompt 002 — Create Enterprise Theme System

Project:
MAP V2 (Migration Assurance Platform)

Programme:
MAP V2 Engineering Programme

Workstream:
01 – Platform Foundation

Prompt:
002

Version:
2.0

Status:
Approved

---

# Purpose

Create the official MAP Nexus™ Enterprise Design System.

This prompt MUST NOT invent a new visual identity.

Instead, it standardises the visual language already established across the existing MAP assets into reusable frontend components and theme tokens.

---

# Mandatory Standards

Follow

11_Development_Standards.md

Follow

01_Product_Architecture.md

Follow

02_Portal_Architecture.md

---

# Existing Design Sources

The design system shall inherit styling from:

• MAP Website Content Pack

• Product Brochure

• Presentation Engine

• Demo Package

• Microsoft Founders Hub material

• Existing MAP dashboards

These become the single source of truth.

---

# Objective

Produce a reusable enterprise theme that will be used by every React page and component.

No business logic.

No dashboard implementation.

Theme only.

---

# Theme Tokens

Create

theme/

    colours.ts

    typography.ts

    spacing.ts

    radius.ts

    borders.ts

    shadows.ts

    icons.ts

    animations.ts

    breakpoints.ts

    zindex.ts

---

# Brand Colours

Define

Primary Azure Blue

Secondary Blue

Success Green

Warning Amber

Error Red

Information Cyan

Neutral Grey Palette

Background Palette

Dark Mode Palette

---

# Typography

Use

Segoe UI

Fallback

Inter

Roboto

Arial

Standardise

Headings

Subtitles

Body

Captions

Buttons

Tables

Cards

---

# Component Library

Create reusable styling for

Primary Button

Secondary Button

Ghost Button

Icon Button

Cards

Executive KPI Cards

Status Badges

Alerts

Notifications

Forms

Inputs

Dropdowns

Tables

Charts

Dialogs

Panels

Navigation

Breadcrumbs

Page Headers

---

# Dashboard Standards

Define reusable styles for

Executive KPI

Trend Cards

Score Cards

Progress Indicators

Risk Ratings

Validation Status

Charts

Summary Panels

Report Sections

---

# Layout Standards

Standardise

Header

Sidebar

Footer

Page Width

Container Width

Card Width

Margins

Padding

Responsive Grid

---

# Icons

Standardise Lucide React icons.

Map icon usage for

Dashboard

Migration

Validation

Risk

Reports

AI

Settings

Help

Administration

---

# Responsive Behaviour

Desktop

Tablet

Mobile

All spacing and typography shall scale consistently.

---

# Accessibility

WCAG AA

Colour Contrast

Focus Indicators

Keyboard Navigation

ARIA-ready Components

---

# Dark Mode

Provide complete token definitions.

Implementation deferred.

---

# Deliverables

Generate

Enterprise Theme

Reusable Tokens

Component Styles

Design Tokens

Theme Documentation

---

# Produce

Create

002_Create_Theme_System_Report.md

Include

Colours

Typography

Components

Tokens

Accessibility

Responsive Behaviour

Overall Status

Ready for Prompt 003

---

# Acceptance Criteria

✓ Existing MAP branding preserved

✓ No new branding introduced

✓ Azure-inspired styling standardised

✓ Reusable design tokens created

✓ Component library defined

✓ Responsive standards defined

✓ Ready for enterprise implementation

---

# Current Workstream

Workstream 01 – Platform Foundation

Progress

2 of 7

---

# Next Prompt

003_Create_Enterprise_Navigation_System

The Enterprise Navigation System shall provide the reusable navigation architecture, menus, routing structure and responsive navigation framework used across the MAP platform.

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

11_Development_Standards.md

12_UI_Component_Architecture.md