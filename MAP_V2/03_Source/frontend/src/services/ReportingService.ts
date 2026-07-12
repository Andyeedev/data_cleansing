import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Report {
  id: string;
  name: string;
  type: 'standard' | 'custom';
  format: 'pdf' | 'html' | 'csv';
  createdAt: string;
}

export const ReportingService = {
  getStandardReports: async (): Promise<Report[]> => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.STANDARD);
    return response.data;
  },

  getCustomReports: async (): Promise<Report[]> => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.CUSTOM);
    return response.data;
  },

  getScheduledReports: async (): Promise<Report[]> => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.SCHEDULED);
    return response.data;
  },

  generateReport: async (config: unknown): Promise<Blob> => {
    const response = await apiClient.post(API_ENDPOINTS.REPORTS.GENERATE, config, {
      responseType: 'blob',
    });
    return response.data;
  },
};
