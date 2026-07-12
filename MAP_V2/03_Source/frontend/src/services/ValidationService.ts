import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: string;
  enabled: boolean;
}

export interface ValidationResult {
  id: string;
  ruleId: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  timestamp: string;
}

export const ValidationService = {
  getRules: async (): Promise<ValidationRule[]> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION.RULES);
    return response.data;
  },

  getRule: async (id: string): Promise<ValidationRule> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION.RULE(id));
    return response.data;
  },

  createRule: async (rule: Partial<ValidationRule>): Promise<ValidationRule> => {
    const response = await apiClient.post(API_ENDPOINTS.VALIDATION.RULES, rule);
    return response.data;
  },

  updateRule: async (id: string, rule: Partial<ValidationRule>): Promise<ValidationRule> => {
    const response = await apiClient.put(API_ENDPOINTS.VALIDATION.RULE(id), rule);
    return response.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VALIDATION.RULE(id));
  },

  getResults: async (): Promise<ValidationResult[]> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION.RESULTS);
    return response.data;
  },

  getQueue: async (): Promise<unknown[]> => {
    const response = await apiClient.get(API_ENDPOINTS.VALIDATION.QUEUE);
    return response.data;
  },
};
