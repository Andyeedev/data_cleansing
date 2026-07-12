# MAP Nexus™ Enterprise Platform

# Prompt 004 — Create Authentication Module

Project:
MAP V2 (Migration Assurance Platform)

Programme:
MAP V2 Engineering Programme

Workstream:
01 – Platform Foundation

Prompt:
004

Version:
2.0

Status:
Approved

---

# Purpose

Create the authentication module for the MAP Nexus™ Enterprise Portal.

This prompt establishes the complete authentication architecture.

Only the Login page is fully implemented.

All other authentication pages are professional placeholders ready for future implementation.

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

---

# Objective

Create a professional enterprise authentication experience.

The module shall support future integration with

• Microsoft Entra ID

• Azure Active Directory

• OAuth2

• OpenID Connect

• JWT

• Multi-Factor Authentication

No backend authentication is implemented.

---

# Folder Structure

Create

src/

authentication/

    components/

    pages/

    services/

    hooks/

    types/

    context/

---

# Pages

Create

Login

Logout

Forgot Password

Reset Password

Access Denied

Account Locked

Session Expired

Verify MFA

Change Password

Profile

Only

Login

is fully designed.

All other pages shall display professional placeholders.

---

# Login Page

Design a modern Microsoft-quality login experience.

Include

MAP Nexus™ Logo

Platform Name

Tagline

Username

Password

Remember Me

Sign In

Forgot Password

Version Number

Copyright

Support Link

No authentication logic.

---

# Login Layout

Desktop

Split Screen

--------------------------------------

Illustration | Login Form

--------------------------------------

Left Side

Platform Illustration

MAP Branding

Key Benefits

Right Side

Login Form

Professional Styling

Responsive Layout

---

# Branding

Use

Azure-inspired colour palette

Segoe UI

MAP Nexus™ branding

Theme System created in Prompt 002

No placeholder colours.

---

# Authentication Context

Create

AuthContext.tsx

Include

Current User

Token Placeholder

Session Placeholder

Authentication Status

Permissions Placeholder

No implementation.

---

# Authentication Service

Create

AuthService.ts

Methods

login()

logout()

refresh()

forgotPassword()

resetPassword()

verifyMFA()

changePassword()

All methods shall contain placeholder implementations.

---

# Future Authentication Providers

Architecture shall support

Microsoft Entra ID

Azure Active Directory

Google

GitHub

Local Authentication

Future providers configurable.

---

# Route Protection

Create

ProtectedRoute.tsx

PublicRoute.tsx

No authentication logic.

Scaffolding only.

---

# Session Management

Prepare architecture for

JWT

Refresh Token

Token Expiry

Session Timeout

Idle Detection

Remember Me

Future implementation only.

---

# Multi-Factor Authentication

Prepare

Verify MFA Page

Authenticator App

SMS

Email

Microsoft Authenticator

Architecture only.

---

# Error Pages

Create

Access Denied

Session Expired

Account Locked

Professional enterprise pages.

---

# Responsive Behaviour

Desktop

Tablet

Mobile

Fully responsive.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus Management

High Contrast Support

Screen Reader Support

---

# Deliverables

Generate

Authentication Module

Login Page

Authentication Context

Authentication Service

Protected Routes

Authentication Types

README

---

# Produce

Create

004_Create_Authentication_Module_Report.md

Include

Pages Created

Components Created

Authentication Architecture

Future Identity Providers

Responsive Behaviour

Accessibility

Overall Status

Ready for Prompt 005

---

# Acceptance Criteria

✓ Login page operational

✓ Authentication module created

✓ Authentication context exists

✓ Protected routes scaffolded

✓ Service layer created

✓ Future Entra ID support prepared

✓ No backend authentication implemented

✓ Responsive layout complete

✓ Enterprise appearance achieved

✓ Ready for Prompt 005

---

# Current Workstream

Workstream 01 – Platform Foundation

Progress

4 of 7

---

# Next Prompt

005_Create_Application_Shell

The Enterprise Application Shell shall provide the reusable layout, navigation and page framework inherited by every authenticated page throughout MAP.

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

08_Security_Architecture.md

11_Development_Standards.md

12_UI_Component_Architecture.md