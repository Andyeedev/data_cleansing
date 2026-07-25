import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionHistoryPage } from './ExecutionHistoryPage';
import { renderWithProviders } from '../test-utils';

describe('ExecutionHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<ExecutionHistoryPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderWithProviders(<ExecutionHistoryPage />);
    expect(screen.getByText('Execution History')).toBeInTheDocument();
  });

  it('displays empty state message', () => {
    renderWithProviders(<ExecutionHistoryPage />);
    expect(screen.getByText(/No Execution History Available/)).toBeInTheDocument();
  });

  it('displays missing API note', () => {
    const { container } = renderWithProviders(<ExecutionHistoryPage />);
    expect(container.textContent).toMatch(/execution\/history.*endpoint is not yet implemented/i);
  });
});