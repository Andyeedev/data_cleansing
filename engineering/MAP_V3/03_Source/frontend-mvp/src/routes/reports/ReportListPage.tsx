/**
 * OC-REPORT-001 â€” Report Studio landing page.
 *
 * Shows the saved-report catalogue plus the template gallery and the assistant.
 * Navigation and every action here are driven by /catalog, which is filtered
 * SERVER-SIDE by entitlement and permission, so this page cannot present a
 * capability the caller does not have.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReportCatalog, useReportList, useStudioTenantId } from '../../hooks/useReportStudio';
import { useTenantScope } from '../../tenant/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { TemplateGallery } from '../../components/reports/TemplateGallery';
import { TenantScopeSelect } from '../../components/reports/TenantScopeSelect';
import { ReportAssistantPanel } from '../../components/reports/ReportAssistantPanel';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorState } from '../../components/shared/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import type { ReportRecord, ReportStatus } from '../../types/reportStudio';

const STATUS_TONE: Record<ReportStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-amber-100 text-amber-800',
  deleted: 'bg-red-100 text-red-800',
};

export function ReportListPage() {
  const nav = useNavigate();
  const { scopeTenantId, isSuperAdmin } = useTenantScope();
  const { user } = useAuth();
  const tenantId = useStudioTenantId();

  const catalog = useReportCatalog(tenantId);
  const [listScope, setListScope] = useState<'all' | 'mine' | 'shared'>('all');
  const list = useReportList(tenantId, listScope);
  const [tab, setTab] = useState<'reports' | 'create'>('reports');

  if (catalog.loading) return <LoadingSpinner />;

  // Entitlement is the gate for the whole Studio. 403 is rendered as a denial,
  // never worked around client-side.
  if (!catalog.hasEntitlement) {
    return (
      <PageContainer>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Report Studio</h1>
        </div>
        <div className="max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Not available on this plan</h2>
          <p className="mt-1 text-sm text-amber-800">
            Report Studio requires the <span className="font-mono">report_studio</span>{' '}
            entitlement. {catalog.error ? `(${catalog.error})` : ''}
          </p>
          <p className="mt-2 text-xs text-amber-700">
            Your tenant entitlements:{' '}
            <span className="font-mono">{catalog.data?.entitlements?.join(', ') || 'none'}</span>
          </p>
          {isSuperAdmin && (
            <div className="mt-3 border-t border-amber-300 pt-3 text-xs text-amber-800">
              <b>You are a Super Admin.</b> Entitlements belong to a tenant, and the
              tenant currently in scope is{' '}
              <span className="font-mono">
                {scopeTenantId ?? user?.tenantId ?? 'your own tenant'}
              </span>
              , which does not subscribe to <span className="font-mono">report_studio</span>.
              {/* The parent selector has to be here as well as on the main
                  screen: a Super Admin usually lands on a tenant WITHOUT the
                  add-on, so without a control on this screen the instruction
                  below would be impossible to follow. */}
              <div className="mt-2">
                <TenantScopeSelect />
              </div>
              <div className="mt-1.5 font-mono text-[11px] break-all">
                /reports/studio?tenant_id=&lt;tenant-uuid&gt;
              </div>
              This is a plan question, not a permission one â€” a Super Admin is not
              refused for lack of the <span className="font-mono">reports:*</span>{' '}
              permissions, which you do hold.
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  const canCreate = catalog.can('reports:create');
  const canShare = catalog.can('reports:share');
  const canExport = catalog.can('reports:export');

  return (
    <PageContainer>
    <div className="space-y-6">
      {/* Page header: the MAP Nexus panel pattern shared with Dashboard,
          Validation Centre and Migration Overview. */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
      <h1 className="text-2xl font-bold text-gray-900">Report Studio</h1>
        <div className="mt-1 flex items-center gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          report_studio
        </span>
        {isSuperAdmin && (
          <span className="text-sm text-gray-500">
            scope: {scopeTenantId ? `tenant ${scopeTenantId.slice(0, 8)}` : 'all tenants'}
          </span>
        )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Parent (tenant) scope selector — the mockup topbar control, and the
            filter the requirement asks for. Super Admin only. */}
        <TenantScopeSelect onChange={() => list.refetch()} />
      </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {([['reports', `Saved reports (${list.items?.length ?? 0})`], ['create', 'New report']] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 ${
                tab === key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {tab === 'create' && (
        <div className="space-y-4">
          <ReportAssistantPanel tenantId={tenantId} onCreated={(r: ReportRecord) => nav(`/reports/studio/${r.id}/edit`)} />
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-800">
              Start from a curated template
            </h2>
            <TemplateGallery
              templates={catalog.data?.templates ?? []}
              tenantId={tenantId}
              canCreate={canCreate}
              onCreated={(r) => nav(`/reports/studio/${r.id}/edit`)}
            />
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {(['all', 'mine', 'shared'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setListScope(s)}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  listScope === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-[10px] text-gray-400">
              can create: <b>{String(canCreate)}</b> &middot; share: <b>{String(canShare)}</b>{' '}
              &middot; export: <b>{String(canExport)}</b>
            </span>
          </div>

          {list.loading && <LoadingSpinner />}
          {list.error && <ErrorState message={list.error} onRetry={list.refetch} />}

          {!list.loading && !list.error && (list.items?.length ?? 0) === 0 && (
            <EmptyState
              title="No reports yet"
              message="Instantiate a template or ask the Report Assistant to build one."
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {list.items?.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/reports/studio/${r.id}/view`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-700 truncate block"
                    >
                      {r.title}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">{r.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONE[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="font-mono text-gray-400">{r.id.slice(0, 8)}</span>
                  {r.version_no && <span className="rounded bg-gray-100 px-1.5 py-0.5">v{r.version_no}</span>}
                  {r.origin === 'template' && (
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700">
                      from {r.derived_from_template_key}
                    </span>
                  )}
                  {r.origin === 'assistant' && (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                      assistant &middot; {r.origin_recipe_key}
                    </span>
                  )}
                  {r.template_state === 'pinned' && r.derived_from_template_key && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">pinned</span>
                  )}
                  {!r.is_owner && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">shared</span>}
                </div>

                {r.required_entitlements && r.required_entitlements.length > 0 && (
                  <p className="mt-1.5 text-[10px] text-gray-400">
                    requires: <span className="font-mono">{r.required_entitlements.join(', ')}</span>
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/reports/studio/${r.id}/view`}
                    className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </Link>
                  {(r.is_owner || canShare) && (
                    <Link
                      to={`/reports/studio/${r.id}/edit`}
                      className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {catalog.error && <ErrorState message={catalog.error} />}
    </div>
    </PageContainer>
  );
}

export default ReportListPage;
