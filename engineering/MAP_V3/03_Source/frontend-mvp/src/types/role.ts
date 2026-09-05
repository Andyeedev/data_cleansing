export interface Role {
  id: string;
  name: string;
  description: string | null;
  type: string;
  is_system: boolean;
  is_default: boolean;
  status: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  category: string;
  granted?: boolean;
}

export interface RoleListResponse {
  roles: Role[];
  total: number;
  page: number;
  page_size: number;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  type?: string;
  parent_id?: string;
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
}

export interface PermissionAssignRequest {
  permission_id: string;
  granted?: boolean;
}
