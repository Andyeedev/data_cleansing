import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportsPage } from './ReportsPage';
import { renderWithProviders } from '../test-utils';

describe('ReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<ReportsPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderWithProviders(<ReportsPage />);
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('displays report type cards', () => {
    renderWithProviders(<ReportsPage />);
    expect(screen.getByText('Validation Report')).toBeInTheDocument();
    expect(screen.getByText('Governance Decision')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Audit Report')).toBeInTheDocument();
  });

  it('shows API requirement note for each report', () => {
    const { container } = renderWithProviders(<ReportsPage />);
    expect(container.textContent).toMatch(/Requires:.*\/execution\//);
  });
});