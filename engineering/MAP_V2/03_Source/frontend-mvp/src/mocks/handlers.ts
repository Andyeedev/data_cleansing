import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const API_BASE = 'http://localhost:8000';

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/api/v1/auth/login`, () => {
    return HttpResponse.json({
      access_token: 'mock-jwt-token-for-tests',
      token_type: 'bearer',
    });
  }),

  http.get(`${API_BASE}/api/v1/auth/me`, () => {
    return HttpResponse.json({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles: ['admin'],
    });
  }),

  // Navigation endpoint
  http.get(`${API_BASE}/api/v1/navigation`, () => {
    return HttpResponse.json({
      success: true,
      data: [],
    });
  }),

  // Dashboard endpoints
  http.get(`${API_BASE}/api/v1/dashboard/stats`, () => {
    return HttpResponse.json({
      total_batches: 10,
      active_batches: 3,
      completed_batches: 7,
      success_rate: 85.5,
    });
  }),

  // Batch endpoints
  http.get(`${API_BASE}/api/v1/batches`, () => {
    return HttpResponse.json({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
    });
  }),

  // Validation endpoints
  http.get(`${API_BASE}/api/v1/validation/results`, () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    });
  }),

  // Governance endpoints
  http.get(`${API_BASE}/api/v1/governance/controls`, () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    });
  }),

  // Operations endpoints
  http.get(`${API_BASE}/api/v1/operations/tasks`, () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    });
  }),

  // Reports endpoints
  http.get(`${API_BASE}/api/v1/reports/*`, () => {
    return HttpResponse.json({
      data: {},
    });
  }),

  // Catch-all for unmatched requests
  http.all('*', () => {
    return HttpResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }),
];

export const server = setupServer(...handlers);

export function setupMockServer() {
  // These are test lifecycle hooks - they need to be called in test files
  // Example usage in test files:
  // import { setupMockServer } from '../mocks';
  // setupMockServer();
  return server;
}
