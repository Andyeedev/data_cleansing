MAP Nexus™ Enterprise Platform
Prompt 034
Create Subscriptions

Version: 5.0

Prompt ID: 034

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

Enhance the Subscriptions portal within the Administration Portal for MAP Nexus™.

Subscriptions provides comprehensive subscription and licensing management including plan management, billing, usage tracking, and subscription analytics.

This prompt enhances the placeholder UI created in Prompt 015 with full subscription management functionality.

---

Objective

Develop a complete Subscriptions module capable of:

Plan Management — Define and manage subscription plans
Subscription Management — Create, modify, and cancel subscriptions
Billing Management — Invoices, payments, and billing cycles
Usage Tracking — Feature usage, limits, and overages
License Management — License keys, activation, and compliance
Subscription Analytics — Revenue, churn, and growth metrics
Trial Management — Trial periods, conversions, and extensions
Subscription Communications — Notifications and renewal reminders

---

Design Principles

Subscriptions shall be

Flexible — Multiple plan types and billing cycles
Transparent — Clear pricing and usage visibility
Automated — Automated billing and renewals
Auditable — Complete billing audit trail
Secure — Payment security and compliance
Extensible — Custom plans and pricing
Metadata Driven — Configuration over code
API Ready — RESTful API integration points

---

Architecture

Subscriptions communicates through

Administration Portal
↓
Subscriptions UI
↓
Subscriptions Hook (useSubscriptions)
↓
Subscriptions Service
↓
Subscriptions API (Future)

---

Folder Structure

Enhance

src/
portal/
administration/
SubscriptionManagement.tsx (Enhance existing)
hooks/
useSubscriptions.ts
services/
subscriptions.service.ts
types/
subscriptions.types.ts
components/
PlanManagement.tsx
SubscriptionDirectory.tsx
SubscriptionDetail.tsx
BillingManagement.tsx
InvoiceManagement.tsx
PaymentProcessing.tsx
UsageTracking.tsx
LicenseManagement.tsx
SubscriptionAnalytics.tsx
TrialManagement.tsx
SubscriptionCommunications.tsx
SubscriptionReports.tsx
PlanComparison.tsx
SubscriptionCalculator.tsx

---

Subscription Types

SubscriptionPlan

id: string
name: string
description: string
type: PlanType
status: PlanStatus
pricing: PlanPricing
features: PlanFeature[]
limits: PlanLimits
trialDays?: number
isPublic: boolean
displayOrder: number
createdAt: Date
updatedAt: Date
metadata?: Record<string, unknown>

PlanType

enum PlanType {
Free = 'free',
Starter = 'starter',
Professional = 'professional',
Enterprise = 'enterprise',
Custom = 'custom'
}

PlanStatus

enum PlanStatus {
Active = 'active',
Inactive = 'inactive',
Deprecated = 'deprecated',
Draft = 'draft'
}

PlanPricing

monthly: number
annual: number
currency: string
billingCycle: BillingCycle
setupFee?: number
discountPercentage?: number

BillingCycle

enum BillingCycle {
Monthly = 'monthly',
Quarterly = 'quarterly',
Annually = 'annually',
OneTime = 'one_time'
}

PlanFeature

featureId: string
name: string
description: string
included: boolean
limit?: number
overagePrice?: number

PlanLimits

maxUsers: number
maxStorage: number
maxApiCalls: number
maxProjects: number
maxExports: number
customLimits?: Record<string, number>

Subscription

id: string
tenantId: string
planId: string
status: SubscriptionStatus
billingCycle: BillingCycle
startDate: Date
endDate?: Date
nextBillingDate?: Date
autoRenew: boolean
quantity: number
discount?: number
totalAmount: number
currency: string
paymentMethod?: PaymentMethod
invoiceId?: string
trialEndsAt?: Date
cancelledAt?: Date
cancelReason?: string
createdAt: Date
updatedAt: Date
metadata?: Record<string, unknown>

SubscriptionStatus

enum SubscriptionStatus {
Active = 'active',
Trialing = 'trialing',
PastDue = 'past_due',
Paused = 'paused',
Canceled = 'canceled',
Expired = 'expired',
Pending = 'pending'
}

PaymentMethod

