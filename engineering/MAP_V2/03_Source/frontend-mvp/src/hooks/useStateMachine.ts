import { useState, useCallback, useRef } from 'react';

type State = 'idle' | 'loading' | 'loaded' | 'error' | 'empty' | string;

interface StateMachineConfig {
  initial: State;
  transitions: Record<State, Record<string, State>>;
}

interface StateMachineReturn<T> {
  state: State;
  data: T | null;
  error: Error | null;
  transition: (event: string, payload?: any) => void;
  fetchData: (fetchFn: () => Promise<T>) => Promise<void>;
  retry: () => void;
  reset: () => void;
  setData: (data: T | null) => void;
}

export function useStateMachine<T = any>(config: StateMachineConfig): StateMachineReturn<T> {
  const [state, setState] = useState(config.initial);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchRef = useRef<(() => Promise<T>) | null>(null);

  const transition = useCallback((event: string, _payload?: any) => {
    setState((currentState) => {
      const transitions = config.transitions[currentState];
      if (transitions && transitions[event]) {
        return transitions[event];
      }
      return currentState;
    });
  }, [config.transitions]);

  const fetchData = useCallback(async (fetchFn: () => Promise<T>) => {
    lastFetchRef.current = fetchFn;
    transition('fetch');
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      if (result === null || (Array.isArray(result) && (result as any).length === 0)) {
        transition('empty');
      } else {
        transition('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      transition('error');
    }
  }, [transition]);

  const retry = useCallback(() => {
    if (lastFetchRef.current) {
      fetchData(lastFetchRef.current);
    }
  }, [fetchData]);

  const reset = useCallback(() => {
    setState(config.initial);
    setData(null);
    setError(null);
    lastFetchRef.current = null;
  }, [config.initial]);

  return { state, data, error, transition, fetchData, retry, reset, setData };
}

export type { State, StateMachineConfig };
