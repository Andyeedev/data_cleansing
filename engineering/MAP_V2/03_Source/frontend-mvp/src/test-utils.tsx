import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

interface RenderWithProvidersOptions extends RenderOptions {
  initialRole?: string;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialRole = 'admin',
    initialEntries = ['/'],
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  const mockUser = {
    id: '1',
    email: 'admin@test.com',
    name: 'admin',
    roles: [initialRole],
    permissions: ['read', 'write', 'delete', 'admin'],
  };
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem('map_nexus_user', JSON.stringify(mockUser));

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
