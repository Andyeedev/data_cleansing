# MAP Nexus™ Enterprise Platform

# Prompt 001

## Create React Enterprise Solution

**Version:** 2.0

**Prompt ID:** 001

**Workstream:** A — Portal & User Experience

**Status:** Approved

---

# Purpose

Create the initial React Enterprise Portal for MAP Nexus™.

This prompt establishes the frontend foundation for all future development.

It creates the enterprise solution structure only.

It does NOT implement business functionality.

---

# Mandatory Standards

Follow:

11_Development_Standards.md

without exception.

---

# Dependencies

The following architecture documents must exist.

00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

04_API_Architecture.md

07_Reporting_Architecture.md

11_Development_Standards.md

---

# Objective

Create the enterprise React application that will become the MAP Portal.

The solution shall support:

Enterprise navigation

Authentication

Responsive layouts

Future dashboards

Future reporting

Future AI integration

Future administration

No business logic is implemented.

---

# Technology Stack

Framework

React

Language

TypeScript

Build Tool

Vite

Package Manager

npm

Styling

Tailwind CSS

Routing

React Router

Icons

Lucide React

Charts

Recharts

HTTP Client

Axios

Notifications

React Hot Toast

Forms

React Hook Form

Validation

Zod

Theme

Light/Dark support

---

# Solution Name

MAP Nexus™

Portal

---

# Folder Structure

Create

```
frontend/

├── public/

├── src/

│   ├── assets/

│   ├── components/

│   │

│   ├── common/

│   ├── navigation/

│   ├── layout/

│   ├── cards/

│   ├── charts/

│   ├── tables/

│   └── forms/

│

│   ├── pages/

│   │

│   ├── dashboard/

│   ├── migration/

│   ├── validation/

│   ├── governance/

│   ├── risk/

│   ├── reports/

│   ├── administration/

│   ├── ai/

│   └── authentication/

│

│   ├── hooks/

│

│   ├── services/

│

│   ├── api/

│

│   ├── types/

│

│   ├── context/

│

│   ├── config/

│

│   ├── utils/

│

│   ├── styles/

│

│   ├── App.tsx

│

│   └── main.tsx

│

├── package.json

├── tsconfig.json

├── vite.config.ts

└── README.md
```

---

# Navigation

Create placeholder navigation only.

Home

Executive Dashboard

Migration

Validation

Governance

Risk

Reports

Administration

AI Assistant

Settings

Help

Each page contains a professional placeholder.

No business implementation.

---

# Layout

Create reusable layout components.

Header

Sidebar

Footer

Breadcrumb

Page Title

Notification Area

Content Area

Loading Screen

Empty State

Error State

---

# Theme

Apply

Azure-inspired colours

Segoe UI

Responsive spacing

Rounded cards

Professional typography

Corporate appearance

Support Light Mode.

Dark Mode scaffold only.

---

# Authentication

Create placeholder authentication pages.

Login

Logout

Access Denied

Session Expired

Forgot Password (placeholder)

No authentication logic.

---

# Routing

Configure React Router.

All routes functional.

All pages load.

404 page included.

---

# Configuration

Create

```
config/

environment.ts

constants.ts

routes.ts

navigation.ts

theme.ts
```

No hard-coded URLs.

---

# API Layer

Create

```
api/

client.ts

interceptors.ts

endpoints.ts
```

Do NOT implement APIs.

Only scaffolding.

---

# Services

Create placeholder services.

MigrationService

ValidationService

GovernanceService

RiskService

ReportingService

AIService

AdminService

Each contains empty methods.

---

# Assets

Include

MAP logo placeholder

Favicon placeholder

Loading image placeholder

No branding images required yet.

---

# Error Handling

Create reusable components.

Error Page

Loading Spinner

Coming Soon

No Data

Access Denied

---

# Responsive Design

Desktop

Tablet

Mobile

Responsive layouts only.

---

# Accessibility

WCAG AA structure.

Semantic HTML.

Keyboard navigation scaffold.

ARIA-ready components.

---

# Build Verification

Verify

Project builds

No compile errors

No warnings

Routes work

Navigation works

Theme loads

Responsive layout functions

---

# Deliverables

Generate

React Enterprise Solution

Folder Structure

Routing

Navigation

Layout Components

Placeholder Pages

Configuration

README

Implementation Report

---

# Produce

Create

```
001_Create_React_Solution_Report.md
```

Include

Folders Created

Components Created

Pages Created

Dependencies Installed

Build Status

Issues

Overall Result

Ready for Prompt 002

---

# Acceptance Criteria

The solution is complete when:

✓ React project builds successfully

✓ TypeScript compiles without errors

✓ Tailwind CSS is configured

✓ Routing is operational

✓ Placeholder pages exist

✓ Layout components are reusable

✓ Folder structure matches architecture

✓ No business logic is implemented

✓ Ready for Backend integration

✓ Ready for Prompt 002