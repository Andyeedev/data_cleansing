import axios from 'axios';
import { environment } from '../config/environment';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: `${environment.apiBaseUrl}/api/${environment.apiVersion}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
