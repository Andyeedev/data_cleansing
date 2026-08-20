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
  const [batchesLoading, setBatchesLoading] = useState(true);

  const fetchBatches = useCallback(async () => {
    setBatchesLoading(true);
    try {
      const params: Record<string, string | number> = { page: 1, page_size: 100 };
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
  }, [tenantId]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const filteredBatches = batches.filter(
    (b) => !projectId || b.project_id === projectId
  );

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {showTenant && (
        <div>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 2 }}>Tenant</label>
          {tenantsError ? (
            <div style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #dc3545', color: '#dc3545', fontSize: 12, minWidth: 160 }}>
              {tenantsError}
            </div>
          ) : (
            <select
              value={tenantId || ''}
              onChange={e => setTenantId(e.target.value || null)}
              disabled={tenantsLoading}
              style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', minWidth: 160 }}
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
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 2 }}>Project</label>
          {projectsError ? (
            <div style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #dc3545', color: '#dc3545', fontSize: 12, minWidth: 160 }}>
              {projectsError}
            </div>
          ) : (
            <select
              value={projectId || ''}
              onChange={e => setProjectId(e.target.value || null)}
              disabled={projectsLoading}
              style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', minWidth: 160 }}
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
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 2 }}>Batch</label>
          <select
            value={batchId || ''}
            onChange={e => setBatchId(e.target.value || null)}
            disabled={batchesLoading}
            style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
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
