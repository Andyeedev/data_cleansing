MAP Nexus™ Enterprise Platform
Prompt 033
Create Tenant Management

Version: 5.0

Prompt ID: 033

Workstream: 06 — Administration

Status: Draft — Pending Review

---

Prerequisites

Complete

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
Prompt 014 — Create Security Portal
Prompt 015 — Create Administration Portal

Workstream 03 — Presentation Engine
Prompt 016 — Create HTML Reporting Framework
Prompt 017 — Create Report Centre
Prompt 018 — Create Report Viewer
Prompt 019 — Create Report Scheduler
Prompt 020 — Create Report Distribution

Workstream 04 — AI Platform
Prompt 021 — Create AI Framework
Prompt 022 — Create AI Assistant
Prompt 023 — Create AI Insights
Prompt 024 — Create AI Recommendations
Prompt 025 — Create AI Report Generator

---

Purpose

Enhance the Tenant Management portal within the Administration Portal for MAP Nexus™.

Tenant Management provides comprehensive multi-tenant management including tenant provisioning, configuration, monitoring, and lifecycle management.

This prompt enhances the placeholder UI created in Prompt 015 with full tenant management functionality.

---

Objective

Develop a complete Tenant Management module capable of:

Tenant Directory — Search, filter, and manage all tenants
Tenant Provisioning — Create and configure new tenants
Tenant Configuration — Settings, branding, and customization
Tenant Monitoring — Health, usage, and performance metrics
Tenant Lifecycle — Onboarding, active, suspended, archived states
Tenant Isolation — Data isolation and security boundaries
Tenant Analytics — Usage patterns, cost allocation, and trends
Tenant Administration — Admin user management per tenant

---

Design Principles

Tenant Management shall be

Isolated — Complete data isolation between tenants
Scalable — Support thousands of tenants
Configurable — Per-tenant customization
Auditable — Full tenant activity audit trail
Secure — Tenant-level security enforcement
Compliant — Regulatory compliance per tenant
Metadata Driven — Configuration over code
API Ready — RESTful API integration points

---

Architecture

Tenant Management communicates through

Administration Portal
↓
Tenant Management UI
↓
Tenant Management Hook (useTenantManagement)
↓
Tenant Management Service
↓
Tenant Management API (Future)

---

Folder Structure

Enhance

src/
portal/
administration/
TenantManagement.tsx (Enhance existing)
hooks/
useTenantManagement.ts
services/
tenantManagement.service.ts
types/
tenantManagement.types.ts
components/
TenantDirectory.tsx
TenantProvisioning.tsx
TenantConfiguration.tsx
TenantMonitoring.tsx
TenantLifecycle.tsx
TenantIsolation.tsx
TenantAnalytics.tsx
TenantAdministration.tsx
TenantBilling.tsx
TenantSecurity.tsx
TenantCompliance.tsx
TenantReports.tsx
TenantOnboarding.tsx
TenantOffboarding.tsx

---

Tenant Types

Tenant

id: string
name: string
slug: string
description?: string
status: TenantStatus
tier: TenantTier
config: TenantConfig
branding: TenantBranding
limits: TenantLimits
usage: TenantUsage
security: TenantSecurity
compliance: TenantCompliance
adminUsers: string[]
parentTenantId?: string
createdAt: Date
updatedAt: Date
createdBy: string
metadata?: Record<string, unknown>

TenantStatus

enum TenantStatus {
Active = 'active',
Inactive = 'inactive',
Suspended = 'suspended',
Provisioning = 'provisioning',
Deprovisioning = 'deprovisioning',
Archived = 'archived'
}

TenantTier

enum TenantTier {
Free = 'free',
Starter = 'starter',
Professional = 'professional',
Enterprise = 'enterprise',
Custom = 'custom'
}

TenantConfig

id: string
tenantId: string
features: TenantFeature[]
settings: TenantSetting[]
integrations: TenantIntegration[]
retention: RetentionPolicy
notifications: NotificationConfig

TenantFeature

featureId: string
enabled: boolean
config?: Record<string, unknown>
expiresAt?: Date

TenantSetting

key: string
value: unknown
category: string
isEditable: boolean

TenantBranding

logo?: string
favicon?: string
primaryColor: string
secondaryColor: string
customCss?: string
loginMessage?: string
footerText?: string

