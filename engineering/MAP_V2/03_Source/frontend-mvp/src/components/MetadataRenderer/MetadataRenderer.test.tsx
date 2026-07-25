import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetadataRenderer, ColumnDetailTable } from './MetadataRenderer';
import type { SchemaObject, ColumnDetail } from '../../types/metadata';

const MOCK_DATA: SchemaObject[] = [
  {
    id: 's1',
    name: 'public',
    type: 'schema',
    children: [
      {
        id: 't1',
        name: 'customers',
        type: 'table',
        parentId: 's1',
        children: [
          { id: 'c1', name: 'id', type: 'column', parentId: 't1' },
        ],
      },
    ],
  },
];

const MOCK_COLUMNS: ColumnDetail[] = [
  { id: 'c1', name: 'id', dataType: 'integer', nullable: false, isPrimaryKey: true, isForeignKey: false },
  { id: 'c2', name: 'email', dataType: 'varchar', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

describe('MetadataRenderer', () => {
  it('renders metadata items', () => {
    render(<MetadataRenderer data={MOCK_DATA} />);
    expect(screen.getByText('public')).toBeInTheDocument();
    expect(screen.getByText('customers')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(<MetadataRenderer data={[]} />);
    expect(screen.getByText('No metadata available.')).toBeInTheDocument();
  });

  it('calls onSelect when item clicked', () => {
    const onSelect = vi.fn();
    render(<MetadataRenderer data={MOCK_DATA} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('public'));
    expect(onSelect).toHaveBeenCalledWith(MOCK_DATA[0]);
  });

  it('renders nested items recursively', () => {
    render(<MetadataRenderer data={MOCK_DATA} />);
    expect(screen.getByText('schema')).toBeInTheDocument();
    expect(screen.getByText('table')).toBeInTheDocument();
  });
});

describe('ColumnDetailTable', () => {
  it('renders column rows', () => {
    render(<ColumnDetailTable columns={MOCK_COLUMNS} />);
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  it('shows data types', () => {
    render(<ColumnDetailTable columns={MOCK_COLUMNS} />);
    expect(screen.getByText('integer')).toBeInTheDocument();
    expect(screen.getByText('varchar')).toBeInTheDocument();
  });

  it('shows PK indicator', () => {
    render(<ColumnDetailTable columns={MOCK_COLUMNS} />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('✓');
  });

  it('shows empty message when no columns', () => {
    render(<ColumnDetailTable columns={[]} />);
    expect(screen.getByText('No columns.')).toBeInTheDocument();
  });
});
