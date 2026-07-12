MAP Nexus™ Enterprise Platform
Prompt 045
Frontend UI — System Settings

Version: 1.0

Prompt ID: 045

Workstream: 06 — Frontend

Status: Draft — Pending Review

---

Prerequisites

Complete

035_DB_System_Settings
040_System_Settings_API

---

Purpose

Create the React frontend for System Settings in the MAP Nexus™ platform.

This prompt creates the TypeScript pages, hooks, components, and services required to provide a complete system configuration, feature flags, and health monitoring interface in the browser.

---

Objective

Create a system settings UI capable of:

Global Configuration — View and edit platform settings
Feature Flags — Toggle features and manage rollouts
Environment Management — View environment status
System Health — Monitor system health and alerts
Maintenance — Schedule maintenance windows

---

Technology Stack

- Framework: React 19
- Language: TypeScript
- State: TanStack React Query
- Forms: React Hook Form + Zod
- UI: Tailwind CSS + Custom components
- API: Axios (apiClient)

---

Folder Structure

Enhance

src/
portal/
administration/
SystemSettings.tsx (Enhance existing)
hooks/
useSettings.ts
types/
settings.types.ts
components/
SettingsCategory.tsx
SettingField.tsx
FeatureFlagList.tsx
FeatureFlagToggle.tsx
EnvironmentList.tsx
SystemHealthDashboard.tsx
AlertList.tsx
MaintenanceSchedule.tsx
services/
SettingsService.ts

---

TypeScript Types

```typescript
// types/settings.types.ts
export type SettingCategory = 'general' | 'security' | 'performance' | 'notifications' | 'integrations';
export type SettingDataType = 'string' | 'number' | 'boolean' | 'json' | 'array';

export interface SystemSetting {
  id: string;
  category: SettingCategory;
  key: string;
  value: any;
  description?: string;
  dataType: SettingDataType;
  isRequired: boolean;
  isReadonly: boolean;
  defaultValue?: any;
  tenantScoped: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  rolloutStrategy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Environment {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  region?: string;
  healthStatus: string;
  healthLastCheck?: string;
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  source?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface SystemHealth {
  status: string;
  version: string;
  uptime: number;
  services: Array<{
    name: string;
    status: string;
    responseTime: number;
  }>;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  lastCheck: string;
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  affectedServices: string[];
  createdAt: string;
}

export interface SettingsUpdate {
  value: any;
  reason?: string;
}
```

---

API Service

```typescript
// services/SettingsService.ts
import apiClient from '../../api/client';
import type { 
  SystemSetting, FeatureFlag, Environment,
  SystemAlert, SystemHealth, MaintenanceWindow,
  SettingsUpdate
} from '../types/settings.types';

export const SettingsService = {
  // System Settings
  getSettings: async (category?: string): Promise<SystemSetting[]> => {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get(`/settings${params}`);
    return response.data;
  },

  getSetting: async (category: string, key: string): Promise<SystemSetting> => {
    const response = await apiClient.get(`/settings/${category}/${key}`);
    return response.data;
  },

  updateSetting: async (category: string, key: string, data: SettingsUpdate): Promise<SystemSetting> => {
    const response = await apiClient.put(`/settings/${category}/${key}`, data);
    return response.data;
  },

  // Feature Flags
  getFeatureFlags: async (): Promise<FeatureFlag[]> => {
    const response = await apiClient.get('/settings/feature-flags');
    return response.data.featureFlags;
  },

  getFeatureFlag: async (key: string): Promise<FeatureFlag> => {
    const response = await apiClient.get(`/settings/feature-flags/${key}`);
    return response.data;
  },

  toggleFeatureFlag: async (key: string, enabled: boolean): Promise<FeatureFlag> => {
    const response = await apiClient.post(`/settings/feature-flags/${key}/toggle?enabled=${enabled}`);
    return response.data;
  },

  // Environments
  getEnvironments: async (): Promise<Environment[]> => {
    const response = await apiClient.get('/settings/environments');
    return response.data.environments;
  },

  // Health
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await apiClient.get('/settings/health');
    return response.data;
  },

  // Alerts
  getAlerts: async (unresolvedOnly?: boolean): Promise<SystemAlert[]> => {
    const params = unresolvedOnly ? '?unresolved_only=true' : '';
    const response = await apiClient.get(`/settings/alerts${params}`);
    return response.data.alerts;
  },

  acknowledgeAlert: async (alertId: string): Promise<SystemAlert> => {
    const response = await apiClient.post(`/settings/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (alertId: string): Promise<SystemAlert> => {
    const response = await apiClient.post(`/settings/alerts/${alertId}/resolve`);
    return response.data;
  },
};
```

---

Custom Hook

```typescript
// hooks/useSettings.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { SettingsService } from '../services/SettingsService';