TenantLimits

maxUsers: number
maxStorage: number
maxApiCalls: number
maxProjects: number
maxExports: number
customLimits?: Record<string, number>

TenantUsage

currentUsers: number
currentStorage: number
currentApiCalls: number
currentProjects: number
currentExports: number
lastActivityAt?: Date
usageTrend: UsageTrend

UsageTrend

enum UsageTrend {
Increasing = 'increasing',
Stable = 'stable',
Decreasing = 'decreasing'
}

TenantSecurity

mfaRequired: boolean
ipWhitelist: string[]
sessionTimeout: number
passwordPolicy: PasswordPolicy
dataEncryption: EncryptionConfig
auditLogging: boolean

PasswordPolicy

minLength: number
requireUppercase: boolean
requireLowercase: boolean
requireNumbers: boolean
requireSpecialChars: boolean
historyCount: number
maxAge: number

EncryptionConfig

atRest: boolean
inTransit: boolean
keyManagement: string

TenantCompliance

gdprEnabled: boolean
hipaaEnabled: boolean
soc2Enabled: boolean
iso27001Enabled: boolean
customCompliance?: string[]
dataResidency: string

TenantSubscription

id: string
tenantId: string
planId: string
status: SubscriptionStatus
startDate: Date
endDate?: Date
autoRenew: boolean
billingCycle: BillingCycle
paymentMethod?: string

SubscriptionStatus

enum SubscriptionStatus {
Active = 'active',
Trialing = 'trialing',
PastDue = 'past_due',
Canceled = 'canceled',
Expired = 'expired'
}

BillingCycle

enum BillingCycle {
Monthly = 'monthly',
Quarterly = 'quarterly',
Annually = 'annually'
}

---

Hook: useTenantManagement

const useTenantManagement = (config?: TenantManagementConfig) => {
return {
// Tenant CRUD
tenants: Tenant[],
selectedTenant: Tenant | null,
loading: boolean,
error: string | null,

// Actions
fetchTenants: (filters?: TenantFilters) => Promise<void>,
getTenantById: (id: string) => Promise<Tenant>,
createTenant: (data: CreateTenantData) => Promise<Tenant>,
updateTenant: (id: string, data: UpdateTenantData) => Promise<Tenant>,
deleteTenant: (id: string) => Promise<void>,
cloneTenant: (id: string, name: string) => Promise<Tenant>,

// Configuration
getTenantConfig: (tenantId: string) => Promise<TenantConfig>,
updateTenantConfig: (tenantId: string, config: TenantConfig) => Promise<Tenant>,
getTenantBranding: (tenantId: string) => Promise<TenantBranding>,
updateTenantBranding: (tenantId: string, branding: TenantBranding) => Promise<Tenant>,

// Lifecycle
activateTenant: (tenantId: string) => Promise<Tenant>,
suspendTenant: (tenantId: string, reason: string) => Promise<Tenant>,
archiveTenant: (tenantId: string) => Promise<Tenant>,
provisionTenant: (data: ProvisioningData) => Promise<Tenant>,
deprovisionTenant: (tenantId: string) => Promise<void>,

// Monitoring
getTenantHealth: (tenantId: string) => Promise<TenantHealth>,
getTenantUsage: (tenantId: string) => Promise<TenantUsage>,
getTenantPerformance: (tenantId: string) => Promise<TenantPerformance>,

// Security
getTenantSecurity: (tenantId: string) => Promise<TenantSecurity>,
updateTenantSecurity: (tenantId: string, security: TenantSecurity) => Promise<Tenant>,
getTenantAuditLog: (tenantId: string) => Promise<TenantAuditEntry[]>,

// Administration
getTenantAdminUsers: (tenantId: string) => Promise<User[]>,
addTenantAdmin: (tenantId: string, userId: string) => Promise<void>,
removeTenantAdmin: (tenantId: string, userId: string) => Promise<void>,

// Analytics
getTenantStats: () => Promise<TenantStats>,
getTenantTrends: (tenantId: string) => Promise<TenantTrends>,
getTenantCostAllocation: (tenantId: string) => Promise<CostAllocation>,

// Search
searchTenants: (query: string) => Promise<Tenant[]>,
filterTenants: (filters: TenantFilters) => Promise<Tenant[]>,
};
};

