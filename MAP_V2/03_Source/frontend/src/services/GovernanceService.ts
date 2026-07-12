import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const GovernanceService = {
  getPolicies: async (): Promise<Policy[]> => {
    const response = await apiClient.get(API_ENDPOINTS.GOVERNANCE.POLICIES);
    return response.data;
  },

  getCompliance: async (): Promise<unknown[]> => {
    const response = await apiClient.get(API_ENDPOINTS.GOVERNANCE.COMPLIANCE);
    return response.data;
  },

  getAuditLog: async (): Promise<unknown[]> => {
    const response = await apiClient.get(API_ENDPOINTS.GOVERNANCE.AUDIT);
    return response.data;
  },
};
