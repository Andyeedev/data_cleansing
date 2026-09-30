/**
 * OC-REPORT-001 — Report Studio hooks.
 *
 * Every hook takes the CURRENT TENANT SCOPE and puts it in the request, so the
 * backend resolves the right tenant for a Super Admin. Reads are keyed on that
 * scope in useReportQuery, which is what stops a tenant switch from showing the
 * previous tenant's data.
 *
 * Note these are plain hooks with useState/useEffect rather than react-query,
 * to match the surrounding codebase (useControls, useReports, useMigration).
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTenantScope } from '../tenant/TenantContext';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../utils/apiClient';
import type {
  ReportCatalog,
  ReportRecord,
  DefinitionRow,
  ReportReadPayload,
  ReportPreviewPayload,
  ReportDefinitionBody,
  RecipeSpec,
  RecipeMatch,
  AssistantCandidate,
  AccessGrant,
  AccessEntry,
  ReportStatus,
  ValidateResult,
  TemplateUpdateInfo,
} from '../types/reportStudio';

const BASE = '/reports/studio';

/**
 * The tenant the Studio should act on.
 *
 * For everyone except a Super Admin this is the locked JWT tenant and the URL is
 * ignored entirely.
 *
 * For a Super Admin it is the TenantContext scope, falling back to a
 * `?tenant_id=` on the URL. When the URL carries one it is ADOPTED into the
 * context (via the existing setScopeTenant, which persists to sessionStorage)
 * rather than being read once per render. Without that, the scope was lost the
 * moment the Studio navigated internally - instantiating a template goes to
 * /reports/studio/{id}/edit and dropped the query string, so the editor silently
 * reverted to the Super Admin's own unsubscribed tenant and showed a denial.
 *
 * The URL parameter is the SAME one the backend already accepts: resolve_tenant
 * honours `?tenant_id=` for a Super Admin and ignores it for anyone else, so the
 * server still decides. Nothing here grants capability the API would refuse.
 */
export function useStudioTenantId(): string | undefined {
  const { scopeTenantId, isSuperAdmin, setScopeTenant } = useTenantScope();
  const [params] = useSearchParams();
  const fromUrl = params.get('tenant_id') || undefined;

  useEffect(() => {
    if (isSuperAdmin && fromUrl && fromUrl !== scopeTenantId) {
      setScopeTenant(fromUrl);
    }
  }, [isSuperAdmin, fromUrl, scopeTenantId, setScopeTenant]);

  if (!isSuperAdmin) return undefined;
  return scopeTenantId ?? fromUrl;
}

function qs(tenantId?: string | null, extra?: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  if (tenantId) p.set('tenant_id', tenantId);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    }
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

function describe(err: unknown): string {
  const anyErr = err as { response?: { status?: number; data?: { detail?: string } }; message?: string };
  const status = anyErr?.response?.status;
  const detail = anyErr?.response?.data?.detail;
  if (status === 403) return detail || 'You do not have access to Report Studio.';
  if (status === 404) return 'Report not found.';
  if (status === 401) return 'Unauthorized - please log in.';
  if (status) return `${detail || anyErr?.message || 'Request failed'} (HTTP ${status})`;
  return anyErr?.message || 'Request failed';
}

/* ------------------------------------------------------------------ catalog */

export interface TenantOption {
  tenant_id: string;
  tenant_name: string;
}

/**
 * Parent (tenant) options for the Super Admin scope dropdown.
 *
 * The mockup's topbar shows a parent selector — "Acme Financial" — that scopes
 * the whole Studio to one tenant. This hook supplies that list. It is
 * Super-Admin-only in effect: the endpoint is admin-gated server-side and
 * returns 403 for everyone else, so a non-Super-Admin simply gets an empty list
 * and the dropdown never renders (see TenantScopeSelect).
 *
 * The name "parent" is the mockup's word for the tenant; the schema calls it
 * tenant_id, so both terms appear here to keep the mapping obvious.
 */
export function useTenantOptions(enabled: boolean) {
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) { setTenants([]); return; }
    setLoading(true);
    setError(null);
    try {
      const rows = await apiGet<TenantOption[]>('/rules/tenants');
      setTenants(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setError(describe(e));
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { refetch(); }, [refetch]);

  return { tenants, loading, error, refetch };
}

export function useReportCatalog(tenantId?: string | null) {
  const [data, setData] = useState<ReportCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiGet<ReportCatalog>(`${BASE}/catalog${qs(tenantId)}`));
    } catch (e) {
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    hasEntitlement: !!data?.entitlements?.includes('report_studio'),
    can: (perm: string) => !!data?.permissions?.includes(perm),
  };
}

