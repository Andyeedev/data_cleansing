/**
 * OC-REPORT-001 â€” DataSourcePicker (Option B, step 2 SOURCE).
 *
 * The list comes from /catalog, which is already filtered SERVER-SIDE to the
 * sources the caller may read, so a source the tenant is not entitled to is not
 * rendered at all. This is why there is no "show all sources" toggle: doing so
 * would require listing something the backend deliberately withheld.
 *
 * Selecting a source REPLACES the definition's sections, because a V1 definition
 * is single-source. That is called out in the UI rather than done silently.
 */
import type { DataSourceSpec } from '../../types/reportStudio';

interface Props {
  sources: DataSourceSpec[];
  selected: string | null;
  onSelect: (key: string) => void;
  disabled?: boolean;
}

export function DataSourcePicker({ sources, selected, onSelect, disabled }: Props) {
  // group by scope family so the grain difference between sources is obvious
  const groups = sources.reduce<Record<string, DataSourceSpec[]>>((acc, s) => {
    (acc[s.scope_family] ||= []).push(s);
    return acc;
  }, {});

  if (sources.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        No data sources are available to this tenant. The list is produced by
        /catalog and is already permission- and entitlement-filtered, so an empty
        list means nothing is available rather than that nothing loaded.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(groups).map(([family, list]) => (
        <div key={family}>
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {family.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-gray-400">scope</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {list.map((s) => {
              const active = s.data_source_key === selected;
              const extra = (s.required_entitlements || '')
                .split(',')
                .map((e) => e.trim())
                .filter((e) => e && e !== 'report_studio');
              return (
                <button
                  key={s.data_source_key}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(s.data_source_key)}
                  aria-pressed={active}
                  className={`rounded-lg border p-3 text-left transition disabled:opacity-60 ${
                    active
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900">{s.display_name}</span>
                    <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600">
                      {s.grain}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-gray-500">{s.data_source_key}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-600">
                      {s.fields?.fields?.length ?? 0} fields
                    </span>
                    {extra.map((e) => (
                      <span key={e} className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                        {e}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[10px] text-gray-400">
        A V1 report reads from exactly one data source. Changing the source
        replaces the sections below.
      </p>
    </div>
  );
}

export default DataSourcePicker;
