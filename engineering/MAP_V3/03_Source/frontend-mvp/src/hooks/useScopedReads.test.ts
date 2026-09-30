import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUser, useUserRoles } from './useUsers';
import { useRole, useRolePermissions } from './useRoles';

function mockFetchOk(data: unknown) {
  return { ok: true, status: 200, json: async () => ({ success: true, data }) };
}

function lastUrl(): string {
  const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
  return String(calls[calls.length - 1][0]);
}

describe('scoped detail reads (Phase C fix)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation(() => mockFetchOk({}));
  });

  it('useUser sends the working tenant scope', async () => {
    const { result } = renderHook(() => useUser('u1', 'tenant-x'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(lastUrl()).toContain('tenant_id=tenant-x');
  });

  it('useUser omits the param without a scope (JWT applies)', async () => {
    const { result } = renderHook(() => useUser('u1'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(lastUrl()).not.toContain('tenant_id');
  });

  it('useUserRoles sends the working tenant scope', async () => {
    const { result } = renderHook(() => useUserRoles('u1', 'tenant-x'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(lastUrl()).toContain('/users/u1/roles');
    expect(lastUrl()).toContain('tenant_id=tenant-x');
  });

  it('useRole and useRolePermissions send the working tenant scope', async () => {
    const r1 = renderHook(() => useRole('r1', 'tenant-x'));
    await waitFor(() => {
      expect(r1.result.current.loading).toBe(false);
    });
    expect(lastUrl()).toContain('tenant_id=tenant-x');
    const r2 = renderHook(() => useRolePermissions('r1', 'tenant-x'));
    await waitFor(() => {
      expect(r2.result.current.loading).toBe(false);
    });
    expect(lastUrl()).toContain('tenant_id=tenant-x');
  });
});
