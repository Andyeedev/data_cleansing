import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { ControlsPage } from './ControlsPage';

vi.mock('../hooks/useControls', () => ({
  useControls: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ userRoles: ['admin'] }),
}));

import { useControls } from '../hooks/useControls';

const mockUseControls = useControls as unknown as ReturnType<typeof vi.fn>;

const mockControls = {
  controls: [
    {
      control_id: 'C01',
      control_name: 'Data Completeness',
      description: 'Validates row count equality',
      severity_level: 'HIGH',
      enabled_flag: true,
      created_at: '2026-08-07T10:00:00Z',
      project_id: 'proj-1',
    },
    {
      control_id: 'C02',
      control_name: 'Schema Validity',
      description: 'Checks schema validity',
      severity_level: 'MEDIUM',
      enabled_flag: false,
      created_at: '2026-08-07T10:00:00Z',
      project_id: 'proj-1',
    },
  ],
  total: 2,
};

function renderPage() {
  return render(
    <BrowserRouter>
      <ControlsPage />
    </BrowserRouter>
  );
}

describe('ControlsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page for admin user', () => {
    mockUseControls.mockReturnValue({
      data: mockControls,
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.getByText('Controls Management')).toBeTruthy();
  });

  it('renders metric cards', () => {
    mockUseControls.mockReturnValue({
      data: mockControls,
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.getAllByText('Total').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Enabled').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Disabled').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Critical').length).toBeGreaterThan(0);
  });

  it('renders controls table', () => {
    mockUseControls.mockReturnValue({
      data: mockControls,
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.getByText('C01')).toBeTruthy();
    expect(screen.getByText('Data Completeness')).toBeTruthy();
    expect(screen.getByText('C02')).toBeTruthy();
    expect(screen.getByText('Schema Validity')).toBeTruthy();
  });

  it('renders empty state when no controls', () => {
    mockUseControls.mockReturnValue({
      data: { controls: [], total: 0 },
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.getByText('No controls')).toBeTruthy();
  });

  it('renders error state when API fails', () => {
    mockUseControls.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch controls',
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.getByText('Failed to fetch controls')).toBeTruthy();
  });

  it('renders loading state', () => {
    mockUseControls.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
      updateControl: vi.fn(),
      deleteControl: vi.fn(),
    });

    renderPage();
    expect(screen.queryByText('Controls Management')).toBeTruthy();
  });
});
