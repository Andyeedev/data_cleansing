import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ValidationResultsPage } from './ValidationResultsPage';
import type { MockRole } from '../types/auth';

const mockBatchStatus = {
  batch_id: 'batch-123',
  status: 'RUNNING',
  total_controls: 10,
  completed_controls: 6,
  failed_controls: 1,
  progress: '6/10',
};

function renderValidationResultsPage({
  initialRole = 'admin' as MockRole,
  batchId = 'batch-123',
}: { initialRole?: MockRole; batchId?: string } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[`/validation/results/${batchId}`]}>
        <AuthProvider initialRole={initialRole}>
          <Routes>
            <Route path="/validation/results/:batchId" element={children} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  }

  return render(<ValidationResultsPage />, { wrapper: Wrapper });
}

describe('ValidationResultsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderValidationResultsPage({ initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
    renderValidationResultsPage();
    expect(screen.getByText('Validation Results')).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
    renderValidationResultsPage();
    const spinner = document.querySelector('[style*="animation: spin"]');
    expect(spinner).toBeInTheDocument();
  });

  it('renders batch status after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockBatchStatus,
    });
    renderValidationResultsPage();
    await waitFor(() => {
      expect(screen.getByText('RUNNING')).toBeInTheDocument();
      expect(screen.getByText('Total Controls')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    renderValidationResultsPage();
    await waitFor(() => {
      expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
    });
  });

  it('displays progress bar', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockBatchStatus,
    });
    renderValidationResultsPage();
    await waitFor(() => {
      const progressElements = screen.getAllByText('Progress');
      expect(progressElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});