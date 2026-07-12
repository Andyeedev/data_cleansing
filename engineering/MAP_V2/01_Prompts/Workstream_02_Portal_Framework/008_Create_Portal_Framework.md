# Prompt 008 — Create Portal Framework

Project:
MAP V2 (Migration Assurance Platform)

Workstream:
02 – Portal Framework

Prompt:
008

Prerequisites:

✔ Workstream 01 – Platform Foundation (001–007)


Status:
Portal Foundation

---

# Objective

Design and implement the Portal Framework that provides the common structure for every business portal within MAP.

The Portal Framework shall provide a reusable architecture for navigation, routing, permissions, layouts, widgets, metadata and portal configuration.

Every future portal shall inherit from this framework.

No portal shall duplicate layout or business framework code.

---

# Design Principles

The Portal Framework shall be:

• Metadata Driven

• Widget Driven

• Role Aware

• Tenant Aware

• Theme Aware

• Responsive

• AI Ready

• Extensible

---

# Create Folder Structure

src/

portal/

    framework/

        PortalShell.tsx

        PortalRenderer.tsx

        PortalHeader.tsx

        PortalContent.tsx

        PortalFooter.tsx

        PortalBreadcrumb.tsx

        PortalContext.tsx

        PortalLayout.tsx

        PortalLoader.tsx

        PortalError.tsx

    registry/

        PortalRegistry.ts

    metadata/

        PortalMetadata.ts

    permissions/

        PortalPermissions.ts

    routing/

        PortalRoutes.tsx

    hooks/

        usePortal.ts

        usePortalNavigation.ts

        usePortalPermissions.ts

    types/

        PortalDefinition.ts

        PortalContext.ts

        PortalProps.ts

---

# Portal Registry

Create a Portal Registry responsible for registering every portal available within MAP.

Each portal shall contain:

Portal ID

Portal Name

Description

Route

Icon

Category

Default Landing Page

Default Widgets

Roles

Permissions

Theme

Navigation Group

Enabled

Version

Owner

---

# Portal Metadata

Create a metadata model describing every portal.

Example

Executive Portal

Operations Portal

Migration Portal

Governance Portal

Reporting Portal

Security Portal

Administration Portal

AI Portal

Future portals shall require only metadata registration.

---

# Portal Renderer

Create a generic Portal Renderer.

Input

Portal Metadata

↓

Portal Registry

↓

Portal Framework

↓

Widget Renderer

↓

Rendered Portal

No business logic shall exist inside portal pages.

---

# Portal Layout

Every portal shall automatically inherit:

Header

Sidebar

Breadcrumb

Widget Area

Footer

Notifications

Context

Theme

No portal shall recreate these components.

---

# Portal Context

Implement Portal Context providing:

Current Portal

Current User

Current Tenant

Role

Permissions

Selected Navigation

Selected Widget

Theme

Notification Count

Current Route

---

# Portal Routing

Create centralised routing for all portals.

Example

/

↓

Executive

↓

Operations

↓

Migration

↓

Governance

↓

Reporting

↓

Security

↓

Administration

↓

AI

Portal routes shall not be hardcoded inside App.tsx.

---

# Portal Navigation

Support:

Sidebar Navigation

Top Navigation

Breadcrumbs

Quick Actions

Favourite Portals

Recently Visited

Future AI Shortcuts

---

# Portal Permissions

Every portal shall support:

Role Visibility

Tenant Visibility

Feature Flags

Subscription Checks

Permission Validation

Hidden Portals

Read Only Mode

---

# Widget Integration

Each portal shall consume widgets only through the Widget Framework.

Example

Portal

↓

Widget Metadata

↓

Widget Renderer

↓

Widget Components

Portal pages shall never instantiate widgets directly.

---

# Theme Integration

Portals shall inherit automatically from the Theme System.

Support:

Light Theme

Dark Theme

Client Branding

Future White Labelling

---

# Responsive Behaviour

Support:

Desktop

Tablet

Mobile

Collapsible Navigation

Adaptive Widget Layout

---

# Error Handling

Every portal shall provide:

Loading

Empty

Permission Denied

Offline

Error

Maintenance Mode

---

# Future Integration

Design the framework to integrate seamlessly with:

Presentation Engine

Reporting Engine

Workflow Engine

AI Engine

Notification Engine

Rule Engine

without requiring architectural changes.

---

# Deliverables

Create:

Portal Framework

Portal Registry

Portal Renderer

Portal Metadata

Portal Context

Portal Routing

Portal Permissions

Portal Layout

Portal Navigation

Documentation

Sample Registered Portals

---

# Success Criteria

✓ Portal Framework operational

✓ Portal Registry operational

✓ Portal Metadata implemented

✓ Routing centralised

✓ Permissions integrated

✓ Theme integration complete

✓ Widget integration complete

✓ Responsive behaviour implemented

✓ Ready for Portal Development

---

# Current Workstream

Workstream 02

Portal Framework

Progress

1 of 8

---

# Next Prompt

009_Create_Executive_Portal

The Executive Portal shall become the first production portal built entirely from the Portal Framework and Widget Framework.

It shall contain no duplicated layout or widget logic.

---

# Related Documents

00_Master_Roadmap.md

Workstream_02_Portal_Framework/README.md

00_Architecture/

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

05_Database_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md

11_Development_Standards.md

12_UI_Component_Architecture.md