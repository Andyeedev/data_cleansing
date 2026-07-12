import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { AIConversationMessage, AIModuleType } from '../types/AIRequests';

export interface AIUserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface AIContextState {
  user: AIUserInfo | null;
  tenantId: string | null;
  portal: string | null;
  report: string | null;
  dataset: string | null;
  sessionId: string;
  conversationHistory: AIConversationMessage[];
  permissions: string[];
  preferences: Record<string, unknown>;
  activeModule: AIModuleType | null;
  isLoading: boolean;
  error: string | null;
}

export interface AIContextActions {
  setUser: (user: AIUserInfo | null) => void;
  setTenantId: (tenantId: string | null) => void;
  setPortal: (portal: string | null) => void;
  setReport: (report: string | null) => void;
  setDataset: (dataset: string | null) => void;
  setActiveModule: (module: AIModuleType | null) => void;
  addMessage: (message: AIConversationMessage) => void;
  clearHistory: () => void;
  setPermissions: (permissions: string[]) => void;
  setPreferences: (preferences: Record<string, unknown>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AIContext = createContext<(AIContextState & AIContextActions) | null>(null);

const generateSessionId = (): string => `ai-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export interface AIContextProviderProps {
  children: React.ReactNode;
  initialPortal?: string;
  initialTenantId?: string;
}

export const AIContextProvider: React.FC<AIContextProviderProps> = ({
  children,
  initialPortal,
  initialTenantId
}) => {
  const [user, setUser] = useState<AIUserInfo | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId ?? null);
  const [portal, setPortal] = useState<string | null>(initialPortal ?? null);
  const [report, setReport] = useState<string | null>(null);
  const [dataset, setDataset] = useState<string | null>(null);
  const [sessionId] = useState<string>(generateSessionId);
  const [conversationHistory, setConversationHistory] = useState<AIConversationMessage[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  const [activeModule, setActiveModule] = useState<AIModuleType | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: AIConversationMessage) => {
    setConversationHistory(prev => [...prev, message]);
  }, []);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  const value = useMemo(() => ({
    user,
    tenantId,
    portal,
    report,
    dataset,
    sessionId,
    conversationHistory,
    permissions,
    preferences,
    activeModule,
    isLoading,
    error,
    setUser,
    setTenantId,
    setPortal,
    setReport,
    setDataset,
    setActiveModule,
    addMessage,
    clearHistory,
    setPermissions,
    setPreferences,
    setLoading,
    setError
  }), [
    user, tenantId, portal, report, dataset, sessionId,
    conversationHistory, permissions, preferences, activeModule,
    isLoading, error, addMessage, clearHistory
  ]);

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAIContext = (): AIContextState & AIContextActions => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIContextProvider');
  }
  return context;
};

export default AIContext;
