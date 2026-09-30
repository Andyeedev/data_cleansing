/**
 * OC-REPORT-001 â€” ReportEditorPage (Option B "Dashboard Studio", Phase 2).
 *
 * The authoring surface. A report is a vertical stack of typed sections, order
 * is the only layout decision, and there is no canvas, no grid, no dragging and
 * no free text anywhere a field or operator could be smuggled in. This is
 * deliberate: the least-flexible option was chosen partly because it cannot grow
 * a query language.
 *
 * Flow follows the plan's 7 steps, collapsed onto one screen because Option B
 * is explicitly the "everything visible, all decisions reversible" variant:
 *
 *   START -> SOURCE -> SHAPE/VISUALISE -> REFINE -> PREVIEW -> SAVE & GOVERN
 *
 * Two rules govern this page:
 *
 *  1. VALIDATION IS THE SERVER'S. The editor calls POST /validate and shows
 *     exactly what the single validator returned. It never re-implements the
 *     rules in TypeScript, so the UI cannot green-light something the API would
 *     reject.
 *  2. PREVIEW DOES NOT PERSIST. The unsaved candidate is executed by the same
 *     four-layer authorisation and the same aggregation engine as a real read,
 *     and creates no version. Saving is always an explicit action.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useReportCatalog,
  useReportDefinition,
  useReportMutations,
  useDefinitionValidator,
  useReportPreview,
  useStudioTenantId,
} from '../../hooks/useReportStudio';
import { DataSourcePicker } from '../../components/reports/DataSourcePicker';
import { SectionEditor } from '../../components/reports/SectionEditor';
import { FilterEditor } from '../../components/reports/FilterEditor';
import { ReportComponentView } from '../../components/reports/ReportComponentView';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorState } from '../../components/shared/ErrorState';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import type {
  ReportDefinitionBody, ReportSection, DataSourceSpec, ReportStatus,
} from '../../types/reportStudio';
import { MAX_SECTIONS, MAX_FILTERS, HARD_MAX_ROWS } from '../../types/reportStudio';

let seq = 0;
function newSectionId(): string {
  seq += 1;
  return `s${Date.now().toString(36)}${seq}`;
}

const defaultSection = (): ReportSection => ({
  id: newSectionId(),
  type: 'kpi',
  title: '',
  bindings: {},
});

function emptyDefinition(key: string): ReportDefinitionBody {
  return {
    schema_version: 1,
    data_source_key: key,
    sections: [defaultSection()],
    filters: [],
    max_rows: 200,
  };
}

export function ReportEditorPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const nav = useNavigate();
  const tenantId = useStudioTenantId();

  const catalog = useReportCatalog(tenantId);
  const def = useReportDefinition(reportId, tenantId);
  const m = useReportMutations(tenantId);
  const validator = useDefinitionValidator(tenantId);
  const preview = useReportPreview(reportId, tenantId);

  const [draft, setDraft] = useState<ReportDefinitionBody | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState(false);

  // load the current version into the draft exactly once per report.
  // `def.definition` is the version ROW; the definition body is nested inside it.
  useEffect(() => {
    if (!def.definition || draft) return;
    setDraft({ ...def.definition.definition });
    setTitle(def.report?.title ?? '');
    setDescription(def.report?.description ?? '');
  }, [def.definition, def.report, draft]);

  const sources = useMemo(
    () => (catalog.data?.data_sources ?? []) as DataSourceSpec[],
    [catalog.data],
  );
  const source = useMemo(
    () => sources.find((s) => s.data_source_key === draft?.data_source_key),
    [sources, draft?.data_source_key],
  );

  const canUpdate = catalog.can('reports:update');
  const isOwner = def.report?.is_owner === true;

  // ---- draft mutation ---------------------------------------------------
  const edit = useCallback((fn: (d: ReportDefinitionBody) => ReportDefinitionBody) => {
    setDraft((prev) => (prev ? fn(prev) : prev));
    setDirty(true);
    setSaved(null);
    setPreviewed(false);
  }, []);

  const setSection = (i: number, next: ReportSection) =>
    edit((d) => ({ ...d, sections: d.sections.map((s, idx) => (idx === i ? next : s)) }));

  const moveSection = (i: number, dir: -1 | 1) =>
    edit((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.sections.length) return d;
      const sections = [...d.sections];
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...d, sections };
    });

  // switching source rebuilds the definition: V1 definitions are single-source
  const chooseSource = (key: string) => {
    if (key === draft?.data_source_key) return;
    setDraft(emptyDefinition(key));
    setDirty(true);
    setSaved(null);
    setPreviewed(false);
    validator.reset();
    preview.clear();
  };

  // ---- server-side actions ---------------------------------------------
  const runValidate = async () => {
    if (!draft) return null;
    const res = await validator.validate(draft);
    return res;
  };

  const runPreview = async () => {
    if (!draft) return;
    // validate first: previewing something unsaveable would waste a round trip
    // and could mislead the user into thinking the data is the problem
    const v = await validator.validate(draft);
    if (v && !v.valid) return;
    const res = await preview.run(draft);
    if (res) setPreviewed(true);
  };

  const save = async (status?: ReportStatus) => {
    if (!draft || !reportId) return;
    const v = await validator.validate(draft);
    if (v && !v.valid) return;
    const r = await m.saveDefinition(reportId, draft);
    if (r) {
      setDirty(false);
      setSaved(`Saved as version ${r.version_no ?? ''}`.trim());
      def.refetch();
      if (status) await m.setStatus(reportId, status);
    }
  };

  if (def.loading) return <LoadingSpinner />;
  if (def.error) {
    return (
      <div className="p-6">
        <ErrorState message={def.error} onRetry={def.refetch} />
        <Link to="/reports/studio" className="mt-3 inline-block text-xs text-blue-700 underline">
          back to Report Studio
        </Link>
      </div>
    );
  }

  if (!catalog.hasEntitlement) {
    return (
      <div className="p-6">
        <ErrorState message="Report Studio requires the report_studio entitlement." />
      </div>
    );
  }

  if (!draft) return <LoadingSpinner />;

  // A non-owner may read but not author. The API enforces this independently;
  // showing the editor as read-only explains it rather than silently blocking.
  const readOnly = !canUpdate || !isOwner;

  const errors = validator.result?.errors ?? [];
  const canPreview = !!draft.data_source_key && draft.sections.length > 0;

  return (
    <PageContainer>
    <div className="space-y-5">
      {/* header — the MAP Nexus page-header panel shared with Dashboard,
          Validation Centre and Migration Overview. */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/reports/studio" className="hover:text-blue-700">Report Studio</Link>
            <span>&rsaquo;</span>
            <span>Editor</span>
          </div>
          <h1 className="mt-0.5 text-2xl font-bold text-gray-900">
            {title || 'Untitled report'}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-600">
              {def.report?.status}
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5">
              v{def.definition?.version_no}
            </span>
            {dirty && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">
                unsaved changes
              </span>
            )}
            {saved && !dirty && (
              <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-800">
                {saved}
              </span>
            )}
            {def.report?.derived_from_template_key && (
              <span className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700">
                from {def.report.derived_from_template_key}
                {def.report.template_state === 'diverged' && ' (diverged)'}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/reports/studio/${reportId}/view`}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            View as reader
          </Link>
          {def.report?.status === 'draft' && (
            <button
              onClick={() => save('published')} disabled={readOnly || m.busy || dirty}
              title={dirty ? 'Save first' : 'Publish this report'}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save &amp; publish
            </button>
          )}
          <button
            onClick={() => save()}
            disabled={readOnly || m.busy}
            className="rounded bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Save new version
          </button>
        </div>
      </div>

      {readOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <b>Read-only.</b>{' '}
          {!isOwner
            ? 'This report belongs to another user, so you cannot edit it.'
            : 'You do not hold reports:update.'}{' '}
          Editing is also refused by the API, not only hidden here.
        </div>
      )}
      {m.error && <ErrorState message={m.error} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ---------------- left: authoring ---------------- */}
        <div className="space-y-5">
          {/* identity */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">Report</h3>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">Title</span>
              <input
                value={title}
                disabled={readOnly}
                maxLength={200}
                onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
                className="h-8 w-full rounded-md border border-gray-300 px-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">Description</span>
              <input
                value={description}
                disabled={readOnly}
                onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
                className="h-8 w-full rounded-md border border-gray-300 px-2 text-sm"
              />
            </label>
          </div>

          {/* step 2 â€” source */}
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h3 className="text-sm font-semibold text-gray-800">Data source</h3>
            <p className="mb-2 text-[10px] text-gray-500">
              This is the security boundary. The list below is already restricted
              server-side to what you are allowed to read.
            </p>
            <DataSourcePicker
              sources={sources}
              selected={draft.data_source_key}
              onSelect={chooseSource}
              disabled={readOnly}
            />
          </div>

          {/* steps 3-5 â€” sections */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Sections</h3>
                <p className="text-[10px] text-gray-500">
                  Order is the only layout decision. {draft.sections.length} of {MAX_SECTIONS}.
                </p>
              </div>
              <button
                type="button"
                disabled={readOnly || draft.sections.length >= MAX_SECTIONS || !draft.data_source_key}
                onClick={() => edit((d) => ({ ...d, sections: [...d.sections, defaultSection()] }))}
                className="rounded border border-gray-300 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                + Add section
              </button>
            </div>
            {draft.sections.map((s, i) => (
              <SectionEditor
                key={s.id}
                section={s}
                source={source}
                index={i}
                total={draft.sections.length}
                disabled={readOnly}
                onChange={(next) => setSection(i, next)}
                onRemove={() => edit((d) => ({
                  ...d,
                  sections: d.sections.filter((_, idx) => idx !== i),
                }))}
                onMove={(dir) => moveSection(i, dir)}
              />
            ))}
            {draft.sections.length === 1 && (
              <p className="text-[10px] text-gray-400">
                A report needs at least one section â€” the server validator rejects an empty list.
              </p>
            )}
          </div>

          {/* step 5 â€” filters */}
          <FilterEditor
            filters={draft.filters ?? []}
            source={source}
            disabled={readOnly || draft.filters!.length >= MAX_FILTERS}
            onChange={(next) => edit((d) => ({ ...d, filters: next }))}
          />

          {/* row cap */}
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h3 className="text-sm font-semibold text-gray-800">Row cap</h3>
            <p className="mb-2 text-[10px] text-gray-500">
              Maximum rows returned per section. 1&ndash;{HARD_MAX_ROWS}. The result is
              always labelled when it is truncated.
            </p>
            <input
              type="number"
              min={1}
              max={HARD_MAX_ROWS}
              disabled={readOnly}
              value={draft.max_rows ?? 200}
              onChange={(e) => edit((d) => ({ ...d, max_rows: Number(e.target.value) }))}
              className="h-8 w-28 rounded-md border border-gray-300 px-2 text-sm"
            />
          </div>
        </div>

        {/* ---------------- right: validate + preview ---------------- */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={runValidate}
                disabled={!canPreview || validator.checking}
                className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {validator.checking ? 'Checkingâ€¦' : 'Validate'}
              </button>
              <button
                onClick={runPreview}
                disabled={!canPreview || preview.loading || readOnly}
                className="rounded bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {preview.loading ? 'Runningâ€¦' : 'Preview'}
              </button>
            </div>

            {validator.result?.valid && (
              <p className="mt-2 rounded bg-green-50 px-2 py-1.5 text-[11px] text-green-800">
                Valid &mdash; {validator.result.section_count} section(s),
                {' '}{validator.result.filter_count} filter(s).
              </p>
            )}
            {errors.length > 0 && (
              <div className="mt-2 rounded bg-red-50 px-2 py-1.5">
                <p className="text-[11px] font-semibold text-red-800">
                  The server validator rejected this definition:
                </p>
                <ul className="mt-1 space-y-0.5">
                  {errors.map((e, i) => (
                    <li key={i} className="font-mono text-[10px] text-red-700">&bull; {e}</li>
                  ))}
                </ul>
              </div>
            )}
            {validator.error && <p className="mt-2 text-[11px] text-red-700">{validator.error}</p>}
          </div>

          {previewed && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              <b>Unsaved preview.</b> This is your draft definition run through the
              real read path. Nothing is stored, and readers still see version{' '}
              {def.definition?.version_no}.
            </div>
          )}

          {preview.error && <ErrorState message={preview.error} />}

          {preview.loading && <LoadingSpinner />}

          {preview.data && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[10px] text-gray-600">
                <span>source <b className="font-mono">{preview.data.meta.data_source_key}</b></span>
                <span>scope <b className="font-mono">{preview.data.meta.scope_family}</b></span>
                <span>rows <b>{preview.data.meta.row_count}</b></span>
                {preview.data.meta.truncated
                  ? <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">TRUNCATED</span>
                  : <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-800">complete</span>}
              </div>
              {preview.data.components.map((c) => (
                <ReportComponentView key={c.id} component={c} />
              ))}
            </div>
          )}

          {!preview.data && !preview.loading && !preview.error && (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-[11px] text-gray-400">
              Press <b>Preview</b> to run this draft against live data. The preview
              is authorised and tenant-scoped exactly like a reader&apos;s view.
            </p>
          )}

          <button
            onClick={() => nav(`/reports/studio/${reportId}/view`)}
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
    </PageContainer>
  );
}

export default ReportEditorPage;
