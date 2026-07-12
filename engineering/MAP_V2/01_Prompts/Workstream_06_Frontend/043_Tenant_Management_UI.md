MAP Nexus™ Enterprise Platform
Prompt 043
Frontend UI — Tenant Management

Version: 1.0

Prompt ID: 043

Workstream: 06 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

033_DB_Tenant_Management
038_Tenant_API

---

Purpose

Create the React frontend for Tenant Management in the MAP Nexus™ platform.

This prompt creates the TypeScript pages, hooks, components, and services required to provide a complete multi-tenant management interface in the browser.

---

Objective

Create a tenant management UI capable of:

Tenant Directory — List, search, filter tenants
Tenant Provisioning — Create new tenants
Tenant Configuration — Settings and branding
Tenant Monitoring — Health and usage metrics
Tenant Lifecycle — Activate, suspend, archive tenants

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
TenantManagement.tsx (Enhance existing)
hooks/
useTenants.ts
types/
tenant.types.ts
components/
TenantDirectory.tsx
TenantCard.tsx
TenantFilters.tsx
TenantProvisioningModal.tsx
TenantDetailModal.tsx
TenantConfiguration.tsx
TenantHealth.tsx
TenantUsage.tsx
services/
TenantService.ts

---

TypeScript Types

```typescript
// types/tenant.types.ts
export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'provisioning' | 'deprovisioning' | 'archived';
export type TenantTier = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: TenantStatus;
  tier: TenantTier;
  contactEmail?: string;
  contactName?: string;
  website?: string;
  parentId?: string;
  maxUsers: number;
  maxStorageGb: number;
  maxApiCalls: number;
  maxProjects: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Organisation {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface Department {
  id: string;
  organisationId: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface TenantFilters {
  search?: string;
  status?: TenantStatus;
  tier?: TenantTier;
  page?: number;
  pageSize?: number;
}

export interface TenantListResponse {
  tenants: Tenant[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  description?: string;
  tier?: TenantTier;
  contactEmail?: string;
  contactName?: string;
  maxUsers?: number;
  maxStorageGb?: number;
}

export interface UpdateTenantInput {
  name?: string;
  description?: string;
  status?: TenantStatus;
  tier?: TenantTier;
  contactEmail?: string;
  contactName?: string;
  maxUsers?: number;
  maxStorageGb?: number;
}

export interface TenantHealth {
  status: string;
  lastCheck?: string;
  uptime: number;
  responseTime: number;
  errorRate: number;
}

export interface TenantUsage {
  currentUsers: number;
  currentStorageGb: number;
  currentApiCalls: number;
  currentProjects: number;
  usageTrend: string;
}
```

---

API Service