/* ------------------------------------------------------------------- lists */

export function useReportList(tenantId?: string | null, scope: 'all' | 'mine' | 'shared' = 'all') {
  const [items, setItems] = useState<ReportRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ items: ReportRecord[] }>(
        `${BASE}/reports${qs(tenantId, { scope })}`);
      setItems(res.items ?? []);
    } catch (e) {
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId, scope]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}

/* -------------------------------------------------------------- definition */

export function useReportDefinition(reportId: string | undefined, tenantId?: string | null) {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [definition, setDefinition] = useState<DefinitionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!reportId) {
      setReport(null);
      setDefinition(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ report: ReportRecord; definition: DefinitionRow }>(
        `${BASE}/reports/${reportId}${qs(tenantId)}`);
      setReport(res.report);
      setDefinition(res.definition);
    } catch (e) {
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { report, definition, loading, error, refetch, setReport };
}

export function useReportVersions(reportId: string | undefined, tenantId?: string | null) {
  const [items, setItems] = useState<DefinitionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const res = await apiGet<{ items: DefinitionRow[] }>(
        `${BASE}/reports/${reportId}/versions${qs(tenantId)}`);
      setItems(res.items ?? []);
      setError(null);
    } catch (e) {
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}

/* -------------------------------------------------------------------- read */

export function useReportQuery(
  reportId: string | undefined,
  tenantId?: string | null,
  version?: number,
) {
  const [data, setData] = useState<ReportReadPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!reportId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await apiGet<ReportReadPayload>(
        `${BASE}/reports/${reportId}/data${qs(tenantId, { version })}`));
    } catch (e) {
      setData(null);
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId, version]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}

/* ------------------------------------------------------------------ writes */

export function useReportMutations(tenantId?: string | null) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    busy,
    error,
    setError,
    instantiate: (template_key: string, title?: string) =>
      run(() => apiPost<ReportRecord>(
        `${BASE}/templates/instantiate${qs(tenantId)}`, { template_key, title })),
    createBlank: (title: string, definition: ReportDefinitionBody) =>
      run(() => apiPost<ReportRecord>(`${BASE}/reports${qs(tenantId)}`, { title, definition })),
    saveDefinition: (reportId: string, definition: ReportDefinitionBody) =>
      run(() => apiPut<ReportRecord>(
        `${BASE}/reports/${reportId}/definition${qs(tenantId)}`, { definition })),
    setStatus: (reportId: string, status: ReportStatus) =>
      run(() => apiPatch<ReportRecord>(
        `${BASE}/reports/${reportId}/status${qs(tenantId)}`, { status })),
    duplicate: (reportId: string) =>
      run(() => apiPost<ReportRecord>(
        `${BASE}/reports/${reportId}/duplicate${qs(tenantId)}`)),
    share: (reportId: string, grantee_user_id: string) =>
      run(() => apiPost<AccessGrant>(
        `${BASE}/reports/${reportId}/access${qs(tenantId)}`, { grantee_user_id })),
    revoke: (reportId: string, grantee_user_id: string) =>
      run(() => apiDelete<{ revoked: boolean }>(
        `${BASE}/reports/${reportId}/access/${grantee_user_id}${qs(tenantId)}`)),
    adoptTemplate: (reportId: string) =>
      run(() => apiPost<ReportRecord>(
        `${BASE}/reports/${reportId}/adopt-template${qs(tenantId)}`)),
  };
}

export function useReportAccess(reportId: string | undefined, tenantId?: string | null) {
  const [items, setItems] = useState<AccessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const res = await apiGet<{ items: AccessEntry[] }>(
        `${BASE}/reports/${reportId}/access${qs(tenantId)}`);
      setItems(res.items ?? []);
      setError(null);
    } catch (e) {
      setError(describe(e));
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}

/* ----------------------------------------------------------------- builder */

/**
 * Validate a candidate definition WITHOUT saving it.
 *
 * This is a thin call to the server's single validator. The builder deliberately
 * does not re-implement the rules in TypeScript: if it did, the UI could green-
 * light a definition the API would then reject, and the two would drift.
 */
export function useDefinitionValidator(tenantId?: string | null) {
  const [result, setResult] = useState<ValidateResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // the previous result is kept while re-checking so the UI does not flicker
  const validate = useCallback(async (definition: ReportDefinitionBody) => {
    setChecking(true);
    try {
      const res = await apiPost<ValidateResult>(
        `${BASE}/validate${qs(tenantId)}`, { definition });
      setResult(res);
      setError(null);
      return res;
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setChecking(false);
    }
  }, [tenantId]);

  const reset = useCallback(() => { setResult(null); setError(null); }, []);

  return { result, checking, error, validate, reset };
}

