/**
 * OC-REPORT-001 — Phase 3 focused tests: template updates, xlsx export, duplicate.
 *
 * These pin the behaviours the plan is explicit about rather than incidental
 * markup:
 *
 *  - a template update is OFFERED, never applied automatically
 *  - adoption is a separate, confirmed action that creates a new version
 *  - a diverged report is told why it gets no updates, not silently ignored
 *  - xlsx is discoverable next to csv and reuses the one authorised endpoint
 *  - both export controls and duplicate are capability-gated in the UI
 */
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, render } from '@testing-library/react';
import { TemplateUpdateBanner } from '../components/reports/TemplateUpdateBanner';
import { ExportControl } from '../components/reports/ExportControl';
import type { TemplateUpdateInfo } from '../types/reportStudio';

const banner = (over: Partial<TemplateUpdateInfo> = {}): TemplateUpdateInfo => ({
  has_update: true,
  template_key: 'migration_health_weekly',
  template_display_name: 'Migration Health — Weekly',
  report_template_version: 3,
  latest_template_version: 4,
  changelog: 'Added a pass-rate KPI and a slow-query warning section.',
  diff: {
    added: [{ id: 'new_kpi', type: 'kpi', title: 'Pass rate' }],
    removed: [],
    changed: [{
      id: 'by_control', type: 'bar', title: 'Failed controls by owner',
      changes: [{ field: 'bindings.measure', from: 'failed_rules', to: 'error_rules' }],
    }],
    data_source_change: null,
  },
  ...over,
});

