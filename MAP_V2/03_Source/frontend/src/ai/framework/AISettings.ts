import type { AIProviderType } from '../types/AIModels';

export interface AISettingsState {
  provider: AIProviderType;
  apiKey: string;
  baseUrl: string;
  organizationId: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  streamingEnabled: boolean;
  auditEnabled: boolean;
  usageTrackingEnabled: boolean;
  citationEnabled: boolean;
  suggestionEnabled: boolean;
}

const STORAGE_KEY = 'map-nexus-ai-settings';

const DEFAULT_SETTINGS: AISettingsState = {
  provider: 'openai',
  apiKey: '',
  baseUrl: '',
  organizationId: '',
  defaultModel: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  streamingEnabled: true,
  auditEnabled: true,
  usageTrackingEnabled: true,
  citationEnabled: true,
  suggestionEnabled: true
};

export class AISettingsManager {
  private settings: AISettingsState;
  private listeners: Set<(settings: AISettingsState) => void> = new Set();

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AISettingsState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parse errors
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore storage errors
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.settings));
  }

  getSettings(): AISettingsState {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AISettingsState>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.notify();
  }

  setProvider(provider: AIProviderType): void {
    this.settings.provider = provider;
    this.saveSettings();
    this.notify();
  }

  setApiKey(apiKey: string): void {
    this.settings.apiKey = apiKey;
    this.saveSettings();
    this.notify();
  }

  setBaseUrl(baseUrl: string): void {
    this.settings.baseUrl = baseUrl;
    this.saveSettings();
    this.notify();
  }

  resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.notify();
  }

  subscribe(listener: (settings: AISettingsState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  isConfigured(): boolean {
    return this.settings.apiKey.length > 0;
  }
}

export const aiSettingsManager = new AISettingsManager();
