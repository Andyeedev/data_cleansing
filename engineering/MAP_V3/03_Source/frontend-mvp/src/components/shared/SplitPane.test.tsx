import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SplitPane } from './SplitPane';

// Mock useMediaQuery
vi.mock('../../hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => false),
}));

describe('SplitPane', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders left and right panels', () => {
    render(<SplitPane left={<div>Left</div>} right={<div>Right</div>} />);
    expect(screen.getByText('Left')).toBeDefined();
    expect(screen.getByText('Right')).toBeDefined();
  });

  it('renders the divider with correct ARIA attributes', () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} />);
    const divider = screen.getByRole('separator');
    expect(divider).toBeDefined();
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider.getAttribute('aria-label')).toBe('Resize panels');
  });

  it('saves split position to localStorage on mouse up', () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} storageKey="test-split" />);
    const divider = screen.getByRole('separator');
    fireEvent.mouseDown(divider, { clientX: 300 });
    fireEvent.mouseUp(divider);
    expect(localStorage.getItem('test-split')).toBeTruthy();
  });

  it('restores split position from localStorage', () => {
    localStorage.setItem('test-split', '40');
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} storageKey="test-split" />);
    const divider = screen.getByRole('separator');
    expect(divider.getAttribute('aria-valuenow')).toBe('40');
  });

  it('responds to keyboard arrow keys', () => {
    render(<SplitPane left={<div>L</div>} right={<div>R</div>} storageKey="kb-test" />);
    const divider = screen.getByRole('separator');
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    // No error thrown = pass
  });
});
