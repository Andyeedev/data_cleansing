import '@testing-library/jest-dom/vitest';

// Pre-populate localStorage with mock auth so ProtectedRoute passes in tests
const mockUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'admin',
  roles: ['admin'],
  permissions: ['read', 'write', 'delete', 'admin'],
};

localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
localStorage.setItem('map_nexus_user', JSON.stringify(mockUser));
