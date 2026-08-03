import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExecutiveKPI } from './ExecutiveKPI';

describe('ExecutiveKPI', () => {
  it('renders KPI cards with values', () => {
    render(
      <ExecutiveKPI
        kpis={[
          { label: 'Systems', value: 10, icon: '🖥️' },
          { label: 'Batches', value: 50, trend: { value: 5, isPositive: true } },
        ]}
      />
    );
    
    expect(screen.getByText('Systems')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Batches')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ExecutiveKPI kpis={[]} loading />);
    
    expect(screen.queryByText('Systems')).not.toBeInTheDocument();
  });
});
