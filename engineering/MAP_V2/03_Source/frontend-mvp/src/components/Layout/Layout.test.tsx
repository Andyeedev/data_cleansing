import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Layout } from './Layout';
import { renderWithProviders } from '../../test-utils';

function renderLayout() {
  return renderWithProviders(
    <Layout sidebar={<nav>Sidebar Content</nav>}>
      <div>Main Content</div>
    </Layout>,
  );
}

describe('Layout', () => {
  it('renders the sidebar', () => {
    renderLayout();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('renders the header', () => {
    renderLayout();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders children in the content area', () => {
    renderLayout();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    renderLayout();
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
  });
});
