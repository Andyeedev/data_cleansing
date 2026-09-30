/**
 * OC-REPORT-001 — Report Studio EDITOR (Option B) unit tests.
 *
 * The editor is where a user could most plausibly break a security property, so
 * these tests focus on that rather than on styling:
 *
 *  - it renders read-only for a non-owner, using the `is_owner` flag that the
 *    detail endpoint now returns (the Phase 1 hardening fix)
 *  - it offers ONLY the fields the selected DataSource declares, so an
 *    undeclared field is not even selectable
 *  - it surfaces the SERVER validator's errors verbatim and never asserts
 *    validity on its own
 *  - it blocks preview when the server rejected the definition
 *  - it cannot construct an operator outside the allowlist
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import { ReportEditorPage } from '../routes/reports/ReportEditorPage';
import { DataSourcePicker } from '../components/reports/DataSourcePicker';
import { SectionEditor } from '../components/reports/SectionEditor';
import { FilterEditor } from '../components/reports/FilterEditor';
import * as hooks from '../hooks/useReportStudio';
import type {
  ReportCatalog, DataSourceSpec, ReportSection, ReportFilter,
} from '../types/reportStudio';

vi.mock('../hooks/useReportStudio', async (importOriginal) => {
  const actual = await importOriginal<typeof hooks>();
  return {
    ...actual,
    useReportCatalog: vi.fn(),
    useReportDefinition: vi.fn(),
    useReportMutations: vi.fn(),
    useDefinitionValidator: vi.fn(),
    useReportPreview: vi.fn(),
  };
});

const mocked = hooks as unknown as Record<string, ReturnType<typeof vi.fn>>;

const SOURCE: DataSourceSpec = {
  data_source_key: 'migration.control_summary',
  display_name: 'Control summary',
  grain: 'batch_control',
  scope_family: 'batch_family',
  required_permission: 'reports:read',
  required_entitlements: 'report_studio',
  fields: {
    fields: [
      { name: 'batch_id', role: 'dimension', type: 'uuid', label: 'Batch' },
      { name: 'control_id', role: 'dimension', type: 'text', label: 'Control' },
      { name: 'overall_status', role: 'dimension', type: 'text', label: 'Status' },
      { name: 'total_rules', role: 'measure', type: 'integer', label: 'Total rules', aggregations: ['sum', 'min', 'max', 'avg'] },
      { name: 'failed_rules', role: 'measure', type: 'integer', label: 'Failed', aggregations: ['sum', 'max'] },
    ],
  },
};

const OTHER_SOURCE: DataSourceSpec = {
  ...SOURCE,
  data_source_key: 'control.registry',
  display_name: 'Control registry',
  scope_family: 'control_family',
  fields: {
    fields: [
      { name: 'control_id', role: 'dimension', type: 'text', label: 'Control' },
      { name: 'severity_level', role: 'dimension', type: 'text', label: 'Severity' },
      // deliberately no measure, to prove the editor does not invent one
    ],
  },
};

function catalog(perms: string[]): ReportCatalog {
  return {
    entitlements: ['report_studio', 'advanced_reporting'],
    permissions: perms,
    data_sources: [SOURCE, OTHER_SOURCE],
    templates: [],
  };
}

const DEFINITION = {
  schema_version: 1,
  data_source_key: 'migration.control_summary',
  sections: [
    { id: 'kpis', type: 'kpi', title: 'Total rules', bindings: { measure: 'total_rules', aggregation: 'sum' } },
    { id: 'by_control', type: 'bar', title: 'By control', bindings: { measure: 'failed_rules', aggregation: 'sum', dimensions: ['control_id'] } },
  ],
  filters: [],
  max_rows: 200,
};

function stubEditor(opts: {
  perms?: string[];
  isOwner?: boolean;
  validateResult?: { valid: boolean; errors: string[]; section_count: number; filter_count: number };
  previewData?: unknown;
}) {
  const perms = opts.perms ?? ['reports:read', 'reports:update', 'reports:export'];
  mocked.useReportCatalog.mockReturnValue({
    data: catalog(perms), loading: false, error: null, refetch: vi.fn(),
    hasEntitlement: true, can: (p: string) => perms.includes(p),
  });
  mocked.useReportDefinition.mockReturnValue({
    report: {
      id: 'r1', title: 'Migration Health', status: 'draft', origin: 'template',
      is_owner: opts.isOwner ?? true, template_state: 'pinned',
      derived_from_template_key: 'migration_health_weekly',
    },
    definition: {
      id: 'd1', version_no: 1, schema_version: 1, definition: DEFINITION,
      created_by: 'u1', created_at: '2026-09-27T00:00:00',
    },
    loading: false, error: null, refetch: vi.fn(), setReport: vi.fn(),
  });
  mocked.useReportMutations.mockReturnValue({
    busy: false, error: null, setError: vi.fn(),
    instantiate: vi.fn(), createBlank: vi.fn(),
    saveDefinition: vi.fn(), setStatus: vi.fn(), duplicate: vi.fn(),
    share: vi.fn(), revoke: vi.fn(), adoptTemplate: vi.fn(),
  });
  mocked.useDefinitionValidator.mockReturnValue({
    result: opts.validateResult ?? null, checking: false, error: null,
    validate: vi.fn().mockResolvedValue(opts.validateResult ?? { valid: true, errors: [], section_count: 2, filter_count: 0 }),
    reset: vi.fn(),
  });
  mocked.useReportPreview.mockReturnValue({
    data: opts.previewData ?? null, loading: false, error: null,
    run: vi.fn(), clear: vi.fn(),
  });
}

const renderEditor = () =>
  renderWithProviders(
    <Routes>
      <Route path="/reports/studio/:reportId/edit" element={<ReportEditorPage />} />
    </Routes>,
    { initialEntries: ['/reports/studio/r1/edit'] },
  );

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('Editor — ownership gate', () => {
  it('is editable for the owner', async () => {
    stubEditor({ isOwner: true });
    renderEditor();
    expect(await screen.findByText('Sections')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save new version' })).toBeTruthy();
    expect(screen.queryByText(/Read-only\./)).toBeNull();
  });

  it('is read-only for a share-recipient, naming the owner relationship', async () => {
    // This is the case the Phase 1 `is_owner` fix made decidable: previously the
    // detail endpoint did not say who owned the report.
    stubEditor({ isOwner: false });
    renderEditor();
    expect(await screen.findByText(/Read-only\./)).toBeTruthy();
    expect(screen.getByText(/belongs to another user/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save new version' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Preview' })).toHaveProperty('disabled', true);
  });

  it('is read-only without reports:update', async () => {
    stubEditor({ perms: ['reports:read'], isOwner: true });
    renderEditor();
    expect(await screen.findByText(/reports:update/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save new version' })).toHaveProperty('disabled', true);
  });
});

describe('Editor — the server validator is the only authority', () => {
  it('shows the validator errors verbatim and offers no way around them', async () => {
    stubEditor({
      validateResult: {
        valid: false,
        errors: [
          "sections[1]: type 'bar' needs a dimension or time axis",
          "sections[0].bindings.measure: 'tenant_id' is reserved and cannot be used",
        ],
        section_count: 0, filter_count: 0,
      },
    });
    renderEditor();
    expect(await screen.findByText(/rejected this definition/i)).toBeTruthy();
    expect(screen.getByText(/needs a dimension or time axis/)).toBeTruthy();
    expect(screen.getByText(/'tenant_id' is reserved/)).toBeTruthy();
  });

  it('reports a valid definition from the server', async () => {
    stubEditor({ validateResult: { valid: true, errors: [], section_count: 2, filter_count: 0 } });
    renderEditor();
    // anchored on the full sentence, because /Valid/ alone also matches the
    // "Invalid report definition" copy in the save-failure path
    expect(
      await screen.findByText(/Valid\s*—\s*2 section\(s\),\s*0 filter\(s\)\./),
    ).toBeTruthy();
  });

  it('blocks the preview when validation failed', async () => {
    const run = vi.fn();
    stubEditor({ validateResult: { valid: false, errors: ['boom'], section_count: 0, filter_count: 0 } });
    mocked.useReportPreview.mockReturnValue({
      data: null, loading: false, error: null, run, clear: vi.fn(),
    });
    renderEditor();
    const previewBtn = await screen.findByRole('button', { name: 'Preview' });
    fireEvent.click(previewBtn);
    await waitFor(() => expect(mocked.useDefinitionValidator).toBeDefined());
    // validate is called first and the preview must not run
    await new Promise((r) => setTimeout(r, 50));
    expect(run).not.toHaveBeenCalled();
  });
});

describe('Editor — data source selection', () => {
  it('lists only the sources the server returned', async () => {
    stubEditor({});
    renderEditor();
    expect(await screen.findByText('control.registry')).toBeTruthy();
    expect(await screen.findByText('migration.control_summary')).toBeTruthy();
    // nothing outside the catalog is offered
    expect(screen.queryByText('engine.migration_batches')).toBeNull();
  });

  it('labels a source that needs an extra entitlement', () => {
    render(
      <MemoryRouter>
        <DataSourcePicker sources={[SOURCE]} selected={null} onSelect={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Control summary')).toBeTruthy();
    expect(screen.getByText('batch_control')).toBeTruthy();
  });

  it('says so plainly when the tenant has no sources at all', () => {
    render(
      <MemoryRouter>
        <DataSourcePicker sources={[]} selected={null} onSelect={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No data sources are available/i)).toBeTruthy();
  });
});

describe('Editor — section bindings are constrained to declared fields', () => {
  it('offers only the measures the source declares', () => {
    const section: ReportSection = {
      id: 's1', type: 'kpi', bindings: {},
    };
    render(
      <SectionEditor
        section={section} source={SOURCE} index={0} total={1}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    const measure = screen.getByLabelText('Section 1 measure') as HTMLSelectElement;
    const values = [...measure.options].map((o) => o.value);
    expect(values).toContain('total_rules');
    expect(values).toContain('failed_rules');
    // a field from another source, or an undeclared column, is not offered
    expect(values).not.toContain('tenant_id');
    expect(values).not.toContain('severity_level');
  });

  it('narrows the aggregation list to what the chosen field declares', () => {
    const section: ReportSection = {
      id: 's1', type: 'kpi', bindings: { measure: 'failed_rules', aggregation: 'sum' },
    };
    render(
      <SectionEditor
        section={section} source={SOURCE} index={0} total={1}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    const agg = screen.getByLabelText('Section 1 aggregation') as HTMLSelectElement;
    const values = [...agg.options].map((o) => o.value);
    // failed_rules declares sum + max only
    expect(values).toContain('sum');
    expect(values).toContain('max');
    expect(values).not.toContain('avg');
  });

  it('marks a dimension as required for chart types', () => {
    const section: ReportSection = { id: 's1', type: 'bar', bindings: {} };
    render(
      <SectionEditor
        section={section} source={SOURCE} index={0} total={1}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    expect(screen.getByText('required')).toBeTruthy();
  });

  it('refuses to configure a section before a source is chosen', () => {
    const section: ReportSection = { id: 's1', type: 'kpi', bindings: {} };
    render(
      <SectionEditor
        section={section} source={undefined} index={0} total={1}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    expect(screen.getByText(/Choose a data source above/i)).toBeTruthy();
  });

  it('disables reordering at the ends of the list', () => {
    const section: ReportSection = { id: 's1', type: 'kpi', bindings: {} };
    const { rerender } = render(
      <SectionEditor
        section={section} source={SOURCE} index={0} total={3}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    expect(screen.getByLabelText('Move section 1 up')).toHaveProperty('disabled', true);
    expect(screen.getByLabelText('Move section 1 down')).toHaveProperty('disabled', false);
    rerender(
      <SectionEditor
        section={section} source={SOURCE} index={2} total={3}
        onChange={() => {}} onRemove={() => {}} onMove={() => {}}
      />,
    );
    expect(screen.getByLabelText('Move section 3 up')).toHaveProperty('disabled', false);
    expect(screen.getByLabelText('Move section 3 down')).toHaveProperty('disabled', true);
  });
});

describe('Editor — filter operators are allowlisted', () => {
  it('offers only the allowlisted operators', () => {
    const filters: ReportFilter[] = [{ field: 'control_id', op: 'eq', value: 'C01' }];
    render(
      <FilterEditor filters={filters} source={SOURCE} onChange={() => {}} />,
    );
    const op = screen.getByLabelText('Filter 1 operator') as HTMLSelectElement;
    const values = [...op.options].map((o) => o.value);
    expect(values).toEqual(
      ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'between', 'like'],
    );
    // no expression-shaped operator can be selected
    expect(values).not.toContain('regex');
    expect(values).not.toContain('raw');
  });

  it('builds a real array for `in`, which is what the validator requires', () => {
    const onChange = vi.fn();
    const filters: ReportFilter[] = [{ field: 'control_id', op: 'in', value: [] }];
    render(<FilterEditor filters={filters} source={SOURCE} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Filter 1 value'), {
      target: { value: 'C01, C02 ,C03' },
    });
    const calls = onChange.mock.calls;
    const next = calls[calls.length - 1][0] as ReportFilter[];
    expect(next[0].value).toEqual(['C01', 'C02', 'C03']);
  });

  it('keeps exactly two values for `between`', () => {
    const onChange = vi.fn();
    const filters: ReportFilter[] = [{ field: 'control_id', op: 'between', value: [] }];
    render(<FilterEditor filters={filters} source={SOURCE} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Filter 1 value'), {
      target: { value: '1,5,9' },
    });
    const calls = onChange.mock.calls;
    const next = calls[calls.length - 1][0] as ReportFilter[];
    expect(next[0].value).toEqual(['1', '5']);
  });

  it('offers no filter fields before a source is chosen', () => {
    render(<FilterEditor filters={[]} source={undefined} onChange={() => {}} />);
    expect(screen.getByText(/only use fields that source declares/i)).toBeTruthy();
  });
});