export const useSettings = (category?: string) => {
  const query = useQuery({
    queryKey: ['settings', category],
    queryFn: () => SettingsService.getSettings(category),
  });

  return {
    settings: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

export const useUpdateSetting = () => {
  const mutation = useMutation({
    mutationFn: ({ category, key, data }: { category: string; key: string; data: any }) =>
      SettingsService.updateSetting(category, key, data),
  });

  return {
    updateSetting: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useFeatureFlags = () => {
  const query = useQuery({
    queryKey: ['featureFlags'],
    queryFn: SettingsService.getFeatureFlags,
  });

  return {
    featureFlags: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

export const useToggleFeatureFlag = () => {
  const mutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      SettingsService.toggleFeatureFlag(key, enabled),
  });

  return {
    toggleFeatureFlag: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useSystemHealth = () => {
  const query = useQuery({
    queryKey: ['systemHealth'],
    queryFn: SettingsService.getSystemHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    health: query.data,
    isLoading: query.isLoading,
  };
};

export const useAlerts = (unresolvedOnly?: boolean) => {
  const query = useQuery({
    queryKey: ['alerts', unresolvedOnly],
    queryFn: () => SettingsService.getAlerts(unresolvedOnly),
  });

  return {
    alerts: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
```

---

Components

SettingsCategory.tsx

Tabbed interface for different setting categories.

SettingField.tsx

Individual setting field with edit capability.

FeatureFlagList.tsx

List of feature flags with toggle switches.

FeatureFlagToggle.tsx

Toggle switch for enabling/disabling features.

EnvironmentList.tsx

List of environments with health status.

SystemHealthDashboard.tsx

Real-time system health dashboard with metrics.

AlertList.tsx

List of system alerts with acknowledge/resolve actions.

MaintenanceSchedule.tsx

Maintenance window calendar and scheduling.

---

Main Page

```tsx
// SystemSettings.tsx
import { useState } from 'react';
import { useSettings, useFeatureFlags, useSystemHealth, useAlerts } from './hooks/useSettings';
import { SettingsCategory } from './components/SettingsCategory';
import { FeatureFlagList } from './components/FeatureFlagList';
import { SystemHealthDashboard } from './components/SystemHealthDashboard';
import { AlertList } from './components/AlertList';

export const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'features' | 'health' | 'alerts'>('general');
  
  const { settings: generalSettings } = useSettings('general');
  const { settings: securitySettings } = useSettings('security');
  const { featureFlags } = useFeatureFlags();
  const { health } = useSystemHealth();
  const { alerts } = useAlerts(true);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'features', label: 'Feature Flags' },
    { id: 'health', label: 'System Health' },
    { id: 'alerts', label: `Alerts (${alerts.length})` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">System Settings</h1>
        <p className="text-sm text-neutral-60 mt-1">Configure platform settings and monitor health</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-20">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'general' && (
          <SettingsCategory category="general" settings={generalSettings} />
        )}
        {activeTab === 'security' && (
          <SettingsCategory category="security" settings={securitySettings} />
        )}
        {activeTab === 'features' && (
          <FeatureFlagList featureFlags={featureFlags} />
        )}
        {activeTab === 'health' && (
          <SystemHealthDashboard health={health} />
        )}
        {activeTab === 'alerts' && (
          <AlertList alerts={alerts} />
        )}
      </div>
    </div>
  );
};
```

---

Acceptance Criteria

1. Settings categories display correctly
2. Setting fields edit and save properly
3. Feature flags toggle on/off
4. Feature flag rollout percentage adjusts
5. Environment list displays health status
6. System health dashboard shows real-time metrics
7. Alert list displays with severity colors
8. Alert acknowledgment works
9. Alert resolution works
10. Loading states display properly
11. Error handling shows appropriate messages
12. Responsive design works on mobile

---

Dependencies

040_System_Settings_API (backend endpoints)
Widget Framework (Prompt 007)
Theme System (Prompt 002)

---

Next Steps

After this prompt, all Administration prompts are complete.

Verify:
1. All database schemas created (031-035)
2. All backend APIs functional (036-040)
3. All frontend UIs working (041-045)
4. Integration tests pass
5. Build succeeds

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
