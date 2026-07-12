# MAP Identity and Access Management

| Field | Value |
|---|---|
| **Document Title** | MAP Identity and Access Management |
| **Document ID** | MAP-DOC-IAM-001 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Confidential — Customer Use |
| **Owner** | MAP Platform Security Engineering |
| **Applicable To** | Customer IT Administrators, Security Engineers, MAP Onboarding Engineers, MAP Security Architects |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Content](#2-content)
   - 2.1 [Microsoft Entra ID Integration](#21-microsoft-entra-id-integration)
   - 2.2 [Single Sign-On (SSO)](#22-single-sign-on-sso)
   - 2.3 [Multi-Factor Authentication (MFA)](#23-multi-factor-authentication-mfa)
   - 2.4 [Role Assignment](#24-role-assignment)
   - 2.5 [Role-Based Access Control (RBAC)](#25-role-based-access-control-rbac)
   - 2.6 [User Lifecycle Management](#26-user-lifecycle-management)
   - 2.7 [Guest Users](#27-guest-users)
   - 2.8 [Administration](#28-administration)
   - 2.9 [Conditional Access](#29-conditional-access)
   - 2.10 [Audit](#210-audit)
3. [Dependencies](#3-dependencies)
4. [References](#4-references)
5. [Revision History](#5-revision-history)
6. [Approval](#6-approval)
7. [Appendices](#7-appendices)

---

## 1. Purpose

This document defines the Identity and Access Management (IAM) architecture and configuration standards for the Migration Assurance Platform (MAP). It establishes the authoritative framework for authenticating, authorising, and auditing all human and service identities that interact with MAP during pilot deployment and ongoing operations.

### 1.1 Scope

This document covers:

- Integration with Microsoft Entra ID (Azure AD) as the primary identity provider
- Single Sign-On (SSO) configuration via SAML 2.0 and OpenID Connect
- Multi-Factor Authentication (MFA) enforcement and policies
- Role-Based Access Control (RBAC) implementation within MAP
- User lifecycle management from provisioning through deprovisioning
- Guest user and B2B collaboration controls
- Privileged access management and administrative controls
- Conditional access policies
- Audit logging, access reviews, and compliance reporting

### 1.2 Intended Audience

| Role | Use This Document To |
|---|---|
| Customer IT Administrator | Configure Entra ID integration, SSO, MFA, and conditional access |
| Customer Security Engineer | Implement security policies, RBAC, and audit controls |
| MAP Onboarding Engineer | Guide customers through IAM setup and validate configuration |
| MAP Security Architect | Review and approve customer IAM configurations |
| Compliance Officer | Verify IAM controls meet regulatory requirements |

### 1.3 IAM Design Principles

| Principle | Description |
|---|---|
| Zero Trust | Never trust, always verify — authenticate and authorise every request |
| Least Privilege | Grant minimum permissions required for the task |
| Defence in Depth | Layer multiple security controls (authn, authz, MFA, conditional access) |
| Centralised Identity | All human identities managed in Entra ID; no local accounts in production |
| Segregation of Duties | No single identity can both create and approve critical changes |
| Auditability | Every identity event is logged, immutable, and reviewable |
| Automated Lifecycle | Provisioning and deprovisioning driven by HR system of record |

---

## 2. Content

### 2.1 Microsoft Entra ID Integration

#### 2.1.1 Tenant Setup

MAP integrates with Microsoft Entra ID (formerly Azure Active Directory) as the primary Identity Provider (IdP). Each customer deploys MAP within their own Entra ID tenant.

**Prerequisites:**

| Requirement | Details |
|---|---|
| Entra ID Licence | P2 recommended (for Conditional Access, PIM, Access Reviews) |
| Tenant Admin Role | Global Administrator or Privileged Identity Administrator |
| MAP Application | Registered in Entra ID tenant (see Section 2.1.2) |
| Verified Domain | At least one verified domain in Entra ID |
| User Accounts | Users provisioned in Entra ID with valid licences |

**Tenant Configuration Steps:**

1. **Verify Tenant Readiness**
   - Confirm Entra ID tenant is active and accessible.
   - Verify at least one domain is verified.
   - Confirm Global Administrator access is available.

2. **Create MAP Service Account**
   - Navigate to `Entra ID > Users > New User`.
   - Create a dedicated service account: `svc-map-integration@<tenant>.onmicrosoft.com`.
   - Assign minimum required permissions (Application Administrator role for the MAP app registration).
   - Enable MFA on the service account.
   - Set password to never expire (managed by MAP rotation policy).

3. **Configure Tenant Settings**
   - Navigate to `Entra ID > Security > Authentication Methods`.
   - Enable methods required by MAP: FIDO2, Microsoft Authenticator, SMS, Voice Call.
   - Navigate to `Entra ID > Users > User settings`.
   - Disable "Users can register applications" (security hardening).
   - Enable "Users can create security groups" only for designated admins.

**Tenant Settings Matrix:**

| Setting | Location | Recommended Value | Rationale |
|---|---|---|---|
| Guest user access | Collaboration settings | Restricted | Limit guest capabilities |
| Guest invite settings | Collaboration settings | Members and guest admins only | Prevent open invitations |
| External user invitations | Collaboration settings | Selected admins only | Control external access |
| Self-service password reset | Password reset | Enabled with MFA | Self-service recovery |
| Password expiration | Password policies | 90 days (or never with MFA) | Balance security and usability |
| Legacy authentication protocols | Conditional Access | Blocked | Prevent weak auth methods |
| User consent to apps | Enterprise applications | Do not allow, with admin consent flow | Control app registrations |

#### 2.1.2 App Registration

MAP is registered in the customer's Entra ID tenant as an Enterprise Application.

**App Registration Details:**

| Field | Value |
|---|---|
| Application Name | Migration Assurance Platform |
| Application (Client) ID | Assigned by Entra ID during registration |
| Directory (Tenant) ID | Customer's Entra ID tenant ID |
| Object ID | Assigned by Entra ID |
| Sign-on URL | `https://map.<customer-domain>.com/auth/sso` |
| Reply URL | `https://map.<customer-domain>.com/auth/callback` |
| Logout URL | `https://map.<customer-domain>.com/auth/logout` |
| Identifier URI | `api://<application-id>` |

**App Registration Configuration:**

```json
{
  "appId": "<application-client-id>",
  "displayName": "Migration Assurance Platform",
  "signInAudience": "AzureADMyOrg",
  "web": {
    "redirectUris": [
      "https://map.acme.com/auth/callback",
      "https://map.acme.com/auth/sso"
    ],
    "logoutUrl": "https://map.acme.com/auth/logout"
  },
  "requiredResourceAccess": [
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAccess": [
        { "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d", "type": "Scope" },
        { "id": "06da0dbc-49e2-44d2-8312-53f166ab848a", "type": "Scope" },
        { "id": "df021288-bdef-4463-88db-98f22de855b1", "type": "Scope" }
      ]
    }
  ],
  "appRoles": [
    {
      "id": "map-admin-role-id",
      "displayName": "MAP Administrator",
      "description": "Full MAP administration access",
      "value": "MAP.Admin",
      "allowedMemberTypes": ["User"]
    },
    {
      "id": "map-user-role-id",
      "displayName": "MAP User",
      "description": "Standard MAP user access",
      "value": "MAP.User",
      "allowedMemberTypes": ["User"]
    },
    {
      "id": "map-viewer-role-id",
      "displayName": "MAP Viewer",
      "description": "Read-only MAP access",
      "value": "MAP.Viewer",
      "allowedMemberTypes": ["User"]
    }
  ],
  "api": {
    "requestedAccessTokenVersion": 2
  }
}
```

**Required API Permissions:**

| Permission | Type | Purpose |
|---|---|---|
| `User.Read` | Delegated | Read user profile for identity |
| `User.Read.All` | Application | Enumerate users for provisioning |
| `Group.Read.All` | Application | Read group memberships for role mapping |
| `Directory.Read.All` | Application | Read directory data for user synchronisation |
| `AuditLog.Read.All` | Application | Read sign-in and audit logs |
| `Policy.Read.All` | Application | Read conditional access policies |

#### 2.1.3 Permissions

**Permission Assignment:**

1. Navigate to `Entra ID > App Registrations > MAP > API Permissions`.
2. Click **Add a permission**.
3. Select **Microsoft Graph**.
4. Add **Application permissions** (for service-to-service):
   - `User.Read.All`
   - `Group.Read.All`
   - `Directory.Read.All`
   - `AuditLog.Read.All`
5. Add **Delegated permissions** (for user-context):
   - `User.Read`
   - `openid`
   - `profile`
   - `email`
6. Click **Grant admin consent** for the tenant.
7. Verify all permissions show green checkmarks.

**Permission Scoping:**

MAP requests only the minimum permissions required. If a customer's security policy restricts certain permissions, MAP operates in a degraded mode:

| Restricted Permission | Impact | Alternative |
|---|---|---|
| `Directory.Read.All` | Cannot auto-sync user attributes | Manual user attribute updates |
| `AuditLog.Read.All` | Cannot ingest Entra ID sign-in logs | Customer exports logs manually |
| `Group.Read.All` | Cannot map Entra ID groups to MAP roles | Direct role assignment in MAP |
| `User.Read.All` | Cannot auto-provision users | Manual user creation in MAP |

---

### 2.2 Single Sign-On (SSO)

#### 2.2.1 SAML Configuration

MAP supports SAML 2.0 for SSO integration with Entra ID and other SAML-compliant identity providers.

**SAML Configuration Parameters:**

| Parameter | Value | Notes |
|---|---|---|
| Entity ID (Audience) | `https://map.<domain>/auth/saml/metadata` | Unique per customer deployment |
| SSO URL (Login) | `https://login.microsoftonline.com/<tenant-id>/saml2` | Entra ID SSO endpoint |
| SLO URL (Logout) | `https://login.microsoftonline.com/<tenant-id>/saml2` | Entra ID SLO endpoint |
| ACS URL (Reply) | `https://map.<domain>/auth/saml/callback` | MAP Assertion Consumer Service |
| Name ID Format | `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress` | User identifier format |
| Signing Algorithm | RSA-SHA256 | Minimum accepted algorithm |
| Certificate | X.509 (PEM format) | Entra ID signing certificate |
| Assertion Encryption | AES-256 | Optional but recommended |

**SAML Metadata Exchange:**

MAP publishes its SP metadata at:
```
https://map.<domain>/auth/saml/metadata
```

Entra ID publishes its IdP metadata at:
```
https://login.microsoftonline.com/<tenant-id>/federationmetadata/2007-06/federationmetadata.xml
```

**SAML Configuration in MAP:**

```json
{
  "saml": {
    "enabled": true,
    "idp": {
      "entityId": "https://sts.windows.net/<tenant-id>/",
      "ssoUrl": "https://login.microsoftonline.com/<tenant-id>/saml2",
      "sloUrl": "https://login.microsoftonline.com/<tenant-id>/saml2",
      "certificate": "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----",
      "certificateThumbprint": "A1B2C3D4E5F6...",
      "certificateExpiry": "2027-06-30T23:59:59Z"
    },
    "sp": {
      "entityId": "https://map.acme.com/auth/saml/metadata",
      "acsUrl": "https://map.acme.com/auth/saml/callback",
      "sloUrl": "https://map.acme.com/auth/saml/logout",
      "nameIdFormat": "emailAddress",
      "signRequests": true,
      "wantAssertionsSigned": true,
      "wantResponseSigned": true,
      "assertionEncryption": "AES-256",
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
    },
    "attributeMapping": {
      "email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "firstName": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
      "lastName": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
      "displayName": "http://schemas.microsoft.com/identity/claims/displayname",
      "department": "http://schemas.microsoft.com/ws/2008/06/identity/claims/department",
      "groups": "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups"
    }
  }
}
```

#### 2.2.2 OIDC Setup

MAP also supports OpenID Connect (OIDC) as an alternative to SAML, particularly suitable for modern applications and API integrations.

**OIDC Configuration Parameters:**

| Parameter | Value |
|---|---|
| Issuer | `https://login.microsoftonline.com/<tenant-id>/v2.0` |
| Authorization Endpoint | `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/authorize` |
| Token Endpoint | `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token` |
| JWKS URI | `https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys` |
| End Session Endpoint | `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/logout` |
| Client ID | `<application-client-id>` |
| Client Secret | Managed via Entra ID client secrets |
| Redirect URI | `https://map.<domain>/auth/oidc/callback` |
| Scope | `openid profile email offline_access` |
| Response Type | `code` (Authorization Code flow) |
| PKCE | Required (S256) |

**OIDC Configuration in MAP:**

```json
{
  "oidc": {
    "enabled": false,
    "issuer": "https://login.microsoftonline.com/<tenant-id>/v2.0",
    "authorizationEndpoint": "https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/authorize",
    "tokenEndpoint": "https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token",
    "jwksUri": "https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys",
    "endSessionEndpoint": "https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/logout",
    "clientId": "<application-client-id>",
    "clientSecretRef": "vault://map-secrets/oidc-client-secret",
    "redirectUri": "https://map.acme.com/auth/oidc/callback",
    "scopes": ["openid", "profile", "email", "offline_access"],
    "responseType": "code",
    "pkce": {
      "enabled": true,
      "method": "S256"
    },
    "claimsMapping": {
      "email": "email",
      "firstName": "given_name",
      "lastName": "family_name",
      "displayName": "name",
      "groups": "groups",
      "objectId": "oid"
    },
    "tokenValidation": {
      "validateIssuer": true,
      "validateAudience": true,
      "validateLifetime": true,
      "clockSkewSeconds": 120
    }
  }
}
```

#### 2.2.3 Federation

MAP supports federated identity scenarios where customers use multiple identity providers or complex trust relationships.

**Federation Architecture:**

```
                    ┌──────────────────────┐
                    │   MAP Platform       │
                    │   (Service Provider) │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Federation Broker  │
                    │   (MAP IdP Router)   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼─────────┐ ┌───────▼───────┐ ┌─────────▼─────────┐
│ Microsoft Entra ID│ │ On-Prem AD FS │ │  Third-Party IdP  │
│ (Primary IdP)     │ │ (Federated)   │ │  (SAML/OIDC)      │
└───────────────────┘ └───────────────┘ └───────────────────┘
```

**Multi-IdP Configuration:**

| Configuration | Description |
|---|---|
| Primary IdP | Entra ID — handles 95%+ of authentication |
| Secondary IdP | On-premises AD FS — for legacy systems or specific user populations |
| Tertiary IdP | Third-party — for external consultants or partner organisations |
| Domain-based Routing | MAP routes authentication to the correct IdP based on user email domain |

**Domain-to-IdP Mapping:**

| Domain | Identity Provider | Protocol | Status |
|---|---|---|---|
| `acme.com` | Microsoft Entra ID | SAML 2.0 | Active |
| `acme-legacy.local` | On-Premises AD FS | SAML 2.0 | Active |
| `partner-consulting.com` | Partner IdP | OIDC | Active |
| `auditor-firm.com` | MAP Local (B2B guest) | OIDC | Active |

---

### 2.3 Multi-Factor Authentication (MFA)

#### 2.3.1 MFA Configuration

MAP enforces MFA for all user authentication. MFA is configured at two levels:

1. **Entra ID level** — Enforced via Conditional Access policies (recommended).
2. **MAP level** — Enforced as a fallback if Entra ID MFA is not available.

**Entra ID MFA Methods:**

| Method | Security Level | User Experience | Recommendation |
|---|---|---|---|
| Microsoft Authenticator (Push) | High | Excellent — approve on phone | Recommended default |
| Microsoft Authenticator (Passwordless) | Very High | Excellent — phone as primary factor | Recommended for privileged users |
| FIDO2 Security Key | Very High | Good — hardware key required | Recommended for security-sensitive roles |
| SMS | Medium | Good — widely available | Acceptable for low-risk scenarios |
| Voice Call | Low-Medium | Good — phone call with code | Fallback only |
| OATH Hardware Token | High | Good — one-time code | For air-gapped environments |
| OATH Software Token | High | Good — TOTP from authenticator app | Alternative to MS Authenticator |

**MAP-Level MFA Configuration:**

```json
{
  "mfa": {
    "enabled": true,
    "enforcement": "required_for_all",
    "methods": {
      "authenticator_app": { "enabled": true, "priority": 1 },
      "fido2": { "enabled": true, "priority": 2 },
      "sms": { "enabled": true, "priority": 3, "restrictions": { "maxNumbers": 2 } },
      "voice_call": { "enabled": true, "priority": 4 },
      "oath_token": { "enabled": false }
    },
    "policies": {
      "rememberMfa": {
        "enabled": true,
        "durationHours": 168
      },
      "conditionalMfa": {
        "trustedDevices": "allowMfaBypass",
        "trustedLocations": "allowMfaBypass",
        "highRiskSessions": "alwaysRequire"
      },
      "mfaBackupCodes": {
        "enabled": true,
        "numberOfCodes": 10,
        "singleUse": true
      }
    },
    "riskBasedMfa": {
      "enabled": true,
      "lowRisk": "allow",
      "mediumRisk": "requireMfa",
      "highRisk": "blockAccess"
    }
  }
}
```

#### 2.3.2 MFA Policies

| Policy | Scope | Enforcement | Notes |
|---|---|---|---|
| All Users — Standard | All internal users | Entra ID Conditional Access | MFA on every sign-in |
| Privileged Users — Strict | Admins, Security roles | Entra ID CA + MAP | MFA on every sign-in, no remember |
| Guest Users | All guest users | Entra ID B2B MFA | MFA on every sign-in, no bypass |
| Service Principals | API integrations | Client certificate + secret | Certificate-based auth replaces MFA |
| High-Risk Sign-ins | Any user | Entra ID Identity Protection | Step-up MFA or block |
| Legacy Applications | Apps using legacy auth | Block (not MFA) | Legacy auth blocked entirely |

#### 2.3.3 MFA Enforcement

**Enforcement Levels:**

| Level | Scope | When Applied |
|---|---|---|
| Enforce on Every Sign-in | All users, all locations | Default for MAP |
| Enforce on Untrusted Networks | Users on non-corporate IPs | Conditional Access policy |
| Enforce on High-Risk Sign-ins | Users flagged by Identity Protection | Risk-based Conditional Access |
| Enforce on Privileged Operations | Admin actions in MAP | MAP application-level enforcement |
| Allow MFA Bypass | Trusted devices, compliant devices | Conditional Access policy exception |

**Implementation Steps:**

1. **Configure Entra ID Conditional Access Policy** (see Section 2.9).
2. **Enable MAP MFA enforcement:**
   - Navigate to `Administration > Security > MFA`.
   - Set `Enforcement Level` to `Required for All`.
   - Configure method priorities.
   - Enable remember-MFA (optional, recommended 7 days).
3. **Test with pilot users** before full enforcement.
4. **Monitor MFA registration status** via `Entra ID > Security > Authentication methods > Activity`.

---

### 2.4 Role Assignment

#### 2.4.1 Built-in Roles

MAP provides built-in roles that map to common organisational functions. These roles are pre-configured and cannot be modified.

| MAP Role | Entra ID Group | Entra ID App Role | Description |
|---|---|---|---|
| Organisation Administrator | `MAP-Admins` | `MAP.Admin` | Full platform control |
| Security Administrator | `MAP-SecurityAdmins` | `MAP.Admin` | Security policy management |
| Integration Administrator | `MAP-IntegrationAdmins` | `MAP.Admin` | API and integration management |
| Billing Administrator | `MAP-BillingAdmins` | `MAP.Admin` | Billing and subscription management |
| Auditor | `MAP-Auditors` | `MAP.User` | Read-only audit and compliance |
| Project Administrator | `MAP-ProjectAdmins` | `MAP.User` | Full project-level control |
| Project Manager | `MAP-ProjectManagers` | `MAP.User` | Project lifecycle management |
| Validator | `MAP-Validators` | `MAP.User` | Validation rule execution |
| Contributor | `MAP-Contributors` | `MAP.User` | Data upload and modification |
| Viewer | `MAP-Viewers` | `MAP.Viewer` | Read-only access |

#### 2.4.2 Custom Roles

Custom roles can be created to meet specific organisational needs. Custom roles are defined in MAP and can optionally be backed by Entra ID groups.

**Custom Role Creation Process:**

1. **Define Role Requirements**
   - Identify the specific permissions needed.
   - Determine the scope (organisation-wide, project-specific, environment-specific).
   - Check for segregation of duty conflicts.

2. **Create Role in MAP**
   - Navigate to `Administration > Roles > Create Custom Role`.
   - Define name, description, and scope.
   - Select permissions from the permission matrix.
   - Define deny permissions for segregation of duties.
   - Set hierarchy position.

3. **Create Backing Entra ID Group (Recommended)**
   - Navigate to `Entra ID > Groups > New Group`.
   - Create group: `MAP-<RoleName>`.
   - Add MAP app role assignment to the group.
   - Add MAP roles as a group claim in the app registration.

4. **Assign Users**
   - Add users to the Entra ID group, OR
   - Assign the MAP role directly in the MAP portal.

**Custom Role Example — Data Migration Lead:**

```json
{
  "name": "Data Migration Lead",
  "description": "Full data management access within assigned projects, including upload, validation, and export",
  "scope": "Project",
  "permissions": [
    "project.read",
    "data.read",
    "data.write",
    "data.upload",
    "data.download",
    "data.export",
    "validation.read",
    "validation.execute",
    "report.read",
    "report.generate"
  ],
  "denyPermissions": [
    "project.delete",
    "project.settings.manage",
    "user.manage",
    "role.assign"
  ],
  "hierarchyPosition": 3,
  "segregationOfDutyConflicts": ["Validator"],
  "maxAssignmentsPerProject": 5,
  "requiresApproval": true
}
```

#### 2.4.3 Role Mapping

Role mapping defines how Entra ID group memberships translate to MAP role assignments.

**Entra ID Group to MAP Role Mapping Table:**

| Entra ID Group | MAP Role | Scope | Auto-Assign |
|---|---|---|---|
| `MAP-Admins` | Organisation Administrator | Organisation | Yes |
| `MAP-SecurityAdmins` | Security Administrator | Organisation | Yes |
| `MAP-IntegrationAdmins` | Integration Administrator | Organisation | Yes |
| `MAP-BillingAdmins` | Billing Administrator | Organisation | Yes |
| `MAP-Auditors` | Auditor | Organisation | Yes |
| `MAP-ProjectAdmins-{Project}` | Project Administrator | Project | Yes |
| `MAP-ProjectManagers-{Project}` | Project Manager | Project | Yes |
| `MAP-Validators-{Project}` | Validator | Project | Yes |
| `MAP-Contributors-{Project}` | Contributor | Project | Yes |
| `MAP-Viewers-{Project}` | Viewer | Project | Yes |

**Role Mapping Configuration:**

```json
{
  "roleMapping": {
    "enabled": true,
    "syncFrequency": "realtime",
    "source": "entra_id_groups",
    "mappings": [
      {
        "entraIdGroup": "MAP-Admins",
        "mapRole": "Organisation Administrator",
        "scope": "Organisation",
        "autoAssign": true,
        "autoRemove": true
      },
      {
        "entraIdGroup": "MAP-ProjectManagers-CBM-P1",
        "mapRole": "Project Manager",
        "scope": "Project:CBM-P1",
        "autoAssign": true,
        "autoRemove": true
      }
    ],
    "fallback": {
      "enabled": true,
      "defaultRole": "Viewer",
      "defaultScope": "Organisation"
    },
    "conflictResolution": {
      "multipleRoles": "highest",
      "denyAndAllow": "denyWins"
    }
  }
}
```

---

### 2.5 Role-Based Access Control (RBAC)

#### 2.5.1 Permission Model

MAP implements a hierarchical RBAC model with the following components:

**Permission Structure:**

```
<domain>.<resource>.<action>[.<scope>]
```

**Example:**

```
project.CBM-P1.validation.execute
```

- **Domain:** `project`
- **Resource:** `CBM-P1`
- **Action:** `validation`
- **Scope:** `execute`

**Permission Evaluation Order:**

1. **Deny Assignments** — Explicit deny permissions are evaluated first. If a deny matches, access is denied regardless of any allow permissions.
2. **Role Permissions** — Allow permissions from assigned roles are evaluated.
3. **Resource Scoping** — Permissions are checked against the resource scope.
4. **Temporal Constraints** — Time-based restrictions are applied.
5. **Conditional Access** — Contextual restrictions (location, device, risk) are applied.
6. **Default Deny** — If no allow permission matches, access is denied.

**Permission Evaluation Pseudocode:**

```python
def evaluate_access(user, resource, action, context):
    # Step 1: Check deny assignments
    for deny in user.deny_assignments:
        if deny.matches(resource, action):
            return DENY("Explicit deny assignment")

    # Step 2: Check allow permissions
    allowed = False
    for role in user.roles:
        for permission in role.permissions:
            if permission.matches(resource, action):
                allowed = True
                break
        if allowed:
            break

    if not allowed:
        return DENY("No matching permission")

    # Step 3: Check resource scoping
    if not resource.is_in_scope(user.effective_scope):
        return DENY("Resource out of scope")

    # Step 4: Check temporal constraints
    if not check_temporal_constraints(user, resource, action):
        return DENY("Temporal constraint violated")

    # Step 5: Check conditional access
    if not check_conditional_access(user, context):
        return DENY("Conditional access policy violated")

    return ALLOW()
```

#### 2.5.2 Resource Scoping

Permissions can be scoped at multiple levels:

| Scope Level | Description | Example |
|---|---|---|
| Organisation | Access across the entire organisation | `Organisation Administrator` |
| Project | Access within a specific project | `Project Manager` for CBM-P1 |
| Environment | Access to a specific environment | `Validator` for UAT only |
| Data Classification | Access restricted by data sensitivity | Cannot access `Restricted` data |
| Feature | Access to specific MAP features | Can use `Reporting` but not `Integration` |

**Scope Configuration:**

```json
{
  "resourceScoping": {
    "levels": [
      {
        "level": "Organisation",
        "description": "Top-level organisational scope",
        "resources": ["all"]
      },
      {
        "level": "Project",
        "description": "Scoped to a specific project",
        "resources": ["project:{projectId}"]
      },
      {
        "level": "Environment",
        "description": "Scoped to a specific environment within a project",
        "resources": ["project:{projectId}:env:{envName}"]
      },
      {
        "level": "DataClassification",
        "description": "Scoped by data sensitivity classification",
        "resources": ["classification:{level}"],
        "levels": ["Public", "Internal", "Confidential", "Restricted"]
      }
    ],
    "evaluation": "narrowest_applicable_scope"
  }
}
```

#### 2.5.3 Deny Assignments

Deny assignments are used to enforce segregation of duties and prevent privilege escalation.

| Deny Type | Description | Example |
|---|---|---|
| Static Deny | Permanent deny based on role conflict | Validator cannot also be Contributor |
| Dynamic Deny | Context-dependent deny | Cannot approve own migration wave |
| Temporal Deny | Time-limited deny | Cannot access during maintenance window |
| Resource Deny | Deny for specific resources | Cannot modify billing settings |

**Deny Assignment Configuration:**

```json
{
  "denyAssignments": [
    {
      "name": "Segregation: Validator-Contributor",
      "description": "Prevent same user from both validating and contributing data",
      "type": "static",
      "conflictingRoles": ["Validator", "Contributor"],
      "scope": "Project",
      "enforcement": "hard",
      "overrideRequires": "CISO approval",
      "auditOnOverride": true
    },
    {
      "name": "Segregation: Self-Approval",
      "description": "Prevent user from approving their own migration wave",
      "type": "dynamic",
      "condition": "approver == wave.requestor",
      "scope": "Project",
      "enforcement": "hard",
      "overrideRequires": "not possible"
    },
    {
      "name": "Data Classification: PII Access",
      "description": "Restrict PII access to compliance roles only",
      "type": "resource",
      "conflictingRoles": ["Viewer", "Contributor"],
      "resource": "classification:Restricted",
      "enforcement": "hard",
      "overrideRequires": "Data Protection Officer approval",
      "auditOnOverride": true
    }
  ]
}
```

---

### 2.6 User Lifecycle Management

#### 2.6.1 Provisioning

MAP supports automated user provisioning via SCIM 2.0 and Entra ID group-based assignment.

**Provisioning Methods:**

| Method | Use Case | Configuration |
|---|---|---|
| Entra ID Group-Based | Primary method — assign users to MAP groups | Entra ID Enterprise Application |
| SCIM 2.0 | Cross-platform provisioning from non-Entra ID sources | MAP SCIM endpoint |
| Manual | Small organisations or temporary users | MAP Administration portal |
| API | Custom provisioning workflows | MAP REST API |

**Entra ID Provisioning Configuration:**

1. Navigate to `Entra ID > Enterprise Applications > MAP > Provisioning`.
2. Set provisioning mode to **Automatic**.
3. Configure admin credentials (MAP service account).
4. Set scope to **Sync only assigned users and groups**.
5. Configure attribute mappings (see table below).
6. Set provisioning schedule: **Hourly** (default) or **Real-time**.
7. Save and start initial synchronisation.

**Attribute Mappings:**

| Entra ID Attribute | MAP Attribute | Matching | Apply | Notes |
|---|---|---|---|---|
| `userPrincipalName` | `email` | Match | Always | Primary identifier |
| `mail` | `email` | Match | On create/update | Backup identifier |
| `givenName` | `firstName` | Match | On create/update | |
| `surname` | `lastName` | Match | On create/update | |
| `displayName` | `displayName` | Match | On create/update | |
| `department` | `department` | Match | On create/update | |
| `jobTitle` | `jobTitle` | Match | On create/update | |
| `accountEnabled` | `active` | Match | On create/update | Controls active status |
| `manager` | `managerEmail` | Match | On create/update | For escalation routing |
| `groups` | `roles` | Map | On create/update | Via group-to-role mapping |

**Provisioning Flow:**

```
HR System → Entra ID (Sync) → MAP Group Assignment → MAP Role Mapping → MAP User Account
     │              │                    │                      │                │
     │              │                    │                      │                │
     ▼              ▼                    ▼                      ▼                ▼
  Hire Event    User Created      Group Membership       Role Assigned     Account Active
                or Updated        Changed                or Updated        or Deactivated
```

#### 2.6.2 Deprovisioning

Deprovisioning ensures that when a user leaves the organisation or changes role, their MAP access is revoked promptly.

**Deprovisioning Triggers:**

| Trigger | Source | Action | Timeline |
|---|---|---|---|
| User Disabled in Entra ID | HR system sync | Deactivate MAP account | Within 1 hour (SCIM) |
| User Deleted in Entra ID | HR system sync | Deactivate MAP account | Within 1 hour (SCIM) |
| Group Membership Removed | Entra ID group change | Remove MAP role | Within 1 hour (SCIM) |
| Manual Deactivation | Admin action | Deactivate MAP account | Immediate |
| Inactivity (90 days) | MAP monitoring | Flag for review | 90 days |
| Password Expiry | Entra ID policy | Force re-authentication | At expiry |

**Deprovisioning Process:**

```
Deactivation Trigger → MAP Account Deactivated → Active Sessions Terminated →
Data Ownership Transferred → Audit Log Created → Notification Sent to Admin
```

**Post-Deprovisioning:**

| Action | Timeline | Owner |
|---|---|---|
| Terminate all active sessions | Immediate | MAP Platform |
| Transfer data ownership to manager | Within 24 hours | MAP Platform |
| Anonymise user data (per retention policy) | Per policy (default 90 days) | MAP Platform |
| Archive user activity logs | Retained per policy | MAP Platform |
| Notify project managers | Within 1 hour | MAP Platform |

#### 2.6.3 Lifecycle Workflows

MAP supports automated lifecycle workflows for common user management events.

**Workflow Triggers and Actions:**

| Workflow | Trigger | Actions |
|---|---|---|
| New Hire | User provisioned in MAP | Assign default role, send welcome email, assign to default projects |
| Role Change | Group membership changed | Update MAP role, notify project managers, log change |
| Departure | User deactivated in Entra ID | Deactivate MAP account, transfer ownership, revoke access |
| Leave of Absence | User flagged as inactive | Suspend MAP account, notify project managers |
| Return from Leave | User flagged as active | Reactivate MAP account, restore previous roles |
| Contractor End | Contract end date reached | Trigger deactivation workflow |

**Lifecycle Workflow Configuration:**

```json
{
  "lifecycleWorkflows": [
    {
      "name": "New Hire Onboarding",
      "trigger": "user.provisioned",
      "conditions": [
        { "field": "user.department", "operator": "in", "value": ["Engineering", "Compliance", "Operations"] }
      ],
      "actions": [
        { "type": "assign_role", "role": "Viewer", "scope": "Organisation" },
        { "type": "assign_to_group", "group": "MAP-NewHires" },
        { "type": "send_notification", "template": "new_hire_welcome", "to": "user.email" },
        { "type": "create_task", "title": "Complete MAP onboarding training", "dueInDays": 7 }
      ]
    },
    {
      "name": "Departure Deprovisioning",
      "trigger": "user.deactivated",
      "conditions": [],
      "actions": [
        { "type": "deactivate_account" },
        { "type": "terminate_sessions" },
        { "type": "transfer_ownership", "to": "user.manager" },
        { "type": "notify_admin", "template": "user_departure", "to": "role:Security Administrator" },
        { "type": "schedule_anonymisation", "delayDays": 90 }
      ]
    }
  ]
}
```

---

### 2.7 Guest Users

#### 2.7.1 B2B Collaboration

MAP supports B2B collaboration via Entra ID B2B for external consultants, auditors, and partners.

**B2B Collaboration Configuration:**

| Setting | Options | Default | Description |
|---|---|---|---|
| Guest User Access | Restricted, Limited, Full | Restricted | Level of access for guest users |
| Guest Invite Settings | Admin only, Members + Admins, Anyone | Admin only | Who can invite guest users |
| External Collaboration Settings | Allow/Block domains, Allow/Block all | Allow with approval | Domain-level controls |
| Guest MFA | Required, Not Required | Required | MFA enforcement for guests |
| Guest Conditional Access | Same as members, Separate policy | Separate policy | Dedicated CA policy for guests |
| Guest Session Timeout | Custom per role | 8 hours | Session duration for guest users |

**B2B Invitation Flow:**

```
Internal User Invites Guest → Entra ID Invitation Sent → Guest Accepts →
Guest Account Created in Entra ID → MAP Account Provisioned → Role Assigned →
MFA Required on First Sign-in → Access Granted
```

#### 2.7.2 Guest Access

**Guest User Roles in MAP:**

| MAP Role | Available to Guests | Scope | Notes |
|---|---|---|---|
| Viewer | ✅ | Project only | Read-only access to assigned projects |
| Contributor | ✅ | Project only | Data upload within assigned projects |
| Validator | ⚠️ | Project only | Requires Security Admin approval |
| Auditor | ⚠️ | Organisation | Requires Security Admin approval |
| Project Manager | ❌ | N/A | Not available to guest users |
| Administrator | ❌ | N/A | Not available to guest users |

**Guest Access Restrictions:**

| Restriction | Description | Configuration |
|---|---|---|
| Project Scope | Guests can only access explicitly assigned projects | Default: All projects hidden |
| Data Export | Guests cannot export data without approval | Configurable per role |
| User Management | Guests cannot invite or manage other users | Hard restriction |
| Settings Access | Guests cannot access organisation settings | Hard restriction |
| Billing Access | Guests cannot access billing information | Hard restriction |
| API Access | Guests have limited API rate limits | Default: 100 req/min |

#### 2.7.3 Guest Restrictions

**Guest Conditional Access Policy:**

```json
{
  "guestConditionalAccess": {
    "name": "MAP Guest User Policy",
    "targetUsers": {
      "includeGroups": ["B2B-Guest-Users"],
      "excludeGroups": []
    },
    "conditions": {
      "clientApps": ["browser", "mobileAppsAndDesktopClients"],
      "platforms": {
        "includePlatforms": ["windows", "macOS", "ios", "android"],
        "excludePlatforms": []
      },
      "locations": {
        "includeLocations": ["All"],
        "excludeLocations": ["AllTrusted"]
      },
      "riskLevels": ["low", "medium", "high"]
    },
    "grantControls": {
      "operator": "OR",
      "builtInControls": ["mfa"]
    },
    "sessionControls": {
      "signInFrequency": {
        "value": 8,
        "type": "hours",
        "isEnabled": true
      },
      "persistentBrowser": {
        "mode": "never",
        "isEnabled": true
      }
    },
    "enforcePolicy": true
  }
}
```

**Guest Lifecycle Management:**

| Event | Action | Timeline |
|---|---|---|
| Invitation Sent | Guest receives email invitation | Immediate |
| Invitation Accepted | Guest account created, MAP account provisioned | Immediate |
| First Sign-in | MFA registration required | Immediate |
| Assignment Added | Project access granted | Immediate |
| Assignment Removed | Project access revoked | Immediate |
| Invitation Expiry | Account deactivated | Default: 90 days |
| Guest Removal | Account removed from Entra ID and MAP | Immediate |

---

### 2.8 Administration

#### 2.8.1 Admin Roles

MAP defines specialised administrative roles for managing the platform.

| Admin Role | Entra ID Role | MAP Role | Responsibilities |
|---|---|---|---|
| Global Administrator | Global Administrator | Organisation Administrator | Full control (use sparingly) |
| MAP Administrator | Application Administrator | Organisation Administrator | MAP-specific administration |
| Security Administrator | Security Administrator | Security Administrator | Security policies, CA policies, audit |
| User Administrator | User Administrator | User Management | User provisioning and deprovisioning |
| Helpdesk Administrator | Helpdesk Administrator | Limited User Management | Password resets, account unlocks |
| Billing Administrator | Billing Administrator | Billing Administrator | Subscription and billing management |

**Admin Role Best Practices:**

1. **Limit Global Administrator count** — Maximum 2 per tenant.
2. **Use specialised admin roles** — Assign the minimum admin role required.
3. **Enable PIM** — All admin roles should use Privileged Identity Management (see Section 2.8.2).
4. **Require MFA** — All admin role activations require MFA.
5. **Regular access reviews** — Quarterly review of all admin role assignments.

#### 2.8.2 Privileged Access Management (PIM)

MAP integrates with Entra ID Privileged Identity Management (PIM) for just-in-time admin access.

**PIM Configuration for MAP Admin Roles:**

| Role | Activation Type | Max Duration | Approval Required | MFA Required |
|---|---|---|---|---|
| Organisation Administrator | Time-limited | 4 hours | Yes (2 approvers) | Yes |
| Security Administrator | Time-limited | 4 hours | Yes (2 approvers) | Yes |
| Integration Administrator | Time-limited | 8 hours | Yes (1 approver) | Yes |
| Billing Administrator | Time-limited | 4 hours | Yes (1 approver) | Yes |
| Project Administrator | Time-limited | 8 hours | No (auto-approved) | Yes |

**PIM Activation Flow:**

```
Admin Requests Activation → MFA Challenge → Justification Provided →
Approval Requested (if required) → Approval Granted → Role Activated →
Time-Limited Access → Auto-Deactivation → Audit Log Created
```

**PIM Configuration:**

```json
{
  "pim": {
    "enabled": true,
    "roles": [
      {
        "roleName": "Organisation Administrator",
        "activationMaxDurationHours": 4,
        "approvalRequired": true,
        "approvers": [
          { "type": "group", "id": "MAP-SecurityAdmins" }
        ],
        "minApprovers": 2,
        "mfaOnActivation": true,
        "justificationRequired": true,
        "alertOnActivation": true,
        "alertRecipients": ["security@acme.com"]
      },
      {
        "roleName": "Security Administrator",
        "activationMaxDurationHours": 4,
        "approvalRequired": true,
        "approvers": [
          { "type": "group", "id": "MAP-Admins" }
        ],
        "minApprovers": 2,
        "mfaOnActivation": true,
        "justificationRequired": true,
        "alertOnActivation": true,
        "alertRecipients": ["security@acme.com"]
      }
    ],
    "accessReviews": {
      "frequency": "quarterly",
      "reviewers": ["role:Security Administrator"],
      "autoRemediate": true
    }
  }
}
```

#### 2.8.3 Privileged Access Policies

| Policy | Description | Configuration |
|---|---|---|
| Maximum Activation Duration | Limit how long admin access lasts | 4–8 hours depending on role |
| Approval Workflow | Require approval before admin access is granted | 1–2 approvers required |
| MFA on Activation | Require MFA when activating admin role | Always required |
| Justification Required | Admin must provide business justification | Always required |
| Notification on Activation | Alert security team when admin access is activated | Always enabled |
| Session Recording | Record admin sessions for audit purposes | Enabled for critical roles |
| Access Reviews | Periodically review who has admin access | Quarterly |
| Emergency Access | Break-glass procedure for critical situations | Documented and tested |

**Emergency Access (Break-Glass) Procedure:**

| Step | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Identify emergency situation | Requestor | Immediate |
| 2 | Contact Security Administrator (phone) | Requestor | Immediate |
| 3 | Security Admin activates emergency account | Security Admin | Within 15 minutes |
| 4 | Emergency access granted with full audit logging | MAP Platform | Automatic |
| 5 | Issue resolved, access revoked | Security Admin | ASAP |
| 6 | Post-incident review documented | Security Team | Within 48 hours |

---

### 2.9 Conditional Access

#### 2.9.1 Location-Based Policies

Conditional access policies restrict access based on network location.

**Location Definitions:**

| Location Name | Type | CIDR Ranges | Trusted |
|---|---|---|---|
| Corporate Office — London | Named | 203.0.113.0/24 | Yes |
| Corporate Office — New York | Named | 198.51.100.0/24 | Yes |
| VPN — UK | Named | 192.0.2.0/24 | Yes |
| VPN — EU | Named | 10.128.0.0/16 | Yes |
| All Trusted | Group | All trusted locations | Yes |
| All Other Locations | Default | Everything else | No |

**Location-Based Conditional Access Policy:**

```json
{
  "locationBasedPolicy": {
    "name": "MAP — Block Untrusted Locations",
    "targetUsers": {
      "includeGroups": ["All Users"],
      "excludeGroups": ["MAP-BreakGlassAccounts"]
    },
    "conditions": {
      "locations": {
        "includeLocations": ["All Other Locations"],
        "excludeLocations": ["All Trusted"]
      }
    },
    "grantControls": {
      "operator": "OR",
      "builtInControls": ["mfa", "compliantDevice"]
    },
    "sessionControls": {
      "signInFrequency": {
        "value": 4,
        "type": "hours",
        "isEnabled": true
      }
    },
    "enforcePolicy": true
  }
}
```

#### 2.9.2 Device-Based Policies

Conditional access policies restrict access based on device compliance and management status.

| Device State | Policy Action | Notes |
|---|---|---|
| Compliant (Intune-managed) | Allow with standard MFA | Full access |
| Non-compliant (Intune-managed) | Block access | Device must be remediated |
| Hybrid Azure AD Joined | Allow with standard MFA | Full access |
| Azure AD Registered | Allow with step-up MFA | Additional verification required |
| Unknown Device | Block or require MFA + compliant device | Restricted access |

**Device-Based Conditional Access Policy:**

```json
{
  "deviceBasedPolicy": {
    "name": "MAP — Require Compliant Device",
    "targetUsers": {
      "includeGroups": ["All Users"],
      "excludeGroups": ["MAP-GuestUsers", "MAP-BreakGlassAccounts"]
    },
    "conditions": {
      "clientApps": ["browser", "mobileAppsAndDesktopClients"],
      "platforms": {
        "includePlatforms": ["windows", "macOS"],
        "excludePlatforms": []
      }
    },
    "grantControls": {
      "operator": "OR",
      "builtInControls": ["compliantDevice", "domainJoinedDevice"]
    },
    "sessionControls": {},
    "enforcePolicy": true
  }
}
```

#### 2.9.3 Risk-Based Policies

Risk-based policies leverage Entra ID Identity Protection to respond to detected risks.

| Risk Type | Detection Source | Policy Action |
|---|---|---|
| User Risk (High) | Identity Protection — leaked credentials, anomalous behaviour | Force password change + MFA |
| User Risk (Medium) | Identity Protection — moderate anomalies | Require MFA |
| Sign-in Risk (High) | Identity Protection — impossible travel, unfamiliar location | Block access or require MFA + compliant device |
| Sign-in Risk (Medium) | Identity Protection — medium-risk signals | Require MFA |
| Sign-in Risk (Low) | Identity Protection — low-risk signals | Allow with standard controls |

**Risk-Based Conditional Access Policy:**

```json
{
  "riskBasedPolicy": {
    "name": "MAP — Risk-Based Access",
    "policies": [
      {
        "policyName": "High Risk Sign-in — Block",
        "targetUsers": {
          "includeGroups": ["All Users"],
          "excludeGroups": ["MAP-BreakGlassAccounts"]
        },
        "conditions": {
          "signInRiskLevels": ["high"]
        },
        "grantControls": {
          "operator": "OR",
          "builtInControls": ["mfa"]
        },
        "sessionControls": {
          "signInFrequency": {
            "value": 1,
            "type": "hours",
            "isEnabled": true
          }
        },
        "enforcePolicy": true
      },
      {
        "policyName": "High Risk User — Force Password Change",
        "targetUsers": {
          "includeGroups": ["All Users"],
          "excludeGroups": ["MAP-BreakGlassAccounts"]
        },
        "conditions": {
          "userRiskLevels": ["high"]
        },
        "grantControls": {
          "operator": "AND",
          "builtInControls": ["mfa", "passwordChange"]
        },
        "enforcePolicy": true
      },
      {
        "policyName": "Medium Risk — Step-Up MFA",
        "targetUsers": {
          "includeGroups": ["All Users"],
          "excludeGroups": ["MAP-BreakGlassAccounts"]
        },
        "conditions": {
          "signInRiskLevels": ["medium"],
          "userRiskLevels": ["medium"]
        },
        "grantControls": {
          "operator": "OR",
          "builtInControls": ["mfa"]
        },
        "enforcePolicy": true
      }
    ]
  }
}
```

**Complete Conditional Access Policy Set:**

| # | Policy Name | Target | Conditions | Controls |
|---|---|---|---|---|
| 1 | Block Legacy Authentication | All users | Legacy auth clients | Block |
| 2 | Require MFA for All Users | All users | All sign-ins | MFA |
| 3 | Require Compliant Device | Internal users | Windows, macOS | Compliant device |
| 4 | Block Untrusted Locations | All users | Non-corporate IPs | MFA + compliant device |
| 5 | Risk-Based — High Sign-in | All users | High sign-in risk | MFA (1h session) |
| 6 | Risk-Based — High User | All users | High user risk | MFA + password change |
| 7 | Risk-Based — Medium | All users | Medium risk | MFA |
| 8 | Guest User Policy | Guest users | All sign-ins | MFA (8h session) |
| 9 | Admin Role Policy | Admin users | All sign-ins | MFA (4h session) |
| 10 | Break-Glass Exclusion | Break-glass accounts | All conditions | Excluded from all policies |

---

### 2.10 Audit

#### 2.10.1 Access Reviews

MAP supports periodic access reviews to ensure access rights remain appropriate.

**Access Review Configuration:**

| Review Type | Frequency | Scope | Reviewers | Auto-Remediate |
|---|---|---|---|---|
| Admin Role Review | Quarterly | All admin role assignments | CISO + VP Engineering | No (manual approval) |
| Project Access Review | Monthly | Project member assignments | Project Manager | Yes (auto-remove inactive) |
| Guest User Review | Monthly | All guest user accounts | Security Administrator | Yes (auto-revoke expired) |
| Service Principal Review | Quarterly | All API keys and service accounts | Integration Administrator | Yes (auto-revoke unused) |
| Privileged Access Review | Monthly | PIM role activations | Security Administrator | Yes (auto-deactivate) |

**Access Review Workflow:**

```
Review Created → Reviewers Notified → Review Period (7 days) →
Reviewer Decisions (Approve/Deny/No Response) →
Auto-Remediation (if enabled) → Review Report Generated →
Audit Log Created → Non-Compliant Access Remediated
```

**Access Review Configuration:**

```json
{
  "accessReviews": [
    {
      "name": "Quarterly Admin Role Review",
      "description": "Review all admin role assignments for appropriateness",
      "frequency": "quarterly",
      "scope": {
        "roles": ["Organisation Administrator", "Security Administrator", "Billing Administrator"],
        "includeGuests": false
      },
      "reviewers": [
        { "type": "static", "users": ["ciso@acme.com", "vp-engineering@acme.com"] }
      ],
      "settings": {
        "reviewDurationDays": 7,
        "reminderDays": [3, 5],
        "autoApplyRemovals": false,
        "requireJustification": true,
        "allowSelfReview": false
      },
      "remediation": {
        "onApprove": "continue_access",
        "onDeny": "revoke_access",
        "onNoResponse": "flag_for_escalation",
        "escalationRecipients": ["security@acme.com"]
      }
    },
    {
      "name": "Monthly Guest User Review",
      "description": "Review all guest user accounts for continued need",
      "frequency": "monthly",
      "scope": {
        "roles": ["all"],
        "includeGuests": true
      },
      "reviewers": [
        { "type": "dynamic", "group": "MAP-SecurityAdmins" }
      ],
      "settings": {
        "reviewDurationDays": 7,
        "reminderDays": [3, 5],
        "autoApplyRemovals": true,
        "requireJustification": true,
        "allowSelfReview": false
      },
      "remediation": {
        "onApprove": "continue_access",
        "onDeny": "revoke_access_and_remove",
        "onNoResponse": "revoke_access",
        "escalationRecipients": []
      }
    }
  ]
}
```

#### 2.10.2 Audit Logs

MAP captures comprehensive audit logs for all identity and access events.

**Audit Log Categories:**

| Category | Events | Retention | Storage |
|---|---|---|---|
| Authentication Events | Sign-in, sign-out, failed sign-in, MFA challenge | 2 years | Immutable append-only |
| Authorisation Events | Permission check, role assignment, deny assignment | 2 years | Immutable append-only |
| User Management | User creation, update, deletion, deactivation | 2 years | Immutable append-only |
| Role Management | Role creation, update, deletion, assignment | 2 years | Immutable append-only |
| Policy Changes | CA policy creation, update, deletion | 2 years | Immutable append-only |
| Administrative Actions | All admin operations with before/after state | 2 years | Immutable append-only |
| Security Events | Risk detections, threat detections, anomalies | 2 years | Immutable append-only |
| Access Reviews | Review creation, decisions, remediation | 2 years | Immutable append-only |

**Audit Log Query API:**

```http
GET /api/v1/audit-logs?
  category=authentication&
  action=sign-in.success&
  startDate=2026-07-01T00:00:00Z&
  endDate=2026-07-31T23:59:59Z&
  userId=usr-abc123&
  limit=100&
  offset=0
```

**Audit Log Entry Schema:**

```json
{
  "eventId": "evt-2026-07-15-00001234",
  "timestamp": "2026-07-15T14:32:01.123456Z",
  "category": "Authentication",
  "action": "sign-in.success",
  "severity": "Information",
  "actor": {
    "userId": "usr-abc123",
    "email": "jane.smith@acme.com",
    "displayName": "Jane Smith",
    "ipAddress": "203.0.113.42",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "sessionId": "sess-xyz789",
    "authMethod": "SAML",
    "mfaUsed": true
  },
  "resource": {
    "type": "Organisation",
    "id": "org-acme",
    "name": "Acme Financial Services"
  },
  "target": {
    "type": "Project",
    "id": "proj-cbm-p1",
    "name": "Core Banking Migration — Phase 1"
  },
  "details": {
    "ssoProvider": "Microsoft Entra ID",
    "tenantId": "tenant-acme",
    "riskLevel": "low",
    "deviceCompliant": true
  },
  "outcome": "success",
  "correlationId": "corr-abc123",
  "chainHash": "sha256:a1b2c3d4..."
}
```

#### 2.10.3 Compliance Reporting

MAP provides compliance reports for IAM-related regulatory requirements.

| Report | Audience | Frequency | Content |
|---|---|---|---|
| Access Certification Report | Compliance, Audit | Quarterly | All access review results and remediation actions |
| Privileged Access Report | Security, Audit | Monthly | All PIM activations, admin role usage, break-glass usage |
| Authentication Report | Security | Weekly | Sign-in statistics, MFA adoption, failed authentications |
| Guest Access Report | Security | Monthly | Guest user inventory, access patterns, expiry status |
| Segregation of Duties Report | Compliance, Audit | Quarterly | SoD violations, overrides, exceptions |
| Service Account Report | Integration, Security | Monthly | Service principal inventory, key rotation, usage patterns |
| Conditional Access Report | Security | Monthly | Policy effectiveness, block counts, override requests |
| Data Access Report | Compliance, Audit | Monthly | Who accessed what data, when, from where |

**Compliance Report Generation:**

```http
POST /api/v1/reports/generate
{
  "reportType": "compliance.access-certification",
  "parameters": {
    "reviewPeriod": "Q2-2026",
    "scope": "organisation",
    "includeRemediation": true,
    "format": "pdf",
    "distribution": ["ciso@acme.com", "audit@acme.com"]
  }
}
```

**Compliance Dashboard Widgets:**

| Widget | Data Source | Visualisation | Refresh Rate |
|---|---|---|---|
| MFA Adoption Rate | Authentication logs | Gauge (0–100%) | Real-time |
| Admin Role Usage | PIM logs | Bar chart | Daily |
| Access Review Completion | Access review logs | Progress bar | Real-time |
| Guest User Count | User directory | Number | Real-time |
| Conditional Access Blocks | CA logs | Trend line (30 days) | Daily |
| Failed Authentications | Authentication logs | Trend line (7 days) | Real-time |
| Privileged Activations | PIM logs | Heatmap (by role) | Daily |
| Segregation Violations | RBAC engine | Number + list | Real-time |

---

## 3. Dependencies

| Dependency | Version / Requirement | Notes |
|---|---|---|
| MAP Platform | v1.4 or later | Core platform |
| Microsoft Entra ID P2 | Tenant licence | Required for Conditional Access, PIM, Identity Protection |
| Microsoft Intune | P1 or higher | Required for device compliance policies |
| Entra ID B2B | Enabled in tenant | Required for guest user collaboration |
| SCIM 2.0 | Supported by MAP | Required for automated provisioning |
| SAML 2.0 | SP and IdP support | Required for SAML-based SSO |
| OpenID Connect | SP and IdP support | Required for OIDC-based SSO |
| SMTP | Configured email relay | For invitation and notification emails |
| FIDO2 Keys | Optional hardware tokens | For high-security environments |
| Network | VPN or approved IPs | For IP-restricted access |

---

## 4. References

| Reference ID | Document | Version |
|---|---|---|
| REF-001 | MAP Platform Architecture Document | v1.4 |
| REF-002 | MAP Security Hardening Guide | v1.0 |
| REF-003 | MAP Customer Configuration Guide (MAP-DOC-PCG-001) | v1.0 |
| REF-004 | Microsoft Entra ID Documentation | Current |
| REF-005 | Microsoft Entra ID Security Best Practices | Current |
| REF-006 | NIST SP 800-63B — Digital Identity Guidelines | Rev. 3 |
| REF-007 | NIST SP 800-53 — Security and Privacy Controls | Rev. 5 |
| REF-008 | ISO 27001:2022 — Information Security Management | 2022 |
| REF-009 | ISO 27018:2019 — Protection of PII in Public Cloud | 2019 |
| REF-010 | SOC 2 Type II — Trust Services Criteria | 2017 |
| REF-011 | GDPR — Regulation (EU) 2016/679 | 2016 |
| REF-012 | UK NCSC — Cloud Security Principles | Current |

---

## 5. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 01 Jun 2026 | MAP Security Engineering | Initial draft |
| 0.2 | 10 Jun 2026 | MAP Security Engineering | Added Sections 2.1–2.3 (Entra ID, SSO, MFA) |
| 0.3 | 18 Jun 2026 | MAP Security Engineering | Added Sections 2.4–2.6 (RBAC, Roles, Lifecycle) |
| 0.4 | 25 Jun 2026 | Customer Security Review | Incorporated feedback on conditional access and audit |
| 0.5 | 30 Jun 2026 | MAP Security Engineering | Final review and integration testing notes |
| 1.0 | 01 Jul 2026 | MAP Security Engineering | Final version — Official release |

---

## 6. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Chief Information Security Officer | | | |
| Head of MAP Platform Security | | | |
| VP of Customer Success | | | |
| Head of Identity and Access Management | | | |

---

## 7. Appendices

### Appendix A — IAM Configuration Checklist

Use this checklist during customer onboarding to ensure all IAM configuration steps are completed.

| # | Category | Task | Owner | Status | Date Completed |
|---|---|---|---|---|---|
| 1 | Entra ID | Verify tenant readiness and licences | Customer IT | ☐ | |
| 2 | Entra ID | Create MAP service account | Customer IT | ☐ | |
| 3 | Entra ID | Register MAP Enterprise Application | Customer IT | ☐ | |
| 4 | Entra ID | Configure API permissions and grant consent | Customer IT | ☐ | |
| 5 | Entra ID | Create MAP admin groups | Customer IT | ☐ | |
| 6 | Entra ID | Create MAP role assignment groups | Customer IT | ☐ | |
| 7 | SSO | Configure SAML 2.0 or OIDC | Customer IT + MAP | ☐ | |
| 8 | SSO | Test SSO authentication flow | Customer IT + MAP | ☐ | |
| 9 | SSO | Configure SLO (single logout) | Customer IT | ☐ | |
| 10 | MFA | Enable MFA methods in Entra ID | Customer IT | ☐ | |
| 11 | MFA | Configure MAP MFA enforcement | Customer IT + MAP | ☐ | |
| 12 | MFA | Test MFA flow with pilot users | Customer IT | ☐ | |
| 13 | Provisioning | Configure SCIM or group-based provisioning | Customer IT + MAP | ☐ | |
| 14 | Provisioning | Map attributes correctly | Customer IT + MAP | ☐ | |
| 15 | Provisioning | Test provisioning with test user | Customer IT | ☐ | |
| 16 | RBAC | Review and assign built-in roles | Customer Admin | ☐ | |
| 17 | RBAC | Create custom roles (if needed) | Customer Admin | ☐ | |
| 18 | RBAC | Configure role mapping | Customer Admin + MAP | ☐ | |
| 19 | RBAC | Verify segregation of duties | Customer Security | ☐ | |
| 20 | Conditional Access | Define location-based policies | Customer IT | ☐ | |
| 21 | Conditional Access | Define device-based policies | Customer IT | ☐ | |
| 22 | Conditional Access | Define risk-based policies | Customer IT + MAP | ☐ | |
| 23 | Conditional Access | Test CA policies with pilot users | Customer IT | ☐ | |
| 24 | PIM | Configure PIM for admin roles | Customer IT | ☐ | |
| 25 | PIM | Test PIM activation flow | Customer IT | ☐ | |
| 26 | Guest Users | Configure B2B collaboration settings | Customer IT | ☐ | |
| 27 | Guest Users | Configure guest conditional access | Customer IT | ☐ | |
| 28 | Audit | Verify audit log capture | Customer Security + MAP | ☐ | |
| 29 | Audit | Configure audit log export to SIEM | Customer Security | ☐ | |
| 30 | Access Reviews | Schedule first access review | Customer Security | ☐ | |

### Appendix B — Troubleshooting SSO

| Issue | Possible Cause | Resolution |
|---|---|---|
| SSO login loop | Clock skew between MAP and Entra ID | Ensure NTP is configured; check clockSkewSeconds setting |
| "AADSTS50105" error | User not assigned to MAP app | Assign user to MAP Enterprise Application in Entra ID |
| "AADSTS700016" error | Incorrect application ID | Verify Client ID in MAP SSO configuration |
| MFA not triggering | Conditional Access policy not applying | Check policy scope and exclusions |
| User not provisioned | SCIM sync failure | Check provisioning logs in Entra ID |
| Role not assigned | Group mapping misconfigured | Verify Entra ID group membership and MAP role mapping |
| Token validation failure | Certificate expired | Rotate signing certificate in Entra ID |
| Session not persisting | Session binding too restrictive | Review session management settings |

### Appendix C — API Endpoints for IAM Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/iam/roles` | List all MAP roles |
| POST | `/api/v1/iam/roles` | Create a custom role |
| GET | `/api/v1/iam/roles/{roleId}/assignments` | List role assignments |
| POST | `/api/v1/iam/roles/{roleId}/assignments` | Assign role to user |
| DELETE | `/api/v1/iam/roles/{roleId}/assignments/{userId}` | Remove role assignment |
| GET | `/api/v1/iam/deny-assignments` | List deny assignments |
| POST | `/api/v1/iam/deny-assignments` | Create deny assignment |
| GET | `/api/v1/iam/audit-logs` | Query audit logs |
| GET | `/api/v1/iam/access-reviews` | List access reviews |
| POST | `/api/v1/iam/access-reviews` | Create access review |
| GET | `/api/v1/iam/users/{userId}/access` | Get user's effective permissions |
| POST | `/api/v1/iam/provisioning/sync` | Trigger provisioning sync |
| GET | `/api/v1/iam/provisioning/logs` | Get provisioning logs |

### Appendix D — Security Hardening Summary

| Control | Setting | Rationale |
|---|---|---|
| Block legacy authentication | Enabled | Prevents bypass of modern auth controls |
| Require MFA for all users | Enabled | Defence against credential theft |
| Require compliant device | Enabled for internal users | Prevents access from unmanaged devices |
| Block untrusted locations | MFA + compliant device required | Reduces attack surface |
| Session frequency (admins) | 4 hours maximum | Limits exposure of admin sessions |
| Session frequency (guests) | 8 hours maximum | Limits exposure of guest sessions |
| PIM for all admin roles | Enabled with approval | Just-in-time admin access |
| Access reviews (admin) | Quarterly | Ensures ongoing appropriateness of access |
| Break-glass accounts | 2 accounts, excluded from CA | Emergency access mechanism |
| Audit log retention | 2 years | Regulatory compliance |
| Password policy | Entra ID managed | 14-character minimum, banned passwords |

---

*End of Document*
