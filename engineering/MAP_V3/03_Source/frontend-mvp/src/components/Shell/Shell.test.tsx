import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Shell } from './Shell';
import { renderWithProviders } from '../../test-utils';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

describe('Shell', () => {
  it('renders the MAP Nexus branding', () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />);
    expect(screen.getByText('MAP Nexus')).toBeInTheDocument();
  });

  it('renders the sidebar', () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders the header', () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the content area', () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders default navigation items when API is unavailable', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />);
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    expect(screen.getByText('Migration')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });

  it('fetches and renders navigation from API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 'api-home', label: 'API Home', path: '/', icon: 'Home' },
          { id: 'api-migration', label: 'API Migration', path: '/migration', icon: 'Database' },
        ],
      }),
    });
    renderWithProviders(<Shell />);
    await waitFor(() => {
      expect(screen.getByText('API Home')).toBeInTheDocument();
    });
    expect(screen.getByText('API Migration')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('renders custom nav items when provided, skipping API fetch', async () => {
    renderWithProviders(
      <Shell navItems={[{ id: 'custom', label: 'Custom Page', path: '/custom' }]} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Custom Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('filters navigation by user roles', async () => {
    renderWithProviders(
      <Shell
        navItems={[
          { id: 'home', label: 'Home', path: '/' },
          { id: 'admin-only', label: 'Admin Page', path: '/admin', requiredRoles: ['admin'] },
        ]}
        userRoles={[]}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    expect(screen.queryByRole('link', { name: 'Admin Page' })).not.toBeInTheDocument();
  });

  it('renders breadcrumb when navigating to a child route', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />, { initialEntries: ['/migration/projects'] });
    await waitFor(() => {
      const breadcrumbNav = screen.getAllByLabelText('Breadcrumb');
      expect(breadcrumbNav.length).toBeGreaterThan(0);
    });
  });

  it('does not render breadcrumb crumbs on home route', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    renderWithProviders(<Shell />, { initialEntries: ['/'] });
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    const breadcrumbNavs = screen.getAllByLabelText('Breadcrumb');
    breadcrumbNavs.forEach(nav => {
      expect(nav).toBeEmptyDOMElement();
    });
  });
});
