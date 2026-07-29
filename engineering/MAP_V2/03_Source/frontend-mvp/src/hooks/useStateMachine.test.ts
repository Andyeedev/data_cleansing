import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStateMachine } from './useStateMachine';
import type { StateMachineConfig } from './useStateMachine';

const idleToLoadingConfig: StateMachineConfig = {
  initial: 'idle',
  transitions: {
    idle: { fetch: 'loading' },
    loading: { success: 'loaded', error: 'error', empty: 'empty' },
    loaded: { refetch: 'loading' },
    error: { retry: 'loading' },
    empty: { retry: 'loading' },
  },
};

describe('useStateMachine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('sets the initial state correctly', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      expect(result.current.state).toBe('idle');
    });

    it('initializes data and error as null', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('transition', () => {
    it('moves to correct state on valid event', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      act(() => {
        result.current.transition('fetch');
      });

      expect(result.current.state).toBe('loading');
    });

    it('stays in current state on invalid event', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      act(() => {
        result.current.transition('invalid_event');
      });

      expect(result.current.state).toBe('idle');
    });

    it('chains multiple transitions', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      act(() => {
        result.current.transition('fetch');
      });
      expect(result.current.state).toBe('loading');

      act(() => {
        result.current.transition('success');
      });
      expect(result.current.state).toBe('loaded');
    });
  });

  describe('fetchData', () => {
    it('sets data on success', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const mockData = { id: 1, name: 'test' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.state).toBe('loaded');
      expect(result.current.error).toBeNull();
    });

    it('sets error on failure', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchError = new Error('Network error');
      const fetchFn = vi.fn().mockRejectedValue(fetchError);

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(result.current.error).toEqual(fetchError);
      expect(result.current.state).toBe('error');
    });

    it('transitions to empty when result is null', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue(null);

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.state).toBe('empty');
    });

    it('transitions to empty when result is empty array', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue([]);

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.state).toBe('empty');
    });

    it('converts non-Error rejection to Error', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockRejectedValue('string error');

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('string error');
    });

    it('stores fetch function for retry', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue({ data: 1 });

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('retry', () => {
    it('calls last fetch function', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue({ data: 1 });

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      await act(async () => {
        result.current.retry();
      });

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('does nothing if no fetch has been called', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      expect(() => {
        act(() => {
          result.current.retry();
        });
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('returns to initial state', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue({ data: 1 });

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });
      expect(result.current.state).toBe('loaded');

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('clears last fetch function reference', async () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));
      const fetchFn = vi.fn().mockResolvedValue({ data: 1 });

      await act(async () => {
        await result.current.fetchData(fetchFn);
      });

      act(() => {
        result.current.reset();
      });

      act(() => {
        result.current.retry();
      });

      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('setData', () => {
    it('manually sets data', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      act(() => {
        result.current.setData({ custom: 'value' });
      });

      expect(result.current.data).toEqual({ custom: 'value' });
    });

    it('can set data to null', () => {
      const { result } = renderHook(() => useStateMachine(idleToLoadingConfig));

      act(() => {
        result.current.setData({ value: 1 });
      });

      act(() => {
        result.current.setData(null);
      });

      expect(result.current.data).toBeNull();
    });
  });
});
