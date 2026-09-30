/**
 * OC-REPORT-001 — Report Studio frontend tests.
 *
 * These cover the behaviour that the backend E2E evidence cannot demonstrate,
 * because it happens in the browser:
 *
 *  - the Studio is gated on the report_studio entitlement, and a denial is
 *    shown rather than worked around
 *  - a 403 on the data call renders an explicit access-denied state
 *  - capability gating hides export/creation but never hides the report
 *  - the template gallery is driven by the server-filtered /catalog
 *  - the Report Assistant is presented as deterministic, not as a model
 *  - a truncated result is labelled as incomplete
 *
 * Components take the tenant scope as a prop, so these assert what the UI does
 * with the server's answer. The tenant-scope plumbing itself is covered by
 * TenantContext.test.tsx and by the backend, which re-validates scope.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import { ReportListPage } from '../routes/reports/ReportListPage';
import { ReportViewer } from '../routes/reports/ReportViewer';
import { TemplateGallery } from '../components/reports/TemplateGallery';
import { ReportAssistantPanel } from '../components/reports/ReportAssistantPanel';
import { ReportComponentView } from '../components/reports/ReportComponentView';
import * as apiClient from '../utils/apiClient';
import type { ReportCatalog, ReportReadPayload } from '../types/reportStudio';

vi.mock('../utils/apiClient', async (importOriginal) => {
  const actual = await importOriginal<typeof apiClient>();
  return {
    ...actual,
    apiGet: vi.fn(),
    apiPost: vi.fn(),
    apiPut: vi.fn(),
    apiPatch: vi.fn(),
    apiDelete: vi.fn(),
  };
});

const mocked = apiClient as unknown as {
  apiGet: ReturnType<typeof vi.fn>;
  apiPost: ReturnType<typeof vi.fn>;
};

const TENANT = '11111111-1111-1111-1111-111111111111';

function catalog(over: Partial<ReportCatalog> = {}): ReportCatalog {
  return {
    entitlements: ['report_studio', 'advanced_reporting'],
    permissions: ['reports:read', 'reports:create', 'reports:update', 'reports:export'],
    data_sources: [],
    templates: [
      {
        template_key: 'migration_health_weekly',
        version: 3,
        display_name: 'Migration Health - Weekly',
        description: 'Weekly ops review',
        category: 'operational',
        data_sources: ['migration.control_summary'],
        required_entitlements: ['report_studio'],
        thumbnail_spec: {},
        available: true,
      },
      {
        template_key: 'executive_status',
        version: 4,
        display_name: 'Executive Status',
        description: 'Board summary',
        category: 'executive',
        data_sources: ['migration.risk_index'],
        // a second, independent gate beyond report_studio
        required_entitlements: ['report_studio', 'advanced_reporting'],
        thumbnail_spec: {},
        available: true,
      },
    ],
    ...over,
  };
}

function forbidden(detail: string) {
  return { response: { status: 403, data: { detail } } };
}

const readPayload: ReportReadPayload = {
  report: {
    id: 'r1',
    title: 'Migration Health',
    status: 'published',
    visibility: 'tenant',
    template_state: 'pinned',
    origin: 'template',
    derived_from_template_key: 'migration_health_weekly',
    derived_from_template_version: 3,
    is_owner: true,
  },
  version: { version_no: 2, schema_version: 1, created_at: '2026-09-27T00:00:00' },
  meta: {
    ok: true,
    data_source_key: 'migration.control_summary',
    scope_family: 'batch_family',
    row_count: 128,
    max_rows: 200,
    truncated: false,
    runtime_filters_applied: 0,
  },
  components: [],
  errors: [],
};

const defPayload = {
  report: { id: 'r1', title: 'Migration Health', status: 'published', origin: 'template' },
  definition: {
    id: 'd1',
    version_no: 2,
    schema_version: 1,
    definition: { schema_version: 1, data_source_key: 'migration.control_summary', sections: [], filters: [] },
    created_by: 'u1',
    created_at: '2026-09-27T00:00:00',
  },
};

function stubViewerApi(cat: ReportCatalog, data: ReportReadPayload = readPayload) {
  mocked.apiGet.mockImplementation(async (url: string) => {
    if (url.includes('/catalog')) return cat;
    if (url.includes('/access')) return { items: [] };
    if (url.includes('/versions')) return { items: [defPayload.definition] };
    if (url.includes('/data')) return data;
    if (url.includes('/reports?')) return { items: [] };
    return defPayload;
  });
}

function renderViewer() {
  // ReportViewer reads the id from the route, so it must be mounted under a
  // matching <Route> rather than rendered bare. renderWithProviders supplies the
  // router and AuthProvider, so the route tree is nested inside it rather than
  // wrapping it in a second MemoryRouter.
  return renderWithProviders(
    <Routes>
      <Route path="/reports/studio/:reportId/view" element={<ReportViewer />} />
    </Routes>,
    { initialEntries: ['/reports/studio/r1/view'] },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('Report Studio - entitlement gate', () => {
  it('names the missing entitlement instead of rendering a blank page', async () => {
    mocked.apiGet.mockResolvedValue(catalog({ entitlements: ['basic_reporting'] }));
    renderWithProviders(<ReportListPage />);
    expect(await screen.findByText(/Not available on this plan/i)).toBeTruthy();
    expect(screen.getByText('report_studio')).toBeTruthy();
    // the caller's actual entitlements are shown, so the denial is actionable
    expect(screen.getByText('basic_reporting')).toBeTruthy();
  });

  it('surfaces the API 403 detail rather than swallowing it', async () => {
    mocked.apiGet.mockImplementation(async (url: string) => {
      if (url.includes('/catalog')) throw forbidden("Feature 'report_studio' not available on your plan.");
      return { items: [] };
    });
    renderWithProviders(<ReportListPage />);
    expect(await screen.findByText(/Not available on this plan/i)).toBeTruthy();
    expect(screen.getByText(/Upgrade required|Not available on your plan/i)).toBeTruthy();
  });

  it('does not offer creation when reports:create is absent', async () => {
    mocked.apiGet.mockResolvedValue(catalog({ permissions: ['reports:read', 'reports:export'] }));
    renderWithProviders(<ReportListPage />);
    await screen.findByText('Report Studio');
    // the effective capability is stated plainly, so a missing create button is
    // explained rather than just absent
    const summary = screen.getByText(/can create:/i).parentElement!;
    expect(summary.textContent).toMatch(/can create:\s*false/i);
    // and the "New report" tab cannot silently create anything
    fireEvent.click(screen.getByText('New report'));
    expect(await screen.findByText(/Read-only/i)).toBeTruthy();
  });
});

describe('Report Studio - template gallery', () => {
  it('renders only the templates the server returned', async () => {
    mocked.apiGet.mockResolvedValue(catalog());
    renderWithProviders(<ReportListPage />);
    fireEvent.click(await screen.findByText('New report'));
    expect(await screen.findByText('Migration Health - Weekly')).toBeTruthy();
    expect(screen.getByText('Executive Status')).toBeTruthy();
  });

  it('surfaces the extra entitlement a template needs beyond report_studio', async () => {
    mocked.apiGet.mockResolvedValue(catalog());
    renderWithProviders(<ReportListPage />);
    fireEvent.click(await screen.findByText('New report'));
    await screen.findByText('Executive Status');
    expect(screen.getAllByText('advanced_reporting').length).toBeGreaterThan(0);
  });

  it('explains read-only rather than showing a gallery that cannot be used', () => {
    render(
      <MemoryRouter>
        <TemplateGallery templates={catalog().templates} tenantId={TENANT} canCreate={false} onCreated={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Read-only/i)).toBeTruthy();
    expect(screen.getByText('reports:create')).toBeTruthy();
  });

  it('always offers a blank report so nobody is trapped', async () => {
    mocked.apiPost.mockResolvedValue({ id: 'r1' });
    const onCreated = vi.fn();
    render(
      <MemoryRouter>
        <TemplateGallery templates={catalog().templates} tenantId={TENANT} canCreate onCreated={onCreated} />
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByText(/Blank report/i));
    await waitFor(() => expect(mocked.apiPost).toHaveBeenCalled());
    expect(onCreated).toHaveBeenCalled();
  });
});

describe('Report Studio - Report Viewer', () => {
  it('renders the report title and data-source provenance', async () => {
    stubViewerApi(catalog());
    renderViewer();
    expect(await screen.findByText('Migration Health')).toBeTruthy();
    // provenance is visible: which source, which grain, which template
    expect(screen.getByText('migration.control_summary')).toBeTruthy();
    expect(screen.getByText('batch_family')).toBeTruthy();
    expect(screen.getByText(/migration_health_weekly/)).toBeTruthy();
  });

  it('hides export without reports:export but still renders the report', async () => {
    stubViewerApi(catalog({ permissions: ['reports:read'] }));
    renderViewer();
    expect(await screen.findByText(/Export unavailable/i)).toBeTruthy();
    expect(screen.getByTitle(/do not hold reports:export/i)).toBeTruthy();
    // the data itself is still available
    expect(screen.getByText('Migration Health')).toBeTruthy();
  });

  it('offers both export formats when reports:export is held', async () => {
    stubViewerApi(catalog());
    renderViewer();
    // Phase 3: CSV stays the default and XLSX sits beside it, both reusing the
    // same authorised /export endpoint.
    expect(await screen.findByLabelText('Export CSV')).toBeTruthy();
    expect(screen.getByLabelText('Export XLSX')).toBeTruthy();
    const csv = screen.getByLabelText('Export CSV') as HTMLAnchorElement;
    const xlsx = screen.getByLabelText('Export XLSX') as HTMLAnchorElement;
    expect(csv.getAttribute('href')).toContain('format=csv');
    expect(xlsx.getAttribute('href')).toContain('format=xlsx');
    // both point at the same report, so there is one export path, not two
    expect(csv.getAttribute('href')).toContain('/export?');
    expect(xlsx.getAttribute('href')).toContain('/export?');
  });

  it('renders a 403 on the data call as an explicit denial', async () => {
    mocked.apiGet.mockImplementation(async (url: string) => {
      if (url.includes('/catalog')) return catalog();
      if (url.includes('/access')) return { items: [] };
      if (url.includes('/versions')) return { items: [] };
      if (url.includes('/data')) {
        throw forbidden("Feature 'advanced_reporting' not available on your plan. Upgrade required.");
      }
      return defPayload;
    });
    renderViewer();
    expect(await screen.findByText(/Access denied/i)).toBeTruthy();
    expect(screen.getByText(/advanced_reporting/)).toBeTruthy();
    // and it is explicit that the API, not the UI, is the boundary
    expect(screen.getByText(/enforced by the API/i)).toBeTruthy();
  });

  it('labels an incomplete result as truncated', async () => {
    stubViewerApi(catalog(), {
      ...readPayload,
      meta: { ...readPayload.meta, truncated: true, row_count: 200 },
    });
    renderViewer();
    expect(await screen.findByText(/TRUNCATED/i)).toBeTruthy();
  });

  it('marks a complete result as complete', async () => {
    stubViewerApi(catalog());
    renderViewer();
    expect(await screen.findByText(/complete/i)).toBeTruthy();
  });
});

describe('Report Studio - component renderers', () => {
  it('renders a KPI', () => {
    render(
      <ReportComponentView
        component={{ id: 'k', type: 'kpi', title: 'Total rules', is_row_query: false, columns: ['value'], rows: [[1408]], row_count: 1 }}
      />,
    );
    expect(screen.getByText('Total rules')).toBeTruthy();
    expect(screen.getByText('1,408')).toBeTruthy();
  });

  it('renders a bar chart from a dimension and a measure', () => {
    render(
      <ReportComponentView
        component={{ id: 'b', type: 'bar', title: 'By control', is_row_query: false, columns: ['control_id', 'value'], rows: [['C01', 24]], row_count: 1 }}
      />,
    );
    expect(screen.getByText('C01')).toBeTruthy();
    expect(screen.getByText('24')).toBeTruthy();
  });

  it('renders an empty section rather than a broken chart', () => {
    render(
      <ReportComponentView
        component={{ id: 'b', type: 'bar', title: 'By control', is_row_query: false, columns: ['a', 'v'], rows: [], row_count: 0 }}
      />,
    );
    expect(screen.getByText(/No data in this section/i)).toBeTruthy();
  });

  it('renders a row table with readable headers', () => {
    render(
      <ReportComponentView
        component={{ id: 't', type: 'table', title: 'Register', is_row_query: true, columns: ['control_id', 'failed'], rows: [['C01', 3]], row_count: 1 }}
      />,
    );
    expect(screen.getByText('control id')).toBeTruthy();
    expect(screen.getByText('C01')).toBeTruthy();
  });

  it('renders a donut total', () => {
    render(
      <ReportComponentView
        component={{ id: 'd', type: 'donut', title: 'Mix', is_row_query: false, columns: ['k', 'v'], rows: [['passed', 3], ['failed', 1]], row_count: 2 }}
      />,
    );
    expect(screen.getByText('4')).toBeTruthy();
  });
});

describe('Report Studio - Report Assistant is not AI', () => {
  it('states it is deterministic and free, and never claims to be a model', async () => {
    mocked.apiGet.mockResolvedValue({ items: [] });
    render(
      <MemoryRouter>
        <ReportAssistantPanel tenantId={TENANT} onCreated={() => {}} />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/deterministic/i)).toBeTruthy();
    expect(screen.getByText(/no LLM/i)).toBeTruthy();
    expect(screen.getByText(/no API cost/i)).toBeTruthy();
  });

  it('shows the matched recipe and the keywords that matched', async () => {
    mocked.apiGet.mockResolvedValue({ items: [] });
    mocked.apiPost.mockResolvedValue({
      matched: true,
      recipe_key: 'migration_health_weekly',
      display_name: 'Migration health',
      score: 2,
      matched_keywords: ['failed', 'controls'],
      questions: [{ id: 'severity', prompt: 'Which severities?', type: 'choice', options: ['CRITICAL', 'ALL'], default: 'CRITICAL' }],
      resulting_template_key: 'migration_health_weekly',
    });
    render(
      <MemoryRouter>
        <ReportAssistantPanel tenantId={TENANT} onCreated={() => {}} />
      </MemoryRouter>,
    );
    fireEvent.change(await screen.findByLabelText(/What report do you want/i), {
      target: { value: 'show me failed controls' },
    });
    fireEvent.click(screen.getByText('Match'));

    expect(await screen.findByText('migration_health_weekly')).toBeTruthy();
    // the keywords are surfaced, so the match is never silent
    expect(screen.getByText('failed')).toBeTruthy();
    expect(screen.getByText('controls')).toBeTruthy();
    // the follow-up is a constrained choice, not free text
    expect(screen.getByText('Which severities?')).toBeTruthy();
    expect(screen.getByText('CRITICAL')).toBeTruthy();
  });

  it('reports an unmatched request instead of guessing', async () => {
    mocked.apiGet.mockResolvedValue({ items: [] });
    mocked.apiPost.mockResolvedValue({
      matched: false,
      reason: 'no recipe matched; choose a template instead',
      available_recipes: [{ recipe_key: 'reconciliation', display_name: 'Reconciliation' }],
    });
    render(
      <MemoryRouter>
        <ReportAssistantPanel tenantId={TENANT} onCreated={() => {}} />
      </MemoryRouter>,
    );
    fireEvent.change(await screen.findByLabelText(/What report do you want/i), {
      target: { value: 'zzzz qqqq' },
    });
    fireEvent.click(screen.getByText('Match'));

    // the reason text also contains "no recipe matched", so wait for the bold
    // heading via its own text rather than a text query that matches both the
    // heading and the wrapping banner
    await waitFor(() =>
      expect(document.querySelector('b')?.textContent).toMatch(/No recipe matched/i),
    );
    expect(screen.getByText('Reconciliation')).toBeTruthy();
  });
});