---

Components

TenantDirectory

Full tenant listing with search, filters, and bulk actions.

Features:
- Search by name, slug, status
- Filter by tier, status, region
- Sort by name, users, usage, created
- Bulk select and actions
- Tenant quick view panel
- Export capabilities

TenantProvisioning

Create and configure new tenants.

Features:
- Tenant creation wizard
- Tier selection
- Initial configuration
- Admin user assignment
- Branding setup
- Feature enablement
- Provisioning status tracking

TenantConfiguration

Per-tenant settings and customization.

Features:
- General settings
- Feature toggles
- Integration configuration
- Notification rules
- Retention policies
- Custom settings

TenantMonitoring

Tenant health and performance monitoring.

Features:
- Health status dashboard
- Usage metrics
- Performance indicators
- Error tracking
- Capacity planning
- Alert configuration

TenantLifecycle

Manage tenant lifecycle states.

Features:
- Onboarding workflow
- Status transitions
- Offboarding checklist
- Data retention policies
- Lifecycle automation
- Approval workflows

TenantAnalytics

Tenant usage and cost analytics.

Features:
- Usage trends
- Cost allocation
- User growth
- Feature adoption
- Performance metrics
- Comparative analytics

TenantSecurity

Tenant security configuration and monitoring.

Features:
- MFA configuration
- IP whitelist management
- Session policies
- Password policies
- Encryption settings
- Audit logging

---

Widget Configuration

TenantManagement widgets:

{ id: 'ten-1', type: 'status', title: 'Tenant Directory', size: 'lg' }
{ id: 'ten-2', type: 'status', title: 'Active Tenants', size: 'lg' }
{ id: 'ten-3', type: 'status', title: 'Tenant Health', size: 'lg' }
{ id: 'ten-4', type: 'status', title: 'Tenant Usage', size: 'lg' }
{ id: 'ten-5', type: 'status', title: 'Tenant Billing', size: 'lg' }

---

API Integration Points (Future)

GET /api/v1/tenants — List tenants
GET /api/v1/tenants/:id — Get tenant
POST /api/v1/tenants — Create tenant
PUT /api/v1/tenants/:id — Update tenant
DELETE /api/v1/tenants/:id — Delete tenant
GET /api/v1/tenants/:id/config — Get tenant config
PUT /api/v1/tenants/:id/config — Update tenant config
GET /api/v1/tenants/:id/branding — Get tenant branding
PUT /api/v1/tenants/:id/branding — Update tenant branding
POST /api/v1/tenants/:id/activate — Activate tenant
POST /api/v1/tenants/:id/suspend — Suspend tenant
POST /api/v1/tenants/:id/archive — Archive tenant
GET /api/v1/tenants/:id/health — Get tenant health
GET /api/v1/tenants/:id/usage — Get tenant usage
GET /api/v1/tenants/:id/security — Get tenant security
PUT /api/v1/tenants/:id/security — Update tenant security
GET /api/v1/tenants/:id/audit — Get tenant audit log

---

Security Considerations

Tenant Isolation
Complete data separation
Network isolation
Storage isolation
Processing isolation

Access Controls
Tenant admin management
Cross-tenant access prevention
Emergency access procedures
Audit trail requirements

Data Protection
Encryption at rest and in transit
Data residency compliance
Right to erasure
Data portability

Compliance
GDPR compliance
HIPAA compliance (if applicable)
SOC 2 compliance
ISO 27001 compliance

---

Acceptance Criteria

1. Tenant directory displays all tenants with search and filters
2. Tenant provisioning creates new tenants correctly
3. Tenant configuration updates persist properly
4. Tenant monitoring displays health metrics
5. Tenant lifecycle states transition correctly
6. Tenant isolation is enforced
7. Tenant analytics display usage metrics
8. Tenant security settings are enforced
9. Audit trail captures all tenant changes
10. API integration points are defined

---

Dependencies

Widget Framework (Prompt 007)
Portal Framework (Prompt 008)
Administration Portal (Prompt 015)
Theme System (Prompt 002)
Navigation System (Prompt 003)

---

Future Enhancements

Tenant federation
Tenant migration tools
Tenant performance optimization
Tenant cost optimization
Tenant compliance automation
Tenant security automation

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
