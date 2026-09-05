import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { DynamicNavigation } from './DynamicNavigation';
import type { MetadataNavItem } from '../../types/metadata';

const MOCK_ITEMS: MetadataNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'migration', label: 'Migration', path: '/migration', children: [
    { id: 'projects', label: 'Projects', path: '/migration/projects' },
    { id: 'discovery', label: 'Discovery', path: '/migration/discovery' },
  ]},
  { id: 'validation', label: 'Validation', path: '/validation' },
];

function renderNav(items: MetadataNavItem[], path = '/') {
  return render(
    <MemoryRouter>
      <DynamicNavigation items={items} currentPath={path} />
    </MemoryRouter>,
  );
}

describe('DynamicNavigation', () => {
  it('renders all top-level items', () => {
    renderNav(MOCK_ITEMS);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Migration')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });

  it('shows children when parent is clicked', () => {
    renderNav(MOCK_ITEMS);
    fireEvent.click(screen.getByText('Migration'));
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Discovery')).toBeInTheDocument();
  });

  it('hides children when parent is clicked again', () => {
    renderNav(MOCK_ITEMS);
    fireEvent.click(screen.getByText('Migration'));
    expect(screen.getByText('Projects')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Migration'));
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  });

  it('auto-expands parent when child route is active', () => {
    renderNav(MOCK_ITEMS, '/migration/projects');
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Discovery')).toBeInTheDocument();
  });

  it('highlights the active item', () => {
    renderNav(MOCK_ITEMS, '/migration');
    const migrationLink = screen.getByText('Migration');
    expect(migrationLink.closest('a')).toHaveStyle({ color: 'var(--color-sidebar-active)' });
  });

  it('renders empty list when no items provided', () => {
    const { container } = renderNav([]);
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});
