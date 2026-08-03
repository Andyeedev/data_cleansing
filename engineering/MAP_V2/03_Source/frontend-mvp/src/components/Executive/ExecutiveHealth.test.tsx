import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExecutiveHealth } from './ExecutiveHealth';

describe('ExecutiveHealth', () => {
  it('renders health score with label', () => {
    render(<ExecutiveHealth score={85} />);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Migration Health')).toBeInTheDocument();
  });

  it('shows warning state for medium score', () => {
    render(<ExecutiveHealth score={65} />);
    
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('Needs Attention')).toBeInTheDocument();
  });

  it('shows risk state for low score', () => {
    render(<ExecutiveHealth score={40} />);
    
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ExecutiveHealth score={0} loading />);
    
    expect(screen.queryByText('85')).not.toBeInTheDocument();
  });
});
