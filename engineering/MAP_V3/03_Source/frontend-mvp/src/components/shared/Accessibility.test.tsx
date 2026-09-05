import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { MetricCard } from './MetricCard';
import { EmptyState } from './EmptyState';
import { expectNoA11yViolations } from '../../test-setup';

describe('Shared Components Accessibility', () => {
  describe('StatusBadge', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<StatusBadge status="active" />);
      await expectNoA11yViolations(container);
    });

    it('should have no accessibility violations for error status', async () => {
      const { container } = render(<StatusBadge status="error" />);
      await expectNoA11yViolations(container);
    });
  });

  describe('ProgressBar', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ProgressBar value={50} />);
      await expectNoA11yViolations(container);
    });

    it('should have proper ARIA attributes', () => {
      render(<ProgressBar value={75} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('MetricCard', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <MetricCard title="Test Metric" value={100} />
      );
      await expectNoA11yViolations(container);
    });

    it('should display title and value', () => {
      render(<MetricCard title="Revenue" value="$10,000" />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <EmptyState title="No data" description="No items found" />
      );
      await expectNoA11yViolations(container);
    });

    it('should have proper heading', () => {
      render(<EmptyState title="No results" description="Try again" />);
      expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    });
  });
});
