MAP Nexus™ Enterprise Platform
Prompt 044
Frontend UI — Subscription Management

Version: 1.0

Prompt ID: 044

Workstream: 06 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

034_DB_Subscription_Management
039_Subscription_API

---

Purpose

Create the React frontend for Subscription Management in the MAP Nexus™ platform.

This prompt creates the TypeScript pages, hooks, components, and services required to provide a complete subscription and billing management interface in the browser.

---

Objective

Create a subscription management UI capable of:

Plan Management — View and manage subscription plans
Subscription Directory — List tenant subscriptions
Billing Dashboard — View invoices and payments
Usage Tracking — Monitor feature usage
Subscription Actions — Upgrade, downgrade, cancel

---

Technology Stack

- Framework: React 19
- Language: TypeScript
- State: TanStack React Query
- Forms: React Hook Form + Zod
- UI: Tailwind CSS + Custom components
- API: Axios (apiClient)

---

Folder Structure

Enhance

src/
portal/
administration/
SubscriptionManagement.tsx (Enhance existing)
hooks/
useSubscriptions.ts
types/
subscription.types.ts
components/
PlanCard.tsx
PlanComparison.tsx
SubscriptionDirectory.tsx
SubscriptionDetail.tsx
BillingDashboard.tsx
InvoiceList.tsx
UsageMetrics.tsx
SubscriptionActions.tsx
services/
SubscriptionService.ts

---

TypeScript Types

```typescript
// types/subscription.types.ts
export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled' | 'expired';
export type BillingCycle = 'monthly' | 'quarterly' | 'annually';

export interface Plan {
  id: string;
  name: string;
  description?: string;
  type: PlanType;
  status: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  trialDays: number;
  maxUsers?: number;
  maxStorageGb?: number;
  maxApiCalls?: number;
  features: string[];
  isPublic: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  quantity: number;
  discountPercent: number;
  monthlyAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  trialEndDate?: string;
  canceledAt?: string;
  autoRenew: boolean;
  createdAt: string;
  plan?: Plan;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  tenantId: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface UsageRecord {
  featureKey: string;
  totalQuantity: number;
  periodStart: string;
  periodEnd: string;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus;
  page?: number;
  pageSize?: number;
}

export interface CreateSubscriptionInput {
  tenantId: string;
  planId: string;
  billingCycle: BillingCycle;
  quantity?: number;
}
```

---

API Service

```typescript
// services/SubscriptionService.ts
import apiClient from '../../api/client';
import type { 
  Plan, Subscription, Invoice, UsageRecord,
  CreateSubscriptionInput, SubscriptionFilters 
} from '../types/subscription.types';

export const SubscriptionService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data.plans;
  },

  getPlan: async (id: string): Promise<Plan> => {
    const response = await apiClient.get(`/subscriptions/plans/${id}`);
    return response.data;
  },

  getSubscriptions: async (filters?: SubscriptionFilters): Promise<Subscription[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    
    const response = await apiClient.get(`/subscriptions?${params.toString()}`);
    return response.data.subscriptions;
  },

  createSubscription: async (data: CreateSubscriptionInput): Promise<Subscription> => {
    const response = await apiClient.post('/subscriptions', data);
    return response.data;
  },

  cancelSubscription: async (id: string, reason?: string): Promise<Subscription> => {
    const response = await apiClient.post(`/subscriptions/${id}/cancel`, { reason });
    return response.data;
  },

  getInvoices: async (subscriptionId: string): Promise<Invoice[]> => {
    const response = await apiClient.get(`/subscriptions/${subscriptionId}/invoices`);
    return response.data.invoices;
  },

  trackUsage: async (subscriptionId: string, featureKey: string, quantity: number): Promise<void> => {
    await apiClient.post(`/subscriptions/${subscriptionId}/usage`, { featureKey, quantity });
  },
};
```

---

Custom Hook

```typescript
// hooks/useSubscriptions.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { SubscriptionService } from '../services/SubscriptionService';
import type { SubscriptionFilters, CreateSubscriptionInput } from '../types/subscription.types';

export const usePlans = () => {
  const query = useQuery({
    queryKey: ['plans'],
    queryFn: SubscriptionService.getPlans,
  });

  return {
    plans: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useSubscriptions = (filters?: SubscriptionFilters) => {
  const query = useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: () => SubscriptionService.getSubscriptions(filters),
  });

  return {
    subscriptions: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useCreateSubscription = () => {
  const mutation = useMutation({
    mutationFn: SubscriptionService.createSubscription,
  });

  return {
    createSubscription: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useCancelSubscription = () => {
  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      SubscriptionService.cancelSubscription(id, reason),
  });

  return {
    cancelSubscription: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
```

---

Components

PlanCard.tsx

Individual plan card showing pricing, features, and limits.

PlanComparison.tsx

Side-by-side plan comparison table.

SubscriptionDirectory.tsx

List of tenant subscriptions with status and actions.

SubscriptionDetail.tsx

Detailed subscription view with billing history.

BillingDashboard.tsx

Invoice list with payment status.

UsageMetrics.tsx

Feature usage charts and capacity indicators.

SubscriptionActions.tsx

Actions menu for upgrade, downgrade, cancel.

---

Main Page

```tsx
// SubscriptionManagement.tsx
import { useState } from 'react';
import { usePlans, useSubscriptions } from './hooks/useSubscriptions';
import { PlanCard } from './components/PlanCard';
import { SubscriptionDirectory } from './components/SubscriptionDirectory';

export const SubscriptionManagement = () => {
  const { plans, isLoading: plansLoading } = usePlans();
  const { subscriptions, isLoading: subsLoading } = useSubscriptions();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Subscriptions</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage subscription plans and billing</p>
      </div>

      {/* Plans Section */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Subscriptions Section */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">Active Subscriptions</h2>
        <SubscriptionDirectory
          subscriptions={subscriptions}
          isLoading={subsLoading}
        />
      </div>
    </div>
  );
};
```

---

Acceptance Criteria

1. Plan cards display pricing and features correctly
2. Plan comparison shows differences
3. Subscription directory lists active subscriptions
4. Subscription detail shows billing history
5. Invoice list displays correctly
6. Usage metrics charts render
7. Subscription actions (cancel, upgrade) work
8. Loading states display properly
9. Error handling shows appropriate messages
10. Responsive design works on mobile

---

Dependencies

039_Subscription_API (backend endpoints)
038_Tenant_API (tenant context)

---

Next Steps

After this prompt, implement:

045_System_Settings_UI — React frontend for system settings

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
