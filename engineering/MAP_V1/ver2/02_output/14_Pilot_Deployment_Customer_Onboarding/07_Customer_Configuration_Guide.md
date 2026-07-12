# MAP Customer Configuration Guide

| Field | Value |
|---|---|
| **Document Title** | MAP Customer Configuration Guide |
| **Document ID** | MAP-DOC-PCG-001 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Confidential — Customer Use |
| **Owner** | MAP Platform Engineering |
| **Applicable To** | Customer Administrators, MAP Onboarding Engineers, Customer Success Managers |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Content](#2-content)
   - 2.1 [Organisation Setup](#21-organisation-setup)
   - 2.2 [Projects](#22-projects)
   - 2.3 [Users](#23-users)
   - 2.4 [Roles](#24-roles)
   - 2.5 [Permissions](#25-permissions)
   - 2.6 [Policies](#26-policies)
   - 2.7 [Reporting](#27-reporting)
   - 2.8 [Notifications](#28-notifications)
   - 2.9 [Security Settings](#29-security-settings)
   - 2.10 [Configuration Templates](#210-configuration-templates)
   - 2.11 [Best Practices](#211-best-practices)
3. [Dependencies](#3-dependencies)
4. [References](#4-references)
5. [Revision History](#5-revision-history)
6. [Approval](#6-approval)
7. [Appendices](#7-appendices)

---

## 1. Purpose

This guide provides step-by-step instructions for configuring the Migration Assurance Platform (MAP) following pilot deployment. It is intended for Customer Administrators and MAP Onboarding Engineers responsible for tailoring the platform to the customer's organisational structure, compliance requirements, and operational workflows.

### 1.1 Scope

This document covers every configurable surface within MAP that a customer administrator may interact with during and after onboarding. It does not cover underlying infrastructure provisioning, which is handled by the MAP Platform Operations team.

### 1.2 Intended Audience

| Role | Use This Guide To |
|---|---|
| Customer Administrator | Configure organisation, projects, users, roles, and policies |
| MAP Onboarding Engineer | Guide customers through configuration steps and validate setup |
| Customer Success Manager | Understand configuration capabilities and advise on best practices |
| Security / Compliance Officer | Review security settings, policies, and audit configurations |

### 1.3 Guiding Principles

All configuration decisions should adhere to the following principles:

1. **Least Privilege** — Grant only the minimum permissions required for each role.
2. **Segregation of Duties** — No single user should hold conflicting privileges.
3. **Defence in Depth** — Layer security controls across authentication, authorisation, and auditing.
4. **Auditability** — Every configuration change must be traceable to an actor and a timestamp.
5. **Compliance by Design** — Configure retention, access, and reporting to meet regulatory obligations from day one.

---

## 2. Content

### 2.1 Organisation Setup

The Organisation is the top-level entity in MAP. Every other object (projects, users, roles, policies) is scoped to an organisation.

#### 2.1.1 Company Profile

**Navigation:** `Administration > Organisation > Company Profile`

| Field | Required | Description | Example |
|---|---|---|---|
| Organisation Name | Yes | Legal name of the organisation | Acme Financial Services Ltd |
| Trading Name | No | Doing-business-as name | Acme FS |
| Registration Number | Yes | Company registration / LEI | LEI-1234567890ABCDEF |
| Registered Address | Yes | Jurisdiction of registration | 100 Park Lane, London, W1K 1XX |
| Primary Contact | Yes | Executive sponsor for the MAP deployment | Jane Smith, CTO |
| Industry Classification | Yes | NAICS / SIC code for template selection | 52211 — Depository Credit Intermediation |
| Data Residency | Yes | Preferred region for data storage | EU-West (Frankfurt) |
| Contract Reference | Yes | Link to the MAP SaaS agreement | MAP-AGR-2026-0042 |

**Configuration Steps:**

1. Navigate to `Administration > Organisation > Company Profile`.
2. Enter all required fields. Fields marked with an asterisk (*) cannot be changed after initial save without a support ticket.
3. Upload the organisation logo (PNG or SVG, max 2 MB) for branding.
4. Set the default timezone (used for scheduling and reporting).
5. Click **Save**. A confirmation audit entry is created automatically.

#### 2.1.2 Branding

**Navigation:** `Administration > Organisation > Branding`

Branding controls the visual identity presented to end-users within the MAP portal.

| Setting | Options | Default | Description |
|---|---|---|---|
| Logo | PNG, SVG | MAP default logo | Displayed in header and login page |
| Primary Colour | Hex code | `#0052CC` | Used for navigation bar and buttons |
| Secondary Colour | Hex code | `#172B4D` | Used for sidebar and footers |
| Favicon | ICO, PNG (32x32) | MAP default | Browser tab icon |
| Login Page Background | Image (JPG, PNG) | Solid colour | Custom background on login screen |
| Email Theme | Light, Dark | Light | Theme for system-generated emails |
| Custom CSS | CSS string | None | Advanced branding override (support ticket required) |

**Example Branding Configuration:**

```json
{
  "branding": {
    "logo": "acme-logo.svg",
    "primaryColour": "#003366",
    "secondaryColour": "#660033",
    "favicon": "acme-favicon.ico",
    "loginBackground": "acme-login-bg.jpg",
    "emailTheme": "light",
    "customCSS": null
  }
}
```

#### 2.1.3 Organisation-Level Settings

**Navigation:** `Administration > Organisation > Settings`

| Category | Setting | Options | Default | Notes |
|---|---|---|---|---|
| General | Default Language | en-US, en-GB, fr-FR, de-DE, es-ES | en-GB | Affects UI and system emails |
| General | Date Format | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD | DD/MM/YYYY | Display format for dates |
| General | Time Format | 12h, 24h | 24h | Display format for times |
| General | Fiscal Year Start | Month | January | Used in financial reporting |
| Security | Password Policy | Basic, Standard, Strong, Custom | Standard | See Section 2.9 |
| Security | Session Timeout | 15m – 24h | 30 minutes | Idle timeout before re-authentication |
| Security | Require SSO | Yes / No | No | Enforce SSO for all users |
| Integration | API Rate Limit | 100 – 10000 req/min | 1000 | Per-organisation API throttle |
| Integration | Webhook Retention | 7 – 90 days | 30 days | How long webhook delivery logs are kept |
| Data | Soft Delete Retention | 30 – 365 days | 90 days | How long deleted objects are recoverable |
| Data | Audit Log Retention | 90 – 2555 days | 730 days | 2 years default for regulatory compliance |

---

### 2.2 Projects

Projects are the primary container for migration work. Each project encapsulates source systems, target systems, validation rules, and team assignments.

#### 2.2.1 Project Creation

**Navigation:** `Projects > New Project`

| Field | Required | Description |
|---|---|---|
| Project Name | Yes | Descriptive name (e.g., "Core Banking Migration — Phase 1") |
| Project Code | Yes | Unique alphanumeric identifier (e.g., CBM-P1) |
| Description | Yes | Scope and objectives of the migration |
| Start Date | Yes | Planned project commencement |
| Target End Date | Yes | Planned project completion |
| Project Manager | Yes | Assigned project lead (must be an existing MAP user) |
| Priority | Yes | Critical, High, Medium, Low |
| Category | Yes | Infrastructure, Application, Data, Platform |
| Source System(s) | Yes | One or more source systems to migrate from |
| Target System(s) | Yes | One or more target systems to migrate to |

**Project Creation via API:**

```json
POST /api/v1/projects
{
  "name": "Core Banking Migration — Phase 1",
  "code": "CBM-P1",
  "description": "Migration of core banking platform from LegacyCore v3 to ModernBank v7",
  "startDate": "2026-08-01",
  "targetEndDate": "2026-12-31",
  "projectManager": "user.jane.smith@acme.com",
  "priority": "Critical",
  "category": "Platform",
  "sourceSystems": ["LEGACY-CORE-3.2"],
  "targetSystems": ["MODERN-BANK-7.0"],
  "tags": ["phase-1", "core-banking", "regulatory-critical"]
}
```

#### 2.2.2 Project Settings

**Navigation:** `Projects > [Project Name] > Settings`

| Setting | Options | Default | Description |
|---|---|---|---|
| Project Visibility | Organisation, Restricted, Private | Organisation | Who can see this project |
| Allow Cross-Project Data | Yes / No | No | Enable data sharing between projects |
| Auto-Validation | Yes / No | Yes | Run validation rules automatically on data load |
| Notification Channel | Email, In-App, Both, None | Both | How project updates are delivered |
| Work Hours | Custom schedule | 09:00–17:00 Mon–Fri | Defines business hours for SLA calculations |
| Escalation Timeout | 1h – 72h | 4h | Time before unanswered alerts escalate |
| Approval Workflow | Manual, Automated, Hybrid | Manual | How data migration waves are approved |
| Rollback Policy | Automatic, Manual, Disabled | Manual | Behaviour when validation failures exceed threshold |

#### 2.2.3 Project Permissions

Permissions within a project are controlled by role assignments. See Section 2.4 and Section 2.5 for the full permission model.

| Permission | Viewer | Contributor | Validator | Project Manager | Administrator |
|---|---|---|---|---|---|
| View project dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| View migration data | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload migration data | ❌ | ✅ | ✅ | ✅ | ✅ |
| Execute validation rules | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve migration wave | ❌ | ❌ | ❌ | ✅ | ✅ |
| Modify project settings | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete project | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage project members | ❌ | ❌ | ❌ | ✅ | ✅ |

---

### 2.3 Users

#### 2.3.1 User Management

**Navigation:** `Administration > Users`

MAP supports three user types:

| User Type | Authentication | Description |
|---|---|---|
| Internal | Entra ID (SSO) or local | Employee of the customer organisation |
| External / Guest | Entra ID B2B or invitation | Third-party consultant, auditor, or vendor |
| Service Principal | Client credentials | API integrations and automation |

**Adding a User:**

1. Navigate to `Administration > Users > Add User`.
2. Enter email address. MAP checks whether the user already exists.
3. Select user type (Internal, Guest, Service Principal).
4. Assign one or more roles (see Section 2.4).
5. Assign to one or more projects.
6. Set account status: **Active**, **Invited**, or **Disabled**.
7. Click **Send Invitation** (for new users) or **Create Account** (for SSO users).

**Bulk User Import:**

Users can be imported via CSV. The template is available at `Administration > Users > Import > Download Template`.

```csv
Email,FirstName,LastName,Department,Role,Project,Status
jane.smith@acme.com,Jane,Smith,Engineering,Project Manager,CBM-P1,Active
john.doe@acme.com,John,Doe,Compliance,Validator,CBM-P1,Active
consultant@partner.com,Alice,Johnson,External,Viewer,CBM-P1,Invited
```

#### 2.3.2 User Profiles

Each user has a profile containing:

| Field | Editable By | Description |
|---|---|---|
| Display Name | User / Admin | How the user's name appears in MAP |
| Avatar | User | Profile picture (JPG/PNG, max 1 MB) |
| Email | Admin only | Primary email (SSO identifier) |
| Phone | User | Contact number (optional, used for MFA) |
| Department | Admin | Organisational department |
| Job Title | User / Admin | Role within the organisation |
| Timezone | User | Personal timezone override |
| Language | User | UI language preference |
| Notification Preferences | User | Email, in-app, mobile push settings |

#### 2.3.3 User Preferences

**Navigation:** `User Menu > Preferences`

| Preference | Options | Default |
|---|---|---|
| Default Dashboard | Any saved dashboard | Overview |
| Table Row Count | 25, 50, 100, 250 | 50 |
| Date Format | Inherit from org, custom | Inherit |
| Time Format | Inherit from org, custom | Inherit |
| Email Digest | Real-time, Daily, Weekly, Never | Real-time |
| Compact Mode | On / Off | Off |
| Keyboard Shortcuts | On / Off | On |

---

### 2.4 Roles

#### 2.4.1 Built-in Role Definitions

MAP ships with the following built-in roles. These cannot be modified or deleted but can be extended with custom roles.

| Role | Scope | Description |
|---|---|---|
| **Organisation Administrator** | Organisation-wide | Full control over all settings, users, and projects |
| **Project Administrator** | Per-project | Full control within assigned projects |
| **Project Manager** | Per-project | Manage project lifecycle, members, and approvals |
| **Validator** | Per-project | Execute and review validation rules |
| **Contributor** | Per-project | Upload and modify migration data |
| **Viewer** | Per-project | Read-only access to project data and dashboards |
| **Auditor** | Organisation-wide (read-only) | Access to audit logs, compliance reports, and security settings |
| **Billing Administrator** | Organisation | Manage subscriptions, invoices, and payment methods |
| **Security Administrator** | Organisation | Configure security policies, SSO, MFA, and conditional access |
| **Integration Administrator** | Organisation | Manage API keys, webhooks, and external integrations |

#### 2.4.2 Custom Roles

Custom roles are created to fill gaps between built-in roles or to enforce organisation-specific separation of duties.

**Creating a Custom Role:**

1. Navigate to `Administration > Roles > Create Custom Role`.
2. Define role metadata (name, description, scope).
3. Select permission sets from the permission matrix (see Section 2.5).
4. Define resource scope (organisation-wide, project-specific, or environment-specific).
5. Set role hierarchy position relative to built-in roles.
6. Click **Save & Publish**.

**Custom Role Example — Compliance Reviewer:**

```json
{
  "name": "Compliance Reviewer",
  "description": "Read-only access to validation results and audit logs for compliance review",
  "scope": "Organisation",
  "permissions": [
    "project.read",
    "validation.read",
    "audit.read",
    "report.read",
    "report.generate"
  ],
  "denyPermissions": [
    "project.write",
    "project.delete",
    "user.manage",
    "settings.manage"
  ],
  "hierarchyPosition": 5,
  "maxAssignments": 10
}
```

#### 2.4.3 Role Hierarchy

Role hierarchy determines default access levels. Higher roles inherit all permissions of lower roles within their scope.

```
Organisation Administrator (10)
├── Security Administrator (9)
├── Integration Administrator (8)
├── Billing Administrator (7)
├── Auditor (6)
├── Compliance Reviewer [Custom] (5)
├── Project Administrator (4)
├── Project Manager (3)
├── Validator (2)
├── Contributor (1)
└── Viewer (0)
```

| Hierarchy Level | Role | Can Assign Roles At Level |
|---|---|---|
| 10 | Organisation Administrator | All levels |
| 9 | Security Administrator | 0–9 |
| 8 | Integration Administrator | 0–8 |
| 7 | Billing Administrator | 0–7 |
| 6 | Auditor | 0–6 |
| 5 | Compliance Reviewer | 0–5 |
| 4 | Project Administrator | 0–4 |
| 3 | Project Manager | 0–3 |
| 2 | Validator | 0–2 |
| 1 | Contributor | 0–1 |
| 0 | Viewer | 0 |

---

### 2.5 Permissions

#### 2.5.1 Permission Matrix

The full permission matrix is organised by domain. Each permission follows the pattern `<domain>.<action>`.

| Domain | Permissions | Description |
|---|---|---|
| `organisation` | `read`, `write`, `delete`, `settings.manage` | Organisation-level operations |
| `project` | `read`, `write`, `delete`, `create`, `archive` | Project lifecycle operations |
| `user` | `read`, `write`, `delete`, `invite`, `manage` | User management operations |
| `role` | `read`, `write`, `delete`, `assign` | Role management operations |
| `validation` | `read`, `execute`, `configure`, `approve` | Validation rule operations |
| `data` | `read`, `write`, `upload`, `download`, `delete`, `export` | Data operations |
| `report` | `read`, `generate`, `schedule`, `export`, `delete` | Reporting operations |
| `audit` | `read`, `export` | Audit log operations |
| `notification` | `read`, `configure`, `send` | Notification operations |
| `integration` | `read`, `write`, `delete`, `execute` | Integration and webhook operations |
| `billing` | `read`, `manage` | Billing and subscription operations |
| `security` | `read`, `write`, `configure`, `audit` | Security policy operations |
| `policy` | `read`, `write`, `delete`, `enforce` | Data and compliance policy operations |

#### 2.5.2 Access Control Model

MAP uses a hierarchical RBAC model with the following components:

1. **Role Assignment** — Users are assigned roles at the organisation or project level.
2. **Permission Inheritance** — Higher-level roles inherit permissions from lower-level roles.
3. **Deny Assignments** — Explicit deny permissions override any allow permissions.
4. **Resource Scoping** — Permissions can be scoped to specific projects, environments, or data classifications.
5. **Temporal Constraints** — Permissions can have start/end dates (e.g., for temporary access).

**Access Decision Logic:**

```
IF deny permission matches → DENY
ELSE IF allow permission matches → ALLOW
ELSE → DENY (default deny)
```

#### 2.5.3 Restrictions

| Restriction Type | Description | Example |
|---|---|---|
| IP Restriction | Limit access to specific IP ranges | Only office and VPN IPs |
| Time Restriction | Limit access to specific hours | Business hours only |
| Data Classification Restriction | Prevent access to data above a clearance level | Restrict PII access |
| Geographic Restriction | Limit access from specific regions | Block access from outside EU/UK |
| Device Restriction | Require managed device | Only Intune-enrolled devices |
| Concurrent Session Limit | Maximum simultaneous sessions per user | Max 2 active sessions |

---

### 2.6 Policies

#### 2.6.1 Data Policies

**Navigation:** `Administration > Policies > Data`

Data policies define how migration data is handled throughout its lifecycle.

| Policy | Options | Default | Description |
|---|---|---|---|
| Data Classification | Public, Internal, Confidential, Restricted | Internal | Default classification for new data |
| Encryption at Rest | AES-128, AES-256, Customer-managed key | AES-256 | Encryption standard for stored data |
| Encryption in Transit | TLS 1.2, TLS 1.3 | TLS 1.3 | Minimum TLS version |
| Data masking | None, Partial, Full | None | Default masking for sensitive fields |
| Anonymisation | None, Pseudonymise, Anonymise | None | How PII is handled in non-production |
| Cross-border Transfer | Allowed, Restricted, Blocked | Restricted | Controls data transfer between regions |
| DLP Policy | Monitor, Block, Alert | Monitor | Data Loss Prevention behaviour |

**Data Classification Matrix:**

| Classification | Storage | Access | Encryption | Retention | Audit |
|---|---|---|---|---|---|
| Public | Any region | All users | At rest optional | Unlimited | Standard |
| Internal | Home region | Internal users | AES-256 | 7 years | Enhanced |
| Confidential | Home region | Named users only | AES-256 + field-level | 7 years | Full |
| Restricted | Isolated tenant | Named users + MFA | AES-256 + customer key | Per regulation | Full + alerting |

#### 2.6.2 Retention Policies

**Navigation:** `Administration > Policies > Retention`

| Object Type | Minimum | Maximum | Default | Notes |
|---|---|---|---|---|
| Audit Logs | 90 days | 2555 days (7 years) | 730 days | Regulatory requirement |
| Migration Data | 30 days | Unlimited | 365 days | Project-specific override available |
| Validation Results | 30 days | 1825 days (5 years) | 365 days | |
| User Accounts (disabled) | 30 days | 365 days | 90 days | After which account is anonymised |
| Reports | 30 days | Unlimited | 365 days | |
| Webhook Logs | 7 days | 90 days | 30 days | |
| Files / Attachments | 30 days | Unlimited | 365 days | |
| Notifications | 7 days | 90 days | 30 days | |

#### 2.6.3 Compliance Policies

**Navigation:** `Administration > Policies > Compliance`

| Regulation | MAP Support | Required Configurations |
|---|---|---|
| GDPR | Yes | Data residency, retention, right to erasure workflows, DPO assignment |
| SOX | Yes | Audit log integrity, segregation of duties, change approval workflows |
| PCI DSS | Yes | Cardholder data detection, encryption enforcement, network segmentation tagging |
| HIPAA | Yes | PHI detection, BAA tracking, access review automation |
| Basel III | Yes | Data lineage tracking, validation completeness reporting |
| UK FCA | Yes | Transaction reporting configuration, regulatory submission tracking |

**Compliance Policy Configuration Example:**

```json
{
  "compliancePolicies": {
    "gdpr": {
      "enabled": true,
      "dataResidency": "eu-west",
      "retentionDays": 2555,
      "rightToErasure": true,
      "dpoEmail": "dpo@acme.com",
      "dpiRequired": true,
      "breachNotificationHours": 72
    },
    "sox": {
      "enabled": true,
      "segregationOfDuties": true,
      "changeApprovalRequired": true,
      "auditLogIntegrity": "immutable",
      "accessReviewFrequency": "quarterly"
    }
  }
}
```

---

### 2.7 Reporting

#### 2.7.1 Report Configuration

**Navigation:** `Reports > Configuration`

| Report Category | Available Reports | Frequency Options |
|---|---|---|
| Migration Status | Wave progress, Record throughput, Error summary | Real-time, Hourly, Daily, Weekly |
| Validation | Rule execution results, Failure trends, Coverage analysis | Real-time, Daily, Weekly |
| Data Quality | Completeness, Accuracy, Consistency, Timeliness scores | Daily, Weekly, Monthly |
| Compliance | Access reviews, Policy violations, Regulatory submissions | Weekly, Monthly, Quarterly |
| Financial | Cost tracking, Budget vs actual, ROI analysis | Monthly, Quarterly |
| Operational | System health, API usage, Storage consumption | Real-time, Daily |

**Custom Report Builder:**

1. Navigate to `Reports > New Report`.
2. Select data source (Migration Data, Validation Results, Audit Logs, etc.).
3. Define filters, groupings, and aggregations.
4. Choose visualisation type (Table, Bar Chart, Line Chart, Pie Chart, Heatmap).
5. Set scheduling (ad-hoc, daily, weekly, monthly).
6. Define distribution list.
7. Save and publish.

#### 2.7.2 Dashboards

**Navigation:** `Dashboards`

MAP provides three default dashboards:

| Dashboard | Audience | Key Widgets |
|---|---|---|
| **Executive Overview** | Leadership | Migration progress, Risk summary, Budget status, SLA compliance |
| **Operational** | Project teams | Active waves, Validation status, Error queue, Throughput metrics |
| **Compliance** | Compliance officers | Policy adherence, Access review status, Audit log summary, Regulatory deadlines |

**Dashboard Customisation:**

- Widgets can be added, removed, rearranged, and resized.
- Dashboard-level filters apply across all widgets.
- Dashboards can be shared with specific roles or kept private.
- Maximum 20 widgets per dashboard for performance.

#### 2.7.3 Alerts

**Navigation:** `Reports > Alerts`

| Alert Category | Trigger Examples | Default Severity |
|---|---|---|
| Migration | Wave stalled > 30 min, Error rate > 5%, Data loss detected | Critical |
| Validation | Validation failure > threshold, New critical rule violation | High |
| System | API latency > 5s, Storage > 80%, Service unavailable | Critical |
| Security | Failed login > 5 attempts, Anomalous access pattern, Privilege escalation | Critical |
| Compliance | Access review overdue, Policy violation detected, Retention breach | High |
| Financial | Budget > 90%, Cost anomaly detected | Medium |

---

### 2.8 Notifications

#### 2.8.1 Email Templates

**Navigation:** `Administration > Notifications > Email Templates`

MAP provides built-in email templates that can be customised:

| Template | Trigger | Customisable Fields |
|---|---|---|
| User Invitation | New user invited | Welcome message, Role description, Expiry notice |
| Password Reset | Password reset requested | Reset instructions, Expiry time |
| Validation Failure Alert | Validation rule fails | Failure details, Affected records, Remediation steps |
| Wave Approval Required | Migration wave pending approval | Wave summary, Approver instructions |
| Report Ready | Scheduled report generated | Report summary, Download link |
| Security Alert | Security event detected | Event details, Recommended actions |
| Access Review Reminder | Access review approaching deadline | Review scope, Deadline, Instructions |

**Template Customisation:**

Email templates support the following variable placeholders:

```
{{user.firstName}}         - User's first name
{{user.lastName}}          - User's last name
{{user.email}}             - User's email
{{organisation.name}}      - Organisation name
{{project.name}}           - Project name
{{project.code}}           - Project code
{{validation.ruleName}}    - Validation rule name
{{validation.failureCount}} - Number of failures
{{report.name}}            - Report name
{{report.generatedDate}}   - Report generation date
{{security.eventType}}     - Security event type
{{security.timestamp}}     - Event timestamp
{{settings.loginUrl}}      - MAP login URL
{{settings.supportEmail}}  - Support email address
```

#### 2.8.2 Alert Rules

**Navigation:** `Administration > Notifications > Alert Rules`

Alert rules define when and how notifications are triggered.

| Rule Component | Options | Description |
|---|---|---|
| Event Type | See Section 2.7.3 | What triggers the rule |
| Severity Filter | Critical, High, Medium, Low | Only trigger for events at or above this severity |
| Recipients | Users, Roles, External emails, Webhooks | Who receives the notification |
| Channel | Email, In-App, Slack, Teams, Webhook, SMS | How the notification is delivered |
| Throttle | None, Per hour, Per day, Digest | Rate limiting for notifications |
| Schedule | Always, Business hours, Custom | When notifications are active |
| Acknowledgement | Required, Optional | Whether recipients must acknowledge |

#### 2.8.3 Escalation

**Navigation:** `Administration > Notifications > Escalation`

Escalation ensures critical alerts are addressed within defined SLAs.

| Escalation Level | Trigger Condition | Default Timeout | Action |
|---|---|---|---|
| Level 1 | Alert acknowledged | 15 minutes | Notify assigned user |
| Level 2 | Not acknowledged | 30 minutes | Notify team lead |
| Level 3 | Not resolved | 2 hours | Notify project manager |
| Level 4 | Not resolved | 4 hours | Notify department head |
| Level 5 | Not resolved | 8 hours | Notify CTO / executive sponsor |

**Escalation Configuration Example:**

```json
{
  "escalationPolicy": {
    "name": "Critical Migration Alert Escalation",
    "triggerEvents": ["migration.wave_stalled", "migration.data_loss"],
    "levels": [
      { "level": 1, "timeoutMinutes": 15, "recipients": ["assignee"], "channel": "in-app+email" },
      { "level": 2, "timeoutMinutes": 30, "recipients": ["role:Project Manager"], "channel": "email+sms" },
      { "level": 3, "timeoutMinutes": 120, "recipients": ["role:Project Administrator"], "channel": "email+sms+teams" },
      { "level": 4, "timeoutMinutes": 240, "recipients": ["user.cto@acme.com"], "channel": "email+sms+phone" }
    ]
  }
}
```

---

### 2.9 Security Settings

#### 2.9.1 Session Management

**Navigation:** `Administration > Security > Session Management`

| Setting | Options | Default | Description |
|---|---|---|---|
| Idle Timeout | 5m – 24h | 30 minutes | Time before inactive session expires |
| Absolute Timeout | 1h – 72h | 8 hours | Maximum session duration regardless of activity |
| Concurrent Sessions | 1 – 10 | 3 | Maximum simultaneous sessions per user |
| Session Binding | None, IP, Device | IP | Bind session to originating IP or device |
| Re-authentication | None, Sensitive actions, Always | Sensitive actions | When re-authentication is required |
| Remember Me | Allowed, Disabled | Disabled | Whether users can persist sessions |

**Session Management Configuration:**

```json
{
  "sessionManagement": {
    "idleTimeoutMinutes": 30,
    "absoluteTimeoutHours": 8,
    "maxConcurrentSessions": 3,
    "sessionBinding": "ip",
    "reauthenticationPolicy": "sensitive_actions",
    "rememberMe": false,
    "sessionRecording": false,
    "forceLogoutOnPasswordChange": true
  }
}
```

#### 2.9.2 IP Restrictions

**Navigation:** `Administration > Security > IP Restrictions`

| Rule Type | Description | Example |
|---|---|---|
| Allowlist | Only these IPs/ranges may access MAP | Office CIDR: 203.0.113.0/24 |
| Denylist | These IPs are always blocked | Known malicious ranges |
| VPN Required | Access only via approved VPN endpoints | Corporate VPN exit nodes |
| Geo-fencing | Restrict by country / region | UK and EU only |

**IP Restriction Configuration:**

```json
{
  "ipRestrictions": {
    "enabled": true,
    "mode": "allowlist",
    "rules": [
      { "name": "London Office", "cidr": "203.0.113.0/24", "enabled": true },
      { "name": "VPN — UK", "cidr": "198.51.100.0/24", "enabled": true },
      { "name": "VPN — EU", "cidr": "192.0.2.0/24", "enabled": true },
      { "name": "Home Workers (VPN Required)", "cidr": "10.0.0.0/8", "enabled": true }
    ],
    "denylist": [
      { "name": "Known Threat Range", "cidr": "198.51.100.128/25", "enabled": true }
    ],
    "fallbackAction": "block",
    "adminOverride": true,
    "overrideExpiryHours": 4
  }
}
```

#### 2.9.3 Audit Logging

**Navigation:** `Administration > Security > Audit Logging`

MAP maintains comprehensive audit logs for all platform activities.

| Log Category | Events Captured | Retention |
|---|---|---|
| Authentication | Login, logout, failed login, MFA challenge, password change | Per policy |
| Authorisation | Permission check, role assignment, deny assignment | Per policy |
| Data Access | Read, write, download, export of migration data | Per policy |
| Configuration | All setting changes, role changes, policy changes | Per policy |
| Administrative | User creation, deletion, deactivation, role reassignment | Per policy |
| Integration | API calls, webhook deliveries, connector operations | Per policy |
| System | Service start/stop, errors, performance events | 90 days |

**Audit Log Entry Structure:**

```json
{
  "eventId": "evt-2026-07-15-001",
  "timestamp": "2026-07-15T14:32:01.123Z",
  "category": "Authentication",
  "action": "login.success",
  "actor": {
    "userId": "usr-abc123",
    "email": "jane.smith@acme.com",
    "ipAddress": "203.0.113.42",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "sessionId": "sess-xyz789"
  },
  "resource": {
    "type": "Organisation",
    "id": "org-acme",
    "name": "Acme Financial Services"
  },
  "details": {
    "method": "SSO — Entra ID",
    "mfaVerified": true,
    "riskLevel": "low"
  },
  "outcome": "success",
  "correlationId": "corr-abc123"
}
```

**Integrity Controls:**

- Audit logs are write-once (immutable) and stored in append-only storage.
- Each log entry includes a cryptographic hash chain for tamper detection.
- Audit logs are replicated to a separate retention store.
- Admin users cannot modify or delete audit log entries.

---

### 2.10 Configuration Templates

#### 2.10.1 Default Templates

MAP ships with the following default configuration templates that can be applied during onboarding:

| Template Name | Target Industry | Key Features |
|---|---|---|
| **Financial Services — Banking** | Banking, Building Societies | SOX controls, Basel III reporting, Transaction monitoring |
| **Financial Services — Insurance** | Insurance, Reinsurance | Solvency II reporting, Actuarial data validation |
| **Financial Services — Capital Markets** | Investment Banking, Trading | MiFID II compliance, Trade data validation |
| **Healthcare** | Healthcare, Pharma | HIPAA compliance, PHI detection, Clinical data validation |
| **Government** | Public Sector | OFFICIAL classification, GDS compliance, FOI readiness |
| **Technology / SaaS** | Technology, SaaS | SOC 2 alignment, API-first validation, Multi-tenant data isolation |
| **Retail** | Retail, E-commerce | PCI DSS compliance, Customer data handling, High-volume validation |

**Applying a Template:**

1. Navigate to `Administration > Configuration > Templates`.
2. Select the appropriate template.
3. Review the settings that will be applied.
4. Choose which setting categories to apply (Users, Roles, Policies, Reporting, Security).
5. Click **Apply Template**. A preview diff is shown before confirmation.
6. Confirm. All selected settings are applied and an audit entry is created.

#### 2.10.2 Industry-Specific Configurations

**Financial Services Template — Key Settings:**

```json
{
  "templateId": "tmpl-fin-banking-001",
  "name": "Financial Services — Banking",
  "roles": [
    "Organisation Administrator",
    "Project Manager",
    "Validator",
    "Contributor",
    "Viewer",
    "Auditor",
    "Compliance Reviewer",
    "Risk Officer"
  ],
  "policies": {
    "dataClassification": "Confidential",
    "encryptionAtRest": "AES-256",
    "encryptionInTransit": "TLS-1.3",
    "retentionAuditLogs": 2555,
    "retentionMigrationData": 2555,
    "segregationOfDuties": true,
    "changeApprovalRequired": true,
    "dataResidency": "eu-west"
  },
  "security": {
    "mfaRequired": true,
    "sessionTimeoutMinutes": 15,
    "maxConcurrentSessions": 2,
    "ipRestrictions": "allowlist",
    "passwordPolicy": "Strong",
    "sessionRecording": true
  },
  "reporting": {
    "defaultDashboards": ["Executive Overview", "Operational", "Compliance", "Risk"],
    "scheduledReports": [
      { "name": "Daily Migration Status", "frequency": "daily" },
      { "name": "Weekly Compliance Summary", "frequency": "weekly" },
      { "name": "Monthly Regulatory Report", "frequency": "monthly" }
    ]
  }
}
```

---

### 2.11 Best Practices

#### 2.11.1 Least Privilege

| Principle | Implementation |
|---|---|
| Default Deny | All permissions default to denied; grant explicitly |
| Role Scoping | Use project-scoped roles rather than organisation-wide when possible |
| Temporary Access | Use time-bound role assignments for short-term needs |
| Regular Review | Conduct quarterly access reviews to remove stale permissions |
| Service Accounts | Use dedicated service principals with minimal permissions for integrations |

#### 2.11.2 Segregation of Duties

| Conflicting Roles | Reason |
|---|---|
| Organisation Administrator + Contributor | Admin should not directly modify migration data |
| Validator + Contributor (same project) | Same person should not both validate and contribute data |
| Billing Administrator + Project Manager | Financial control separation |
| Security Administrator + Auditor | Separation of security configuration and security review |

**Implementation:**

MAP enforces segregation of duty rules at the platform level. When a user is assigned a role that conflicts with an existing role, the system:

1. Displays a warning to the assigning administrator.
2. Requires explicit override confirmation.
3. Logs the override with a reason code.
4. Flags the assignment for the next access review cycle.

#### 2.11.3 Audit Trail

| Practice | Description |
|---|---|
| Configuration Changes | All changes to settings, roles, and policies are logged with actor, timestamp, before/after values |
| Data Access | All reads/writes to migration data are logged |
| Administrative Actions | User creation, deletion, role changes are logged with justification |
| Log Integrity | Audit logs use cryptographic hash chaining; tampering is detectable |
| Retention | Audit logs retained for minimum 2 years (configurable up to 7 years) |
| Export | Audit logs can be exported in JSON or CSV format for external SIEM integration |

---

## 3. Dependencies

| Dependency | Version / Requirement | Notes |
|---|---|---|
| MAP Platform | v1.4 or later | Core platform must be deployed before configuration |
| Microsoft Entra ID | P2 licence (recommended) | Required for SSO, Conditional Access, and PIM |
| Network Access | VPN or approved IP range | Required for IP-restricted access |
| Browser Support | Chrome 90+, Edge 90+, Firefox 90+, Safari 15+ | For MAP portal access |
| API Access | REST API v1 | Required for bulk operations and integrations |
| SMTP | Configured email relay | Required for email notifications |
| TLS Certificate | Valid, publicly trusted | Required for custom domain (if applicable) |

---

## 4. References

| Reference ID | Document | Version |
|---|---|---|
| REF-001 | MAP Platform Architecture Document | v1.4 |
| REF-002 | MAP Security Hardening Guide | v1.0 |
| REF-003 | MAP API Reference | v1.4 |
| REF-004 | MAP SaaS Agreement Template | v2.0 |
| REF-005 | Microsoft Entra ID Documentation | Current |
| REF-006 | NIST SP 800-53 — Security and Privacy Controls | Rev. 5 |
| REF-007 | ISO 27001:2022 — Information Security Management | 2022 |
| REF-008 | SOC 2 Type II — Trust Services Criteria | 2017 |
| REF-009 | GDPR — Regulation (EU) 2016/679 | 2016 |
| REF-010 | UK FCA — SYSC Sourcebook | Current |

---

## 5. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 01 Jun 2026 | MAP Platform Engineering | Initial draft |
| 0.2 | 10 Jun 2026 | MAP Platform Engineering | Added Section 2.6 (Policies) and Section 2.10 (Templates) |
| 0.3 | 20 Jun 2026 | Customer Success | Added best practices and industry templates |
| 0.4 | 25 Jun 2026 | Security Team | Reviewed security settings and audit logging sections |
| 1.0 | 01 Jul 2026 | MAP Platform Engineering | Final version — Official release |

---

## 6. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Head of MAP Platform Engineering | | | |
| Chief Information Security Officer | | | |
| VP of Customer Success | | | |
| Head of Compliance | | | |

---

## 7. Appendices

### Appendix A — Configuration Checklist

Use this checklist during customer onboarding to ensure all configuration steps are completed.

| # | Configuration Area | Task | Owner | Status | Date Completed |
|---|---|---|---|---|---|
| 1 | Organisation | Complete Company Profile | Customer Admin | ☐ | |
| 2 | Organisation | Upload branding assets | Customer Admin | ☐ | |
| 3 | Organisation | Configure organisation settings | Customer Admin | ☐ | |
| 4 | Security | Configure password policy | Customer Admin | ☐ | |
| 5 | Security | Configure session management | Customer Admin | ☐ | |
| 6 | Security | Configure IP restrictions | Customer Admin | ☐ | |
| 7 | Security | Enable audit logging | Customer Admin | ☐ | |
| 8 | SSO | Configure SAML/OIDC | Customer Admin + MAP Engineer | ☐ | |
| 9 | MFA | Enable and configure MFA | Customer Admin | ☐ | |
| 10 | Users | Import user accounts | Customer Admin | ☐ | |
| 11 | Roles | Assign default roles | Customer Admin | ☐ | |
| 12 | Roles | Create custom roles (if needed) | Customer Admin | ☐ | |
| 13 | Projects | Create initial projects | Project Manager | ☐ | |
| 14 | Projects | Configure project settings | Project Manager | ☐ | |
| 15 | Projects | Assign project members | Project Manager | ☐ | |
| 16 | Policies | Configure data policies | Security Admin | ☐ | |
| 17 | Policies | Configure retention policies | Security Admin | ☐ | |
| 18 | Policies | Configure compliance policies | Compliance Officer | ☐ | |
| 19 | Reporting | Configure default dashboards | Project Manager | ☐ | |
| 20 | Reporting | Configure scheduled reports | Project Manager | ☐ | |
| 21 | Notifications | Configure email templates | Customer Admin | ☐ | |
| 22 | Notifications | Configure alert rules | Customer Admin | ☐ | |
| 23 | Notifications | Configure escalation policies | Customer Admin | ☐ | |
| 24 | Validation | Define validation rules | Validator | ☐ | |
| 25 | Integration | Configure webhooks (if needed) | Integration Admin | ☐ | |

### Appendix B — Role Assignment Template

| User | Email | Organisation Role | Project Role(s) | Project(s) | Start Date | End Date | Review Date |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Appendix C — Configuration API Reference

All configuration operations can be performed via the MAP REST API. Key endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/organisation` | Get organisation details |
| PATCH | `/api/v1/organisation` | Update organisation settings |
| GET | `/api/v1/projects` | List all projects |
| POST | `/api/v1/projects` | Create a new project |
| GET | `/api/v1/users` | List all users |
| POST | `/api/v1/users` | Create a new user |
| GET | `/api/v1/roles` | List all roles |
| POST | `/api/v1/roles` | Create a custom role |
| GET | `/api/v1/policies` | List all policies |
| PATCH | `/api/v1/policies` | Update policies |
| GET | `/api/v1/audit-logs` | Query audit logs |
| POST | `/api/v1/reports/generate` | Generate a report on demand |
| GET | `/api/v1/notifications/rules` | List alert rules |
| POST | `/api/v1/notifications/rules` | Create an alert rule |

---

*End of Document*
