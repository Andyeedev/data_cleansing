import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export const AdminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST);
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, user);
    return response.data;
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), user);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ROLES);
    return response.data;
  },

  getSettings: async (): Promise<unknown> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SETTINGS);
    return response.data;
  },

  updateSettings: async (settings: unknown): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.ADMIN.SETTINGS, settings);
  },
};
