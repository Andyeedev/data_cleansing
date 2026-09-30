/**
 * OC-REPORT-001 â€” SectionEditor (Option B, steps 3-5 SHAPE / VISUALISE / REFINE).
 *
 * One typed report section. The field pickers are built ONLY from the fields the
 * selected DataSource declares, grouped by role, so the editor physically cannot
 * offer an undeclared field. The aggregation list is additionally narrowed to
 * the `aggregations` the field itself declares.
 *
 * This is still not the security boundary: the server validator re-checks every
 * one of these values on preview and on save.
 */
import type {
  DataSourceSpec, ReportSection, ReportField, SectionType, Aggregation,
} from '../../types/reportStudio';
import {
  AGGREGATIONS, SECTION_TYPES, NEEDS_AXIS_TYPES,
} from '../../types/reportStudio';

const AGGS: Aggregation[] = AGGREGATIONS;
const TYPES: SectionType[] = SECTION_TYPES;

const TYPE_LABEL: Record<SectionType, string> = {
  kpi: 'KPI tile',
  table: 'Table',
  bar: 'Bar',
  line: 'Line',
  donut: 'Donut',
  scorebar: 'Score bar',
  barlist: 'Bar list',
};

const selectCls =
  'h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs';

function byRole(fields: ReportField[], role: ReportField['role']) {
  return fields.filter((f) => f.role === role);
}

interface Props {
  section: ReportSection;
  source: DataSourceSpec | undefined;
  index: number;
  total: number;
  onChange: (next: ReportSection) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  disabled?: boolean;
}

export function SectionEditor({
  section, source, index, total, onChange, onRemove, onMove, disabled,
}: Props) {
  const fields = source?.fields?.fields ?? [];
  const measures = byRole(fields, 'measure');
  const dimensions = byRole(fields, 'dimension');
  const timeFields = byRole(fields, 'time');

  const bindings = section.bindings ?? {};
  const needsAxis = NEEDS_AXIS_TYPES.includes(section.type);

  const setBinding = (patch: Partial<ReportSection['bindings']>) =>
    onChange({ ...section, bindings: { ...bindings, ...patch } });

  const measure = measures.find((m) => m.name === bindings.measure);
  // only offer aggregations the field declares; `count` is always legal
  const aggChoices: string[] = measure
    ? (measure.aggregations?.length ? measure.aggregations : ['sum', 'count'])
    : ['count'];

  const currentAgg = bindings.aggregation;
  const aggInvalid = !!currentAgg && !aggChoices.includes(currentAgg);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
        <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {index + 1}
        </span>
        <input
          value={section.title ?? ''}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="Section title (optional)"
          disabled={disabled}
          aria-label={`Section ${index + 1} title`}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
        />
        <span className="font-mono text-[10px] text-gray-400">{section.id}</span>
        <div className="flex items-center">
          <button
            type="button" onClick={() => onMove(-1)} disabled={disabled || index === 0}
            aria-label={`Move section ${index + 1} up`}
            className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            &uarr;
          </button>
          <button
            type="button" onClick={() => onMove(1)} disabled={disabled || index === total - 1}
            aria-label={`Move section ${index + 1} down`}
            className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            &darr;
          </button>
          <button
            type="button" onClick={onRemove} disabled={disabled}
            aria-label={`Remove section ${index + 1}`}
            className="rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Component
          </span>
          <select
            value={section.type}
            disabled={disabled}
            aria-label={`Section ${index + 1} component type`}
            onChange={(e) => onChange({ ...section, type: e.target.value as SectionType })}
            className={selectCls}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABEL[t]}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Measure
          </span>
          <select
            value={bindings.measure ?? ''}
            disabled={disabled}
            aria-label={`Section ${index + 1} measure`}
            onChange={(e) => {
              const next = e.target.value || undefined;
              const agg = next
                ? (measures.find((m) => m.name === next)?.aggregations ?? []).includes(bindings.aggregation ?? '')
                  ? bindings.aggregation
                  : 'sum'
                : undefined;
              setBinding({ measure: next, aggregation: next ? agg : undefined });
            }}
            className={selectCls}
          >
            <option value="">(none)</option>
            {measures.map((m) => (
              <option key={m.name} value={m.name}>{m.label ?? m.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Aggregation
          </span>
          <select
            value={bindings.aggregation ?? ''}
            disabled={disabled}
            aria-label={`Section ${index + 1} aggregation`}
            onChange={(e) => setBinding({
              aggregation: (e.target.value || undefined) as Aggregation | undefined,
            })}
            className={`${selectCls} ${aggInvalid ? 'border-red-400' : ''}`}
          >
            <option value="">(none)</option>
            {AGGS.filter((a) => aggChoices.includes(a)).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            {aggInvalid && currentAgg && (
              <option value={currentAgg}>{currentAgg} (not allowed on this field)</option>
            )}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            {needsAxis ? 'Dimension' : 'Group by'}
            {needsAxis && (
              <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] normal-case text-amber-800">
                required
              </span>
            )}
          </span>
          <select
            value={(bindings.dimensions ?? [])[0] ?? ''}
            disabled={disabled}
            aria-label={`Section ${index + 1} dimension`}
            onChange={(e) => setBinding({
              dimensions: e.target.value ? [e.target.value] : undefined,
            })}
            className={`${selectCls} ${needsAxis && !(bindings.dimensions ?? []).length ? 'border-amber-400' : ''}`}
          >
            <option value="">{needsAxis ? '(choose a dimension)' : '(none)'}</option>
            {dimensions.map((d) => (
              <option key={d.name} value={d.name}>{d.label ?? d.name}</option>
            ))}
          </select>
        </label>

        {timeFields.length > 0 && (
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Time axis
            </span>
            <select
              value={bindings.time_axis ?? ''}
              disabled={disabled}
              aria-label={`Section ${index + 1} time axis`}
              onChange={(e) => setBinding({ time_axis: e.target.value || undefined })}
              className={selectCls}
            >
              <option value="">(none)</option>
              {timeFields.map((f) => (
                <option key={f.name} value={f.name}>{f.label ?? f.name}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Sort direction
          </span>
          <select
            value={section.sort?.dir ?? ''}
            disabled={disabled}
            aria-label={`Section ${index + 1} sort direction`}
            onChange={(e) => onChange({
              ...section,
              sort: e.target.value
                ? { field: section.sort?.field, dir: e.target.value as 'asc' | 'desc' }
                : undefined,
            })}
            className={selectCls}
          >
            <option value="">(none)</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {!source && (
        <p className="border-t border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          Choose a data source above before configuring this section.
        </p>
      )}
      {source && fields.length === 0 && (
        <p className="border-t border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          <span className="font-mono">{source.data_source_key}</span> declares no
          fields, so no measure can be bound.
        </p>
      )}
    </div>
  );
}

export default SectionEditor;
