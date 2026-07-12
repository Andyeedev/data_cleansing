import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
}

export const AIService = {
  chat: async (message: string): Promise<AIMessage> => {
    const response = await apiClient.post(API_ENDPOINTS.AI.CHAT, { message });
    return response.data;
  },

  getInsights: async (): Promise<AIInsight[]> => {
    const response = await apiClient.get(API_ENDPOINTS.AI.INSIGHTS);
    return response.data;
  },

  getPrompts: async (): Promise<unknown[]> => {
    const response = await apiClient.get(API_ENDPOINTS.AI.PROMPTS);
    return response.data;
  },
};
