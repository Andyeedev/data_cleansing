import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface RiskItem {
  id: string;
  name: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'mitigated' | 'closed';
}

export const RiskService = {
  getAssessment: async (): Promise<RiskItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RISK.ASSESSMENT);
    return response.data;
  },

  getRegister: async (): Promise<RiskItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RISK.REGISTER);
    return response.data;
  },

  getMatrix: async (): Promise<unknown> => {
    const response = await apiClient.get(API_ENDPOINTS.RISK.MATRIX);
    return response.data;
  },
};
