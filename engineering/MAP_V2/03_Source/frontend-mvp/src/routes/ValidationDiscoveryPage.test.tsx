import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { ValidationDiscoveryPage } from './ValidationDiscoveryPage';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock hooks
vi.mock('../hooks/useRuleDiscovery', () => ({
  useRuleDiscovery: vi.fn(),
}));

vi.mock('../hooks/useMigration', () => ({
  useMigrationProjects: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ userRoles: ['admin'] }),
}));

import { useRuleDiscovery } from '../hooks/useRuleDiscovery';
import { useMigrationProjects } from '../hooks/useMigration';

const mockUseRuleDiscovery = useRuleDiscovery as unknown as ReturnType<typeof vi.fn>;
const mockUseMigrationProjects = useMigrationProjects as unknown as ReturnType<typeof vi.fn>;

const mockRules = {
  project_id: 'test-project-1',
  rules: [
    {
      rule_id: 'C01_ROWCOUNT',
      rule_name: 'Row Count Match',
      control_id: 'C01',
      enabled_flag: true,
      dataset_name: 'schema.table1',
      mapping_id: 'mapp-1',
      severity_level: 'HIGH',
      sql_template_file: 'C01_row_count.sql',
    },
    {
      rule_id: 'C04_COLUMN_COUNT',
      rule_name: 'Column Count Match',
      control_id: 'C04',
      enabled_flag: true,
      dataset_name: 'schema.table2',
      mapping_id: 'mapp-2',
      severity_level: 'MEDIUM',
      sql_template_file: 'C04_column_count.sql',
    },
  ],
  count: 2,
};

const mockMappings = {
  project_id: 'test-project-1',
  mappings: [
    {
      mapping_id: 'mapp-1',
      dataset_name: 'schema.table1',
      rule_id: 'C01_ROWCOUNT',
      rule_name: 'Row Count Match',
      sql_template: 'C01_row_count.sql',
    },
    {
      mapping_id: 'mapp-2',
      dataset_name: 'schema.table2',
      rule_id: 'C04_COLUMN_COUNT',
      rule_name: 'Column Count Match',
      sql_template: 'C04_column_count.sql',
    },
  ],
};

const mockStatus = {
  project_id: 'test-project-1',
  total_mappings: 5,
  rules_discovered: 2,
  last_discovery_at: '2026-08-07T10:30:00Z',
};

const mockProjects = [
  { project_id: 'proj-1', project_name: 'Project Alpha' },
  { project_id: 'proj-2', project_name: 'Project Beta' },
];

function renderPage() {
  return render(
    <BrowserRouter>
      <ValidationDiscoveryPage />
    </BrowserRouter>
  );
}

describe('ValidationDiscoveryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMigrationProjects.mockReturnValue({ projects: mockProjects, loading: false });
  });

  describe('Admin access', () => {
    it('renders page for admin user', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: null,
        mappings: null,
        status: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [],
      });

      renderPage();
      expect(screen.getByText('Rule Discovery')).toBeTruthy();
    });

    it('renders project selector dropdown', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: null,
        mappings: null,
        status: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [],
      });

      renderPage();
      expect(screen.getByText('Select a project...')).toBeTruthy();
    });

    it('renders trigger discovery button', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: null,
        mappings: null,
        status: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [],
      });

      renderPage();
      expect(screen.getByText('Trigger Discovery')).toBeTruthy();
    });
  });

  describe('Data display', () => {
    it('renders metric cards when data is loaded', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: mockRules,
        mappings: mockMappings,
        status: mockStatus,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [
          {
            id: 'C01',
            name: 'Control C01',
            type: 'control',
            status: 'active',
            children: [
              { id: 'rule-1', name: 'Row Count Match (schema.table1)', type: 'rule', status: 'active', rule: mockRules.rules[0] },
            ],
          },
        ],
        datasetTreeData: [
          {
            id: 'schema.table1',
            name: 'schema.table1',
            type: 'dataset',
            status: 'active',
            children: [
              { id: 'mapp-1', name: 'Row Count Match', type: 'rule', status: 'active', mapping: mockMappings.mappings[0] },
            ],
          },
        ],
      });

      renderPage();
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[0], { target: { value: 'proj-1' } });
      expect(screen.getByText('Total Mappings')).toBeTruthy();
      expect(screen.getByText('Rules Discovered')).toBeTruthy();
    });

    it('renders empty state when no project selected', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: null,
        mappings: null,
        status: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [],
      });

      renderPage();
      expect(screen.getByText('No Project Selected')).toBeTruthy();
    });

    it('renders error state when API fails', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: null,
        mappings: null,
        status: null,
        loading: false,
        error: 'Failed to fetch discovered rules',
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [],
      });

      renderPage();
      expect(screen.getByText('Failed to fetch discovered rules')).toBeTruthy();
    });
  });

  describe('Tree interaction', () => {
    it('renders control tree with data', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: mockRules,
        mappings: mockMappings,
        status: mockStatus,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [
          {
            id: 'C01',
            name: 'Control C01',
            type: 'control',
            status: 'active',
            children: [
              { id: 'C01_ROWCOUNT-mapp-1', name: 'Row Count Match (schema.table1)', type: 'rule', status: 'active', rule: mockRules.rules[0] },
            ],
          },
        ],
        datasetTreeData: [],
      });

      renderPage();
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[0], { target: { value: 'proj-1' } });
      expect(screen.getByText(/Controls/)).toBeTruthy();
      expect(screen.getAllByText(/Row Count Match/).length).toBeGreaterThan(0);
    });

    it('renders dataset tree with data', () => {
      mockUseRuleDiscovery.mockReturnValue({
        rules: mockRules,
        mappings: mockMappings,
        status: mockStatus,
        loading: false,
        error: null,
        refetch: vi.fn(),
        triggerDiscovery: vi.fn(),
        controlTreeData: [],
        datasetTreeData: [
          {
            id: 'schema.table1',
            name: 'schema.table1',
            type: 'dataset',
            status: 'active',
            children: [
              { id: 'mapp-1', name: 'Row Count Match', type: 'rule', status: 'active', mapping: mockMappings.mappings[0] },
            ],
          },
        ],
      });

      renderPage();
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[0], { target: { value: 'proj-1' } });
      expect(screen.getByText(/Datasets/)).toBeTruthy();
      expect(screen.getAllByText('schema.table1').length).toBeGreaterThan(0);
    });
  });
});
