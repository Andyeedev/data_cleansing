# MAP Nexus™ Enterprise Platform

# Prompt 005 — Create Enterprise Application Shell

Project:
MAP V2 (Migration Assurance Platform)

Programme:
MAP V2 Engineering Programme

Workstream:
01 – Platform Foundation

Prompt:
005

Version:
2.0

Status:
Approved

---

# Purpose

Create the Enterprise Application Shell for MAP Nexus™.

The Application Shell provides the persistent user interface framework that surrounds every page in the platform.

This prompt creates reusable layouts only.

No dashboards.

No reports.

No business logic.

---

# Mandatory Standards

Follow

11_Development_Standards.md

Follow

001_Create_React_Solution.md

Follow

002_Create_Theme_System.md

Follow

003_Create_Navigation.md

Follow

004_Create_Authentication_Module.md

---

# Objective

Create the reusable enterprise shell used across the entire MAP platform.

Every future page must inherit from this shell.

---

# Folder Structure

Create

src/

layout/

    ApplicationShell.tsx

    MainLayout.tsx

    AuthLayout.tsx

    BlankLayout.tsx

    Header.tsx

    Sidebar.tsx

    Footer.tsx

    Breadcrumb.tsx

    PageContainer.tsx

    PageHeader.tsx

    ContentArea.tsx

    StatusBar.tsx

    EnvironmentBanner.tsx

    QuickActions.tsx

    NotificationPanel.tsx

    GlobalSearch.tsx

    UserProfileMenu.tsx

    LoadingOverlay.tsx

    ErrorBoundary.tsx

---

# Application Shell Structure

--------------------------------------------------

Environment Banner

--------------------------------------------------

Header

--------------------------------------------------

Sidebar | Breadcrumb

        | Page Header

        | Quick Actions

        | Content Area

        | Footer

--------------------------------------------------

Every page shall use this layout.

---

# Header

Include

MAP Nexus™ Logo

Current Page

Global Search Placeholder

Notifications Placeholder

User Profile Placeholder

Theme Toggle

Version Placeholder

Environment Badge

---

# Sidebar

Reuse Prompt 003.

Support

Expanded

Collapsed

Mobile Drawer

Responsive Behaviour

---

# Breadcrumb

Automatically display

Home

>

Section

>

Current Page

---

# Page Header

Include

Title

Subtitle

Last Updated Placeholder

Optional Action Buttons

---

# Content Area

Create reusable responsive container.

Support

Cards

Tables

Charts

Forms

Reports

Dashboards

Scrollable Content

---

# Quick Actions

Create reusable placeholder panel.

Examples

Generate Report

Export

Refresh

Help

AI Assistant

No functionality.

---

# Notification Panel

Professional placeholder.

Future support

System Alerts

Migration Alerts

Validation Alerts

User Messages

---

# Global Search

Create placeholder.

Future support

Pages

Reports

Projects

Objects

Users

Documentation

AI Search

---

# User Profile Menu

Create dropdown.

Display

Name Placeholder

Role Placeholder

Settings

Profile

Logout

---

# Footer

Display

MAP Nexus™

Current Version

Environment

Copyright

Support Link

---

# Environment Banner

Support

Development

Testing

UAT

Production

Initially

Development

---

# Loading Overlay

Reusable full-screen loader.

Support

Page Loading

API Loading

Background Tasks

---

# Error Boundary

Create reusable React Error Boundary.

Display

Professional Error Page

Retry Button

Return Home

Support Reference Placeholder

---

# Layout Types

Create

MainLayout

Used for authenticated pages.

AuthLayout

Used for login and authentication.

BlankLayout

Used for splash pages and future public pages.

---

# Responsive Behaviour

Desktop

Persistent Sidebar

Tablet

Collapsible Sidebar

Mobile

Drawer Navigation

Touch-Friendly Controls

---

# Accessibility

WCAG AA

Keyboard Navigation

Focus Indicators

Semantic HTML

ARIA Labels

---

# Deliverables

Generate

Enterprise Application Shell

Layouts

Reusable Containers

Header

Footer

Breadcrumb

Loading Overlay

Error Boundary

README

---

# Produce

Create

005_Create_Application_Shell_Report.md

Include

Layouts Created

Components Created

Responsive Behaviour

Accessibility

Reusability

Overall Status

Ready for Prompt 006

---

# Acceptance Criteria

✓ Application Shell created

✓ MainLayout operational

✓ AuthLayout operational

✓ BlankLayout operational

✓ Header complete

✓ Footer complete

✓ Breadcrumb operational

✓ Error Boundary created

✓ Responsive behaviour implemented

✓ Ready for Prompt 006

---

# Current Workstream

Workstream 01 – Platform Foundation

Progress

5 of 7

---

# Next Prompt

006_Create_Analytics_Dashboard_Framework

The Analytics & Dashboard Framework shall provide the reusable dashboard infrastructure, layouts and presentation components that power every dashboard across MAP.

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

07_Reporting_Architecture.md

11_Development_Standards.md

12_UI_Component_Architecture.md