/**
 * Preview an UNSAVED candidate definition against the real read path.
 *
 * The server executes it through the same four-layer authorisation and the same
 * aggregation engine as a saved read, but creates no version. So the preview can
 * never show a tenant, a field or a capability the user could not otherwise read.
 */
export function useReportPreview(
  reportId: string | undefined,
  tenantId?: string | null,
) {
  const [data, setData] = useState<ReportPreviewPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (definition: ReportDefinitionBody, maxRows?: number) => {
    if (!reportId) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<ReportPreviewPayload>(
        `${BASE}/reports/${reportId}/query${qs(tenantId)}`,
        { definition, max_rows: maxRows },
      );
      setData(res);
      return res;
    } catch (e) {
      setData(null);
      setError(describe(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId]);

  const clear = useCallback(() => { setData(null); setError(null); }, []);

  return { data, loading, error, run, clear };
}

/* --------------------------------------------------------- template update */

/**
 * Template update state for a pinned report.
 *
 * The check is a READ that never applies anything; adoption is a separate,
 * explicit POST that creates a new immutable report version. Keeping the two
 * apart is what enforces the plan's "merge is offered, never automatic" rule -
 * there is no code path that can silently change a published report.
 */
export function useTemplateUpdate(
  reportId: string | undefined,
  tenantId?: string | null,
) {
  const [info, setInfo] = useState<TemplateUpdateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adopting, setAdopting] = useState(false);
  const [adopted, setAdopted] = useState<string | null>(null);

  const check = useCallback(async () => {
    if (!reportId) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<TemplateUpdateInfo>(
        `${BASE}/reports/${reportId}/template-update${qs(tenantId)}`);
      setInfo(res);
      return res;
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [reportId, tenantId]);

  const adopt = useCallback(async () => {
    if (!reportId) return null;
    setAdopting(true);
    setError(null);
    try {
      const res = await apiPost<ReportRecord>(
        `${BASE}/reports/${reportId}/adopt-template${qs(tenantId)}`);
      setAdopted(
        `Adopted template v${res.derived_from_template_version} as a new report version.`);
      setInfo((prev) => (prev ? { ...prev, has_update: false } : prev));
      return res;
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setAdopting(false);
    }
  }, [reportId, tenantId]);

  return { info, loading, error, adopting, adopted, check, adopt, setAdopted };
}

/* --------------------------------------------------------------- assistant */

export function useReportAssistant(tenantId?: string | null) {  const [recipes, setRecipes] = useState<RecipeSpec[]>([]);
  const [match, setMatch] = useState<RecipeMatch | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [candidate, setCandidate] = useState<AssistantCandidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    try {
      const res = await apiGet<{ items: RecipeSpec[] }>(`${BASE}/assistant/recipes${qs(tenantId)}`);
      setRecipes(res.items ?? []);
    } catch (e) {
      setError(describe(e));
    }
  }, [tenantId]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const runMatch = useCallback(async (request: string) => {
    setLoading(true);
    setError(null);
    setCandidate(null);
    setAnswers({});
    try {
      const res = await apiPost<RecipeMatch>(`${BASE}/assistant/match${qs(tenantId)}`, { request });
      setMatch(res);
      if (res.matched) {
        const seeded: Record<string, string> = {};
        for (const q of res.questions ?? []) if (q.default) seeded[q.id] = q.default;
        setAnswers(seeded);
      }
      return res;
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const buildCandidate = useCallback(async () => {
    if (!match?.recipe_key) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<AssistantCandidate>(
        `${BASE}/assistant/candidate${qs(tenantId)}`,
        { recipe_key: match.recipe_key, answers });
      setCandidate(res);
      return res;
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [match, answers, tenantId]);

  const saveCandidate = useCallback(async (title?: string) => {
    if (!match?.recipe_key) return null;
    setLoading(true);
    setError(null);
    try {
      return await apiPost<ReportRecord>(
        `${BASE}/assistant/candidate${qs(tenantId)}`,
        { recipe_key: match.recipe_key, answers, title, save: true });
    } catch (e) {
      setError(describe(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [match, answers, tenantId]);

  return {
    recipes, match, answers, setAnswers, candidate,
    loading, error, setError,
    runMatch, buildCandidate, saveCandidate, reset: () => { setMatch(null); setCandidate(null); setAnswers({}); },
  };
}
