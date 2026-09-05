MAP Nexus™ Enterprise Platform
Prompt 041
Frontend UI — User Management

Version: 1.0

Prompt ID: 041

Workstream: 06 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management
036_User_API

---

Purpose

Create the React frontend for User Management in the MAP Nexus™ platform.

This prompt creates the TypeScript pages, hooks, components, and services required to provide a complete user management interface in the browser.

---

Objective

Create a user management UI capable of:

User Directory — List, search, filter users
User Profiles — View and edit user details
User Provisioning — Create and invite users
User Lifecycle — Activate, deactivate, suspend users
User Analytics — Usage metrics and activity logs

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
UserManagement.tsx (Enhance existing)
hooks/
useUsers.ts
types/
user.types.ts
components/
UserDirectory.tsx
UserCard.tsx
UserFilters.tsx
UserProvisioningModal.tsx
UserDetailModal.tsx
UserActions.tsx
UserActivityLog.tsx
services/
UserService.ts

---

TypeScript Types

```typescript
// types/user.types.ts
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending' | 'locked' | 'deactivated';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  phone?: string;
  status: UserStatus;
  tenantId: string;
  organisationId?: string;
  departmentId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  roleId?: string;
  page?: number;
  pageSize?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
  roleIds?: string[];
  organisationId?: string;
  departmentId?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: UserStatus;
  organisationId?: string;
  departmentId?: string;
  roleIds?: string[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  recentLogins: number;
}
```

---

API Service

```typescript
// services/UserService.ts
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import type { 
  User, UserListResponse, CreateUserInput, 
  UpdateUserInput, UserFilters, UserStats 
} from '../types/user.types';

export const UserService = {
  getUsers: async (filters?: UserFilters): Promise<UserListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('page_size', filters.pageSize.toString());
    
    const response = await apiClient.get(
      `${API_ENDPOINTS.USERS.LIST}?${params.toString()}`
    );
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  },

  createUser: async (data: CreateUserInput): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserInput): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await apiClient.post(`${API_ENDPOINTS.USERS.GET(id)}/activate`);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await apiClient.post(`${API_ENDPOINTS.USERS.GET(id)}/deactivate`);
    return response.data;
  },

  suspendUser: async (id: string): Promise<User> => {
    const response = await apiClient.post(`${API_ENDPOINTS.USERS.GET(id)}/suspend`);
    return response.data;
  },

  resetPassword: async (id: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.USERS.GET(id)}/reset-password`);
  },
};
```

---

Custom Hook

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/UserService';
import type { UserFilters, CreateUserInput, UpdateUserInput } from '../types/user.types';

export const useUsers = (filters?: UserFilters) => {
  const query = useQuery({
    queryKey: ['users', filters],
    queryFn: () => UserService.getUsers(filters),
  });

  return {
    users: query.data?.users || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useUser = (id: string) => {
  const query = useQuery({
    queryKey: ['user', id],
    queryFn: () => UserService.getUser(id),
    enabled: !!id,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateUser = () => {
  const mutation = useMutation({
    mutationFn: UserService.createUser,
  });

  return {
    createUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export const useUpdateUser = () => {
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      UserService.updateUser(id, data),
  });

  return {
    updateUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export const useDeleteUser = () => {
  const mutation = useMutation({
    mutationFn: UserService.deleteUser,
  });

  return {
    deleteUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export const useActivateUser = () => {
  const mutation = useMutation({
    mutationFn: UserService.activateUser,
  });

  return {
    activateUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useDeactivateUser = () => {
  const mutation = useMutation({
    mutationFn: UserService.deactivateUser,
  });

  return {
    deactivateUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
```

---

Components

UserDirectory.tsx

Main user listing component with search, filters, and bulk actions.

Features:
- Search bar with debounced input
- Status filter dropdown
- Role filter dropdown
- User table with pagination
- Bulk select checkbox
- Export button

UserCard.tsx

Individual user card for grid view.

Features:
- User avatar
- Name and email
- Status badge
- Role tags
- Last login time
- Quick actions menu

UserFilters.tsx

Advanced filter panel.

Features:
- Status multi-select
- Role multi-select
- Date range picker
- Organisation filter
- Department filter

UserProvisioningModal.tsx

Modal for creating/inviting users.

Features:
- Email input
- Name fields
- Role selection
- Organisation/department selection
- Invitation message
- Password setup (optional)

UserDetailModal.tsx

Modal for viewing/editing user details.

Features:
- User profile display
- Edit form
- Role assignment
- Activity timeline
- Session history

UserActions.tsx

Dropdown menu for user actions.

Features:
- Edit
- Activate/Deactivate
- Suspend
- Reset password
- Delete

UserActivityLog.tsx

User activity timeline.

Features:
- Activity list
- Action icons
- Timestamps
- Resource details

---

Main Page

```tsx
// UserManagement.tsx
import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from './hooks/useUsers';
import { UserDirectory } from './components/UserDirectory';
import { UserProvisioningModal } from './components/UserProvisioningModal';
import { UserDetailModal } from './components/UserDetailModal';
import type { User, UserFilters, CreateUserInput } from './types/user.types';

export const UserManagement = () => {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, pageSize: 20 });
  const [showProvisioningModal, setShowProvisioningModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users, total, isLoading } = useUsers(filters);
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();

  const handleCreateUser = async (data: CreateUserInput) => {
    await createUser(data);
    setShowProvisioningModal(false);
  };

  const handleUpdateUser = async (id: string, data: UpdateUserInput) => {
    await updateUser({ id, data });
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">User Management</h1>
          <p className="text-sm text-neutral-60 mt-1">Manage platform users and accounts</p>
        </div>
        <button
          onClick={() => setShowProvisioningModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      <UserDirectory
        users={users}
        total={total}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onSelectUser={setSelectedUser}
        onDeleteUser={handleDeleteUser}
      />

      {showProvisioningModal && (
        <UserProvisioningModal
          onSubmit={handleCreateUser}
          onClose={() => setShowProvisioningModal(false)}
        />
      )}

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onSubmit={(data) => handleUpdateUser(selectedUser.id, data)}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};
```

---

Widget Configuration

```tsx
const widgets = [
  { id: 'usr-1', type: 'status', title: 'User Directory', size: 'lg' as const },
  { id: 'usr-2', type: 'status', title: 'Active Users', size: 'lg' as const },
  { id: 'usr-3', type: 'status', title: 'User Activity', size: 'lg' as const },
  { id: 'usr-4', type: 'status', title: 'User Lifecycle', size: 'lg' as const },
  { id: 'usr-5', type: 'status', title: 'Account Status', size: 'lg' as const },
];
```

---

Acceptance Criteria

1. User directory displays users with search and filters
2. User creation form works with validation
3. User detail modal shows complete profile
4. User actions (activate, deactivate, suspend) work
5. User deletion with confirmation works
6. Pagination works correctly
7. Loading states display properly
8. Error handling shows appropriate messages
9. Responsive design works on mobile
10. API integration with backend works

---

Dependencies

036_User_API (backend endpoints)
Widget Framework (Prompt 007)
Theme System (Prompt 002)

---

Next Steps

After this prompt, implement:

042_Role_Management_UI — React frontend for role management

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
