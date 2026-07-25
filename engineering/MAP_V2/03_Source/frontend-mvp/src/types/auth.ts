export type MockRole = 'admin' | 'manager' | 'operator' | 'viewer';

export interface MockUser {
  id: string;
  displayName: string;
  roles: MockRole[];
}

export const MOCK_USERS: Record<MockRole, MockUser> = {
  admin: {
    id: 'user-001',
    displayName: 'Admin User',
    roles: ['admin'],
  },
  manager: {
    id: 'user-002',
    displayName: 'Manager User',
    roles: ['manager'],
  },
  operator: {
    id: 'user-003',
    displayName: 'Operator User',
    roles: ['operator'],
  },
  viewer: {
    id: 'user-004',
    displayName: 'Viewer User',
    roles: ['viewer'],
  },
};
