import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SystemDetailPage } from './SystemDetailPage';

const mockSystem = {
  system_id: '1',
  system_name: 'Source DB',
  system_role: 'SOURCE',
  database_type: 'POSTGRES',
  credential_id: 'cred-1',
  connection_config: {
    host: 'localhost',
    port: 5432,
    database: 'testdb',
  },
};

function renderSystemDetailPage({
  initialRole = 'admin',
  initialEntries = ['/migration/connections/1'],
}: { initialRole?: string; initialEntries?: string[] } = {}) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem('map_nexus_user', JSON.stringify({
    id: '1', email: 'admin@test.com', name: 'admin',
    roles: [initialRole], permissions: ['read', 'write', 'delete', 'admin'],
  }));

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <Routes>
            <Route path="/migration/connections/:id" element={children} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  }

  return render(<SystemDetailPage />, { wrapper: Wrapper });
}

describe('SystemDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderSystemDetailPage({ initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderSystemDetailPage();
    const spinner = document.querySelector('[style*="animation: spin"]');
    expect(spinner).toBeInTheDocument();
  });

  it('renders system details after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystem,
      }),
    });

    renderSystemDetailPage();

    await waitFor(() => {
      expect(screen.getAllByText('Source DB').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('SOURCE').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('POSTGRES')).toBeInTheDocument();
      expect(screen.getByText('localhost')).toBeInTheDocument();
      expect(screen.getByText('5432')).toBeInTheDocument();
      expect(screen.getByText('testdb')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    renderSystemDetailPage();

    await waitFor(() => {
      expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
    });
  });

  it('displays connection config section', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystem,
      }),
    });

    renderSystemDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Connection Configuration')).toBeInTheDocument();
      expect(screen.getByText('Host')).toBeInTheDocument();
      expect(screen.getByText('Port')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
    });
  });

  it('displays test connection button', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystem,
      }),
    });

    renderSystemDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Test Connection')).toBeInTheDocument();
    });
  });
});
