MAP Nexus™ Enterprise Platform
Prompt 042
Frontend UI — Role Management

Version: 1.0

Prompt ID: 042

Workstream: 06 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

032_DB_Role_Management
037_Role_API

---

Purpose

Create the React frontend for Role Management in the MAP Nexus™ platform.

This prompt creates the TypeScript pages, hooks, components, and services required to provide a complete role-based access control (RBAC) interface in the browser.

---

Objective

Create a role management UI capable of:

Role Directory — List, search, filter roles
Role Definition — Create and edit roles
Permission Management — Assign permissions to roles
Role Hierarchy — Visual role hierarchy
Role Assignment — Assign roles to users

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
RoleManagement.tsx (Enhance existing)
hooks/
useRoles.ts
types/
role.types.ts
components/
RoleDirectory.tsx
RoleCard.tsx
RoleFilters.tsx
RoleDefinitionModal.tsx
PermissionMatrix.tsx
RoleHierarchy.tsx
RoleAssignmentModal.tsx
services/
RoleService.ts

---

TypeScript Types

```typescript
// types/role.types.ts
export type RoleType = 'system' | 'custom' | 'template' | 'virtual';
export type RoleStatus = 'active' | 'inactive' | 'deprecated' | 'draft';

export interface Role {
  id: string;
  name: string;
  description?: string;
  type: RoleType;
  parentId?: string;
  level: number;
  isSystem: boolean;
  isDefault: boolean;
  status: RoleStatus;
  tenantId: string;
  userCount: number;
  permissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  category?: string;
  isSystem: boolean;
  granted: boolean;
}

export interface RoleFilters {
  search?: string;
  status?: RoleStatus;
  type?: RoleType;
  page?: number;
  pageSize?: number;
}

export interface RoleListResponse {
  roles: Role[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  type?: RoleType;
  parentId?: string;
  isDefault?: boolean;
  permissionIds?: string[];
  tenantId: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  parentId?: string;
  isDefault?: boolean;
  status?: RoleStatus;
}

export interface RoleStats {
  totalRoles: number;
  activeRoles: number;
  systemRoles: number;
  customRoles: number;
}
```

---

API Service

```typescript
// services/RoleService.ts
import apiClient from '../../api/client';
import type { 
  Role, RoleListResponse, Permission, 
  CreateRoleInput, UpdateRoleInput, RoleFilters 
} from '../types/role.types';

export const RoleService = {
  getRoles: async (filters?: RoleFilters): Promise<RoleListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    
    const response = await apiClient.get(`/roles?${params.toString()}`);
    return response.data;
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleInput): Promise<Role> => {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: UpdateRoleInput): Promise<Role> => {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  getRolePermissions: async (roleId: string): Promise<Permission[]> => {
    const response = await apiClient.get(`/roles/${roleId}/permissions`);
    return response.data;
  },

  updateRolePermissions: async (roleId: string, permissionIds: string[]): Promise<void> => {
    await apiClient.put(`/roles/${roleId}/permissions`, { permissionIds });
  },

  assignRoleToUser: async (roleId: string, userId: string): Promise<void> => {
    await apiClient.post(`/roles/${roleId}/assign/${userId}`);
  },

  removeRoleFromUser: async (roleId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/roles/${roleId}/assign/${userId}`);
  },
};
```

---

Custom Hook

```typescript
// hooks/useRoles.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { RoleService } from '../services/RoleService';
import type { RoleFilters, CreateRoleInput, UpdateRoleInput } from '../types/role.types';

export const useRoles = (filters?: RoleFilters) => {
  const query = useQuery({
    queryKey: ['roles', filters],
    queryFn: () => RoleService.getRoles(filters),
  });

  return {
    roles: query.data?.roles || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useRole = (id: string) => {
  const query = useQuery({
    queryKey: ['role', id],
    queryFn: () => RoleService.getRole(id),
    enabled: !!id,
  });

  return {
    role: query.data,
    isLoading: query.isLoading,
  };
};

export const useRolePermissions = (roleId: string) => {
  const query = useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => RoleService.getRolePermissions(roleId),
    enabled: !!roleId,
  });

  return {
    permissions: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useCreateRole = () => {
  const mutation = useMutation({
    mutationFn: RoleService.createRole,
  });

  return {
    createRole: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useUpdateRole = () => {
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      RoleService.updateRole(id, data),
  });

  return {
    updateRole: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useDeleteRole = () => {
  const mutation = useMutation({
    mutationFn: RoleService.deleteRole,
  });

  return {
    deleteRole: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
```

---

Components

RoleDirectory.tsx

Main role listing component with search and filters.

RoleCard.tsx

Individual role card displaying name, description, user count, and permissions.

RoleDefinitionModal.tsx

Modal for creating/editing roles with permission selection.

PermissionMatrix.tsx

Visual matrix showing roles vs permissions with toggle capability.

RoleHierarchy.tsx

Tree view showing role hierarchy with drag-and-drop support.

RoleAssignmentModal.tsx

Modal for assigning roles to users.

---

Main Page

```tsx
// RoleManagement.tsx
import { useState } from 'react';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from './hooks/useRoles';
import { RoleDirectory } from './components/RoleDirectory';
import { RoleDefinitionModal } from './components/RoleDefinitionModal';
import type { Role, RoleFilters, CreateRoleInput } from './types/role.types';

export const RoleManagement = () => {
  const [filters, setFilters] = useState<RoleFilters>({ page: 1, pageSize: 20 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { roles, total, isLoading } = useRoles(filters);
  const { createRole } = useCreateRole();
  const { updateRole } = useUpdateRole();
  const { deleteRole } = useDeleteRole();

  const handleCreateRole = async (data: CreateRoleInput) => {
    await createRole(data);
    setShowCreateModal(false);
  };

  const handleUpdateRole = async (id: string, data: UpdateRoleInput) => {
    await updateRole({ id, data });
    setSelectedRole(null);
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      await deleteRole(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Role Management</h1>
          <p className="text-sm text-neutral-60 mt-1">Manage roles and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Role
        </button>
      </div>

      <RoleDirectory
        roles={roles}
        total={total}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onSelectRole={setSelectedRole}
        onDeleteRole={handleDeleteRole}
      />

      {showCreateModal && (
        <RoleDefinitionModal
          onSubmit={handleCreateRole}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedRole && (
        <RoleDefinitionModal
          role={selectedRole}
          onSubmit={(data) => handleUpdateRole(selectedRole.id, data)}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
};
```

---

Acceptance Criteria

1. Role directory displays roles with search and filters
2. Role creation form works with validation
3. Permission matrix displays correctly
4. Role hierarchy shows parent-child relationships
5. Role assignment to users works
6. System roles cannot be deleted
7. Permission toggling works
8. Loading states display properly
9. Error handling shows appropriate messages
10. Responsive design works on mobile

---

Dependencies

037_Role_API (backend endpoints)
041_User_Management_UI (user context)

---

Next Steps

After this prompt, implement:

043_Tenant_Management_UI — React frontend for tenant management

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
