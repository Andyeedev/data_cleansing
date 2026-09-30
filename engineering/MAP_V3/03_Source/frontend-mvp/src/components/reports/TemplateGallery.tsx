/**
 * OC-REPORT-001 â€” TemplateGallery.
 *
 * V1 templates plus a blank-report entry. The gallery is rendered from
 * /catalog, which is already entitlement-filtered SERVER-SIDE, so a template the
 * tenant cannot use is not shown at all rather than shown disabled.
 */
import { useState } from 'react';
import type { TemplateSpec, ReportDefinitionBody, ReportRecord } from '../../types/reportStudio';
import { useReportMutations } from '../../hooks/useReportStudio';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorState } from '../shared/ErrorState';

interface Props {
  templates: TemplateSpec[];
  tenantId?: string | null;
  canCreate: boolean;
  onCreated: (report: ReportRecord) => void;
}

const BLANK: ReportDefinitionBody = {
  schema_version: 1,
  data_source_key: 'migration.batch',
  sections: [
    { id: 'kpi', type: 'kpi', title: 'Batches', bindings: { aggregation: 'count' } },
  ],
  filters: [],
};

export function TemplateGallery({ templates, tenantId, canCreate, onCreated }: Props) {
  const m = useReportMutations(tenantId);
  const [error, setError] = useState<string | null>(null);

  const start = async (key: string) => {
    setError(null);
    const r = await m.instantiate(key);
    if (r) onCreated(r);
  };

  const blank = async () => {
    setError(null);
    const r = await m.createBlank('New report', BLANK);
    if (r) onCreated(r);
  };

  if (!canCreate) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <b>Read-only.</b> You can view published reports, but you do not hold
        <span className="font-mono"> reports:create</span>, so you cannot start a new one.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((t) => (
          <button
            key={t.template_key}
            onClick={() => start(t.template_key)}
            disabled={m.busy}
            className="text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{t.display_name}</h3>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                {t.category}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600 min-h-[32px]">{t.description}</p>
            <div className="mt-3 flex h-8 gap-1" aria-hidden="true">
              <div className="flex-1 rounded bg-blue-100 h-3" />
              <div className="flex-1 rounded bg-gray-100" />
              <div className="flex-1 rounded bg-gray-100" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-gray-400">{t.template_key} v{t.version}</span>
              {t.required_entitlements
                .filter((e) => e !== 'report_studio')
                .map((e) => (
                  <span key={e} className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                    {e}
                  </span>
                ))}
            </div>
          </button>
        ))}

        <button
          onClick={blank}
          disabled={m.busy}
          className="text-left rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <h3 className="text-sm font-semibold text-gray-700">+ Blank report</h3>
          <p className="mt-1 text-xs text-gray-500 min-h-[32px]">
            Start from an empty definition. You own and can edit everything.
          </p>
        </button>
      </div>

      {m.busy && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <LoadingSpinner /> Creating reportâ€¦
        </div>
      )}
      {error && <ErrorState message={error} />}
      {!m.error && error && <p className="mt-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}
