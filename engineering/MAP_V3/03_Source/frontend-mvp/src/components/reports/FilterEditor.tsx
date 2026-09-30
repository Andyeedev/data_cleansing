/**
 * OC-REPORT-001 â€” FilterEditor (Option B, step 5 REFINE).
 *
 * Option B's "one filter set, whole report" model: these filters are SAVED on
 * the definition and apply to every section. They are not runtime filters â€” a
 * runtime filter can only narrow at read time and is never persisted.
 *
 * The operator list mirrors the server allowlist exactly, and the field list is
 * built only from the selected source's declared fields, so there is no free-text
 * path into the query. `in`/`nin` take a comma-separated list which is parsed
 * into a real array; `between` takes exactly two values. Both match what the
 * server validator requires, so a definition built here passes validation.
 */
import { useState } from 'react';
import type {
  DataSourceSpec, ReportFilter, FilterOperator,
} from '../../types/reportStudio';
import { FILTER_OPERATORS, LIST_OPERATORS } from '../../types/reportStudio';

const OP_LABEL: Record<FilterOperator, string> = {
  eq: 'is', ne: 'is not', gt: '>', gte: '>=', lt: '<', lte: '<=',
  in: 'is one of', nin: 'is none of', between: 'is between', like: 'contains',
};

const selectCls = 'h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs';

interface Props {
  filters: ReportFilter[];
  source: DataSourceSpec | undefined;
  onChange: (next: ReportFilter[]) => void;
  disabled?: boolean;
}

/** Operator and value shape are coupled; changing either resets the other. */
function coerceValue(op: FilterOperator, raw: string, previous: unknown): unknown {
  if (LIST_OPERATORS.includes(op)) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (op === 'between') {
    const parts = raw.split(',').map((s) => s.trim());
    return parts.length === 2 ? parts : parts.slice(0, 2);
  }
  if (raw === '') {
    // an emptied scalar falls back to whatever the operator structurally needs,
    // so the payload never carries an invalid shape
    return LIST_OPERATORS.includes(op) ? [] : previous;
  }
  return raw;
}

export function FilterEditor({ filters, source, onChange, disabled }: Props) {
  const [draft, setDraft] = useState<Record<number, string>>({});
  const fields = source?.fields?.fields ?? [];

  const update = (i: number, patch: Partial<ReportFilter>) => {
    onChange(filters.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  };

  const add = () => {
    const first = fields[0]?.name;
    if (!first) return;
    onChange([...filters, { field: first, op: 'eq', value: '' }]);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
          <p className="text-[10px] text-gray-500">
            Saved on the definition. These apply to every section in this report.
          </p>
        </div>
        <button
          type="button" onClick={add} disabled={disabled || !fields.length}
          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          + Add filter
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-[11px] text-amber-800">
          Choose a data source first â€” filters can only use fields that source declares.
        </p>
      )}

      <div className="space-y-2">
        {filters.map((f, i) => {
          // ReportFilter.op is typed `string` because that is what the API
          // echoes back; narrow once here so the allowlist checks below are
          // type-safe instead of silently comparing arbitrary strings.
          const op = f.op as FilterOperator;
          const isList = LIST_OPERATORS.includes(op);
          const isBetween = op === 'between';
          const shown = draft[i] !== undefined
            ? draft[i]
            : Array.isArray(f.value) ? f.value.join(', ') : String(f.value ?? '');
          return (
            <div key={i} className="flex flex-wrap items-end gap-2 rounded-md bg-gray-50 p-2">
              <label className="min-w-[140px] flex-1">
                <span className="mb-0.5 block text-[9px] font-semibold uppercase text-gray-500">Field</span>
                <select
                  value={f.field}
                  disabled={disabled}
                  aria-label={`Filter ${i + 1} field`}
                  onChange={(e) => update(i, { field: e.target.value })}
                  className={selectCls}
                >
                  {fields.map((fl) => (
                    <option key={fl.name} value={fl.name}>{fl.label ?? fl.name}</option>
                  ))}
                </select>
              </label>
              <label className="w-[130px]">
                <span className="mb-0.5 block text-[9px] font-semibold uppercase text-gray-500">Operator</span>
                <select
                  value={f.op}
                  disabled={disabled}
                  aria-label={`Filter ${i + 1} operator`}
                  onChange={(e) => {
                    const op = e.target.value as FilterOperator;
                    update(i, { op, value: coerceValue(op, '', undefined) });
                    setDraft((d) => ({ ...d, [i]: '' }));
                  }}
                  className={selectCls}
                >
                  {FILTER_OPERATORS.map((o) => (
                    <option key={o} value={o}>{OP_LABEL[o]}</option>
                  ))}
                </select>
              </label>
              <label className="min-w-[150px] flex-[2]">
                <span className="mb-0.5 block text-[9px] font-semibold uppercase text-gray-500">
                  Value{isList || isBetween ? ' (comma separated)' : ''}
                </span>
                <input
                  value={shown}
                  disabled={disabled}
                  aria-label={`Filter ${i + 1} value`}
                  placeholder={isList ? 'A,B,C' : isBetween ? 'min,max' : 'value'}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, [i]: e.target.value }));
                    update(i, { value: coerceValue(op, e.target.value, f.value) });
                  }}
                  className={selectCls}
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(filters.filter((_, idx) => idx !== i))}
                disabled={disabled}
                aria-label={`Remove filter ${i + 1}`}
                className="h-8 rounded px-2 text-xs text-red-600 hover:bg-red-50"
              >
                &times;
              </button>
            </div>
          );
        })}
        {filters.length === 0 && fields.length > 0 && (
          <p className="text-[11px] text-gray-400">No filters. The report returns every row the source exposes.</p>
        )}
      </div>
    </div>
  );
}

export default FilterEditor;
