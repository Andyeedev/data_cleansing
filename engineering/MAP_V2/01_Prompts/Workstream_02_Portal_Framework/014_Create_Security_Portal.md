MAP Nexus™ Enterprise Platform
Prompt 014
Create Security Portal

Version: 4.1

Prompt ID: 014

Workstream: 02 — Portal Development

Status: Approved

Prerequisites

Complete:

Workstream 01 — Platform Foundation
Prompt 000 — Prepare Development Environment
Prompt 001 — Create React Enterprise Solution
Prompt 002 — Create Enterprise Theme System
Prompt 003 — Create Enterprise Navigation System
Prompt 004 — Create Authentication Module
Prompt 005 — Create Enterprise Application Shell
Prompt 006 — Create Analytics & Dashboard Framework
Prompt 007 — Create Widget Framework
Workstream 02 — Portal Development
Prompt 008 — Create Portal Framework
Prompt 009 — Create Executive Portal
Prompt 010 — Create Operations Portal
Prompt 011 — Create Migration Portal
Prompt 012 — Create Governance Portal
Prompt 013 — Create Reporting Portal
Purpose

Create the enterprise Security Portal for MAP Nexus™.

The Security Portal provides a centralized interface for monitoring, configuring and managing all platform security capabilities.

This prompt creates only the presentation framework.

No backend implementation.

No authentication implementation.

No encryption implementation.

No APIs.

No database connectivity.

Objective

Create a reusable Security Portal capable of supporting enterprise security management.

The portal shall support future integration with:

Microsoft Entra ID
Azure Key Vault
OAuth2
OpenID Connect
JWT
MFA
Audit Services
SIEM Platforms
Secrets Management

The Security Portal shall be entirely constructed using the Widget Framework created in Prompt 007.

Folder Structure

Create

src/

portals/

security/

SecurityPortal.tsx

SecurityOverview.tsx

CredentialManagement.tsx

EncryptionManagement.tsx

KeyManagement.tsx

CertificateManagement.tsx

IdentityProviders.tsx

AuthenticationPolicies.tsx

MultiFactorAuthentication.tsx

SessionManagement.tsx

ApiSecurity.tsx

AuditLogs.tsx

SecurityEvents.tsx

ThreatMonitoring.tsx

ComplianceStatus.tsx

SecurityDashboard.tsx

components/

widgets/
Navigation

Extend the Portal Framework.

Security navigation shall include

Security Overview

Credentials

Encryption

Keys

Certificates

Identity Providers

Authentication

Multi-Factor Authentication

Sessions

API Security

Audit Logs

Security Events

Threat Monitoring

Compliance

Security Dashboard

Each page initially displays placeholder widgets.

Security Overview

Create an executive dashboard displaying placeholder widgets for

Security Health Score
Active Sessions
Failed Logins
MFA Adoption
Credential Status
Certificate Status
Encryption Status
Compliance Status
Threat Summary
Credential Management

Create placeholder pages supporting

Credential Repository
Credential Health
Credential Rotation
Secret References
Expiration Monitoring
Encryption Management

Create placeholder pages supporting

Encryption Status
Encryption Algorithms
Data Protection
Key Rotation
Encryption Policies
Key Management

Create placeholder pages supporting

Key Inventory
Key Rotation
Key Expiration
Azure Key Vault Integration
HSM Integration
Certificate Management

Create placeholder pages supporting

Certificates
Certificate Expiry
Trusted Certificates
TLS Configuration
Certificate Rotation
Identity Providers

Create placeholder pages supporting

Microsoft Entra ID
Azure Active Directory
OAuth Providers
OpenID Connect
Local Authentication
Authentication Policies

Create placeholder pages supporting

Password Policies
Session Policies
Login Policies
Access Policies
Lockout Policies
Multi-Factor Authentication

Create placeholder pages supporting

Authenticator Apps
SMS Verification
Email Verification
Hardware Tokens
MFA Compliance
Session Management

Create placeholder pages supporting

Active Sessions
Session Timeout
Concurrent Sessions
Session History
Forced Logout
API Security

Create placeholder pages supporting

API Keys
OAuth Clients
Service Accounts
API Rate Limits
API Audit
Audit Logs

Create placeholder pages supporting

Login History
Administrative Changes
Credential Activity
Configuration Changes
User Activity
Security Events

Create placeholder pages supporting

Critical Alerts
Failed Logins
Suspicious Activity
Security Incidents
Event Timeline
Threat Monitoring

Create placeholder pages supporting

Security Monitoring
Threat Intelligence
Risk Alerts
Security Dashboard
Incident Overview
Compliance Status

Create placeholder pages supporting

GDPR
ISO 27001
SOC 2
Internal Policies
Compliance Score
Security Dashboard

Create the operational workspace containing placeholder panels for

Threat Feed
Active Alerts
Security KPIs
AI Recommendations
Compliance Status
Security Timeline
Widget Usage

Construct every page using reusable widgets from Prompt 007.

Examples include

KPI Widget
Status Widget
Timeline Widget
Grid Widget
Notification Widget
Risk Widget
AI Summary Widget
Metric Widget

No duplicated dashboard code.

AI Integration

Prepare placeholder widgets for

AI Threat Summary
Security Recommendations
Risk Analysis
Compliance Insights
Predictive Threat Detection

No AI implementation.

Responsive Behaviour

Support

Desktop
Tablet
Mobile

Layouts shall adapt using the Dashboard Framework.

Accessibility

Support

Keyboard Navigation
Screen Readers
WCAG AA
ARIA Labels
High Contrast
Deliverables

Generate

Security Portal
Security Navigation
Security Dashboard
Security Workspace
Security Placeholder Pages
Documentation
Produce

Create

014_Create_Security_Portal_Report.md

Include

Pages Created
Widgets Used
Navigation Structure
Security Modules
Responsive Behaviour
Accessibility
Overall Status
Ready for Prompt 015
Acceptance Criteria

✓ Security Portal operational

✓ Security navigation complete

✓ Security Dashboard created

✓ Widget Framework fully utilised

✓ Placeholder pages created

✓ Security modules established

✓ Responsive behaviour implemented

✓ Accessibility implemented

✓ Ready for Prompt 015

Next Prompt

Prompt 015 — Create Administration Portal

The Administration Portal will provide enterprise administration capabilities including user management, tenant administration, roles and permissions, licensing, platform configuration, feature management, scheduling, maintenance and operational settings while leveraging the Portal Framework, Dashboard Framework and Widget Framework established throughout Workstreams 01 and 02.