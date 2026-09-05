import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExecutiveSummary } from './ExecutiveSummary';

describe('ExecutiveSummary', () => {
  it('renders summary with completion and confidence', () => {
    render(
      <ExecutiveSummary
        completionPercent={75}
        confidencePercent={85}
        totalSystems={10}
        totalBatches={50}
      />
    );
    
    expect(screen.getByText('Migration Programme Overview')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('10 systems • 50 batches')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <ExecutiveSummary
        completionPercent={0}
        confidencePercent={0}
        totalSystems={0}
        totalBatches={0}
        loading
      />
    );
    
    expect(screen.queryByText('Migration Programme Overview')).not.toBeInTheDocument();
  });
});
