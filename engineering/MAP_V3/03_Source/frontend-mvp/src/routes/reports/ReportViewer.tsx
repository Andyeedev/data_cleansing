/**
 * OC-REPORT-001 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ReportViewer.
 *
 * Renders a saved report's CURRENT data plus lifecycle controls, version
 * history, sharing and export. Every action is capability-gated in the UI AND
 * independently re-checked by the API; the UI gate is affordance, not security.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useReportAccess,
  useReportDefinition,
  useReportMutations,
  useReportQuery,
  useReportVersions,
  useReportCatalog,
  useStudioTenantId,
  useTemplateUpdate,
} from '../../hooks/useReportStudio';
import { ReportComponentView } from '../../components/reports/ReportComponentView';
import { TemplateUpdateBanner } from '../../components/reports/TemplateUpdateBanner';
import { ExportControl } from '../../components/reports/ExportControl';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorState } from '../../components/shared/ErrorState';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import type { ReportStatus } from '../../types/reportStudio';

export function ReportViewer() {
  const { reportId } = useParams<{ reportId: string }>();
  const nav = useNavigate();
  const tenantId = useStudioTenantId();

  const catalog = useReportCatalog(tenantId);
  const def = useReportDefinition(reportId, tenantId);
  const versions = useReportVersions(reportId, tenantId);
  const access = useReportAccess(reportId, tenantId);
  const m = useReportMutations(tenantId);
  const tplUpdate = useTemplateUpdate(reportId, tenantId);

  const [viewVersion, setViewVersion] = useState<number | undefined>(undefined);
  const [tab, setTab] = useState<'data' | 'versions' | 'access'>('data');
  const [grantee, setGrantee] = useState('');
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [dupNote, setDupNote] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const read = useReportQuery(reportId, tenantId, viewVersion);

  const canExport = catalog.can('reports:export');
  const canShare = catalog.can('reports:share');
  const canUpdate = catalog.can('reports:update');
  const canCreate = catalog.can('reports:create');
  const isOwner = !!read.data?.report.is_owner;

  // Template provenance drives the update banner. Only a report derived from a
  // template is eligible, and the check is a plain read - it never applies
  // anything. Adoption is a separate, explicit action inside the banner.
  const templateKey = def.report?.derived_from_template_key;
  useEffect(() => {
    if (templateKey) void tplUpdate.check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey, reportId, tenantId]);

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

  const report = read.data?.report;
  const meta = read.data?.meta;

  const changeStatus = async (status: ReportStatus) => {
    const r = await m.setStatus(reportId!, status);
    if (r) def.refetch();
  };

  return (
    <PageContainer>
    <div className="space-y-5">
      {/* header ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the MAP Nexus page-header panel shared with Dashboard,
          Validation Centre and Migration Overview. */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/reports/studio" className="hover:text-blue-700">Report Studio</Link>
            <span>&rsaquo;</span>
            <span className="font-mono">{reportId?.slice(0, 8)}</span>
          </div>
          <h1 className="mt-0.5 text-2xl font-bold text-gray-900">
            {report?.title ?? def.report?.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{report?.description ?? def.report?.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-600">
              {report?.status ?? def.report?.status}
            </span>
            {read.data?.version && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5">
                v{read.data.version.version_no}
              </span>
            )}
            {report?.derived_from_template_key && (
              <span className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700">
                from {report.derived_from_template_key} v{report.derived_from_template_version}
              </span>
            )}
            {report?.origin === 'assistant' && (
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                assistant &middot; {def.report?.origin_recipe_key}
              </span>
            )}
            {report?.template_state && report.derived_from_template_key && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">
                {report.template_state}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(isOwner || canShare) && (
            <Link
              to={`/reports/studio/${reportId}/edit`}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
          )}
          {canCreate && reportId && (
            <button
              onClick={async () => {
                const r = await m.duplicate(reportId);
                if (r) setDupNote(`Created "${r.title}".`);
              }}
              disabled={m.busy}
              title="Create a new editable report from this definition. Requires reports:create."
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Duplicate
            </button>
          )}
          {reportId && (
            <ExportControl
              reportId={reportId}
              canExport={canExport}
              tenantId={tenantId}
              version={viewVersion}
            />
          )}
          {isOwner && report?.status === 'draft' && (
            <button
              onClick={() => changeStatus('published')}
              disabled={m.busy}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Publish
            </button>
          )}
          {isOwner && report?.status === 'published' && (
            <button
              onClick={() => changeStatus('archived')}
              disabled={m.busy}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              Archive
            </button>
          )}
          {/* Delete lives with the other lifecycle actions, not buried at the
              bottom of the Access tab where it read as part of sharing. It is
              the single user-facing delete: it soft-deletes, and the retention
              job performs the permanent delete after the window. */}
          {isOwner && (
            <button
              onClick={() => setConfirmingDelete(true)}
              disabled={m.busy}
              className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {m.error && <ErrorState message={m.error} />}
      {dupNote && (
        <p role="status" className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          {dupNote} Find it under <Link to="/reports/studio" className="underline">Report Studio</Link>.
        </p>
      )}

      {/* Template update offer ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â pinned reports only, never applied automatically. */}
      {templateKey && (
        <TemplateUpdateBanner
          info={tplUpdate.info}
          loading={tplUpdate.loading}
          error={tplUpdate.error}
          adopting={tplUpdate.adopting}
          adoptedMessage={tplUpdate.adopted}
          canUpdate={canUpdate}
          onAdopt={async () => {
            const r = await tplUpdate.adopt();
            if (r) { def.refetch(); versions.refetch(); }
          }}
        />
      )}

      {/* tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([['data', 'Data'], ['versions', `Versions (${versions.items.length})`],
           ['access', `Sharing (${access.items.length})`]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 ${
              tab === k ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'data' && (
        <div className="space-y-4">
          {read.loading && <LoadingSpinner />}

          {read.error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-sm font-semibold text-amber-900">Access denied</h2>
              <p className="mt-1 text-sm text-amber-800">{read.error}</p>
              <p className="mt-2 text-xs text-amber-700">
                This is enforced by the API, not just hidden in the interface.
              </p>
            </div>
          )}

          {meta && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[11px] text-gray-600">
              <span>source <b className="font-mono">{meta.data_source_key}</b></span>
              <span>scope <b className="font-mono">{meta.scope_family}</b></span>
              <span>rows <b>{meta.row_count?.toLocaleString()}</b></span>
              <span>cap <b>{meta.max_rows}</b></span>
              {meta.truncated ? (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">
                  TRUNCATED ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â results are incomplete
                </span>
              ) : (
                <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-800">
                  complete
                </span>
              )}
              {viewVersion && (
                <button
                  onClick={() => setViewVersion(undefined)}
                  className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-700"
                >
                  viewing v{viewVersion} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â back to current
                </button>
              )}
            </div>
          )}

          {read.data?.components.map((c) => (
            <ReportComponentView key={c.id} component={c} />
          ))}
        </div>
      )}

      {tab === 'versions' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Definitions are immutable. Saving an edit creates a new version; earlier
            versions stay reproducible.
          </p>
          {versions.items.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5"
            >
              <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold">
                v{v.version_no}
              </span>
              <span className="text-xs text-gray-500">
                {String(v.created_at).slice(0, 19).replace('T', ' ')}
              </span>
              <div className="flex-1" />
              <button
                onClick={() => { setViewVersion(v.version_no); setTab('data'); }}
                className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                View this version
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'access' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[11px] text-blue-800">
            <b>Sharing grants visibility, never capability.</b> A recipient must
            independently hold the data source permission and entitlement. They can
            view without being able to export, and losing the permission stops the
            access immediately.
          </div>

          {canShare ? (
            <div className="flex gap-2">
              <input
                value={grantee}
                onChange={(e) => setGrantee(e.target.value)}
                placeholder="User id (UUID)"
                className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm font-mono"
              />
              <button
                onClick={async () => {
                  if (!grantee.trim()) return;
                  const r = await m.share(reportId!, grantee.trim());
                  if (r) {
                    setShareNote(
                      `Shared. Recipient ${r.grantee_can_export ? 'CAN' : 'CANNOT'} export.`,
                    );
                    setGrantee('');
                    access.refetch();
                  }
                }}
                disabled={m.busy || !grantee.trim()}
                className="h-9 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white disabled:opacity-50"
              >
                Share
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              You do not hold <span className="font-mono">reports:share</span>.
            </p>
          )}
          {shareNote && <p className="text-xs text-green-700">{shareNote}</p>}

          <div className="space-y-1.5">
            {access.items.map((a) => (
              <div
                key={a.user_id}
                className="flex items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2 text-xs"
              >
                <span className="font-mono text-gray-700">{a.email}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5">{a.access_level}</span>
                <div className="flex-1" />
                {canShare && (
                  <button
                    onClick={async () => {
                      const r = await m.revoke(reportId!, a.user_id);
                      if (r) access.refetch();
                    }}
                    className="text-red-600 hover:underline"
                  >
                    revoke
                  </button>
                )}

      </div>
            ))}
            {access.items.length === 0 && (
              <p className="text-xs text-gray-400">Not shared with anyone.</p>
            )}
          </div>
        </div>
      )}

      {/* Single delete, confirmed. Soft-deletes now; the retention job makes it
          permanent after the window. The message states the retention period
          rather than implying the row is already gone. */}
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this report?"
        message={
          `"${report?.title ?? def.report?.title ?? 'This report'}" will be removed from Saved Reports for everyone it is shared with. `
          + 'It is kept in the database for a short recovery period and then permanently deleted.'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={async () => {
          setConfirmingDelete(false);
          const r = await m.setStatus(reportId!, 'deleted');
          if (r) nav('/reports/studio');
        }}
      />
    </div>
    </PageContainer>
  );
}

export default ReportViewer;
