import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ValidationFilterState {
  tenantId: string | null;
  projectId: string | null;
  batchId: string | null;
}

interface ValidationFilterContextType extends ValidationFilterState {
  setTenantId: (id: string | null) => void;
  setProjectId: (id: string | null) => void;
  setBatchId: (id: string | null) => void;
  reset: () => void;
}

const ValidationFilterContext = createContext<ValidationFilterContextType | null>(null);

const INITIAL: ValidationFilterState = {
  tenantId: null,
  projectId: null,
  batchId: null,
};

export function ValidationFilterProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<string | null>(INITIAL.tenantId);
  const [projectId, setProjectIdState] = useState<string | null>(INITIAL.projectId);
  const [batchId, setBatchIdState] = useState<string | null>(INITIAL.batchId);

  const setTenantId = useCallback((id: string | null) => {
    setTenantIdState(id);
    setProjectIdState(null);
    setBatchIdState(null);
  }, []);

  const setProjectId = useCallback((id: string | null) => {
    setProjectIdState(id);
    setBatchIdState(null);
  }, []);

  const setBatchId = useCallback((id: string | null) => {
    setBatchIdState(id);
  }, []);

  const reset = useCallback(() => {
    setTenantIdState(null);
    setProjectIdState(null);
    setBatchIdState(null);
  }, []);

  return (
    <ValidationFilterContext.Provider
      value={{ tenantId, projectId, batchId, setTenantId, setProjectId, setBatchId, reset }}
    >
      {children}
    </ValidationFilterContext.Provider>
  );
}

export function useValidationFilter() {
  const ctx = useContext(ValidationFilterContext);
  if (!ctx) throw new Error('useValidationFilter must be used within ValidationFilterProvider');
  return ctx;
}
