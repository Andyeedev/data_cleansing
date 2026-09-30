import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Phase C — single working tenant scope for the admin console (spec §6).
 *
 * - Super Admin: `{ kind: 'all' }` (aggregate, clearly labeled) or
 *   `{ kind: 'tenant', tenantId }` (scoped view). Defaults to 'all'.
 * - Everyone else: locked to their own JWT tenant; no picker, no aggregate,
 *   no escape. The scope never mutates roles — it is viewing/working scope
 *   only, and the backend JWT remains the security authority.
 * - Persisted in `sessionStorage` (approved D3): survives in-session reloads
 *   without leaking working scope across sessions.
 */
export type TenantScope = { kind: 'all' } | { kind: 'tenant'; tenantId: string };

interface TenantContextType {
  scope: TenantScope;
  setScopeTenant: (tenantId: string) => void;
  setScopeAll: () => void;
  /** True for non-Super-Admin principals (locked to their own tenant). */
  isLocked: boolean;
  /** Own JWT tenant for locked principals, else null. */
  lockedTenantId: string | null;
  isSuperAdmin: boolean;
  /** Concrete tenant id when scoped, null in All-Tenants mode. */
  scopeTenantId: string | null;
}

const STORAGE_KEY = 'map_nexus_tenant_scope';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

function initialScope(isSuperAdmin: boolean, ownTenantId: string | null): TenantScope {
  if (!isSuperAdmin) {
    return ownTenantId ? { kind: 'tenant', tenantId: ownTenantId } : { kind: 'all' };
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TenantScope;
      if (parsed?.kind === 'tenant' && parsed.tenantId) return parsed;
    }
  } catch {
    // Corrupt entry: fall through to the default.
  }
  return { kind: 'all' };
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { userRoles, user } = useAuth();
  const isSuperAdmin = userRoles.includes('Super Admin');
  const ownTenantId = user?.tenantId ?? null;

  const [scope, setScope] = useState<TenantScope>(() => initialScope(isSuperAdmin, ownTenantId));

  // Re-validate when identity resolves/changes (e.g. after login): locked
  // principals snap to their own tenant; Super Admin keeps a valid scope.
  useEffect(() => {
    if (!isSuperAdmin) {
      setScope((prev) => {
        const locked: TenantScope = ownTenantId ? { kind: 'tenant', tenantId: ownTenantId } : { kind: 'all' };
        if (prev.kind === 'tenant' && ownTenantId && prev.tenantId === ownTenantId) return prev;
        return locked;
      });
    }
  }, [isSuperAdmin, ownTenantId]);

  const setScopeTenant = useCallback(
    (tenantId: string) => {
      if (!isSuperAdmin || !tenantId) return;
      const next: TenantScope = { kind: 'tenant', tenantId };
      setScope(next);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable: scope still applies for this session.
      }
    },
    [isSuperAdmin],
  );

  const setScopeAll = useCallback(() => {
    if (!isSuperAdmin) return;
    setScope({ kind: 'all' });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable: scope still applies for this session.
    }
  }, [isSuperAdmin]);

  const isLocked = !isSuperAdmin;
  const scopeTenantId = scope.kind === 'tenant' ? scope.tenantId : null;

  return (
    <TenantContext.Provider
      value={{ scope, setScopeTenant, setScopeAll, isLocked, lockedTenantId: ownTenantId, isSuperAdmin, scopeTenantId }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantScope(): TenantContextType {
  const ctx = useContext(TenantContext);
  const { userRoles, user } = useAuth();
  if (ctx) return ctx;
  // Fallback outside the console provider: degrade to identity-derived
  // legacy behavior (backend JWT scoping) so section pages remain usable
  // standalone (tests, future routes). Selections are no-ops here.
  const isSuperAdmin = userRoles.includes('Super Admin');
  const ownTenantId = user?.tenantId ?? null;
  const noop = () => {};
  if (!isSuperAdmin) {
    const scope: TenantScope =
      ownTenantId ? { kind: 'tenant', tenantId: ownTenantId } : { kind: 'all' };
    return {
      scope,
      setScopeTenant: noop,
      setScopeAll: noop,
      isLocked: true,
      lockedTenantId: ownTenantId,
      isSuperAdmin: false,
      scopeTenantId: ownTenantId,
    };
  }
  const scope: TenantScope =
    ownTenantId ? { kind: 'tenant', tenantId: ownTenantId } : { kind: 'all' };
  return {
    scope,
    setScopeTenant: noop,
    setScopeAll: noop,
    isLocked: false,
    lockedTenantId: null,
    isSuperAdmin: true,
    scopeTenantId: ownTenantId,
  };
}
