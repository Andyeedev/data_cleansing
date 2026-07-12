import { useState, useCallback, useEffect } from 'react';
import { getAIEngine } from '../framework/AIEngine';
import type { AIModuleType } from '../types/AIRequests';
import type { AIModuleRegistration, AIRegistryEntry } from '../framework/AIRegistry';

export interface UseAIRegistryReturn {
  registrations: AIRegistryEntry[];
  enabledModules: AIRegistryEntry[];
  getModule: (module: AIModuleType) => AIRegistryEntry | undefined;
  isRegistered: (module: AIModuleType) => boolean;
  isEnabled: (module: AIModuleType) => boolean;
  register: (registration: AIModuleRegistration) => void;
  unregister: (module: AIModuleType) => void;
  refresh: () => void;
}

export const useAIRegistry = (): UseAIRegistryReturn => {
  const [registrations, setRegistrations] = useState<AIRegistryEntry[]>([]);
  const engine = getAIEngine();

  const refresh = useCallback(() => {
    const all = engine.getRegistry().getAll();
    setRegistrations(all);
  }, [engine]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enabledModules = registrations.filter(r => r.registration.enabled);

  const getModule = useCallback((module: AIModuleType) => {
    return engine.getRegistry().get(module);
  }, [engine]);

  const isRegistered = useCallback((module: AIModuleType) => {
    return engine.getRegistry().isRegistered(module);
  }, [engine]);

  const isEnabled = useCallback((module: AIModuleType) => {
    return engine.getRegistry().isEnabled(module);
  }, [engine]);

  const register = useCallback((registration: AIModuleRegistration) => {
    engine.getRegistry().register(registration);
    refresh();
  }, [engine, refresh]);

  const unregister = useCallback((module: AIModuleType) => {
    engine.getRegistry().unregister(module);
    refresh();
  }, [engine, refresh]);

  return {
    registrations,
    enabledModules,
    getModule,
    isRegistered,
    isEnabled,
    register,
    unregister,
    refresh
  };
};

export default useAIRegistry;