id: string
type: PaymentType
last4?: string
brand?: string
expiryMonth?: number
expiryYear?: number
isDefault: boolean
billingAddress?: Address

PaymentType

enum PaymentType {
CreditCard = 'credit_card',
DebitCard = 'debit_card',
PayPal = 'paypal',
BankTransfer = 'bank_transfer',
Invoice = 'invoice'
}

Address

line1: string
line2?: string
city: string
state: string
postalCode: string
country: string

Invoice

id: string
subscriptionId: string
tenantId: string
amount: number
currency: string
status: InvoiceStatus
dueDate: Date
paidAt?: Date
paymentMethod?: string
items: InvoiceItem[]
tax?: number
discount?: number
total: number
createdAt: Date
metadata?: Record<string, unknown>

InvoiceStatus

enum InvoiceStatus {
Draft = 'draft',
Sent = 'sent',
Paid = 'paid',
Overdue = 'overdue',
Canceled = 'canceled',
Refunded = 'refunded'
}

InvoiceItem

description: string
quantity: number
unitPrice: number
amount: number
tax?: number

UsageRecord

id: string
tenantId: string
subscriptionId: string
feature: string
quantity: number
unit: string
timestamp: Date
metadata?: Record<string, unknown>

License

id: string
key: string
subscriptionId: string
tenantId: string
planId: string
status: LicenseStatus
activatedAt?: Date
expiresAt?: Date
maxActivations: number
currentActivations: number
createdAt: Date
metadata?: Record<string, unknown>

LicenseStatus

enum LicenseStatus {
Active = 'active',
Expired = 'expired',
Revoked = 'revoked',
Pending = 'pending'
}

---

Hook: useSubscriptions

const useSubscriptions = (config?: SubscriptionsConfig) => {
return {
// Plan CRUD
plans: SubscriptionPlan[],
selectedPlan: SubscriptionPlan | null,
loading: boolean,
error: string | null,

// Plan Actions
fetchPlans: (filters?: PlanFilters) => Promise<void>,
getPlanById: (id: string) => Promise<SubscriptionPlan>,
createPlan: (data: CreatePlanData) => Promise<SubscriptionPlan>,
updatePlan: (id: string, data: UpdatePlanData) => Promise<SubscriptionPlan>,
deletePlan: (id: string) => Promise<void>,
clonePlan: (id: string, name: string) => Promise<SubscriptionPlan>,

// Subscription CRUD
subscriptions: Subscription[],
selectedSubscription: Subscription | null,
fetchSubscriptions: (filters?: SubscriptionFilters) => Promise<void>,
getSubscriptionById: (id: string) => Promise<Subscription>,
createSubscription: (data: CreateSubscriptionData) => Promise<Subscription>,
updateSubscription: (id: string, data: UpdateSubscriptionData) => Promise<Subscription>,
cancelSubscription: (id: string, reason: string) => Promise<Subscription>,
reactivateSubscription: (id: string) => Promise<Subscription>,

// Billing
getInvoices: (tenantId: string) => Promise<Invoice[]>,
getInvoiceById: (id: string) => Promise<Invoice>,
generateInvoice: (subscriptionId: string) => Promise<Invoice>,
processPayment: (invoiceId: string) => Promise<PaymentResult>,
retryPayment: (invoiceId: string) => Promise<PaymentResult>,

// Usage
getUsage: (tenantId: string, feature?: string) => Promise<UsageRecord[]>,
trackUsage: (tenantId: string, feature: string, quantity: number) => Promise<void>,
getUsageSummary: (tenantId: string) => Promise<UsageSummary>,
checkLimits: (tenantId: string) => Promise<LimitCheck>,

// License
getLicense: (tenantId: string) => Promise<License>,
activateLicense: (key: string) => Promise<License>,
validateLicense: (tenantId: string) => Promise<LicenseValidation>,
deactivateLicense: (tenantId: string) => Promise<void>,

// Analytics
getSubscriptionStats: () => Promise<SubscriptionStats>,
getRevenueMetrics: (startDate: Date, endDate: Date) => Promise<RevenueMetrics>,
getChurnMetrics: () => Promise<ChurnMetrics>,
getGrowthMetrics: () => Promise<GrowthMetrics>,

// Trial
startTrial: (tenantId: string, planId: string) => Promise<Subscription>,
extendTrial: (subscriptionId: string, days: number) => Promise<Subscription>,
convertTrial: (subscriptionId: string) => Promise<Subscription>,

// Search
searchSubscriptions: (query: string) => Promise<Subscription[]>,
filterSubscriptions: (filters: SubscriptionFilters) => Promise<Subscription[]>,
};
};

