export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  phone: string | null;
  status: string;
  department: string | null;
  last_login_at: string | null;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  type: string;
  assigned_at: string;
  expires_at: string | null;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  phone?: string;
  department?: string;
  tenant_id?: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  department?: string;
  status?: string;
}