```typescript
// services/TenantService.ts
import apiClient from '../../api/client';
import type { 
  Tenant, TenantListResponse, Organisation, Department,
  CreateTenantInput, UpdateTenantInput, TenantFilters 
} from '../types/tenant.types';

export const TenantService = {
  getTenants: async (filters?: TenantFilters): Promise<TenantListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.page) params.append('page', filters.page.toString());
    
    const response = await apiClient.get(`/tenants?${params.toString()}`);
    return response.data;
  },

  getTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenants/${id}`);
    return response.data;
  },

  createTenant: async (data: CreateTenantInput): Promise<Tenant> => {
    const response = await apiClient.post('/tenants', data);
    return response.data;
  },

  updateTenant: async (id: string, data: UpdateTenantInput): Promise<Tenant> => {
    const response = await apiClient.put(`/tenants/${id}`, data);
    return response.data;
  },

  deleteTenant: async (id: string): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
  },

  activateTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.post(`/tenants/${id}/activate`);
    return response.data;
  },

  suspendTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.post(`/tenants/${id}/suspend`);
    return response.data;
  },

  getOrganisations: async (tenantId: string): Promise<Organisation[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/organisations`);
    return response.data;
  },

  createOrganisation: async (tenantId: string, name: string): Promise<Organisation> => {
    const response = await apiClient.post(`/tenants/${tenantId}/organisations`, { name });
    return response.data;
  },

  getDepartments: async (organisationId: string): Promise<Department[]> => {
    const response = await apiClient.get(`/organisations/${organisationId}/departments`);
    return response.data;
  },
};
```

---

Custom Hook

```typescript
// hooks/useTenants.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { TenantService } from '../services/TenantService';
import type { TenantFilters, CreateTenantInput, UpdateTenantInput } from '../types/tenant.types';

export const useTenants = (filters?: TenantFilters) => {
  const query = useQuery({
    queryKey: ['tenants', filters],
    queryFn: () => TenantService.getTenants(filters),
  });

  return {
    tenants: query.data?.tenants || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useTenant = (id: string) => {
  const query = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => TenantService.getTenant(id),
    enabled: !!id,
  });

  return {
    tenant: query.data,
    isLoading: query.isLoading,
  };
};

export const useCreateTenant = () => {
  const mutation = useMutation({
    mutationFn: TenantService.createTenant,
  });

  return {
    createTenant: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useUpdateTenant = () => {
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantInput }) =>
      TenantService.updateTenant(id, data),
  });

  return {
    updateTenant: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useDeleteTenant = () => {
  const mutation = useMutation({
    mutationFn: TenantService.deleteTenant,
  });

  return {
    deleteTenant: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
```

---

Components

TenantDirectory.tsx

Main tenant listing with search, filters, and grid/list toggle.

TenantCard.tsx

Individual tenant card showing name, tier, status, user count.

TenantProvisioningModal.tsx

Multi-step wizard for creating new tenants.

TenantDetailModal.tsx

Full tenant detail view with tabs for configuration, health, usage.

TenantConfiguration.tsx

Tenant settings and branding configuration.

TenantHealth.tsx

Health status dashboard with uptime and metrics.

TenantUsage.tsx

Usage metrics and capacity planning.

---

Main Page

```tsx
// TenantManagement.tsx
import { useState } from 'react';
import { useTenants, useCreateTenant, useUpdateTenant, useDeleteTenant } from './hooks/useTenants';
import { TenantDirectory } from './components/TenantDirectory';
import { TenantProvisioningModal } from './components/TenantProvisioningModal';
import { TenantDetailModal } from './components/TenantDetailModal';
import type { Tenant, TenantFilters, CreateTenantInput } from './types/tenant.types';

export const TenantManagement = () => {
  const [filters, setFilters] = useState<TenantFilters>({ page: 1, pageSize: 20 });
  const [showProvisioningModal, setShowProvisioningModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { tenants, total, isLoading } = useTenants(filters);
  const { createTenant } = useCreateTenant();
  const { updateTenant } = useUpdateTenant();
  const { deleteTenant } = useDeleteTenant();

  const handleCreateTenant = async (data: CreateTenantInput) => {
    await createTenant(data);
    setShowProvisioningModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Tenant Management</h1>
          <p className="text-sm text-neutral-60 mt-1">Manage multi-tenant accounts</p>
        </div>
        <button
          onClick={() => setShowProvisioningModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Tenant
        </button>
      </div>

      <TenantDirectory
        tenants={tenants}
        total={total}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onSelectTenant={setSelectedTenant}
      />

      {showProvisioningModal && (
        <TenantProvisioningModal
          onSubmit={handleCreateTenant}
          onClose={() => setShowProvisioningModal(false)}
        />
      )}

      {selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}
    </div>
  );
};
```

---

Acceptance Criteria

1. Tenant directory displays tenants with search and filters
2. Tenant provisioning wizard works
3. Tenant detail modal shows complete information
4. Tenant configuration updates work
5. Tenant health dashboard displays metrics
6. Tenant usage tracking works
7. Organisation hierarchy supported
8. Loading states display properly
9. Error handling shows appropriate messages
10. Responsive design works on mobile

---

Dependencies

038_Tenant_API (backend endpoints)
041_User_Management_UI (user context)

---

Next Steps

After this prompt, implement:

044_Subscription_UI — React frontend for subscription management

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
