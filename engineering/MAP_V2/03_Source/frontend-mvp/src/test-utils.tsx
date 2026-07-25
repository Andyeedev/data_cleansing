import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import type { MockRole } from './types/auth';

interface RenderWithProvidersOptions extends RenderOptions {
  initialRole?: MockRole;
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
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider initialRole={initialRole}>{children}</AuthProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
