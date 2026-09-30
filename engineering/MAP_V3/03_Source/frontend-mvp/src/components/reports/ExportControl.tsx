/**
 * OC-REPORT-001 â€” export controls.
 *
 * The backend already serves both formats (`?format=csv|xlsx`) behind the same
 * independent `reports:export` check, so this component adds discoverability and
 * nothing else. It reuses that endpoint rather than introducing a second export
 * path.
 *
 * Capability handling matches the rest of the Studio: a user without
 * `reports:export` is told the control is unavailable and the reason, rather than
 * being shown a button that fails. The API still refuses the request either way.
 *
 * NOTE (accepted deviation): the plan names an `ExportMenu`. This is a small
 * button group instead, because there are only two formats and a menu component
 * would add a component and a state machine for no behavioural gain. CSV remains
 * the default and xlsx sits beside it.
 */
import { useState } from 'react';

export type ExportFormat = 'csv' | 'xlsx';

function buildUrl(reportId: string, format: ExportFormat, tenantId?: string | null, version?: number) {
  const p = new URLSearchParams({ format });
  if (tenantId) p.set('tenant_id', tenantId);
  if (version) p.set('version', String(version));
  return `/api/v1/reports/studio/reports/${reportId}/export?${p.toString()}`;
}

interface Props {
  reportId: string;
  canExport: boolean;
  tenantId?: string | null;
  version?: number;
}

export function ExportControl({ reportId, canExport, tenantId, version }: Props) {
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  if (!canExport) {
    return (
      <span
        title="You can view this report but you do not hold reports:export"
        className="rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-400"
      >
        Export unavailable
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label="Export report">
      {(['csv', 'xlsx'] as ExportFormat[]).map((fmt) => (
        <a
          key={fmt}
          href={buildUrl(reportId, fmt, tenantId, version)}
          onClick={() => setBusy(fmt)}
          aria-label={`Export ${fmt.toUpperCase()}`}
          title={
            fmt === 'csv'
              ? 'Comma-separated values â€” one row per result'
              : 'Excel workbook â€” one sheet per report section'
          }
          className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {busy === fmt ? 'Preparingâ€¦' : fmt.toUpperCase()}
        </a>
      ))}
    </span>
  );
}

export default ExportControl;
