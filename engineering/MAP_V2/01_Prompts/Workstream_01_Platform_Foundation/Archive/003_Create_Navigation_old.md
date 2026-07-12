# MAP Nexus™ Enterprise Platform

# Prompt 003

## Create Enterprise Navigation System

**Version:** 2.0

**Prompt ID:** 003

**Workstream:** A — Portal & User Experience

**Status:** Approved

---

# Purpose

Create the enterprise navigation framework for the MAP Nexus™ Portal.

This prompt builds the navigation architecture only.

It MUST NOT implement business logic.

It MUST NOT implement authentication.

It MUST NOT implement dashboards.

---

# Mandatory Standards

Follow

11_Development_Standards.md

Follow

02_Portal_Architecture.md

Follow

002_Create_Theme_System.md

---

# Objective

Create a reusable enterprise navigation system suitable for large-scale SaaS applications.

The navigation must support:

• Future Role-Based Security

• Desktop

• Tablet

• Mobile

• AI integration

• Reporting

• Administration

---

# Folder Structure

Create

```
src/

navigation/

NavigationProvider.tsx

Sidebar.tsx

TopNavigation.tsx

Footer.tsx

Breadcrumb.tsx

NavigationItem.tsx

NavigationGroup.tsx

MobileNavigation.tsx

NavigationContext.tsx

navigation.config.ts

navigation.types.ts
```

---

# Navigation Areas

Create the following navigation structure.

```
Home

Executive Dashboard

Migration

Validation

Governance

Risk

Reporting

AI Assistant

Administration

Settings

Help
```

Each area contains placeholder pages only.

---

# Enterprise Navigation Model

The navigation shall support

```
Navigation Group

↓

Navigation Section

↓

Navigation Item

↓

Page

↓

Action
```

Example

```
Migration

    Migration Overview

    Migration Jobs

    Migration History

    Migration Settings
```

Only placeholders are required.

---

# Navigation Configuration

Create

navigation.config.ts

Store all navigation items centrally.

No hard-coded menu definitions.

Example

```
Title

Icon

Route

Permission

Visible

Children

Badge

Description
```

---

# Icons

Use Lucide React.

Suggested mapping

Home

LayoutDashboard

Migration

Database

Validation

BadgeCheck

Governance

ShieldCheck

Risk

TriangleAlert

Reporting

BarChart3

AI Assistant

Bot

Administration

Settings2

Settings

Cog

Help

CircleHelp

---

# Sidebar

Create

Collapsible Sidebar

Expanded Mode

Collapsed Mode

Active Highlight

Section Headers

Icons

Hover Effects

Responsive Behaviour

---

# Top Navigation

Include

MAP Logo

Page Title

Search Placeholder

Notification Placeholder

User Placeholder

Theme Toggle Placeholder

---

# Breadcrumb

Support

Home

↓

Section

↓

Page

Example

```
Home

>

Migration

>

Migration Overview
```

Automatically generated from routes.

---

# Footer

Display

MAP Nexus™

Version Placeholder

Copyright

Environment Placeholder

---

# Navigation Context

Create

NavigationContext

Provide

Current Page

Selected Menu

Breadcrumb

Sidebar State

Mobile State

Future Permissions

---

# Mobile Navigation

Create

Slide-out Drawer

Bottom Navigation (optional scaffold)

Responsive Menu

Touch Friendly Controls

---

# Navigation Types

Create

navigation.types.ts

Include

NavigationItem

NavigationGroup

NavigationPermission

NavigationBadge

NavigationRoute

---

# Future Role Support

The navigation architecture must support

Executive

Project Manager

Migration Lead

Data Steward

Business User

DBA

Auditor

Administrator

Initially all roles have identical visibility.

Filtering logic will be added later.

---

# Notifications

Create placeholder

Notification Bell

Unread Badge

Notification Panel

No implementation.

---

# Search

Create placeholder

Global Search

Command Palette

Keyboard Shortcut Placeholder

No search logic.

---

# Accessibility

Support

Keyboard Navigation

ARIA Labels

Screen Readers

Focus Indicators

High Contrast

---

# Responsive Behaviour

Desktop

Permanent Sidebar

Tablet

Collapsible Sidebar

Mobile

Drawer Navigation

---

# Deliverables

Generate

Enterprise Navigation

Sidebar

Top Navigation

Footer

Breadcrumb

Navigation Context

Configuration

Responsive Navigation

README

---

# Produce

Create

003_Create_Navigation_Report.md

Include

Components Created

Navigation Structure

Responsive Support

Accessibility

Future RBAC Support

Overall Result

Ready for Prompt 004

---

# Acceptance Criteria

✓ Sidebar operational

✓ Top navigation operational

✓ Footer operational

✓ Breadcrumb operational

✓ Navigation configuration centralised

✓ Placeholder routes working

✓ Responsive behaviour implemented

✓ Future RBAC supported

✓ No authentication implemented

✓ Ready for Prompt 004