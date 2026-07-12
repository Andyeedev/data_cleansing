import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface MigrationJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export const MigrationService = {
  getJobs: async (): Promise<MigrationJob[]> => {
    const response = await apiClient.get(API_ENDPOINTS.MIGRATION.JOBS);
    return response.data;
  },

  getJob: async (id: string): Promise<MigrationJob> => {
    const response = await apiClient.get(API_ENDPOINTS.MIGRATION.JOB(id));
    return response.data;
  },

  startJob: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.MIGRATION.START(id));
  },

  stopJob: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.MIGRATION.STOP(id));
  },

  getJobStatus: async (id: string): Promise<MigrationJob> => {
    const response = await apiClient.get(API_ENDPOINTS.MIGRATION.STATUS(id));
    return response.data;
  },
};