---

Components

PlanManagement

Define and manage subscription plans.

Features:
- Plan creation and editing
- Pricing configuration
- Feature definition
- Limit setting
- Plan versioning
- Plan comparison

SubscriptionDirectory

Full subscription listing with search and filters.

Features:
- Search by tenant, plan, status
- Filter by status, plan, date
- Sort by amount, date, status
- Bulk actions
- Export capabilities

SubscriptionDetail

Detailed subscription view.

Features:
- Subscription information
- Billing history
- Usage metrics
- License information
- Change history
- Actions (cancel, reactivate, modify)

BillingManagement

Billing cycle and invoice management.

Features:
- Invoice generation
- Payment processing
- Billing calendar
- Overdue management
- Refund processing
- Tax calculation

UsageTracking

Feature usage tracking and limit management.

Features:
- Usage monitoring
- Limit alerts
- Overage calculation
- Usage trends
- Cost allocation
- Capacity planning

LicenseManagement

License key management and compliance.

Features:
- License generation
- Activation management
- Compliance checking
- Revocation handling
- Renewal management
- Audit logging

SubscriptionAnalytics

Revenue and subscription analytics.

Features:
- MRR/ARR metrics
- Churn analysis
- Growth trends
- Revenue forecasting
- Customer lifetime value
- Cohort analysis

---

Widget Configuration

SubscriptionManagement widgets:

{ id: 'sub-1', type: 'status', title: 'Active Subscriptions', size: 'lg' }
{ id: 'sub-2', type: 'status', title: 'Monthly Revenue', size: 'lg' }
{ id: 'sub-3', type: 'status', title: 'Trial Conversions', size: 'lg' }
{ id: 'sub-4', type: 'status', title: 'Usage Overages', size: 'lg' }
{ id: 'sub-5', type: 'status', title: 'Expiring Licenses', size: 'lg' }

---

API Integration Points (Future)

GET /api/v1/plans — List plans
GET /api/v1/plans/:id — Get plan
POST /api/v1/plans — Create plan
PUT /api/v1/plans/:id — Update plan
DELETE /api/v1/plans/:id — Delete plan
GET /api/v1/subscriptions — List subscriptions
GET /api/v1/subscriptions/:id — Get subscription
POST /api/v1/subscriptions — Create subscription
PUT /api/v1/subscriptions/:id — Update subscription
DELETE /api/v1/subscriptions/:id — Cancel subscription
GET /api/v1/subscriptions/:id/invoices — Get invoices
POST /api/v1/subscriptions/:id/invoices — Generate invoice
POST /api/v1/invoices/:id/pay — Process payment
GET /api/v1/subscriptions/:id/usage — Get usage
POST /api/v1/subscriptions/:id/usage — Track usage
GET /api/v1/subscriptions/:id/license — Get license
POST /api/v1/subscriptions/:id/license/activate — Activate license

---

Security Considerations

Payment Security
PCI DSS compliance
Tokenized payment storage
Secure payment processing
Fraud detection

Access Controls
Subscription management permissions
Billing access controls
Payment method restrictions
Invoice approval workflows

Data Protection
Payment data encryption
Billing data retention
Right to erasure
Audit trail requirements

Compliance
Tax compliance
Regulatory reporting
Financial audit support
Revenue recognition

---

Acceptance Criteria

1. Plan management creates and edits plans correctly
2. Subscription management handles full lifecycle
3. Billing management generates invoices accurately
4. Usage tracking monitors feature usage
5. License management handles activation and compliance
6. Subscription analytics display revenue metrics
7. Trial management handles conversions
8. Payment processing works securely
9. Audit trail captures all billing changes
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

Subscription bundling
Usage-based pricing
Subscription upgrades/downgrades
Multi-currency support
Subscription API
Subscription webhooks

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
