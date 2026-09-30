import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { server } from './mocks';

interface RenderWithProvidersOptions extends RenderOptions {
  initialRole?: string;
  initialPermissions?: string[];
  initialEntries?: string[];
  useMockServer?: boolean;
}

const DEFAULT_MOCK_PERMISSIONS = ['read', 'write', 'delete', 'admin'];

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialRole = 'admin',
    initialPermissions = DEFAULT_MOCK_PERMISSIONS,
    initialEntries = ['/'],
    useMockServer = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  const mockUser = {
    id: '1',
    email: 'admin@test.com',
    name: 'admin',
    roles: [initialRole],
    permissions: initialPermissions,
  };
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem('map_nexus_user', JSON.stringify(mockUser));

  if (useMockServer) {
    server.listen({ onUnhandledRequest: 'bypass' });
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...result,
    cleanup: () => {
      result.unmount();
      if (useMockServer) {
        server.close();
      }
    },
  };
}
