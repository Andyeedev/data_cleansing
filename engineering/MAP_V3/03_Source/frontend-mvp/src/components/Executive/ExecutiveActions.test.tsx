import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { ExecutiveActions } from './ExecutiveActions';

describe('ExecutiveActions', () => {
  it('renders action buttons for admin', () => {
    render(
      <BrowserRouter>
        <ExecutiveActions isAdmin={true} isManager={false} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Manage Systems')).toBeInTheDocument();
    expect(screen.getByText('Start Migration')).toBeInTheDocument();
    expect(screen.getByText('View Operations')).toBeInTheDocument();
    expect(screen.getByText('Validation Rules')).toBeInTheDocument();
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('hides admin-only buttons for non-admin', () => {
    render(
      <BrowserRouter>
        <ExecutiveActions isAdmin={false} isManager={true} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Manage Systems')).not.toBeInTheDocument();
    expect(screen.getByText('Start Migration')).toBeInTheDocument();
  });
});
