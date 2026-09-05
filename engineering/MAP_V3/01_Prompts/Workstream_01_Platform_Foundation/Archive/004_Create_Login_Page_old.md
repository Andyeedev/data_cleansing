# MAP Nexus™ Enterprise Platform

# Prompt 004

## Create Authentication Module

**Version:** 2.0

**Prompt ID:** 004

**Workstream:** A — Portal & User Experience

**Status:** Approved

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

```
src/

authentication/

components/

pages/

services/

hooks/

types/

context/

```

---

# Pages

Create

```
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
```

Only

Login

is fully designed.

All other pages display professional placeholders.

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

```
--------------------------------------

 Illustration | Login Form

--------------------------------------
```

Left Side

Platform illustration

MAP branding

Key benefits

Right Side

Login form

Professional styling

Responsive layout

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

```
AuthContext.tsx
```

Include

```
Current User

Token Placeholder

Session Placeholder

Authentication Status

Permissions Placeholder
```

No implementation.

---

# Authentication Service

Create

```
AuthService.ts
```

Methods

```
login()

logout()

refresh()

forgotPassword()

resetPassword()

verifyMFA()

changePassword()
```

All methods contain placeholder implementations.

---

# Future Authentication Providers

Architecture must support

Microsoft Entra ID

Azure Active Directory

Google

GitHub

Local Authentication

Future providers configurable.

---

# Route Protection

Create

```
ProtectedRoute.tsx

PublicRoute.tsx
```

No authentication logic.

Only scaffolding.

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

Verify MFA page

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

Keyboard navigation

ARIA labels

Focus management

High contrast support

Screen reader support

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