import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBatchStatusBreakdown } from './useExecutionBreakdown';
import { useEntitlements } from './useEntitlements';

function mockFetchOk(data: unknown) {
  return { ok: true, status: 200, json: async () => ({ success: true, data }) };
}

describe('Phase D dashboard hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: unknown) => {
      const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
      if (u.includes('/execution/history/status-breakdown')) {
        return mockFetchOk({
          breakdown: { COMPLETED: 4, FAILED: 1 },
          total: 5,
          unscored: 0,
          today_breakdown: { COMPLETED: 2 },
          time_range: 'week',
        });
      }
      if (u.includes('/tenants/t1/entitlements')) {
        return mockFetchOk({ tenant_id: 't1', entitlements: ['validation', 'audit_trail'] });
      }
      return mockFetchOk({});
    });
  });

  it('loads the batch status breakdown for the requested range and tenant', async () => {
    const { result } = renderHook(() => useBatchStatusBreakdown('week', 't1'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.data?.total).toBe(5);
    expect(result.current.data?.breakdown.COMPLETED).toBe(4);
    const calledUrl = String((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(calledUrl).toContain('time_range=week');
    expect(calledUrl).toContain('tenant_id=t1');
  });

  it('loads effective entitlements for one tenant without reconstructing them', async () => {
    const { result } = renderHook(() => useEntitlements('t1'));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.entitlements).toEqual(['validation', 'audit_trail']);
  });

  it('skips the fetch and stays empty in All-Tenants mode', async () => {
    const { result } = renderHook(() => useEntitlements(null));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.entitlements).toEqual([]);
    expect(global.fetch as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
  });
});
