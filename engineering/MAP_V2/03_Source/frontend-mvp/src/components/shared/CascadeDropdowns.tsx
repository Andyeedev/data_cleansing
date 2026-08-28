import { useState, useEffect, useCallback } from 'react';
import { useValidationFilter } from '../../context/ValidationFilterContext';
import { useMigrationTenants, useMigrationProjects } from '../../hooks/useMigration';
import { apiGet } from '../../utils/apiClient';

interface BatchItem {
  batch_id: string;
  batch_name?: string | null;
  project_id: string;
  batch_status: string;
}

interface CascadeDropdownsProps {
  showTenant?: boolean;
  showProject?: boolean;
  showBatch?: boolean;
}

export default function CascadeDropdowns({ showTenant = true, showProject = true, showBatch = true }: CascadeDropdownsProps) {
  const { tenantId, projectId, batchId, setTenantId, setProjectId, setBatchId } = useValidationFilter();

  const { tenants, loading: tenantsLoading, error: tenantsError } = useMigrationTenants();
  const { projects, loading: projectsLoading, error: projectsError } = useMigrationProjects(undefined, tenantId || undefined);

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  const fetchBatches = useCallback(async () => {
    if (!showBatch) return;
    setBatchesLoading(true);
    try {
      const params: Record<string, string | number> = { page: 1, page_size: 50 };
      if (tenantId) params.tenant_id = tenantId;
      const result = await apiGet<{ items: BatchItem[]; total: number }>('/execution/history', params);
      const items = result?.items || [];
      const seen = new Set<string>();
      const deduped = items.filter((b) => {
        if (seen.has(b.batch_id)) return false;
        seen.add(b.batch_id);
        return true;
      });
      setBatches(deduped);
    } catch {
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }, [tenantId, showBatch]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const filteredBatches = batches.filter(
    (b) => !projectId || b.project_id === projectId
  );

  return (
    <div className="flex gap-3 items-center flex-wrap">
      {showTenant && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tenant</label>
          {tenantsError ? (
            <div className="px-2.5 py-1.5 rounded border border-red-300 text-red-700 text-xs min-w-[160px]">
              {tenantsError}
            </div>
          ) : (
            <select
              value={tenantId || ''}
              onChange={e => setTenantId(e.target.value || null)}
              disabled={tenantsLoading}
              className="px-2.5 py-1.5 rounded border border-gray-300 text-sm min-w-[160px] bg-white text-gray-900 disabled:opacity-50"
            >
              <option value="">All Tenants</option>
              {tenants?.map((t: any) => (
                <option key={t.tenant_id} value={t.tenant_id}>{t.tenant_name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {showProject && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Project</label>
          {projectsError ? (
            <div className="px-2.5 py-1.5 rounded border border-red-300 text-red-700 text-xs min-w-[160px]">
              {projectsError}
            </div>
          ) : (
            <select
              value={projectId || ''}
              onChange={e => setProjectId(e.target.value || null)}
              disabled={projectsLoading}
              className="px-2.5 py-1.5 rounded border border-gray-300 text-sm min-w-[160px] bg-white text-gray-900 disabled:opacity-50"
            >
              <option value="">All Projects</option>
              {projects?.map((p: any) => (
                <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {showBatch && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Batch</label>
          <select
            value={batchId || ''}
            onChange={e => setBatchId(e.target.value || null)}
            disabled={batchesLoading}
            className="px-2.5 py-1.5 rounded border border-gray-300 text-sm min-w-[200px] bg-white text-gray-900 disabled:opacity-50"
          >
            <option value="">All Batches</option>
            {filteredBatches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_name || b.batch_id.slice(0, 8)} ({b.batch_status})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