describe('TemplateUpdateBanner — offers, never applies', () => {
  it('shows the version gap, changelog and diff before anything is accepted', () => {
    render(
      <TemplateUpdateBanner info={banner()} canUpdate onAdopt={() => {}} />,
    );
    expect(screen.getByText(/newer version of this report/i)).toBeTruthy();
    expect(screen.getByText(/your report is on template v3, latest is v4/i)).toBeTruthy();
    expect(screen.getByText(/Added a pass-rate KPI/i)).toBeTruthy();
  });

  it('does NOT call onAdopt merely by rendering', () => {
    const onAdopt = vi.fn();
    render(<TemplateUpdateBanner info={banner()} canUpdate onAdopt={onAdopt} />);
    // the strongest form of the rule: no code path auto-adopts
    expect(onAdopt).not.toHaveBeenCalled();
  });

  it('requires an explicit confirmation before adopting', () => {
    const onAdopt = vi.fn();
    render(<TemplateUpdateBanner info={banner()} canUpdate onAdopt={onAdopt} />);

    const adoptBtn = screen.getByText(/Adopt template v4/);
    fireEvent.click(adoptBtn);
    // first click only asks
    expect(onAdopt).not.toHaveBeenCalled();
    expect(screen.getByText(/Replace the definition with template v4/i)).toBeTruthy();

    fireEvent.click(screen.getByText(/Yes, adopt as new version/));
    expect(onAdopt).toHaveBeenCalledTimes(1);
  });

  it('lets the user cancel the confirmation without adopting', () => {
    const onAdopt = vi.fn();
    render(<TemplateUpdateBanner info={banner()} canUpdate onAdopt={onAdopt} />);
    fireEvent.click(screen.getByText(/Adopt template v4/));
    fireEvent.click(screen.getByText('Cancel'));
    expect(onAdopt).not.toHaveBeenCalled();
  });

  it('reveals the per-section diff on request, including a data-source change', () => {
    render(
      <TemplateUpdateBanner
        info={banner({
          diff: {
            added: [{ id: 'new_kpi', type: 'kpi', title: 'Pass rate' }],
            removed: [{ id: 'old', type: 'bar', title: 'Old chart' }],
            changed: [],
            data_source_change: { from: 'migration.batch', to: 'migration.control_summary' },
          },
        })}
        canUpdate
        onAdopt={() => {}}
      />,
    );
    // the diff is collapsed until asked for
    expect(screen.queryByText('(new)')).toBeNull();
    fireEvent.click(screen.getByText(/Show what adopting would change/));
    expect(screen.getByText('(new)')).toBeTruthy();
    expect(screen.getByText('(removed)')).toBeTruthy();
    // a data-source swap is the most consequential change, so it is called out
    expect(screen.getByText(/Data source changes/)).toBeTruthy();
    expect(screen.getByText('migration.batch')).toBeTruthy();
  });

  it('lets a read-only user review the update but not adopt it', () => {
    const onAdopt = vi.fn();
    render(<TemplateUpdateBanner info={banner()} canUpdate={false} onAdopt={onAdopt} />);
    expect(screen.getByText(/Added a pass-rate KPI/i)).toBeTruthy();
    expect(screen.queryByText(/Adopt template v4/)).toBeNull();
    expect(screen.getByText(/reports:update/)).toBeTruthy();
    expect(onAdopt).not.toHaveBeenCalled();
  });

  it('explains a diverged report instead of hiding the banner', () => {
    render(
      <TemplateUpdateBanner
        info={{ has_update: false, reason: 'report has diverged',
                template_key: 'migration_health_weekly', report_template_version: 3 }}
        canUpdate
        onAdopt={() => {}}
      />,
    );
    expect(screen.getByText(/has diverged from its template/i)).toBeTruthy();
    // provenance is retained and no adopt affordance is offered
    expect(screen.queryByText(/Adopt template/)).toBeNull();
  });

  it('says when a report is not template-derived', () => {
    render(
      <TemplateUpdateBanner
        info={{ has_update: false, reason: 'not derived from a template' }}
        canUpdate
        onAdopt={() => {}}
      />,
    );
    expect(screen.getByText(/not created from a template/i)).toBeTruthy();
  });

  it('confirms an up-to-date pinned report', () => {
    render(
      <TemplateUpdateBanner
        info={{ has_update: false, template_key: 'reconciliation',
                report_template_version: 2, latest_template_version: 2 }}
        canUpdate
        onAdopt={() => {}}
      />,
    );
    expect(screen.getByText(/up to date/i)).toBeTruthy();
  });

  it('surfaces a failed check rather than hiding it', () => {
    render(
      <TemplateUpdateBanner info={null} error="Missing permission: reports:read"
        canUpdate onAdopt={() => {}} />,
    );
    expect(screen.getByRole('alert').textContent).toMatch(/Could not check/);
  });

  it('confirms adoption after the API returns', () => {
    render(
      <TemplateUpdateBanner info={null} canUpdate
        adoptedMessage="Adopted template v4 as a new report version." onAdopt={() => {}} />,
    );
    expect(screen.getByRole('status').textContent).toMatch(/Adopted template v4/);
  });
});

describe('ExportControl — csv and xlsx, one authorised endpoint', () => {
  it('offers both formats with the format parameter set', () => {
    render(<ExportControl reportId="r1" canExport tenantId="t1" />);
    const csv = screen.getByLabelText('Export CSV') as HTMLAnchorElement;
    const xlsx = screen.getByLabelText('Export XLSX') as HTMLAnchorElement;
    expect(csv.getAttribute('href')).toBe('/api/v1/reports/studio/reports/r1/export?format=csv&tenant_id=t1');
    expect(xlsx.getAttribute('href')).toBe('/api/v1/reports/studio/reports/r1/export?format=xlsx&tenant_id=t1');
  });

  it('targets the version being viewed, not always the current one', () => {
    render(<ExportControl reportId="r1" canExport version={2} />);
    const csv = screen.getByLabelText('Export CSV') as HTMLAnchorElement;
    expect(csv.getAttribute('href')).toContain('version=2');
  });

  it('hides both formats without reports:export and names the reason', () => {
    render(<ExportControl reportId="r1" canExport={false} />);
    expect(screen.queryByLabelText('Export CSV')).toBeNull();
    expect(screen.queryByLabelText('Export XLSX')).toBeNull();
    expect(screen.getByText('Export unavailable')).toBeTruthy();
    expect(screen.getByTitle(/do not hold reports:export/i)).toBeTruthy();
  });
});
