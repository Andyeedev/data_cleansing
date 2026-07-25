export interface Setting {
  id: string;
  category: string;
  key: string;
  value: unknown;
  description: string | null;
  data_type: string;
  is_readonly: boolean;
  tenant_scoped: boolean;
  updated_at: string;
}

export interface SettingUpdateRequest {
  value: unknown;
  description?: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string | null;
  key: string;
  enabled: boolean;
  rollout_percentage: number;
  status: string;
  created_at: string;
}

export interface FeatureFlagUpdateRequest {
  enabled?: boolean;
  rollout_percentage?: number;
}

export interface SettingsByCategory {
  [key: string]: unknown;
}
